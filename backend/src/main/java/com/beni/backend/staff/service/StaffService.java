package com.beni.backend.staff.service;

import com.beni.backend.staff.model.Staff;
import com.beni.backend.staff.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.Optional;

@Service
public class StaffService {

    @Autowired
    private StaffRepository staffRepository;

    // Get all staff members
    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    // Get staff by ID
    public Optional<Staff> getStaffById(String id) {
        return staffRepository.findById(id);
    }

    // Add a new staff member
    public Staff addStaff(Staff staff) {
        return staffRepository.save(staff);
    }

    // Update staff details (including availability and events)
    public Staff updateStaff(String id, Staff updatedStaff) {
        return staffRepository.findById(id).map(staff -> {
            staff.setName(updatedStaff.getName());
            staff.setEmail(updatedStaff.getEmail());
            staff.setPhone(updatedStaff.getPhone());
            staff.setRole(updatedStaff.getRole());
            staff.setAssignedEvents(updatedStaff.getAssignedEvents());
            staff.setCheckInTime(updatedStaff.getCheckInTime());
            staff.setCheckOutTime(updatedStaff.getCheckOutTime());
            staff.setEarnings(updatedStaff.getEarnings());
            staff.setRatings(updatedStaff.getRatings());
            staff.setAvailability(updatedStaff.getAvailability()); // Updating availability slots
            return staffRepository.save(staff);
        }).orElse(null);
    }

    // Delete staff by ID
    public void deleteStaff(String id) {
        staffRepository.deleteById(id);
    }

    // Get the availability of a specific staff member
    public List<Staff.Availability> getStaffAvailability(String id) {
        Optional<Staff> staff = staffRepository.findById(id);
        return staff.map(Staff::getAvailability).orElse(null); // Return list of availability slots
    }

    // Update the availability of a specific staff member
    public Staff updateAvailability(String id, List<Staff.Availability> updatedAvailability) {
        Optional<Staff> staff = staffRepository.findById(id);
        if (staff.isPresent()) {
            Staff s = staff.get();
            s.setAvailability(updatedAvailability); // Update availability slots
            return staffRepository.save(s);
        }
        return null;
    }

    // Admin: Assign photographer to event (only if available)
    public Staff assignPhotographerToEvent(String id, String eventName) {
        Optional<Staff> staff = staffRepository.findById(id);
        if (staff.isPresent()) {
            Staff s = staff.get();

            // Check availability for the event date
            for (Staff.Availability slot : s.getAvailability()) {
                if (slot.isAvailable()) {
                    s.getAssignedEvents().add(eventName);  // Assign the event
                    slot.setAvailable(false);  // Set to unavailable after assignment
                    return staffRepository.save(s); // Save the updated staff details
                }
            }
        }
        return null; // Return null if no availability found
    }
}
