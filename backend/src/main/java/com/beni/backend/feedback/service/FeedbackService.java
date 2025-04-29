package com.beni.backend.feedback.service;

import com.beni.backend.feedback.model.Feedback;
import com.beni.backend.feedback.repository.FeedbackRepository;
import com.beni.backend.bookings.repository.BookingRepository;
import com.beni.backend.bookings.model.Booking;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackService {
    private final FeedbackRepository feedbackRepository;
    private final BookingRepository bookingRepository;

    public Feedback createFeedback(Feedback feedback) {
        // Check if the customer has any bookings
        List<Booking> customerBookings = bookingRepository.findByClientId(feedback.getClientId());
        if (customerBookings.isEmpty()) {
            throw new RuntimeException("Only customers who have booked a session can add feedback");
        }

        feedback.setCreatedAt(LocalDateTime.now());
        feedback.setUpdatedAt(LocalDateTime.now());
        feedback.setActive(true);
        return feedbackRepository.save(feedback);
    }

    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAll();
    }

    public List<Feedback> getActiveFeedbacks() {
        return feedbackRepository.findByIsActive(true);
    }

    public List<Feedback> getActiveFeedbacksByPackage(String packageName) {
        return feedbackRepository.findByIsActiveAndPackageName(true, packageName);
    }

    public Feedback updateFeedback(String id, Feedback feedbackDetails) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));

        feedback.setClientName(feedbackDetails.getClientName());
        feedback.setClientEmail(feedbackDetails.getClientEmail());
        feedback.setContent(feedbackDetails.getContent());
        feedback.setRating(feedbackDetails.getRating());
        feedback.setPackageName(feedbackDetails.getPackageName());
        feedback.setUpdatedAt(LocalDateTime.now());

        return feedbackRepository.save(feedback);
    }

    public void deleteFeedback(String id) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));

        feedback.setActive(false);
        feedback.setUpdatedAt(LocalDateTime.now());
        feedbackRepository.save(feedback);
    }
}