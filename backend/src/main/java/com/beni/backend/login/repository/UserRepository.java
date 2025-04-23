package com.beni.backend.login.repository;

import com.beni.backend.login.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;



public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email);
}