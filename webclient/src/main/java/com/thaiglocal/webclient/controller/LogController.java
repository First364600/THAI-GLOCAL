
package com.thaiglocal.webclient.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import java.util.Map;

@RestController
@RequestMapping("/client/admin")
public class LogController {

    private final WebClient webClient;

    public LogController(WebClient.Builder builder,
                         @Value("${server.api.base-url:http://localhost:8081}") String baseUrl) {
        this.webClient = builder.baseUrl(baseUrl).build();
    }

    @GetMapping("/logs")
    public Flux<Map> getSystemLogs() {
        return webClient.get()
                .uri("/api/admin/logs")
                .retrieve()
                .bodyToFlux(Map.class);
    }
}

