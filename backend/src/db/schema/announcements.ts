import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { colorThemeEnum } from './enums';
import { users } from './users';

/**
 * t_announcements - お知らせテーブル
 */
export const announcements = pgTable('t_announcements', {
  id: serial('id').primaryKey(),
  contentCode: varchar('content_code', { length: 10 }).notNull().unique(), // 2XXXXXX
  title: varchar('title', { length: 200 }).notNull(),
  content: text('content').notNull(),
  colorTheme: colorThemeEnum('color_theme').default('blue').notNull(),
  authorId: uuid('author_id')
    .notNull()
    .references(() => users.id),
  priority: integer('priority').default(0).notNull(), // 0: 通常, 1: 重要, 2: 緊急
  isPublished: boolean('is_published').default(false).notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  expiresAt: timestamp('expires_at', { withTimezone: true }),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }), // 論理削除
});

export type Announcement = typeof announcements.$inferSelect;
export type NewAnnouncement = typeof announcements.$inferInsert;
