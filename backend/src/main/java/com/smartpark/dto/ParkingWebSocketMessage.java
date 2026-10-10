package com.smartpark.dto;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class ParkingWebSocketMessage {

    private String type; // e.g. "SLOT_UPDATE"
    private String locationId;
    private String slotNumber;
    private Long slotId;
    private String status; // "available", "occupied", "reserved", "maintenance"
    private String vehicle;
    private Integer totalSlots;
    private Integer availableSlots;
    private Integer occupiedSlots;
    private Integer reservedSlots;
    private Integer occupancyPercentage;
    private String timestamp;

    public ParkingWebSocketMessage() {
        this.timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }

    public ParkingWebSocketMessage(String type, String locationId, String slotNumber, Long slotId,
                                   String status, String vehicle, Integer totalSlots,
                                   Integer availableSlots, Integer occupiedSlots,
                                   Integer reservedSlots, Integer occupancyPercentage) {
        this.type = type;
        this.locationId = locationId;
        this.slotNumber = slotNumber;
        this.slotId = slotId;
        this.status = status;
        this.vehicle = vehicle;
        this.totalSlots = totalSlots;
        this.availableSlots = availableSlots;
        this.occupiedSlots = occupiedSlots;
        this.reservedSlots = reservedSlots;
        this.occupancyPercentage = occupancyPercentage;
        this.timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getLocationId() { return locationId; }
    public void setLocationId(String locationId) { this.locationId = locationId; }

    public String getSlotNumber() { return slotNumber; }
    public void setSlotNumber(String slotNumber) { this.slotNumber = slotNumber; }

    public Long getSlotId() { return slotId; }
    public void setSlotId(Long slotId) { this.slotId = slotId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getVehicle() { return vehicle; }
    public void setVehicle(String vehicle) { this.vehicle = vehicle; }

    public Integer getTotalSlots() { return totalSlots; }
    public void setTotalSlots(Integer totalSlots) { this.totalSlots = totalSlots; }

    public Integer getAvailableSlots() { return availableSlots; }
    public void setAvailableSlots(Integer availableSlots) { this.availableSlots = availableSlots; }

    public Integer getOccupiedSlots() { return occupiedSlots; }
    public void setOccupiedSlots(Integer occupiedSlots) { this.occupiedSlots = occupiedSlots; }

    public Integer getReservedSlots() { return reservedSlots; }
    public void setReservedSlots(Integer reservedSlots) { this.reservedSlots = reservedSlots; }

    public Integer getOccupancyPercentage() { return occupancyPercentage; }
    public void setOccupancyPercentage(Integer occupancyPercentage) { this.occupancyPercentage = occupancyPercentage; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}
