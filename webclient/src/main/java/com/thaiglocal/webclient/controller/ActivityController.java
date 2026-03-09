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

import com.thaiglocal.webclient.dto.request.ActivityRequest;
import com.thaiglocal.webclient.dto.response.ActivityResponse;
import com.thaiglocal.webclient.service.ActivityService;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/client/activities")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping
    public Flux<ActivityResponse> getAll(@RequestHeader(value = "Cookie", required = false) String cookieHeader) {
        return activityService.getAll(cookieHeader);
    }

    @GetMapping("/{activityId}")
    public Mono<ActivityResponse> getById(@PathVariable Long activityId,
            @RequestHeader(value = "Cookie", required = false) String cookieHeader) {
        return activityService.getById(activityId, cookieHeader);
    }

    @GetMapping("/workshop/{workshopId}")
    public Flux<ActivityResponse> getByWorkshopId(@PathVariable Long workshopId,
            @RequestHeader(value = "Cookie", required = false) String cookieHeader) {
        return activityService.getByWorkshopId(workshopId, cookieHeader);
    }

    @PostMapping("/workshop/{workshopId}/create")
    public Mono<ResponseEntity<Void>> create(@PathVariable Long workshopId, @RequestBody ActivityRequest request,
            @RequestHeader(value = "Cookie", required = false) String cookieHeader) {
        return activityService.create(workshopId, request, cookieHeader)
                .thenReturn(ResponseEntity.status(HttpStatus.CREATED).build());
    }

    @PatchMapping("/update/{activityId}")
    public Mono<ResponseEntity<Void>> update(@PathVariable Long activityId, @RequestBody ActivityRequest request,
            @RequestHeader(value = "Cookie", required = false) String cookieHeader) {
        return activityService.update(activityId, request, cookieHeader)
                .thenReturn(ResponseEntity.ok().build());
    }

    @DeleteMapping("/delete/{activityId}")
    public Mono<ResponseEntity<Void>> delete(@PathVariable Long activityId,
            @RequestHeader(value = "Cookie", required = false) String cookieHeader) {
        return activityService.delete(activityId, cookieHeader)
                .thenReturn(ResponseEntity.noContent().build());
    }
}
