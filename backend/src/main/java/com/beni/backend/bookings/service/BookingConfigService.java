package com.beni.backend.bookings.service;

import com.beni.backend.bookings.model.BookingConfig;
import com.beni.backend.bookings.repository.BookingConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class BookingConfigService {
    private final BookingConfigRepository bookingConfigRepository;
    private static final String DEFAULT_CONFIG_ID = "default";

    @Autowired
    public BookingConfigService(BookingConfigRepository bookingConfigRepository) {
        this.bookingConfigRepository = bookingConfigRepository;
        initializeDefaultConfig();
    }

    @Transactional(readOnly = true)
    public BookingConfig getConfig() {
        return bookingConfigRepository.findById(DEFAULT_CONFIG_ID)
                .orElseThrow(() -> new RuntimeException("Booking configuration not found"));
    }

    @Transactional
    public BookingConfig updateConfig(BookingConfig newConfig) {
        BookingConfig existingConfig = getConfig();
        
        // Update only the fields that are not null in the new config
        if (newConfig.getMaxBookingsPerDay() != null) {
            existingConfig.setMaxBookingsPerDay(newConfig.getMaxBookingsPerDay());
        }
        if (newConfig.getMinAdvanceBookingDays() != null) {
            existingConfig.setMinAdvanceBookingDays(newConfig.getMinAdvanceBookingDays());
        }
        if (newConfig.getMaxAdvanceBookingDays() != null) {
            existingConfig.setMaxAdvanceBookingDays(newConfig.getMaxAdvanceBookingDays());
        }
        if (newConfig.getCancellationFeePercentage() != null) {
            existingConfig.setCancellationFeePercentage(newConfig.getCancellationFeePercentage());
        }
        if (newConfig.getRescheduleLimitDays() != null) {
            existingConfig.setRescheduleLimitDays(newConfig.getRescheduleLimitDays());
        }

        return bookingConfigRepository.save(existingConfig);
    }

    private void initializeDefaultConfig() {
        if (!bookingConfigRepository.existsById(DEFAULT_CONFIG_ID)) {
            BookingConfig defaultConfig = new BookingConfig();
            defaultConfig.setId(DEFAULT_CONFIG_ID);
            defaultConfig.setMaxBookingsPerDay(3);
            defaultConfig.setMinAdvanceBookingDays(1);
            defaultConfig.setMaxAdvanceBookingDays(30);
            defaultConfig.setCancellationFeePercentage(20.0);
            defaultConfig.setRescheduleLimitDays(2);
            defaultConfig.setRescheduleWindowHours(48);
            defaultConfig.setCancellationWindowHours(24);
            bookingConfigRepository.save(defaultConfig);
        }
    }
} 