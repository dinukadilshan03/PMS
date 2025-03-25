package com.beni.backend.bookings.controller;

import com.beni.backend.bookings.model.Booking;
import com.beni.backend.bookings.service.BookingService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // Create booking endpoint
    @PostMapping("/create")
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking, @RequestHeader("Userid") String clientId) {
        // Ensure the userId is provided in the request header
        if (clientId == null || clientId.isEmpty()) {
            return ResponseEntity.status(400).body(null); // Bad Request if userId is not provided
        }

        // Set the clientId for the booking
        booking.setClientId(clientId);

        // Create the booking
        Booking createdBooking = bookingService.createBooking(booking);
        return ResponseEntity.ok(createdBooking);
    }

    @GetMapping("/client")
    public ResponseEntity<List<Booking>> getBookingsForClient(@RequestHeader("userId") String clientId) {
        // Ensure the userId is provided in the request header
        if (clientId == null || clientId.isEmpty()) {
            return ResponseEntity.status(400).body(null); // Bad Request if userId is not provided
        }

        List<Booking> bookings = bookingService.getBookingsForClient(clientId);
        return ResponseEntity.ok(bookings);
    }


    @PutMapping("/reschedule/{bookingId}")
    public ResponseEntity<Booking> rescheduleBooking(@PathVariable String bookingId, @RequestBody Map<String, String> requestBody, HttpSession session) {
        // Extract the dateTime from the request body (now it's a Map)
        String newDateTime = requestBody.get("dateTime");

        // Log the received date-time string
        System.out.println("Received newDateTime: " + newDateTime);

        // Remove any extra quotes or whitespace around the date-time string
        newDateTime = newDateTime.trim().replaceAll("^\"|\"$", "");

        // Check if seconds are missing and add them
        if (newDateTime.length() == 16) { // "yyyy-MM-dd'T'HH:mm" (missing seconds)
            newDateTime += ":00"; // Add the missing seconds part
        }

        try {
            // Parse the cleaned-up date-time string into a LocalDateTime
            LocalDateTime newDateTimeParsed = LocalDateTime.parse(newDateTime);

            // Proceed with the reschedule logic
            Booking updatedBooking = bookingService.rescheduleBooking(bookingId, newDateTimeParsed);
            return ResponseEntity.ok(updatedBooking);

        } catch (DateTimeParseException e) {
            // Handle invalid date-time format
            System.out.println("Error parsing date-time: " + e.getMessage());
            return ResponseEntity.status(400).body(null); // Bad Request if the date format is incorrect
        }
    }



    @DeleteMapping("/delete/{bookingId}")
    public ResponseEntity<Void> DeleteBooking(@PathVariable String bookingId) {
        bookingService.cancelBooking(bookingId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/cancel/{bookingId}")
    public ResponseEntity<Booking> cancelBooking(@PathVariable String bookingId) {
        // Fetch the booking by ID
        Booking booking = bookingService.getBookingById(bookingId);

        if (booking == null) {
            return ResponseEntity.status(404).body(null); // Not Found if booking does not exist
        }

        // Set the booking status to "Cancelled"
        booking.setBookingStatus("Cancelled");

        // Save the updated booking back to the database
        Booking updatedBooking = bookingService.saveBooking(booking);

        return ResponseEntity.ok(updatedBooking); // Return the updated booking
    }


}
