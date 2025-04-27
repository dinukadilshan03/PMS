package com.beni.backend.bookings.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class LocationPricingService {
    private static final Map<String, Double> LOCATION_MULTIPLIERS = new HashMap<>();

    static {
        // Initialize location multipliers
        LOCATION_MULTIPLIERS.put("Colombo", 1.0);
        LOCATION_MULTIPLIERS.put("Gampaha", 1.1);
        LOCATION_MULTIPLIERS.put("Kalutara", 1.2);
        LOCATION_MULTIPLIERS.put("Kandy", 1.3);
        LOCATION_MULTIPLIERS.put("Galle", 1.4);
        LOCATION_MULTIPLIERS.put("Matara", 1.5);
        LOCATION_MULTIPLIERS.put("Negombo", 1.1);
        LOCATION_MULTIPLIERS.put("Anuradhapura", 1.6);
        LOCATION_MULTIPLIERS.put("Jaffna", 1.8);
        LOCATION_MULTIPLIERS.put("Trincomalee", 1.7);
        LOCATION_MULTIPLIERS.put("Batticaloa", 1.7);
        LOCATION_MULTIPLIERS.put("Ratnapura", 1.4);
        LOCATION_MULTIPLIERS.put("Badulla", 1.5);
        LOCATION_MULTIPLIERS.put("Kurunegala", 1.3);
        LOCATION_MULTIPLIERS.put("Puttalam", 1.4);
    }

    public double calculateTotalPrice(double basePrice, String location) {
        if (location == null || location.trim().isEmpty()) {
            return basePrice;
        }

        Double multiplier = LOCATION_MULTIPLIERS.get(location);
        if (multiplier == null) {
            // If location is not in our list, use a default multiplier
            return basePrice * 1.5;
        }

        return Math.round(basePrice * multiplier);
    }

    public boolean isValidLocation(String location) {
        return location != null && !location.trim().isEmpty() && LOCATION_MULTIPLIERS.containsKey(location);
    }

    public Map<String, Double> getAllLocationMultipliers() {
        return new HashMap<>(LOCATION_MULTIPLIERS);
    }
} 