import { pgTable, serial, integer, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { contentTypeEnum } from './enums';
import { users } from './users';

/**
 * s_content_drafts - コンテンツ下書きテーブル
 */
export const contentDrafts = pgTable('s_content_drafts', {
  id: serial('id').primaryKey(),
  contentType: contentTypeEnum('content_type').notNull(),
  contentId: integer('content_id'), // 既存コンテンツの編集の場合
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  draftData: text('draft_data').notNull(), // JSON形式で保存

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type ContentDraft = typeof contentDrafts.$inferSelect;
export type NewContentDraft = typeof contentDrafts.$inferInsert;
