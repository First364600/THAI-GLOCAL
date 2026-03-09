package com.thaiglocal.webclient.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import com.thaiglocal.webclient.dto.request.FileRequest;
import com.thaiglocal.webclient.dto.response.FileResponse;

import reactor.core.publisher.Mono;

@Service
public class FileService {

    private final WebClient fileWebClient;

    public FileService(WebClient.Builder builder,
            @Value("${server.api.base-url:http://localhost:8081}") String baseUrl) {
        this.fileWebClient = builder
                .baseUrl(baseUrl)
                .build();
    }

    public Mono<FileResponse> upload(MultipartFile file, String cookieHeader) {
        MultipartBodyBuilder bodyBuilder = new MultipartBodyBuilder();
        bodyBuilder.part("file", file.getResource())
                .filename(file.getOriginalFilename())
                .contentType(MediaType.APPLICATION_OCTET_STREAM);

        return fileWebClient
                .post()
                .uri("/api/files/upload")
                .headers(h -> addCookie(h, cookieHeader))
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .bodyValue(bodyBuilder.build())
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError,
                        cr -> Mono.error(new RuntimeException("Client error during file upload")))
                .onStatus(HttpStatusCode::is5xxServerError,
                        cr -> Mono.error(new RuntimeException("Server error during file upload")))
                .bodyToMono(FileResponse.class);
    }

    public Mono<String> delete(FileRequest request, String cookieHeader) {
        return fileWebClient
                .method(HttpMethod.DELETE)
                .uri("/api/files/delete")
                .headers(h -> addCookie(h, cookieHeader))
                .bodyValue(request)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError,
                        cr -> Mono.error(new RuntimeException("Client error during file delete")))
                .onStatus(HttpStatusCode::is5xxServerError,
                        cr -> Mono.error(new RuntimeException("Server error during file delete")))
                .bodyToMono(String.class);
    }

    private void addCookie(HttpHeaders headers, String cookieHeader) {
        if (cookieHeader != null && !cookieHeader.isBlank()) {
            headers.add("Cookie", cookieHeader);
        }
    }
}
