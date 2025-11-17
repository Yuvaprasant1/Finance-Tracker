import { apiService } from '../../services/api.service';
import type { PaginatedResponse } from '../../types';
import { TransactionDTO, TransactionType } from './types';

/**
 * Transaction Service - Business logic for transactions
 * Uses centralized ApiService
 */
export class TransactionService {
  async getAllTransactions(userId: string, page: number = 0, size: number = 10): Promise<PaginatedResponse<TransactionDTO>> {
    return await apiService.getAllTransactions(userId, page, size);
  }

  async deleteTransaction(id: string, userId: string): Promise<TransactionDTO> {
    return await apiService.deleteTransaction(id, userId);
  }

  async getTransactionById(id: string, userId: string): Promise<TransactionDTO> {
    return await apiService.getTransactionById(id, userId);
  }

  async updateTransaction(id: string, userId: string, transaction: { amount: number; description?: string; category: string; date: string; transactionType?: TransactionType }): Promise<TransactionDTO> {
    return await apiService.updateTransaction(id, userId, transaction);
  }
}

// Singleton instance
export const transactionService = new TransactionService();
