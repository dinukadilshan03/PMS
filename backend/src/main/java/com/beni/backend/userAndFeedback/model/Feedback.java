package com.beni.backend.userAndFeedback.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor// Generates a constructor with all fields as arguments
@Document(collection = "feedbacks")

public class Feedback {

    @Id
    private String id;
    private String clientId;
    private String bookingId;
    private String message;
    private int rating; // e.g., 1-5 stars
    private String category; // e.g., "Photography", "Service", "Price"

    @CreatedDate
    private Date LocalDateTime;

    private List<Reply> replies = new ArrayList<>(); // List of replies

}
