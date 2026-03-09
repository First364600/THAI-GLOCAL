package com.thaiglocal.server.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    // CORS is handled by Spring Security's CorsConfigurationSource bean
    // in UserSecurityConfig. No additional CORS mapping here to avoid conflicts.
}
