package com.thaiglocal.server.dto.request;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
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
    @FutureOrPresent(message = "Start date must be in the present or future")
    private LocalDateTime startDate;

    @NotBlank(message = "End date is required")
    @Future(message = "End date must be in the future")
    private LocalDateTime endDate;

    private String description;

    @NotBlank(message = "Date can register is required")
    @Future(message = "Date can register must be in the future")
    private LocalDateTime dateCanRegister;

    @NotBlank(message = "Price is required")
    @Min(value = 0, message = "Price must be non-negative")
    private Double price;
    
    @NotBlank(message = "Register capacity is required")
    @Min(value = 1, message = "Register capacity must be at least 1")
    private Integer registerCapacity;
}
