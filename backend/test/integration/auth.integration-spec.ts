import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { createTestApp, closeTestApp } from '../helpers/test-app.factory';
import { testDb } from '../helpers/database.helper';
import { users } from '../../src/db/schema';
import cookieParser from 'cookie-parser';

/**
 * Better Auth統合テスト (E2E)
 *
 * Better Auth統合後の認証フローをテストします。
 * エンドポイントは以下のように変更されています:
 * - POST /api/auth/sign-in/email (旧: /api/auth/signin)
 * - POST /api/auth/sign-out (旧: /api/auth/signout)
 * - GET /api/auth/session (変更なし)
 */
describe('Better Auth Integration Tests (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // テスト用DBに接続
    await testDb.connect();

    // テスト用アプリケーション起動
    app = await createTestApp();
    app.use(cookieParser());
    await app.init();
  });

  beforeEach(async () => {
    // 各テストの前にDBをクリーンアップ
    await testDb.cleanup();
  });

  afterAll(async () => {
    // テスト終了後にクリーンアップとクローズ
    await testDb.cleanup();
    await closeTestApp(app);
    await testDb.close();
  });

  describe('基本的な認証フロー', () => {
    it('ログイン → セッション確認 → ログアウト: Better Authの認証フローが正常に動作すること', async () => {
      // Setup: テストユーザー作成
      const hashedPassword = await bcrypt.hash('Password123', 10);
      await testDb.db!.insert(users).values({
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
        role: 'member',
        isActive: true,
      });

      // 1. POST /api/auth/sign-in/email → 200 OK, Cookie設定
      const signinRes = await request(app.getHttpServer())
        .post('/api/auth/sign-in/email')
        .send({
          email: 'test@example.com',
          password: 'Password123',
        })
        .expect(200);

      expect(signinRes.body.user).toBeDefined();
      expect(signinRes.body.user.email).toBe('test@example.com');

      const cookies = signinRes.headers['set-cookie'] as unknown as string[];
      expect(cookies).toBeDefined();
      // Better AuthはcookiePrefix: 'lumina'を使用
      expect(cookies.some((c: string) => c.includes('lumina.session_token'))).toBe(true);

      // 2. GET /api/auth/session → 200 OK, ユーザー情報取得
      const sessionRes = await request(app.getHttpServer())
        .get('/api/auth/session')
        .set('Cookie', cookies)
        .expect(200);

      expect(sessionRes.body.user).toBeDefined();
      expect(sessionRes.body.user.email).toBe('test@example.com');

      // 3. POST /api/auth/sign-out → 200 OK
      await request(app.getHttpServer())
        .post('/api/auth/sign-out')
        .set('Cookie', cookies)
        .expect(200);

      // 4. GET /api/auth/session → セッションなし
      const afterSignoutRes = await request(app.getHttpServer())
        .get('/api/auth/session')
        .set('Cookie', cookies)
        .expect(200);

      expect(afterSignoutRes.body.user).toBeNull();
    });

    it('セッションなしでGET /api/auth/sessionを呼び出すと{ user: null }が返されること', async () => {
      const res = await request(app.getHttpServer()).get('/api/auth/session').expect(200);

      expect(res.body.user).toBeNull();
    });
  });

  describe('Better Authフック - アカウント有効性チェック', () => {
    it('非アクティブアカウント: isActive=falseで401エラー', async () => {
      // Setup: 非アクティブユーザー作成
      const hashedPassword = await bcrypt.hash('Password123', 10);
      await testDb.db!.insert(users).values({
        email: 'inactive@example.com',
        password: hashedPassword,
        name: 'Inactive User',
        role: 'member',
        isActive: false,
      });

      const res = await request(app.getHttpServer())
        .post('/api/auth/sign-in/email')
        .send({
          email: 'inactive@example.com',
          password: 'Password123',
        })
        .expect(401);

      expect(res.body.error.message).toContain('このアカウントは無効です');
    });
  });

  describe('Better Authフック - アカウントロック機能', () => {
    it('ロック中のアカウント: lockedUntilが未来の時刻で401エラー', async () => {
      // Setup: ロック中のテストユーザー作成
      const hashedPassword = await bcrypt.hash('CorrectPassword', 10);
      const lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30分後

      await testDb.db!.insert(users).values({
        email: 'locked@example.com',
        password: hashedPassword,
        name: 'Locked User',
        role: 'member',
        isActive: true,
        loginAttempts: 5,
        lockedUntil,
      });

      const res = await request(app.getHttpServer())
        .post('/api/auth/sign-in/email')
        .send({
          email: 'locked@example.com',
          password: 'CorrectPassword',
        })
        .expect(401);

      expect(res.body.error.message).toContain('一定回数以上ログインに失敗したため');
    });

    it('ロック解除後のログイン成功: ロック時間経過後に再度ログインできること', async () => {
      // Setup: ロック期限が過去のテストユーザー作成
      const hashedPassword = await bcrypt.hash('CorrectPassword', 10);
      const lockedUntil = new Date(Date.now() - 1000); // 1秒前（既に解除されている）

      await testDb.db!.insert(users).values({
        email: 'unlocked@example.com',
        password: hashedPassword,
        name: 'Unlocked User',
        role: 'member',
        isActive: true,
        loginAttempts: 5,
        lockedUntil,
      });

      const res = await request(app.getHttpServer())
        .post('/api/auth/sign-in/email')
        .send({
          email: 'unlocked@example.com',
          password: 'CorrectPassword',
        })
        .expect(200);

      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe('unlocked@example.com');

      // ログイン成功後、loginAttemptsとlockedUntilがリセットされることを確認
      const [updatedUser] = await testDb
        .db!.select()
        .from(users)
        .where(eq(users.email, 'unlocked@example.com'));

      expect(updatedUser.loginAttempts).toBe(0);
      expect(updatedUser.lockedUntil).toBeNull();
    });
  });

  describe('Better Authフック - ログイン成功時の処理', () => {
    it('ログイン成功時にlastLoginAtが更新されること', async () => {
      // Setup: テストユーザー作成
      const hashedPassword = await bcrypt.hash('Password123', 10);
      await testDb.db!.insert(users).values({
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
        role: 'member',
        isActive: true,
        lastLoginAt: null,
      });

      // ログイン前の状態確認
      const [userBefore] = await testDb
        .db!.select()
        .from(users)
        .where(eq(users.email, 'test@example.com'));

      expect(userBefore.lastLoginAt).toBeNull();

      // ログイン
      await request(app.getHttpServer())
        .post('/api/auth/sign-in/email')
        .send({
          email: 'test@example.com',
          password: 'Password123',
        })
        .expect(200);

      // ログイン後の状態確認
      const [userAfter] = await testDb
        .db!.select()
        .from(users)
        .where(eq(users.email, 'test@example.com'));

      expect(userAfter.lastLoginAt).not.toBeNull();
      expect(userAfter.lastLoginAt!.getTime()).toBeGreaterThan(Date.now() - 5000);
    });

    it('ログイン成功時にloginAttemptsがリセットされること', async () => {
      // Setup: 試行回数が3のユーザー作成
      const hashedPassword = await bcrypt.hash('Password123', 10);
      await testDb.db!.insert(users).values({
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
        role: 'member',
        isActive: true,
        loginAttempts: 3,
      });

      // ログイン
      await request(app.getHttpServer())
        .post('/api/auth/sign-in/email')
        .send({
          email: 'test@example.com',
          password: 'Password123',
        })
        .expect(200);

      // ログイン後の状態確認
      const [userAfter] = await testDb
        .db!.select()
        .from(users)
        .where(eq(users.email, 'test@example.com'));

      expect(userAfter.loginAttempts).toBe(0);
    });
  });

  describe('エラーハンドリング', () => {
    it('存在しないユーザーでログイン失敗', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/sign-in/email')
        .send({
          email: 'notexist@example.com',
          password: 'Password123',
        })
        .expect(401);

      expect(res.body.error).toBeDefined();
    });

    it('誤ったパスワードでログイン失敗', async () => {
      // Setup: テストユーザー作成
      const hashedPassword = await bcrypt.hash('CorrectPassword', 10);
      await testDb.db!.insert(users).values({
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
        role: 'member',
        isActive: true,
      });

      const res = await request(app.getHttpServer())
        .post('/api/auth/sign-in/email')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword',
        })
        .expect(401);

      expect(res.body.error).toBeDefined();
    });

    it('無効なリクエストボディでバリデーションエラー', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/sign-in/email')
        .send({
          email: 'invalid',
          password: 'short',
        })
        .expect(400);

      expect(res.body.error).toBeDefined();
    });
  });

  describe('Cookie設定', () => {
    it('ログイン成功時にHttpOnly Cookieが設定されること', async () => {
      // Setup: テストユーザー作成
      const hashedPassword = await bcrypt.hash('Password123', 10);
      await testDb.db!.insert(users).values({
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
        role: 'member',
        isActive: true,
      });

      const res = await request(app.getHttpServer())
        .post('/api/auth/sign-in/email')
        .send({
          email: 'test@example.com',
          password: 'Password123',
        })
        .expect(200);

      const cookies = res.headers['set-cookie'] as unknown as string[];
      expect(cookies).toBeDefined();

      const sessionCookie = cookies.find((c: string) => c.includes('lumina.session_token'));
      expect(sessionCookie).toBeDefined();
      expect(sessionCookie).toContain('HttpOnly');
    });
  });

  describe('異なるロールのユーザー', () => {
    it('admin roleのユーザーがログインできること', async () => {
      const hashedPassword = await bcrypt.hash('Password123', 10);
      await testDb.db!.insert(users).values({
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'admin',
        isActive: true,
      });

      const res = await request(app.getHttpServer())
        .post('/api/auth/sign-in/email')
        .send({
          email: 'admin@example.com',
          password: 'Password123',
        })
        .expect(200);

      expect(res.body.user.role).toBe('admin');
    });

    it('editor roleのユーザーがログインできること', async () => {
      const hashedPassword = await bcrypt.hash('Password123', 10);
      await testDb.db!.insert(users).values({
        email: 'editor@example.com',
        password: hashedPassword,
        name: 'Editor User',
        role: 'editor',
        isActive: true,
      });

      const res = await request(app.getHttpServer())
        .post('/api/auth/sign-in/email')
        .send({
          email: 'editor@example.com',
          password: 'Password123',
        })
        .expect(200);

      expect(res.body.user.role).toBe('editor');
    });
  });
});
