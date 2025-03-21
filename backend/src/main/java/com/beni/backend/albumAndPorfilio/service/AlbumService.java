package com.beni.backend.albumAndPorfilio.service;

import com.beni.backend.albumAndPorfilio.model.Album;
import com.beni.backend.albumAndPorfilio.repository.AlbumRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class AlbumService {

    @Autowired
    private AlbumRepository albumRepository;

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

    //Delete All Albums Method
    public boolean deleteAlbums(String id){
        albumRepository.deleteById(id);
        return true;
    }
}
