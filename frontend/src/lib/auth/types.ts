/**
 * Better Auth 型定義
 *
 * Better Authのユーザー型を拡張する型定義
 * バックエンドのユーザースキーマと一致させる必要があります。
 */

/**
 * ロール型定義
 */
export type UserRole = 'admin' | 'editor' | 'member';

/**
 * ロールを含むユーザー型
 * Better Authのユーザー型を拡張
 */
export interface UserWithRole {
  id: string;
  email: string;
  name: string;
  role?: UserRole;
  image?: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
