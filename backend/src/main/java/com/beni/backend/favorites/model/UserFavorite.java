package com.beni.backend.favorites.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "user_favorites")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserFavorite {
    @Id
    private String id;
    private String userId;
    private String albumId;
    private Date createdAt;
} 