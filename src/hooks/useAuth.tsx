import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authService, type LoginPayload } from '@/api/authService';
import type { Usuario } from '@/types';

const TOKEN_KEY = 'fblog.token';
const USER_KEY = 'fblog.user';

interface AuthContextValue {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): Usuario | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as Usuario) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(readStoredUser);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (payload: LoginPayload) => {
    setLoading(true);
    try {
      const { token, usuario } = await authService.login(payload);
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(usuario));
      setUsuario(usuario);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUsuario(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      usuario,
      isAuthenticated: Boolean(usuario),
      loading,
      login,
      logout,
    }),
    [usuario, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}
