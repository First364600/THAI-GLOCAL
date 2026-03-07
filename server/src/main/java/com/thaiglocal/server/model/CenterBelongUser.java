package com.thaiglocal.server.model;

import com.thaiglocal.server.model.enums.PositionName;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "center_belong_user")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CenterBelongUser {
    @Id
    @GeneratedValue (strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long centerBelongUserId;
    @Enumerated(EnumType.STRING)
    private PositionName position;


    // relationship
    // many centerBelongUsers can belong to one user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    private User user;

    // many centerBelongUsers can belong to one center
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "centerId")
    private Center center;
}
