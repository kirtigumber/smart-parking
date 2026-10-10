package com.smartpark.controller;

import com.smartpark.dto.ParkingLotDTO;
import com.smartpark.dto.ParkingSlotDTO;
import com.smartpark.service.ParkingLotService;
import com.smartpark.service.ParkingSlotService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parking-lots")
public class ParkingLotController {

    private final ParkingLotService parkingLotService;
    private final ParkingSlotService parkingSlotService;

    public ParkingLotController(ParkingLotService parkingLotService, ParkingSlotService parkingSlotService) {
        this.parkingLotService = parkingLotService;
        this.parkingSlotService = parkingSlotService;
    }

    @GetMapping
    public ResponseEntity<List<ParkingLotDTO>> getAllParkingLots(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category) {
        List<ParkingLotDTO> lots = parkingLotService.getAllParkingLots(search, category);
        return ResponseEntity.ok(lots);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParkingLotDTO> getParkingLotById(@PathVariable String id) {
        ParkingLotDTO lot = parkingLotService.getParkingLotById(id);
        return ResponseEntity.ok(lot);
    }

    @PostMapping
    public ResponseEntity<ParkingLotDTO> createParkingLot(@RequestBody ParkingLotDTO dto) {
        ParkingLotDTO created = parkingLotService.createParkingLot(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParkingLotDTO> updateParkingLot(@PathVariable String id, @RequestBody ParkingLotDTO dto) {
        ParkingLotDTO updated = parkingLotService.updateParkingLot(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParkingLot(@PathVariable String id) {
        parkingLotService.deleteParkingLot(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/slots")
    public ResponseEntity<List<ParkingSlotDTO>> getSlotsForParkingLot(@PathVariable String id) {
        List<ParkingSlotDTO> slots = parkingSlotService.getSlotsByParkingLot(id);
        return ResponseEntity.ok(slots);
    }
}
