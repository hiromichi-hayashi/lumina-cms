import { pgTable, serial, varchar, boolean, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';

/**
 * m_ng_words - NGワードテーブル
 */
export const ngWords = pgTable('m_ng_words', {
  id: serial('id').primaryKey(),
  word: varchar('word', { length: 100 }).notNull().unique(),
  isActive: boolean('is_active').default(true).notNull(),
  createdBy: uuid('created_by')
    .notNull()
    .references(() => users.id),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type NgWord = typeof ngWords.$inferSelect;
export type NewNgWord = typeof ngWords.$inferInsert;
