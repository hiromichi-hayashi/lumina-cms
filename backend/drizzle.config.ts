import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || '5432';
const dbDatabase = process.env.DB_DATABASE || 'lumina_cms';
const dbUsername = process.env.DB_USERNAME || 'lumina';
const dbPassword = process.env.DB_PASSWORD || 'lumina_dev';

export default {
  schema: './src/db/schema/index.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: dbHost,
    port: Number(dbPort),
    user: dbUsername,
    password: dbPassword,
    database: dbDatabase,
  },
  verbose: true,
  strict: true,
} satisfies Config;
