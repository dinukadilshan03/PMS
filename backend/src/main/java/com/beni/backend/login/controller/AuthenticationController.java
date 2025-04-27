package com.beni.backend.login.controller;

import com.beni.backend.login.model.LoginDTO;
import com.beni.backend.login.model.LoginResponseDTO;
import com.beni.backend.login.model.User;
import com.beni.backend.login.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    @Autowired
    private UserRepository userRepository;

    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginDTO loginDTO, HttpSession session) {
        User user = userRepository.findByEmail(loginDTO.getEmail());

        if (user != null && user.getPassword().equals(loginDTO.getPassword())) {
            session.setAttribute("userId", user.getId()); // Store the userId in session
            LoginResponseDTO response = new LoginResponseDTO(user.getId(), user.getRole());
            return ResponseEntity.ok(response);
        }

        // Return error response for invalid credentials
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponseDTO("Invalid credentials"));
    }

    // Add to AuthenticationController.java
    @GetMapping("/profile/{userId}")
    public ResponseEntity<User> getUserProfile(@PathVariable String userId, HttpSession session) {
        // Check if user is logged in
        String sessionUserId = (String) session.getAttribute("userId");
        if (sessionUserId == null || !sessionUserId.equals(userId)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile/{userId}")
    public ResponseEntity<User> updateProfile(@PathVariable String userId, @RequestBody User updatedUser, HttpSession session) {
        // Check if user is logged in
        String sessionUserId = (String) session.getAttribute("userId");
        if (sessionUserId == null || !sessionUserId.equals(userId)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User existingUser = userRepository.findById(userId).orElse(null);
        if (existingUser == null) {
            return ResponseEntity.notFound().build();
        }

        // Update fields (excluding password and ID)
        existingUser.setName(updatedUser.getName());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setContactNumber(updatedUser.getContactNumber());

        User savedUser = userRepository.save(existingUser);
        return ResponseEntity.ok(savedUser);
    }
}