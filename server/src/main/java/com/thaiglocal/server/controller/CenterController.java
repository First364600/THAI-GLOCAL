package com.thaiglocal.server.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.thaiglocal.server.dto.request.CenterRequest;
import com.thaiglocal.server.dto.response.CenterResponse;
import com.thaiglocal.server.service.CenterService;

@RestController
@RequestMapping("/api/centers")
public class CenterController {
    private final CenterService centerService;

    public CenterController(CenterService centerService) {
        this.centerService = centerService;
    }

    // Method: GET /api/centers
    @GetMapping
    public ResponseEntity<List<CenterResponse>> getAllCenters() {
        List<CenterResponse> centers = centerService.getAllCenters();
        return ResponseEntity.ok(centers);
    }

    // Method: GET /api/centers/search?name=...
    @GetMapping("/search")
    public ResponseEntity<List<CenterResponse>> searchCentersByName(@RequestParam("name") String centerName) {
        List<CenterResponse> responses = centerService.searchCentersByName(centerName);
        return ResponseEntity.ok(responses);
    }

    // Method: GET /api/centers/admin/{userId}
    @GetMapping("/admin/{userId}")
    public ResponseEntity<List<CenterResponse>> getCenterByCenterAdminId(@PathVariable Long userId) {
        List<CenterResponse> responses = centerService.getCenterByCenterAdminId(userId);
        return ResponseEntity.ok(responses);
    }

    // Method: POST /api/centers/create
    @PostMapping("/create")
    public ResponseEntity<Void> createCenter(@RequestBody CenterRequest request) {
        centerService.createCenter(request);
        return ResponseEntity.status(HttpStatus.CREATED).build(); // HTTP 201 Created
    }

    // Method: PATCH /api/centers/update/{centerId}
    @PatchMapping("/update/{centerId}")
    public ResponseEntity<Void> updateCenter(
            @PathVariable Long centerId,
            @RequestBody CenterRequest request) {
        
        centerService.updateCenter(centerId, request);
        return ResponseEntity.ok().build(); // HTTP 200 OK
    }

    // Method: DELETE /api/centers/delete/{centerId}
    @DeleteMapping("/delete/{centerId}")
    public ResponseEntity<Void> deleteCenter(@PathVariable Long centerId) {
        centerService.deleteCenter(centerId);
        return ResponseEntity.noContent().build(); // HTTP 204 No Content
    }


}
