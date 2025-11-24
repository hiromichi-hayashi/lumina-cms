import { pgTable, serial, integer, varchar, timestamp, uuid, unique } from 'drizzle-orm/pg-core';
import { contentTypeEnum } from './enums';
import { users } from './users';

/**
 * t_likes - いいねテーブル
 */
export const likes = pgTable(
  't_likes',
  {
    id: serial('id').primaryKey(),
    contentType: contentTypeEnum('content_type').notNull(),
    contentId: integer('content_id').notNull(), // blog_posts.id or announcements.id
    userId: uuid('user_id').references(() => users.id),
    sessionId: varchar('session_id', { length: 255 }), // 未ログインユーザー用
    ipAddress: varchar('ip_address', { length: 45 }),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    // ユニーク制約: 同じコンテンツに対して1ユーザー1いいねのみ
    uniqueUserLike: unique().on(table.contentType, table.contentId, table.userId),
    uniqueSessionLike: unique().on(table.contentType, table.contentId, table.sessionId),
  }),
);

export type Like = typeof likes.$inferSelect;
export type NewLike = typeof likes.$inferInsert;
