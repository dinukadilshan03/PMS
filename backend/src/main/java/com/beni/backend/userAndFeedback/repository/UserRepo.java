package com.beni.backend.userAndFeedback.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.beni.backend.userAndFeedback.model.User;
import java.util.Optional;

// Repository interface for User, extending MongoRepository to interact with MongoDB
public interface UserRepo extends MongoRepository<User, String> {

}
