package com.thaiglocal.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thaiglocal.server.model.Workshop;

@Repository
public interface WorkshopRepository extends JpaRepository<Workshop, Long> {
    
}
