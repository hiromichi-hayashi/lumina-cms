/**
 * useAuth フック テスト
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from './useAuth';
import * as authApi from '@/lib/api/auth';

// better-auth/reactのモック（useAuthが依存しているため）
jest.mock('@/lib/auth/client', () => ({
  authClient: {
    signIn: { email: jest.fn() },
    signOut: jest.fn(),
    useSession: jest.fn(() => ({ data: null, isPending: false, error: null })),
  },
  signIn: jest.fn(),
  signOut: jest.fn(),
  useSession: jest.fn(() => ({ data: null, isPending: false, error: null })),
}));

// authApi のモック
jest.mock('@/lib/api/auth', () => ({
  signIn: jest.fn(() => Promise.resolve({ user: null })),
  signOut: jest.fn(() => Promise.resolve()),
  getSession: jest.fn(() => Promise.resolve({ user: null })),
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

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('セッション読み込み', () => {
    it('初期状態: マウント時にloading=trueであること', () => {
      (authApi.getSession as jest.Mock).mockImplementation(
        () => new Promise(() => {}), // 永遠に解決しないPromise
      );

      const { result } = renderHook(() => useAuth());

      expect(result.current.loading).toBe(true);
      expect(result.current.user).toBeNull();
    });

    it('セッション取得成功: セッション取得成功時にユーザー情報が設定されること', async () => {
      (authApi.getSession as jest.Mock).mockResolvedValue({
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          role: 'member',
        },
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'member',
      });
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('セッション取得失敗: セッション取得失敗時にuser=nullになること', async () => {
      (authApi.getSession as jest.Mock).mockResolvedValue({
        user: null,
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('セッション取得エラー: セッション取得時のエラーハンドリングが正しいこと', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (authApi.getSession as jest.Mock).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to load session:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });
  });

  describe('サインイン', () => {
    it('サインイン成功: サインイン成功時にユーザー情報が設定されること', async () => {
      (authApi.getSession as jest.Mock).mockResolvedValue({ user: null });
      (authApi.signIn as jest.Mock).mockResolvedValue({
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          role: 'member',
        },
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.signIn('test@example.com', 'Password123');
      });

      expect(result.current.user).toEqual({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'member',
      });
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('サインイン失敗: サインイン失敗時に例外がスローされること', async () => {
      (authApi.getSession as jest.Mock).mockResolvedValue({ user: null });
      (authApi.signIn as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.signIn('test@example.com', 'WrongPassword');
        }),
      ).rejects.toThrow('Invalid credentials');

      expect(result.current.user).toBeNull();
    });
  });

  describe('サインアウト', () => {
    it('サインアウト成功: サインアウト成功時にuser=nullになること', async () => {
      (authApi.getSession as jest.Mock).mockResolvedValue({
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          role: 'member',
        },
      });
      (authApi.signOut as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.user).toBeTruthy();
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(authApi.signOut).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
      expect(mockPush).toHaveBeenCalledWith('/login');
    });

    it('サインアウト失敗: サインアウト失敗時に例外がスローされること', async () => {
      (authApi.getSession as jest.Mock).mockResolvedValue({
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          role: 'member',
        },
      });
      (authApi.signOut as jest.Mock).mockRejectedValue(new Error('Signout failed'));

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.user).toBeTruthy();
      });

      await expect(
        act(async () => {
          await result.current.signOut();
        }),
      ).rejects.toThrow('Signout failed');
    });
  });

  describe('権限判定', () => {
    it('admin権限判定: isAdminが正しく判定されること', async () => {
      (authApi.getSession as jest.Mock).mockResolvedValue({
        user: {
          id: 1,
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
        },
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.isAdmin).toBe(true);
      expect(result.current.isMember).toBe(false);
    });

    it('member権限判定: isMemberが正しく判定されること', async () => {
      (authApi.getSession as jest.Mock).mockResolvedValue({
        user: {
          id: 1,
          email: 'member@example.com',
          name: 'Member User',
          role: 'member',
        },
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.isAdmin).toBe(false);
      expect(result.current.isMember).toBe(true);
    });

    it('未認証時の権限判定: 未認証時に権限フラグがfalseであること', async () => {
      (authApi.getSession as jest.Mock).mockResolvedValue({
        user: null,
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.isAdmin).toBe(false);
      expect(result.current.isMember).toBe(false);
    });
  });
});
