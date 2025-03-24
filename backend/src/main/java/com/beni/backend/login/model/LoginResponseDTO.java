package com.beni.backend.login.model;

import lombok.Getter;
import lombok.Setter;
import lombok.*;
@Setter
@Getter
public class LoginResponseDTO {

    private String userId;
    private String role;
    private String message;

    // Constructor for success response
    public LoginResponseDTO(String userId, String role) {
        this.userId = userId;
        this.role = role;
    }

    // Constructor for error response (e.g., invalid credentials)
    public LoginResponseDTO(String message) {
        this.message = message;
    }

    // Getters and setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
