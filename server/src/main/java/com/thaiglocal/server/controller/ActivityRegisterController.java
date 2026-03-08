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

import com.thaiglocal.server.dto.request.ActivityRegisterRequest;
import com.thaiglocal.server.dto.response.ActivityRegisterReponse;
import com.thaiglocal.server.service.ActivityRegisterService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/activity-registers")
public class ActivityRegisterController {
    private final ActivityRegisterService activityRegisterService;

    public ActivityRegisterController(ActivityRegisterService activityRegisterService) {
        this.activityRegisterService = activityRegisterService;
    }

    // Method: GET /api/activity-registers
    @GetMapping
    public ResponseEntity<List<ActivityRegisterReponse>> getAllRegisters() {
        List<ActivityRegisterReponse> activityRegisters = activityRegisterService.getAllActivityRegisters();
        return ResponseEntity.ok(activityRegisters);
    }

    // Method: GET /api/activity-registers/{registerId}
    @GetMapping("/{registerId}")
    public ResponseEntity<ActivityRegisterReponse> getRegisterById(@PathVariable Long registerId) {
        ActivityRegisterReponse activityRegister = activityRegisterService.getActivityRegisterById(registerId);
        return ResponseEntity.ok(activityRegister);
    }

    // Method: GET /api/activity-registers/activity/{activityId}
    @GetMapping("/activity/{activityId}")
    public ResponseEntity<List<ActivityRegisterReponse>> getRegistersByActivityId(@PathVariable Long activityId) {
        List<ActivityRegisterReponse> activityRegisters = activityRegisterService.getActivityRegistersByActivityId(activityId);
        return ResponseEntity.ok(activityRegisters);
    }

    // Method: GET /api/activity-registers/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ActivityRegisterReponse>> getRegistersByUserId(@PathVariable Long userId) {
        List<ActivityRegisterReponse> activityRegisters = activityRegisterService.getActivityRegistersByUserId(userId);
        return ResponseEntity.ok(activityRegisters);
    }

    // Method: POST /api/activity-registers/create/activity/{activityId}/user/{userId}
    @PostMapping("/create/activity/{activityId}/user/{userId}")
    public ResponseEntity<Void> createRegister(
            @PathVariable Long activityId,
            @PathVariable Long userId,
            @Valid @RequestBody ActivityRegisterRequest request) {
        activityRegisterService.createActivityRegister(request, activityId, userId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // Method: PATCH /api/activity-registers/{registerId}/confirm
    @PatchMapping("/{registerId}/confirm")
    public ResponseEntity<Void> confirmRegister(@PathVariable Long registerId) {
        activityRegisterService.confirmActivityRegister(registerId);
        return ResponseEntity.ok().build();
    }

    // Method: PATCH /api/activity-registers/{registerId}/cancel
    @PatchMapping("/{registerId}/cancel")
    public ResponseEntity<Void> cancelRegister(@PathVariable Long registerId) {
        activityRegisterService.cancelActivityRegister(registerId);
        return ResponseEntity.ok().build();
    }

    // Method: PATCH /api/activity-registers/{registerId}/complete
    @PatchMapping("/{registerId}/complete")
    public ResponseEntity<Void> completeRegister(@PathVariable Long registerId) {
        activityRegisterService.completeActivityRegister(registerId);
        return ResponseEntity.ok().build();
    }

    // Method: DELETE /api/activity-registers/delete/{registerId}
    @DeleteMapping("/delete/{registerId}")
    public ResponseEntity<Void> deleteRegister(@PathVariable Long registerId) {
        activityRegisterService.deleteActivityRegister(registerId);
        return ResponseEntity.noContent().build();
    }
}
