package com.beni.backend.userAndFeedback.controller;

import com.beni.backend.userAndFeedback.model.User;
import com.beni.backend.userAndFeedback.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")     //URL for user-related endpoints
@CrossOrigin(origins = "*")     // Allow frontend access from any origin
public class UserController {
    @Autowired
    private UserService userService;        // Autowire the user service for handling business logic

    // Endpoint to get all users
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();      // Fetch and return a list of all users
    }

    // Endpoint to get a specific user by ID
    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable String id) {
        return userService.getUserById(id);      // Fetch and return the user by ID, wrapped in Optional to handle null
    }

    // Endpoint to create a new user
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);      // Create and return the newly created user
    }

    // Endpoint to update an existing user's details
    @PutMapping("/{id}")
    public User updateUser(@PathVariable String id, @RequestBody User user) {
        return userService.updateUser(id, user);     // Update user details by ID and return the updated user
    }

    // Endpoint to delete a user by ID
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable String id) {
        userService.deleteUser(id);           // Delete the user by ID and perform the operation without returning a response
    }
}
