package com.thaiglocal.server.dto.response;

import java.time.LocalDateTime;
import java.util.Date;

import com.thaiglocal.server.model.enums.RoleName;;

public record UserResponse(
    Long userId,
    String username,
    String email,
    String firstName,
    String lastName,    
    // String password,
    RoleName role,
    String telephone,
    String address,
    LocalDateTime birthDate,
    LocalDateTime createdAt,
    LocalDateTime deleteAt,
    Boolean isActive
) {
}
