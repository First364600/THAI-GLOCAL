package com.thaiglocal.webclient.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.thaiglocal.webclient.dto.request.WorkshopCreateRequest;
import com.thaiglocal.webclient.dto.request.WorkshopUpdateRequest;
import com.thaiglocal.webclient.dto.response.WorkshopResponse;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class WorkshopService {

        private final WebClient workshopWebClient;

        public WorkshopService(WebClient.Builder builder,
                        @Value("${server.api.base-url:http://localhost:8081}") String baseUrl) {
                this.workshopWebClient = builder
                                .baseUrl(baseUrl)
                                .build();
        }

        public Flux<WorkshopResponse> getAll(String cookieHeader) {
                return workshopWebClient
                                .get()
                                .uri("/api/workshops")
                                .headers(h -> addCookie(h, cookieHeader))
                                .retrieve()
                                .onStatus(HttpStatusCode::is4xxClientError,
                                                cr -> Mono.error(new RuntimeException(
                                                                "Client error during getAll workshops")))
                                .onStatus(HttpStatusCode::is5xxServerError,
                                                cr -> Mono.error(new RuntimeException(
                                                                "Server error during getAll workshops")))
                                .bodyToFlux(WorkshopResponse.class);
        }

        public Mono<WorkshopResponse> getById(Long workshopId, String cookieHeader) {
                return workshopWebClient
                                .get()
                                .uri("/api/workshops/{workshopId}", workshopId)
                                .headers(h -> addCookie(h, cookieHeader))
                                .retrieve()
                                .onStatus(HttpStatusCode::is4xxClientError,
                                                cr -> Mono.error(new RuntimeException("Client error during getById")))
                                .onStatus(HttpStatusCode::is5xxServerError,
                                                cr -> Mono.error(new RuntimeException("Server error during getById")))
                                .bodyToMono(WorkshopResponse.class);
        }

        public Flux<WorkshopResponse> searchByName(String name, String cookieHeader) {
                return workshopWebClient
                                .get()
                                .uri(uriBuilder -> uriBuilder.path("/api/workshops/search").queryParam("name", name)
                                                .build())
                                .headers(h -> addCookie(h, cookieHeader))
                                .retrieve()
                                .onStatus(HttpStatusCode::is4xxClientError,
                                                cr -> Mono.error(new RuntimeException(
                                                                "Client error during searchByName")))
                                .onStatus(HttpStatusCode::is5xxServerError,
                                                cr -> Mono.error(new RuntimeException(
                                                                "Server error during searchByName")))
                                .bodyToFlux(WorkshopResponse.class);
        }

        public Flux<WorkshopResponse> getByType(String workshopType, String cookieHeader) {
                return workshopWebClient
                                .get()
                                .uri("/api/workshops/type/{workshopType}", workshopType)
                                .headers(h -> addCookie(h, cookieHeader))
                                .retrieve()
                                .onStatus(HttpStatusCode::is4xxClientError,
                                                cr -> Mono.error(new RuntimeException("Client error during getByType")))
                                .onStatus(HttpStatusCode::is5xxServerError,
                                                cr -> Mono.error(new RuntimeException("Server error during getByType")))
                                .bodyToFlux(WorkshopResponse.class);
        }

        public Flux<WorkshopResponse> getByCenter(Long centerId, String cookieHeader) {
                return workshopWebClient
                                .get()
                                .uri("/api/workshops/center/{centerId}", centerId)
                                .headers(h -> addCookie(h, cookieHeader))
                                .retrieve()
                                .onStatus(HttpStatusCode::is4xxClientError,
                                                cr -> Mono.error(new RuntimeException(
                                                                "Client error during getByCenter")))
                                .onStatus(HttpStatusCode::is5xxServerError,
                                                cr -> Mono.error(new RuntimeException(
                                                                "Server error during getByCenter")))
                                .bodyToFlux(WorkshopResponse.class);
        }

        public Flux<WorkshopResponse> getByCenterAndType(Long centerId, String workshopType, String cookieHeader) {
                return workshopWebClient
                                .get()
                                .uri("/api/workshops/center/{centerId}/type/{workshopType}", centerId, workshopType)
                                .headers(h -> addCookie(h, cookieHeader))
                                .retrieve()
                                .onStatus(HttpStatusCode::is4xxClientError,
                                                cr -> Mono.error(new RuntimeException(
                                                                "Client error during getByCenterAndType")))
                                .onStatus(HttpStatusCode::is5xxServerError,
                                                cr -> Mono.error(new RuntimeException(
                                                                "Server error during getByCenterAndType")))
                                .bodyToFlux(WorkshopResponse.class);
        }

        public Mono<Void> create(WorkshopCreateRequest request, String cookieHeader) {
                return workshopWebClient
                                .post()
                                .uri("/api/workshops/create")
                                .headers(h -> addCookie(h, cookieHeader))
                                .bodyValue(request)
                                .retrieve()
                                .onStatus(HttpStatusCode::is4xxClientError,
                                                cr -> Mono.error(new RuntimeException(
                                                                "Client error during create workshop")))
                                .onStatus(HttpStatusCode::is5xxServerError,
                                                cr -> Mono.error(new RuntimeException(
                                                                "Server error during create workshop")))
                                .bodyToMono(Void.class);
        }

        public Mono<Void> update(Long workshopId, WorkshopUpdateRequest request, String cookieHeader) {
                return workshopWebClient
                                .patch()
                                .uri("/api/workshops/update/{workshopId}", workshopId)
                                .headers(h -> addCookie(h, cookieHeader))
                                .bodyValue(request)
                                .retrieve()
                                .onStatus(HttpStatusCode::is4xxClientError,
                                                cr -> Mono.error(new RuntimeException(
                                                                "Client error during update workshop")))
                                .onStatus(HttpStatusCode::is5xxServerError,
                                                cr -> Mono.error(new RuntimeException(
                                                                "Server error during update workshop")))
                                .bodyToMono(Void.class);
        }

        public Mono<Void> delete(Long workshopId, String cookieHeader) {
                return workshopWebClient
                                .delete()
                                .uri("/api/workshops/delete/{workshopId}", workshopId)
                                .headers(h -> addCookie(h, cookieHeader))
                                .retrieve()
                                .onStatus(HttpStatusCode::is4xxClientError,
                                                cr -> Mono.error(new RuntimeException(
                                                                "Client error during delete workshop")))
                                .onStatus(HttpStatusCode::is5xxServerError,
                                                cr -> Mono.error(new RuntimeException(
                                                                "Server error during delete workshop")))
                                .bodyToMono(Void.class);
        }

        private void addCookie(HttpHeaders headers, String cookieHeader) {
                if (cookieHeader != null && !cookieHeader.isBlank()) {
                        headers.add("Cookie", cookieHeader);
                }
        }
}
