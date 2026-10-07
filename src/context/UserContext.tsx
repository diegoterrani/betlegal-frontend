import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserRole, UserSession } from '../types';
import { apiGet, apiSend } from '../lib/http';

export type Account = UserSession & { photo: string | null };

interface UserContextType {
  user: Account | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<Account>;
  logout: () => Promise<void>;
  saveProfile: (input: { name: string; photo: string | null }) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const ROLES: UserRole[] = ['client', 'operator', 'admin', 'super_admin'];

function asRole(value: string | undefined): UserRole {
  return ROLES.includes(value as UserRole) ? (value as UserRole) : 'client';
}

function toSession(raw: { email: string; name?: string; role?: string; photo?: string | null } | null | undefined): Account | null {
  if (!raw?.email) return null;
  return {
    email: raw.email,
    name: raw.name || raw.email.split('@')[0] || raw.email,
    role: asRole(raw.role),
    photo: raw.photo || null,
  };
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Account | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = async () => {
    const data = await apiGet<{ user: { email: string; name?: string; role?: string; photo?: string | null } | null }>('/api/v1/session');
    setUser(toSession(data.user));
  };

  useEffect(() => {
    let cancelled = false;
    refresh()
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => { cancelled = true; };
  }, []);

  const login = async (email: string, password: string): Promise<Account> => {
    await apiSend('/entrar/enviar', 'POST', { email, password, next: '/' });
    const data = await apiGet<{ user: { email: string; name?: string; role?: string; photo?: string | null } | null }>('/api/v1/session');
    const session = toSession(data.user);
    if (!session) throw new Error('A sessão não foi aberta.');
    setUser(session);
    return session;
  };

  const saveProfile = async (input: { name: string; photo: string | null }) => {
    await apiSend('/api/v1/profile', 'PATCH', { displayName: input.name, photo: input.photo });
    setUser((current) => current ? { ...current, name: input.name.trim(), photo: input.photo } : current);
  };

  const logout = async () => {
    try {
      await apiSend('/sair', 'POST', {});
    } catch {
      // A sessão local some mesmo se o BFF já tiver expirado o cookie.
    }
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, ready, login, logout, saveProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
