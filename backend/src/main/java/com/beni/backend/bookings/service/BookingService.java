package com.beni.backend.bookings.service;

import com.beni.backend.bookings.exception.BookingException;
import com.beni.backend.bookings.model.Booking;
import com.beni.backend.bookings.repository.BookingRepository;
import com.beni.backend.bookings.service.LocationPricingService;
import com.beni.backend.bookings.service.BookingValidationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Service class for managing bookings
 */
@Service
public class BookingService {
    private static final Logger logger = LoggerFactory.getLogger(BookingService.class);

    private final BookingRepository bookingRepository;
    private final LocationPricingService locationPricingService;
    private final BookingValidationService validationService;

    public BookingService(
            BookingRepository bookingRepository,
            LocationPricingService locationPricingService,
            BookingValidationService validationService) {
        this.bookingRepository = bookingRepository;
        this.locationPricingService = locationPricingService;
        this.validationService = validationService;
    }

    /**
     * Creates a new booking
     * @param booking The booking to create
     * @return The created booking
     * @throws BookingException if validation fails
     */
    public Booking createBooking(Booking booking) {
        logger.info("Attempting to create booking for client: {}", booking.getClientId());
        
        try {
            validationService.validateBooking(booking);
            
            // Calculate and set the final price based on location
            double basePrice = booking.getPrice();
            double finalPrice = locationPricingService.calculateTotalPrice(basePrice, booking.getLocation());
            booking.setPrice(finalPrice);

            Booking savedBooking = bookingRepository.save(booking);
            logger.info("Successfully created booking with ID: {}", savedBooking.getId());
            return savedBooking;
        } catch (Exception e) {
            logger.error("Error creating booking: {}", e.getMessage());
            throw new BookingException("Failed to create booking: " + e.getMessage(), e);
        }
    }

    /**
     * Fetches all bookings for a specific client
     * @param clientId The client ID
     * @return List of bookings for the client
     */
    public List<Booking> getBookingsForClient(String clientId) {
        logger.info("Fetching bookings for client: {}", clientId);
        List<Booking> bookings = bookingRepository.findByClientId(clientId);
        logger.debug("Found {} bookings for client: {}", bookings.size(), clientId);
        return bookings;
    }

    /**
     * Reschedules a booking to a new date and time
     * @param bookingId The ID of the booking to reschedule
     * @param newDateTime The new date and time
     * @return The updated booking
     * @throws BookingException if validation fails
     */
    public Booking rescheduleBooking(String bookingId, LocalDateTime newDateTime) {
        logger.info("Attempting to reschedule booking: {} to: {}", bookingId, newDateTime);
        
        try {
            validationService.validateReschedule(bookingId, newDateTime);
            
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new BookingException("Booking not found"));
            
            booking.setDateTime(newDateTime);
            Booking updatedBooking = bookingRepository.save(booking);
            logger.info("Successfully rescheduled booking {} to: {}", bookingId, newDateTime);
            return updatedBooking;
        } catch (Exception e) {
            logger.error("Error rescheduling booking: {}", e.getMessage());
            throw new BookingException("Failed to reschedule booking: " + e.getMessage(), e);
        }
    }

    /**
     * Cancels a booking
     * @param bookingId The ID of the booking to cancel
     * @throws BookingException if the booking doesn't exist
     */
    public Booking cancelBooking(String bookingId) {
        logger.info("Attempting to cancel booking: {}", bookingId);
        try {
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new BookingException("Booking not found"));
            
            booking.setBookingStatus("Cancelled");
            Booking cancelledBooking = bookingRepository.save(booking);
            logger.info("Successfully cancelled booking: {}", bookingId);
            return cancelledBooking;
        } catch (Exception e) {
            logger.error("Error cancelling booking: {}", e.getMessage());
            throw new BookingException("Failed to cancel booking: " + e.getMessage(), e);
        }
    }

    /**
     * Gets a booking by ID
     * @param bookingId The ID of the booking
     * @return The booking, or null if not found
     */
    public Booking getBookingById(String bookingId) {
        logger.debug("Fetching booking by ID: {}", bookingId);
        return bookingRepository.findById(bookingId).orElse(null);
    }

    /**
     * Assigns a staff member to a booking
     * @param bookingId The ID of the booking
     * @param staffId The ID of the staff member
     * @return The updated booking
     * @throws BookingException if the booking doesn't exist
     */
    public Booking assignStaff(String bookingId, String staffId) {
        logger.info("Assigning staff {} to booking {}", staffId, bookingId);
        try {
            Booking booking = getBookingById(bookingId);
            if (booking == null) {
                throw new BookingException("Booking not found");
            }
            booking.setAssignedStaffId(staffId);
            return bookingRepository.save(booking);
        } catch (Exception e) {
            logger.error("Error assigning staff: {}", e.getMessage());
            throw new BookingException("Failed to assign staff: " + e.getMessage(), e);
        }
    }

    /**
     * Unassigns staff from a booking
     * @param bookingId The ID of the booking
     * @return The updated booking
     * @throws BookingException if the booking doesn't exist
     */
    public Booking unassignStaff(String bookingId) {
        logger.info("Unassigning staff from booking {}", bookingId);
        try {
            Booking booking = getBookingById(bookingId);
            if (booking == null) {
                throw new BookingException("Booking not found");
            }
            booking.setAssignedStaffId(null);
            return bookingRepository.save(booking);
        } catch (Exception e) {
            logger.error("Error unassigning staff: {}", e.getMessage());
            throw new BookingException("Failed to unassign staff: " + e.getMessage(), e);
        }
    }

    public Booking saveBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    /**
     * Gets all bookings assigned to a specific staff member
     * @param staffId The ID of the staff member
     * @return List of bookings assigned to the staff member
     */
    public List<Booking> getBookingsForStaff(String staffId) {
        logger.info("Fetching bookings for staff: {}", staffId);
        List<Booking> bookings = bookingRepository.findByAssignedStaffId(staffId);
        logger.debug("Found {} bookings for staff: {}", bookings.size(), staffId);
        return bookings;
    }
}
