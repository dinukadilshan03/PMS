package com.beni.backend.staff.repository;

import com.beni.backend.staff.model.Staff;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StaffRepository extends MongoRepository<Staff, String> {

    // Find available staff members
    List<Staff> findByAvailabilityIsAvailableTrue();

    // Find staff available on a specific date
    List<Staff> findByAvailabilityDateAndAvailabilityIsAvailableTrue(String date);

    // Find staff by specialization (e.g., Portraits, Weddings, Events)
    List<Staff> findBySpecialization(String specialization);
}
