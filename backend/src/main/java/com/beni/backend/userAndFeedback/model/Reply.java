package com.beni.backend.userAndFeedback.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class Reply {
    private String staffId;            // ID of the photographer who replied
    private String message;           // The reply message

    @CreatedDate
    private Date localDate;

}


