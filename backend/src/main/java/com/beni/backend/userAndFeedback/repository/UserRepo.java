package com.beni.backend.userAndFeedback.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.beni.backend.userAndFeedback.model.User;
import java.util.Optional;

public interface UserRepo extends MongoRepository<User, String> {

}
