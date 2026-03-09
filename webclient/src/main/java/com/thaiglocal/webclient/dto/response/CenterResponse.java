package com.thaiglocal.webclient.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public record CenterResponse(
                Long centerId,
                String centerName,
                String description,
                String address,
                String subDistrict,
                String district,
                String province,
                String googleMapLink,
                String email,
                String line,
                String facebook,
                String webSite,
                LocalDateTime createdAt,
                String leaderFirstName,
                String leaderLastName,
                String leaderTelephone,
                List<String> centerImages,
                List<String> telephones,
                List<StaffResponse> staffResponses) {
}