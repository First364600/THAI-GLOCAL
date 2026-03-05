package com.thaiglocal.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thaiglocal.server.model.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    
}
