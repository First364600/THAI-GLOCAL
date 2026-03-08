package com.thaiglocal.server.dto.response;

import com.thaiglocal.server.model.User;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SignInResponse {
    // private Long userId;
    // private String username;
    // private String email;
    // private String role;
    // Barear
    // private String tokenType;
    private UserResponse userResponse;
    private String accessToken;
    private String refreshToken;
}

