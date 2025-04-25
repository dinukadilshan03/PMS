package com.beni.backend.bookings.controller;

import com.beni.backend.bookings.model.Booking;
import com.beni.backend.bookings.service.BookingService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private static final Logger logger = LoggerFactory.getLogger(BookingController.class);

    @Autowired
    private BookingService bookingService;

    // Create booking endpoint
    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@Valid @RequestBody Booking booking, 
                                         @RequestHeader("Userid") String clientId,
                                         BindingResult bindingResult) {
        logger.info("Received booking creation request for client: {}", clientId);

        // Check for validation errors
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage())
            );
            logger.warn("Validation failed for booking creation: {}", errors);
            return ResponseEntity.badRequest().body(errors);
        }

        // Ensure the userId is provided in the request header
        if (clientId == null || clientId.isEmpty()) {
            logger.error("Missing Userid in request header");
            return ResponseEntity.status(400).body("User ID is required");
        }

        try {
            // Set the clientId for the booking
            booking.setClientId(clientId);

            // Additional validation using custom method
            if (!booking.isValid()) {
                logger.warn("Custom validation failed for booking");
                return ResponseEntity.badRequest().body("Invalid booking data");
            }

            // Create the booking
            Booking createdBooking = bookingService.createBooking(booking);
            logger.info("Successfully created booking with ID: {}", createdBooking.getId());
            return ResponseEntity.ok(createdBooking);
        } catch (Exception e) {
            logger.error("Error creating booking: {}", e.getMessage());
            return ResponseEntity.status(500).body("Error creating booking: " + e.getMessage());
        }
    }

    @GetMapping("/client")
    public ResponseEntity<?> getBookingsForClient(@RequestHeader("Userid") String clientId) {
        logger.info("Fetching bookings for client: {}", clientId);

        if (clientId == null || clientId.isEmpty()) {
            logger.error("Missing Userid in request header");
            return ResponseEntity.status(400).body("User ID is required");
        }

        try {
            List<Booking> bookings = bookingService.getBookingsForClient(clientId);
            logger.info("Successfully retrieved {} bookings for client: {}", bookings.size(), clientId);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            logger.error("Error fetching bookings: {}", e.getMessage());
            return ResponseEntity.status(500).body("Error fetching bookings: " + e.getMessage());
        }
    }

    @PutMapping("/reschedule/{bookingId}")
    public ResponseEntity<?> rescheduleBooking(@PathVariable String bookingId, 
                                             @RequestBody Map<String, String> requestBody,
                                             HttpSession session) {
        logger.info("Received reschedule request for booking: {}", bookingId);

        String newDateTime = requestBody.get("dateTime");
        if (newDateTime == null || newDateTime.trim().isEmpty()) {
            logger.warn("Missing dateTime in reschedule request");
            return ResponseEntity.badRequest().body("DateTime is required");
        }

        // Remove any extra quotes or whitespace
        newDateTime = newDateTime.trim().replaceAll("^\"|\"$", "");

        // Check if seconds are missing and add them
        if (newDateTime.length() == 16) {
            newDateTime += ":00";
        }

        try {
            LocalDateTime newDateTimeParsed = LocalDateTime.parse(newDateTime);
            Booking updatedBooking = bookingService.rescheduleBooking(bookingId, newDateTimeParsed);
            logger.info("Successfully rescheduled booking {} to: {}", bookingId, newDateTimeParsed);
            return ResponseEntity.ok(updatedBooking);
        } catch (DateTimeParseException e) {
            logger.error("Invalid date-time format: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Invalid date-time format");
        } catch (Exception e) {
            logger.error("Error rescheduling booking: {}", e.getMessage());
            return ResponseEntity.status(500).body("Error rescheduling booking: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{bookingId}")
    public ResponseEntity<?> deleteBooking(@PathVariable String bookingId) {
        logger.info("Received delete request for booking: {}", bookingId);

        try {
            bookingService.cancelBooking(bookingId);
            logger.info("Successfully deleted booking: {}", bookingId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Error deleting booking: {}", e.getMessage());
            return ResponseEntity.status(500).body("Error deleting booking: " + e.getMessage());
        }
    }

    @PatchMapping("/cancel/{bookingId}")
    public ResponseEntity<?> cancelBooking(@PathVariable String bookingId) {
        logger.info("Received cancel request for booking: {}", bookingId);

        try {
            Booking booking = bookingService.getBookingById(bookingId);
            if (booking == null) {
                logger.warn("Booking not found: {}", bookingId);
                return ResponseEntity.status(404).body("Booking not found");
            }

            booking.setBookingStatus("Cancelled");
            Booking updatedBooking = bookingService.saveBooking(booking);
            logger.info("Successfully cancelled booking: {}", bookingId);
            return ResponseEntity.ok(updatedBooking);
        } catch (Exception e) {
            logger.error("Error cancelling booking: {}", e.getMessage());
            return ResponseEntity.status(500).body("Error cancelling booking: " + e.getMessage());
        }
    }

    // Assign staff to a booking
    @PutMapping("/{bookingId}/assign")
    public ResponseEntity<?> assignStaff(@PathVariable String bookingId, @RequestBody Map<String, String> request) {
        logger.info("Received staff assignment request for booking: {}", bookingId);
        try {
            String staffId = request.get("staffId");
            if (staffId == null || staffId.isEmpty()) {
                return ResponseEntity.badRequest().body("Staff ID is required");
            }
            Booking updatedBooking = bookingService.assignStaff(bookingId, staffId);
            return ResponseEntity.ok(updatedBooking);
        } catch (Exception e) {
            logger.error("Error assigning staff: {}", e.getMessage());
            return ResponseEntity.status(500).body("Error assigning staff: " + e.getMessage());
        }
    }

    // Unassign staff from a booking
    @PutMapping("/{bookingId}/unassign")
    public ResponseEntity<?> unassignStaff(@PathVariable String bookingId) {
        logger.info("Received staff unassignment request for booking: {}", bookingId);
        try {
            Booking updatedBooking = bookingService.unassignStaff(bookingId);
            return ResponseEntity.ok(updatedBooking);
        } catch (Exception e) {
            logger.error("Error unassigning staff: {}", e.getMessage());
            return ResponseEntity.status(500).body("Error unassigning staff: " + e.getMessage());
        }
    }
}
