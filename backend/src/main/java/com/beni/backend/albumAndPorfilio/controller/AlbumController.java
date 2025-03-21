package com.beni.backend.albumAndPorfilio.controller;

import com.beni.backend.albumAndPorfilio.model.Album;
import com.beni.backend.albumAndPorfilio.service.AlbumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/albums")
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

    @GetMapping("/getAlbum/{id}")
    public Album getAlbum(@PathVariable String id) {
        return albumService.getAlbumById(id);
    }

    @DeleteMapping("/delete/{id}")
    public boolean deleteAlbum(@PathVariable String id){
        return albumService.deleteAlbums(id);
    }
}
