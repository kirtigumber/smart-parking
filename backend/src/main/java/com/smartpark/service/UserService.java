package com.smartpark.service;

import com.smartpark.dto.RegisterRequest;
import com.smartpark.dto.UserDTO;
import com.smartpark.entity.User;
import com.smartpark.exception.BadRequestException;
import com.smartpark.exception.ResourceNotFoundException;
import com.smartpark.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserDTO getUserByEmail(String email) {
        String cleanEmail = email != null ? email.trim() : "";
        User user = userRepository.findByEmailIgnoreCase(cleanEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + cleanEmail));
        return convertToDTO(user);
    }

    /**
     * Phase 3: Register user with BCrypt password hashing.
     * Called from AuthController.
     */
    @Transactional
    public UserDTO registerUserWithPassword(RegisterRequest request) {
        String cleanEmail = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        if (userRepository.existsByEmailIgnoreCase(cleanEmail)) {
            throw new BadRequestException("An account with this email already exists.");
        }

        User user = new User(
                request.getName() != null ? request.getName().trim() : "Smart Driver",
                cleanEmail,
                request.getPhone() != null ? request.getPhone().trim() : "",
                request.getVehicleNumber() != null ? request.getVehicleNumber().trim().toUpperCase() : "",
                request.getVehicleModel() != null ? request.getVehicleModel().trim() : "Standard Vehicle",
                "USER"
        );
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User saved = userRepository.save(user);
        return convertToDTO(saved);
    }

    /**
     * Phase 2 backward-compatible register (no password — used by legacy UserController).
     */
    @Transactional
    public UserDTO registerUser(UserDTO dto) {
        if (dto.getEmail() == null || dto.getEmail().trim().isEmpty()) {
            throw new BadRequestException("Email is required for registration.");
        }
        if (userRepository.existsByEmail(dto.getEmail())) {
            User existing = userRepository.findByEmail(dto.getEmail()).get();
            return convertToDTO(existing);
        }

        User user = new User(
                dto.getName() != null ? dto.getName() : "Smart Driver",
                dto.getEmail(),
                dto.getPhone(),
                dto.getVehicleNumber() != null ? dto.getVehicleNumber() : "HR00XX0000",
                dto.getVehicleModel() != null ? dto.getVehicleModel() : "Sedan",
                dto.getRole() != null ? dto.getRole() : "USER"
        );
        User saved = userRepository.save(user);
        return convertToDTO(saved);
    }

    @Transactional
    public UserDTO updateProfile(String email, UserDTO dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        if (dto.getVehicleNumber() != null) user.setVehicleNumber(dto.getVehicleNumber());
        if (dto.getVehicleModel() != null) user.setVehicleModel(dto.getVehicleModel());

        User updated = userRepository.save(user);
        return convertToDTO(updated);
    }

    /**
     * Called by DataSeeder to set hashed passwords on seed users.
     */
    @Transactional
    public void setPasswordForSeededUser(String email, String rawPassword) {
        String cleanEmail = email != null ? email.trim() : "";
        userRepository.findByEmailIgnoreCase(cleanEmail).ifPresent(user -> {
            user.setPassword(passwordEncoder.encode(rawPassword));
            userRepository.save(user);
        });
    }

    public UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setVehicleNumber(user.getVehicleNumber());
        dto.setVehicleModel(user.getVehicleModel());
        dto.setRole(user.getRole() != null ? user.getRole().toLowerCase() : "user");
        dto.setMemberSince(user.getMemberSince());
        return dto;
    }
}
