package com.thaiglocal.server.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

import com.thaiglocal.server.model.enums.RoleName;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    private String username;
    private String password;
    private String email;
    private String firstName;
    private String lastName;
    
    @Enumerated(EnumType.STRING)
    private RoleName role;
    private String telephone;
    private String address;
    private LocalDateTime birthdate;
    private LocalDateTime createdAt;
    private LocalDateTime deletedAt;

    // relationship
    // one user can belong to many centers (through CenterBelongUser)
    @Builder.Default
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CenterBelongUser> centerBelongUsers = new ArrayList<>();

    // one user can have many activityRegisters
    @Builder.Default
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ActivityRegister> activityRegisters = new ArrayList<>();

    // helper method
    // for bi-directional relationship management (User <-> CenterBelongUser)
    public void addCenterBelongUser(CenterBelongUser centerBelongUser) {
        centerBelongUsers.add(centerBelongUser);
        centerBelongUser.setUser(this);
    }

    public void removeCenterBelongUser(CenterBelongUser centerBelongUser) {
        centerBelongUsers.remove(centerBelongUser);
        centerBelongUser.setUser(null);
    }

    // for bi-directional relationship management (User <-> ActivityRegister)
    public void addActivityRegister(ActivityRegister activityRegister) {
        activityRegisters.add(activityRegister);
        activityRegister.setUser(this);
    }

    public void removeActivityRegister(ActivityRegister activityRegister) {
        activityRegisters.remove(activityRegister);
        activityRegister.setUser(null);
    }
}
