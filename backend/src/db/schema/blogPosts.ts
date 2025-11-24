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
import { users } from './users';
import { categories } from './categories';

/**
 * t_blog_posts - ブログ記事テーブル
 */
export const blogPosts = pgTable('t_blog_posts', {
  id: serial('id').primaryKey(),
  contentCode: varchar('content_code', { length: 10 }).notNull().unique(), // 1XXXXXX
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 200 }).notNull(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  categoryId: integer('category_id')
    .notNull()
    .references(() => categories.id),
  authorId: uuid('author_id')
    .notNull()
    .references(() => users.id),
  featuredImageUrl: varchar('featured_image_url', { length: 500 }),
  isPublished: boolean('is_published').default(false).notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  readingTime: integer('reading_time').default(5).notNull(), // 分
  viewCount: integer('view_count').default(0).notNull(),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }), // 論理削除
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;
