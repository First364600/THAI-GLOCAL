package com.thaiglocal.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thaiglocal.server.model.Community;

public interface CommunityRepository extends JpaRepository<Community, Long> {
    
}
