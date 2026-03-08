package com.thaiglocal.webclient.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.thaiglocal.webclient.dto.request.FileRequest;
import com.thaiglocal.webclient.dto.response.FileResponse;
import com.thaiglocal.webclient.service.FileService;

import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/client/files")
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/upload")
    public Mono<ResponseEntity<FileResponse>> upload(
            @RequestParam("file") MultipartFile file,
            @RequestHeader(value = "Cookie", required = false) String cookieHeader) {
        return fileService.upload(file, cookieHeader)
                .map(ResponseEntity::ok);
    }

    @DeleteMapping("/delete")
    public Mono<ResponseEntity<String>> delete(
            @RequestBody FileRequest request,
            @RequestHeader(value = "Cookie", required = false) String cookieHeader) {
        return fileService.delete(request, cookieHeader)
                .map(ResponseEntity::ok);
    }
}
