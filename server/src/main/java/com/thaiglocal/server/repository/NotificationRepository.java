package com.thaiglocal.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thaiglocal.server.model.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
}
