import { registerAs } from '@nestjs/config';

export interface AppConfig {
  port: number;
  nodeEnv: string;
  logLevel: string;
}

export default registerAs(
  'app',
  (): AppConfig => ({
    port: parseInt(process.env.APP_PORT, 10) || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'debug',
  }),
);
