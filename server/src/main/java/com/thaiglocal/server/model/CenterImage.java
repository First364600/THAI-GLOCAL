package com.thaiglocal.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "center_images")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CenterImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long centerImageId;

    private String imageUrl;

    // relationship
    // many center images can belong to one center
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "centerId")
    private Center center;
}
