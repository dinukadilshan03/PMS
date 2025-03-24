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

     // 1. Get all bookings with filters
    public List<Booking> getAllBookings(String status, String paymentStatus, String startDate, String endDate) {
        if (status == null && paymentStatus == null && startDate == null && endDate == null) {
            return bookingRepository.findAll(); // No filters, return all bookings
        }
        return bookingRepository.findBookingsWithFilters(status, paymentStatus, startDate, endDate);
    }

    // 2. Modify booking
    public Booking modifyBooking(String id, Booking modifiedBooking) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setDateTime(modifiedBooking.getDateTime());
        booking.setPackageId(modifiedBooking.getPackageId());
        booking.setPhoneNumber(modifiedBooking.getPhoneNumber());
        booking.setEmail(modifiedBooking.getEmail());
        booking.setLocation(modifiedBooking.getLocation());
        return bookingRepository.save(booking);
    }

    // 3. Cancel booking
    public Booking cancelBooking(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus("Cancelled");
        return bookingRepository.save(booking);
    }

    // 4. Set payment status
    public Booking setPaymentStatus(String id, String paymentStatus) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setPaymentStatus(paymentStatus);
        return bookingRepository.save(booking);
    }


    public Booking rescheduleBooking(String bookingId, LocalDateTime newDateTime) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        //Check if the new time is available
        if (!isTimeSlotAvailable(newDateTime)) {
            throw new RuntimeException("The selected time slot is not available");
        }

        booking.setDateTime(newDateTime);
        return bookingRepository.save(booking);
    }

    private boolean isTimeSlotAvailable(LocalDateTime dateTime) {
        // Get the start and end of the day
        LocalDateTime startOfDay = dateTime.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = dateTime.toLocalDate().atTime(23, 59, 59);

        // Check if there are any bookings at this time
        List<Booking> existingBookings = bookingRepository.findByDateTimeBetween(startOfDay, endOfDay);
        return existingBookings.stream()
                .noneMatch(b -> b.getDateTime().equals(dateTime));
    }
}
