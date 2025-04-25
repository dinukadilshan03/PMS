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
        try {
            return staffRepository.save(staff); // Save the staff object with the updated availabilityDate field
        } catch (Exception e) {
            throw new RuntimeException("Error adding staff", e);
        }
    }

    // Update staff details (Admin can update staff details like name, email, phone, etc.)
    public Staff updateStaff(String id, Staff updatedStaff) {
        return staffRepository.findById(id).map(staff -> {
            staff.setName(updatedStaff.getName());
            staff.setEmail(updatedStaff.getEmail());
            staff.setPhone(updatedStaff.getPhone());
            staff.setAddress(updatedStaff.getAddress());
            staff.setExperience(updatedStaff.getExperience());
            staff.setHourlyRate(updatedStaff.getHourlyRate());
            staff.setSpecialization(updatedStaff.getSpecialization());
            staff.setAvailability(updatedStaff.isAvailability()); // Update availability (boolean)
            staff.setAvailabilityDate(updatedStaff.getAvailabilityDate()); // Update availabilityDate
            return staffRepository.save(staff);
        }).orElse(null);
    }

    // Delete staff (Admin can delete staff)
    public void deleteStaff(String id) {
        staffRepository.deleteById(id);
    }

    // Get staff availability (Admin can view the availability status of all staff members)
    public Staff getStaffAvailability(String id) {
        Optional<Staff> staff = staffRepository.findById(id);
        return staff.orElse(null); // Return the staff object with the availability status
    }

    // Update staff availability (Staff can update their availability status)
    public Staff updateAvailability(String id, boolean availability) {
        Optional<Staff> staff = staffRepository.findById(id);
        if (staff.isPresent()) {
            Staff s = staff.get();
            s.setAvailability(availability); // Set availability (boolean)
            return staffRepository.save(s); // Save updated staff availability
        }
        return null;
    }

    // Assign staff to a booking
    public Staff assignToBooking(String id, String bookingId) {
        Optional<Staff> staffOptional = staffRepository.findById(id);
        if (staffOptional.isPresent()) {
            Staff staff = staffOptional.get();
            staff.setAssignedBookingId(bookingId);
            staff.setAvailability(false); // Set availability to false when assigned
            return staffRepository.save(staff);
        }
        throw new RuntimeException("Staff not found");
    }

    // Unassign staff from a booking
    public Staff unassignFromBooking(String id) {
        Optional<Staff> staffOptional = staffRepository.findById(id);
        if (staffOptional.isPresent()) {
            Staff staff = staffOptional.get();
            staff.setAssignedBookingId(null);
            staff.setAvailability(true); // Set availability to true when unassigned
            return staffRepository.save(staff);
        }
        throw new RuntimeException("Staff not found");
    }
}
