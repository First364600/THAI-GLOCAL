package com.thaiglocal.webclient.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.thaiglocal.webclient.dto.request.*;
import com.thaiglocal.webclient.dto.response.*;
import com.thaiglocal.webclient.service.UserService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Controller
@RequestMapping("/api")
@AllArgsConstructor
public class UserController {

    @Autowired
    private final UserService userService;

    @PostMapping("/signin")
    public Mono<ResponseEntity<UserResponse>> signIn(@Valid @RequestBody SignInRequest request) {
        return userService.signIn(request)
            .map(s -> s.getUserResponse())
            .map(ResponseEntity::ok);
    }

    @PostMapping("/signup")
    public Mono<ResponseEntity<UserResponse>> signUp(@Valid @RequestBody SignUpRequest request) {
        return userService.signUp(request)
            .map(ResponseEntity::ok);
    }

    @PostMapping("/signout")
    public Mono<ResponseEntity<String>> signOut() {
        return userService.signOut()
            .map(ResponseEntity::ok);
    }

    @GetMapping("/users/me")
    public Mono<ResponseEntity<UserResponse>> getMyProfile() {
        return userService.getMyProfile()
            .map(ResponseEntity::ok);
    }

    @PatchMapping("/users/me")
    public Mono<ResponseEntity<UserResponse>> updateUser(@Valid @RequestBody UserRequest request) {
        return userService.updateUser(request)
            .map(ResponseEntity::ok);
    }

    @GetMapping("/admin/users")
    public Flux<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    @PatchMapping("/admin/users/{id}")
    public Mono<ResponseEntity<UserResponse>> adminUpdateUserByUserId(
        @PathVariable("id") Long id,
        @Valid @RequestBody UserRequest request) {
        return userService.adminUpdateUserByUserId(id, request)
            .map(ResponseEntity::ok);
    }

    @PatchMapping("/admin/users/role/{id}")
    public Mono<ResponseEntity<UserResponse>> grantAdminRole(
        @PathVariable("id") Long id,
        @Valid @RequestBody RoleRequest request) {
        return userService.grantAdminRole(id, request)
            .map(ResponseEntity::ok);
    }

    @PostMapping("/forget-password")
    public Mono<ResponseEntity<String>> forgetPassword(@Valid @RequestBody ForgetPasswordRequest request) {
        return userService.forgetPassword(request)
            .map(ResponseEntity::ok);
    }
}