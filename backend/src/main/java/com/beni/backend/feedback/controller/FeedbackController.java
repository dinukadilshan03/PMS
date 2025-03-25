package com.beni.backend.feedback.controller;

import com.beni.backend.feedback.model.Feedback;
import com.beni.backend.feedback.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
@RequiredArgsConstructor
public class FeedbackController {
    private final FeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<Feedback> createFeedback(@RequestBody Feedback feedback) {
        return ResponseEntity.ok(feedbackService.createFeedback(feedback));
    }

    @GetMapping
    public ResponseEntity<List<Feedback>> getAllFeedbacks() {
        return ResponseEntity.ok(feedbackService.getAllFeedbacks());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Feedback>> getActiveFeedbacks() {
        return ResponseEntity.ok(feedbackService.getActiveFeedbacks());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Feedback> updateFeedback(
            @PathVariable String id,
            @RequestBody Feedback feedback) {
        return ResponseEntity.ok(feedbackService.updateFeedback(id, feedback));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable String id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.noContent().build();
    }
}