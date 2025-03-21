package com.beni.backend.userAndFeedback.repository;

import com.beni.backend.userAndFeedback.model.Feedback;
import com.beni.backend.userAndFeedback.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface FeedbackRepo extends MongoRepository<Feedback, String> {

    List<Feedback> findByCategory(String category);
}
