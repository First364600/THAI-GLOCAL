package com.thaiglocal.server.dto.response;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class CenterResponse {
    private Long centerId;
    private String centerName;
    private String description;
    private String address;
    private String subDistrict;
    private String district;
    private String province;
    private String googleMapLink;
    private String telephone;
    private String email;
    private String line;
    private String facebook;
    private String webSite;
    private LocalDateTime createdAt;
    private String leaderFirstName;
    private String leaderLastName;
    private String leaderTelephone;
}
