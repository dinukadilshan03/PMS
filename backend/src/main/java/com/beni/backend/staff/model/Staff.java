package com.beni.backend.staff.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "staff")
public class Staff {

    @Id
    private String id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String experience;
    private int hourlyRate;
    private String specialization;
    private boolean availability;  // Single boolean for availability (true = available, false = busy)
    private String checkInTime;
    private String checkOutTime;
    private Earnings earnings;
    private List<Rating> ratings;
    private String availabilityStartDate;  // Start date of availability range (ISO 8601 format)
    private String availabilityEndDate;    // End date of availability range (ISO 8601 format)
    private String assignedBookingId; // ID of the booking this staff is assigned to
    private String password; // Password for user account creation

    // Subclasses for Earnings and Ratings
    @Data
    public static class Earnings {
        private int hourlyRate;
        private int totalHours;
        private int totalEarnings;
    }

    @Data
    public static class Rating {
        private String event;
        private int rating;
        private String feedback;
    }
}
