package com.beni.backend.wishlist.service;

import com.beni.backend.wishlist.model.Wishlist;
import com.beni.backend.wishlist.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    public List<Wishlist> getUserWishlist(String userId) {
        return wishlistRepository.findByUserId(userId);
    }

    public Wishlist addToWishlist(Wishlist wishlist) {
        // Check if item already exists in wishlist
        if (wishlistRepository.existsByUserIdAndPackageId(wishlist.getUserId(), wishlist.getPackageId())) {
            throw new RuntimeException("Package already in wishlist");
        }
        return wishlistRepository.save(wishlist);
    }

    public void removeFromWishlist(String userId, String packageId) {
        wishlistRepository.deleteByUserIdAndPackageId(userId, packageId);
    }

    public boolean isInWishlist(String userId, String packageId) {
        return wishlistRepository.existsByUserIdAndPackageId(userId, packageId);
    }
} 