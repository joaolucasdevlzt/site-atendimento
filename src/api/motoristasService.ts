import { api, USE_MOCK, mockDelay } from './axiosInstance';
import { MOTORISTAS_FROTA } from './mockData';
import type { MotoristaFrota } from '@/types';

/** Serviço da frota de motoristas (visão de gestão). */
export const motoristasService = {
  async getMotoristas(): Promise<MotoristaFrota[]> {
    if (USE_MOCK) return mockDelay(MOTORISTAS_FROTA);
    const { data } = await api.get<MotoristaFrota[]>('/motoristas');
    return data;
  },
};
