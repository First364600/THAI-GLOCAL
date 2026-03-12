
package com.thaiglocal.server.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin")
public class LogController {

    @GetMapping("/logs")
    public ResponseEntity<List<Map<String, Object>>> getSystemLogs() {
        // Dummy System Logs for immediate unblocking of 404s
        return ResponseEntity.ok(List.of(
                Map.of("id", 1, "message", "System initialization completed.", "timestamp", LocalDateTime.now()),
                Map.of("id", 2, "message", "Database migrated successfully.", "timestamp", LocalDateTime.now()),
                Map.of("id", 3, "message", "Server is ready to accept connections.", "timestamp", LocalDateTime.now())
        ));
    }
}

