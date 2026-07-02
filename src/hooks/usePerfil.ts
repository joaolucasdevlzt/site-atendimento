import { perfilService } from '@/api/perfilService';
import { useAsync } from './useAsync';

/** Carrega o perfil do atendente. */
export function usePerfil() {
  const { data, loading, error, reload } = useAsync(
    () => perfilService.getPerfil(),
    [],
  );
  return { perfil: data, loading, error, reload };
}
