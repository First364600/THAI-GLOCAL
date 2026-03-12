package com.thaiglocal.webclient.dto.request;

import java.time.LocalDateTime;
import java.util.Date;

import com.thaiglocal.webclient.dto.enums.RoleName;


public record UserRequest(
    // Long userId,
    String username,
    String email,
    String firstName,
    String lastName,    
    String password,
    RoleName role,
    String telephone,
    String address,
    LocalDateTime birthDate,
    // Date createdAt,
    // Date deleteAt,
    Boolean isActive
) {
}
