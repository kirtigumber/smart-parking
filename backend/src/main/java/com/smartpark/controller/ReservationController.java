package com.smartpark.controller;

import com.smartpark.dto.ReservationRequest;
import com.smartpark.dto.ReservationResponse;
import com.smartpark.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(@Valid @RequestBody ReservationRequest request) {
        ReservationResponse response = reservationService.createReservation(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ReservationResponse>> getAllReservations() {
        List<ReservationResponse> reservations = reservationService.getAllReservations();
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<ReservationResponse> getReservationByBookingId(@PathVariable String bookingId) {
        ReservationResponse response = reservationService.getReservationByBookingId(bookingId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<List<ReservationResponse>> getReservationsByUser(@PathVariable String email) {
        List<ReservationResponse> reservations = reservationService.getReservationsByUserEmail(email);
        return ResponseEntity.ok(reservations);
    }

    @RequestMapping(value = "/{bookingId}/cancel", method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<ReservationResponse> cancelReservation(@PathVariable String bookingId) {
        ReservationResponse response = reservationService.cancelReservation(bookingId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/verify/{bookingId}")
    public ResponseEntity<Map<String, Object>> verifyQrTicket(@PathVariable String bookingId) {
        Map<String, Object> result = reservationService.verifyQrTicket(bookingId);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/verify/{bookingId}/admit")
    public ResponseEntity<Map<String, Object>> admitVehicle(@PathVariable String bookingId) {
        Map<String, Object> result = reservationService.admitVehicle(bookingId);
        return ResponseEntity.ok(result);
    }
}
