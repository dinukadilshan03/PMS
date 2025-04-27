package com.beni.backend.bookings.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Data
@Document(collection = "bookings")
public class Booking {
    private String id;

    @Future(message = "Booking date must be in the future")
    @Indexed
    private LocalDateTime dateTime;

    @NotBlank(message = "Client ID is required")
    @Indexed
    private String clientId;

    @NotBlank(message = "Booking status is required")
    @Pattern(regexp = "^(upcoming|completed|cancelled)$", message = "Invalid booking status")
    private String bookingStatus = "upcoming";

    @NotBlank(message = "Payment status is required")
    @Pattern(regexp = "^(pending|paid|refunded)$", message = "Invalid payment status")
    private String paymentStatus = "pending";

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$", 
            message = "Invalid phone number format")
    private String phoneNumber;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Indexed
    private String email;

    @NotBlank(message = "Location is required")
    @Pattern(regexp = "^[a-zA-Z0-9\\s,.-]{5,100}$", 
            message = "Location must be between 5 and 100 characters and contain only letters, numbers, spaces, commas, dots, and hyphens")
    private String location;

    @NotBlank(message = "Package name is required")
    private String packageName;

    @NotNull(message = "Price is required")
    private double price;

    private String assignedStaffId; // ID of the staff member assigned to this booking
    private String assignedStaffName; // Name of the staff member assigned to this booking

    // Custom validation method
    public boolean isValid() {
        if (dateTime == null || dateTime.isBefore(LocalDateTime.now())) {
            return false;
        }
        if (clientId == null || clientId.trim().isEmpty()) {
            return false;
        }
        if (!bookingStatus.matches("^(upcoming|completed|cancelled)$")) {
            return false;
        }
        if (!paymentStatus.matches("^(pending|paid|refunded)$")) {
            return false;
        }
        if (phoneNumber == null || !phoneNumber.matches("^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$")) {
            return false;
        }
        if (email == null || !email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            return false;
        }
        if (location == null || !location.matches("^[a-zA-Z0-9\\s,.-]{5,100}$")) {
            return false;
        }
        if (packageName == null || packageName.trim().isEmpty()) {
            return false;
        }
        if (price <= 0) {
            return false;
        }
        return true;
    }
}
