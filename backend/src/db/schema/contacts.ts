import { pgTable, serial, varchar, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';

/**
 * t_contacts - お問い合わせテーブル
 */
export const contacts = pgTable('t_contacts', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 200 }).notNull(),
  message: text('message').notNull(),
  status: varchar('status', { length: 20 }).default('pending').notNull(), // pending, replied, closed
  repliedAt: timestamp('replied_at', { withTimezone: true }),
  repliedBy: uuid('replied_by').references(() => users.id),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;
