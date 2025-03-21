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
    private String role;
    private List<Availability> availability;  // List of availability slots
    private List<String> assignedEvents;
    private String checkInTime;
    private String checkOutTime;
    private Earnings earnings;
    private List<Rating> ratings;

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

    @Data
    public static class Availability {
        private String date;  // Date for the availability
        private boolean isAvailable;  // Availability status (true if available, false if not)
    }
}
