package com.thaiglocal.server.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class CreateRegistrationRequestDTO {
    @NotBlank
    private String centerName;
    @NotNull
    private Long requesterId;
    private String details;
}



