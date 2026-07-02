import { api, USE_MOCK, mockDelay } from './axiosInstance';
import { PERFIL_ATENDENTE } from './mockData';
import type { PerfilAtendente } from '@/types';

/** Serviço do perfil do atendente (visualização e edição). */
export const perfilService = {
  async getPerfil(): Promise<PerfilAtendente> {
    if (USE_MOCK) return mockDelay(PERFIL_ATENDENTE);
    const { data } = await api.get<PerfilAtendente>('/perfil');
    return data;
  },

  async updatePerfil(payload: PerfilAtendente): Promise<PerfilAtendente> {
    if (USE_MOCK) return mockDelay(payload);
    const { data } = await api.put<PerfilAtendente>('/perfil', payload);
    return data;
  },
};
