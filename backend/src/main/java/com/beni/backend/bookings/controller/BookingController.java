package com.beni.backend.bookings.controller;

import com.beni.backend.bookings.model.Booking;
import com.beni.backend.bookings.service.BookingService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

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
    public ResponseEntity<Booking> rescheduleBooking(@PathVariable String bookingId, @RequestBody String newDateTime, HttpSession session) {
        LocalDateTime newDateTimeParsed = LocalDateTime.parse(newDateTime);
        Booking updatedBooking = bookingService.rescheduleBooking(bookingId, newDateTimeParsed);
        return ResponseEntity.ok(updatedBooking);
    }

    @DeleteMapping("/cancel/{bookingId}")
    public ResponseEntity<Void> cancelBooking(@PathVariable String bookingId) {
        bookingService.cancelBooking(bookingId);
        return ResponseEntity.noContent().build();
    }
}
