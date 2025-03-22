package com.beni.backend.userAndFeedback.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Reply {
    private String staffId; // ID of the photographer or staff who replied
    private String message;
    private LocalDateTime timestamp = LocalDateTime.now();
}
