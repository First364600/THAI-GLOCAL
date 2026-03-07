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
import org.springframework.web.bind.annotation.RestController;

import com.thaiglocal.server.dto.request.ActivityRequest;
import com.thaiglocal.server.dto.response.ActivityResponse;
import com.thaiglocal.server.service.ActivityService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {
    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    // Method: GET /api/activities
    @GetMapping
    public ResponseEntity<List<ActivityResponse>> getAllActivities() {
        List<ActivityResponse> activities = activityService.getAllActivities();
        return ResponseEntity.ok(activities);
    }

    // Method: GET /api/activities/{activityId}
    @GetMapping("/{activityId}")
    public ResponseEntity<ActivityResponse> getActivityById(@PathVariable Long activityId) {
        ActivityResponse activity = activityService.getActivityById(activityId);
        return ResponseEntity.ok(activity);
    }

    // Method: GET /api/activities/workshop/{workshopId}
    @GetMapping("/workshop/{workshopId}")
    public ResponseEntity<List<ActivityResponse>> getActivitiesByWorkshopId(@PathVariable Long workshopId) {
        List<ActivityResponse> activities = activityService.getActivitiesByWorkshopId(workshopId);
        return ResponseEntity.ok(activities);
    }

    // Method: POST /api/activities/workshop/{workshopId}/create
    @PostMapping("/workshop/{workshopId}/create")
    public ResponseEntity<Void> createActivity(
            @PathVariable Long workshopId,
            @Valid @RequestBody ActivityRequest request) {
        activityService.createActivity(workshopId, request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // Method: PATCH /api/activities/update/{activityId}
    @PatchMapping("/update/{activityId}")
    public ResponseEntity<Void> updateActivity(
            @PathVariable Long activityId,
            @RequestBody ActivityRequest request) {
        activityService.updateActivity(activityId, request);
        return ResponseEntity.ok().build();
    }

    // Method: DELETE /api/activities/delete/{activityId}
    @DeleteMapping("/delete/{activityId}")
    public ResponseEntity<Void> deleteActivity(@PathVariable Long activityId) {
        activityService.deleteActivity(activityId);
        return ResponseEntity.noContent().build();
    }
}
