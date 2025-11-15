import { pgTable, serial, integer, text, varchar, timestamp, uuid } from 'drizzle-orm/pg-core';
import { commentStatusEnum } from './enums';
import { blogPosts } from './blogPosts';
import { users } from './users';

/**
 * t_comments - コメントテーブル
 */
export const comments = pgTable('t_comments', {
  id: serial('id').primaryKey(),
  postId: integer('post_id')
    .notNull()
    .references(() => blogPosts.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id),
  parentId: integer('parent_id').references((): any => comments.id, { onDelete: 'cascade' }), // 返信の場合
  authorName: varchar('author_name', { length: 100 }).notNull(),
  authorEmail: varchar('author_email', { length: 255 }),
  content: text('content').notNull(),
  status: commentStatusEnum('status').default('pending').notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: varchar('user_agent', { length: 500 }),
  reviewedBy: uuid('reviewed_by').references(() => users.id),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
