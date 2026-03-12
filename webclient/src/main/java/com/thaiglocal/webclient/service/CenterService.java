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

        public Flux<CenterResponse> getAllCenters(String cookieHeader) {
                return centerWebClient
                                .get()
                                .uri("/api/centers")
                                .headers(h -> addCookie(h, cookieHeader))
                                .retrieve()
                                .onStatus(HttpStatusCode::is4xxClientError, cr -> clientError(cr, "getAllCenters"))
                                .onStatus(HttpStatusCode::is5xxServerError, cr -> serverError(cr, "getAllCenters"))
                                .bodyToFlux(CenterResponse.class);
        }

        public Flux<CenterResponse> searchCentersByName(String centerName, String cookieHeader) {
                return centerWebClient
                                .get()
                                .uri(uriBuilder -> uriBuilder
                                                .path("/api/centers/search")
                                                .queryParam("name", centerName)
                                                .build())
                                .headers(h -> addCookie(h, cookieHeader))
                                .retrieve()
                                .onStatus(HttpStatusCode::is4xxClientError, cr -> clientError(cr, "searchCentersByName"))
                                .onStatus(HttpStatusCode::is5xxServerError, cr -> serverError(cr, "searchCentersByName"))
                                .bodyToFlux(CenterResponse.class);
        }

        public Flux<CenterResponse> getCentersByAdminId(Long userId, String cookieHeader) {
                return centerWebClient
                                .get()
                                .uri("/api/centers/admin/{userId}", userId)
                                .headers(h -> addCookie(h, cookieHeader))
                                .retrieve()
                                .onStatus(HttpStatusCode::is4xxClientError, cr -> clientError(cr, "getCentersByAdminId"))
                                .onStatus(HttpStatusCode::is5xxServerError, cr -> serverError(cr, "getCentersByAdminId"))
                                .bodyToFlux(CenterResponse.class);
        }

        public Mono<CenterResponse> getCenterById(Long centerId, String cookieHeader) {
                return centerWebClient
                                .get()
                                .uri("/api/centers/{centerId}", centerId)
                                .headers(h -> addCookie(h, cookieHeader))
                                .retrieve()
                                .onStatus(HttpStatusCode::is4xxClientError, cr -> clientError(cr, "getCenterById"))
                                .onStatus(HttpStatusCode::is5xxServerError, cr -> serverError(cr, "getCenterById"))
                                .bodyToMono(CenterResponse.class);
        }

        public Mono<Void> createCenter(Long userId, CenterRequest request, String cookieHeader) {
                return centerWebClient
                                .post()
                                .uri("/api/centers/create/user/{userId}", userId)
                                .headers(h -> addCookie(h, cookieHeader))
                                .bodyValue(request)
                                .retrieve()
                                .onStatus(HttpStatusCode::is4xxClientError, cr -> clientError(cr, "createCenter"))
                                .onStatus(HttpStatusCode::is5xxServerError, cr -> serverError(cr, "createCenter"))
                                .bodyToMono(Void.class);
        }

        public Mono<Void> addCenterAdmin(Long centerId, Long userId, String cookieHeader) {
                return centerWebClient
                                .post()
                                .uri("/api/centers/{centerId}/add-admin/{userId}", centerId, userId)
                                .headers(h -> addCookie(h, cookieHeader))
                                .retrieve()
                                .onStatus(HttpStatusCode::is4xxClientError, cr -> clientError(cr, "addCenterAdmin"))
                                .onStatus(HttpStatusCode::is5xxServerError, cr -> serverError(cr, "addCenterAdmin"))
                                .bodyToMono(Void.class);
        }

        public Mono<Void> addCenterStaff(Long centerId, Long userId, String cookieHeader) {
                return centerWebClient
                                .post()
                                .uri("/api/centers/{centerId}/add-staff/{userId}", centerId, userId)
                                .headers(h -> addCookie(h, cookieHeader))
                                .retrieve()
                                .onStatus(HttpStatusCode::is4xxClientError, cr -> clientError(cr, "addCenterStaff"))
                                .onStatus(HttpStatusCode::is5xxServerError, cr -> serverError(cr, "addCenterStaff"))
                                .bodyToMono(Void.class);
        }

        public Mono<Void> updateCenter(Long centerId, CenterRequest request, String cookieHeader) {
                return centerWebClient
                                .patch()
                                .uri("/api/centers/update/{centerId}", centerId)
                                .headers(h -> addCookie(h, cookieHeader))
                                .bodyValue(request)
                                .retrieve()
                                .onStatus(HttpStatusCode::is4xxClientError, cr -> clientError(cr, "updateCenter"))
                                .onStatus(HttpStatusCode::is5xxServerError, cr -> serverError(cr, "updateCenter"))
                                .bodyToMono(Void.class);
        }

        public Mono<Void> deleteCenter(Long centerId, String cookieHeader) {
                return centerWebClient
                                .delete()
                                .uri("/api/centers/delete/{centerId}", centerId)
                                .headers(h -> addCookie(h, cookieHeader))
                                .retrieve()
                                .onStatus(HttpStatusCode::is4xxClientError, cr -> clientError(cr, "deleteCenter"))
                                .onStatus(HttpStatusCode::is5xxServerError, cr -> serverError(cr, "deleteCenter"))
                                .bodyToMono(Void.class);
        }

        public Flux<CenterResponse> getPendingCenters(String cookieHeader) {
                return centerWebClient
                                .get()
                                .uri("/api/centers/admin/pending")
                                .headers(h -> addCookie(h, cookieHeader))
                                .retrieve()
                                .onStatus(HttpStatusCode::is4xxClientError, cr -> clientError(cr, "getPendingCenters"))
                                .onStatus(HttpStatusCode::is5xxServerError, cr -> serverError(cr, "getPendingCenters"))
                                .bodyToFlux(CenterResponse.class);
        }

        public Mono<Void> updateCenterStatus(Long centerId, String status, String cookieHeader) {
                return centerWebClient
                                .patch()
                                .uri(uriBuilder -> uriBuilder
                                                .path("/api/centers/{centerId}/status")
                                                .queryParam("status", status)
                                                .build(centerId))
                                .headers(h -> addCookie(h, cookieHeader))
                                .retrieve()
                                .onStatus(HttpStatusCode::is4xxClientError, cr -> clientError(cr, "updateCenterStatus"))
                                .onStatus(HttpStatusCode::is5xxServerError, cr -> serverError(cr, "updateCenterStatus"))
                                .bodyToMono(Void.class);
        }

        private void addCookie(HttpHeaders headers, String cookieHeader) {
                if (cookieHeader != null && !cookieHeader.isBlank()) {
                        headers.add("Cookie", cookieHeader);
                }
        }

        /** Extracts the response body and includes it in the exception message for easier debugging. */
        private Mono<? extends Throwable> serverError(org.springframework.web.reactive.function.client.ClientResponse cr, String operation) {
                return cr.bodyToMono(String.class)
                                .defaultIfEmpty("<empty body>")
                                .flatMap(body -> Mono.error(new RuntimeException(
                                                "[" + operation + "] Server error: " + body)));
        }

        private Mono<? extends Throwable> clientError(org.springframework.web.reactive.function.client.ClientResponse cr, String operation) {
                return cr.bodyToMono(String.class)
                                .defaultIfEmpty("<empty body>")
                                .flatMap(body -> Mono.error(new RuntimeException(
                                                "[" + operation + "] Client error: " + body)));
        }
}
