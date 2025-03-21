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
@AllArgsConstructor
@Document(collection = "feedbacks")
public class Feedback {

    @Id
    private String id;
    private String clientId;
    private String bookingId;
    private String message;
    private int rating; // e.g., 1-5 stars
    private String category; // e.g., "Photography", "Service", "Price"
    private LocalDateTime timestamp = LocalDateTime.now();

    private List<Reply> replies = new ArrayList<>(); // List of replies

    // Constructors
    public Feedback() {}

    public Feedback(String customerId, String bookingId, String message, int rating, String category) {
        this.clientId = customerId;
        this.bookingId = bookingId;
        this.message = message;
        this.rating = rating;
        this.category = category;
        this.timestamp = LocalDateTime.now();
        this.replies = new ArrayList<>();
    }

    public void addReply(Reply reply) {
        this.replies.add(reply);
    }

}
