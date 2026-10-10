package com.smartpark.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * WebMvcConfigurer - CORS is now fully handled by Spring Security (SecurityConfig.corsConfigurationSource).
 * This class is kept for future MVC customizations.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    // CORS configuration delegated to SecurityConfig to ensure it applies before security filters.
}
