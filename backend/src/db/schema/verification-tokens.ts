import { pgTable, text, timestamp, index, uuid } from 'drizzle-orm/pg-core';

export const verificationTokens = pgTable(
  's_verification_tokens',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)],
);

// 型定義
export type VerificationToken = typeof verificationTokens.$inferSelect;
export type NewVerificationToken = typeof verificationTokens.$inferInsert;
