package com.thaiglocal.webclient.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.thaiglocal.webclient.dto.request.ActivityRegisterRequest;
import com.thaiglocal.webclient.dto.response.ActivityRegisterResponse;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class ActivityRegisterService {

    private final WebClient activityRegisterWebClient;

    public ActivityRegisterService(WebClient.Builder builder,
            @Value("${server.api.base-url:http://localhost:8081}") String baseUrl) {
        this.activityRegisterWebClient = builder
                .baseUrl(baseUrl)
                .build();
    }

    public Flux<ActivityRegisterResponse> getAll(String cookieHeader) {
        return activityRegisterWebClient
                .get()
                .uri("/api/activity-registers")
                .headers(h -> addCookie(h, cookieHeader))
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError,
                        cr -> Mono.error(new RuntimeException("Client error during getAll activity-registers")))
                .onStatus(HttpStatusCode::is5xxServerError,
                        cr -> Mono.error(new RuntimeException("Server error during getAll activity-registers")))
                .bodyToFlux(ActivityRegisterResponse.class);
    }

    public Mono<ActivityRegisterResponse> getById(Long registerId, String cookieHeader) {
        return activityRegisterWebClient
                .get()
                .uri("/api/activity-registers/{registerId}", registerId)
                .headers(h -> addCookie(h, cookieHeader))
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError,
                        cr -> Mono.error(new RuntimeException("Client error during getById activity-register")))
                .onStatus(HttpStatusCode::is5xxServerError,
                        cr -> Mono.error(new RuntimeException("Server error during getById activity-register")))
                .bodyToMono(ActivityRegisterResponse.class);
    }

    public Flux<ActivityRegisterResponse> getByActivityId(Long activityId, String cookieHeader) {
        return activityRegisterWebClient
                .get()
                .uri("/api/activity-registers/activity/{activityId}", activityId)
                .headers(h -> addCookie(h, cookieHeader))
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError,
                        cr -> Mono.error(new RuntimeException("Client error during getByActivityId")))
                .onStatus(HttpStatusCode::is5xxServerError,
                        cr -> Mono.error(new RuntimeException("Server error during getByActivityId")))
                .bodyToFlux(ActivityRegisterResponse.class);
    }

    public Flux<ActivityRegisterResponse> getByUserId(Long userId, String cookieHeader) {
        return activityRegisterWebClient
                .get()
                .uri("/api/activity-registers/user/{userId}", userId)
                .headers(h -> addCookie(h, cookieHeader))
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError,
                        cr -> Mono.error(new RuntimeException("Client error during getByUserId")))
                .onStatus(HttpStatusCode::is5xxServerError,
                        cr -> Mono.error(new RuntimeException("Server error during getByUserId")))
                .bodyToFlux(ActivityRegisterResponse.class);
    }

    public Mono<Void> create(Long activityId, Long userId, ActivityRegisterRequest request, String cookieHeader) {
        return activityRegisterWebClient
                .post()
                .uri("/api/activity-registers/create/activity/{activityId}/user/{userId}", activityId, userId)
                .headers(h -> addCookie(h, cookieHeader))
                .bodyValue(request)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError,
                        cr -> Mono.error(new RuntimeException("Client error during create activity-register")))
                .onStatus(HttpStatusCode::is5xxServerError,
                        cr -> Mono.error(new RuntimeException("Server error during create activity-register")))
                .bodyToMono(Void.class);
    }

    public Mono<Void> confirm(Long registerId, String cookieHeader) {
        return activityRegisterWebClient
                .patch()
                .uri("/api/activity-registers/{registerId}/confirm", registerId)
                .headers(h -> addCookie(h, cookieHeader))
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError,
                        cr -> Mono.error(new RuntimeException("Client error during confirm activity-register")))
                .onStatus(HttpStatusCode::is5xxServerError,
                        cr -> Mono.error(new RuntimeException("Server error during confirm activity-register")))
                .bodyToMono(Void.class);
    }

    public Mono<Void> cancel(Long registerId, String cookieHeader) {
        return activityRegisterWebClient
                .patch()
                .uri("/api/activity-registers/{registerId}/cancel", registerId)
                .headers(h -> addCookie(h, cookieHeader))
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError,
                        cr -> Mono.error(new RuntimeException("Client error during cancel activity-register")))
                .onStatus(HttpStatusCode::is5xxServerError,
                        cr -> Mono.error(new RuntimeException("Server error during cancel activity-register")))
                .bodyToMono(Void.class);
    }

    public Mono<Void> complete(Long registerId, String cookieHeader) {
        return activityRegisterWebClient
                .patch()
                .uri("/api/activity-registers/{registerId}/complete", registerId)
                .headers(h -> addCookie(h, cookieHeader))
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError,
                        cr -> Mono.error(new RuntimeException("Client error during complete activity-register")))
                .onStatus(HttpStatusCode::is5xxServerError,
                        cr -> Mono.error(new RuntimeException("Server error during complete activity-register")))
                .bodyToMono(Void.class);
    }

    public Mono<Void> delete(Long registerId, String cookieHeader) {
        return activityRegisterWebClient
                .delete()
                .uri("/api/activity-registers/delete/{registerId}", registerId)
                .headers(h -> addCookie(h, cookieHeader))
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError,
                        cr -> Mono.error(new RuntimeException("Client error during delete activity-register")))
                .onStatus(HttpStatusCode::is5xxServerError,
                        cr -> Mono.error(new RuntimeException("Server error during delete activity-register")))
                .bodyToMono(Void.class);
    }

    public Mono<Void> reject(Long registerId, String cookieHeader) {
        return activityRegisterWebClient
                .patch()
                .uri("/api/activity-registers/{registerId}/reject", registerId)
                .headers(h -> addCookie(h, cookieHeader))
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError,
                        cr -> Mono.error(new RuntimeException("Client error during reject activity-register")))
                .onStatus(HttpStatusCode::is5xxServerError,
                        cr -> Mono.error(new RuntimeException("Server error during reject activity-register")))
                .bodyToMono(Void.class);
    }

    public Mono<Void> requestCancel(Long registerId, String cookieHeader) {
        return activityRegisterWebClient
                .patch()
                .uri("/api/activity-registers/{registerId}/request-cancel", registerId)
                .headers(h -> addCookie(h, cookieHeader))
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError,
                        cr -> Mono.error(new RuntimeException("Client error during request cancel")))
                .onStatus(HttpStatusCode::is5xxServerError,
                        cr -> Mono.error(new RuntimeException("Server error during request cancel")))
                .bodyToMono(Void.class);
    }

    public Mono<Void> approveCancel(Long registerId, String cookieHeader) {
        return activityRegisterWebClient
                .patch()
                .uri("/api/activity-registers/{registerId}/approve-cancel", registerId)
                .headers(h -> addCookie(h, cookieHeader))
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError,
                        cr -> Mono.error(new RuntimeException("Client error during approve cancel")))
                .onStatus(HttpStatusCode::is5xxServerError,
                        cr -> Mono.error(new RuntimeException("Server error during approve cancel")))
                .bodyToMono(Void.class);
    }

    public Mono<Void> rejectCancel(Long registerId, String cookieHeader) {
        return activityRegisterWebClient
                .patch()
                .uri("/api/activity-registers/{registerId}/reject-cancel", registerId)
                .headers(h -> addCookie(h, cookieHeader))
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError,
                        cr -> Mono.error(new RuntimeException("Client error during reject cancel")))
                .onStatus(HttpStatusCode::is5xxServerError,
                        cr -> Mono.error(new RuntimeException("Server error during reject cancel")))
                .bodyToMono(Void.class);
    }

    private void addCookie(HttpHeaders headers, String cookieHeader) {
        if (cookieHeader != null && !cookieHeader.isBlank()) {
            headers.add("Cookie", cookieHeader);
        }
    }
}
