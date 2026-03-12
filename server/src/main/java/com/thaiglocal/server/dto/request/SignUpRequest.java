package com.thaiglocal.server.dto.request;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class SignUpRequest {
    @NotBlank(message = "Username is required.")
    @JsonProperty("username")
    private String username;

    @NotBlank(message = "Email is required.")
    @JsonProperty("email")
    @Email
    private String email;

    @NotBlank(message = "Password is required.")
    @JsonProperty("password")
    private String password;

    @JsonProperty("firstName")
    private String firstName;

    @JsonProperty("lastName")
    private String lastName;

    @JsonProperty("telephone")
    private String telephone;

    @JsonProperty("address")
    private String address;

    @JsonProperty("birthDate")
    private LocalDateTime birthDate;
}
