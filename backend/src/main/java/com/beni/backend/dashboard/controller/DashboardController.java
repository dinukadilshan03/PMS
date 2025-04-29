package com.beni.backend.dashboard.controller;

import com.beni.backend.dashboard.model.DashboardStats;
import com.beni.backend.dashboard.model.RecentActivity;
import com.beni.backend.dashboard.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/stats")
    public DashboardStats getDashboardStats() {
        return dashboardService.getDashboardStats();
    }

    @GetMapping("/recent-activities")
    public List<RecentActivity> getRecentActivities() {
        return dashboardService.getRecentActivities();
    }
} 