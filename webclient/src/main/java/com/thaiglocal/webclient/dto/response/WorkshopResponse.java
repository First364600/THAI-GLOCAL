package com.thaiglocal.webclient.dto.response;

public record WorkshopResponse(
    Long workshopId,
    String name,
    String description,
    String Timetable,
    Double price,
    Integer MemberCapacity
) {}
