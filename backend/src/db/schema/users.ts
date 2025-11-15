import { pgTable, uuid, varchar, timestamp, boolean, integer } from 'drizzle-orm/pg-core';
import { userRoleEnum } from './enums';

/**
 * m_users - ユーザーテーブル (NextAuth Users)
 */
export const users = pgTable('m_users', {
  // NextAuth標準フィールド
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: timestamp('email_verified', { withTimezone: true }),
  password: varchar('password', { length: 255 }),
  name: varchar('name', { length: 100 }),
  image: varchar('image', { length: 500 }),

  // Lumina CMS拡張フィールド
  role: userRoleEnum('role').default('member').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  loginAttempts: integer('login_attempts').default(0).notNull(),
  lockedUntil: timestamp('locked_until', { withTimezone: true }),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),

  // タイムスタンプ
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
