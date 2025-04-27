package com.beni.backend.wishlist.repository;

import com.beni.backend.wishlist.model.Wishlist;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface WishlistRepository extends MongoRepository<Wishlist, String> {
    List<Wishlist> findByUserId(String userId);
    boolean existsByUserIdAndPackageId(String userId, String packageId);
    void deleteByUserIdAndPackageId(String userId, String packageId);
} 