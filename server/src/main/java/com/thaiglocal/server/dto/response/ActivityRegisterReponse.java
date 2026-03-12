package com.thaiglocal.server.dto.response;

import com.thaiglocal.server.model.User;
import com.thaiglocal.server.model.enums.ActivityRegisterStatus;

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
public class ActivityRegisterReponse {
    private Long activityRegisterId;
    private Long activityId;
    private String activityName;
    private String startDate;
    private User user;
    private String username;
    private Integer numberOfRegister;
    private ActivityRegisterStatus status;
    private double totalPrice;
}
