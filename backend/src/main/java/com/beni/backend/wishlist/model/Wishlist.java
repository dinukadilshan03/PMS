package com.beni.backend.wishlist.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "wishlists")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Wishlist {
    @Id
    private String id;
    private String userId;
    private String packageId;
    private String packageType; // "standard" or "customized"
    private String packageName;
    private double price;
    private String imageUrl;
} 