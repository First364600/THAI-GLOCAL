package com.thaiglocal.webclient.dto.request;

import com.thaiglocal.webclient.dto.enums.PositionName;

public class CenterBelongUserRequest {
    private Long userId;
    private Long centerId;
    private PositionName position;

    public CenterBelongUserRequest() {}

    public CenterBelongUserRequest(Long userId, Long centerId, PositionName position) {
        this.userId = userId;
        this.centerId = centerId;
        this.position = position;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getCenterId() { return centerId; }
    public void setCenterId(Long centerId) { this.centerId = centerId; }

    public PositionName getPosition() { return position; }
    public void setPosition(PositionName position) { this.position = position; }
}
