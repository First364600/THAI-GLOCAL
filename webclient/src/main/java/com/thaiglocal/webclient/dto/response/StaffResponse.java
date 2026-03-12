package com.thaiglocal.webclient.dto.response;

import com.thaiglocal.webclient.dto.enums.PositionName;

public record StaffResponse(
        String username,
        String email,
        String firstName,
        String lastName,
        String phoneNumber,
        PositionName position) {
}
