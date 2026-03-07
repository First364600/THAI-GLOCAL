package com.thaiglocal.server.dto.request;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
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
    @Email(message = "Invalid email format")
    private String email;
    private String line;
    private String facebook;
    private String webSite;
    private LocalDateTime createdAt;
    private String leaderFirstName;
    private String leaderLastName;
    private String leaderTelephone;
    private List<String> centerImages;
    private List<String> telephones;
}
