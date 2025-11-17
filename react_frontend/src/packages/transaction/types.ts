import type { UserDTO } from '../../types';

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export interface TransactionDTO {
  id: string;
  user: UserDTO;
  amount: number;
  description?: string;
  category?: string;
  date: string;
  transactionType?: TransactionType;
  createdAt?: string;
  updatedAt?: string;
}


