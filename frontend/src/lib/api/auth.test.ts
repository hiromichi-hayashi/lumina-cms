/**
 * auth API client テスト
 */

import { signIn, signOut, getSession } from './auth';

// fetch のモック
global.fetch = jest.fn();

describe('auth API client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('signIn 関数', () => {
    it('正常なリクエスト: 正しいリクエストボディとヘッダーでAPIが呼ばれること', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          user: { id: 1, email: 'test@example.com', name: 'Test', role: 'member' },
        }),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await signIn({ email: 'test@example.com', password: 'Password123' });

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/signin',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: 'test@example.com', password: 'Password123' }),
          credentials: 'include',
        }),
      );
    });

    it('成功レスポンス: 成功時にユーザー情報が返されること', async () => {
      const mockUser = { id: 1, email: 'test@example.com', name: 'Test', role: 'member' };
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ user: mockUser }),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await signIn({ email: 'test@example.com', password: 'Password123' });

      expect(result).toEqual({ user: mockUser });
    });

    it('エラーレスポンス: エラー時に例外がスローされること', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ message: 'Invalid credentials' }),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(
        signIn({ email: 'test@example.com', password: 'WrongPassword' }),
      ).rejects.toThrow('Invalid credentials');
    });

    it('ネットワークエラー: ネットワークエラー時に例外がスローされること', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(signIn({ email: 'test@example.com', password: 'Password123' })).rejects.toThrow(
        'Network error',
      );
    });
  });

  describe('signOut 関数', () => {
    it('正常なリクエスト: 正しいメソッドとヘッダーでAPIが呼ばれること', async () => {
      const mockResponse = {
        ok: true,
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await signOut();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/signout',
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
        }),
      );
    });

    it('成功レスポンス: 成功時に正常終了すること', async () => {
      const mockResponse = {
        ok: true,
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(signOut()).resolves.toBeUndefined();
    });

    it('エラーレスポンス: エラー時に例外がスローされること', async () => {
      const mockResponse = {
        ok: false,
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(signOut()).rejects.toThrow('ログアウトに失敗しました');
    });
  });

  describe('getSession 関数', () => {
    it('正常なリクエスト: 正しいメソッドとヘッダーでAPIが呼ばれること', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          user: { id: 1, email: 'test@example.com', name: 'Test', role: 'member' },
        }),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await getSession();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/session',
        expect.objectContaining({
          credentials: 'include',
        }),
      );
    });

    it('成功レスポンス: 成功時にセッション情報が返されること', async () => {
      const mockUser = { id: 1, email: 'test@example.com', name: 'Test', role: 'member' };
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ user: mockUser }),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await getSession();

      expect(result).toEqual({ user: mockUser });
    });

    it('未認証レスポンス: 未認証時に{ user: null }が返されること', async () => {
      const mockResponse = {
        ok: false,
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await getSession();

      expect(result).toEqual({ user: null });
    });
  });
});
