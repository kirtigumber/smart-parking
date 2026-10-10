package com.smartpark.controller;

import com.smartpark.dto.AuthResponse;
import com.smartpark.dto.LoginRequest;
import com.smartpark.dto.RegisterRequest;
import com.smartpark.dto.UserDTO;
import com.smartpark.security.JwtUtil;
import com.smartpark.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authenticationManager,
                          UserService userService,
                          JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    /**
     * POST /api/auth/login
     * Authenticates user and returns JWT token + user info.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        String cleanEmail = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(cleanEmail, request.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            UserDTO user = userService.getUserByEmail(cleanEmail);
            String role = user.getRole() != null ? user.getRole().toUpperCase() : "USER";
            String token = jwtUtil.generateToken(user.getEmail(), role);

            return ResponseEntity.ok(new AuthResponse(token, user));
        } catch (BadCredentialsException e) {
            org.slf4j.LoggerFactory.getLogger(AuthController.class)
                    .warn("Login failed for email: {}. Reason: Invalid email or password.", cleanEmail);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password", "status", 401));
        }
    }

    /**
     * POST /api/auth/register
     * Registers a new user and returns JWT token + user info.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        UserDTO newUser = userService.registerUserWithPassword(request);
        String role = newUser.getRole() != null ? newUser.getRole().toUpperCase() : "USER";
        String token = jwtUtil.generateToken(newUser.getEmail(), role);
        return new ResponseEntity<>(new AuthResponse(token, newUser), HttpStatus.CREATED);
    }

    /**
     * GET /api/auth/me
     * Returns the currently authenticated user's profile (requires valid JWT).
     */
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }
}
