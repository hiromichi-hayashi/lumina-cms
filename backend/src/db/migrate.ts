import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const main = async () => {
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = process.env.DB_PORT || '5432';
  const dbDatabase = process.env.DB_DATABASE || 'lumina_cms';
  const dbUsername = process.env.DB_USERNAME || 'lumina';
  const dbPassword = process.env.DB_PASSWORD || 'lumina_dev';

  const connectionString = `postgres://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbDatabase}`;

  console.log('🔄 Running migrations...');

  const migrationClient = postgres(connectionString, { max: 1 });
  const db = drizzle(migrationClient);

  try {
    await migrate(db, { migrationsFolder: './src/db/migrations' });
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await migrationClient.end();
  }
};

main().catch((error) => {
  console.error('Migration script error:', error);
  process.exit(1);
});
