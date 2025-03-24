package com.beni.backend.login.model;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

@Setter
@Getter
@Data
@NoArgsConstructor
@AllArgsConstructor

public class LoginDTO {
    private String email;
    private String password;

}

