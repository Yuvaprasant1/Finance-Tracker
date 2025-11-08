package com.finance.tracker.transaction.controller;

import com.finance.tracker.common.dto.ApiResponse;
import com.finance.tracker.common.dto.PaginatedResponse;
import com.finance.tracker.transaction.dto.CreateTransactionRequestDTO;
import com.finance.tracker.transaction.dto.TransactionDTO;
import com.finance.tracker.transaction.dto.UpdateTransactionRequestDTO;
import com.finance.tracker.transaction.entity.FinancialTransaction;
import com.finance.tracker.transaction.mapper.TransactionMapper;
import com.finance.tracker.transaction.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
public class TransactionController {
    
    private final TransactionService transactionService;
    private final TransactionMapper transactionMapper;
    
    @GetMapping
    public ResponseEntity<ApiResponse<PaginatedResponse<TransactionDTO>>> getAllTransactions(
            @RequestParam String userId,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size) {
        
        PaginatedResponse<TransactionDTO> paginatedResponse = 
            transactionService.getAllTransactionsByUserIdPaginated(userId, page, size);
        return ResponseEntity.ok(ApiResponse.success(paginatedResponse));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TransactionDTO>> getTransactionById(
            @PathVariable String id,
            @RequestParam String userId) {
        TransactionDTO transaction = transactionService.getTransactionById(id, userId);
        return ResponseEntity.ok(ApiResponse.success(transaction));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<TransactionDTO>> createTransaction(
            @Valid @RequestBody CreateTransactionRequestDTO requestDTO) {
        FinancialTransaction transaction = transactionMapper.toEntity(requestDTO);
        TransactionDTO createdTransaction = transactionService.createTransaction(transaction, requestDTO.getUserId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(createdTransaction, HttpStatus.CREATED));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TransactionDTO>> updateTransaction(
            @PathVariable String id,
            @RequestParam String userId,
            @Valid @RequestBody UpdateTransactionRequestDTO requestDTO) {
        TransactionDTO updatedTransaction = transactionService.updateTransaction(id, requestDTO, userId);
        return ResponseEntity.ok(ApiResponse.success(updatedTransaction));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<TransactionDTO>> deleteTransaction(
            @PathVariable String id,
            @RequestParam String userId) {
        TransactionDTO deletedTransaction = transactionService.deleteTransaction(id, userId);
        return ResponseEntity.ok(ApiResponse.success(deletedTransaction));
    }
}

