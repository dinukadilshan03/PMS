package com.beni.backend.dashboard.service;

import com.beni.backend.dashboard.model.DashboardStats;
import com.beni.backend.dashboard.model.RecentActivity;
import com.beni.backend.bookings.repository.BookingRepository;
import com.beni.backend.albumAndPorfilio.repository.AlbumRepository;
import com.beni.backend.staff.repository.StaffRepository;
import com.beni.backend.packages.repository.PackageRepository;
import com.beni.backend.albumAndPorfilio.repository.PortfolioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    private final BookingRepository bookingRepository;
    private final AlbumRepository albumRepository;
    private final StaffRepository staffRepository;
    private final PackageRepository packageRepository;
    private final PortfolioRepository portfolioRepository;

    public DashboardService(
            BookingRepository bookingRepository,
            AlbumRepository albumRepository,
            StaffRepository staffRepository,
            PackageRepository packageRepository,
            PortfolioRepository portfolioRepository) {
        this.bookingRepository = bookingRepository;
        this.albumRepository = albumRepository;
        this.staffRepository = staffRepository;
        this.packageRepository = packageRepository;
        this.portfolioRepository = portfolioRepository;
    }

    public DashboardStats getDashboardStats() {
        DashboardStats stats = new DashboardStats();
        stats.setTotalBookings(bookingRepository.count());
        stats.setPendingBookings(bookingRepository.findAll().stream()
                .filter(booking -> "pending".equals(booking.getPaymentStatus()))
                .count());
        stats.setTotalAlbums(albumRepository.count());
        stats.setTotalStaff(staffRepository.count());
        stats.setTotalPackages(packageRepository.count());
        stats.setTotalPortfolioItems(portfolioRepository.count());
        return stats;
    }

    public List<RecentActivity> getRecentActivities() {
        List<RecentActivity> activities = new ArrayList<>();

        // Get recent bookings
        bookingRepository.findAll().stream()
                .sorted(Comparator.comparing(booking -> booking.getDateTime()))
                .limit(5)
                .forEach(booking -> {
                    RecentActivity activity = new RecentActivity();
                    activity.setId(booking.getId());
                    activity.setType("BOOKING");
                    activity.setDescription("New booking created for " + booking.getPackageName());
                    activity.setUserName(booking.getEmail());
                    activity.setTimestamp(booking.getDateTime());
                    activities.add(activity);
                });

        // Get recent albums
        albumRepository.findAll().stream()
                .sorted(Comparator.comparing(album -> album.getReleaseDate()))
                .limit(5)
                .forEach(album -> {
                    RecentActivity activity = new RecentActivity();
                    activity.setId(album.getId());
                    activity.setType("ALBUM");
                    activity.setDescription("New album created: " + album.getName());
                    activity.setUserName(album.getLocation());
                    activity.setTimestamp(album.getReleaseDate().toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDateTime());
                    activities.add(activity);
                });

        // Get recent portfolio items
        portfolioRepository.findAll().stream()
                .sorted(Comparator.comparing(portfolio -> portfolio.getDateUploaded()))
                .limit(5)
                .forEach(portfolio -> {
                    RecentActivity activity = new RecentActivity();
                    activity.setId(portfolio.getId());
                    activity.setType("PORTFOLIO");
                    activity.setDescription("New portfolio item added: " + portfolio.getAlbumName());
                    activity.setUserName(portfolio.getPhotographerName());
                    activity.setTimestamp(portfolio.getDateUploaded().toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDateTime());
                    activities.add(activity);
                });

        // Sort all activities by timestamp and limit to 10 most recent
        return activities.stream()
                .sorted(Comparator.comparing(RecentActivity::getTimestamp).reversed())
                .limit(10)
                .collect(Collectors.toList());
    }
} 