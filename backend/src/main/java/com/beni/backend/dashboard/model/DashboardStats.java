package com.beni.backend.dashboard.model;

import lombok.Data;

@Data
public class DashboardStats {
    private long totalBookings;
    private long pendingBookings;
    private long totalAlbums;
    private long totalStaff;
    private long totalPackages;
    private long totalPortfolioItems;
} 