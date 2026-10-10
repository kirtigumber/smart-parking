package com.smartpark.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "parking_lots")
public class ParkingLot {

    @Id
    @Column(length = 50)
    private String id; // e.g. "loc-1", "loc-2"

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false)
    private String location;

    @Column(length = 100)
    private String category;

    @Column(name = "total_slots", nullable = false)
    private int totalSlots;

    @Column(name = "available_slots", nullable = false)
    private int availableSlots;

    @Column(name = "occupied_slots", nullable = false)
    private int occupiedSlots;

    @Column(name = "hourly_rate", nullable = false)
    private Double hourlyRate = 5.0;

    @Column(length = 50)
    private String distance;

    @Column(name = "operating_hours", length = 100)
    private String operatingHours;

    private Double rating = 4.8;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 500)
    private String features; // Comma-separated: "EV Charging, CCTV 24/7, Covered Roof"

    @OneToMany(mappedBy = "parkingLot", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ParkingSlot> slots = new ArrayList<>();

    @OneToMany(mappedBy = "parkingLot", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Reservation> reservations = new ArrayList<>();

    public ParkingLot() {}

    public ParkingLot(String id, String name, String location, String category, int totalSlots, 
                      int availableSlots, int occupiedSlots, Double hourlyRate, String distance, 
                      String operatingHours, Double rating, String description, String features) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.category = category;
        this.totalSlots = totalSlots;
        this.availableSlots = availableSlots;
        this.occupiedSlots = occupiedSlots;
        this.hourlyRate = hourlyRate;
        this.distance = distance;
        this.operatingHours = operatingHours;
        this.rating = rating;
        this.description = description;
        this.features = features;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public int getTotalSlots() { return totalSlots; }
    public void setTotalSlots(int totalSlots) { this.totalSlots = totalSlots; }

    public int getAvailableSlots() { return availableSlots; }
    public void setAvailableSlots(int availableSlots) { this.availableSlots = availableSlots; }

    public int getOccupiedSlots() { return occupiedSlots; }
    public void setOccupiedSlots(int occupiedSlots) { this.occupiedSlots = occupiedSlots; }

    public Double getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(Double hourlyRate) { this.hourlyRate = hourlyRate; }

    public String getDistance() { return distance; }
    public void setDistance(String distance) { this.distance = distance; }

    public String getOperatingHours() { return operatingHours; }
    public void setOperatingHours(String operatingHours) { this.operatingHours = operatingHours; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getFeatures() { return features; }
    public void setFeatures(String features) { this.features = features; }

    public List<ParkingSlot> getSlots() { return slots; }
    public void setSlots(List<ParkingSlot> slots) { this.slots = slots; }

    public List<Reservation> getReservations() { return reservations; }
    public void setReservations(List<Reservation> reservations) { this.reservations = reservations; }
}
