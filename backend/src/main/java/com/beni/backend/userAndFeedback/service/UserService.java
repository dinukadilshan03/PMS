package com.beni.backend.userAndFeedback.service;

import com.beni.backend.userAndFeedback.model.User;
import com.beni.backend.userAndFeedback.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepository;      // Autowire the UserRepo for interaction with the user database

    // Method to retrieve all users from the database
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


    // Method to retrieve a specific user by their ID
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }


    // Method to create a new user
    public User createUser(User user) {
        return userRepository.save(user);
    }


    // Method to update an existing user by ID
    public User updateUser(String id, User user) {
        return userRepository.findById(id).map(existingUser -> {
            existingUser.setName(user.getName());
            existingUser.setEmail(user.getEmail());
            existingUser.setPassword(user.getPassword());
            existingUser.setRole(user.getRole());
            existingUser.setContactNumber(user.getContactNumber());
            return userRepository.save(existingUser);
        }).orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }


    // Method to delete a user by ID
    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
}
