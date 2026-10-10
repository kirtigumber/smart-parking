package com.smartpark.dto;

public class ReservationResponse {

    private String id; // bookingId e.g. "SP10025"
    private String parkingId;
    private String parkingName;
    private String locationAddress;
    private String slot;
    private String date;
    private String time;
    private String startTime;
    private String endTime;
    private String vehicleNumber;
    private String status;
    private Double amount;
    private Double ratePerHour;
    private Double hours;
    private String createdAt;
    private String userName;
    private String userEmail;
    private String qrCode;
    private Boolean isUsed;
    private String usedAt;
    private Boolean entryAllowed;

    public ReservationResponse() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getParkingId() { return parkingId; }
    public void setParkingId(String parkingId) { this.parkingId = parkingId; }

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

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public Double getRatePerHour() { return ratePerHour; }
    public void setRatePerHour(Double ratePerHour) { this.ratePerHour = ratePerHour; }

    public Double getHours() { return hours; }
    public void setHours(Double hours) { this.hours = hours; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getQrCode() { return qrCode; }
    public void setQrCode(String qrCode) { this.qrCode = qrCode; }

    public Boolean getIsUsed() { return isUsed; }
    public void setIsUsed(Boolean isUsed) { this.isUsed = isUsed; }

    public String getUsedAt() { return usedAt; }
    public void setUsedAt(String usedAt) { this.usedAt = usedAt; }

    public Boolean getEntryAllowed() { return entryAllowed; }
    public void setEntryAllowed(Boolean entryAllowed) { this.entryAllowed = entryAllowed; }
}
