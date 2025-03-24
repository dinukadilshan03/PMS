package com.beni.backend.staff.service;

import com.beni.backend.staff.model.Staff;
import com.beni.backend.staff.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StaffService {

    @Autowired
    private StaffRepository staffRepository;

    // Get all staff (Admin can view all staff)
    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    // Get staff by ID (Admin can view staff details)
    public Optional<Staff> getStaffById(String id) {
        return staffRepository.findById(id);
    }

    // Add new staff member (Admin can add staff)
    public Staff addStaff(Staff staff) {
        return staffRepository.save(staff);
    }

    // Update staff details (Admin can update staff details like name, email, phone, etc.)
    public Staff updateStaff(String id, Staff updatedStaff) {
        return staffRepository.findById(id).map(staff -> {
            staff.setName(updatedStaff.getName());
            staff.setEmail(updatedStaff.getEmail());
            staff.setPhone(updatedStaff.getPhone());
            staff.setAddress(updatedStaff.getAddress());  // Update address field
            staff.setExperience(updatedStaff.getExperience());  // Update experience field
            staff.setHourlyRate(updatedStaff.getHourlyRate());  // Update hourly rate
            staff.setSpecialization(updatedStaff.getSpecialization());  // Update specialization
            staff.setAvailability(updatedStaff.getAvailability());  // Update availability status
            return staffRepository.save(staff);
        }).orElse(null);
    }

    // Delete staff (Admin can delete staff)
    public void deleteStaff(String id) {
        staffRepository.deleteById(id);
    }

    // Get staff availability (Admin can view the availability status of all staff members)
    public List<Staff.Availability> getStaffAvailability(String id) {
        Optional<Staff> staff = staffRepository.findById(id);
        return staff.map(Staff::getAvailability).orElse(null);
    }

    // Update staff availability (Staff can update their availability status)
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

            // Find an available slot for the photographer
            for (Staff.Availability slot : s.getAvailability()) {
                if (slot.isAvailable()) {
                    // Add the event to the photographer's assigned events and mark the slot as unavailable
                    s.getAssignedEvents().add(eventName);
                    slot.setAvailable(false);  // Mark the photographer as busy for the event date
                    return staffRepository.save(s);
                }
            }
        }
        return null;  // Return null if no available slot is found
    }
}
