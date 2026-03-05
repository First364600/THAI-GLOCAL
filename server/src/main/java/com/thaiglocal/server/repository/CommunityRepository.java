package com.thaiglocal.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thaiglocal.server.model.Community;

@Repository
public interface CommunityRepository extends JpaRepository<Community, Long> {
    
}
