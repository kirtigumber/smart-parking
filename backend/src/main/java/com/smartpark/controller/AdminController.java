package com.smartpark.controller;

import com.smartpark.dto.AdminDashboardDTO;
import com.smartpark.entity.SlotStatus;
import com.smartpark.repository.ParkingLotRepository;
import com.smartpark.repository.ParkingSlotRepository;
import com.smartpark.repository.ReservationRepository;
import com.smartpark.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ParkingLotRepository parkingLotRepository;
    private final ParkingSlotRepository parkingSlotRepository;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;

    public AdminController(ParkingLotRepository parkingLotRepository,
                           ParkingSlotRepository parkingSlotRepository,
                           ReservationRepository reservationRepository,
                           UserRepository userRepository) {
        this.parkingLotRepository = parkingLotRepository;
        this.parkingSlotRepository = parkingSlotRepository;
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminDashboardDTO> getAdminDashboardStats() {
        long totalParkingLots = parkingLotRepository.count();
        long totalSlots = parkingSlotRepository.count();
        long availableSlots = parkingSlotRepository.countByStatus(SlotStatus.AVAILABLE);
        long occupiedSlots = parkingSlotRepository.countByStatus(SlotStatus.OCCUPIED);
        long reservedSlots = parkingSlotRepository.countByStatus(SlotStatus.RESERVED);
        long totalReservations = reservationRepository.count();
        long totalUsers = userRepository.count();

        int occupancyPercentage = totalSlots > 0
                ? (int) Math.round(((double) (occupiedSlots + reservedSlots) / totalSlots) * 100)
                : 0;

        AdminDashboardDTO dto = new AdminDashboardDTO(
                totalParkingLots,
                totalSlots,
                availableSlots,
                occupiedSlots,
                reservedSlots,
                totalReservations,
                totalUsers,
                occupancyPercentage
        );
        return ResponseEntity.ok(dto);
    }
}
