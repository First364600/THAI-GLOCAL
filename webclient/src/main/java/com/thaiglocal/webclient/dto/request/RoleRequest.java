package com.thaiglocal.webclient.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.thaiglocal.webclient.dto.enums.RoleName;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RoleRequest(
    @NotNull
    RoleName role
) {
    
}
