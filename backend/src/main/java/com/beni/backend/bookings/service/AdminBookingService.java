package com.beni.backend.bookings.service;

import com.beni.backend.bookings.model.Booking;
import com.beni.backend.bookings.repository.BookingRepository;
import com.beni.backend.staff.model.Staff;
import com.beni.backend.staff.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminBookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private BookingValidationService validationService;

    // Get all bookings with staff information
    public List<Booking> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        return bookings.stream().map(booking -> {
            if (booking.getAssignedStaffId() != null) {
                Optional<Staff> staff = staffRepository.findById(booking.getAssignedStaffId());
                staff.ifPresent(s -> booking.setAssignedStaffName(s.getName()));
            }
            return booking;
        }).collect(Collectors.toList());
    }

    // Get a booking by ID
    public Booking getBookingById(String id) {
        Optional<Booking> bookingOptional = bookingRepository.findById(id);
        return bookingOptional.orElseThrow(() -> new IllegalArgumentException("Booking not found"));
    }

    // Update booking details
    public Booking updateBooking(String id, Booking updatedBooking) {
        Booking existingBooking = getBookingById(id);
        
        // Validate the updated booking data
        if (updatedBooking.getDateTime() != null) {
            validationService.validateBookingLimit(updatedBooking.getDateTime());
            validationService.validateAdvanceBooking(updatedBooking.getDateTime());
            validationService.validateNotInPast(updatedBooking.getDateTime());
        }
        
        // Validate booking status
        if (updatedBooking.getBookingStatus() != null && 
            !updatedBooking.getBookingStatus().matches("^(upcoming|completed|cancelled)$")) {
            throw new IllegalArgumentException("Invalid booking status");
        }
        
        // Validate payment status
        if (updatedBooking.getPaymentStatus() != null && 
            !updatedBooking.getPaymentStatus().matches("^(pending|paid|refunded)$")) {
            throw new IllegalArgumentException("Invalid payment status");
        }

        // Update only the fields that were provided
        if (updatedBooking.getDateTime() != null) {
            existingBooking.setDateTime(updatedBooking.getDateTime());
        }
        if (updatedBooking.getBookingStatus() != null) {
            existingBooking.setBookingStatus(updatedBooking.getBookingStatus());
        }
        if (updatedBooking.getPaymentStatus() != null) {
            existingBooking.setPaymentStatus(updatedBooking.getPaymentStatus());
        }
        
        return bookingRepository.save(existingBooking);
    }

    // Delete a booking by ID
    public String deleteBooking(String id) {
        Booking booking = getBookingById(id);
        bookingRepository.deleteById(id);
        return "Booking deleted successfully";
    }
}
