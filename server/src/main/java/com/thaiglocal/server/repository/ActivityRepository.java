package com.thaiglocal.server.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.thaiglocal.server.model.Activity;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    // Query ค้นหา Activity + ActivityRegisters พร้อมกัน
    @Query("SELECT DISTINCT a FROM Activity a " +
           "LEFT JOIN FETCH a.activityRegisters ar " +
           "LEFT JOIN FETCH ar.user " +
           "WHERE a.workshop.workshopId = :workshopId")
    List<Activity> findByWorkshop_WorkshopIdWithRegisters(@Param("workshopId") Long workshopId);

    // Query ธรรมชาติ (ถ้าเพียงแค่ Activity)
    List<Activity> findByWorkshop_WorkshopId(Long workshopId);
}
