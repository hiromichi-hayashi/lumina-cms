import { pgTable, serial, integer, timestamp } from 'drizzle-orm/pg-core';
import { blogPosts } from './blogPosts';
import { labels } from './labels';

/**
 * r_post_labels - 記事ラベル中間テーブル
 */
export const postLabels = pgTable('r_post_labels', {
  id: serial('id').primaryKey(),
  postId: integer('post_id')
    .notNull()
    .references(() => blogPosts.id, { onDelete: 'cascade' }),
  labelId: integer('label_id')
    .notNull()
    .references(() => labels.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type PostLabel = typeof postLabels.$inferSelect;
export type NewPostLabel = typeof postLabels.$inferInsert;
