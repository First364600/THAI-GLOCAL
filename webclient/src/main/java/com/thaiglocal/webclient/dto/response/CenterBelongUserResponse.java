package com.thaiglocal.webclient.dto.response;

import com.thaiglocal.webclient.dto.enums.PositionName;

public record CenterBelongUserResponse(
    Long centerBelongUserId,
    Long userId,
    Long centerId,
    PositionName position
) {}
