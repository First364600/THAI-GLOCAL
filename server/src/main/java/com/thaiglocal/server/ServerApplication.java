package com.thaiglocal.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.thaiglocal.server.model.User;
import com.thaiglocal.server.model.enums.RoleName;
import com.thaiglocal.server.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDateTime;

@SpringBootApplication
public class ServerApplication {

    @Value("${system.admin.username}")
    private String adminUsername;

    @Value("${system.admin.email}")
    private String adminEmail;

    @Value("${system.admin.password}")
    private String adminPassword;

    public static void main(String[] args) {
        SpringApplication.run(ServerApplication.class, args);
    }

    @Bean
    public CommandLineRunner initSystemAdmin(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder
    ) {
        return args -> {
            boolean exists = userRepository.existsByRole(RoleName.SYSTEM_ADMIN);
            if (!exists) {
                User admin = new User();
                admin.setUsername(adminUsername);
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setRole(RoleName.SYSTEM_ADMIN);
                admin.setFirstName("System");
                admin.setLastName("Admin");
                admin.setCreatedAt(LocalDateTime.now());
                admin.setIsActive(true);
                userRepository.save(admin);
                System.out.println("System Admin created.");
            }
        };
    }
}
