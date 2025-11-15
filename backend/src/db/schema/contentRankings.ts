import { pgTable, serial, integer, varchar, date } from 'drizzle-orm/pg-core';
import { contentTypeEnum } from './enums';

/**
 * t_content_rankings - コンテンツランキングテーブル
 */
export const contentRankings = pgTable('t_content_rankings', {
  id: serial('id').primaryKey(),
  contentType: contentTypeEnum('content_type').notNull(),
  contentId: integer('content_id').notNull(), // blog_posts.id or announcements.id
  period: varchar('period', { length: 20 }).notNull(), // daily, weekly, monthly, yearly
  periodDate: date('period_date').notNull(), // YYYY-MM-DD形式
  rank: integer('rank').notNull(),
  viewCount: integer('view_count').default(0).notNull(),
  likeCount: integer('like_count').default(0).notNull(),
  commentCount: integer('comment_count').default(0).notNull(),
  score: integer('score').default(0).notNull(), // 総合スコア
});

export type ContentRanking = typeof contentRankings.$inferSelect;
export type NewContentRanking = typeof contentRankings.$inferInsert;
