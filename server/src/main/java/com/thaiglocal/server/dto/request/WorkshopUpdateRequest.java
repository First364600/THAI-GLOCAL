package com.thaiglocal.server.dto.request;
import java.util.List;

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
    private String workshopName;
    private String description;
    private Double price;
    private Integer memberCapacity;
    private String workshopType;
    private Long centerId;
    private List<String> workshopImages;
}
