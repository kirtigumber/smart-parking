package com.smartpark.repository;

import com.smartpark.entity.ParkingLot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParkingLotRepository extends JpaRepository<ParkingLot, String> {

    @Query("SELECT p FROM ParkingLot p WHERE " +
           "(:category IS NULL OR :category = 'All' OR p.category = :category) AND " +
           "(:query IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.location) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<ParkingLot> searchParkingLots(@Param("query") String query, @Param("category") String category);
}
