package com.beni.backend.albumAndPorfilio.controller;

import com.beni.backend.albumAndPorfilio.model.Portfolio;
import com.beni.backend.albumAndPorfilio.service.PortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

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

    @GetMapping
    public List<Portfolio> getAllPortfolios() {

        return portfolioService.getPortfolios();
    }

    @GetMapping("/{id}")
    public Optional<Portfolio> getPortfolioById(@PathVariable String id) {

        return portfolioService.getPortfolio(id);
    }

    @DeleteMapping("/{id}")
    public boolean deleteImage(@PathVariable String id) {

        return portfolioService.deleteImage(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Portfolio> updatePortfolio(
            @PathVariable String id,
            @RequestParam(required = false) String albumName,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String photographerName,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) MultipartFile image
    ) {

        Portfolio updatedImage = portfolioService.updatePortfolio(
                id, albumName, description, photographerName, category, image);

        return ResponseEntity.ok(updatedImage);
    }
}
