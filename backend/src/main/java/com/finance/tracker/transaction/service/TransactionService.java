package com.finance.tracker.transaction.service;

import com.finance.tracker.common.dto.PaginatedResponse;
import com.finance.tracker.transaction.dto.TransactionDTO;
import com.finance.tracker.transaction.dto.UpdateTransactionRequestDTO;
import com.finance.tracker.transaction.entity.FinancialTransaction;
import com.finance.tracker.transaction.exception.TransactionNotFoundException;
import com.finance.tracker.transaction.mapper.TransactionMapper;
import com.finance.tracker.transaction.repository.TransactionRepository;
import com.finance.tracker.user.entity.User;
import com.finance.tracker.user.service.UserService;
import lombok.RequiredArgsConstructor;
import com.finance.tracker.transaction.enumeration.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {
    
    private final TransactionRepository transactionRepository;
    private final UserService userService;
    private final TransactionMapper transactionMapper;
    
    public List<TransactionDTO> getAllTransactionsByUserId(String userId) {
        User user = userService.getUserById(userId);
        List<FinancialTransaction> transactions = transactionRepository.findByUserOrderByDateDesc(user);
        return transactionMapper.toDTOList(transactions);
    }
    
    public PaginatedResponse<TransactionDTO> getAllTransactionsByUserIdPaginated(String userId, int page, int size) {
        User user = userService.getUserById(userId);
        Pageable pageable = PageRequest.of(page, size);
        Page<FinancialTransaction> transactionPage = transactionRepository.findByUserOrderByDateDesc(user, pageable);
        
        List<TransactionDTO> transactionDTOs = transactionMapper.toDTOList(transactionPage.getContent());
        return new PaginatedResponse<>(
            transactionDTOs,
            transactionPage.getNumber(),
            transactionPage.getSize(),
            transactionPage.getTotalElements()
        );
    }
    
    public TransactionDTO getTransactionById(String id, String userId) {
        User user = userService.getUserById(userId);
        String userStringId = user.getId();
        FinancialTransaction transaction = transactionRepository.findByIdAndUser(id, userStringId)
                .orElseThrow(() -> TransactionNotFoundException.byIdAndUserId(id, userId));
        return transactionMapper.toDTO(transaction);
    }
    
    @Transactional
    public TransactionDTO createTransaction(FinancialTransaction transaction, String userId) {
        User user = userService.getUserById(userId);
        transaction.setUser(user);
        FinancialTransaction savedTransaction = transactionRepository.save(transaction);
        return transactionMapper.toDTO(savedTransaction);
    }
    
    @Transactional
    public TransactionDTO updateTransaction(String id, UpdateTransactionRequestDTO requestDTO, String userId) {
        User user = userService.getUserById(userId);
        String userStringId = user.getId();
        FinancialTransaction transaction = transactionRepository.findByIdAndUser(id, userStringId)
                .orElseThrow(() -> TransactionNotFoundException.byIdAndUserId(id, userId));
        
        transactionMapper.updateEntity(transaction, requestDTO);
        
        FinancialTransaction savedTransaction = transactionRepository.save(transaction);
        return transactionMapper.toDTO(savedTransaction);
    }
    
    @Transactional
    public TransactionDTO deleteTransaction(String id, String userId) {
        User user = userService.getUserById(userId);
        String userStringId = user.getId();
        FinancialTransaction transaction = transactionRepository.findByIdAndUser(id, userStringId)
                .orElseThrow(() -> TransactionNotFoundException.byIdAndUserId(id, userId));
        
        TransactionDTO deletedTransactionDTO = transactionMapper.toDTO(transaction);
        transactionRepository.deleteById(id);
        return deletedTransactionDTO;
    }
    
    public Double getTotalTransactionsByUserId(String userId) {
        return transactionRepository.sumAmountByUser(userId);
    }
    
    public List<TransactionDTO> getRecentTransactions(String userId, int limit) {
        User user = userService.getUserById(userId);
        Pageable pageable = PageRequest.of(0, limit);
        Page<FinancialTransaction> transactionPage = transactionRepository.findByUserOrderByDateDesc(user, pageable);
        return transactionMapper.toDTOList(transactionPage.getContent());
    }
    
    public Double getTotalIncomeByUserId(String userId) {
        User user = userService.getUserById(userId);
        List<FinancialTransaction> transactions = transactionRepository.findByUser(user);
        return transactions.stream()
                .filter(t -> t.getTransactionType() == TransactionType.INCOME)
                .mapToDouble(FinancialTransaction::getAmount)
                .sum();
    }
    
    public Double getTotalExpenseByUserId(String userId) {
        User user = userService.getUserById(userId);
        List<FinancialTransaction> transactions = transactionRepository.findByUser(user);
        return transactions.stream()
                .filter(t -> t.getTransactionType() == TransactionType.EXPENSE)
                .mapToDouble(FinancialTransaction::getAmount)
                .sum();
    }
    
    public Double getTotalExpenseForMonth(String userId, YearMonth yearMonth) {
        User user = userService.getUserById(userId);
        LocalDateTime startDate = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime endDate = yearMonth.atEndOfMonth().atTime(23, 59, 59);
        List<FinancialTransaction> transactions = transactionRepository.findByUserAndDateBetween(user, startDate, endDate);
        return transactions.stream()
                .filter(t -> t.getTransactionType() == TransactionType.EXPENSE)
                .mapToDouble(FinancialTransaction::getAmount)
                .sum();
    }
    
    public PaginatedResponse<TransactionDTO> getCurrentMonthTransactions(String userId, int page, int size) {
        User user = userService.getUserById(userId);
        YearMonth currentMonth = YearMonth.now();
        LocalDateTime startDate = currentMonth.atDay(1).atStartOfDay();
        LocalDateTime endDate = currentMonth.atEndOfMonth().atTime(23, 59, 59);
        
        List<FinancialTransaction> allTransactions = transactionRepository.findByUserAndDateBetween(user, startDate, endDate);
        List<FinancialTransaction> sortedTransactions = allTransactions.stream()
                .sorted((a, b) -> b.getDate().compareTo(a.getDate()))
                .toList();
        
        int totalElements = sortedTransactions.size();
        int totalPages = (int) Math.ceil((double) totalElements / size);
        int start = page * size;
        int end = Math.min(start + size, totalElements);
        List<FinancialTransaction> pageContent = sortedTransactions.subList(start, end);
        
        List<TransactionDTO> transactionDTOs = transactionMapper.toDTOList(pageContent);
        return new PaginatedResponse<>(transactionDTOs, page, size, totalElements);
    }
}

