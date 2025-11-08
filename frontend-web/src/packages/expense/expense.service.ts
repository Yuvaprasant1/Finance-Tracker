import { apiService } from '../../services/api.service';
import { TransactionDTO } from '../../types';

/**
 * Expense Service - Business logic for transactions (legacy name)
 * Uses centralized ApiService
 */
export class ExpenseService {
  async createExpense(transaction: { userId: string; amount: number; description?: string; category: string; date: string; transactionType?: 'INCOME' | 'EXPENSE' }): Promise<TransactionDTO> {
    return await apiService.createTransaction(transaction);
  }

  async updateExpense(id: string, userId: string, transaction: { amount: number; description?: string; category: string; date: string; transactionType?: 'INCOME' | 'EXPENSE' }): Promise<TransactionDTO> {
    return await apiService.updateTransaction(id, userId, transaction);
  }
}

// Singleton instance
export const expenseService = new ExpenseService();
