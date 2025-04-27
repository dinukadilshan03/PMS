package com.beni.backend.wishlist.controller;

import com.beni.backend.wishlist.model.Wishlist;
import com.beni.backend.wishlist.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "http://localhost:3000")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Wishlist>> getUserWishlist(@PathVariable String userId) {
        return ResponseEntity.ok(wishlistService.getUserWishlist(userId));
    }

    @PostMapping("/add")
    public ResponseEntity<Wishlist> addToWishlist(@RequestBody Wishlist wishlist) {
        return ResponseEntity.ok(wishlistService.addToWishlist(wishlist));
    }

    @DeleteMapping("/remove")
    public ResponseEntity<Void> removeFromWishlist(
            @RequestParam String userId,
            @RequestParam String packageId) {
        wishlistService.removeFromWishlist(userId, packageId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> isInWishlist(
            @RequestParam String userId,
            @RequestParam String packageId) {
        return ResponseEntity.ok(wishlistService.isInWishlist(userId, packageId));
    }
} 