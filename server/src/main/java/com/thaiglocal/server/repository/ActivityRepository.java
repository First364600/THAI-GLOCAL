package com.thaiglocal.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thaiglocal.server.model.Activity;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    
}
