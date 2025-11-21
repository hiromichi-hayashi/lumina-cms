/**
 * 認証API クライアント
 *
 * バックエンドの認証APIと通信するクライアント関数
 */

import { SignInRequest, SignInResponse, Session } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * ログイン
 */
export async function signIn(credentials: SignInRequest): Promise<SignInResponse> {
  const res = await fetch(`${API_URL}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
    credentials: 'include', // Cookie送信
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'ログインに失敗しました' }));
    throw new Error(error.message || 'ログインに失敗しました');
  }

  return res.json();
}

/**
 * ログアウト
 */
export async function signOut(): Promise<void> {
  const res = await fetch(`${API_URL}/auth/signout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('ログアウトに失敗しました');
  }
}

/**
 * セッション取得
 */
export async function getSession(): Promise<Session> {
  const res = await fetch(`${API_URL}/auth/session`, {
    credentials: 'include',
  });

  if (!res.ok) {
    return { user: null };
  }

  return res.json();
}
