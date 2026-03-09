package com.thaiglocal.webclient.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder()
            .defaultHeader("Content-Type", "application/json")
            .filter((request, next) -> {
                // Forward incoming servlet cookies to downstream calls
                ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
                if (attributes != null) {
                    HttpServletRequest httpRequest = attributes.getRequest();
                    Cookie[] cookies = httpRequest.getCookies();
                    if (cookies != null) {
                        StringBuilder cookieHeader = new StringBuilder();
                        for (Cookie cookie : cookies) {
                            if (cookieHeader.length() > 0) cookieHeader.append("; ");
                            cookieHeader.append(cookie.getName()).append("=").append(cookie.getValue());
                        }
                        if (cookieHeader.length() > 0) {
                            return next.exchange(
                                org.springframework.web.reactive.function.client.ClientRequest.from(request)
                                    .header("Cookie", cookieHeader.toString())
                                    .build()
                            );
                        }
                    }
                }
                return next.exchange(request);
            });
    }

    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        return builder
            .baseUrl("http://localhost:8081/api")
            .build();
    }
}