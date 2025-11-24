/**
 * Express Request型拡張
 *
 * Better Auth認証ガードで使用するカスタムプロパティを定義
 */

import type { User, Session } from 'better-auth';

declare global {
  namespace Express {
    interface Request {
      /**
       * 認証済みユーザー情報
       * AuthGuardによって設定される
       */
      user?: User;

      /**
       * セッション情報
       * AuthGuardによって設定される
       */
      session?: Session;
    }
  }
}

export {};
