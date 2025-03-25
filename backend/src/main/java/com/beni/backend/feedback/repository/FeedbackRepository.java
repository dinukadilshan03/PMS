package com.beni.backend.feedback.repository;

import com.beni.backend.feedback.model.Feedback;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface FeedbackRepository extends MongoRepository<Feedback, String> {
    List<Feedback> findByIsActive(boolean isActive);
}