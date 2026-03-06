package com.thaiglocal.server.controller;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.thaiglocal.server.dto.request.FileRequest;
import com.thaiglocal.server.dto.response.FileResponse;
import com.thaiglocal.server.service.FileService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/files")
public class FileController {
    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/upload")
    public ResponseEntity<FileResponse> uploadCenterImage(@RequestParam("file") MultipartFile file) throws IOException {
        FileResponse fileResponse = fileService.uploadCenterImage(file);
        return ResponseEntity.ok(fileResponse);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteFile(@Valid @RequestBody FileRequest fileRequest) {
        fileService.deleteImage(fileRequest.getImageUrl());
        return ResponseEntity.ok("Deleted successfully");
    }
}
