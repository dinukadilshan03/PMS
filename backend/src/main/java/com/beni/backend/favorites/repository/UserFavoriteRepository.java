package com.beni.backend.favorites.repository;

import com.beni.backend.favorites.model.UserFavorite;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserFavoriteRepository extends MongoRepository<UserFavorite, String> {
    List<UserFavorite> findByUserId(String userId);
    boolean existsByUserIdAndAlbumId(String userId, String albumId);
    void deleteByUserIdAndAlbumId(String userId, String albumId);
} 