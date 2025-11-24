import type { Config } from 'drizzle-kit';
import { getDatabaseCredentials } from './src/config/database';

const { host, port, database, username, password } =
  getDatabaseCredentials(false);

export default {
  schema: './src/db/schema/index.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host,
    port,
    user: username,
    password,
    database,
  },
  verbose: true,
  strict: true,
} satisfies Config;
