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

    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }
    public Optional<Staff> getStaffById(String id) {
        return staffRepository.findById(id);
    }
    // Add
    public Staff addStaff(Staff staff) {
        return staffRepository.save(staff);
    }
    // Update staff
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

    // Delete staff
    public void deleteStaff(String id) {
        staffRepository.deleteById(id);
    }
    public List<Staff.Availability> getStaffAvailability(String id) {
        Optional<Staff> staff = staffRepository.findById(id);
        return staff.map(Staff::getAvailability).orElse(null);
    }
    public Staff updateAvailability(String id, List<Staff.Availability> updatedAvailability) {
        Optional<Staff> staff = staffRepository.findById(id);
        if (staff.isPresent()) {
            Staff s = staff.get();
            s.setAvailability(updatedAvailability);
            return staffRepository.save(s);
        }
        return null;
    }
    // Admin: Assign photographer to event (only if available)
    public Staff assignPhotographerToEvent(String id, String eventName) {
        Optional<Staff> staff = staffRepository.findById(id);
        if (staff.isPresent()) {
            Staff s = staff.get();


            for (Staff.Availability slot : s.getAvailability()) {
                if (slot.isAvailable()) {
                    s.getAssignedEvents().add(eventName);
                    slot.setAvailable(false);
                    return staffRepository.save(s);
                }
            }
        }
        return null;
    }
}
