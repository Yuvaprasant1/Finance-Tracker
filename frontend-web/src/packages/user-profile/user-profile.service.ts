import { apiService } from '../../services/api.service';
import { UserProfileDTO, CurrencyDTO } from '../../types';

/**
 * User Profile Service - Business logic for user profile
 * Uses centralized ApiService
 */
export class UserProfileService {
  async getUserProfile(userId: string): Promise<UserProfileDTO> {
    return await apiService.getUserProfile(userId);
  }

  async updateUserProfile(userId: string, profile: { name?: string; email?: string; currency?: string; address?: string }): Promise<UserProfileDTO> {
    return await apiService.updateUserProfile(userId, profile);
  }

  async getAllCurrencies(): Promise<CurrencyDTO[]> {
    return await apiService.getAllCurrencies();
  }
}

// Singleton instance
export const userProfileService = new UserProfileService();
