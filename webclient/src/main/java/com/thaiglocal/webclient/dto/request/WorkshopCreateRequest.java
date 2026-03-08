package com.thaiglocal.webclient.dto.request;

import java.util.List;

public record WorkshopCreateRequest(
        String workshopName,
        String description,
        Double price,
        Integer memberCapacity,
        String workshopType,
        Long centerId,
        List<String> workshopImages,
        List<ActivityRequest> activities) {
}
