package com.beni.backend.bookings.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "bookings")
public class Booking {

    @Id
    private String bookingId;
    private LocalDateTime dateTime;
    private String clientId;
    private String packageId;
    private String status;
    private String staffId;  // Can be null initially
    private String paymentStatus;
    private String phoneNumber;
    private String email;
    private String location;

}
