/**
 * AuthGuard コンポーネント テスト
 */

import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthGuard } from './AuthGuard';
import * as useAuthHook from '@/hooks/useAuth';

// useAuth フックのモック
jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

// next/navigation のモック
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
}));

describe('AuthGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('認証チェック', () => {
    it('未認証時のリダイレクト: 未認証時に/loginへリダイレクトされること', async () => {
      (useAuthHook.useAuth as jest.Mock).mockReturnValue({
        user: null,
        loading: false,
        signIn: jest.fn(),
        signOut: jest.fn(),
        isAuthenticated: false,
        isAdmin: false,
        isMember: false,
      });

      render(
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>,
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login');
      });

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('認証済み時の表示: 認証済み時に子コンポーネントが表示されること', () => {
      (useAuthHook.useAuth as jest.Mock).mockReturnValue({
        user: { id: 1, email: 'test@example.com', name: 'Test', role: 'member' },
        loading: false,
        signIn: jest.fn(),
        signOut: jest.fn(),
        isAuthenticated: true,
        isAdmin: false,
        isMember: true,
      });

      render(
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>,
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('権限チェック', () => {
    it('権限不足時のリダイレクト: 必要な権限がない時に/dashboardへリダイレクトされること', async () => {
      (useAuthHook.useAuth as jest.Mock).mockReturnValue({
        user: { id: 1, email: 'test@example.com', name: 'Test', role: 'member' },
        loading: false,
        signIn: jest.fn(),
        signOut: jest.fn(),
        isAuthenticated: true,
        isAdmin: false,
        isMember: true,
      });

      render(
        <AuthGuard requiredRole="admin">
          <div>Admin Content</div>
        </AuthGuard>,
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });

      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    });

    it('権限十分時の表示: 必要な権限がある時に子コンポーネントが表示されること', () => {
      (useAuthHook.useAuth as jest.Mock).mockReturnValue({
        user: { id: 1, email: 'admin@example.com', name: 'Admin', role: 'admin' },
        loading: false,
        signIn: jest.fn(),
        signOut: jest.fn(),
        isAuthenticated: true,
        isAdmin: true,
        isMember: false,
      });

      render(
        <AuthGuard requiredRole="admin">
          <div>Admin Content</div>
        </AuthGuard>,
      );

      expect(screen.getByText('Admin Content')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('ローディング状態', () => {
    it('ローディング中の表示: loading=trueの時にローディングスピナーが表示されること', () => {
      (useAuthHook.useAuth as jest.Mock).mockReturnValue({
        user: null,
        loading: true,
        signIn: jest.fn(),
        signOut: jest.fn(),
        isAuthenticated: false,
        isAdmin: false,
        isMember: false,
      });

      render(
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>,
      );

      // ローディングスピナーが表示されることを確認
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();

      // スクリーンリーダー用のテキストが含まれることを確認
      expect(screen.getByText('読み込み中...')).toBeInTheDocument();

      // 子コンポーネントは表示されない
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });
});
