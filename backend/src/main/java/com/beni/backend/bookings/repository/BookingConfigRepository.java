package com.beni.backend.bookings.repository;

import com.beni.backend.bookings.model.BookingConfig;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingConfigRepository extends MongoRepository<BookingConfig, String> {
    // No additional methods needed as MongoRepository provides all necessary CRUD operations
} 