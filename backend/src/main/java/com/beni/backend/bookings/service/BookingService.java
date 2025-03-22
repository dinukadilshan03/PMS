package com.beni.backend.bookings.service;

import com.beni.backend.bookings.model.Booking;
import com.beni.backend.bookings.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    // Create a new booking
    public Booking createBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    // Get all bookings
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Get available slots for a given date (daytime and nighttime)
    public List<LocalDateTime> getAvailableSlots(LocalDateTime date) {
        // Define the daytime and nighttime slots
        LocalDateTime daytimeSlotStart = date.toLocalDate().atTime(8, 0); // 08:00 AM
        LocalDateTime daytimeSlotEnd = date.toLocalDate().atTime(18, 0);  // 06:00 PM
        LocalDateTime nighttimeSlotStart = date.toLocalDate().atTime(18, 0); // 06:00 PM
        LocalDateTime nighttimeSlotEnd = date.toLocalDate().atTime(23, 59); // 11:59 PM

        // Fetch all bookings for the given date
        List<Booking> bookedSlots = bookingRepository.findByDateTimeBetween(date.toLocalDate().atStartOfDay(), date.toLocalDate().atTime(23, 59));

        List<LocalDateTime> availableSlots = new ArrayList<>();

        // Check if daytime slot is available
        boolean isDaytimeBooked = false;
        for (Booking booking : bookedSlots) {
            if (!booking.getDateTime().isBefore(daytimeSlotStart) && booking.getDateTime().isBefore(daytimeSlotEnd)) {
                isDaytimeBooked = true;
                break;
            }
        }
        if (!isDaytimeBooked) {
            availableSlots.add(daytimeSlotStart); // Daytime slot is available
        }

        // Check if nighttime slot is available
        boolean isNighttimeBooked = false;
        for (Booking booking : bookedSlots) {
            if (!booking.getDateTime().isBefore(nighttimeSlotStart) && booking.getDateTime().isBefore(nighttimeSlotEnd)) {
                isNighttimeBooked = true;
                break;
            }
        }
        if (!isNighttimeBooked) {
            availableSlots.add(nighttimeSlotStart); // Nighttime slot is available
        }

        return availableSlots;
    }
}
