package com.beni.backend.bookings.repository;

import com.beni.backend.bookings.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByDateTimeBetween(LocalDateTime startDateTime, LocalDateTime endDateTime);

    @Query("{'status': ?0, 'paymentStatus': ?1, 'dateTime': {$gte: ?2, $lte: ?3}}")
    List<Booking> findBookingsWithFilters(
            String status,
            String paymentStatus,
            String startDate,
            String endDate
    );


    Booking findByBookingId(String bookingId);
}
