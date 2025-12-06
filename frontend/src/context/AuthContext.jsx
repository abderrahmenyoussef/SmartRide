import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../api/client';

const AuthContext = createContext(null);

const USER_STORAGE_KEY = 'smartride:user';
const TOKEN_STORAGE_KEY = 'smartride:token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const persistSession = (nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
  };

  const clearSession = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }, []);

  const verifyToken = useCallback(
    async (overrideToken) => {
      const activeToken = overrideToken || token;
      if (!activeToken) return null;
      setIsAuthLoading(true);
      setAuthError('');
      try {
        const data = await apiRequest('/auth/verify', { token: activeToken });
        const nextUser = {
          _id: data.user.userId || data.user._id,
          username: data.user.username,
          email: data.user.email,
          role: data.user.role
        };
        persistSession(nextUser, activeToken);
        return nextUser;
      } catch (error) {
        setAuthError(error.message);
        clearSession();
        return null;
      } finally {
        setIsAuthLoading(false);
      }
    },
    [token, clearSession]
  );

  const login = useCallback(
    async ({ identifier, password }) => {
      setIsAuthLoading(true);
      setAuthError('');
      try {
        const data = await apiRequest('/auth/login', { method: 'POST', data: { identifier, password } });
        const nextToken = data.token;
        await verifyToken(nextToken);
        return data;
      } catch (error) {
        setAuthError(error.message);
        throw error;
      } finally {
        setIsAuthLoading(false);
      }
    },
    [verifyToken]
  );

  const register = useCallback(
    async ({ username, email, password, role }) => {
      setIsAuthLoading(true);
      setAuthError('');
      try {
        const data = await apiRequest('/auth/register', {
          method: 'POST',
          data: { username, email, password, role }
        });
        const nextToken = data.token;
        await verifyToken(nextToken);
        return data;
      } catch (error) {
        setAuthError(error.message);
        throw error;
      } finally {
        setIsAuthLoading(false);
      }
    },
    [verifyToken]
  );

  const logout = useCallback(async () => {
    if (token) {
      try {
        await apiRequest('/auth/logout', { method: 'POST', token });
      } catch (error) {
        console.warn('Erreur lors de la déconnexion côté API:', error.message);
      }
    }
    clearSession();
  }, [token, clearSession]);

  useEffect(() => {
    if (token && !user) {
      verifyToken(token);
    }
  }, [token, user, verifyToken]);

  const value = useMemo(
    () => ({
      user,
      token,
      authError,
      isAuthLoading,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
      refreshUser: verifyToken
    }),
    [user, token, authError, isAuthLoading, login, register, logout, verifyToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
