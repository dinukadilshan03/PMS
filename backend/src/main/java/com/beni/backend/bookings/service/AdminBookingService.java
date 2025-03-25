package com.beni.backend.bookings.service;


import com.beni.backend.bookings.model.Booking;
import com.beni.backend.bookings.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminBookingService {

    @Autowired
    private BookingRepository bookingRepository;

    // Get all bookings
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Get a booking by ID
    public Booking getBookingById(String id) {
        Optional<Booking> bookingOptional = bookingRepository.findById(id);
        return bookingOptional.orElseThrow(() -> new IllegalArgumentException("Booking not found"));
    }

    // Update booking details
    public Booking updateBooking(String id, Booking updatedBooking) {
        Booking existingBooking = getBookingById(id);
        existingBooking.setDateTime(updatedBooking.getDateTime());
        existingBooking.setBookingStatus(updatedBooking.getBookingStatus());
        existingBooking.setPaymentStatus(updatedBooking.getPaymentStatus());
        return bookingRepository.save(existingBooking);
    }

    // Delete a booking by ID (only if the status is "cancelled" or manually cancelled)
    public String deleteBooking(String id) {
        Booking booking = getBookingById(id);
        if ("cancelled".equals(booking.getBookingStatus()) || "cancelled".equals(booking.getPaymentStatus())) {
            bookingRepository.deleteById(id);
            return "Booking deleted successfully";
        } else {
            return "Booking cannot be deleted as it is not cancelled";
        }
    }
}
