-- ===================================================================
-- SMART PARK - MYSQL DATABASE SCHEMA (DDL)
-- ===================================================================

CREATE DATABASE IF NOT EXISTS smart_park_db;
USE smart_park_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255),
    phone VARCHAR(30),
    vehicle_number VARCHAR(30),
    vehicle_model VARCHAR(100),
    role VARCHAR(20) DEFAULT 'USER',
    member_since VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Demo Users (BCrypt hashed passwords)
-- password123 -> $2a$10$e8w.b0l2x5qN6rI.JvM9eOGZqM3J3W/qD0B8M.2jW7jW.mZ4K3P0S
-- admin123    -> $2a$10$7Z6J1u2n5v8.BqY1Z0W3ueM6uN0kL7k6n2vYyeG0W3JvN0pL7k6n2
INSERT INTO users (name, email, password, phone, vehicle_number, vehicle_model, role, member_since)
VALUES 
    ('Alex Morgan', 'alex.morgan@smartpark.io', '$2a$10$e8w.b0l2x5qN6rI.JvM9eOGZqM3J3W/qD0B8M.2jW7jW.mZ4K3P0S', '+1 (555) 234-5678', 'HR00XX0000', 'Tesla Model 3 / Blue Sedan', 'USER', 'September 2026'),
    ('Sarah Jenkins', 'admin@smartpark.io', '$2a$10$7Z6J1u2n5v8.BqY1Z0W3ueM6uN0kL7k6n2vYyeG0W3JvN0pL7k6n2', '+1 (555) 987-6543', 'ADMIN-01', 'Electric Patrol Fleet', 'ADMIN', 'September 2026')
ON DUPLICATE KEY UPDATE 
    password = VALUES(password),
    role = VALUES(role);

-- 2. Parking Lots Table
CREATE TABLE IF NOT EXISTS parking_lots (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    location VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    total_slots INT NOT NULL DEFAULT 0,
    available_slots INT NOT NULL DEFAULT 0,
    occupied_slots INT NOT NULL DEFAULT 0,
    hourly_rate DECIMAL(6, 2) NOT NULL DEFAULT 0.00,
    distance VARCHAR(50),
    operating_hours VARCHAR(100),
    rating DECIMAL(3, 1) DEFAULT 4.5,
    description TEXT,
    features VARCHAR(500)
);

-- 3. Parking Slots Table
CREATE TABLE IF NOT EXISTS parking_slots (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    slot_number VARCHAR(20) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE',
    floor VARCHAR(30) DEFAULT 'Level 1',
    type VARCHAR(30) DEFAULT 'regular',
    vehicle VARCHAR(50),
    parking_lot_id VARCHAR(50) NOT NULL,
    CONSTRAINT fk_slot_parking_lot FOREIGN KEY (parking_lot_id) REFERENCES parking_lots(id) ON DELETE CASCADE,
    CONSTRAINT uc_lot_slot UNIQUE (parking_lot_id, slot_number)
);

-- 4. Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT,
    parking_lot_id VARCHAR(50) NOT NULL,
    parking_slot_id BIGINT NOT NULL,
    parking_name VARCHAR(150),
    location_address VARCHAR(255),
    slot VARCHAR(20) NOT NULL,
    date VARCHAR(50) NOT NULL,
    time VARCHAR(100) NOT NULL,
    start_time VARCHAR(20),
    end_time VARCHAR(20),
    vehicle_number VARCHAR(30) NOT NULL,
    user_name VARCHAR(100),
    user_email VARCHAR(120),
    status VARCHAR(30) NOT NULL DEFAULT 'CONFIRMED',
    amount DECIMAL(8, 2) NOT NULL DEFAULT 0.00,
    rate_per_hour DECIMAL(6, 2) NOT NULL DEFAULT 0.00,
    hours DECIMAL(5, 2) NOT NULL DEFAULT 1.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reservation_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_reservation_lot FOREIGN KEY (parking_lot_id) REFERENCES parking_lots(id) ON DELETE CASCADE,
    CONSTRAINT fk_reservation_slot FOREIGN KEY (parking_slot_id) REFERENCES parking_slots(id) ON DELETE CASCADE
);
