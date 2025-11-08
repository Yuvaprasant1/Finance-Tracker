package com.finance.tracker.currency.changelog;

import com.finance.tracker.currency.entity.Currency;
import com.finance.tracker.currency.repository.CurrencyRepository;
import io.mongock.api.annotations.ChangeUnit;
import io.mongock.api.annotations.Execution;
import io.mongock.api.annotations.RollbackExecution;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.util.ArrayList;
import java.util.List;

@ChangeUnit(id = "currency-initial-data", order = "001", author = "finance-tracker")
public class DatabaseChangelog {
    
    @Execution
    public void execution(MongoTemplate mongoTemplate, CurrencyRepository currencyRepository) {
        // Check if currencies already exist
        if (currencyRepository.count() > 0) {
            return; // Skip if data already exists
        }
        
        List<Currency> currencies = new ArrayList<>();
        
        // Add default currencies
        currencies.add(new Currency("INR", "₹", "Indian Rupee",true));
        currencies.add(new Currency("USD", "$", "US Dollar",false));
        currencies.add(new Currency("EUR", "€", "Euro",false));
        currencies.add(new Currency("GBP", "£", "British Pound",false));
        currencies.add(new Currency("JPY", "¥", "Japanese Yen",false));
        currencies.add(new Currency("AUD", "A$", "Australian Dollar",false));
        currencies.add(new Currency("CAD", "C$", "Canadian Dollar",false));
        currencies.add(new Currency("CNY", "¥", "Chinese Yuan",false));
        
        currencyRepository.saveAll(currencies);
    }
    
    @RollbackExecution
    public void rollback(MongoTemplate mongoTemplate, CurrencyRepository currencyRepository) {
        currencyRepository.deleteAll();
    }
}

