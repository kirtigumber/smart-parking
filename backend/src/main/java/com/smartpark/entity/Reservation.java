package com.smartpark.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_id", nullable = false, unique = true, length = 50)
    private String bookingId; // e.g. "SP10025"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parking_lot_id", nullable = false)
    private ParkingLot parkingLot;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parking_slot_id", nullable = false)
    private ParkingSlot parkingSlot;

    @Column(name = "parking_name", length = 150)
    private String parkingName;

    @Column(name = "location_address")
    private String locationAddress;

    @Column(nullable = false, length = 20)
    private String slot; // e.g. "P12"

    @Column(nullable = false, length = 50)
    private String date; // e.g. "22 September 2026"

    @Column(nullable = false, length = 100)
    private String time; // e.g. "10:00 AM – 12:00 PM"

    @Column(name = "start_time", length = 20)
    private String startTime;

    @Column(name = "end_time", length = 20)
    private String endTime;

    @Column(name = "vehicle_number", nullable = false, length = 30)
    private String vehicleNumber;

    @Column(name = "user_name", length = 100)
    private String userName;

    @Column(name = "user_email", length = 120)
    private String userEmail;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ReservationStatus status = ReservationStatus.CONFIRMED;

    @Column(nullable = false)
    private Double amount = 0.0;

    @Column(name = "rate_per_hour")
    private Double ratePerHour = 5.0;

    private Double hours = 2.0;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Lob
    @Column(name = "qr_code", columnDefinition = "LONGTEXT")
    private String qrCode;

    @Column(name = "qr_token", length = 128)
    private String qrToken;

    @Column(name = "is_used")
    private Boolean isUsed = false;

    @Column(name = "used_at")
    private LocalDateTime usedAt;

    @Column(name = "entry_allowed")
    private Boolean entryAllowed = false;

    public Reservation() {}

    public Reservation(String bookingId, User user, ParkingLot parkingLot, ParkingSlot parkingSlot,
                       String parkingName, String locationAddress, String slot, String date,
                       String time, String startTime, String endTime, String vehicleNumber,
                       String userName, String userEmail, ReservationStatus status,
                       Double amount, Double ratePerHour, Double hours) {
        this.bookingId = bookingId;
        this.user = user;
        this.parkingLot = parkingLot;
        this.parkingSlot = parkingSlot;
        this.parkingName = parkingName;
        this.locationAddress = locationAddress;
        this.slot = slot;
        this.date = date;
        this.time = time;
        this.startTime = startTime;
        this.endTime = endTime;
        this.vehicleNumber = vehicleNumber;
        this.userName = userName;
        this.userEmail = userEmail;
        this.status = status != null ? status : ReservationStatus.CONFIRMED;
        this.amount = amount;
        this.ratePerHour = ratePerHour;
        this.hours = hours;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public ParkingLot getParkingLot() { return parkingLot; }
    public void setParkingLot(ParkingLot parkingLot) { this.parkingLot = parkingLot; }

    public ParkingSlot getParkingSlot() { return parkingSlot; }
    public void setParkingSlot(ParkingSlot parkingSlot) { this.parkingSlot = parkingSlot; }

    public String getParkingName() { return parkingName; }
    public void setParkingName(String parkingName) { this.parkingName = parkingName; }

    public String getLocationAddress() { return locationAddress; }
    public void setLocationAddress(String locationAddress) { this.locationAddress = locationAddress; }

    public String getSlot() { return slot; }
    public void setSlot(String slot) { this.slot = slot; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public ReservationStatus getStatus() { return status; }
    public void setStatus(ReservationStatus status) { this.status = status; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public Double getRatePerHour() { return ratePerHour; }
    public void setRatePerHour(Double ratePerHour) { this.ratePerHour = ratePerHour; }

    public Double getHours() { return hours; }
    public void setHours(Double hours) { this.hours = hours; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getQrCode() { return qrCode; }
    public void setQrCode(String qrCode) { this.qrCode = qrCode; }

    public String getQrToken() { return qrToken; }
    public void setQrToken(String qrToken) { this.qrToken = qrToken; }

    public Boolean getIsUsed() { return isUsed; }
    public void setIsUsed(Boolean isUsed) { this.isUsed = isUsed; }

    public LocalDateTime getUsedAt() { return usedAt; }
    public void setUsedAt(LocalDateTime usedAt) { this.usedAt = usedAt; }

    public Boolean getEntryAllowed() { return entryAllowed; }
    public void setEntryAllowed(Boolean entryAllowed) { this.entryAllowed = entryAllowed; }
}
