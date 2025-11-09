import { createAuthClient } from 'better-auth/react';

/**
 * Better Auth クライアント設定
 *
 * バックエンドのBetter Auth APIエンドポイントに接続します。
 */
export const authClient = createAuthClient({
  // バックエンドのBetter Auth APIのURL
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
});

/**
 * 認証関数とフックをエクスポート
 */
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  $Infer,
} = authClient;
