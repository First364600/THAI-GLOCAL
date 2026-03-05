package com.thaiglocal.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thaiglocal.server.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
