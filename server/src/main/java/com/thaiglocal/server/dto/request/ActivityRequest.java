package com.thaiglocal.server.dto.request;

import java.time.LocalDateTime;


import jakarta.validation.constraints.NotBlank;
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
public class ActivityRequest {
    @NotBlank(message = "Activity name is required")
    private String activityName;
    @NotBlank(message = "Start date is required")
    private LocalDateTime startDate;
    @NotBlank(message = "End date is required")
    private LocalDateTime endDate;
    private String description;
    @NotBlank(message = "Date can register is required")
    private LocalDateTime dateCanRegister;
    @NotBlank(message = "Price is required")
    private Double price;
    @NotBlank(message = "Register capacity is required")
    private Integer registerCapacity;
}
