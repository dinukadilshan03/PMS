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
    private String address;        // Address of the staff member
    private String experience;     // Experience (e.g., number of years)
    private int hourlyRate;        // Hourly rate for the photographer
    private String specialization; // Specialization (e.g., Portraits, Weddings, Events)
    private List<Availability> availability;  // List of availability slots
    private List<String> assignedEvents;      // List of events the photographer is assigned to
    private String checkInTime;    // Time when the photographer checks in
    private String checkOutTime;   // Time when the photographer checks out
    private Earnings earnings;     // Photographer earnings details
    private List<Rating> ratings;  // Ratings from clients/events

    // Subclasses for Earnings and Ratings
    @Data
    public static class Earnings {
        private int hourlyRate;    // Rate per hour
        private int totalHours;    // Total hours worked for the event
        private int totalEarnings; // Total earnings based on hourly rate and total hours worked
    }

    @Data
    public static class Rating {
        private String event;     // Event name or ID
        private int rating;       // Rating for the photographer
        private String feedback;  // Feedback from the client
    }

    @Data
    public static class Availability {
        private String date;        // Date for availability (e.g., 2025-03-19)
        private boolean isAvailable;  // Availability status (true = available, false = busy)
    }
}
