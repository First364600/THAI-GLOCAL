package com.thaiglocal.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thaiglocal.server.model.ActivityStatus;

@Repository
public interface ActivityStatusRepository extends JpaRepository<ActivityStatus, Long> {
    
}
