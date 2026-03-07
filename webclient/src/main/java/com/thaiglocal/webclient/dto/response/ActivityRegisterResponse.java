package com.thaiglocal.webclient.dto.response;

import com.thaiglocal.webclient.dto.enums.ActivityRegisterStatus;

public record ActivityRegisterResponse(
    Long activityRegisterId,
    Integer numberOfRegister,
    ActivityRegisterStatus status,
    Long userId,
    Long activityId
) {}