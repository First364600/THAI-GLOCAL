package com.thaiglocal.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thaiglocal.server.model.Location;

public interface LocationRepository extends JpaRepository<Location, Long> {
    
}
