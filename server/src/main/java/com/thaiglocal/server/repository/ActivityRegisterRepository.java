package com.thaiglocal.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thaiglocal.server.model.ActivityRegister;

@Repository
public interface ActivityRegisterRepository extends JpaRepository<ActivityRegister, Long> {
    
}
