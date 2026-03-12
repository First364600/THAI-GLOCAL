package com.thaiglocal.server.controller;

import java.io.IOException;
import java.time.Duration;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thaiglocal.server.dto.request.ForgetPasswordRequest;
import com.thaiglocal.server.dto.request.RoleRequest;
import com.thaiglocal.server.dto.request.SignInRequest;
import com.thaiglocal.server.dto.request.SignUpRequest;
import com.thaiglocal.server.dto.request.UserRequest;
import com.thaiglocal.server.dto.response.SignInResponse;
import com.thaiglocal.server.dto.response.UserResponse;
import com.thaiglocal.server.model.enums.RoleName;
import com.thaiglocal.server.security.CustomUserDetails;
import com.thaiglocal.server.service.UserService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api")
public class UserController {    
    @Autowired
    private UserService userService;

    private final static String ACCESS_TOKEN = "ACCESS_TOKEN";
    private final static String REFRESH_TOKEN = "REFRESH_TOKEN";

    /**
     * Sign in user.
     * POST /api/signin
     * 
     * Request body:
     * {
     *   "usernameOrEmail": "string",
     *   "password": "string"
     * }
     * 
     * @param request SignInRequest
     * @param eResponse HttpServletResponse
     * @return ResponseEntity with user info and set cookies
     * @throws IOException
     */
    @PostMapping("/signin")
    public ResponseEntity<?> signIn(
        @Valid @RequestBody SignInRequest request,
        HttpServletResponse eResponse
    ) throws IOException {
        SignInResponse response = userService.signIn(request);


        ResponseCookie accessCookie = ResponseCookie.from(ACCESS_TOKEN, response.getAccessToken())
            .httpOnly(true)
            .secure(false)
            .sameSite("Lax")
            .path("/")
            .maxAge(Duration.ofMinutes(15))
            .build();

        ResponseCookie refreshCookie = ResponseCookie.from(REFRESH_TOKEN, response.getRefreshToken())
            .httpOnly(true)
            .secure(false)
            .sameSite("Lax")
            .path("/")
            .maxAge(Duration.ofDays(7))
            .build();

        eResponse.addHeader("Set-Cookie", accessCookie.toString());
        eResponse.addHeader("Set-Cookie", refreshCookie.toString());
        return ResponseEntity.ok(response);
    }
    
    /**
     * Sign up new user.
     * POST /api/signup
     * 
     * Request body:
     * {
     *   "username": "string",
     *   "email": "string",
     *   "password": "string",
     *   "firstName": "string",
     *   "lastName": "string",
     *   "telephone": "string",
     *   "birthDate": "2023-01-01",
     *   "address": "string"
     * }
     * 
     * @param request SignUpRequest
     * @param eResponse HttpServletResponse
     * @return ResponseEntity with success message
     * @throws IOException
     */
    @PostMapping("/signup")
    public ResponseEntity<UserResponse> signUp(
        @Valid @RequestBody SignUpRequest request,
        HttpServletResponse eResponse
    ) throws IOException {
        UserResponse userResponse = userService.signUp(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(userResponse);
    }

    /**
     * Sign out user.
     * POST /api/signout
     * 
     * No request body.
     * 
     * @param eResponse HttpServletResponse
     * @return ResponseEntity with sign out message
     */
    @PostMapping("/signout")
    public ResponseEntity<String> signOut(
        @AuthenticationPrincipal CustomUserDetails currentUser,
        HttpServletResponse eResponse
    ) {
        ResponseCookie accessCookie = ResponseCookie.from(ACCESS_TOKEN, "")
            .httpOnly(true)
            .secure(true)
            .sameSite("Strict")
            .path("/")
            .maxAge(Duration.ofMinutes(0))
            .build();

        ResponseCookie refreshCookie = ResponseCookie.from(REFRESH_TOKEN, "")
            .httpOnly(true)
            .secure(true)
            .sameSite("Strict")
            .path("/")
            .maxAge(Duration.ofDays(0))
            .build();

        eResponse.addHeader("Set-Cookie", accessCookie.toString());
        eResponse.addHeader("Set-Cookie", refreshCookie.toString());
        return ResponseEntity.ok("Sign out successful.");
    }

    /**
     * Request password reset code.
     * POST /api/forget-password
     * 
     * Request body:
     * {
     *   "email": "user@example.com"
     * }
     * 
     * @param request ForgetPasswordRequest
     * @return ResponseEntity with status message
     */
    @PostMapping("/forget-password")
    public ResponseEntity<String> forgetPassword (
        @Valid @RequestBody ForgetPasswordRequest request
    ) {
        userService.forgetPassword(request.getEmail());
        return ResponseEntity.ok("New password has been sent to your email");
    }


    /**
     * Reset password with verification code.
     * POST /api/reset-password
     * 
     * Request body:
     * {
     *   "email": "user@example.com",
     *   "code": "123456",
     *   "newPassword": "NewPassword@123"
     * }
     * 
     * @param request VerifyAndResetPasswordRequest
     * @return ResponseEntity with status message
     */
    // @PostMapping("/reset-password")
    // public ResponseEntity<String> resetPassword(
    //     @Valid @RequestBody ResetPasswordRequest request
    // ) {
    //     userService.resetPassword(request.getToken(), request.getNewPassword());
    //     return ResponseEntity.ok("Password reset successful");
    // }

    /**
     * Get current user's profile.
     * GET /api/users/me
     * 
     * No request body.
     * 
     * @return ResponseEntity with user profile
     */
    @GetMapping("/users/me")
    public ResponseEntity<UserResponse> getMyProfile(
        @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        Long userId = currentUser.getId();
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    /**
     * Update current user's profile.
     * PATCH /api/users/me
     * 
     * Request body:
     * {
     *   // fields to update
     * }
     * 
     * @param request UserRequest
     * @param bindingResult BindingResult
     * @return ResponseEntity with updated user profile
     * @throws IOException
     */
    @PatchMapping("/users/me")
    public ResponseEntity<?> updateUser(
        @AuthenticationPrincipal CustomUserDetails currentUser,
        @Valid @RequestBody UserRequest request
    ) throws IOException {
        UserResponse userResponse = userService.updateUser(currentUser.getId(), request);
        return ResponseEntity.ok(userResponse);
    }

    /**
     * Admin: Update user by ID.
     * PATCH /api/admin/users/{id}
     * 
     * Request body:
     * {
     *   // fields to update
     * }
     * 
     * @param id User ID
     * @param request UserRequest
     * @return ResponseEntity with updated user profile
     */
    @PatchMapping("/admin/users/{id}")
    public ResponseEntity<?> adminUpdateUserByUserId(
        @AuthenticationPrincipal CustomUserDetails currentUser,
        @PathVariable Long id,
        @Valid @RequestBody UserRequest request
    ) { 
        UserResponse userResponse = userService.updateUser(id, request);
        return ResponseEntity.ok(userResponse);
    }

    /**
     * Admin: Get all users.
     * GET /api/admin/users
     * 
     * No request body.
     * 
     * @return ResponseEntity with list of users
     */
    @GetMapping("/admin/users")
    public ResponseEntity<List<UserResponse>> getAllUsers(
        @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        List<UserResponse> users = userService.getAllUser();
        return ResponseEntity.ok(users);
    }

    /**
     * System admin: Grant admin role to user.
     * PATCH /api/admin/users/role/{id}
     * 
     * Request body:
     * {
     *   "role": "SUPER_ADMIN" // or other RoleName
     * }
     * 
     * @param id User ID
     * @param roleRequest RoleRequest
     * @return ResponseEntity with updated user profile
     */
    @PatchMapping("/admin/users/role/{id}")
    public ResponseEntity<UserResponse> grantAdminRole(
        @PathVariable Long id,
        @Valid @RequestBody RoleRequest roleRequest
    ) {
        UserResponse userResponse = userService.grantAdminRole(id, RoleName.valueOf(roleRequest.role()));

        return ResponseEntity.ok(userResponse);
    }


    @DeleteMapping("/admin/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
