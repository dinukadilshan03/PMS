package com.beni.backend.albumAndPorfilio.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document (collection = "portfolios")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Portfolio {

    @Id
    private String id;
    private String albumName;
    private String description;
    private String photographerName;
    private String category;
    private String imageUrl;

    @CreatedDate
    private Date dateUploaded;

}
