package com.thaiglocal.server.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "centers")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Center {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long centerId;

    private String centerName;
    private String address;
    private String telephone;
    private String email;
    private String line;
    private String facebook;
    private String webSite;
    private String createdAt;
    private String deletedAt;
    private String leaderFirstName;
    private String leaderLastName;
    private String leaderTelephone;

    // relationship
    // one center can have many telephones
    @Builder.Default
    @OneToMany(mappedBy = "center", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Telephone> telephones = new ArrayList<>();

    // one center can have many centerBelongUsers (representing the users that belong to this center)
    @Builder.Default
    @OneToMany(mappedBy = "center", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CenterBelongUser> centerBelongUsers = new ArrayList<>();

    // one center can have many workshops
    @Builder.Default
    @OneToMany(mappedBy = "center", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Workshop> workshops = new ArrayList<>();



    // helper method
    // for bi-directional relationship management (Center <-> CenterBelongUser)
    public void addCenterBelongUser(CenterBelongUser centerBelongUser) {
        centerBelongUsers.add(centerBelongUser);
        centerBelongUser.setCenter(this);
    }

    public void removeCenterBelongUser(CenterBelongUser centerBelongUser) {
        centerBelongUsers.remove(centerBelongUser);
        centerBelongUser.setCenter(null);
    }

    // for bi-directional relationship management (Center <-> Telephone)
    public void addTelephone(Telephone telephone) {
        telephones.add(telephone);
        telephone.setCenter(this);
    }

    public void removeTelephone(Telephone telephone) {
        telephones.remove(telephone);
        telephone.setCenter(null);
    }

    // for bi-directional relationship management (Center <-> Workshop)
    public void addWorkshop(Workshop workshop) {
        workshops.add(workshop);
        workshop.setCenter(this);
    }

    public void removeWorkshop(Workshop workshop) {
        workshops.remove(workshop);
        workshop.setCenter(null);
    }
}
