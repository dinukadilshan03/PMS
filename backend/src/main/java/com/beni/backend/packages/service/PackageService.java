package com.beni.backend.packages.service;

import com.beni.backend.packages.model.Package;
import com.beni.backend.packages.repository.PackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PackageService {

    @Autowired
    private PackageRepository packageRepository;

    public Package savePackage(Package packageObj) {
        return packageRepository.save(packageObj);  // Will either create or update depending on whether the package has an ID
    }

    public List<Package> getAllPackages() {
        return packageRepository.findAll();
    }

    public Optional<Package> getPackageById(String id) {
        return packageRepository.findById(id);
    }

    public void deletePackageById(String id) {
        packageRepository.deleteById(id);
    }

}
