package com.thaiglocal.server.model;

import java.util.List;

import java.util.ArrayList;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "workshops")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Workshop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long workshopId;

    private String workshopName;
    private String description;
    private Double price;
    private Integer memberCapacity;
    private String workshopType;

    // relationship
    // many workshops can belong to one center
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "centerId")
    private Center center;

    // one workshop can have many activities
    @Builder.Default
    @OneToMany(mappedBy = "workshop", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Activity> activities = new ArrayList<>();

    // one workshop can have many workshop images
    @Builder.Default
    @OneToMany(mappedBy = "workshop", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WorkshopImage> workshopImages = new ArrayList<>();

    // helper method
    // for bi-directional relationship management (Workshop <-> Activity)
    public void addActivity(Activity activity) {
        activities.add(activity);
        activity.setWorkshop(this);
    }

    public void removeActivity(Activity activity) {
        activities.remove(activity);
        activity.setWorkshop(null);
    }

    // for bi-directional relationship management (Workshop <-> WorkshopImage)
    public void addWorkshopImage(WorkshopImage workshopImage) {
        workshopImages.add(workshopImage);
        workshopImage.setWorkshop(this);
    }

    public void removeWorkshopImage(WorkshopImage workshopImage) {
        workshopImages.remove(workshopImage);
        workshopImage.setWorkshop(null);
    }
}
