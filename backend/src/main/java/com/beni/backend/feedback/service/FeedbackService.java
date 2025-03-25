package com.beni.backend.feedback.service;

import com.beni.backend.feedback.model.Feedback;
import com.beni.backend.feedback.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackService {
    private final FeedbackRepository feedbackRepository;

    public Feedback createFeedback(Feedback feedback) {
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

    public Feedback updateFeedback(String id, Feedback feedbackDetails) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));

        feedback.setClientName(feedbackDetails.getClientName());
        feedback.setClientEmail(feedbackDetails.getClientEmail());
        feedback.setContent(feedbackDetails.getContent());
        feedback.setRating(feedbackDetails.getRating());
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