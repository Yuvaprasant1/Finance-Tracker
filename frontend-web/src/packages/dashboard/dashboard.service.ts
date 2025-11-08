import { apiService } from '../../services/api.service';
import { DashboardSummaryDTO } from '../../types';

/**
 * Dashboard Service - Business logic for dashboard
 * Uses centralized ApiService
 */
export class DashboardService {
  async getSummary(userId: string, page: number = 0, size: number = 10): Promise<DashboardSummaryDTO> {
    return await apiService.getDashboardSummary(userId, page, size);
  }
}

// Singleton instance
export const dashboardService = new DashboardService();
