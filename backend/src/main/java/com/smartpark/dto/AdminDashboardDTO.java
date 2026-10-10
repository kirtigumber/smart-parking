package com.smartpark.dto;

public class AdminDashboardDTO {

    private long totalParkingLots;
    private long totalSlots;
    private long availableSlots;
    private long occupiedSlots;
    private long reservedSlots;
    private long totalReservations;
    private long totalUsers;
    private int occupancyPercentage;

    public AdminDashboardDTO() {}

    public AdminDashboardDTO(long totalParkingLots, long totalSlots, long availableSlots,
                             long occupiedSlots, long reservedSlots, long totalReservations,
                             long totalUsers, int occupancyPercentage) {
        this.totalParkingLots = totalParkingLots;
        this.totalSlots = totalSlots;
        this.availableSlots = availableSlots;
        this.occupiedSlots = occupiedSlots;
        this.reservedSlots = reservedSlots;
        this.totalReservations = totalReservations;
        this.totalUsers = totalUsers;
        this.occupancyPercentage = occupancyPercentage;
    }

    public long getTotalParkingLots() { return totalParkingLots; }
    public void setTotalParkingLots(long totalParkingLots) { this.totalParkingLots = totalParkingLots; }

    public long getTotalSlots() { return totalSlots; }
    public void setTotalSlots(long totalSlots) { this.totalSlots = totalSlots; }

    public long getAvailableSlots() { return availableSlots; }
    public void setAvailableSlots(long availableSlots) { this.availableSlots = availableSlots; }

    public long getOccupiedSlots() { return occupiedSlots; }
    public void setOccupiedSlots(long occupiedSlots) { this.occupiedSlots = occupiedSlots; }

    public long getReservedSlots() { return reservedSlots; }
    public void setReservedSlots(long reservedSlots) { this.reservedSlots = reservedSlots; }

    public long getTotalReservations() { return totalReservations; }
    public void setTotalReservations(long totalReservations) { this.totalReservations = totalReservations; }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public int getOccupancyPercentage() { return occupancyPercentage; }
    public void setOccupancyPercentage(int occupancyPercentage) { this.occupancyPercentage = occupancyPercentage; }
}
