package com.thaiglocal.webclient.dto.request;

import java.time.LocalDateTime;

public record ActivityRequest(
        String activityName,
        String description,
        LocalDateTime startDate,
        LocalDateTime endDate,
        LocalDateTime dateCanRegister,
        Double price,
        Integer registerCapacity) {
}
