package com.smartpark.controller;

import com.smartpark.dto.UserDTO;
import com.smartpark.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Admin: list all users
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // Get user by email (authenticated)
    @GetMapping("/{email}")
    public ResponseEntity<UserDTO> getUserByEmail(@PathVariable String email) {
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    // Update profile (authenticated)
    @PutMapping("/{email}")
    public ResponseEntity<UserDTO> updateProfile(@PathVariable String email, @RequestBody UserDTO dto) {
        return ResponseEntity.ok(userService.updateProfile(email, dto));
    }
}
