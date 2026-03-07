package com.thaiglocal.server.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thaiglocal.server.model.Workshop;

@Repository
public interface WorkshopRepository extends JpaRepository<Workshop, Long> {

    List<Workshop> findByCenter_CenterId(Long centerId);

    List<Workshop> findByWorkshopNameContainingIgnoreCase(String name);
    
}
