import { registerAs } from '@nestjs/config';

/**
 * 認証設定インターフェース
 */
export interface AuthConfig {
  // Better Auth設定
  betterAuthSecret: string;
  betterAuthUrl: string;
  betterAuthBasePath: string;

  // OAuth設定
  google: {
    clientId: string;
    clientSecret: string;
    enabled: boolean;
  };
  github: {
    clientId: string;
    clientSecret: string;
    enabled: boolean;
  };
}

/**
 * 認証設定
 * Better Auth、OAuth設定を一元管理
 */
export default registerAs('auth', (): AuthConfig => {
  const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
  const githubClientId = process.env.GITHUB_CLIENT_ID || '';

  return {
    // Better Auth設定
    betterAuthSecret: process.env.BETTER_AUTH_SECRET || '',
    betterAuthUrl: process.env.BETTER_AUTH_URL || 'http://localhost:3001',
    betterAuthBasePath: process.env.BETTER_AUTH_BASE_PATH || '/api/auth',

    // OAuth設定
    google: {
      clientId: googleClientId,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      enabled: !!googleClientId,
    },
    github: {
      clientId: githubClientId,
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      enabled: !!githubClientId,
    },
  };
});
