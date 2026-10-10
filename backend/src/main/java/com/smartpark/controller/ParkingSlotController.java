package com.smartpark.controller;

import com.smartpark.dto.ParkingSlotDTO;
import com.smartpark.entity.SlotStatus;
import com.smartpark.service.ParkingSlotService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/parking-slots")
public class ParkingSlotController {

    private final ParkingSlotService parkingSlotService;

    public ParkingSlotController(ParkingSlotService parkingSlotService) {
        this.parkingSlotService = parkingSlotService;
    }

    @GetMapping("/location/{locationId}")
    public ResponseEntity<List<ParkingSlotDTO>> getSlotsByLocation(@PathVariable String locationId) {
        List<ParkingSlotDTO> slots = parkingSlotService.getSlotsByParkingLot(locationId);
        return ResponseEntity.ok(slots);
    }

    @PostMapping
    public ResponseEntity<ParkingSlotDTO> createSlot(@RequestBody ParkingSlotDTO dto) {
        ParkingSlotDTO created = parkingSlotService.createSlot(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParkingSlotDTO> updateSlot(
            @PathVariable Long id,
            @RequestBody ParkingSlotDTO dto) {
        ParkingSlotDTO updated = parkingSlotService.updateSlot(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSlot(@PathVariable Long id) {
        parkingSlotService.deleteSlot(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ParkingSlotDTO> updateSlotStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String statusStr = body.get("status");
        SlotStatus newStatus = SlotStatus.valueOf(statusStr.toUpperCase());
        ParkingSlotDTO updated = parkingSlotService.updateSlotStatus(id, newStatus);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{locationId}/{slotNumber}/status")
    public ResponseEntity<ParkingSlotDTO> updateSlotStatusByNumber(
            @PathVariable String locationId,
            @PathVariable String slotNumber,
            @RequestBody Map<String, String> body) {
        String statusStr = body.get("status");
        String vehicle = body.get("vehicle");
        SlotStatus newStatus = SlotStatus.valueOf(statusStr.toUpperCase());
        ParkingSlotDTO updated = parkingSlotService.updateSlotStatusByNumber(locationId, slotNumber, newStatus, vehicle);
        return ResponseEntity.ok(updated);
    }
}
