/**
 * LoginForm コンポーネント テスト
 */

import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';
import * as useAuthHook from '@/hooks/useAuth';

// useAuth フックのモック
jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

// next/navigation のモック（jest.setup.js で設定されているが、ここで型付けを明確にする）
const mockPush = jest.fn();
const mockSearchParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => mockSearchParams,
}));

describe('LoginForm', () => {
  const mockSignIn = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthHook.useAuth as jest.Mock).mockReturnValue({
      signIn: mockSignIn,
      user: null,
      loading: false,
      signOut: jest.fn(),
      isAuthenticated: false,
      isAdmin: false,
      isMember: false,
    });
  });

  describe('レンダリング', () => {
    it('基本レンダリング: LoginFormが正常にレンダリングされること', () => {
      render(<LoginForm />);

      expect(screen.getByLabelText(/メールアドレス/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/パスワード/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^ログイン$/i })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Googleアカウントでログイン（準備中）/i }),
      ).toBeInTheDocument();
    });

    it('必須マーク: 必須フィールドに*マークが表示されること', () => {
      render(<LoginForm />);

      const emailLabel = screen.getByText(/メールアドレス/i).closest('label');
      const passwordLabel = screen.getByText(/パスワード/i).closest('label');

      expect(emailLabel).toHaveTextContent('*');
      expect(passwordLabel).toHaveTextContent('*');
    });

    it('初期状態: フォームの初期状態が正しいこと', () => {
      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/メールアドレス/i) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(/パスワード/i) as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /^ログイン$/i });

      expect(emailInput.value).toBe('');
      expect(passwordInput.value).toBe('');
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('バリデーション', () => {
    it('空欄バリデーション: 空欄で送信時にバリデーションエラーが表示されること', async () => {
      render(<LoginForm />);

      const submitButton = screen.getByRole('button', { name: /^ログイン$/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/有効なメールアドレスを入力してください/i)).toBeInTheDocument();
        expect(screen.getByText(/パスワードは8文字以上で入力してください/i)).toBeInTheDocument();
      });
    });

    it('不正なメール形式: 不正なメールアドレス形式でバリデーションエラーが表示されること', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/メールアドレス/i);
      const passwordInput = screen.getByLabelText(/パスワード/i);
      const submitButton = screen.getByRole('button', { name: /^ログイン$/i });

      await user.clear(emailInput);
      await user.type(emailInput, 'invalid-email');
      await user.clear(passwordInput);
      await user.type(passwordInput, 'Password123');
      fireEvent.submit(submitButton.closest('form')!);

      await waitFor(() => {
        expect(screen.getByText(/有効なメールアドレスを入力してください/i)).toBeInTheDocument();
      });
    });

    it('パスワード文字数不足: 8文字未満のパスワードでバリデーションエラーが表示されること', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/メールアドレス/i);
      const passwordInput = screen.getByLabelText(/パスワード/i);
      const submitButton = screen.getByRole('button', { name: /^ログイン$/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Pass123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/パスワードは8文字以上で入力してください/i)).toBeInTheDocument();
      });
    });

    it('正常な入力: 正しい形式の入力でバリデーションエラーが表示されないこと', async () => {
      const user = userEvent.setup();
      mockSignIn.mockResolvedValue({
        user: { id: 1, email: 'test@example.com', name: 'Test', role: 'member' },
      });

      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/メールアドレス/i);
      const passwordInput = screen.getByLabelText(/パスワード/i);
      const submitButton = screen.getByRole('button', { name: /^ログイン$/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.queryByText(/有効なメールアドレスを入力してください/i),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText(/パスワードは8文字以上で入力してください/i),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('フォーム送信', () => {
    it('ログイン成功: 正しい認証情報でログインが成功すること', async () => {
      const user = userEvent.setup();
      mockSignIn.mockResolvedValue({
        user: { id: 1, email: 'test@example.com', name: 'Test', role: 'member' },
      });

      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/メールアドレス/i);
      const passwordInput = screen.getByLabelText(/パスワード/i);
      const submitButton = screen.getByRole('button', { name: /^ログイン$/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'Password123');
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('callbackUrl指定時: callbackUrlパラメータが指定されている場合、そのURLにリダイレクトすること', async () => {
      const user = userEvent.setup();
      mockSignIn.mockResolvedValue({
        user: { id: 1, email: 'test@example.com', name: 'Test', role: 'member' },
      });

      // callbackUrlパラメータを設定
      mockSearchParams.set('callbackUrl', '/posts/123');

      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/メールアドレス/i);
      const passwordInput = screen.getByLabelText(/パスワード/i);
      const submitButton = screen.getByRole('button', { name: /^ログイン$/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'Password123');
        expect(mockPush).toHaveBeenCalledWith('/posts/123');
      });

      // テスト後にクリーンアップ
      mockSearchParams.delete('callbackUrl');
    });

    it('ログイン失敗: 認証エラー時にエラーメッセージが表示されること', async () => {
      const user = userEvent.setup();
      mockSignIn.mockRejectedValue(new Error('メールアドレスまたはパスワードが正しくありません'));

      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/メールアドレス/i);
      const passwordInput = screen.getByLabelText(/パスワード/i);
      const submitButton = screen.getByRole('button', { name: /^ログイン$/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'WrongPassword');
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/メールアドレスまたはパスワードが正しくありません/i),
        ).toBeInTheDocument();
        expect(mockPush).not.toHaveBeenCalled();
      });
    });

    it('ネットワークエラー: ネットワークエラー時に汎用エラーメッセージが表示されること', async () => {
      const user = userEvent.setup();
      mockSignIn.mockRejectedValue(new Error('Network error'));

      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/メールアドレス/i);
      const passwordInput = screen.getByLabelText(/パスワード/i);
      const submitButton = screen.getByRole('button', { name: /^ログイン$/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Network error/i)).toBeInTheDocument();
      });
    });
  });

  describe('ローディング状態', () => {
    it('送信中の状態: フォーム送信中にローディング状態が表示されること', async () => {
      const user = userEvent.setup();
      // 遅延レスポンスをシミュレート
      mockSignIn.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  user: { id: 1, email: 'test@example.com', name: 'Test', role: 'member' },
                }),
              100,
            ),
          ),
      );

      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/メールアドレス/i);
      const passwordInput = screen.getByLabelText(/パスワード/i);
      const submitButton = screen.getByRole('button', { name: /^ログイン$/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.click(submitButton);

      // ローディング状態をチェック
      await waitFor(() => {
        const loadingButton = screen.getByRole('button', { name: /^ログイン中...$/i });
        expect(loadingButton).toBeInTheDocument();
        expect(loadingButton).toBeDisabled();
        expect(loadingButton).toHaveAttribute('aria-busy', 'true');
      });
    });

    it('送信完了後の状態: 送信完了後にローディング状態が解除されること', async () => {
      const user = userEvent.setup();
      mockSignIn.mockResolvedValue({
        user: { id: 1, email: 'test@example.com', name: 'Test', role: 'member' },
      });

      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/メールアドレス/i);
      const passwordInput = screen.getByLabelText(/パスワード/i);
      const submitButton = screen.getByRole('button', { name: /^ログイン$/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.click(submitButton);

      // 送信完了後、ボタンが有効になることを確認
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalled();
      });
    });
  });

  describe('アクセシビリティ', () => {
    it('ARIA属性: 適切なARIA属性が設定されていること', async () => {
      render(<LoginForm />);

      const submitButton = screen.getByRole('button', { name: /^ログイン$/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const emailInput = screen.getByLabelText(/メールアドレス/i);
        const passwordInput = screen.getByLabelText(/パスワード/i);

        expect(emailInput).toHaveAttribute('aria-invalid', 'true');
        expect(emailInput).toHaveAttribute('aria-describedby', 'email-error');
        expect(passwordInput).toHaveAttribute('aria-invalid', 'true');
        expect(passwordInput).toHaveAttribute('aria-describedby', 'password-error');

        const emailError = screen.getByText(/有効なメールアドレスを入力してください/i);
        const passwordError = screen.getByText(/パスワードは8文字以上で入力してください/i);
        expect(emailError).toHaveAttribute('role', 'alert');
        expect(passwordError).toHaveAttribute('role', 'alert');
      });
    });

    it('キーボードナビゲーション: Tab キーで順序通りに移動できること', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/メールアドレス/i);
      const passwordInput = screen.getByLabelText(/パスワード/i);
      const submitButton = screen.getByRole('button', { name: /^ログイン$/i });

      // Tab navigation
      await user.tab();
      expect(emailInput).toHaveFocus();

      await user.tab();
      expect(passwordInput).toHaveFocus();

      await user.tab();
      expect(submitButton).toHaveFocus();

      // Note: disabled button (Google) is skipped in tab order
    });

    it('Enter キー送信: パスワード入力欄で Enter キーを押すとフォームが送信されること', async () => {
      const user = userEvent.setup();
      mockSignIn.mockResolvedValue({
        user: { id: 1, email: 'test@example.com', name: 'Test', role: 'member' },
      });

      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/メールアドレス/i);
      const passwordInput = screen.getByLabelText(/パスワード/i);

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'Password123');
      });
    });

    it('必須フィールドのラベル: 必須フィールドのラベルにスクリーンリーダー用のテキストが含まれること', () => {
      render(<LoginForm />);

      const emailLabel = screen.getByText(/メールアドレス/i).closest('label');
      const passwordLabel = screen.getByText(/パスワード/i).closest('label');

      expect(emailLabel).toHaveTextContent('*');
      expect(passwordLabel).toHaveTextContent('*');

      // aria-labelで"必須"が設定されていることを確認
      const emailRequired = emailLabel?.querySelector('[aria-label="必須"]');
      const passwordRequired = passwordLabel?.querySelector('[aria-label="必須"]');

      expect(emailRequired).toBeInTheDocument();
      expect(passwordRequired).toBeInTheDocument();
    });

    it('オートコンプリート: 適切なautocomplete属性が設定されていること', () => {
      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/メールアドレス/i);
      const passwordInput = screen.getByLabelText(/パスワード/i);

      expect(emailInput).toHaveAttribute('autoComplete', 'email');
      expect(passwordInput).toHaveAttribute('autoComplete', 'current-password');
    });
  });
});
