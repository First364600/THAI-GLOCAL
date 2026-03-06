package com.thaiglocal.server.dto.request;

import java.time.LocalDateTime;

import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class CenterRequest {
    @NotBlank(message = "Center name is required")
    private String centerName;
    private String description;
    private String subDistrict;
    private String district;
    private String province;
    private String googleMapLink;
    @NotBlank(message = "Address is required")
    private String address;
    @NotBlank(message = "Telephone is required")
    private String telephone;
    @Email(message = "Invalid email format")
    private String email;
    private String line;
    private String facebook;
    private String webSite;
    private LocalDateTime createdAt;
    private String leaderFirstName;
    private String leaderLastName;
    private String leaderTelephone;
}
