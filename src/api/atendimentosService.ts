import { api, USE_MOCK, mockDelay } from './axiosInstance';
import {
  ATENDIMENTO_ATIVO,
  ATENDIMENTOS,
  FILA_ATENDIMENTOS,
  FILA_ESPERA,
  TICKET_RECEBIDO,
} from './mockData';
import type {
  Atendimento,
  FilaEsperaItem,
  TicketRecebido,
  TicketResumo,
} from '@/types';

/** Serviço de atendimentos ativos (fila, conversa, ticket recebido). */
export const atendimentosService = {
  async getFila(): Promise<TicketResumo[]> {
    if (USE_MOCK) return mockDelay(FILA_ATENDIMENTOS);
    const { data } = await api.get<TicketResumo[]>('/atendimentos');
    return data;
  },

  async getFilaEspera(): Promise<FilaEsperaItem[]> {
    if (USE_MOCK) return mockDelay(FILA_ESPERA);
    const { data } = await api.get<FilaEsperaItem[]>('/atendimentos/espera');
    return data;
  },

  async getTicketRecebido(): Promise<TicketRecebido | null> {
    if (USE_MOCK) return mockDelay(TICKET_RECEBIDO);
    const { data } = await api.get<TicketRecebido | null>('/atendimentos/recebido');
    return data;
  },

  async getAtendimento(id: string): Promise<Atendimento> {
    if (USE_MOCK) return mockDelay(ATENDIMENTOS[id] ?? ATENDIMENTO_ATIVO);
    const { data } = await api.get<Atendimento>(`/atendimentos/${id}`);
    return data;
  },

  async aceitarTicket(id: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined);
    await api.post(`/atendimentos/${id}/aceitar`);
  },

  async assumirDaIa(id: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined);
    await api.post(`/atendimentos/${id}/assumir`);
  },

  async fecharAtendimento(id: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined);
    await api.post(`/atendimentos/${id}/fechar`);
  },

  async enviarMensagem(id: string, texto: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined);
    await api.post(`/atendimentos/${id}/mensagens`, { texto });
  },
};
