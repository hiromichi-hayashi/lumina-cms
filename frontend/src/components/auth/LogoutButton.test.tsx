/**
 * LogoutButton コンポーネント テスト
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LogoutButton } from './LogoutButton';
import * as useAuthHook from '@/hooks/useAuth';

// useAuth フックのモック
jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

describe('LogoutButton', () => {
  const mockSignOut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('レンダリング', () => {
    it('基本レンダリング: LogoutButtonが正常にレンダリングされること', () => {
      (useAuthHook.useAuth as jest.Mock).mockReturnValue({
        signOut: mockSignOut,
        loading: false,
        user: { id: 1, email: 'test@example.com', name: 'Test', role: 'member' },
        signIn: jest.fn(),
        isAuthenticated: true,
        isAdmin: false,
        isMember: true,
      });

      render(<LogoutButton />);

      const button = screen.getByRole('button', { name: /ログアウト/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('ログアウト');
      expect(button).toHaveAttribute('aria-label', 'ログアウト');

      // LogOutアイコンが表示されていることを確認（aria-hiddenで隠されている）
      const icon = button.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('クリック処理', () => {
    it('クリック時にサインアウト: ボタンクリック時にsignOutが呼ばれること', async () => {
      const user = userEvent.setup();
      (useAuthHook.useAuth as jest.Mock).mockReturnValue({
        signOut: mockSignOut,
        loading: false,
        user: { id: 1, email: 'test@example.com', name: 'Test', role: 'member' },
        signIn: jest.fn(),
        isAuthenticated: true,
        isAdmin: false,
        isMember: true,
      });

      render(<LogoutButton />);

      const button = screen.getByRole('button', { name: /ログアウト/i });
      await user.click(button);

      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });

    it('ローディング中は無効: loading=trueの時にボタンが無効化されること', () => {
      (useAuthHook.useAuth as jest.Mock).mockReturnValue({
        signOut: mockSignOut,
        loading: true,
        user: { id: 1, email: 'test@example.com', name: 'Test', role: 'member' },
        signIn: jest.fn(),
        isAuthenticated: true,
        isAdmin: false,
        isMember: true,
      });

      render(<LogoutButton />);

      const button = screen.getByRole('button', { name: /ログアウト/i });
      expect(button).toBeDisabled();
    });
  });
});
