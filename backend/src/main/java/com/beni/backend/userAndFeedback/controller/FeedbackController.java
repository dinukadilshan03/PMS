package com.beni.backend.userAndFeedback.controller;

import com.beni.backend.userAndFeedback.model.Feedback;
import com.beni.backend.userAndFeedback.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.beni.backend.userAndFeedback.model.Reply;
import java.util.List;

@RestController
@RequestMapping("/api/feedback") // Base URL for feedback-related endpoints
@CrossOrigin("*") // Allow frontend access from any origin
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;         // Autowire the feedback service for handling business logic

    // Endpoint to submit feedback
    @PostMapping
    public Feedback submitFeedback(@RequestBody Feedback feedback) {
        return feedbackService.addFeedback(feedback);     // Add feedback and return the saved feedback
    }

    // Endpoint to get all feedback
    @GetMapping
    public List<Feedback> getAllFeedback() {
        return feedbackService.getAllFeedbacks();       // Fetch and return all feedbacks
    }

    // Endpoint to get feedback by category
    @GetMapping("/category/{category}")
    public List<Feedback> getFeedbackByCategory(@PathVariable String category) {
        return feedbackService.getFeedbackByCategory(category);         // Fetch feedbacks filtered by category
    }

    // Endpoint to delete feedback by ID
    @DeleteMapping("/{id}")
    public boolean deleteFeedback(@PathVariable String id) {
        return feedbackService.deleteFeedback(id);         // Delete feedback by ID and return success status
    }

    // Endpoint to add a reply
    @PostMapping("/{feedbackId}/reply")
    public Feedback addReply(@PathVariable String feedbackId, @RequestBody Reply reply) {
        return feedbackService.addReplyToFeedback(feedbackId, reply);         // Add reply to the specified feedback and return the updated feedback
    }
}