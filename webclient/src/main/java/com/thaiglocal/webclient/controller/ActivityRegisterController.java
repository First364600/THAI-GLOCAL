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
import org.springframework.web.bind.annotation.RestController;

import com.thaiglocal.webclient.dto.request.ActivityRegisterRequest;
import com.thaiglocal.webclient.dto.response.ActivityRegisterResponse;
import com.thaiglocal.webclient.service.ActivityRegisterService;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/client/activity-registers")
public class ActivityRegisterController {

    private final ActivityRegisterService activityRegisterService;

    public ActivityRegisterController(ActivityRegisterService activityRegisterService) {
        this.activityRegisterService = activityRegisterService;
    }

    @GetMapping
    public Flux<ActivityRegisterResponse> getAll(
            @RequestHeader(value = "Cookie", required = false) String cookieHeader) {
        return activityRegisterService.getAll(cookieHeader);
    }

    @GetMapping("/{registerId}")
    public Mono<ActivityRegisterResponse> getById(
            @PathVariable Long registerId,
            @RequestHeader(value = "Cookie", required = false) String cookieHeader) {
        return activityRegisterService.getById(registerId, cookieHeader);
    }

    @GetMapping("/activity/{activityId}")
    public Flux<ActivityRegisterResponse> getByActivityId(
            @PathVariable Long activityId,
            @RequestHeader(value = "Cookie", required = false) String cookieHeader) {
        return activityRegisterService.getByActivityId(activityId, cookieHeader);
    }

    @GetMapping("/user/{userId}")
    public Flux<ActivityRegisterResponse> getByUserId(
            @PathVariable Long userId,
            @RequestHeader(value = "Cookie", required = false) String cookieHeader) {
        return activityRegisterService.getByUserId(userId, cookieHeader);
    }

    @PostMapping("/create/activity/{activityId}/user/{userId}")
    public Mono<ResponseEntity<Void>> create(
            @PathVariable Long activityId,
            @PathVariable Long userId,
            @RequestBody ActivityRegisterRequest request,
            @RequestHeader(value = "Cookie", required = false) String cookieHeader) {
        return activityRegisterService.create(activityId, userId, request, cookieHeader)
                .thenReturn(ResponseEntity.status(HttpStatus.CREATED).build());
    }

    @PatchMapping("/{registerId}/confirm")
    public Mono<ResponseEntity<Void>> confirm(
            @PathVariable Long registerId,
            @RequestHeader(value = "Cookie", required = false) String cookieHeader) {
        return activityRegisterService.confirm(registerId, cookieHeader)
                .thenReturn(ResponseEntity.ok().build());
    }

    @PatchMapping("/{registerId}/cancel")
    public Mono<ResponseEntity<Void>> cancel(
            @PathVariable Long registerId,
            @RequestHeader(value = "Cookie", required = false) String cookieHeader) {
        return activityRegisterService.cancel(registerId, cookieHeader)
                .thenReturn(ResponseEntity.ok().build());
    }

    @PatchMapping("/{registerId}/complete")
    public Mono<ResponseEntity<Void>> complete(
            @PathVariable Long registerId,
            @RequestHeader(value = "Cookie", required = false) String cookieHeader) {
        return activityRegisterService.complete(registerId, cookieHeader)
                .thenReturn(ResponseEntity.ok().build());
    }

    @DeleteMapping("/delete/{registerId}")
    public Mono<ResponseEntity<Void>> delete(
            @PathVariable Long registerId,
            @RequestHeader(value = "Cookie", required = false) String cookieHeader) {
        return activityRegisterService.delete(registerId, cookieHeader)
                .thenReturn(ResponseEntity.noContent().build());
    }
}
