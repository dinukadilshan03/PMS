package com.beni.backend.packages.repository;

import com.beni.backend.packages.model.Package;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PackageRepository extends MongoRepository<Package, String> {
    // Custom queries if needed
}
