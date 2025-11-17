import type { PaginatedResponse } from '../../types';

export interface CategoryDTO {
  id: string;
  name: string;
  isDefault: boolean;
  isActive?: boolean;
}

export interface CategorySearchParams {
  userId: string;
  page?: number;
  size?: number;
  searchTerm?: string;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  name: string;
}

export type CategoryPaginatedResponse = PaginatedResponse<CategoryDTO>;

