package com.beni.backend.albumAndPorfilio.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "albums")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Album {

    @Id
    private String id;
    private String name;
    private String description;
    private List<String> images;
    private String coverImage;
    private String category;
    private String location;
    private String status;

    @CreatedDate
    private Date releaseDate;
}
