package com.beni.backend.packages.controller;

import com.beni.backend.packages.model.Package;
import com.beni.backend.packages.service.PackageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/packages")
public class PackageController {

    @Autowired
    private PackageService packageService;

    @PostMapping
    public ResponseEntity<Package> createOrUpdatePackage(@RequestBody Package packageObj) {
        // This can be used for both creating a new package or updating an existing one
        Package savedPackage = packageService.savePackage(packageObj);
        return new ResponseEntity<>(savedPackage, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Package>> getAllPackages() {
        List<Package> packages = packageService.getAllPackages();
        return new ResponseEntity<>(packages, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Package> getPackageById(@PathVariable String id) {
        Optional<Package> packageOptional = packageService.getPackageById(id);
        return packageOptional.map(packageObj -> new ResponseEntity<>(packageObj, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Add PUT mapping for updating a package
    @PutMapping("/{id}")
    public ResponseEntity<Package> updatePackage(@PathVariable String id, @RequestBody Package packageObj) {
        // Update package by id
        Optional<Package> existingPackage = packageService.getPackageById(id);
        if (existingPackage.isPresent()) {
            // If package exists, update it
            packageObj.setId(id); // Ensure the ID of the updated package is set
            Package updatedPackage = packageService.savePackage(packageObj);
            return new ResponseEntity<>(updatedPackage, HttpStatus.OK);
        } else {
            // If package doesn't exist, return 404
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePackage(@PathVariable String id) {
        packageService.deletePackageById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
