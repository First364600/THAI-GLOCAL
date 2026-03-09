package com.thaiglocal.webclient.dto.request;

import java.time.LocalDateTime;
import java.util.List;

public record CenterRequest(
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
                List<String> telephones) {
}
