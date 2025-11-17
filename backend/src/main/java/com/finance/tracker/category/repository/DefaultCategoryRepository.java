package com.finance.tracker.category.repository;

import com.finance.tracker.category.entity.DefaultCategory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DefaultCategoryRepository extends MongoRepository<DefaultCategory, String> {
    
    Optional<DefaultCategory> findByNameIgnoreCase(String name);
    
    List<DefaultCategory> findByIsActiveTrue();
    
    List<DefaultCategory> findByNameContainingIgnoreCaseAndIsActiveTrue(String name);
}

