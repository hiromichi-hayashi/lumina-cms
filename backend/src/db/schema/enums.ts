import { pgEnum } from 'drizzle-orm/pg-core';

/**
 * ユーザーロール
 * admin: 管理者
 * editor: 編集者
 * member: メンバー
 */
export const userRoleEnum = pgEnum('user_role', ['admin', 'editor', 'member']);

/**
 * カラーテーマ
 */
export const colorThemeEnum = pgEnum('color_theme', [
  'black',
  'white',
  'red',
  'blue',
  'yellow',
  'orange',
  'green',
  'purple',
  'pink',
  'light_blue',
]);

/**
 * コンテンツタイプ
 */
export const contentTypeEnum = pgEnum('content_type', ['blog_post', 'announcement']);

/**
 * コンテンツステータス
 */
export const contentStatusEnum = pgEnum('content_status', [
  'draft',
  'under_review',
  'published',
  'archived',
]);

/**
 * コメントステータス
 */
export const commentStatusEnum = pgEnum('comment_status', [
  'pending',
  'approved',
  'rejected',
  'spam',
]);
