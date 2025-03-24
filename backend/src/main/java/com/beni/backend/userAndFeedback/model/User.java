package com.beni.backend.userAndFeedback.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Setter
@Getter
@Document(collection = "users")
@Data               // Lombok annotation that generates getters, setters
@NoArgsConstructor
@AllArgsConstructor
public class User {


    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private String role;     // "ADMIN", "PHOTOGRAPHER", "CUSTOMER"
    private String contactNumber;
}

