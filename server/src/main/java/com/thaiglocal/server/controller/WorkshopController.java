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

import com.thaiglocal.server.dto.request.WorkshopCreateRequest;
import com.thaiglocal.server.dto.request.WorkshopUpdateRequest;
import com.thaiglocal.server.dto.response.WorkshopResponse;
import com.thaiglocal.server.service.WorkshopService;

@RestController
@RequestMapping("/api/workshops")
public class WorkshopController {
    private final WorkshopService workshopService;

    public WorkshopController(WorkshopService workshopService) {
        this.workshopService = workshopService;
    }
    
    // Method: GET /api/workshops
    @GetMapping
    public ResponseEntity<List<WorkshopResponse>> getAllWorkshops() {
        List<WorkshopResponse> workshops = workshopService.getAllWorkshops();
        return ResponseEntity.ok(workshops);
    }

    // Method: GET /api/workshops/{workshopId}
    @GetMapping("/{workshopId}")
    public ResponseEntity<WorkshopResponse> getWorkshopById(@PathVariable Long workshopId) {
        WorkshopResponse workshop = workshopService.getWorkshopById(workshopId);
        return ResponseEntity.ok(workshop);
    }

    // Method: GET /api/workshops/search?name=...
    @GetMapping("/search")
    public ResponseEntity<List<WorkshopResponse>> searchWorkshopsByName(@RequestParam("name") String name) {
        List<WorkshopResponse> workshops = workshopService.searchWorkshopsByName(name);
        return ResponseEntity.ok(workshops);
    }

    // Method: GET /api/workshops/type/{workshopType}
    @GetMapping("/type/{workshopType}")
    public ResponseEntity<List<WorkshopResponse>> getWorkshopsByType(@PathVariable String workshopType) {
        List<WorkshopResponse> workshops = workshopService.getWorkshopsByType(workshopType);
        return ResponseEntity.ok(workshops);
    }

    // Method: GET /api/workshops/center/{centerId}
    @GetMapping("/center/{centerId}")
    public ResponseEntity<List<WorkshopResponse>> getWorkshopsByCenterId(@PathVariable Long centerId) {
        List<WorkshopResponse> workshops = workshopService.getWorkshopsByCenterId(centerId);
        return ResponseEntity.ok(workshops);
    }

    // Method: GET /api/workshops/center/{centerId}/type/{workshopType}
    @GetMapping("/center/{centerId}/type/{workshopType}")
    public ResponseEntity<List<WorkshopResponse>> getWorkshopsByCenterIdAndType(
            @PathVariable Long centerId,
            @PathVariable String workshopType) {
        List<WorkshopResponse> workshops = workshopService.getWorkshopsByCenterIdAndType(centerId, workshopType);
        return ResponseEntity.ok(workshops);
    }

    // Method: POST /api/workshops/create
    @PostMapping("/create")
    public ResponseEntity<Void> createWorkshop(@RequestBody WorkshopCreateRequest request) {
        workshopService.createWorkshop(request);
        return ResponseEntity.status(HttpStatus.CREATED).build(); // HTTP 201
    }

    // Method: PATCH /api/workshops/update/{workshopId}
    @PatchMapping("/update/{workshopId}")
    public ResponseEntity<Void> updateWorkshop(
            @PathVariable Long workshopId,
            @RequestBody WorkshopUpdateRequest request) {
        workshopService.updateWorkshop(workshopId, request);
        return ResponseEntity.ok().build(); // HTTP 200
    }

    // Method: DELETE /api/workshops/delete/{workshopId}
    @DeleteMapping("/delete/{workshopId}")
    public ResponseEntity<Void> deleteWorkshop(@PathVariable Long workshopId) {
        workshopService.deleteWorkshop(workshopId);
        return ResponseEntity.noContent().build(); // HTTP 204
    }
}
