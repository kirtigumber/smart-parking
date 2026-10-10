package com.smartpark.repository;

import com.smartpark.entity.ParkingSlot;
import com.smartpark.entity.SlotStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParkingSlotRepository extends JpaRepository<ParkingSlot, Long> {

    List<ParkingSlot> findByParkingLotIdOrderBySlotNumberAsc(String parkingLotId);

    Optional<ParkingSlot> findByParkingLotIdAndSlotNumber(String parkingLotId, String slotNumber);

    long countByParkingLotIdAndStatus(String parkingLotId, SlotStatus status);

    long countByStatus(SlotStatus status);
}
