/**
 * useAuth フック テスト
 */

import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';
import { authClient } from '@/lib/auth/client';

// Better Auth クライアントのモック
jest.mock('@/lib/auth/client', () => ({
  authClient: {
    signIn: {
      email: jest.fn(),
    },
    signUp: {
      email: jest.fn(),
    },
    signOut: jest.fn(),
    useSession: jest.fn(),
  },
}));

// モック関数の型安全なアクセス
const mockUseSession = authClient.useSession as jest.MockedFunction<typeof authClient.useSession>;
const mockSignInEmail = authClient.signIn.email as jest.MockedFunction<
  typeof authClient.signIn.email
>;
const mockSignOut = authClient.signOut as jest.MockedFunction<typeof authClient.signOut>;

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
    // デフォルトのモック返り値
    mockUseSession.mockReturnValue({
      data: null,
      isPending: false,
      error: null,
    });
  });

  describe('セッション読み込み', () => {
    it('初期状態: マウント時にloading=trueであること', () => {
      mockUseSession.mockReturnValue({
        data: null,
        isPending: true, // loading状態
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      expect(result.current.loading).toBe(true);
      expect(result.current.user).toBeNull();
    });

    it('セッション取得成功: セッション取得成功時にユーザー情報が設定されること', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'member',
      };

      mockUseSession.mockReturnValue({
        data: { user: mockUser },
        isPending: false,
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      expect(result.current.loading).toBe(false);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('セッション取得失敗: セッション取得失敗時にuser=nullになること', async () => {
      mockUseSession.mockReturnValue({
        data: null,
        isPending: false,
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      expect(result.current.loading).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('セッション取得エラー: セッション取得時のエラーハンドリングが正しいこと', async () => {
      const mockError = new Error('Network error');

      mockUseSession.mockReturnValue({
        data: null,
        isPending: false,
        error: mockError,
      });

      const { result } = renderHook(() => useAuth());

      expect(result.current.loading).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBe(mockError);
    });
  });

  describe('サインイン', () => {
    it('サインイン成功: サインイン成功時にユーザー情報が設定されること', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'member',
      };

      mockUseSession.mockReturnValue({
        data: null,
        isPending: false,
        error: null,
      });

      mockSignInEmail.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      let signInResult;
      await act(async () => {
        signInResult = await result.current.signIn('test@example.com', 'Password123');
      });

      expect(mockSignInEmail).toHaveBeenCalledWith(
        {
          email: 'test@example.com',
          password: 'Password123',
        },
        expect.any(Object),
      );
      expect(signInResult).toEqual({ user: mockUser });
    });

    it('サインイン失敗: サインイン失敗時に例外がスローされること', async () => {
      mockUseSession.mockReturnValue({
        data: null,
        isPending: false,
        error: null,
      });

      mockSignInEmail.mockResolvedValue({
        data: null,
        error: { message: 'Invalid credentials' },
      });

      const { result } = renderHook(() => useAuth());

      await expect(
        act(async () => {
          await result.current.signIn('test@example.com', 'WrongPassword');
        }),
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('サインアウト', () => {
    it('サインアウト成功: サインアウト成功時にuser=nullになること', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'member',
      };

      mockUseSession.mockReturnValue({
        data: { user: mockUser },
        isPending: false,
        error: null,
      });

      // signOutをモックして、fetchOptionsのonSuccessを呼び出す
      mockSignOut.mockImplementation(async (options?: { fetchOptions?: { onSuccess?: () => void } }) => {
        if (options?.fetchOptions?.onSuccess) {
          options.fetchOptions.onSuccess();
        }
      });

      const { result } = renderHook(() => useAuth());

      expect(result.current.user).toEqual(mockUser);

      await act(async () => {
        await result.current.signOut();
      });

      expect(mockSignOut).toHaveBeenCalled();
      // signOutは内部でonSuccessコールバックでrouter.pushを呼ぶ
      expect(mockPush).toHaveBeenCalledWith('/login');
    });

    it('サインアウト失敗: サインアウト失敗時に例外がスローされること', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'member',
      };

      mockUseSession.mockReturnValue({
        data: { user: mockUser },
        isPending: false,
        error: null,
      });

      // signOutがエラーを投げるようにモック
      mockSignOut.mockRejectedValue(new Error('Signout failed'));

      const { result } = renderHook(() => useAuth());

      await expect(
        act(async () => {
          await result.current.signOut();
        }),
      ).rejects.toThrow('Signout failed');

      consoleErrorSpy.mockRestore();
    });
  });

  describe('権限判定', () => {
    it('admin権限判定: isAdminが正しく判定されること', async () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: 1,
            email: 'admin@example.com',
            name: 'Admin User',
            role: 'admin',
          },
        },
        isPending: false,
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      expect(result.current.loading).toBe(false);
      expect(result.current.isAdmin).toBe(true);
      expect(result.current.isMember).toBe(false);
    });

    it('member権限判定: isMemberが正しく判定されること', async () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: 1,
            email: 'member@example.com',
            name: 'Member User',
            role: 'member',
          },
        },
        isPending: false,
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      expect(result.current.loading).toBe(false);
      expect(result.current.isAdmin).toBe(false);
      expect(result.current.isMember).toBe(true);
    });

    it('未認証時の権限判定: 未認証時に権限フラグがfalseであること', async () => {
      mockUseSession.mockReturnValue({
        data: null,
        isPending: false,
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      expect(result.current.loading).toBe(false);
      expect(result.current.isAdmin).toBe(false);
      expect(result.current.isMember).toBe(false);
    });
  });
});
