package com.smartpark.util;

import com.smartpark.entity.*;
import com.smartpark.repository.ParkingLotRepository;
import com.smartpark.repository.ParkingSlotRepository;
import com.smartpark.repository.ReservationRepository;
import com.smartpark.repository.UserRepository;
import com.smartpark.service.ParkingLotService;
import com.smartpark.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ParkingLotRepository parkingLotRepository;
    private final ParkingSlotRepository parkingSlotRepository;
    private final UserRepository userRepository;
    private final ReservationRepository reservationRepository;
    private final ParkingLotService parkingLotService;
    private final UserService userService;
    private final com.smartpark.service.QrCodeService qrCodeService;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public DataSeeder(ParkingLotRepository parkingLotRepository,
                      ParkingSlotRepository parkingSlotRepository,
                      UserRepository userRepository,
                      ReservationRepository reservationRepository,
                      ParkingLotService parkingLotService,
                      UserService userService,
                      com.smartpark.service.QrCodeService qrCodeService,
                      org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.parkingLotRepository = parkingLotRepository;
        this.parkingSlotRepository = parkingSlotRepository;
        this.userRepository = userRepository;
        this.reservationRepository = reservationRepository;
        this.parkingLotService = parkingLotService;
        this.userService = userService;
        this.qrCodeService = qrCodeService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. ALWAYS seed or repair demo users on every boot
        seedUserIfMissing("Alex Morgan", "alex.morgan@smartpark.io", "+1 (555) 234-5678", "HR00XX0000", "Tesla Model 3 / Blue Sedan", "USER", "password123");
        seedUserIfMissing("Sarah Jenkins", "admin@smartpark.io", "+1 (555) 987-6543", "ADMIN-01", "Electric Patrol Fleet", "ADMIN", "admin123");
        seedUserIfMissing("David Chen", "david.chen@sample.com", "+1 (555) 345-6789", "DL04AB1234", "Honda Civic", "USER", "password123");
        seedUserIfMissing("Rachel Green", "rachel.green@sample.com", "+1 (555) 456-7890", "MH02XY9999", "Hyundai Ioniq 5", "USER", "password123");
        seedUserIfMissing("Marcus Vance", "marcus.v@sample.com", "+1 (555) 567-8901", "UP16CD5678", "Toyota RAV4 Hybrid", "USER", "password123");

        if (parkingLotRepository.count() > 0) {
            return; // Parking lots and slots already initialized
        }

        // 2. Seed Parking Facilities
        ParkingLot lot1 = new ParkingLot("loc-1", "City Mall Parking", "Main Road, Sector 18", "Shopping Mall", 100, 35, 65, 5.00, "0.8 km away", "08:00 AM - 11:30 PM", 4.8, "Premier multi-level parking facility connected directly to City Mall with high-speed automated barrier gates and fast EV charging docks.", "EV Charging, CCTV 24/7, Valet Option, Elevator Access, Covered Roof");
        ParkingLot lot2 = new ParkingLot("loc-2", "Metro Hub Station", "Railway Plaza, Transit Loop", "Public Transit", 150, 42, 108, 3.50, "1.4 km away", "24 Hours Open", 4.6, "Direct metro commuter hub parking designed for daily subway commuters with automated touchless license plate recognition.", "Smart Gate, Bicycle Racks, CCTV 24/7, Direct Terminal Link");
        ParkingLot lot3 = new ParkingLot("loc-3", "CyberTech Grand Plaza", "Silicon Boulevard, Tech Zone", "Business Park", 80, 20, 60, 6.00, "2.5 km away", "06:00 AM - 10:00 PM", 4.9, "Ultra-modern subterranean tech park facility equipped with AI occupancy camera sensors and dedicated luxury vehicle bays.", "Fast EV DC Fast, App Pay Only, Security Escort, Climate Controlled");
        ParkingLot lot4 = new ParkingLot("loc-4", "Apex Healthcare Center", "Medical Enclave, Cross Road 4", "Hospital / Healthcare", 60, 15, 45, 4.00, "3.1 km away", "24 Hours Open", 4.7, "Accessible and secure medical center parking with designated patient transfer zones and immediate emergency room walkway.", "Handicap Priority, Ambulance Lane Free, 24/7 Attendants, Emergency Assistance");
        ParkingLot lot5 = new ParkingLot("loc-5", "Grand Horizon Airport (T2)", "Airport Expressway, Terminal 2", "Airport Parking", 200, 75, 125, 8.00, "7.8 km away", "24 Hours Open", 4.8, "Long-term and short-term airport terminal parking with free frequent shuttles and 24-hour round-the-clock perimeter patrols.", "Free Terminal Shuttle, Long-term Stay, Luggage Assistance, Valet Pickup");
        ParkingLot lot6 = new ParkingLot("loc-6", "Downtown Civic Square", "High Street Heritage District", "City Center", 50, 12, 38, 4.50, "0.4 km away", "07:00 AM - Midnight", 4.5, "Central downtown surface lot located within 2 minutes of prominent dining, theaters, and retail avenues.", "CCTV Monitored, Street Level, Pedestrian Walkway");

        parkingLotRepository.saveAll(List.of(lot1, lot2, lot3, lot4, lot5, lot6));

        // 3. Seed Slots for loc-1
        seedSlotsForCityMall(lot1);

        // Seed slots for remaining lots
        seedSlotsForOtherLots(lot2);
        seedSlotsForOtherLots(lot3);
        seedSlotsForOtherLots(lot4);
        seedSlotsForOtherLots(lot5);
        seedSlotsForOtherLots(lot6);

        // 4. Seed Initial Reservations
        User alex = userRepository.findByEmailIgnoreCase("alex.morgan@smartpark.io").orElse(null);
        User rachel = userRepository.findByEmailIgnoreCase("rachel.green@sample.com").orElse(null);

        ParkingSlot slot12 = parkingSlotRepository.findByParkingLotIdAndSlotNumber("loc-1", "P12").orElse(null);
        ParkingSlot slot04 = parkingSlotRepository.findByParkingLotIdAndSlotNumber("loc-1", "P04").orElse(null);
        ParkingSlot slot05 = parkingSlotRepository.findByParkingLotIdAndSlotNumber("loc-2", "P05").orElse(null);
        ParkingSlot slot08 = parkingSlotRepository.findByParkingLotIdAndSlotNumber("loc-3", "P08").orElse(null);

        if (slot12 != null) {
            Reservation res1 = new Reservation("SP10025", alex, lot1, slot12, lot1.getName(), lot1.getLocation(), "P12", "22 September 2026", "10:00 AM – 12:00 PM", "10:00 AM", "12:00 PM", "HR00XX0000", "Alex Morgan", "alex.morgan@smartpark.io", ReservationStatus.CONFIRMED, 10.00, 5.00, 2.0);
            res1.setQrCode(qrCodeService.generateQrCodeDataUrl("SMARTPARK:SP10025:loc-1:P12:HR00XX0000", 260, 260));
            res1.setIsUsed(false);
            reservationRepository.save(res1);
        }

        if (slot05 != null) {
            Reservation res2 = new Reservation("SP10018", alex, lot2, slot05, lot2.getName(), lot2.getLocation(), "P05", "20 September 2026", "09:00 AM – 05:00 PM", "09:00 AM", "05:00 PM", "HR00XX0000", "Alex Morgan", "alex.morgan@smartpark.io", ReservationStatus.COMPLETED, 28.00, 3.50, 8.0);
            res2.setQrCode(qrCodeService.generateQrCodeDataUrl("SMARTPARK:SP10018:loc-2:P05:HR00XX0000", 260, 260));
            res2.setIsUsed(true);
            res2.setUsedAt(java.time.LocalDateTime.now().minusDays(2));
            reservationRepository.save(res2);
        }

        if (slot08 != null) {
            Reservation res3 = new Reservation("SP10011", alex, lot3, slot08, lot3.getName(), lot3.getLocation(), "P08", "18 September 2026", "02:00 PM – 04:00 PM", "02:00 PM", "04:00 PM", "HR00XX0000", "Alex Morgan", "alex.morgan@smartpark.io", ReservationStatus.CANCELLED, 12.00, 6.00, 2.0);
            res3.setQrCode(qrCodeService.generateQrCodeDataUrl("SMARTPARK:SP10011:loc-3:P08:HR00XX0000", 260, 260));
            res3.setIsUsed(false);
            reservationRepository.save(res3);
        }

        if (slot04 != null) {
            Reservation res4 = new Reservation("SP10032", rachel, lot1, slot04, lot1.getName(), lot1.getLocation(), "P04", "22 September 2026", "01:00 PM – 03:00 PM", "01:00 PM", "03:00 PM", "MH02XY9999", "Rachel Green", "rachel.green@sample.com", ReservationStatus.CONFIRMED, 10.00, 5.00, 2.0);
            res4.setQrCode(qrCodeService.generateQrCodeDataUrl("SMARTPARK:SP10032:loc-1:P04:MH02XY9999", 260, 260));
            res4.setIsUsed(false);
            reservationRepository.save(res4);
        }

        // Recalculate all lot counts
        parkingLotService.recalculateCounts("loc-1");
        parkingLotService.recalculateCounts("loc-2");
        parkingLotService.recalculateCounts("loc-3");
        parkingLotService.recalculateCounts("loc-4");
        parkingLotService.recalculateCounts("loc-5");
        parkingLotService.recalculateCounts("loc-6");
    }

    private void seedSlotsForCityMall(ParkingLot lot) {
        Object[][] slotConfig = {
                {"P01", SlotStatus.AVAILABLE, "Level 1", "regular", null},
                {"P02", SlotStatus.OCCUPIED, "Level 1", "regular", "DL04AB1234"},
                {"P03", SlotStatus.AVAILABLE, "Level 1", "ev", null},
                {"P04", SlotStatus.RESERVED, "Level 1", "regular", "MH02XY9999"},
                {"P05", SlotStatus.AVAILABLE, "Level 1", "regular", null},
                {"P06", SlotStatus.AVAILABLE, "Level 1", "compact", null},
                {"P07", SlotStatus.OCCUPIED, "Level 1", "regular", "UP16CD5678"},
                {"P08", SlotStatus.AVAILABLE, "Level 1", "accessible", null},
                {"P09", SlotStatus.RESERVED, "Level 1", "regular", "KA01EF4321"},
                {"P10", SlotStatus.OCCUPIED, "Level 1", "regular", "TS09GH8765"},
                {"P11", SlotStatus.AVAILABLE, "Level 1", "ev", null},
                {"P12", SlotStatus.AVAILABLE, "Level 1", "regular", null},
                {"P13", SlotStatus.AVAILABLE, "Level 1", "regular", null},
                {"P14", SlotStatus.OCCUPIED, "Level 1", "regular", "HR26JK7654"},
                {"P15", SlotStatus.MAINTENANCE, "Level 1", "regular", null},
                {"P16", SlotStatus.AVAILABLE, "Level 1", "compact", null},
                {"P17", SlotStatus.OCCUPIED, "Level 1", "regular", "GJ01LM3456"},
                {"P18", SlotStatus.AVAILABLE, "Level 1", "accessible", null},
                {"P19", SlotStatus.RESERVED, "Level 1", "ev", "TN07PQ9012"},
                {"P20", SlotStatus.AVAILABLE, "Level 1", "regular", null},
                {"P21", SlotStatus.MAINTENANCE, "Level 1", "regular", null},
                {"P22", SlotStatus.AVAILABLE, "Level 1", "regular", null},
                {"P23", SlotStatus.OCCUPIED, "Level 1", "regular", "RJ14RS7890"},
                {"P24", SlotStatus.AVAILABLE, "Level 1", "regular", null}
        };

        for (Object[] row : slotConfig) {
            ParkingSlot slot = new ParkingSlot(
                    (String) row[0],
                    (SlotStatus) row[1],
                    (String) row[2],
                    (String) row[3],
                    (String) row[4],
                    lot
            );
            parkingSlotRepository.save(slot);
        }
    }

    private void seedSlotsForOtherLots(ParkingLot lot) {
        SlotStatus[] statuses = {
                SlotStatus.AVAILABLE, SlotStatus.OCCUPIED, SlotStatus.AVAILABLE,
                SlotStatus.OCCUPIED, SlotStatus.RESERVED, SlotStatus.AVAILABLE,
                SlotStatus.AVAILABLE, SlotStatus.MAINTENANCE
        };
        String[] types = {"regular", "regular", "ev", "compact", "accessible"};

        for (int i = 1; i <= 24; i++) {
            String slotNum = String.format("P%02d", i);
            SlotStatus status = statuses[i % statuses.length];
            String floor = i <= 12 ? "Level 1" : "Level 2";
            String type = types[i % types.length];
            String vehicle = status == SlotStatus.OCCUPIED ? "VEH-" + (1000 + i) : null;

            ParkingSlot slot = new ParkingSlot(slotNum, status, floor, type, vehicle, lot);
            parkingSlotRepository.save(slot);
        }
    }

    private void seedUserIfMissing(String name, String email, String phone, String vehicleNumber, String vehicleModel, String role, String rawPassword) {
        String cleanEmail = email != null ? email.trim().toLowerCase() : "";
        java.util.Optional<User> existing = userRepository.findByEmailIgnoreCase(cleanEmail);
        if (existing.isEmpty()) {
            User user = new User(name, cleanEmail, phone, vehicleNumber, vehicleModel, role);
            user.setPassword(passwordEncoder.encode(rawPassword));
            userRepository.save(user);
        } else {
            User user = existing.get();
            boolean updated = false;
            if (user.getPassword() == null || user.getPassword().isEmpty() || !passwordEncoder.matches(rawPassword, user.getPassword())) {
                user.setPassword(passwordEncoder.encode(rawPassword));
                updated = true;
            }
            if (!role.equalsIgnoreCase(user.getRole())) {
                user.setRole(role.toUpperCase());
                updated = true;
            }
            if (updated) {
                userRepository.save(user);
            }
        }
    }
}
