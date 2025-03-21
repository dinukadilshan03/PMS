package com.beni.backend.staff.repository;

import com.beni.backend.staff.model.Staff;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StaffRepository extends MongoRepository<Staff, String> {
    // Custom queries to find staff by role or availability
    List<Staff> findByRole(String role);
    List<Staff> findByAvailabilityIsAvailableTrue();
}
