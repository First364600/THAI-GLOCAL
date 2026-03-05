package com.thaiglocal.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thaiglocal.server.model.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
    
}
