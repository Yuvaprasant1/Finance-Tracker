package com.finance.tracker.transaction.dto;

import com.finance.tracker.transaction.enumeration.TransactionType;
import com.finance.tracker.user.dto.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {
    private String id;
    private UserDTO user;
    private Double amount;
    private String description;
    private String category;
    private LocalDate date;
    private TransactionType transactionType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

