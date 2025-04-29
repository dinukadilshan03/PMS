package com.beni.backend.bookings.repository;

import com.beni.backend.bookings.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;


import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByClientId(String clientId);

    List<Booking> findByDateTimeBetween(LocalDateTime dateTime, LocalDateTime dateTime2);
    long countByDateTimeBetween(LocalDateTime dateTime, LocalDateTime dateTime2);

    // Find all bookings assigned to a specific staff member
    List<Booking> findByAssignedStaffId(String staffId);
}
