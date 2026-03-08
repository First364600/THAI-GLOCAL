package com.thaiglocal.server.service;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.hibernate.jdbc.Expectation.RowCount;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.thaiglocal.server.dto.request.SignInRequest;
import com.thaiglocal.server.dto.request.SignUpRequest;
import com.thaiglocal.server.dto.request.UserRequest;
import com.thaiglocal.server.dto.response.SignInResponse;
import com.thaiglocal.server.dto.response.UserResponse;
import com.thaiglocal.server.model.User;
import com.thaiglocal.server.model.enums.RoleName;
import com.thaiglocal.server.repository.UserRepository;
import com.thaiglocal.server.security.CustomUserDetails;
import com.thaiglocal.server.security.JwtUtils;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // login
    public SignInResponse signIn(SignInRequest request) {
        String loginId = request.getUsernameOrEmail();

        User user = userRepository.findByUsernameOrEmail(loginId, loginId)
            .orElseThrow(() -> new RuntimeException("User not found."));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid Username, Email or Password");
        }

        String role = user.getRole() != null ? user.getRole().toString() : "USER";
        String accessToken = jwtUtils.generateAccessToken(user.getUserId(), role);
        String refreshToken = jwtUtils.generateRefreshToken(user.getUserId());

        return new SignInResponse(
            mapToUserResponse(user),
            accessToken,
            refreshToken
        );
    }

    public String signUp(SignUpRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken.");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered.");
        }

        // create user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setTelephone(request.getTelephone());
        user.setAddress(request.getAddress());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setBirthDate(request.getBirthDate());
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);
        return "User registered successfully";
    }

    public UserResponse updateUser(Long userId, UserRequest request) {
        User existingUser = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Invalid user Id."));
        
            // การกรองว่า admin ปกติ ไม่สามารถแก้ไขข้อมูลของ system admin ได้
            // ผู้ใช้แก้ไขข้อมูลของ admin ไม่ได้            
        if (request.username() != null && !request.username().isBlank()) {
            existingUser.setUsername(request.username());
        }
        if (request.email() != null && !request.email().isBlank()) {
            existingUser.setEmail(request.email());
        }
        if (request.firstName() != null && !request.firstName().isBlank()) {
            existingUser.setFirstName(request.firstName());
        }
        if (request.lastName() != null && !request.lastName().isBlank()) {
            existingUser.setLastName(request.lastName());
        }
        if (request.telephone() != null && !request.telephone().isBlank()) {
            existingUser.setTelephone(request.telephone());
        }
        if (request.address() != null && !request.address().isBlank()) {
            existingUser.setAddress(request.address());
        }
        if (request.birthDate() != null) {
            existingUser.setBirthDate(request.birthDate().toLocalDate().atStartOfDay());
        }
        if (request.isActive() != null) {
            existingUser.setIsActive(request.isActive());
        }

        userRepository.save(existingUser);

        return mapToUserResponse(existingUser);
    }

    public UserResponse grantAdminRole(Long userId, RoleName privilage) {
        User existingUser = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Invalid user Id."));

        if (existingUser.getRole().equals(RoleName.SYSTEM_ADMIN)) {
            throw new RuntimeException("System Admin cannot changed role.");
        }
        
        existingUser.setRole(privilage);

        userRepository.save(existingUser);
        return mapToUserResponse(existingUser);
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Invalid user id"));

        return mapToUserResponse(user);
    }

    public List<UserResponse> getAllUser() {
        List<User> users = userRepository.findAll();
        
        return users.stream().map(user -> {
            return mapToUserResponse(user);
        }).toList();
    }

    private UserResponse mapToUserResponse(User user) {
        return new UserResponse(
            user.getUserId(),
            user.getUsername(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getRole(),
            user.getTelephone(),
            user.getAddress(),
            user.getBirthDate(),
            user.getCreatedAt(),
            user.getDeleteAt(),
            user.getIsActive()
        );
    }

    // update user (patch) /
    // delete user (delete) /
    // get user data (get) /
    
    // jwt use userId, role, expired, create at, create from
}
