package com.thaiglocal.server.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    // relationship
    // many center images can belong to one center
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "centerId")
    private Center center;
}
