package com.beni.backend.userAndFeedback.controller;

import com.beni.backend.userAndFeedback.model.Feedback;
import com.beni.backend.userAndFeedback.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.beni.backend.userAndFeedback.model.Reply;
import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin("*") // Allow frontend access
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @PostMapping
    public Feedback submitFeedback(@RequestBody Feedback feedback) {
        return feedbackService.addFeedback(feedback);
    }

    @GetMapping
    public List<Feedback> getAllFeedback() {
        return feedbackService.getAllFeedbacks();
    }

    @GetMapping("/category/{category}")
    public List<Feedback> getFeedbackByCategory(@PathVariable String category) {
        return feedbackService.getFeedbackByCategory(category);
    }

    @DeleteMapping("/{id}")
    public boolean deleteFeedback(@PathVariable String id) {
        return feedbackService.deleteFeedback(id);
    }

    // Endpoint to add a reply
    @PostMapping("/{feedbackId}/reply")
    public Feedback addReply(@PathVariable String feedbackId, @RequestBody Reply reply) {
        return feedbackService.addReplyToFeedback(feedbackId, reply);
    }
}