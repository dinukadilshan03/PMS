package com.beni.backend.albumAndPorfilio.repository;

import com.beni.backend.albumAndPorfilio.model.Album;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AlbumRepository extends MongoRepository<Album, String> {
}
