package com.beni.backend.albumAndPorfilio.repository;

import com.beni.backend.albumAndPorfilio.model.Portfolio;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PortfolioRepository extends MongoRepository <Portfolio, String> {
}
