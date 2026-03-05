package com.thaiglocal.server.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "community_admins")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@PrimaryKeyJoinColumn(name = "userId")
public class CommunityAdmin extends User {

    // Relationship with Community
    @Builder.Default
    @OneToMany(mappedBy = "communityAdmin", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Community> communities = new ArrayList<>();

    // Helper method
    // add community to community admin and set the community admin reference in community
    public void addCommunity(Community community) {
        communities.add(community);
        community.setCommunityAdmin(this);
    }

    // remove community from community admin and set the community admin reference in community to null
    public void removeCommunity(Community community) {
        communities.remove(community);
        community.setCommunityAdmin(null);
    }
}
