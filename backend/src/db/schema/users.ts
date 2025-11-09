import { pgTable, uuid, varchar, timestamp, boolean, integer, pgEnum } from 'drizzle-orm/pg-core';

// ユーザーロールENUM
export const userRoleEnum = pgEnum('user_role', ['admin', 'member']);

// ユーザーテーブル
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: timestamp('email_verified', { withTimezone: true }),
  password: varchar('password', { length: 255 }),
  name: varchar('name', { length: 100 }),
  image: varchar('image', { length: 500 }), // Better Auth標準フィールド名に変更
  role: userRoleEnum('role').default('member').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  loginAttempts: integer('login_attempts').default(0).notNull(),
  lockedUntil: timestamp('locked_until', { withTimezone: true }),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 型エクスポート
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
