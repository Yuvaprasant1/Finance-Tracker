package com.finance.tracker.dashboard.mapper;

import com.finance.tracker.common.dto.PaginatedResponse;
import com.finance.tracker.dashboard.dto.DashboardSummaryDTO;
import com.finance.tracker.transaction.dto.TransactionDTO;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DashboardMapper {
    
    /**
     * Maps transaction data to DashboardSummaryDTO with new structure.
     * 
     * @param totalIncome total income amount
     * @param totalExpense total expense amount
     * @param savings calculated savings (income - expense)
     * @param savingsPercentage percentage change from previous month
     * @param previousMonthExpense previous month's total expense
     * @param transactions the list of all transactions
     * @param monthWiseTransactions paginated current month transactions
     * @return DashboardSummaryDTO with mapped fields
     */
    public DashboardSummaryDTO toDTO(
            Double totalIncome,
            Double totalExpense,
            Double savings,
            Double savingsPercentage,
            Double previousMonthExpense,
            List<TransactionDTO> transactions,
            PaginatedResponse<TransactionDTO> monthWiseTransactions) {
        
        DashboardSummaryDTO dto = new DashboardSummaryDTO();
        dto.setTotalIncome(totalIncome != null ? totalIncome : 0.0);
        dto.setTotalExpense(totalExpense != null ? totalExpense : 0.0);
        dto.setSavings(savings != null ? savings : 0.0);
        dto.setSavingsPercentage(savingsPercentage);
        dto.setPreviousMonthExpense(previousMonthExpense != null ? previousMonthExpense : 0.0);
        dto.setTransactions(transactions != null ? transactions : new java.util.ArrayList<>());
        dto.setMonthWiseTransactions(monthWiseTransactions);
        
        return dto;
    }
}

