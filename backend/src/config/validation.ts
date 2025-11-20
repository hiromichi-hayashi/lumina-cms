import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // アプリケーション設定
  APP_PORT: Joi.number().default(3001),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug')
    .default('debug'),

  // データベース設定
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5432),
  DB_DATABASE: Joi.string().default('lumina_cms'),
  DB_USERNAME: Joi.string().default('developer'),
  DB_PASSWORD: Joi.string().allow('').default(''),

  // テスト用データベース設定
  TEST_DB_HOST: Joi.string().default('localhost'),
  TEST_DB_PORT: Joi.number().default(5433),
  TEST_DB_DATABASE: Joi.string().default('lumina_cms_test'),
  TEST_DB_USERNAME: Joi.string().default('test_developer'),
  TEST_DB_PASSWORD: Joi.string().allow('').default(''),

  // 認証設定
  BETTER_AUTH_SECRET: Joi.string().required(),
  BETTER_AUTH_URL: Joi.string().default('http://localhost:3001'),
  BETTER_AUTH_BASE_PATH: Joi.string().default('/api/auth'),

  // OAuth Providers（オプション）
  GOOGLE_CLIENT_ID: Joi.string().allow('').optional(),
  GOOGLE_CLIENT_SECRET: Joi.string().allow('').optional(),
  GITHUB_CLIENT_ID: Joi.string().allow('').optional(),
  GITHUB_CLIENT_SECRET: Joi.string().allow('').optional(),

  // サーバー設定
  NEXT_PUBLIC_APP_URL: Joi.string().default('http://localhost:3000'),
  GLOBAL_API_PREFIX: Joi.string().default('api'),

  // CORS
  ALLOWED_ORIGINS: Joi.string().default('http://localhost:3000'),

  // Swagger
  SWAGGER_ENABLED: Joi.boolean().default(true),
  SWAGGER_TITLE: Joi.string().default('Lumina CMS API'),
  SWAGGER_DESCRIPTION: Joi.string().default(
    'Enterprise Content Management System API',
  ),
  SWAGGER_VERSION: Joi.string().default('1.0'),
  SWAGGER_PATH: Joi.string().default('api/docs'),

  // ミドルウェア設定
  HELMET_ENABLED: Joi.boolean().default(true),
  COMPRESSION_ENABLED: Joi.boolean().default(true),
  COOKIE_PARSER_ENABLED: Joi.boolean().default(true),

  // SMTP
  SMTP_HOST: Joi.string().default('localhost'),
  SMTP_PORT: Joi.number().default(1025),
  SMTP_FROM: Joi.string().default('noreply@lumina-cms.local'),

  // レート制限
  THROTTLE_TTL: Joi.number().default(60),
  THROTTLE_LIMIT: Joi.number().default(100),
});
