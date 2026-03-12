package com.thaiglocal.webclient.dto.response;


import com.thaiglocal.webclient.dto.enums.ActivityRegisterStatus;

public record ActivityRegisterResponse(
        Long activityRegisterId,
        Long activityId,
        String activityName,
        String startDate,
        UserResponse user,
        String username,
        Integer numberOfRegister,
        ActivityRegisterStatus status,
        Double totalPrice) {
}