package com.beni.backend.albumAndPorfilio.service;

import com.beni.backend.albumAndPorfilio.model.Portfolio;
import com.beni.backend.albumAndPorfilio.repository.PortfolioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class PortfolioService {

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private FileStorageService fileStorageService;

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
}
