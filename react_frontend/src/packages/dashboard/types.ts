import type { TransactionDTO } from '../transaction/types';
import type { PaginatedResponse } from '../../types';

export interface DashboardSummaryDTO {
  totalIncome: number;
  totalExpense: number;
  savings: number;
  savingsPercentage?: number;
  previousMonthExpense: number;
  transactions: TransactionDTO[];
  monthWiseTransactions?: PaginatedResponse<TransactionDTO>;
}


