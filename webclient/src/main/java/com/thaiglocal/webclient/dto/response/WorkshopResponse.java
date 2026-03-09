package com.thaiglocal.webclient.dto.response;

import java.util.List;

public record WorkshopResponse(
        Long workshopId,
        String workshopName,
        String description,
        Double price,
        Integer memberCapacity,
        String workshopType,
        List<String> workshopImages,
        List<ActivityResponse> activities) {
}
