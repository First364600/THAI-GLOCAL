package com.thaiglocal.webclient.dto.response;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.thaiglocal.webclient.dto.enums.RoleName;

public record UserResponse(
    @JsonProperty("userId") Long userId,
    @JsonProperty("username") String username,
    @JsonProperty("email") String email,
    @JsonProperty("firstName") String firstName,
    @JsonProperty("lastName") String lastName,
    @JsonProperty("role") RoleName role,
    @JsonProperty("telephone") String telephone,
    @JsonProperty("address") String address,
    @JsonProperty("birthDate") LocalDateTime birthDate,
    @JsonProperty("createdAt") LocalDateTime createdAt,
    @JsonProperty("deleteAt") LocalDateTime deleteAt,
    @JsonProperty("isActive") Boolean isActive
) {
}
