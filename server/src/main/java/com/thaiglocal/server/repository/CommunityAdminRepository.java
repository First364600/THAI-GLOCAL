package com.thaiglocal.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thaiglocal.server.model.CommunityAdmin;

public interface CommunityAdminRepository extends JpaRepository<CommunityAdmin, Long> {
    
}
