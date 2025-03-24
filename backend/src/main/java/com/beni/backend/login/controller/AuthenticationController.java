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

    // Simple login endpoint
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginDTO loginDTO, HttpSession session) {
        User user = userRepository.findByEmail(loginDTO.getEmail());

        if (user != null && user.getPassword().equals(loginDTO.getPassword())) {
            session.setAttribute("userId", user.getId()); // Store the user ID in session

            // Return userId and role as a JSON response
            LoginResponseDTO response = new LoginResponseDTO(user.getId(), user.getRole());
            return ResponseEntity.ok(response);
        }

        // Return error response for invalid credentials
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponseDTO("Invalid credentials"));
    }
}
