import { api, USE_MOCK, mockDelay } from './axiosInstance';
import { HISTORICO_ATENDIMENTOS } from './mockData';
import type { HistoricoAtendimento } from '@/types';

/** Serviço de histórico de atendimentos finalizados. */
export const historicoService = {
  async getHistorico(): Promise<HistoricoAtendimento[]> {
    if (USE_MOCK) return mockDelay(HISTORICO_ATENDIMENTOS);
    const { data } = await api.get<HistoricoAtendimento[]>('/historico');
    return data;
  },
};
