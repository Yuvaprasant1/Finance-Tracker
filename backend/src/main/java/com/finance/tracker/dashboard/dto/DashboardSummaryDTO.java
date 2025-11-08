package com.finance.tracker.dashboard.dto;

import com.finance.tracker.common.dto.PaginatedResponse;
import com.finance.tracker.transaction.dto.TransactionDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDTO {
    private Double totalIncome;
    private Double totalExpense;
    private Double savings;
    private Double savingsPercentage;
    private Double previousMonthExpense;
    private List<TransactionDTO> transactions;
    private PaginatedResponse<TransactionDTO> monthWiseTransactions;
}

