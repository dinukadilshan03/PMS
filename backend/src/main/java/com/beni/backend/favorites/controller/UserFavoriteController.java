package com.beni.backend.favorites.controller;

import com.beni.backend.albumAndPorfilio.model.Album;
import com.beni.backend.favorites.service.UserFavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3001")
public class UserFavoriteController {

    @Autowired
    private UserFavoriteService userFavoriteService;

    @GetMapping("/{userId}/favorites")
    public ResponseEntity<List<Album>> getUserFavorites(@PathVariable String userId) {
        return ResponseEntity.ok(userFavoriteService.getUserFavorites(userId));
    }

    @PostMapping("/{userId}/favorites/{albumId}")
    public ResponseEntity<Void> addFavorite(
            @PathVariable String userId,
            @PathVariable String albumId) {
        userFavoriteService.addFavorite(userId, albumId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{userId}/favorites/{albumId}")
    public ResponseEntity<Void> removeFavorite(
            @PathVariable String userId,
            @PathVariable String albumId) {
        userFavoriteService.removeFavorite(userId, albumId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{userId}/favorites/{albumId}/check")
    public ResponseEntity<Boolean> isFavorite(
            @PathVariable String userId,
            @PathVariable String albumId) {
        return ResponseEntity.ok(userFavoriteService.isFavorite(userId, albumId));
    }
} 