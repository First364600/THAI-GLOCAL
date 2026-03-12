package com.thaiglocal.webclient.dto.request;

import lombok.Data;

@Data
public class CreateRegistrationRequest {
    private String centerName;
    private Long requesterId;
    private String details;
}



