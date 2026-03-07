package com.thaiglocal.server.dto.response;

import java.util.List;

import com.thaiglocal.server.model.Activity;
import com.thaiglocal.server.model.WorkshopImage;

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
public class WorkshopResponse {
    private Long workshopId;
    private String workshopName;
    private String description;
    private Double price;
    private Integer MemberCapacity;
    private String workshopType;
    private List<WorkshopImage> workshopImages;
    private List<Activity> activities;
}
