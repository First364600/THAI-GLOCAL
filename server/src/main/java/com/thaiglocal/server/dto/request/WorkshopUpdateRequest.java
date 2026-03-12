package com.thaiglocal.server.dto.request;
import java.util.List;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class WorkshopUpdateRequest {
    @NotBlank(message = "Workshop name is required")
    private String workshopName;
    private String description;

    @NotNull(message = "Workshop type is required")
    @Min(value = 0, message = "Price must be non-negative")
    private Double price;

    @NotNull(message = "Member capacity is required")
    @Min(value = 1, message = "Member capacity must be at least 1")
    private Integer memberCapacity;

    @NotBlank(message = "Workshop type is required")
    private String workshopType;

    @NotNull(message = "Center ID is required")
    private Long centerId;
    
    private List<String> workshopImages;
}
