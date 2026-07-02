import { motoristasService } from '@/api/motoristasService';
import { useAsync } from './useAsync';

/** Carrega a frota de motoristas. */
export function useMotoristas() {
  const { data, loading, error, reload } = useAsync(
    () => motoristasService.getMotoristas(),
    [],
  );
  return { motoristas: data ?? [], loading, error, reload };
}
