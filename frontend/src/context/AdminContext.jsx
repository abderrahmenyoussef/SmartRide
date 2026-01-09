import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return sessionStorage.getItem('smartride:admin') === 'true';
  });

  const loginAdmin = useCallback(() => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem('smartride:admin', 'true');
  }, []);

  const logoutAdmin = useCallback(() => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('smartride:admin');
  }, []);

  const value = useMemo(
    () => ({
      isAdminAuthenticated,
      loginAdmin,
      logoutAdmin
    }),
    [isAdminAuthenticated, loginAdmin, logoutAdmin]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export const useAdminContext = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error("useAdminContext doit être utilisé à l'intérieur de AdminProvider");
  }
  return ctx;
};
