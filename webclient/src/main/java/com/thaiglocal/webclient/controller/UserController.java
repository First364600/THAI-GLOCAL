package com.thaiglocal.webclient.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.thaiglocal.webclient.dto.request.*;
import com.thaiglocal.webclient.dto.response.*;
import com.thaiglocal.webclient.service.UserService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/client/users")
@AllArgsConstructor
public class UserController {

    @Autowired
    private final UserService userService;

    @PostMapping("/signin")
    public Mono<ResponseEntity<SignInResponse>> signIn(@Valid @RequestBody SignInRequest request) {
        return userService.signIn(request)
            .map(ResponseEntity::ok);
    }

    @PostMapping("/signup")
    public Mono<ResponseEntity<UserResponse>> signUp(@Valid @RequestBody SignUpRequest request) {
        return userService.signUp(request)
            .map(ResponseEntity::ok);
    }

    @PostMapping("/signout")
    public Mono<ResponseEntity<String>> signOut() {
        // Clear browser httpOnly cookies regardless of server response
        ResponseCookie clearAccess = ResponseCookie.from("ACCESS_TOKEN", "")
            .httpOnly(true).secure(false).sameSite("Lax").path("/").maxAge(0).build();
        ResponseCookie clearRefresh = ResponseCookie.from("REFRESH_TOKEN", "")
            .httpOnly(true).secure(false).sameSite("Lax").path("/").maxAge(0).build();

        return userService.signOut()
            .map(msg -> ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, clearAccess.toString())
                .header(HttpHeaders.SET_COOKIE, clearRefresh.toString())
                .body(msg))
            .onErrorReturn(ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, clearAccess.toString())
                .header(HttpHeaders.SET_COOKIE, clearRefresh.toString())
                .body("Signed out"));
    }

    @GetMapping("/me")
    public Mono<ResponseEntity<UserResponse>> getMyProfile() {
        return userService.getMyProfile()
            .map(ResponseEntity::ok);
    }

    @PatchMapping("/me")
    public Mono<ResponseEntity<UserResponse>> updateUser(@Valid @RequestBody UserRequest request) {
        return userService.updateUser(request)
            .map(ResponseEntity::ok);
    }

    @GetMapping("/admin")
    public Flux<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    @PatchMapping("/admin/{id}")
    public Mono<ResponseEntity<UserResponse>> adminUpdateUserByUserId(
        @PathVariable("id") Long id,
        @Valid @RequestBody UserRequest request) {
        return userService.adminUpdateUserByUserId(id, request)
            .map(ResponseEntity::ok);
    }

    @PatchMapping("/admin/role/{id}")
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

    @DeleteMapping("/admin/{id}")
    public Mono<ResponseEntity<Void>> deleteUser(@PathVariable Long id) {
        return userService.deleteUser(id)
                .thenReturn(ResponseEntity.noContent().build());
    }
}
