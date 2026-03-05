package com.thaiglocal.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thaiglocal.server.model.ActivityStatus;

public interface ActivityStatusRepository extends JpaRepository<ActivityStatus, Long> {
    
}
