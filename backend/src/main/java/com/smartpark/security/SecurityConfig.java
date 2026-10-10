package com.smartpark.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;
    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(UserDetailsServiceImpl userDetailsService, JwtAuthFilter jwtAuthFilter) {
        this.userDetailsService = userDetailsService;
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("http://localhost:*", "http://127.0.0.1:*", "*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF (stateless JWT — no sessions)
            .csrf(AbstractHttpConfigurer::disable)
            // Use SecurityConfig CORS (Spring Security must see it before other filters)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // Stateless session
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // Authorization rules
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers(HttpMethod.POST, "/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // Public GET: parking lots, slots, QR verify, home stats
                .requestMatchers(HttpMethod.GET, "/api/parking-lots/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/parking-slots/**").permitAll()
                .requestMatchers("/api/reservations/verify/**").permitAll()
                // WebSocket endpoints
                .requestMatchers("/ws/**", "/ws/parking/**").permitAll()
                // H2 console (dev only)
                .requestMatchers("/h2-console/**").permitAll()
                // Admin-only management endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/users").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/parking-lots/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/parking-lots/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/parking-lots/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/parking-slots/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/parking-slots/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/parking-slots/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/parking-slots/**").hasRole("ADMIN")
                // Authenticated users (USER or ADMIN)
                .requestMatchers("/api/auth/me").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/reservations").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/reservations/user/**").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/reservations/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/reservations/*/cancel").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/reservations/*/cancel").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/users/**").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/users/**").authenticated()
                // Anything else requires authentication
                .anyRequest().authenticated()
            )
            // Add JWT filter before username/password filter
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            // Authentication provider
            .authenticationProvider(authenticationProvider());

        // Allow H2 console frames in dev
        http.headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()));

        return http.build();
    }
}
