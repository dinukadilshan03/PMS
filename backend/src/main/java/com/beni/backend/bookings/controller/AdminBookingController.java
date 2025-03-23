package com.beni.backend.bookings.controller;

import com.beni.backend.bookings.model.Booking;
import com.beni.backend.bookings.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/bookings")
public class AdminBookingController {

    @Autowired
    private BookingService bookingService;

    // 1. View all bookings (with optional filters)
    @GetMapping
    public List<Booking> getAllBookings(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String paymentStatus,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return bookingService.getAllBookings(status, paymentStatus, startDate, endDate);
    }

    // 2. Modify booking details
    @PostMapping("/{id}/modify")
    public Booking modifyBooking(@PathVariable String id, @RequestBody Booking modifiedBooking) {
        return bookingService.modifyBooking(id, modifiedBooking);
    }

    // 3. Cancel booking
    @PostMapping("/{id}/cancel")
    public Booking cancelBooking(@PathVariable String id) {
        return bookingService.cancelBooking(id);
    }

    // 4. Set payment status
    @PostMapping("/{id}/payment-status")
    public Booking setPaymentStatus(@PathVariable String id, @RequestParam String paymentStatus) {
        return bookingService.setPaymentStatus(id, paymentStatus);
    }
}
