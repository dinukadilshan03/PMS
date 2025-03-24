package com.beni.backend.staff.repository;

import com.beni.backend.staff.model.Staff;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StaffRepository extends MongoRepository<Staff, String> {

    // Find all staff members who are available (availability is true)
    List<Staff> findByAvailabilityTrue();

    // Find staff by specialization (e.g., Portraits, Weddings, Events)
    List<Staff> findBySpecialization(String specialization);
}
