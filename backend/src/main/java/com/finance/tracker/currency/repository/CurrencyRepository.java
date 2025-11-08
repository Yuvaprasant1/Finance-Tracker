package com.finance.tracker.currency.repository;

import com.finance.tracker.currency.entity.Currency;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CurrencyRepository extends MongoRepository<Currency, String> {
    
    Optional<Currency> findByCode(String code);
    
    List<Currency> findByIsActiveTrue();
}

