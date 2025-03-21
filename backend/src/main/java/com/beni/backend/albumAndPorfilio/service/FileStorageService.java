package com.beni.backend.albumAndPorfilio.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path rootLocation = Paths.get("./uploads/images");

    public FileStorageService() {
        try {
            // Create the uploads/images directory if it doesn't exist
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage folder!", e);
        }
    }

    // Method to save a single file
    public String saveFile(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("File is empty!");
            }

            // Generate a unique filename
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();

            // Save the file to the server
            Path destinationFile = rootLocation.resolve(Paths.get(filename))
                    .normalize()
                    .toAbsolutePath();
            Files.copy(file.getInputStream(), destinationFile);

            // Return the relative path of the saved file
            return "uploads/images/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage(), e);
        }
    }

    // Method to save multiple files
    public List<String> saveFiles(List<MultipartFile> files) {
        List<String> filePaths = new ArrayList<>();
        for (MultipartFile file : files) {
            filePaths.add(saveFile(file));
        }
        return filePaths;
    }
}
