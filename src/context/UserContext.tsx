import React, { createContext, useContext, useState } from 'react';
import { UserRole, UserSession } from '../types';
import { MOCK_ACCOUNTS } from '../data/mockData';

interface UserContextType {
  user: UserSession | null;
  /** Login por e-mail/senha contra as 3 contas de demonstração. Retorna a sessão em caso de sucesso. */
  login: (email: string, password: string) => UserSession | null;
  /** Login rápido de demonstração, sem precisar digitar e-mail/senha. */
  loginAs: (role: UserRole) => UserSession | null;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'betlegal_mock_session';

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as UserSession) : null;
    } catch {
      return null;
    }
  });

  const persist = (session: UserSession | null) => {
    setUser(session);
    try {
      if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors in restricted contexts
    }
  };

  const login = (email: string, password: string): UserSession | null => {
    const match = MOCK_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
    );
    if (!match) return null;
    const session: UserSession = { name: match.name, email: match.email, role: match.role };
    persist(session);
    return session;
  };

  const loginAs = (role: UserRole): UserSession | null => {
    const match = MOCK_ACCOUNTS.find((a) => a.role === role);
    if (!match) return null;
    const session: UserSession = { name: match.name, email: match.email, role: match.role };
    persist(session);
    return session;
  };

  const logout = () => persist(null);

  return (
    <UserContext.Provider value={{ user, login, loginAs, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
