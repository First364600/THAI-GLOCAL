package com.thaiglocal.webclient.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.thaiglocal.webclient.dto.request.ActivityRequest;
import com.thaiglocal.webclient.dto.response.ActivityResponse;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class ActivityService {

    private final WebClient activityWebClient;

    public ActivityService(WebClient.Builder builder,
            @Value("${server.api.base-url:http://localhost:8081}") String baseUrl) {
        this.activityWebClient = builder
                .baseUrl(baseUrl)
                .build();
    }

    public Flux<ActivityResponse> getAll(String cookieHeader) {
        return activityWebClient
                .get()
                .uri("/api/activities")
                .headers(h -> addCookie(h, cookieHeader))
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError,
                        cr -> Mono.error(new RuntimeException("Client error during getAll activities")))
                .onStatus(HttpStatusCode::is5xxServerError,
                        cr -> Mono.error(new RuntimeException("Server error during getAll activities")))
                .bodyToFlux(ActivityResponse.class);
    }

    public Mono<ActivityResponse> getById(Long activityId, String cookieHeader) {
        return activityWebClient
                .get()
                .uri("/api/activities/{activityId}", activityId)
                .headers(h -> addCookie(h, cookieHeader))
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError,
                        cr -> Mono.error(new RuntimeException("Client error during getById activity")))
                .onStatus(HttpStatusCode::is5xxServerError,
                        cr -> Mono.error(new RuntimeException("Server error during getById activity")))
                .bodyToMono(ActivityResponse.class);
    }

    public Flux<ActivityResponse> getByWorkshopId(Long workshopId, String cookieHeader) {
        return activityWebClient
                .get()
                .uri("/api/activities/workshop/{workshopId}", workshopId)
                .headers(h -> addCookie(h, cookieHeader))
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError,
                        cr -> Mono.error(new RuntimeException("Client error during getByWorkshopId")))
                .onStatus(HttpStatusCode::is5xxServerError,
                        cr -> Mono.error(new RuntimeException("Server error during getByWorkshopId")))
                .bodyToFlux(ActivityResponse.class);
    }

    public Mono<Void> create(Long workshopId, ActivityRequest request, String cookieHeader) {
        return activityWebClient
                .post()
                .uri("/api/activities/workshop/{workshopId}/create", workshopId)
                .headers(h -> addCookie(h, cookieHeader))
                .bodyValue(request)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError,
                        cr -> Mono.error(new RuntimeException("Client error during create activity")))
                .onStatus(HttpStatusCode::is5xxServerError,
                        cr -> Mono.error(new RuntimeException("Server error during create activity")))
                .bodyToMono(Void.class);
    }

    public Mono<Void> update(Long activityId, ActivityRequest request, String cookieHeader) {
        return activityWebClient
                .patch()
                .uri("/api/activities/update/{activityId}", activityId)
                .headers(h -> addCookie(h, cookieHeader))
                .bodyValue(request)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError,
                        cr -> Mono.error(new RuntimeException("Client error during update activity")))
                .onStatus(HttpStatusCode::is5xxServerError,
                        cr -> Mono.error(new RuntimeException("Server error during update activity")))
                .bodyToMono(Void.class);
    }

    public Mono<Void> delete(Long activityId, String cookieHeader) {
        return activityWebClient
                .delete()
                .uri("/api/activities/delete/{activityId}", activityId)
                .headers(h -> addCookie(h, cookieHeader))
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError,
                        cr -> Mono.error(new RuntimeException("Client error during delete activity")))
                .onStatus(HttpStatusCode::is5xxServerError,
                        cr -> Mono.error(new RuntimeException("Server error during delete activity")))
                .bodyToMono(Void.class);
    }

    private void addCookie(HttpHeaders headers, String cookieHeader) {
        if (cookieHeader != null && !cookieHeader.isBlank()) {
            headers.add("Cookie", cookieHeader);
        }
    }
}
