package com.finance.tracker.transaction.mapper;

import com.finance.tracker.transaction.dto.CreateTransactionRequestDTO;
import com.finance.tracker.transaction.dto.TransactionDTO;
import com.finance.tracker.transaction.dto.UpdateTransactionRequestDTO;
import com.finance.tracker.transaction.entity.FinancialTransaction;
import com.finance.tracker.user.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class TransactionMapper {
    
    private final UserMapper userMapper;
    
    public TransactionDTO toDTO(FinancialTransaction transaction) {
        if (transaction == null) {
            return null;
        }
        
        TransactionDTO dto = new TransactionDTO();
        dto.setId(transaction.getId());
        dto.setUser(userMapper.toDTO(transaction.getUser()));
        dto.setAmount(transaction.getAmount());
        dto.setDescription(transaction.getDescription());
        dto.setCategory(transaction.getCategory());
        dto.setDate(transaction.getDate());
        dto.setTransactionType(transaction.getTransactionType());
        dto.setCreatedAt(transaction.getCreatedAt());
        dto.setUpdatedAt(transaction.getUpdatedAt());
        
        return dto;
    }
    
    public List<TransactionDTO> toDTOList(List<FinancialTransaction> transactions) {
        if (transactions == null) {
            return null;
        }
        return transactions.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public FinancialTransaction toEntity(CreateTransactionRequestDTO requestDTO) {
        if (requestDTO == null) {
            return null;
        }
        
        FinancialTransaction transaction = new FinancialTransaction();
        transaction.setAmount(requestDTO.getAmount());
        transaction.setDescription(requestDTO.getDescription());
        transaction.setCategory(requestDTO.getCategory());
        transaction.setDate(requestDTO.getDate());
        transaction.setTransactionType(requestDTO.getTransactionType());
        
        // Note: User will be set by the service layer
        return transaction;
    }
    
    /**
     * Update existing transaction entity with data from UpdateTransactionRequestDTO.
     * All validations are handled at the DTO level via @Valid annotation.
     */
    public void updateEntity(FinancialTransaction existingTransaction, UpdateTransactionRequestDTO requestDTO) {
        if (existingTransaction == null || requestDTO == null) {
            return;
        }
        
        existingTransaction.setAmount(requestDTO.getAmount());
        existingTransaction.setDescription(requestDTO.getDescription());
        existingTransaction.setCategory(requestDTO.getCategory());
        existingTransaction.setDate(requestDTO.getDate());
        existingTransaction.setTransactionType(requestDTO.getTransactionType());
    }
}
