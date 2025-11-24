import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../schema';
import { getDatabaseConnectionString } from '../../config/database';
import { seedUsers } from './users';

/**
 * シーダーメイン処理
 * 各エンティティのシーダーを順次実行
 */
async function seed() {
  // セキュリティ設定から定数として管理（src/config/security.ts参照）
  const bcryptRounds = 10;

  const connectionString = getDatabaseConnectionString(false);

  const client = postgres(connectionString);
  const db = drizzle(client, { schema });

  console.log('🌱 Seeding database...');
  console.log('');

  try {
    // ユーザーデータのシード
    await seedUsers(db, bcryptRounds);

    // 今後、他のシーダーを追加する場合はここに記述
    // await seedCategories(db);
    // await seedBlogPosts(db);
    // await seedComments(db);

    console.log('');
    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await client.end();
  }

  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
