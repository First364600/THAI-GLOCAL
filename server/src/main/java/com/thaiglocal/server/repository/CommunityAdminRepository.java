package com.thaiglocal.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thaiglocal.server.model.CommunityAdmin;

@Repository
public interface CommunityAdminRepository extends JpaRepository<CommunityAdmin, Long> {
    
}
