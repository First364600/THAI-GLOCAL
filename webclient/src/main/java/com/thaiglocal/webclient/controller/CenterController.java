package com.thaiglocal.webclient.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.thaiglocal.webclient.dto.request.CenterRequest;
import com.thaiglocal.webclient.dto.response.CenterResponse;
import com.thaiglocal.webclient.service.CenterService;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/client/centers")
public class CenterController {

    private final CenterService centerService;

    public CenterController(CenterService centerService) {
        this.centerService = centerService;
    }

    @GetMapping
    public Flux<CenterResponse> getAllCenters(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        return centerService.getAllCenters(authHeader);
    }

    @GetMapping("/search")
    public Flux<CenterResponse> searchCentersByName(@RequestParam("name") String centerName,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return centerService.searchCentersByName(centerName, authHeader);
    }

    @GetMapping("/admin/{userId}")
    public Flux<CenterResponse> getCentersByAdminId(@PathVariable Long userId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return centerService.getCentersByAdminId(userId, authHeader);
    }

    @GetMapping("/{centerId}")
    public Mono<CenterResponse> getCenterById(@PathVariable Long centerId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return centerService.getCenterById(centerId, authHeader);
    }

    @PostMapping("/create/user/{userId}")
    public Mono<ResponseEntity<Void>> createCenter(@PathVariable Long userId, @RequestBody CenterRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return centerService.createCenter(userId, request, authHeader)
                .thenReturn(ResponseEntity.status(HttpStatus.CREATED).build());
    }

    @PostMapping("/{centerId}/add-admin/{userId}")
    public Mono<ResponseEntity<Void>> addCenterAdmin(@PathVariable Long centerId, @PathVariable Long userId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return centerService.addCenterAdmin(centerId, userId, authHeader)
                .thenReturn(ResponseEntity.ok().build());
    }

    @PostMapping("/{centerId}/add-staff/{userId}")
    public Mono<ResponseEntity<Void>> addCenterStaff(@PathVariable Long centerId, @PathVariable Long userId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return centerService.addCenterStaff(centerId, userId, authHeader)
                .thenReturn(ResponseEntity.ok().build());
    }

    @PatchMapping("/update/{centerId}")
    public Mono<ResponseEntity<Void>> updateCenter(@PathVariable Long centerId, @RequestBody CenterRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return centerService.updateCenter(centerId, request, authHeader)
                .thenReturn(ResponseEntity.ok().build());
    }

    @DeleteMapping("/delete/{centerId}")
    public Mono<ResponseEntity<Void>> deleteCenter(@PathVariable Long centerId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return centerService.deleteCenter(centerId, authHeader)
                .thenReturn(ResponseEntity.noContent().build());
    }
}
