package com.thaiglocal.server.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "activities")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long activityId;

    private String activityName;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String description;
    private LocalDateTime dateCanRegister;
    private Double price;
    private Integer registerCapacity;

    // Relationship
    // One activity can have many activityRegisters
    @Builder.Default
    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ActivityRegister> activityRegisters = new ArrayList<>();

    // many activities can belong to one workshop
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workshopId")
    private Workshop workshop;

    // helper method
    // for bi-directional relationship management (Activity <-> ActivityRegister)
    public void addActivityRegister(ActivityRegister activityRegister) {
        activityRegisters.add(activityRegister);
        activityRegister.setActivity(this);
    }

    public void removeActivityRegister(ActivityRegister activityRegister) {
        activityRegisters.remove(activityRegister);
        activityRegister.setActivity(null);
    }
}
