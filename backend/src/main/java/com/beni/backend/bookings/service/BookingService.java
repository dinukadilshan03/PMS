package com.beni.backend.bookings.service;

import com.beni.backend.bookings.model.Booking;
import com.beni.backend.bookings.repository.BookingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {
    private static final Logger logger = LoggerFactory.getLogger(BookingService.class);

    @Autowired
    private BookingRepository bookingRepository;

    // Create a booking
    public Booking createBooking(Booking booking) {
        logger.info("Attempting to create booking for client: {}", booking.getClientId());
        
        // Get the date from the booking's dateTime
        LocalDate selectedDate = booking.getDateTime().toLocalDate();

        // Convert LocalDate to LocalDateTime for start and end of the day
        LocalDateTime startOfDay = selectedDate.atStartOfDay(); // 00:00
        LocalDateTime endOfDay = selectedDate.atTime(23, 59, 59); // 23:59:59

        // Count bookings for the selected day
        long bookingsForDay = bookingRepository.countByDateTimeBetween(startOfDay, endOfDay);
        logger.debug("Current bookings for date {}: {}", selectedDate, bookingsForDay);

        if (bookingsForDay >= 3) {
            logger.warn("Booking limit reached for date: {}", selectedDate);
            throw new RuntimeException("Cannot create more than 3 bookings per day.");
        }

        Booking savedBooking = bookingRepository.save(booking);
        logger.info("Successfully created booking with ID: {}", savedBooking.getId());
        return savedBooking;
    }

    // Fetch bookings for a specific client
    public List<Booking> getBookingsForClient(String clientId) {
        logger.info("Fetching bookings for client: {}", clientId);
        List<Booking> bookings = bookingRepository.findByClientId(clientId);
        logger.debug("Found {} bookings for client: {}", bookings.size(), clientId);
        return bookings;
    }

    // Reschedule booking
    public Booking rescheduleBooking(String bookingId, LocalDateTime newDateTime) {
        logger.info("Attempting to reschedule booking: {} to: {}", bookingId, newDateTime);
        
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> {
                    logger.error("Booking not found with ID: {}", bookingId);
                    return new RuntimeException("Booking not found");
                });

        // Get the new date from the new dateTime
        LocalDate newDate = newDateTime.toLocalDate();

        // Convert LocalDate to LocalDateTime for start and end of the day
        LocalDateTime startOfDay = newDate.atStartOfDay(); // 00:00
        LocalDateTime endOfDay = newDate.atTime(23, 59, 59); // 23:59:59

        // Count bookings for the new date
        long bookingsForNewDay = bookingRepository.countByDateTimeBetween(startOfDay, endOfDay);
        logger.debug("Current bookings for new date {}: {}", newDate, bookingsForNewDay);
        
        if (bookingsForNewDay >= 3) {
            logger.warn("Cannot reschedule booking {} - limit reached for date: {}", bookingId, newDate);
            throw new RuntimeException("Cannot reschedule to this date. Limit of 3 bookings per day.");
        }

        booking.setDateTime(newDateTime);
        Booking updatedBooking = bookingRepository.save(booking);
        logger.info("Successfully rescheduled booking {} to: {}", bookingId, newDateTime);
        return updatedBooking;
    }

    // Cancel booking
    public void cancelBooking(String bookingId) {
        logger.info("Attempting to cancel booking: {}", bookingId);
        bookingRepository.deleteById(bookingId);
        logger.info("Successfully cancelled booking: {}", bookingId);
    }

    // Method to get a booking by ID
    public Booking getBookingById(String bookingId) {
        logger.debug("Fetching booking by ID: {}", bookingId);
        return bookingRepository.findById(bookingId).orElse(null);
    }

    // Method to save an updated booking
    public Booking saveBooking(Booking booking) {
        logger.info("Saving updated booking: {}", booking.getId());
        return bookingRepository.save(booking);
    }

    // Assign staff to a booking
    public Booking assignStaff(String bookingId, String staffId) {
        logger.info("Assigning staff {} to booking {}", staffId, bookingId);
        Booking booking = getBookingById(bookingId);
        if (booking == null) {
            throw new RuntimeException("Booking not found");
        }
        booking.setAssignedStaffId(staffId);
        return saveBooking(booking);
    }

    // Unassign staff from a booking
    public Booking unassignStaff(String bookingId) {
        logger.info("Unassigning staff from booking {}", bookingId);
        Booking booking = getBookingById(bookingId);
        if (booking == null) {
            throw new RuntimeException("Booking not found");
        }
        booking.setAssignedStaffId(null);
        return saveBooking(booking);
    }
}
