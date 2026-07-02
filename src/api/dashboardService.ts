import { api, USE_MOCK, mockDelay } from './axiosInstance';
import { DASHBOARD } from './mockData';
import type { DashboardData } from '@/types';

/** Serviço do dashboard do atendente (KPIs, histórico, fila). */
export const dashboardService = {
  async getDashboard(): Promise<DashboardData> {
    if (USE_MOCK) return mockDelay(DASHBOARD);
    const { data } = await api.get<DashboardData>('/dashboard');
    return data;
  },
};
