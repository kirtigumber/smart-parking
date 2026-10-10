package com.smartpark.service;

import com.smartpark.dto.ParkingLotDTO;
import com.smartpark.entity.ParkingLot;
import com.smartpark.entity.ParkingSlot;
import com.smartpark.entity.SlotStatus;
import com.smartpark.exception.ResourceNotFoundException;
import com.smartpark.repository.ParkingLotRepository;
import com.smartpark.repository.ParkingSlotRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ParkingLotService {

    private final ParkingLotRepository parkingLotRepository;
    private final ParkingSlotRepository parkingSlotRepository;

    public ParkingLotService(ParkingLotRepository parkingLotRepository, ParkingSlotRepository parkingSlotRepository) {
        this.parkingLotRepository = parkingLotRepository;
        this.parkingSlotRepository = parkingSlotRepository;
    }

    @Transactional(readOnly = true)
    public List<ParkingLotDTO> getAllParkingLots(String query, String category) {
        List<ParkingLot> lots;
        if ((query != null && !query.trim().isEmpty()) || (category != null && !category.equalsIgnoreCase("All"))) {
            lots = parkingLotRepository.searchParkingLots(
                    (query != null && !query.trim().isEmpty()) ? query.trim() : null,
                    category
            );
        } else {
            lots = parkingLotRepository.findAll();
        }
        return lots.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ParkingLotDTO getParkingLotById(String id) {
        ParkingLot lot = parkingLotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parking facility not found with id: " + id));
        return convertToDTO(lot);
    }

    @Transactional
    public ParkingLotDTO createParkingLot(ParkingLotDTO dto) {
        String id = dto.getId() != null ? dto.getId() : "loc-" + System.currentTimeMillis();
        String featuresString = dto.getFeatures() != null ? String.join(", ", dto.getFeatures()) : "CCTV 24/7, Smart Sensor";

        ParkingLot lot = new ParkingLot(
                id,
                dto.getName(),
                dto.getLocation(),
                dto.getCategory() != null ? dto.getCategory() : "Commercial Lot",
                dto.getTotalSlots() > 0 ? dto.getTotalSlots() : 24,
                dto.getTotalSlots() > 0 ? dto.getTotalSlots() : 24,
                0,
                dto.getHourlyRate() != null ? dto.getHourlyRate() : 5.0,
                dto.getDistance() != null ? dto.getDistance() : "1.0 km away",
                dto.getOperatingHours() != null ? dto.getOperatingHours() : "24 Hours Open",
                5.0,
                dto.getDescription() != null ? dto.getDescription() : "Smart monitored parking facility with instant reservation.",
                featuresString
        );

        ParkingLot saved = parkingLotRepository.save(lot);

        // Generate initial 24 slots for this new facility
        int count = Math.min(saved.getTotalSlots(), 24);
        for (int i = 1; i <= count; i++) {
            String slotNum = String.format("P%02d", i);
            String floor = i <= 12 ? "Level 1" : "Level 2";
            String type = (i % 4 == 0) ? "ev" : (i % 5 == 0) ? "accessible" : (i % 6 == 0) ? "compact" : "regular";
            ParkingSlot slot = new ParkingSlot(slotNum, SlotStatus.AVAILABLE, floor, type, null, saved);
            parkingSlotRepository.save(slot);
        }

        return convertToDTO(saved);
    }

    @Transactional
    public ParkingLotDTO updateParkingLot(String id, ParkingLotDTO dto) {
        ParkingLot lot = parkingLotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parking facility not found with id: " + id));

        if (dto.getName() != null) lot.setName(dto.getName());
        if (dto.getLocation() != null) lot.setLocation(dto.getLocation());
        if (dto.getCategory() != null) lot.setCategory(dto.getCategory());
        if (dto.getHourlyRate() != null) lot.setHourlyRate(dto.getHourlyRate());
        if (dto.getOperatingHours() != null) lot.setOperatingHours(dto.getOperatingHours());
        if (dto.getDistance() != null) lot.setDistance(dto.getDistance());
        if (dto.getDescription() != null) lot.setDescription(dto.getDescription());
        if (dto.getTotalSlots() > 0) lot.setTotalSlots(dto.getTotalSlots());
        if (dto.getFeatures() != null && !dto.getFeatures().isEmpty()) {
            lot.setFeatures(String.join(", ", dto.getFeatures()));
        }

        ParkingLot updated = parkingLotRepository.save(lot);
        recalculateCounts(id);
        return convertToDTO(updated);
    }

    @Transactional
    public void deleteParkingLot(String id) {
        ParkingLot lot = parkingLotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parking facility not found with id: " + id));

        List<ParkingSlot> slots = parkingSlotRepository.findByParkingLotIdOrderBySlotNumberAsc(id);
        parkingSlotRepository.deleteAll(slots);
        parkingLotRepository.delete(lot);
    }

    @Transactional
    public java.util.Map<String, Integer> recalculateCounts(String lotId) {
        ParkingLot lot = parkingLotRepository.findById(lotId).orElse(null);
        if (lot != null) {
            long available = parkingSlotRepository.countByParkingLotIdAndStatus(lotId, SlotStatus.AVAILABLE);
            long occupied = parkingSlotRepository.countByParkingLotIdAndStatus(lotId, SlotStatus.OCCUPIED);
            long reserved = parkingSlotRepository.countByParkingLotIdAndStatus(lotId, SlotStatus.RESERVED);
            int total = lot.getTotalSlots();
            int occupancyPercent = total > 0 ? (int) Math.round(((double) (occupied + reserved) / total) * 100) : 0;

            lot.setAvailableSlots((int) available);
            lot.setOccupiedSlots((int) (occupied + reserved));
            parkingLotRepository.save(lot);

            java.util.Map<String, Integer> stats = new java.util.HashMap<>();
            stats.put("totalSlots", total);
            stats.put("availableSlots", (int) available);
            stats.put("occupiedSlots", (int) occupied);
            stats.put("reservedSlots", (int) reserved);
            stats.put("occupancyPercentage", occupancyPercent);
            return stats;
        }
        return java.util.Map.of(
                "totalSlots", 0,
                "availableSlots", 0,
                "occupiedSlots", 0,
                "reservedSlots", 0,
                "occupancyPercentage", 0
        );
    }

    public ParkingLotDTO convertToDTO(ParkingLot lot) {
        ParkingLotDTO dto = new ParkingLotDTO();
        dto.setId(lot.getId());
        dto.setName(lot.getName());
        dto.setLocation(lot.getLocation());
        dto.setCategory(lot.getCategory());
        dto.setTotalSlots(lot.getTotalSlots());
        dto.setAvailableSlots(lot.getAvailableSlots());
        dto.setOccupiedSlots(lot.getOccupiedSlots());
        dto.setHourlyRate(lot.getHourlyRate());
        dto.setDistance(lot.getDistance());
        dto.setOperatingHours(lot.getOperatingHours());
        dto.setRating(lot.getRating());
        dto.setDescription(lot.getDescription());

        if (lot.getFeatures() != null && !lot.getFeatures().trim().isEmpty()) {
            dto.setFeatures(Arrays.stream(lot.getFeatures().split(","))
                    .map(String::trim)
                    .collect(Collectors.toList()));
        } else {
            dto.setFeatures(List.of("CCTV 24/7", "Automated Gate"));
        }
        return dto;
    }
}
