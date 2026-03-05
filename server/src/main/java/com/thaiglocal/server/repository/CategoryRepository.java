package com.thaiglocal.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thaiglocal.server.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    
}
