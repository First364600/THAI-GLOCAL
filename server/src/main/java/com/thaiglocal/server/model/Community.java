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
@Table(name = "communities")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Community {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long communityId;
    private String name;
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "communityAdminId", nullable = false)
    private CommunityAdmin communityAdmin;

    @Builder.Default
    @OneToMany(mappedBy = "community", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Activity> activities = new ArrayList<>();

    // Helper method
    // add activity to community and set the community reference in activity
    public void addActivity(Activity activity) {
        activities.add(activity);
        activity.setCommunity(this);
    }

    // remove activity from community and set the community reference in activity to null
    public void removeActivity(Activity activity) {
        activities.remove(activity);
        activity.setCommunity(null);
    }
}
