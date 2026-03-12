package com.thaiglocal.server.service;

import com.thaiglocal.server.dto.CreateRegistrationRequestDTO;
import com.thaiglocal.server.dto.RegistrationRequestDTO;
import com.thaiglocal.server.exception.NotFoundException;
import com.thaiglocal.server.model.Center;
import com.thaiglocal.server.model.CenterBelongUser;
import com.thaiglocal.server.model.RegistrationRequest;
import com.thaiglocal.server.model.User;
import com.thaiglocal.server.model.enums.PositionName;
import com.thaiglocal.server.model.enums.RequestStatus;
import com.thaiglocal.server.repository.CenterRepository;
import com.thaiglocal.server.repository.RegistrationRequestRepository;
import com.thaiglocal.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RegistrationRequestService {

    @Autowired
    private RegistrationRequestRepository registrationRequestRepository;

    @Autowired
    private CenterRepository centerRepository;

    @Autowired
    private UserRepository userRepository;

    public RegistrationRequestDTO createRequest(CreateRegistrationRequestDTO dto) {
        if (!userRepository.existsById(dto.getRequesterId())) {
            throw new NotFoundException("User not found with id: " + dto.getRequesterId());
        }

        RegistrationRequest request = RegistrationRequest.builder()
                .centerName(dto.getCenterName())
                .requesterId(dto.getRequesterId())
                .details(dto.getDetails())
                .status(RequestStatus.PENDING)
                .build();

        RegistrationRequest savedRequest = registrationRequestRepository.save(request);
        return mapToDTO(savedRequest);
    }

    public List<RegistrationRequestDTO> getAllRequests() {
        return registrationRequestRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public RegistrationRequestDTO updateRequestStatus(Long id, RequestStatus newStatus) {
        RegistrationRequest request = registrationRequestRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Request not found with id: " + id));

        if (request.getStatus() == RequestStatus.PENDING && newStatus == RequestStatus.APPROVED) {
            approveRequest(request);
        }

        request.setStatus(newStatus);
        RegistrationRequest saved = registrationRequestRepository.save(request);
        return mapToDTO(saved);
    }

    private void approveRequest(RegistrationRequest request) {
        User requester = userRepository.findById(request.getRequesterId())
                .orElseThrow(() -> new NotFoundException("Requester not found with id: " + request.getRequesterId()));

        Center center = Center.builder()
                .centerName(request.getCenterName())
                .description(request.getDetails())
                .createdAt(LocalDateTime.now())
                .build();

        CenterBelongUser centerBelongUser = CenterBelongUser.builder()
                .position(PositionName.CENTER_ADMIN)
                .build();
                
        center.addCenterBelongUser(centerBelongUser);
        requester.addCenterBelongUser(centerBelongUser);

        centerRepository.save(center);
    }

    private RegistrationRequestDTO mapToDTO(RegistrationRequest request) {
        RegistrationRequestDTO dto = new RegistrationRequestDTO();
        dto.setId(request.getId());
        dto.setCenterName(request.getCenterName());
        dto.setRequesterId(request.getRequesterId());
        dto.setStatus(request.getStatus());
        dto.setDetails(request.getDetails());
        dto.setCreatedAt(request.getCreatedAt());
        return dto;
    }
}



