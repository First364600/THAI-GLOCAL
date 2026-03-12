package com.thaiglocal.webclient.controller;

import com.thaiglocal.webclient.dto.request.CreateRegistrationRequest;
import com.thaiglocal.webclient.dto.request.UpdateRegistrationRequestStatus;
import com.thaiglocal.webclient.dto.response.RegistrationRequestResponse;
import com.thaiglocal.webclient.service.RegistrationRequestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/client")
public class RegistrationRequestController {

    private final RegistrationRequestService registrationRequestService;

    public RegistrationRequestController(RegistrationRequestService registrationRequestService) {
        this.registrationRequestService = registrationRequestService;
    }

    @PostMapping("/registration-requests")
    public Mono<ResponseEntity<RegistrationRequestResponse>> createRequest(
            @RequestBody CreateRegistrationRequest request,
            @RequestHeader(value = "Cookie", required = false) String cookieHeader) {
        return registrationRequestService.createRequest(request, cookieHeader)
                .map(response -> ResponseEntity.status(HttpStatus.CREATED).body(response));
    }

    @GetMapping("/admin/registration-requests")
    public Flux<RegistrationRequestResponse> getAllRequests(
            @RequestHeader(value = "Cookie", required = false) String cookieHeader) {
        return registrationRequestService.getAllRequests(cookieHeader);
    }

    @PatchMapping("/admin/registration-requests/{id}/status")
    public Mono<ResponseEntity<RegistrationRequestResponse>> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateRegistrationRequestStatus request,
            @RequestHeader(value = "Cookie", required = false) String cookieHeader) {
        return registrationRequestService.updateStatus(id, request, cookieHeader)
                .map(ResponseEntity::ok);
    }
}



