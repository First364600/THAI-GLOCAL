package com.thaiglocal.server.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thaiglocal.server.model.Activity;
import com.thaiglocal.server.model.Center;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    List<Activity> findByWorkshop_WorkshopId(Long workshopId);
}
