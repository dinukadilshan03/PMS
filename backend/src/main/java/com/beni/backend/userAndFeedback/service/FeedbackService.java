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
    private FeedbackRepo feedbackRepo;

    public Feedback addFeedback(Feedback feedback) {
        return feedbackRepo.save(feedback);
    }

    public List<Feedback> getAllFeedbacks() {
        return feedbackRepo.findAll();
    }

    public List<Feedback> getFeedbackByCategory(String category) {
        return feedbackRepo.findByCategory(category);
    }

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
