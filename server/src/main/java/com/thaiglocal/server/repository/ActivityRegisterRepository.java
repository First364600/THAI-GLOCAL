package com.thaiglocal.server.repository;

import java.util.stream.Stream;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thaiglocal.server.model.Activity;
import com.thaiglocal.server.model.ActivityRegister;

@Repository
public interface ActivityRegisterRepository extends JpaRepository<ActivityRegister, Long> {

    Stream<Activity> findByActivity_ActivityId(Long activityId);
    
}
