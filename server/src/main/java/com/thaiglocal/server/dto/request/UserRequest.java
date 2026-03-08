package com.thaiglocal.server.dto.request;

import java.time.LocalDateTime;
import com.thaiglocal.server.model.enums.RoleName;;

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
