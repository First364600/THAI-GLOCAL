package com.thaiglocal.webclient.dto.response;

import java.time.LocalDateTime;

public record ActivityResponse(
    Long activityId,
    String activityName,
    LocalDateTime startDate,
    LocalDateTime endDate,
    String description,
    LocalDateTime dateCanRegister,
    Double price,
    Integer registerCapacity
) {}