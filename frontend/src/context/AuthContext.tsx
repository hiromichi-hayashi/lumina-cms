'use client';

/**
 * 認証Context
 *
 * アプリ全体で認証状態を管理
 */

import { createContext, useContext, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider
 *
 * 認証状態を提供するプロバイダー
 * 将来的にBetter Authと統合
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // TODO: Better Authと統合
  const value: AuthContextType = {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    signIn: async () => {
      throw new Error('Not implemented');
    },
    signOut: async () => {
      throw new Error('Not implemented');
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth Hook
 *
 * 認証状態を取得するカスタムフック
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
