package com.finance.tracker.category.repository;

import com.finance.tracker.category.entity.UserCategory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserCategoryRepository extends MongoRepository<UserCategory, String> {
    
    List<UserCategory> findByUserIdAndIsActiveTrue(String userId);
    
    Optional<UserCategory> findByUserIdAndNameIgnoreCaseAndIsActiveTrue(String userId, String name);
    
    List<UserCategory> findByUserIdAndNameContainingIgnoreCaseAndIsActiveTrue(String userId, String name);
    
    Optional<UserCategory> findByIdAndUserId(String id, String userId);
}

