package com.beni.backend.userAndFeedback.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@AllArgsConstructor           // Generates a constructor with all fields as arguments
@Document(collection = "feedbacks")          // Specifies the collection name in MongoDB
public class Feedback {

    @Id
    private String id;
    private String clientId;
    private String bookingId;
    private String message;
    private int rating; // e.g., 1-5 stars
    private String category; // e.g., "Photography", "Service", "Price"
    private LocalDateTime timestamp = LocalDateTime.now();                // Timestamp when the feedback was created

    private List<Reply> replies = new ArrayList<>(); // List of replies

    // Default constructor (for Lombok and MongoDB)
    public Feedback() {}

    // Constructor to initialize a new Feedback object with necessary fields
    public Feedback(String customerId, String bookingId, String message, int rating, String category) {
        this.clientId = customerId;
        this.bookingId = bookingId;
        this.message = message;
        this.rating = rating;
        this.category = category;
        this.timestamp = LocalDateTime.now();         // Set current timestamp when feedback is created
        this.replies = new ArrayList<>();             // Initialize empty replies list
    }

    // Method to add a reply to the feedback
    public void addReply(Reply reply) {
        this.replies.add(reply);             // Add the given reply to the list of replies
    }

}
