package com.beni.backend.bookings.model;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

@Data
@Document(collection = "booking_config")
public class BookingConfig {
    @Id
    private String id;

    private Integer maxBookingsPerDay = 3; // Default value

    private Integer minAdvanceBookingDays = 1;

    private Integer maxAdvanceBookingDays = 30;

    private Double cancellationFeePercentage = 20.0;

    private Integer rescheduleLimitDays = 2;

    private Integer rescheduleWindowHours = 48; // Default: 48 hours

    private Integer cancellationWindowHours = 24; // Default: 24 hours

    private String allowedLocations; // JSON string of allowed locations

    private String timeSlots; // JSON string of available time slots

    private String bookingStatuses; // JSON string of available statuses
} 