package com.beni.backend.favorites.service;

import com.beni.backend.albumAndPorfilio.model.Album;
import com.beni.backend.albumAndPorfilio.repository.AlbumRepository;
import com.beni.backend.favorites.model.UserFavorite;
import com.beni.backend.favorites.repository.UserFavoriteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserFavoriteService {

    @Autowired
    private UserFavoriteRepository userFavoriteRepository;

    @Autowired
    private AlbumRepository albumRepository;

    public List<Album> getUserFavorites(String userId) {
        List<UserFavorite> favorites = userFavoriteRepository.findByUserId(userId);
        return favorites.stream()
            .map(favorite -> albumRepository.findById(favorite.getAlbumId()))
            .filter(Optional::isPresent)
            .map(Optional::get)
            .collect(Collectors.toList());
    }

    public void addFavorite(String userId, String albumId) {
        if (!userFavoriteRepository.existsByUserIdAndAlbumId(userId, albumId)) {
            UserFavorite favorite = UserFavorite.builder()
                .userId(userId)
                .albumId(albumId)
                .createdAt(new Date())
                .build();
            userFavoriteRepository.save(favorite);
        }
    }

    public void removeFavorite(String userId, String albumId) {
        userFavoriteRepository.deleteByUserIdAndAlbumId(userId, albumId);
    }

    public boolean isFavorite(String userId, String albumId) {
        return userFavoriteRepository.existsByUserIdAndAlbumId(userId, albumId);
    }
} 