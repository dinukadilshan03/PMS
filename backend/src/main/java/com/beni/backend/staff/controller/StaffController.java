package com.beni.backend.staff.controller;

import com.beni.backend.staff.model.Staff;
import com.beni.backend.staff.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = "*")
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

    // Admin: Add a new staff member (including name, email, phone, address, experience, hourly rate, specialization, availability)
    @PostMapping
    public Staff addStaff(@RequestBody Staff staff) {
        return staffService.addStaff(staff);
    }

    // Admin: Update staff details (including name, email, phone, address, experience, hourly rate, specialization, availability)
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
    public List<Staff.Availability> getStaffAvailability(@PathVariable String id) {
        return staffService.getStaffAvailability(id);
    }

    // Staff: Update own availability (staff can change this on their page)
    @PutMapping("/availability/{id}")
    public Staff updateAvailability(@PathVariable String id, @RequestBody List<Staff.Availability> updatedAvailability) {
        return staffService.updateAvailability(id, updatedAvailability);
    }

    // Admin: Assign photographer to event (only if available)
    @PutMapping("/assign/{id}")
    public Staff assignPhotographerToEvent(@PathVariable String id, @RequestBody String eventName) {
        return staffService.assignPhotographerToEvent(id, eventName);
    }
}
