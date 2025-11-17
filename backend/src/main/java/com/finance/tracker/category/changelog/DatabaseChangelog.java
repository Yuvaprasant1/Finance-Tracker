package com.finance.tracker.category.changelog;

import com.finance.tracker.category.entity.DefaultCategory;
import com.finance.tracker.category.repository.DefaultCategoryRepository;
import io.mongock.api.annotations.ChangeUnit;
import io.mongock.api.annotations.Execution;
import io.mongock.api.annotations.RollbackExecution;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.util.ArrayList;
import java.util.List;

@ChangeUnit(id = "category-initial-data", order = "002", author = "finance-tracker")
public class DatabaseChangelog {
    
    @Execution
    public void execution(MongoTemplate mongoTemplate, DefaultCategoryRepository defaultCategoryRepository) {
        // Check if categories already exist
        if (defaultCategoryRepository.count() > 0) {
            return; // Skip if data already exists
        }
        
        List<DefaultCategory> categories = new ArrayList<>();
        
        // Add default categories
        categories.add(new DefaultCategory("Salary"));
        categories.add(new DefaultCategory("Business income"));
        categories.add(new DefaultCategory("Subscriptions"));
        categories.add(new DefaultCategory("Groceries"));
        categories.add(new DefaultCategory("Food and Dining"));
        
        defaultCategoryRepository.saveAll(categories);
    }
    
    @RollbackExecution
    public void rollback(MongoTemplate mongoTemplate, DefaultCategoryRepository defaultCategoryRepository) {
        defaultCategoryRepository.deleteAll();
    }
}

