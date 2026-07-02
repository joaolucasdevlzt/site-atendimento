import axios, { AxiosError } from 'axios';

/**
 * Instância única do Axios usada por toda a aplicação.
 * - baseURL vem de variável de ambiente (VITE_API_URL)
 * - interceptors centralizam autenticação e tratamento de erro
 *
 * No modo apresentação (VITE_USE_MOCK=true) os serviços retornam dados mock
 * e não chegam a usar esta instância — mas ela já está pronta para o backend.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3333',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const TOKEN_KEY = 'fblog.token';

// Injeta o token (quando existir) em toda requisição.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tratamento centralizado de erros de resposta.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Sessão expirada — em produção redirecionaríamos para /login.
      localStorage.removeItem(TOKEN_KEY);
    }
    return Promise.reject(error);
  },
);

export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

/** Pequeno helper para simular latência de rede no modo mock. */
export function mockDelay<T>(data: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}
