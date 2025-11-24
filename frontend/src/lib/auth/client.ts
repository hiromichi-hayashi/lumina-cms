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
 * - デフォルト: http://localhost:3001/api/auth
 * - 環境変数で変更可能: NEXT_PUBLIC_API_URL
 *
 * NOTE: baseURLはバックエンドのBETTER_AUTH_BASE_PATHと一致させる必要があります
 * バックエンド設定: BETTER_AUTH_BASE_PATH=/api/auth
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/auth`
    : 'http://localhost:3001/api/auth',
});

/**
 * 認証関数とフックをエクスポート
 */
export const { signIn, signUp, signOut, useSession, $Infer } = authClient;
