package com.beni.backend.bookings.service;

import com.beni.backend.bookings.model.Booking;
import com.beni.backend.bookings.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    // Create a booking
    public Booking createBooking(Booking booking) {
        // Get the date from the booking's dateTime
        LocalDate selectedDate = booking.getDateTime().toLocalDate();

        // Convert LocalDate to LocalDateTime for start and end of the day
        LocalDateTime startOfDay = selectedDate.atStartOfDay(); // 00:00
        LocalDateTime endOfDay = selectedDate.atTime(23, 59, 59); // 23:59:59

        // Count bookings for the selected day
        long bookingsForDay = bookingRepository.countByDateTimeBetween(startOfDay, endOfDay);

        if (bookingsForDay >= 3) {
            throw new RuntimeException("Cannot create more than 3 bookings per day.");
        }

        return bookingRepository.save(booking);
    }

    // Fetch bookings for a specific client
    public List<Booking> getBookingsForClient(String clientId) {
        return bookingRepository.findByClientId(clientId);
    }

    // Reschedule booking
    public Booking rescheduleBooking(String bookingId, LocalDateTime newDateTime) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Get the new date from the new dateTime
        LocalDate newDate = newDateTime.toLocalDate();

        // Convert LocalDate to LocalDateTime for start and end of the day
        LocalDateTime startOfDay = newDate.atStartOfDay(); // 00:00
        LocalDateTime endOfDay = newDate.atTime(23, 59, 59); // 23:59:59

        // Count bookings for the new date
        long bookingsForNewDay = bookingRepository.countByDateTimeBetween(startOfDay, endOfDay);
        if (bookingsForNewDay >= 3) {
            throw new RuntimeException("Cannot reschedule to this date. Limit of 3 bookings per day.");
        }

        booking.setDateTime(newDateTime);
        return bookingRepository.save(booking);
    }

    // Cancel booking
    public void cancelBooking(String bookingId) {
        bookingRepository.deleteById(bookingId);
    }

    // Method to get a booking by ID
    public Booking getBookingById(String bookingId) {
        return bookingRepository.findById(bookingId).orElse(null);
    }

    // Method to save an updated booking
    public Booking saveBooking(Booking booking) {
        return bookingRepository.save(booking);
    }
}
