import axios, { AxiosInstance, AxiosError, } from 'axios';
import { ExpenseDTO, CurrencyDTO, ErrorDetails, PaginatedResponse } from '../types';
import { TransactionDTO, TransactionType } from '../packages/transaction/types';
import { SSOLoginResponse } from '../packages/auth/types';
import type { DashboardSummaryDTO } from '../packages/dashboard/types';
import type { UserProfileDTO } from '../packages/user-profile/types';
import type { CategoryDTO, CategoryPaginatedResponse, CreateCategoryRequest, UpdateCategoryRequest } from '../packages/category/types';

/**
 * API Service Class - Centralized HTTP client with axios
 * All packages use this service for API calls
 * Automatically manages loading state via axios interceptors
 */
export class ApiService {
  private api: AxiosInstance;
  private authToken: string | null = null;
  private loadingContext: {
    startLoading: (message?: string) => void;
    stopLoading: () => void;
  } | null = null;

  constructor(baseURL?: string) {
    // Use environment variable if available, otherwise fallback to default
    // REACT_APP_API_BASE_URL should be set in .env files or build environment
    const apiBaseURL = baseURL || 
      process.env.REACT_APP_API_BASE_URL || 
      'http://localhost:8080/finance-tracker/api/v1';
    
    this.api = axios.create({
      baseURL: apiBaseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    this.setupInterceptors();
  }


  /**
   * Set/clear auth token (Firebase ID token)
   */
  setAuthToken(token: string | null): void {
    this.authToken = token;
    try {
      if (token) {
        localStorage.setItem('idToken', token);
      } else {
        localStorage.removeItem('idToken');
      }
    } catch {}
  }

  /**
   * Load token from storage (on app init)
   */
  hydrateAuthTokenFromStorage(): void {
    try {
      const stored = localStorage.getItem('idToken');
      if (stored) this.authToken = stored;
    } catch {}
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
        // Attach Authorization header if token present
        if (this.authToken) {
          (config.headers = config.headers || {})['Authorization'] = `Bearer ${this.authToken}`;
        }
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
  getErrorMessage(error: unknown): string {
    const maybeAxios = error as { response?: { data?: unknown }; message?: string };
    if (maybeAxios?.response?.data) {
      const errorData = maybeAxios.response.data as unknown;
      if (typeof errorData === 'object' && errorData !== null && 'message' in (errorData as Record<string, unknown>)) {
        const msg = (errorData as { message?: string }).message;
        return msg || 'An error occurred';
      }
      if (typeof errorData === 'string') {
        return errorData;
      }
    }
    if (typeof maybeAxios?.message === 'string') {
      return maybeAxios.message;
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

  async createTransaction(transaction: { userId: string; amount: number; description?: string; category?: string; date: string; transactionType?: TransactionType }): Promise<TransactionDTO> {
    const response = await this.api.post<TransactionDTO>('/transactions', transaction);
    return response.data;
  }

  async updateTransaction(id: string, userId: string, transaction: { amount: number; description?: string; category?: string; date: string; transactionType?: TransactionType }): Promise<TransactionDTO> {
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

  async createExpense(expense: { userId: string; amount: number; description?: string; category?: string; date: string; transactionType?: TransactionType }): Promise<ExpenseDTO> {
    return this.createTransaction(expense);
  }

  async updateExpense(id: string, userId: string, expense: { amount: number; description?: string; category?: string; date: string; transactionType?: TransactionType }): Promise<ExpenseDTO> {
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

  // ========== SSO Exchange Methods ==========

  async loginWithGoogleIdToken(idToken: string): Promise<SSOLoginResponse> {
    const response = await this.api.post<SSOLoginResponse>('/auth/login/google', { idToken });
    return response.data;
  }

  // Apple SSO disabled

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

  // ========== Category API Methods ==========

  async getCategories(userId: string, page: number = 0, size: number = 10, searchTerm?: string): Promise<CategoryPaginatedResponse> {
    const response = await this.api.get<CategoryPaginatedResponse>('/categories', {
      params: { userId, page, size, searchTerm },
    });
    return response.data;
  }

  async createCategory(userId: string, category: CreateCategoryRequest): Promise<CategoryDTO> {
    const response = await this.api.post<CategoryDTO>('/categories', category, {
      params: { userId },
    });
    return response.data;
  }

  async updateCategory(id: string, userId: string, category: UpdateCategoryRequest): Promise<CategoryDTO> {
    const response = await this.api.put<CategoryDTO>(`/categories/${id}`, category, {
      params: { userId },
    });
    return response.data;
  }

  async deleteCategory(id: string, userId: string): Promise<void> {
    await this.api.delete(`/categories/${id}`, {
      params: { userId },
    });
  }
}

// Singleton instance - all packages use this
export const apiService = new ApiService();
apiService.hydrateAuthTokenFromStorage();

