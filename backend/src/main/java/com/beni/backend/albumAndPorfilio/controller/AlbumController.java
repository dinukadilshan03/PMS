package com.beni.backend.albumAndPorfilio.controller;

import com.beni.backend.albumAndPorfilio.model.Album;
import com.beni.backend.albumAndPorfilio.service.AlbumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/albums")
public class AlbumController {

    @Autowired
    private AlbumService albumService;

    @PostMapping
    public Album createAlbum(
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam List<MultipartFile> images,
            @RequestParam MultipartFile coverImage,
            @RequestParam String category,
            @RequestParam String location,
            @RequestParam String status) {
        return albumService.createAlbum(name, description, images, coverImage, category, location, status);
    }

    @GetMapping
    public List<Album> getAllAlbums() {

        return albumService.getAllAlbums();
    }

    @GetMapping("/{id}")
    public Album getAlbum(@PathVariable String id) {

        return albumService.getAlbumById(id);
    }

    // Update Album Endpoint
    @PutMapping("/{id}")
    public ResponseEntity<Album> updateAlbum(
            @PathVariable String id,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) List<MultipartFile> images,
            @RequestParam(required = false) MultipartFile coverImage,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String status) {

        // Call the service method to update the album
        Album updatedAlbum = albumService.updateAlbum(id, name, description, images, coverImage, category, location, status);

        // Return the updated album with HTTP 200 OK
        return ResponseEntity.ok(updatedAlbum);
    }

    @DeleteMapping("/{id}")
    public boolean deleteAlbum(@PathVariable String id){
        return albumService.deleteAlbums(id);
    }

}
