import { dashboardService } from '@/api/dashboardService';
import { useAsync } from './useAsync';

/** Carrega os dados do dashboard do atendente. */
export function useDashboard() {
  const { data, loading, error, reload } = useAsync(
    () => dashboardService.getDashboard(),
    [],
  );
  return { dashboard: data, loading, error, reload };
}
