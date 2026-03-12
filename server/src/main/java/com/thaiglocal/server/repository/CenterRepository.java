package com.thaiglocal.server.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thaiglocal.server.model.Center;
import com.thaiglocal.server.model.enums.CenterStatus;

@Repository
public interface CenterRepository extends JpaRepository<Center, Long> {
    List<Center> findByCenterNameContainingIgnoreCase(String centerName);
    List<Center> findByStatus(CenterStatus status);
}
