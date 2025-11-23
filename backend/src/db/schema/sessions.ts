import { pgTable, text, timestamp, index, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';

export const sessions = pgTable(
  's_sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    token: text('token').notNull().unique(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('session_userId_idx').on(table.userId)],
);

// 型定義
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
