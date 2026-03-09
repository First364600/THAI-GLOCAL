package com.thaiglocal.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "workshop_images")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkshopImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long workshopImageId;

    private String imageUrl;

    // relationship
    // many workshop images can belong to one workshop
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workshopId")
    private Workshop workshop;
}
