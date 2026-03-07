package com.thaiglocal.server.dto.request;

import java.util.List;

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
public class WorkshopCreateRequest {
    @NotBlank(message = "Workshop name is required")
    private String workshopName;
    private String description;
    @NotBlank(message = "Workshop type is required")
    private Double price;
    @NotBlank(message = "Member capacity is required")
    private Integer memberCapacity;
    @NotBlank(message = "Workshop type is required")
    private String workshopType;
    @NotBlank(message = "Center ID is required")
    private Long centerId;
    private List<String> workshopImages;
    private List<ActivityRequest> activities;
}
