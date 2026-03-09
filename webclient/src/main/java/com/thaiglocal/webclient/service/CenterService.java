package com.thaiglocal.webclient.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.thaiglocal.webclient.dto.request.CenterRequest;
import com.thaiglocal.webclient.dto.response.CenterResponse;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class CenterService {

        private final WebClient centerWebClient;

        public CenterService(WebClient.Builder builder,
                        @Value("${server.api.base-url:http://localhost:8081}") String baseUrl) {
                this.centerWebClient = builder
                                .baseUrl(baseUrl)
                                .build();
        }

        public Flux<CenterResponse> getAllCenters(String authHeader) {
                return centerWebClient
                                .get()
                                .uri("/api/centers")
                                .headers(h -> addAuthHeader(h, authHeader))
                                .retrieve()
                                .onStatus(HttpStatusCode::is4xxClientError,
                                                cr -> Mono.error(new RuntimeException(
                                                                "Client error during getAllCenters")))
                                .onStatus(HttpStatusCode::is5xxServerError,
                                                cr -> Mono.error(new RuntimeException(
                                                                "Server error during getAllCenters")))
                                .bodyToFlux(CenterResponse.class);
        }

        public Flux<CenterResponse> searchCentersByName(String centerName, String authHeader) {
                return centerWebClient
                                .get()
                                .uri(uriBuilder -> uriBuilder
                                                .path("/api/centers/search")
                                                .queryParam("name", centerName)
                                                .build())
                                .headers(h -> addAuthHeader(h, authHeader))
                                .retrieve()
                                .onStatus(HttpStatusCode::is4xxClientError,
                                                cr -> Mono.error(new RuntimeException(
                                                                "Client error during searchCentersByName")))
                                .onStatus(HttpStatusCode::is5xxServerError,
                                                cr -> Mono.error(new RuntimeException(
                                                                "Server error during searchCentersByName")))
                                .bodyToFlux(CenterResponse.class);
        }

        public Flux<CenterResponse> getCentersByAdminId(Long userId, String authHeader) {
                return centerWebClient
                                .get()
                                .uri("/api/centers/admin/{userId}", userId)
                                .headers(h -> addAuthHeader(h, authHeader))
                                .retrieve()
                                .onStatus(HttpStatusCode::is4xxClientError,
                                                cr -> Mono.error(new RuntimeException(
                                                                "Client error during getCentersByAdminId")))
                                .onStatus(HttpStatusCode::is5xxServerError,
                                                cr -> Mono.error(new RuntimeException(
                                                                "Server error during getCentersByAdminId")))
                                .bodyToFlux(CenterResponse.class);
        }

        public Mono<CenterResponse> getCenterById(Long centerId, String authHeader) {
                return centerWebClient
                                .get()
                                .uri("/api/centers/{centerId}", centerId)
                                .headers(h -> addAuthHeader(h, authHeader))
                                .retrieve()
                                .onStatus(HttpStatusCode::is4xxClientError,
                                                cr -> Mono.error(new RuntimeException(
                                                                "Client error during getCenterById")))
                                .onStatus(HttpStatusCode::is5xxServerError,
                                                cr -> Mono.error(new RuntimeException(
                                                                "Server error during getCenterById")))
                                .bodyToMono(CenterResponse.class);
        }

        public Mono<Void> createCenter(Long userId, CenterRequest request, String authHeader) {
                return centerWebClient
                                .post()
                                .uri("/api/centers/create/user/{userId}", userId)
                                .headers(h -> addAuthHeader(h, authHeader))
                                .bodyValue(request)
                                .retrieve()
                                .onStatus(HttpStatusCode::is4xxClientError,
                                                cr -> cr.bodyToMono(String.class)
                                                                .flatMap(body -> Mono.error(new RuntimeException(
                                                                                "Client error during createCenter: " + body))))
                                .onStatus(HttpStatusCode::is5xxServerError,
                                                cr -> cr.bodyToMono(String.class)
                                                                .flatMap(body -> Mono.error(new RuntimeException(
                                                                                "Server error during createCenter: " + body))))
                                .bodyToMono(Void.class);
        }

        public Mono<Void> addCenterAdmin(Long centerId, Long userId, String authHeader) {
                return centerWebClient
                                .post()
                                .uri("/api/centers/{centerId}/add-admin/{userId}", centerId, userId)
                                .headers(h -> addAuthHeader(h, authHeader))
                                .retrieve()
                                .onStatus(HttpStatusCode::is4xxClientError,
                                                cr -> Mono.error(new RuntimeException(
                                                                "Client error during addCenterAdmin")))
                                .onStatus(HttpStatusCode::is5xxServerError,
                                                cr -> Mono.error(new RuntimeException(
                                                                "Server error during addCenterAdmin")))
                                .bodyToMono(Void.class);
        }

        public Mono<Void> addCenterStaff(Long centerId, Long userId, String authHeader) {
                return centerWebClient
                                .post()
                                .uri("/api/centers/{centerId}/add-staff/{userId}", centerId, userId)
                                .headers(h -> addAuthHeader(h, authHeader))
                                .retrieve()
                                .onStatus(HttpStatusCode::is4xxClientError,
                                                cr -> Mono.error(new RuntimeException(
                                                                "Client error during addCenterStaff")))
                                .onStatus(HttpStatusCode::is5xxServerError,
                                                cr -> Mono.error(new RuntimeException(
                                                                "Server error during addCenterStaff")))
                                .bodyToMono(Void.class);
        }

        public Mono<Void> updateCenter(Long centerId, CenterRequest request, String authHeader) {
                return centerWebClient
                                .patch()
                                .uri("/api/centers/update/{centerId}", centerId)
                                .headers(h -> addAuthHeader(h, authHeader))
                                .bodyValue(request)
                                .retrieve()
                                .onStatus(HttpStatusCode::is4xxClientError,
                                                cr -> Mono.error(new RuntimeException(
                                                                "Client error during updateCenter")))
                                .onStatus(HttpStatusCode::is5xxServerError,
                                                cr -> Mono.error(new RuntimeException(
                                                                "Server error during updateCenter")))
                                .bodyToMono(Void.class);
        }

        public Mono<Void> deleteCenter(Long centerId, String authHeader) {
                return centerWebClient
                                .delete()
                                .uri("/api/centers/delete/{centerId}", centerId)
                                .headers(h -> addAuthHeader(h, authHeader))
                                .retrieve()
                                .onStatus(HttpStatusCode::is4xxClientError,
                                                cr -> Mono.error(new RuntimeException(
                                                                "Client error during deleteCenter")))
                                .onStatus(HttpStatusCode::is5xxServerError,
                                                cr -> Mono.error(new RuntimeException(
                                                                "Server error during deleteCenter")))
                                .bodyToMono(Void.class);
        }

        private void addAuthHeader(HttpHeaders headers, String authHeader) {
                if (authHeader != null && !authHeader.isBlank()) {
                        headers.add(HttpHeaders.AUTHORIZATION, authHeader);
                }
        }
}
