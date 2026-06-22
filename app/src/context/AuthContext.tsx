import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, getToken, setToken, clearToken, type AdminUser } from '@/lib/api';

interface AuthCtx {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx>({ user: null, loading: true, login: async () => {}, logout: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) { setLoading(false); return; }
    api.get<{ user: AdminUser }>('/api/auth/me')
      .then((d) => setUser(d.user))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const d = await api.post<{ token: string; user: AdminUser }>('/api/auth/login', { email, password });
    setToken(d.token);
    setUser(d.user);
  };

  const logout = () => { clearToken(); setUser(null); };

  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(Ctx);
