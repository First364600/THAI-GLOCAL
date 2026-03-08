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

import com.thaiglocal.webclient.dto.request.WorkshopCreateRequest;
import com.thaiglocal.webclient.dto.request.WorkshopUpdateRequest;
import com.thaiglocal.webclient.dto.response.WorkshopResponse;
import com.thaiglocal.webclient.service.WorkshopService;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/client/workshops")
public class WorkshopController {

    private final WorkshopService workshopService;

    public WorkshopController(WorkshopService workshopService) {
        this.workshopService = workshopService;
    }

    @GetMapping
    public Flux<WorkshopResponse> getAll(@RequestHeader(value = "Cookie", required = false) String cookieHeader) {
        return workshopService.getAll(cookieHeader);
    }

    @GetMapping("/{workshopId}")
    public Mono<WorkshopResponse> getById(@PathVariable Long workshopId,
            @RequestHeader(value = "Cookie", required = false) String cookieHeader) {
        return workshopService.getById(workshopId, cookieHeader);
    }

    @GetMapping("/search")
    public Flux<WorkshopResponse> searchByName(@RequestParam("name") String name,
            @RequestHeader(value = "Cookie", required = false) String cookieHeader) {
        return workshopService.searchByName(name, cookieHeader);
    }

    @GetMapping("/type/{workshopType}")
    public Flux<WorkshopResponse> getByType(@PathVariable String workshopType,
            @RequestHeader(value = "Cookie", required = false) String cookieHeader) {
        return workshopService.getByType(workshopType, cookieHeader);
    }

    @GetMapping("/center/{centerId}")
    public Flux<WorkshopResponse> getByCenter(@PathVariable Long centerId,
            @RequestHeader(value = "Cookie", required = false) String cookieHeader) {
        return workshopService.getByCenter(centerId, cookieHeader);
    }

    @GetMapping("/center/{centerId}/type/{workshopType}")
    public Flux<WorkshopResponse> getByCenterAndType(@PathVariable Long centerId, @PathVariable String workshopType,
            @RequestHeader(value = "Cookie", required = false) String cookieHeader) {
        return workshopService.getByCenterAndType(centerId, workshopType, cookieHeader);
    }

    @PostMapping("/create")
    public Mono<ResponseEntity<Void>> create(@RequestBody WorkshopCreateRequest request,
            @RequestHeader(value = "Cookie", required = false) String cookieHeader) {
        return workshopService.create(request, cookieHeader)
                .thenReturn(ResponseEntity.status(HttpStatus.CREATED).build());
    }

    @PatchMapping("/update/{workshopId}")
    public Mono<ResponseEntity<Void>> update(@PathVariable Long workshopId, @RequestBody WorkshopUpdateRequest request,
            @RequestHeader(value = "Cookie", required = false) String cookieHeader) {
        return workshopService.update(workshopId, request, cookieHeader)
                .thenReturn(ResponseEntity.ok().build());
    }

    @DeleteMapping("/delete/{workshopId}")
    public Mono<ResponseEntity<Void>> delete(@PathVariable Long workshopId,
            @RequestHeader(value = "Cookie", required = false) String cookieHeader) {
        return workshopService.delete(workshopId, cookieHeader)
                .thenReturn(ResponseEntity.noContent().build());
    }
}
