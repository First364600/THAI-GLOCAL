package com.thaiglocal.webclient.service;

import com.thaiglocal.webclient.dto.request.CreateRegistrationRequest;
import com.thaiglocal.webclient.dto.request.UpdateRegistrationRequestStatus;
import com.thaiglocal.webclient.dto.response.RegistrationRequestResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class RegistrationRequestService {

    private final WebClient webClient;

    public RegistrationRequestService(WebClient.Builder builder,
                                      @Value("${server.api.base-url:http://localhost:8081}") String baseUrl) {
        this.webClient = builder.baseUrl(baseUrl).build();
    }

    public Mono<RegistrationRequestResponse> createRequest(CreateRegistrationRequest request, String cookieHeader) {
        return webClient.post()
                .uri("/api/registration-requests")
                .header(HttpHeaders.COOKIE, cookieHeader)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(RegistrationRequestResponse.class);
    }

    public Flux<RegistrationRequestResponse> getAllRequests(String cookieHeader) {
        return webClient.get()
                .uri("/api/admin/registration-requests")
                .header(HttpHeaders.COOKIE, cookieHeader)
                .retrieve()
                .bodyToFlux(RegistrationRequestResponse.class);
    }

    public Mono<RegistrationRequestResponse> updateStatus(Long id, UpdateRegistrationRequestStatus request, String cookieHeader) {
        return webClient.patch()
                .uri("/api/admin/registration-requests/{id}/status", id)
                .header(HttpHeaders.COOKIE, cookieHeader)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(RegistrationRequestResponse.class);
    }
}



