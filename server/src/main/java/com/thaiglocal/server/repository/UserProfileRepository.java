package com.thaiglocal.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thaiglocal.server.model.UserProfile;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    
}
