package com.thaiglocal.webclient.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RegistrationRequestResponse {
    private Long id;
    private String centerName;
    private Long requesterId;
    private String status;
    private String details;
    private LocalDateTime createdAt;
}



