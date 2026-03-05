package com.thaiglocal.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thaiglocal.server.model.Activity;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    
}
