import { apiService } from '../../services/api.service';
import { TransactionDTO, TransactionType } from '../transaction/types';

/**
 * Transaction Details Service - Business logic for transactions
 * Uses centralized ApiService
 */
export class TransactionDetailsService {
  async createTransaction(transaction: { userId: string; amount: number; description?: string; category: string; date: string; transactionType?: TransactionType }): Promise<TransactionDTO> {
    return await apiService.createTransaction(transaction);
  }

  async updateTransaction(id: string, userId: string, transaction: { amount: number; description?: string; category: string; date: string; transactionType?: TransactionType }): Promise<TransactionDTO> {
    return await apiService.updateTransaction(id, userId, transaction);
  }
}

// Singleton instance
export const transactionDetailsService = new TransactionDetailsService();

