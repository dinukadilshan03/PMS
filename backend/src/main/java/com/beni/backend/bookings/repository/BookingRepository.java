package com.beni.backend.bookings.repository;

import com.beni.backend.bookings.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByDateTimeBetween(LocalDateTime startDateTime, LocalDateTime endDateTime);
}
