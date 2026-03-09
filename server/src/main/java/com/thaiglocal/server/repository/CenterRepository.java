package com.thaiglocal.server.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thaiglocal.server.model.Center;

@Repository
public interface CenterRepository extends JpaRepository<Center, Long> {
    List<Center> findByCenterNameContainingIgnoreCase(String centerName);
}
