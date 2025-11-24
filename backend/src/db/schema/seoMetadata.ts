import { pgTable, serial, integer, varchar, text, timestamp, unique } from 'drizzle-orm/pg-core';
import { contentTypeEnum } from './enums';

/**
 * m_seo_metadata - SEOメタデータテーブル
 */
export const seoMetadata = pgTable(
  'm_seo_metadata',
  {
    id: serial('id').primaryKey(),
    contentType: contentTypeEnum('content_type').notNull(),
    contentId: integer('content_id').notNull(), // blog_posts.id or announcements.id
    metaTitle: varchar('meta_title', { length: 60 }),
    metaDescription: text('meta_description'), // ~160文字推奨
    ogTitle: varchar('og_title', { length: 60 }),
    ogDescription: text('og_description'),
    ogImage: varchar('og_image', { length: 500 }),
    twitterCard: varchar('twitter_card', { length: 20 }).default('summary_large_image'),
    canonicalUrl: varchar('canonical_url', { length: 500 }),
    keywords: text('keywords'), // カンマ区切り

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    // 1コンテンツに1つのSEOメタデータのみ
    uniqueContent: unique().on(table.contentType, table.contentId),
  }),
);

export type SeoMetadata = typeof seoMetadata.$inferSelect;
export type NewSeoMetadata = typeof seoMetadata.$inferInsert;
