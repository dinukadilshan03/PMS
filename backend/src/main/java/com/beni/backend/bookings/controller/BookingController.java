package com.beni.backend.bookings.controller;

import com.beni.backend.bookings.model.Booking;
import com.beni.backend.bookings.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/available-slots")
    public List<LocalDateTime> getAvailableSlots(@RequestParam String date) {
        // Parse the date received as a string (e.g., "2025-04-15")
        LocalDateTime parsedDate = LocalDateTime.parse(date + "T00:00:00");
        return bookingService.getAvailableSlots(parsedDate);
    }

    @GetMapping("/user/{userId}")
    public List<Booking> getUserBookings(@PathVariable String userId) {
        return bookingService.getUserBookings(userId);
    }

    @PutMapping("/{bookingId}/cancel")
    public Booking cancelUserBooking(@PathVariable String bookingId) {
        return bookingService.cancelBooking(bookingId);
    }

    @PutMapping("/{bookingId}/reschedule")
    public Booking rescheduleBooking(
            @PathVariable String bookingId,
            @RequestBody LocalDateTime newDateTime) {
        return bookingService.rescheduleBooking(bookingId, newDateTime);
    }
}
