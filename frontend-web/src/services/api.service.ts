import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { TransactionDTO, ExpenseDTO, UserProfileDTO, DashboardSummaryDTO, CurrencyDTO, LoginResponseDTO, ErrorDetails, PaginatedResponse } from '../types';

/**
 * API Service Class - Centralized HTTP client with axios
 * All packages use this service for API calls
 * Automatically manages loading state via axios interceptors
 */
export class ApiService {
  private api: AxiosInstance;
  private loadingContext: {
    startLoading: (message?: string) => void;
    stopLoading: () => void;
  } | null = null;

  constructor(baseURL: string = 'http://localhost:8080/finance-tracker/api/v1') {
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  /**
   * Set loading context for automatic loading management
   */
  setLoadingContext(context: {
    startLoading: (message?: string) => void;
    stopLoading: () => void;
  }): void {
    this.loadingContext = context;
  }

  /**
   * Setup axios interceptors for request/response handling
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Auto-start loading for all requests with default message
        if (this.loadingContext) {
          this.loadingContext.startLoading('Loading...');
        }
        return config;
      },
      (error) => {
        // Stop loading on request error
        if (this.loadingContext) {
          this.loadingContext.stopLoading();
        }
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        // Stop loading on successful response
        if (this.loadingContext) {
          this.loadingContext.stopLoading();
        }
        // Extract data from nested ApiResponse structure: response.data.data
        // Backend returns: { data: { ... }, status: 200 }
        // Axios wraps it: { data: { data: { ... }, status: 200 } }
        if (response.data && response.data.data !== undefined) {
          response.data = response.data.data;
        }
        return response;
      },
      (error: AxiosError) => {
        // Stop loading on response error
        if (this.loadingContext) {
          this.loadingContext.stopLoading();
        }
        // Extract error from nested ApiResponse structure
        // Backend returns: { data: { error: "...", message: "...", timestamp: "...", path: "...", details: {...} }, status: 400 }
        // Axios wraps it: { data: { data: { error: "...", message: "..." }, status: 400 } }
        if (error.response?.data && (error.response.data as any).data !== undefined) {
          // Error is wrapped in ApiResponse<ErrorDetails>
          error.response.data = (error.response.data as any).data;
        }
        this.handleError(error as AxiosError<ErrorDetails>);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Centralized error handling
   * Error structure: { error: string, message: string, timestamp?: string, path?: string, details?: Record<string, any> }
   */
  private handleError(error: AxiosError<ErrorDetails>): void {
    if (error.response) {
      // Server responded with error status
      const errorData = error.response.data;
      if (errorData && typeof errorData === 'object' && 'error' in errorData && 'message' in errorData) {
        // ErrorDetails structure
        console.error('API Error:', {
          status: error.response.status,
          error: errorData.error,
          message: errorData.message,
          path: errorData.path,
          timestamp: errorData.timestamp,
          details: errorData.details,
          url: error.config?.url,
        });
      } else {
        // Fallback for non-standard error responses
        console.error('API Error:', {
          status: error.response.status,
          data: error.response.data,
          url: error.config?.url,
        });
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
  }
  
  /**
   * Extract error message from error response
   * Returns user-friendly error message
   */
  getErrorMessage(error: any): string {
    if (error?.response?.data) {
      const errorData = error.response.data;
      // Check if it's ErrorDetails structure
      if (errorData && typeof errorData === 'object' && 'message' in errorData) {
        return errorData.message || 'An error occurred';
      }
      // Fallback for other error formats
      if (typeof errorData === 'string') {
        return errorData;
      }
    }
    if (error?.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }

  // ========== Transaction API Methods ==========

  async getAllTransactions(userId: string, page: number = 0, size: number = 10): Promise<PaginatedResponse<TransactionDTO>> {
    const response = await this.api.get<PaginatedResponse<TransactionDTO>>('/transactions', {
      params: { userId, page, size },
    });
    return response.data;
  }

  async getTransactionById(id: string, userId: string): Promise<TransactionDTO> {
    const response = await this.api.get<TransactionDTO>(`/transactions/${id}`, {
      params: { userId },
    });
    return response.data;
  }

  async createTransaction(transaction: { userId: string; amount: number; description?: string; category?: string; date: string; transactionType?: 'INCOME' | 'EXPENSE' }): Promise<TransactionDTO> {
    const response = await this.api.post<TransactionDTO>('/transactions', transaction);
    return response.data;
  }

  async updateTransaction(id: string, userId: string, transaction: { amount: number; description?: string; category?: string; date: string; transactionType?: 'INCOME' | 'EXPENSE' }): Promise<TransactionDTO> {
    const response = await this.api.put<TransactionDTO>(`/transactions/${id}`, transaction, {
      params: { userId },
    });
    return response.data;
  }

  async deleteTransaction(id: string, userId: string): Promise<TransactionDTO> {
    const response = await this.api.delete<TransactionDTO>(`/transactions/${id}`, {
      params: { userId },
    });
    return response.data;
  }

  // Legacy methods for backward compatibility
  async getAllExpenses(userId: string, page: number = 0, size: number = 10): Promise<PaginatedResponse<ExpenseDTO>> {
    return this.getAllTransactions(userId, page, size);
  }

  async getExpenseById(id: string, userId: string): Promise<ExpenseDTO> {
    return this.getTransactionById(id, userId);
  }

  async createExpense(expense: { userId: string; amount: number; description?: string; category?: string; date: string; transactionType?: 'INCOME' | 'EXPENSE' }): Promise<ExpenseDTO> {
    return this.createTransaction(expense);
  }

  async updateExpense(id: string, userId: string, expense: { amount: number; description?: string; category?: string; date: string; transactionType?: 'INCOME' | 'EXPENSE' }): Promise<ExpenseDTO> {
    return this.updateTransaction(id, userId, expense);
  }

  async deleteExpense(id: string, userId: string): Promise<ExpenseDTO> {
    return this.deleteTransaction(id, userId);
  }

  // ========== Dashboard API Methods ==========

  async getDashboardSummary(userId: string, page: number = 0, size: number = 10): Promise<DashboardSummaryDTO> {
    const response = await this.api.get<DashboardSummaryDTO>('/dashboard/summary', {
      params: { userId, page, size },
    });
    return response.data;
  }

  // ========== Auth API Methods ==========

  async login(phoneNumber: string): Promise<LoginResponseDTO> {
    const response = await this.api.post<LoginResponseDTO>('/auth/login', {
      phoneNumber,
    });
    return response.data;
  }

  // ========== User Profile API Methods ==========

  async getUserProfile(userId: string): Promise<UserProfileDTO> {
    const response = await this.api.get<UserProfileDTO>('/user-profile', {
      params: { userId },
    });
    return response.data;
  }


  async updateUserProfile(userId: string, profile: { name?: string; email?: string; currency?: string; address?: string }): Promise<UserProfileDTO> {
    const response = await this.api.put<UserProfileDTO>('/user-profile', profile, {
      params: { userId },
    });
    return response.data;
  }

  // ========== Currency API Methods ==========

  async getAllCurrencies(): Promise<CurrencyDTO[]> {
    const response = await this.api.get<CurrencyDTO[]>('/currencies');
    return response.data;
  }
}

// Singleton instance - all packages use this
export const apiService = new ApiService();

