package com.beni.backend.staff.controller;

import com.beni.backend.staff.model.Staff;
import com.beni.backend.staff.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/staff")
//@CrossOrigin(origins = "*")
public class StaffController {

    @Autowired
    private StaffService staffService;

    // Admin: Get all staff (including availability and events)
    @GetMapping
    public List<Staff> getAllStaff() {
        return staffService.getAllStaff();
    }

    // Admin: Get staff details by ID
    @GetMapping("/{id}")
    public Optional<Staff> getStaffById(@PathVariable String id) {
        return staffService.getStaffById(id);
    }

    // Search staff by email
    @GetMapping("/search")
    public Staff searchStaffByEmail(@RequestParam String email) {
        return staffService.findByEmail(email);
    }

    // Admin: Add a new staff member (including name, email, phone, address, experience, hourly rate, specialization, availability, and availabilityDate)
    @PostMapping
    public Staff addStaff(@RequestBody Staff staff) {
        // Ensure availabilityDate is passed and processed
        return staffService.addStaff(staff);
    }

    // Admin: Update staff details (including name, email, phone, address, experience, hourly rate, specialization, availability, and availabilityDate)
    @PutMapping("/{id}")
    public Staff updateStaff(@PathVariable String id, @RequestBody Staff updatedStaff) {
        return staffService.updateStaff(id, updatedStaff);
    }

    // Admin: Delete staff by ID
    @DeleteMapping("/{id}")
    public void deleteStaff(@PathVariable String id) {
        staffService.deleteStaff(id);
    }

    // Staff: Get own availability schedule
    @GetMapping("/availability/{id}")
    public Staff getStaffAvailability(@PathVariable String id) {
        return staffService.getStaffAvailability(id);
    }

    // Staff: Update own availability (staff can change their availability)
    @PutMapping("/availability/{id}")
    public Staff updateStaffAvailability(@PathVariable String id, @RequestBody Map<String, Boolean> request) {
        return staffService.updateAvailability(id, request.get("availability"));
    }

    // Admin: Assign staff to a booking
    @PutMapping("/assign/{id}")
    public Staff assignToBooking(@PathVariable String id, @RequestBody Map<String, String> request) {
        String bookingId = request.get("bookingId");
        return staffService.assignToBooking(id, bookingId);
    }

    // Admin: Unassign staff from a booking
    @PutMapping("/unassign/{id}")
    public Staff unassignFromBooking(@PathVariable String id) {
        return staffService.unassignFromBooking(id);
    }
}
