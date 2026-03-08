package com.thaiglocal.server.model;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import java.util.ArrayList;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.thaiglocal.server.model.enums.RoleName;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
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

    @Column(nullable = false, length = 150)
    private String username;

    @Email
    @Column(nullable = false)
    private String email;

    @Column
    private String firstName;

    @Column
    private String lastName;
    
    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column
    private RoleName role = RoleName.USER;

    @Column
    private String telephone;

    @Column
    private String address;

    @Column
    private LocalDateTime birthDate;

    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column 
    private LocalDateTime deleteAt;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isActive = true;

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
