package com.beni.backend.albumAndPorfilio.controller;

import com.beni.backend.albumAndPorfilio.model.Portfolio;
import com.beni.backend.albumAndPorfilio.service.PortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    @Autowired
    private PortfolioService portfolioService;

    @PostMapping
    public Portfolio createPortfolio(
            @RequestParam String albumName,
            @RequestParam String description,
            @RequestParam String photographerName,
            @RequestParam String category,
            @RequestParam MultipartFile image
    ) {

        return portfolioService.createPortfolio(albumName, description, photographerName, category, image);
    }
}
