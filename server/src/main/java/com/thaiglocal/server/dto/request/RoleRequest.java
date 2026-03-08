package com.thaiglocal.server.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RoleRequest(
    @NotNull @NotBlank 
    String role
) {
    
}
