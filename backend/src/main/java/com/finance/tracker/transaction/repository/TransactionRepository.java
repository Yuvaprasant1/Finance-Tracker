package com.finance.tracker.transaction.repository;

import com.finance.tracker.transaction.entity.FinancialTransaction;
import com.finance.tracker.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
@Repository
public interface TransactionRepository extends MongoRepository<FinancialTransaction, String> {
    
    List<FinancialTransaction> findByUser(User user);
    
    List<FinancialTransaction> findByUserOrderByDateDesc(User user);
    
    Page<FinancialTransaction> findByUserOrderByDateDesc(User user, Pageable pageable);
    
    List<FinancialTransaction> findByUserAndDateBetween(
        User user, 
        LocalDate startDate, 
        LocalDate endDate
    );
    
    @Query("{ 'user_id.$id': ?0, 'date': { $gte: ?1, $lte: ?2 } }")
    List<FinancialTransaction> findTransactionsByUserAndDateRange(
        String userId, 
        LocalDate startDate, 
        LocalDate endDate
    );
    
    @Query("{ '_id': ?0, 'user_id.$id': ?1 }")
    Optional<FinancialTransaction> findByIdAndUser(String id, String userId);
    
    long countByUser(User user);
    
    @Aggregation(pipeline = {
        "{ $match: { 'user_id.$id': ?0 } }",
        "{ $group: { _id: null, total: { $sum: '$amount' } } }"
    })
    double sumAmountByUser(String userId);
}

