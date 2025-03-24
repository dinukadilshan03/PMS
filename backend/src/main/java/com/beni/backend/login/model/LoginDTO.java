package com.beni.backend.login.model;

import lombok.*;

@Setter
@Getter
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginDTO {
    private String email;
    private String password;
}
