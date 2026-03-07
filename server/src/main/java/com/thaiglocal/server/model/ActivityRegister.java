package com.thaiglocal.server.model;

import com.thaiglocal.server.model.enums.ActivityRegisterStatus;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "activity_registers")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityRegister {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long activityRegisterId;

    private Integer numberOfRegister;
    @Enumerated(EnumType.STRING)
    private ActivityRegisterStatus status;

    // relationship
    // many activityRegisters can belong to one user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    private User user;

    // many activityRegisters can belong to one activity
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activityId")
    private Activity activity;
}
