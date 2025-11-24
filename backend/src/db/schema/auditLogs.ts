import { pgTable, serial, varchar, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';

/**
 * l_audit_logs - 監査ログテーブル
 */
export const auditLogs = pgTable('l_audit_logs', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(), // create, update, delete, login, etc.
  entityType: varchar('entity_type', { length: 100 }), // users, blog_posts, categories, etc.
  entityId: varchar('entity_id', { length: 100 }),
  description: text('description'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: varchar('user_agent', { length: 500 }),
  metadata: text('metadata'), // JSON形式で追加情報を保存

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
