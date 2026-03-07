package com.thaiglocal.server.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ActivityResponse {
    private Long activityId;

    private String activityName;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String description;
    private LocalDateTime dateCanRegister;
    private Double price;
    private Integer registerCapacity;
}
