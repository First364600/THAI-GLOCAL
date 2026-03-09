package com.thaiglocal.server.repository;

import com.thaiglocal.server.model.RegistrationRequest;
import com.thaiglocal.server.model.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegistrationRequestRepository extends JpaRepository<RegistrationRequest, Long> {
    List<RegistrationRequest> findByStatus(RequestStatus status);
}



