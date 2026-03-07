package com.thaiglocal.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thaiglocal.server.model.CenterBelongUser;

@Repository
public interface CenterBelongUserRepository extends JpaRepository<CenterBelongUser, Long> {
    
}
