package com.thaiglocal.webclient.dto.request;

import com.thaiglocal.webclient.dto.enums.ActivityRegisterStatus;

public class ActivityRegisterRequest {
    private Integer numberOfRegister;
    private ActivityRegisterStatus status; 
    private Long userId;
    private Long activityId;

    public ActivityRegisterRequest() {}

    public ActivityRegisterRequest(Integer numberOfRegister, ActivityRegisterStatus status, Long userId, Long activityId) {
        this.numberOfRegister = numberOfRegister;
        this.status = status;
        this.userId = userId;
        this.activityId = activityId;
    }

    public Integer getNumberOfRegister() { return numberOfRegister; }
    public void setNumberOfRegister(Integer numberOfRegister) { this.numberOfRegister = numberOfRegister; }

    public ActivityRegisterStatus getStatus() { return status; }
    public void setStatus(ActivityRegisterStatus status) { this.status = status; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getActivityId() { return activityId; }
    public void setActivityId(Long activityId) { this.activityId = activityId; }
}