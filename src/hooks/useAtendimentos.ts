import { atendimentosService } from '@/api/atendimentosService';
import { useAsync } from './useAsync';

/** Carrega a fila de atendimentos ativos. */
export function useFila() {
  const { data, loading, error, reload } = useAsync(
    () => atendimentosService.getFila(),
    [],
  );
  return { fila: data ?? [], loading, error, reload };
}

/** Carrega a fila de espera (motoristas aguardando atendimento). */
export function useFilaEspera() {
  const { data, loading, error, reload } = useAsync(
    () => atendimentosService.getFilaEspera(),
    [],
  );
  return { espera: data ?? [], loading, error, reload };
}

/** Carrega o ticket recém-recebido (banner "novo ticket"). */
export function useTicketRecebido() {
  const { data, loading } = useAsync(
    () => atendimentosService.getTicketRecebido(),
    [],
  );
  return { ticket: data ?? null, loading };
}

/** Carrega um atendimento completo pelo id. */
export function useAtendimento(id: string) {
  const { data, loading, error, reload } = useAsync(
    () => atendimentosService.getAtendimento(id),
    [id],
  );
  return { atendimento: data, loading, error, reload };
}
