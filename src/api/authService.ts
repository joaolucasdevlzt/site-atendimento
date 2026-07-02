import { api, USE_MOCK, mockDelay } from './axiosInstance';
import { USUARIO_DEMO } from './mockData';
import type { Usuario } from '@/types';

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

/**
 * Autenticação.
 * MODO APRESENTAÇÃO: acesso livre — qualquer credencial entra e devolve o
 * usuário demo. Basta trocar VITE_USE_MOCK=false para usar o backend real.
 */
export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    if (USE_MOCK) {
      return mockDelay({
        token: 'demo-token',
        usuario: { ...USUARIO_DEMO, email: payload.email || USUARIO_DEMO.email },
      });
    }
    const { data } = await api.post<LoginResponse>('/auth/login', payload);
    return data;
  },

  async me(): Promise<Usuario> {
    if (USE_MOCK) return mockDelay(USUARIO_DEMO);
    const { data } = await api.get<Usuario>('/auth/me');
    return data;
  },
};
