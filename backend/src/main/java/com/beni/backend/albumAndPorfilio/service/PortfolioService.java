package com.beni.backend.albumAndPorfilio.service;

import com.beni.backend.albumAndPorfilio.model.Album;
import com.beni.backend.albumAndPorfilio.model.Portfolio;
import com.beni.backend.albumAndPorfilio.repository.AlbumRepository;
import com.beni.backend.albumAndPorfilio.repository.PortfolioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
public class PortfolioService {

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private FileStorageService fileStorageService;
    @Autowired
    private AlbumRepository albumRepository;

    //Upload Image for Portfolio method
    public Portfolio createPortfolio(
            String albumName,
            String description,
            String photographerName,
            String category,
            MultipartFile image
    ){
        String imagePath = fileStorageService.saveFile(image);

        //Create portfolio object to store values
        Portfolio portfolio = new Portfolio();

        //Set values to the attributes
        portfolio.setAlbumName(albumName);
        portfolio.setDescription(description);
        portfolio.setPhotographerName(photographerName);
        portfolio.setCategory(category);
        portfolio.setImageUrl(imagePath);

        return portfolioRepository.save(portfolio);
    }

    public List<Portfolio> getPortfolios() {
        return portfolioRepository.findAll();
    }

    public boolean deleteImage(String id){
        Portfolio image = portfolioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Album not found with ID: " + id));

        // Delete the cover image
        if (image.getImageUrl() != null && !image.getImageUrl().isEmpty()) {
            fileStorageService.deleteFile(image.getImageUrl());
        }

        portfolioRepository.deleteById(id);
        return true;
    }

    public Optional<Portfolio> getPortfolio(String id) {
        return portfolioRepository.findById(id);
    }

    //Update method for portfolio
    public Portfolio updatePortfolio(
            String id,
            String albumName,
            String description,
            String photographerName,
            String category,
            MultipartFile image
    ) {

        Portfolio existingImage = portfolioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Album not found with ID: " + id));

        if (albumName != null && !albumName.isEmpty()) {
            existingImage.setAlbumName(albumName);
        }
        if (description != null && !description.isEmpty()) {
            existingImage.setDescription(description);
        }
        if (photographerName != null && !photographerName.isEmpty()) {
            existingImage.setPhotographerName(photographerName);
        }
        if (photographerName != null && !photographerName.isEmpty()) {
            existingImage.setPhotographerName(photographerName);
        }
        if (category != null && !category.isEmpty()) {
            existingImage.setCategory(category);
        }
        if (image != null && !image.isEmpty()) {
            // Delete old cover image
            if (existingImage.getImageUrl() != null && !existingImage.getImageUrl().isEmpty()) {
                fileStorageService.deleteFile(existingImage.getImageUrl());
            }
            // Save new cover image
            String imageUrl = fileStorageService.saveFile(image);
            existingImage.setImageUrl(imageUrl);
        }

        return portfolioRepository.save(existingImage);
    }
}
