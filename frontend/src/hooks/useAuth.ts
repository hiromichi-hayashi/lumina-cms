/**
 * 認証フック (Better Auth統合版)
 *
 * Better Authの公式Reactクライアントを使用してセッション状態管理と
 * ログイン/ログアウト機能を提供します。
 *
 * Better Authクライアントの機能:
 * - 自動セッション管理
 * - 型安全なAPIコール
 * - リアクティブなセッション更新
 * - CSRF保護
 */

'use client';

import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/client';
import type { UserRole } from '@/lib/auth/types';

export function useAuth() {
  const router = useRouter();

  // Better Authの公式useSessionフックを使用
  // セッション情報を自動的に取得・更新
  const { data: session, isPending, error } = authClient.useSession();

  /**
   * メール+パスワードでサインイン
   */
  const signIn = async (email: string, password: string) => {
    try {
      const response = await authClient.signIn.email(
        {
          email,
          password,
        },
        {
          onError: (ctx) => {
            // エラーハンドリング
            console.error('Sign in error:', ctx.error);
          },
        },
      );

      // エラーチェック
      if (response.error) {
        const errorMessage = response.error.message || 'サインインに失敗しました';
        throw new Error(errorMessage);
      }

      // データの存在確認
      if (!response.data) {
        throw new Error('サインインに失敗しました');
      }

      return response.data;
    } catch (error) {
      // エラーを適切に再スロー
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('サインインに失敗しました');
    }
  };

  /**
   * メール+パスワードで新規登録
   */
  const signUp = async (email: string, password: string, name?: string) => {
    const response = await authClient.signUp.email(
      {
        email,
        password,
        name: name || email.split('@')[0], // nameが未指定の場合はemailのローカル部分を使用
      },
      {
        onError: (ctx) => {
          console.error('Sign up error:', ctx.error);
          throw new Error(ctx.error.message || '新規登録に失敗しました');
        },
      },
    );

    if (response.error) {
      throw new Error(response.error.message || '新規登録に失敗しました');
    }

    return response.data;
  };

  /**
   * サインアウト
   */
  const signOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/login');
        },
        onError: (ctx) => {
          console.error('Sign out error:', ctx.error);
        },
      },
    });
  };

  // ユーザー情報
  const user = session?.user ?? null;

  // ロール判定
  // TODO: Better Authのバックエンド実装でroleを含める必要があります
  const userWithRole = user as { role?: UserRole } | null;
  const isAdmin = userWithRole?.role === 'admin';
  const isEditor = userWithRole?.role === 'editor';
  const isMember = userWithRole?.role === 'member';

  return {
    user,
    loading: isPending,
    error,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
    isAdmin,
    isEditor,
    isMember,
    session,
  };
}
