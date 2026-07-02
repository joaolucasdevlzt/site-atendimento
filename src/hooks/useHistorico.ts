import { historicoService } from '@/api/historicoService';
import { useAsync } from './useAsync';

/** Carrega o histórico de atendimentos finalizados. */
export function useHistorico() {
  const { data, loading, error, reload } = useAsync(
    () => historicoService.getHistorico(),
    [],
  );
  return { historico: data ?? [], loading, error, reload };
}
