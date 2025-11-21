/**
 * 認証関連の型定義
 */

/**
 * ユーザーロール
 */
export type UserRole = 'admin' | 'member';

/**
 * ユーザー情報
 */
export interface User {
  id: number;
  email: string;
  name: string | null;
  role: UserRole;
}

/**
 * セッション情報
 */
export interface Session {
  user: User | null;
}

/**
 * ログインリクエスト
 */
export interface SignInRequest {
  email: string;
  password: string;
}

/**
 * ログインレスポンス
 */
export interface SignInResponse {
  user: User;
}
