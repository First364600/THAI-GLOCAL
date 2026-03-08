package com.thaiglocal.server.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.thaiglocal.server.model.User;
import com.thaiglocal.server.repository.UserRepository;

import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;


    @Override
    public UserDetails loadUserByUsername(String signinInput) throws UsernameNotFoundException {
        User user = userRepository.findByUsernameOrEmail(signinInput, signinInput)
            .orElseThrow(() -> new UsernameNotFoundException("Username or Email: " + signinInput + " not found."));
            return new CustomUserDetails(user);
    }
    
    public UserDetails loadUserByUserId(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Invalid user id."));

        return new CustomUserDetails(user);
    }
}
