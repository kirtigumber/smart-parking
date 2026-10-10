package com.smartpark.service;

import com.smartpark.dto.ParkingSlotDTO;
import com.smartpark.dto.ParkingWebSocketMessage;
import com.smartpark.entity.ParkingLot;
import com.smartpark.entity.ParkingSlot;
import com.smartpark.entity.SlotStatus;
import com.smartpark.exception.BadRequestException;
import com.smartpark.exception.ResourceNotFoundException;
import com.smartpark.repository.ParkingLotRepository;
import com.smartpark.repository.ParkingSlotRepository;
import com.smartpark.websocket.ParkingWebSocketHandler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ParkingSlotService {

    private final ParkingSlotRepository parkingSlotRepository;
    private final ParkingLotRepository parkingLotRepository;
    private final ParkingLotService parkingLotService;
    private final ParkingWebSocketHandler webSocketHandler;

    public ParkingSlotService(ParkingSlotRepository parkingSlotRepository,
                              ParkingLotRepository parkingLotRepository,
                              ParkingLotService parkingLotService,
                              ParkingWebSocketHandler webSocketHandler) {
        this.parkingSlotRepository = parkingSlotRepository;
        this.parkingLotRepository = parkingLotRepository;
        this.parkingLotService = parkingLotService;
        this.webSocketHandler = webSocketHandler;
    }

    @Transactional(readOnly = true)
    public List<ParkingSlotDTO> getSlotsByParkingLot(String parkingLotId) {
        List<ParkingSlot> slots = parkingSlotRepository.findByParkingLotIdOrderBySlotNumberAsc(parkingLotId);
        return slots.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional
    public ParkingSlotDTO createSlot(ParkingSlotDTO dto) {
        ParkingLot lot = parkingLotRepository.findById(dto.getParkingLotId())
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found with id: " + dto.getParkingLotId()));

        if (parkingSlotRepository.findByParkingLotIdAndSlotNumber(dto.getParkingLotId(), dto.getSlotNumber()).isPresent()) {
            throw new BadRequestException("Slot " + dto.getSlotNumber() + " already exists in " + lot.getName());
        }

        SlotStatus status = SlotStatus.AVAILABLE;
        if (dto.getStatus() != null) {
            try {
                status = SlotStatus.valueOf(dto.getStatus().toUpperCase());
            } catch (Exception ignored) {}
        }

        ParkingSlot slot = new ParkingSlot(
                dto.getSlotNumber(),
                status,
                dto.getFloor() != null ? dto.getFloor() : "Level 1",
                dto.getType() != null ? dto.getType() : "regular",
                dto.getVehicle(),
                lot
        );
        ParkingSlot saved = parkingSlotRepository.save(slot);

        lot.setTotalSlots(lot.getTotalSlots() + 1);
        parkingLotRepository.save(lot);
        Map<String, Integer> stats = parkingLotService.recalculateCounts(lot.getId());

        webSocketHandler.broadcast(new ParkingWebSocketMessage(
                "SLOT_UPDATE",
                lot.getId(),
                saved.getSlotNumber(),
                saved.getId(),
                saved.getStatus().name().toLowerCase(),
                saved.getVehicle(),
                stats.get("totalSlots"),
                stats.get("availableSlots"),
                stats.get("occupiedSlots"),
                stats.get("reservedSlots"),
                stats.get("occupancyPercentage")
        ));

        return convertToDTO(saved);
    }

    @Transactional
    public ParkingSlotDTO updateSlot(Long slotId, ParkingSlotDTO dto) {
        ParkingSlot slot = parkingSlotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Slot not found with id: " + slotId));

        if (dto.getSlotNumber() != null) slot.setSlotNumber(dto.getSlotNumber());
        if (dto.getFloor() != null) slot.setFloor(dto.getFloor());
        if (dto.getType() != null) slot.setType(dto.getType());
        if (dto.getStatus() != null) {
            SlotStatus newStatus = SlotStatus.valueOf(dto.getStatus().toUpperCase());
            slot.setStatus(newStatus);
            if (newStatus == SlotStatus.AVAILABLE) {
                slot.setVehicle(null);
            }
        }
        if (dto.getVehicle() != null) slot.setVehicle(dto.getVehicle());

        ParkingSlot updated = parkingSlotRepository.save(slot);
        String lotId = slot.getParkingLot().getId();
        Map<String, Integer> stats = parkingLotService.recalculateCounts(lotId);

        webSocketHandler.broadcast(new ParkingWebSocketMessage(
                "SLOT_UPDATE",
                lotId,
                updated.getSlotNumber(),
                updated.getId(),
                updated.getStatus().name().toLowerCase(),
                updated.getVehicle(),
                stats.get("totalSlots"),
                stats.get("availableSlots"),
                stats.get("occupiedSlots"),
                stats.get("reservedSlots"),
                stats.get("occupancyPercentage")
        ));

        return convertToDTO(updated);
    }

    @Transactional
    public void deleteSlot(Long slotId) {
        ParkingSlot slot = parkingSlotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Slot not found with id: " + slotId));

        String lotId = slot.getParkingLot().getId();
        ParkingLot lot = slot.getParkingLot();
        String slotNum = slot.getSlotNumber();
        parkingSlotRepository.delete(slot);

        lot.setTotalSlots(Math.max(0, lot.getTotalSlots() - 1));
        parkingLotRepository.save(lot);
        Map<String, Integer> stats = parkingLotService.recalculateCounts(lotId);

        webSocketHandler.broadcast(new ParkingWebSocketMessage(
                "SLOT_UPDATE",
                lotId,
                slotNum,
                slotId,
                "deleted",
                null,
                stats.get("totalSlots"),
                stats.get("availableSlots"),
                stats.get("occupiedSlots"),
                stats.get("reservedSlots"),
                stats.get("occupancyPercentage")
        ));
    }

    @Transactional
    public ParkingSlotDTO updateSlotStatus(Long slotId, SlotStatus newStatus) {
        ParkingSlot slot = parkingSlotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Slot not found with id: " + slotId));

        slot.setStatus(newStatus);
        if (newStatus == SlotStatus.AVAILABLE) {
            slot.setVehicle(null);
        }
        ParkingSlot updated = parkingSlotRepository.save(slot);

        String lotId = slot.getParkingLot().getId();
        Map<String, Integer> stats = parkingLotService.recalculateCounts(lotId);

        webSocketHandler.broadcast(new ParkingWebSocketMessage(
                "SLOT_UPDATE",
                lotId,
                updated.getSlotNumber(),
                updated.getId(),
                updated.getStatus().name().toLowerCase(),
                updated.getVehicle(),
                stats.get("totalSlots"),
                stats.get("availableSlots"),
                stats.get("occupiedSlots"),
                stats.get("reservedSlots"),
                stats.get("occupancyPercentage")
        ));

        return convertToDTO(updated);
    }

    @Transactional
    public ParkingSlotDTO updateSlotStatusByNumber(String parkingLotId, String slotNumber, SlotStatus newStatus, String vehicle) {
        ParkingSlot slot = parkingSlotRepository.findByParkingLotIdAndSlotNumber(parkingLotId, slotNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Slot " + slotNumber + " not found in lot " + parkingLotId));

        slot.setStatus(newStatus);
        slot.setVehicle(vehicle);
        ParkingSlot updated = parkingSlotRepository.save(slot);

        Map<String, Integer> stats = parkingLotService.recalculateCounts(parkingLotId);

        webSocketHandler.broadcast(new ParkingWebSocketMessage(
                "SLOT_UPDATE",
                parkingLotId,
                updated.getSlotNumber(),
                updated.getId(),
                updated.getStatus().name().toLowerCase(),
                updated.getVehicle(),
                stats.get("totalSlots"),
                stats.get("availableSlots"),
                stats.get("occupiedSlots"),
                stats.get("reservedSlots"),
                stats.get("occupancyPercentage")
        ));

        return convertToDTO(updated);
    }

    public ParkingSlotDTO convertToDTO(ParkingSlot slot) {
        ParkingSlotDTO dto = new ParkingSlotDTO();
        dto.setId(slot.getId());
        dto.setSlotNumber(slot.getSlotNumber());
        dto.setStatus(slot.getStatus().name().toLowerCase());
        dto.setFloor(slot.getFloor());
        dto.setType(slot.getType());
        dto.setVehicle(slot.getVehicle());
        dto.setParkingLotId(slot.getParkingLot().getId());
        return dto;
    }
}
