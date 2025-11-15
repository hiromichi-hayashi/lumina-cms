import { createAuthClient } from 'better-auth/react';

/**
 * Better Auth クライアント設定
 *
 * Lumina CMSの認証アーキテクチャ:
 * - 認証処理はすべてバックエンド(NestJS)で実装
 * - フロントエンドは認証APIを呼び出すクライアントのみ
 * - セッション管理、トークン発行、検証はバックエンドが担当
 *
 * バックエンドのBetter Auth APIエンドポイント:
 * - デフォルト: http://localhost:3001/api
 * - 環境変数で変更可能: NEXT_PUBLIC_API_URL
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
});

/**
 * 認証関数とフックをエクスポート
 */
export const { signIn, signUp, signOut, useSession, $Infer } = authClient;
