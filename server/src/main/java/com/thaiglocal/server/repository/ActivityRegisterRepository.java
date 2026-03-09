package com.thaiglocal.server.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thaiglocal.server.model.ActivityRegister;

@Repository
public interface ActivityRegisterRepository extends JpaRepository<ActivityRegister, Long> {

    List<ActivityRegister> findByActivity_ActivityId(Long activityId);

    List<ActivityRegister> findByUser_UserId(Long userId);
    
}
