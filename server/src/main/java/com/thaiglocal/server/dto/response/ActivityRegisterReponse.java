package com.thaiglocal.server.dto.response;

import com.thaiglocal.server.model.enums.ActivityRegisterStatus;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ActivityRegisterReponse {
    private Long activityRegisterId;
    private String username;
    private Integer numberOfRegister;
    private ActivityRegisterStatus status;
}
