package com.beni.backend.albumAndPorfilio.service;

import com.beni.backend.albumAndPorfilio.model.Album;
import com.beni.backend.albumAndPorfilio.repository.AlbumRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class AlbumService {

    //Create album repository object
    @Autowired
    private AlbumRepository albumRepository;

    //Create file storage object
    @Autowired
    private FileStorageService fileStorageService;

    // Create Album Method
    public Album createAlbum(
            String name,
            String description,
            List<MultipartFile> images,
            MultipartFile coverImage,
            String category,
            String location,
            String status) {

        // Save the uploaded images and get their paths
        List<String> imagePaths = fileStorageService.saveFiles(images);
        String coverImagePath = fileStorageService.saveFile(coverImage);

        // Create and save the album
        Album album = new Album();
        album.setName(name);
        album.setDescription(description);
        album.setImages(imagePaths);
        album.setCoverImage(coverImagePath);
        album.setCategory(category);
        album.setLocation(location);
        album.setStatus(status);

        return albumRepository.save(album);
    }

    // Get All Albums Method
    public List<Album> getAllAlbums() {

        return albumRepository.findAll();
    }

    //Get A Album By ID Method
    public Album getAlbumById(String id) {
        return albumRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Album not found with ID: " + id));
    }

    // Update Album Method
    public Album updateAlbum(
            String id,
            String name,
            String description,
            List<MultipartFile> images,
            MultipartFile coverImage,
            String category,
            String location,
            String status) {

        // Fetch the existing album from the database
        Album existingAlbum = albumRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Album not found with ID: " + id));

        // Update the album's fields only if new values are provided
        if (name != null && !name.isEmpty()) {
            existingAlbum.setName(name);
        }
        if (description != null && !description.isEmpty()) {
            existingAlbum.setDescription(description);
        }
        if (category != null && !category.isEmpty()) {
            existingAlbum.setCategory(category);
        }
        if (location != null && !location.isEmpty()) {
            existingAlbum.setLocation(location);
        }
        if (status != null && !status.isEmpty()) {
            existingAlbum.setStatus(status);
        }

        // Handle image updates only if new images are provided
        if (images != null && !images.isEmpty()) {
            // Save new images
            List<String> newImagePaths = fileStorageService.saveFiles(images);

            // Append new images to the existing images (don't delete old ones)
            if (existingAlbum.getImages() != null) {
                existingAlbum.getImages().addAll(newImagePaths); // Add new images to the list of existing images
            } else {
                existingAlbum.setImages(newImagePaths); // If no existing images, set new images directly
            }
        }

        // Handle cover image update only if a new cover image is provided
        if (coverImage != null && !coverImage.isEmpty()) {
            // Delete old cover image
            if (existingAlbum.getCoverImage() != null && !existingAlbum.getCoverImage().isEmpty()) {
                fileStorageService.deleteFile(existingAlbum.getCoverImage());
            }
            // Save new cover image
            String coverImagePath = fileStorageService.saveFile(coverImage);
            existingAlbum.setCoverImage(coverImagePath);
        }

        // Save the updated album back to the database
        return albumRepository.save(existingAlbum);
    }

    //Delete Album Method
    public boolean deleteAlbums(String id) {
        // Fetch the album to get the image paths
        Album album = albumRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Album not found with ID: " + id));
        // Delete the cover image
        if (album.getCoverImage() != null && !album.getCoverImage().isEmpty()) {
            fileStorageService.deleteFile(album.getCoverImage());
        }

        // Delete all images in the album
        if (album.getImages() != null && !album.getImages().isEmpty()) {
            for (String imagePath : album.getImages()) {
                fileStorageService.deleteFile(imagePath);
            }
        }

        // Delete the album from the database
        albumRepository.deleteById(id);

        return true;
    }
}
