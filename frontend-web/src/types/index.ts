// User DTO
export interface UserDTO {
  id: string;
  phoneNumber: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Transaction DTO
export interface TransactionDTO {
  id: string;
  user: UserDTO;
  amount: number;
  description?: string;
  category?: string;
  date: string;
  transactionType?: 'INCOME' | 'EXPENSE';
  createdAt?: string;
  updatedAt?: string;
}

// Legacy alias for backward compatibility
export type ExpenseDTO = TransactionDTO;

// Login Response DTO
export interface LoginResponseDTO {
  userId: string;
  phoneNumber: string;
  name?: string;
  email?: string;
  currency?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

// UserProfile DTO
export interface UserProfileDTO {
  id?: string;
  phoneNumber?: string;
  name?: string;
  email?: string;
  currency: string;
  address?: string;
  canEditCurrency: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Dashboard Summary DTO
export interface DashboardSummaryDTO {
  totalIncome: number;
  totalExpense: number;
  savings: number;
  savingsPercentage?: number;
  previousMonthExpense: number;
  transactions: TransactionDTO[];
  monthWiseTransactions?: PaginatedResponse<TransactionDTO>;
}

// Currency DTO
export interface CurrencyDTO {
  id: string;
  code: string;
  symbol: string;
  name: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Legacy interfaces for backward compatibility (deprecated)
export interface Expense extends TransactionDTO {
  phoneNumber: string; // For backward compatibility
}

export interface UserProfile extends Omit<UserProfileDTO, 'user'> {
  phoneNumber: string; // For backward compatibility
}

export interface ExpenseSummary extends DashboardSummaryDTO {
  expenses: Expense[]; // For backward compatibility
  recentExpenses?: Expense[]; // For backward compatibility
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

// Paginated Response DTO
export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// Error Details DTO - matches backend ErrorDetails structure
export interface ErrorDetails {
  error: string;
  message: string;
  timestamp?: string;
  path?: string;
  details?: Record<string, any>;
}

