package com.beni.backend.bookings.model;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "bookings")
public class Booking {
    private String id;
    private LocalDateTime dateTime;
    private String clientId;  // From session
    private String bookingStatus = "upcoming"; // Default status
    private String paymentStatus = "pending"; // Default status
    private String phoneNumber;
    private String email;
    private String location;
    private String packageName; // Dropdown package selection
}
