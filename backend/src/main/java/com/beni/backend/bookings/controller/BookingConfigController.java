package com.beni.backend.bookings.controller;

import com.beni.backend.bookings.model.BookingConfig;
import com.beni.backend.bookings.service.BookingConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings/config")
public class BookingConfigController {
    private final BookingConfigService bookingConfigService;

    @Autowired
    public BookingConfigController(BookingConfigService bookingConfigService) {
        this.bookingConfigService = bookingConfigService;
    }

    @GetMapping
    public ResponseEntity<BookingConfig> getConfig() {
        return ResponseEntity.ok(bookingConfigService.getConfig());
    }

    @PutMapping
    public ResponseEntity<BookingConfig> updateConfig(@RequestBody BookingConfig config) {
        return ResponseEntity.ok(bookingConfigService.updateConfig(config));
    }
} 