package com.beni.backend.bookings.service;

import com.beni.backend.bookings.exception.BookingException;
import com.beni.backend.bookings.model.Booking;
import com.beni.backend.bookings.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class BookingValidationService {
    @Autowired
    private BookingRepository bookingRepository;
    private final LocationPricingService locationPricingService;
    private final BookingConfigService bookingConfigService;

    public BookingValidationService(
            LocationPricingService locationPricingService,
            BookingConfigService bookingConfigService) {
        this.locationPricingService = locationPricingService;
        this.bookingConfigService = bookingConfigService;
    }

    /**
     * Validates a booking for creation
     * @param booking The booking to validate
     * @throws BookingException if validation fails
     */
    public void validateBooking(Booking booking) {
        validateLocation(booking.getLocation());
        validateBookingLimit(booking.getDateTime());
        validateAdvanceBooking(booking.getDateTime());
        validateNotInPast(booking.getDateTime());
        validateBookingData(booking);
    }

    /**
     * Validates a booking for rescheduling
     * @param bookingId The ID of the booking to reschedule
     * @param newDateTime The new date and time
     * @throws BookingException if validation fails
     */
    public void validateReschedule(String bookingId, LocalDateTime newDateTime) {
        if (bookingRepository.findById(bookingId).isEmpty()) {
            throw new BookingException("Booking not found");
        }
        validateBookingLimit(newDateTime);
        validateRescheduleWindow(bookingId, newDateTime);
    }

    private void validateLocation(String location) {
        if (!locationPricingService.isValidLocation(location)) {
            throw new BookingException("Invalid location provided");
        }
    }

    public void validateBookingLimit(LocalDateTime dateTime) {
        var startOfDay = dateTime.toLocalDate().atStartOfDay();
        var endOfDay = dateTime.toLocalDate().atTime(23, 59, 59);
        
        long bookingsForDay = bookingRepository.countByDateTimeBetween(startOfDay, endOfDay);
        var config = bookingConfigService.getConfig();
        int maxBookingsPerDay = config.getMaxBookingsPerDay();
        
        if (bookingsForDay >= maxBookingsPerDay) {
            throw new BookingException("Cannot create more than " + maxBookingsPerDay + " bookings per day");
        }
    }

    public void validateAdvanceBooking(LocalDateTime dateTime) {
        var config = bookingConfigService.getConfig();
        var now = LocalDateTime.now();
        var daysInAdvance = java.time.temporal.ChronoUnit.DAYS.between(now.toLocalDate(), dateTime.toLocalDate());
        
        if (daysInAdvance < config.getMinAdvanceBookingDays()) {
            throw new BookingException("Bookings must be made at least " + config.getMinAdvanceBookingDays() + " days in advance");
        }
        
        if (daysInAdvance > config.getMaxAdvanceBookingDays()) {
            throw new BookingException("Bookings cannot be made more than " + config.getMaxAdvanceBookingDays() + " days in advance");
        }
    }

    public void validateNotInPast(LocalDateTime dateTime) {
        if (dateTime.isBefore(LocalDateTime.now())) {
            throw new BookingException("Cannot create booking for a past date/time");
        }
    }

    private void validateBookingData(Booking booking) {
        if (!booking.isValid()) {
            throw new BookingException("Invalid booking data");
        }
        
        // Validate against booking config
        var config = bookingConfigService.getConfig();
        validateAdvanceBooking(booking.getDateTime());
    }

    private void validateRescheduleWindow(String bookingId, LocalDateTime newDateTime) {
        var booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingException("Booking not found"));
        var config = bookingConfigService.getConfig();
        var now = LocalDateTime.now();
        
        // Check if rescheduling is allowed within the window
        var hoursUntilBooking = java.time.temporal.ChronoUnit.HOURS.between(now, booking.getDateTime());
        if (hoursUntilBooking <= config.getRescheduleWindowHours()) {
            throw new BookingException("Cannot reschedule within " + config.getRescheduleWindowHours() + " hours of the booking");
        }
        
        // Validate the new date against advance booking rules
        validateAdvanceBooking(newDateTime);
    }

    public void validateCancellation(String bookingId) {
        var booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingException("Booking not found"));
        validateCancellationWindow(booking);
    }

    private void validateCancellationWindow(Booking booking) {
        var config = bookingConfigService.getConfig();
        var now = LocalDateTime.now();
        
        // Check if cancellation is allowed within the window
        var hoursUntilBooking = java.time.temporal.ChronoUnit.HOURS.between(now, booking.getDateTime());
        if (hoursUntilBooking <= config.getCancellationWindowHours()) {
            throw new BookingException("Cannot cancel within " + config.getCancellationWindowHours() + " hours of the booking");
        }
    }
} 