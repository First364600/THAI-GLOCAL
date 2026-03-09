package com.thaiglocal.server.dto.response;

import com.thaiglocal.server.model.enums.PositionName;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffResponse {
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private PositionName position;
}
