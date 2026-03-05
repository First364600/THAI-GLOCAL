package com.thaiglocal.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thaiglocal.server.model.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
}
