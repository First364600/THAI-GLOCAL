package com.thaiglocal.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thaiglocal.server.model.Telephone;

@Repository
public interface TelephoneRepository extends JpaRepository<Telephone, Long> {
    
}
