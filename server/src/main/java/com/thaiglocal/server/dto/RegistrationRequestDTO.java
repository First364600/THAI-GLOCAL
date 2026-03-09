package com.thaiglocal.server.dto;

import com.thaiglocal.server.model.enums.RequestStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RegistrationRequestDTO {
    private Long id;
    private String centerName;
    private Long requesterId;
    private RequestStatus status;
    private String details;
    private LocalDateTime createdAt;
}



