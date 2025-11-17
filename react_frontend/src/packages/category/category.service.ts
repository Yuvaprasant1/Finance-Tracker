import { apiService } from '../../services/api.service';
import type { CategoryDTO, CategoryPaginatedResponse, CreateCategoryRequest, UpdateCategoryRequest } from './types';

/**
 * Category Service - Business logic for categories
 * Uses centralized ApiService
 */
export class CategoryService {
  async getCategories(userId: string, page: number = 0, size: number = 10, searchTerm?: string): Promise<CategoryPaginatedResponse> {
    return await apiService.getCategories(userId, page, size, searchTerm);
  }

  async createCategory(userId: string, category: CreateCategoryRequest): Promise<CategoryDTO> {
    return await apiService.createCategory(userId, category);
  }

  async updateCategory(categoryId: string, userId: string, category: UpdateCategoryRequest): Promise<CategoryDTO> {
    return await apiService.updateCategory(categoryId, userId, category);
  }

  async deleteCategory(categoryId: string, userId: string): Promise<void> {
    return await apiService.deleteCategory(categoryId, userId);
  }
}

// Singleton instance
export const categoryService = new CategoryService();

