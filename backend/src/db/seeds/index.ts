import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../schema';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

async function seed() {
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = process.env.DB_PORT || '5432';
  const dbDatabase = process.env.DB_DATABASE || 'lumina_cms';
  const dbUsername = process.env.DB_USERNAME || 'lumina';
  const dbPassword = process.env.DB_PASSWORD || 'lumina_dev';

  const connectionString = `postgres://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbDatabase}`;

  const client = postgres(connectionString);
  const db = drizzle(client, { schema });

  console.log('🌱 Seeding database...');

  // 管理者ユーザー作成
  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  await db
    .insert(schema.users)
    .values({
      email: 'admin@lumina-cms.local',
      password: hashedPassword,
      name: 'システム管理者',
      role: 'admin',
      isActive: true,
      emailVerified: new Date(),
    })
    .onConflictDoNothing();

  console.log('✅ Seeding completed!');

  await client.end();
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
