package com.beni.backend.dashboard.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RecentActivity {
    private String id;
    private String type; // e.g., "BOOKING", "ALBUM", "PORTFOLIO"
    private String description;
    private String userName;
    private LocalDateTime timestamp;
} 