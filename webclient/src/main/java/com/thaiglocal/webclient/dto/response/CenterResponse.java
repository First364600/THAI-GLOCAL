package com.thaiglocal.webclient.dto.response;

import java.time.LocalDateTime;

public record CenterResponse(
    Long centerId,
    String name,
    String address,
    String tel,
    String email,
    String line,
    String facebook,
    String website,
    LocalDateTime createdAt,
    LocalDateTime deletedAt,
    String leaderFirstName,
    String leaderLastName,
    String leaderTel
) {}