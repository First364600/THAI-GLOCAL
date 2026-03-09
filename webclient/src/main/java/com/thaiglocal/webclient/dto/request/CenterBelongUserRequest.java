package com.thaiglocal.webclient.dto.request;

import com.thaiglocal.webclient.dto.enums.PositionName;

public record CenterBelongUserRequest(
        Long userId,
        Long centerId,
        PositionName position) {
}
