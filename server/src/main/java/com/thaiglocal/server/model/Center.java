package com.thaiglocal.server.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.thaiglocal.server.model.enums.CenterStatus;

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
    private String description;
    private String address;
    private String subDistrict;
    private String district;
    private String province;
    private String googleMapLink;
    private String email;
    private String line;
    private String facebook;
    private String webSite;
    @CreationTimestamp
    private LocalDateTime createdAt;
    private LocalDateTime deletedAt;
    private String leaderFirstName;
    private String leaderLastName;
    private String leaderTelephone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private CenterStatus status = CenterStatus.PENDING;

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

    // one center can have many center images
    @Builder.Default
    @OneToMany(mappedBy = "center", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CenterImage> centerImages = new ArrayList<>();

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

    // for bi-directional relationship management (Center <-> CenterImage)
    public void addCenterImage(CenterImage centerImage) {
        centerImages.add(centerImage);
        centerImage.setCenter(this);
    }

    public void removeCenterImage(CenterImage centerImage) {
        centerImages.remove(centerImage);
        centerImage.setCenter(null);
    }
}
