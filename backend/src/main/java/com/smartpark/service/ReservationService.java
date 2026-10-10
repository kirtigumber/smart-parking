package com.smartpark.service;

import com.smartpark.dto.ParkingWebSocketMessage;
import com.smartpark.dto.ReservationRequest;
import com.smartpark.dto.ReservationResponse;
import com.smartpark.entity.*;
import com.smartpark.exception.BadRequestException;
import com.smartpark.exception.ResourceNotFoundException;
import com.smartpark.exception.SlotUnavailableException;
import com.smartpark.repository.ParkingLotRepository;
import com.smartpark.repository.ParkingSlotRepository;
import com.smartpark.repository.ReservationRepository;
import com.smartpark.repository.UserRepository;
import com.smartpark.websocket.ParkingWebSocketHandler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ParkingLotRepository parkingLotRepository;
    private final ParkingSlotRepository parkingSlotRepository;
    private final UserRepository userRepository;
    private final ParkingLotService parkingLotService;
    private final QrCodeService qrCodeService;
    private final ParkingWebSocketHandler webSocketHandler;

    public ReservationService(ReservationRepository reservationRepository,
                              ParkingLotRepository parkingLotRepository,
                              ParkingSlotRepository parkingSlotRepository,
                              UserRepository userRepository,
                              ParkingLotService parkingLotService,
                              QrCodeService qrCodeService,
                              ParkingWebSocketHandler webSocketHandler) {
        this.reservationRepository = reservationRepository;
        this.parkingLotRepository = parkingLotRepository;
        this.parkingSlotRepository = parkingSlotRepository;
        this.userRepository = userRepository;
        this.parkingLotService = parkingLotService;
        this.qrCodeService = qrCodeService;
        this.webSocketHandler = webSocketHandler;
    }

    @Transactional
    public ReservationResponse createReservation(ReservationRequest req) {
        // 1. Fetch Parking Lot
        ParkingLot lot = parkingLotRepository.findById(req.getLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("Parking location not found: " + req.getLocationId()));

        // 2. Fetch Parking Slot
        ParkingSlot slot = parkingSlotRepository.findByParkingLotIdAndSlotNumber(req.getLocationId(), req.getSlotNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Slot " + req.getSlotNumber() + " not found in " + lot.getName()));

        // 3. Validation: Prevent booking an unavailable slot
        if (slot.getStatus() != SlotStatus.AVAILABLE) {
            throw new SlotUnavailableException("Slot " + slot.getSlotNumber() + " is currently " +
                    slot.getStatus() + " and cannot be reserved.");
        }

        // 4. Find or associate User
        User user = null;
        if (req.getUserEmail() != null) {
            user = userRepository.findByEmail(req.getUserEmail()).orElse(null);
            if (user == null) {
                user = new User(
                        req.getUserName() != null ? req.getUserName() : "Driver User",
                        req.getUserEmail(),
                        null,
                        req.getVehicleNumber(),
                        null,
                        "USER"
                );
                user = userRepository.save(user);
            }
        }

        // 5. Generate unique Booking ID (e.g. SP10026)
        String bookingId;
        do {
            int randomNum = 10000 + new Random().nextInt(90000);
            bookingId = "SP" + randomNum;
        } while (reservationRepository.findByBookingId(bookingId).isPresent());

        // 6. Calculate amount
        double hours = (req.getHours() != null && req.getHours() > 0) ? req.getHours() : 2.0;
        double rate = lot.getHourlyRate() != null ? lot.getHourlyRate() : 5.0;
        double amount = Math.round((hours * rate) * 100.0) / 100.0;

        String timeRange = req.getStartTime() + " – " + req.getEndTime();

        // 7. Create Reservation
        Reservation reservation = new Reservation(
                bookingId,
                user,
                lot,
                slot,
                lot.getName(),
                lot.getLocation(),
                slot.getSlotNumber(),
                req.getDate(),
                timeRange,
                req.getStartTime(),
                req.getEndTime(),
                req.getVehicleNumber(),
                req.getUserName() != null ? req.getUserName() : "Alex Morgan",
                req.getUserEmail() != null ? req.getUserEmail() : "alex.morgan@smartpark.io",
                ReservationStatus.CONFIRMED,
                amount,
                rate,
                hours
        );

        // Generate genuine QR Code image data URL and unique verification token
        String qrPayload = "SMARTPARK:" + bookingId + ":" + lot.getId() + ":" + slot.getSlotNumber() + ":" + req.getVehicleNumber();
        String qrDataUrl = qrCodeService.generateQrCodeDataUrl(qrPayload, 260, 260);
        reservation.setQrCode(qrDataUrl);
        reservation.setQrToken(UUID.randomUUID().toString());
        reservation.setIsUsed(false);
        reservation.setEntryAllowed(false);

        Reservation savedReservation = reservationRepository.save(reservation);

        // 8. Update Slot Status to RESERVED
        slot.setStatus(SlotStatus.RESERVED);
        slot.setVehicle(req.getVehicleNumber());
        ParkingSlot savedSlot = parkingSlotRepository.save(slot);

        // 9. Recalculate lot counts
        Map<String, Integer> stats = parkingLotService.recalculateCounts(lot.getId());

        // 10. Broadcast real-time WebSocket update to all connected clients
        webSocketHandler.broadcast(new ParkingWebSocketMessage(
                "SLOT_UPDATE",
                lot.getId(),
                savedSlot.getSlotNumber(),
                savedSlot.getId(),
                "reserved",
                savedSlot.getVehicle(),
                stats.get("totalSlots"),
                stats.get("availableSlots"),
                stats.get("occupiedSlots"),
                stats.get("reservedSlots"),
                stats.get("occupancyPercentage")
        ));

        return convertToDTO(savedReservation);
    }

    @Transactional
    public ReservationResponse cancelReservation(String bookingId) {
        Reservation reservation = reservationRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with Booking ID: " + bookingId));

        if (reservation.getStatus() == ReservationStatus.CANCELLED) {
            return convertToDTO(reservation);
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
        Reservation updatedReservation = reservationRepository.save(reservation);

        // Revert slot status back to AVAILABLE
        ParkingSlot slot = reservation.getParkingSlot();
        if (slot != null) {
            slot.setStatus(SlotStatus.AVAILABLE);
            slot.setVehicle(null);
            ParkingSlot savedSlot = parkingSlotRepository.save(slot);

            // Recalculate lot counts
            String lotId = reservation.getParkingLot().getId();
            Map<String, Integer> stats = parkingLotService.recalculateCounts(lotId);

            // Broadcast real-time WebSocket update
            webSocketHandler.broadcast(new ParkingWebSocketMessage(
                    "SLOT_UPDATE",
                    lotId,
                    savedSlot.getSlotNumber(),
                    savedSlot.getId(),
                    "available",
                    null,
                    stats.get("totalSlots"),
                    stats.get("availableSlots"),
                    stats.get("occupiedSlots"),
                    stats.get("reservedSlots"),
                    stats.get("occupancyPercentage")
            ));
        }

        return convertToDTO(updatedReservation);
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> getAllReservations() {
        return reservationRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReservationResponse getReservationByBookingId(String bookingId) {
        Reservation res = reservationRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found: " + bookingId));
        return convertToDTO(res);
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> getReservationsByUserEmail(String email) {
        return reservationRepository.findByUserEmailOrderByCreatedAtDesc(email)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * QR Verification logic meeting all Phase 4 criteria:
     * - Valid booking
     * - Expired booking
     * - Cancelled booking
     * - Already-used QR
     * - Invalid QR
     */
    @Transactional(readOnly = true)
    public Map<String, Object> verifyQrTicket(String rawInput) {
        if (rawInput == null || rawInput.trim().isEmpty()) {
            return Map.of(
                    "found", false,
                    "isValid", false,
                    "verificationStatus", "INVALID",
                    "error", "Invalid QR Code: Input payload is empty."
            );
        }

        String bookingId = rawInput.trim();
        // Support scanning raw QR payload "SMARTPARK:SP10025:..."
        if (bookingId.startsWith("SMARTPARK:")) {
            String[] parts = bookingId.split(":");
            if (parts.length > 1) {
                bookingId = parts[1];
            }
        }
        bookingId = bookingId.toUpperCase();

        Reservation reservation = reservationRepository.findByBookingId(bookingId).orElse(null);

        // Check 1: Invalid QR (booking not found)
        if (reservation == null) {
            return Map.of(
                    "found", false,
                    "isValid", false,
                    "verificationStatus", "INVALID",
                    "error", "Invalid QR Code: No reservation record found for ID " + bookingId + "."
            );
        }

        // Check 2: Cancelled booking
        if (reservation.getStatus() == ReservationStatus.CANCELLED) {
            return Map.of(
                    "found", true,
                    "isValid", false,
                    "verificationStatus", "CANCELLED",
                    "message", "Access Denied: Reservation is CANCELLED. Permit invalid.",
                    "booking", convertToDTO(reservation)
            );
        }

        // Check 3: Already-used QR
        if (Boolean.TRUE.equals(reservation.getIsUsed())) {
            String usedTime = reservation.getUsedAt() != null
                    ? reservation.getUsedAt().format(DateTimeFormatter.ofPattern("hh:mm a, dd MMM yyyy"))
                    : "an earlier time";
            return Map.of(
                    "found", true,
                    "isValid", false,
                    "verificationStatus", "ALREADY_USED",
                    "message", "Access Denied: QR code was ALREADY USED for entry at " + usedTime + ".",
                    "booking", convertToDTO(reservation)
            );
        }

        // Check 4: Expired booking
        if (reservation.getStatus() == ReservationStatus.COMPLETED) {
            return Map.of(
                    "found", true,
                    "isValid", false,
                    "verificationStatus", "EXPIRED",
                    "message", "Access Denied: Reservation period has EXPIRED / Completed.",
                    "booking", convertToDTO(reservation)
            );
        }

        // Check 5: Valid booking (CONFIRMED and not yet used)
        return Map.of(
                "found", true,
                "isValid", true,
                "verificationStatus", "VALID",
                "message", "✓ Valid Parking Permit. Gate opening authorized for " + reservation.getVehicleNumber() + ".",
                "booking", convertToDTO(reservation)
        );
    }

    /**
     * Phase 4 Parking Entry Flow:
     * Scanned QR -> Valid -> Entry Allowed -> Slot becomes OCCUPIED -> WebSocket broadcasts update!
     */
    @Transactional
    public Map<String, Object> admitVehicle(String rawInput) {
        Map<String, Object> verification = verifyQrTicket(rawInput);
        if (!Boolean.TRUE.equals(verification.get("isValid"))) {
            throw new BadRequestException((String) verification.getOrDefault("message", "Ticket is not valid for entry"));
        }

        ReservationResponse dto = (ReservationResponse) verification.get("booking");
        Reservation reservation = reservationRepository.findByBookingId(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found: " + dto.getId()));

        // Mark QR as used and entry allowed
        reservation.setIsUsed(true);
        reservation.setUsedAt(LocalDateTime.now());
        reservation.setEntryAllowed(true);
        reservationRepository.save(reservation);

        // Transition slot status from RESERVED -> OCCUPIED
        ParkingSlot slot = reservation.getParkingSlot();
        if (slot != null) {
            slot.setStatus(SlotStatus.OCCUPIED);
            slot.setVehicle(reservation.getVehicleNumber());
            parkingSlotRepository.save(slot);

            String lotId = reservation.getParkingLot().getId();
            Map<String, Integer> stats = parkingLotService.recalculateCounts(lotId);

            // Broadcast real-time update to all connected WebSocket clients
            webSocketHandler.broadcast(new ParkingWebSocketMessage(
                    "SLOT_UPDATE",
                    lotId,
                    slot.getSlotNumber(),
                    slot.getId(),
                    "occupied",
                    slot.getVehicle(),
                    stats.get("totalSlots"),
                    stats.get("availableSlots"),
                    stats.get("occupiedSlots"),
                    stats.get("reservedSlots"),
                    stats.get("occupancyPercentage")
            ));
        }

        return Map.of(
                "success", true,
                "message", "✓ Entry Allowed: Barrier gate opened. Slot " + reservation.getSlot() + " marked as OCCUPIED.",
                "booking", convertToDTO(reservation)
        );
    }

    public ReservationResponse convertToDTO(Reservation res) {
        ReservationResponse dto = new ReservationResponse();
        dto.setId(res.getBookingId());
        dto.setParkingId(res.getParkingLot() != null ? res.getParkingLot().getId() : null);
        dto.setParkingName(res.getParkingName());
        dto.setLocationAddress(res.getLocationAddress());
        dto.setSlot(res.getSlot());
        dto.setDate(res.getDate());
        dto.setTime(res.getTime());
        dto.setStartTime(res.getStartTime());
        dto.setEndTime(res.getEndTime());
        dto.setVehicleNumber(res.getVehicleNumber());
        dto.setStatus(capitalize(res.getStatus().name()));
        dto.setAmount(res.getAmount());
        dto.setRatePerHour(res.getRatePerHour());
        dto.setHours(res.getHours());
        dto.setUserName(res.getUserName());
        dto.setUserEmail(res.getUserEmail());
        dto.setCreatedAt(res.getCreatedAt() != null ? res.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null);
        dto.setQrCode(res.getQrCode());
        dto.setIsUsed(res.getIsUsed());
        dto.setUsedAt(res.getUsedAt() != null ? res.getUsedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null);
        dto.setEntryAllowed(res.getEntryAllowed());
        return dto;
    }

    private String capitalize(String str) {
        if (str == null || str.isEmpty()) return str;
        return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
    }
}
