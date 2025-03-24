package com.beni.backend.userAndFeedback.service;

import com.beni.backend.userAndFeedback.model.Feedback;
import com.beni.backend.userAndFeedback.model.Reply;
import com.beni.backend.userAndFeedback.repository.FeedbackRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service //
public class FeedbackService {

    @Autowired
    private FeedbackRepo feedbackRepo;         // Autowire the FeedbackRepo for interaction with the database


    // Method to add new feedback
    public Feedback addFeedback(Feedback feedback) {
        return feedbackRepo.save(feedback);
    }


    // Method to retrieve all feedbacks
    public List<Feedback> getAllFeedbacks() {
        return feedbackRepo.findAll();
    }


    // Method to retrieve feedback by its category
    public List<Feedback> getFeedbackByCategory(String category) {
        return feedbackRepo.findByCategory(category);
    }


    // Method to delete feedback by ID
    public boolean deleteFeedback(String id) {
        Optional<Feedback> feedback = feedbackRepo.findById(id);
        if (feedback.isPresent()) {
            feedbackRepo.deleteById(id);
            return true;
        }
        return false;
    }

    // Method to add a reply
    public Feedback addReplyToFeedback(String feedbackId, Reply reply) {
        Optional<Feedback> feedbackOpt = feedbackRepo.findById(feedbackId);
        if (feedbackOpt.isPresent()) {
            Feedback feedback = feedbackOpt.get();
            feedback.addReply(reply);
            return feedbackRepo.save(feedback);
        }
        return null; // if feedback not found
    }

}
