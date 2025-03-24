package com.beni.backend.userAndFeedback.repository;

import com.beni.backend.userAndFeedback.model.Feedback;
import com.beni.backend.userAndFeedback.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;


// Repository interface for Feedback, extending MongoRepository to interact with MongoDB
public interface FeedbackRepo extends MongoRepository<Feedback, String> {

    // Custom query method to find feedbacks by category
    List<Feedback> findByCategory(String category);
}
