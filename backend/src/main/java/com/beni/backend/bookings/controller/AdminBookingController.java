package com.beni.backend.bookings.controller;

import com.beni.backend.bookings.model.Booking;
import com.beni.backend.bookings.service.AdminBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/bookings")
public class AdminBookingController {

    @Autowired
    private AdminBookingService adminBookingService;

    // Get all bookings
    @GetMapping
    public List<Booking> getAllBookings() {
        return adminBookingService.getAllBookings();
    }

    // Get a booking by ID
    @GetMapping("/{id}")
    public Booking getBookingById(@PathVariable String id) {
        return adminBookingService.getBookingById(id);
    }

    // Update booking details
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBooking(@PathVariable String id, @RequestBody Booking booking) {
        try {
            Booking updatedBooking = adminBookingService.updateBooking(id, booking);
            return ResponseEntity.ok(updatedBooking);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An unexpected error occurred: " + e.getMessage());
        }
    }

    // Delete a booking by ID (only if the status is "cancelled" or manually cancelled)
    @DeleteMapping("/{id}")
    public String deleteBooking(@PathVariable String id) {
        return adminBookingService.deleteBooking(id);
    }
}
