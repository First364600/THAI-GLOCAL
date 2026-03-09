package com.thaiglocal.server.dto.request;


import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityRegisterRequest {
    @NotNull(message = "Activity ID is required")
    @Min(value = 1, message = "Number of register must be at least 1")
    private Integer numberOfRegister;
}
