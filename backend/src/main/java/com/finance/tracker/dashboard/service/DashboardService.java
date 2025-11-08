package com.finance.tracker.dashboard.service;

import com.finance.tracker.common.dto.PaginatedResponse;
import com.finance.tracker.dashboard.dto.DashboardSummaryDTO;
import com.finance.tracker.dashboard.exception.DashboardDataException;
import com.finance.tracker.dashboard.mapper.DashboardMapper;
import com.finance.tracker.transaction.dto.TransactionDTO;
import com.finance.tracker.transaction.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {
    
    private final TransactionService transactionService;
    private final DashboardMapper dashboardMapper;
    
    public DashboardSummaryDTO getExpenseSummary(String userId, int page, int size) {
        try {
            // Calculate totals
            Double totalIncome = transactionService.getTotalIncomeByUserId(userId);
            Double totalExpense = transactionService.getTotalExpenseByUserId(userId);
            
            // Calculate savings
            Double savings = (totalIncome != null ? totalIncome : 0.0) - (totalExpense != null ? totalExpense : 0.0);
            
            // Get previous month expense
            YearMonth currentMonth = YearMonth.now();
            YearMonth previousMonth = currentMonth.minusMonths(1);
            Double previousMonthExpense = transactionService.getTotalExpenseForMonth(userId, previousMonth);
            
            // Calculate savings percentage
            Double savingsPercentage = null;
            if (previousMonthExpense != null && previousMonthExpense > 0) {
                Double currentMonthExpense = transactionService.getTotalExpenseForMonth(userId, currentMonth);
                if (currentMonthExpense != null) {
                    savingsPercentage = ((previousMonthExpense - currentMonthExpense) / previousMonthExpense) * 100;
                }
            }
            
            // Get current month transactions with pagination
            PaginatedResponse<TransactionDTO> monthWiseTransactions = transactionService.getCurrentMonthTransactions(userId, page, size);
            
            // Get all transactions for backward compatibility
            List<TransactionDTO> transactions = transactionService.getAllTransactionsByUserId(userId);
            
            // Use mapper to map fields
            return dashboardMapper.toDTO(
                totalIncome != null ? totalIncome : 0.0,
                totalExpense != null ? totalExpense : 0.0,
                savings,
                savingsPercentage,
                previousMonthExpense != null ? previousMonthExpense : 0.0,
                transactions,
                monthWiseTransactions
            );
        } catch (Exception e) {
            throw new DashboardDataException("Failed to retrieve dashboard summary: " + e.getMessage(), e);
        }
    }
}

