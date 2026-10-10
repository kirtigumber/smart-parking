package com.smartpark.repository;

import com.smartpark.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    Optional<Reservation> findByBookingId(String bookingId);

    List<Reservation> findByUserEmailOrderByCreatedAtDesc(String userEmail);

    List<Reservation> findAllByOrderByCreatedAtDesc();

    long count();
}
