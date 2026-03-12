package com.thaiglocal.server.dto;

import com.thaiglocal.server.model.enums.RequestStatus;
import lombok.Data;
import jakarta.validation.constraints.NotNull;

@Data
public class UpdateRegistrationRequestStatusDTO {
    @NotNull
    private RequestStatus status;
}



