package com.thaiglocal.server.controller;

import com.thaiglocal.server.dto.CreateRegistrationRequestDTO;
import com.thaiglocal.server.dto.RegistrationRequestDTO;
import com.thaiglocal.server.dto.UpdateRegistrationRequestStatusDTO;
import com.thaiglocal.server.service.RegistrationRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RegistrationRequestController {

    @Autowired
    private RegistrationRequestService registrationRequestService;

    @PostMapping("/registration-requests")
    public ResponseEntity<RegistrationRequestDTO> createRequest(@Valid @RequestBody CreateRegistrationRequestDTO dto) {
        RegistrationRequestDTO created = registrationRequestService.createRequest(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/admin/registration-requests")
    public ResponseEntity<List<RegistrationRequestDTO>> getAllRequests() {
        return ResponseEntity.ok(registrationRequestService.getAllRequests());
    }

    @PatchMapping("/admin/registration-requests/{id}/status")
    public ResponseEntity<RegistrationRequestDTO> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRegistrationRequestStatusDTO dto) {
        RegistrationRequestDTO updated = registrationRequestService.updateRequestStatus(id, dto.getStatus());
        return ResponseEntity.ok(updated);
    }
}



