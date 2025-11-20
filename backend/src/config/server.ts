import { registerAs } from '@nestjs/config';

/**
 * CORS設定
 */
export interface CorsConfig {
  allowedOrigins: string[];
  credentials: boolean;
}

/**
 * Swagger設定
 */
export interface SwaggerConfig {
  enabled: boolean;
  title: string;
  description: string;
  version: string;
  path: string;
}

/**
 * バリデーション設定
 */
export interface ValidationConfig {
  whitelist: boolean;
  forbidNonWhitelisted: boolean;
  transform: boolean;
}

/**
 * サーバー設定インターフェース
 */
export interface ServerConfig {
  // グローバルプレフィックス
  globalPrefix: string;

  // フロントエンドURL
  frontendUrl: string;

  // CORS設定
  cors: CorsConfig;

  // Swagger設定
  swagger: SwaggerConfig;

  // バリデーション設定
  validation: ValidationConfig;

  // ミドルウェア設定
  helmet: {
    enabled: boolean;
  };
  compression: {
    enabled: boolean;
  };
  cookieParser: {
    enabled: boolean;
  };
}

/**
 * サーバー設定
 * API初期化、CORS、Swagger、ミドルウェア設定を一元管理
 */
export default registerAs('server', (): ServerConfig => {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return {
    // グローバルプレフィックス
    globalPrefix: process.env.GLOBAL_API_PREFIX || 'api',

    // フロントエンドURL
    frontendUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

    // CORS設定
    cors: {
      allowedOrigins,
      credentials: true,
    },

    // Swagger設定
    swagger: {
      enabled: process.env.SWAGGER_ENABLED === 'true',
      title: process.env.SWAGGER_TITLE || 'Lumina CMS API',
      description:
        process.env.SWAGGER_DESCRIPTION ||
        'Enterprise Content Management System API',
      version: process.env.SWAGGER_VERSION || '1.0',
      path: process.env.SWAGGER_PATH || 'api/docs',
    },

    // バリデーション設定
    validation: {
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    },

    // ミドルウェア設定
    helmet: {
      enabled: process.env.HELMET_ENABLED !== 'false', // デフォルトtrue
    },
    compression: {
      enabled: process.env.COMPRESSION_ENABLED !== 'false', // デフォルトtrue
    },
    cookieParser: {
      enabled: process.env.COOKIE_PARSER_ENABLED !== 'false', // デフォルトtrue
    },
  };
});
