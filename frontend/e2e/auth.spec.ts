/**
 * 認証フロー E2E テスト
 *
 * Playwright を使用した認証機能の統合テスト
 */

import { test, expect } from '@playwright/test';

test.describe('認証フロー全体', () => {
    test('ログイン成功フロー: 正しい認証情報でログインからダッシュボード遷移まで成功すること', async ({
      page,
    }) => {
      // ログインページへアクセス
      await page.goto('/login');

      // フォーム入力
      await page.fill('input[type="email"]', 'admin@lumina-cms.com');
      await page.fill('input[type="password"]', 'Admin@12345');

      // ログインボタンクリック
      await page.click('button:has-text("ログイン")');

      // ダッシュボードへリダイレクト
      await expect(page).toHaveURL('/dashboard');

      // セッションが確立されていることを確認（Cookieチェック）
      const cookies = await page.context().cookies();
      const sessionCookie = cookies.find((cookie) =>
        cookie.name.includes('session') || cookie.name.includes('auth')
      );
      expect(sessionCookie).toBeDefined();
    });

    test('ログイン失敗フロー: 不正な認証情報でエラーメッセージが表示されること', async ({
      page,
    }) => {
      await page.goto('/login');

      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'wrongpassword');
      await page.click('button:has-text("ログイン")');

      // エラーメッセージ表示
      await expect(page.locator('text=/ログインに失敗しました|メールアドレスまたはパスワードが正しくありません/i')).toBeVisible();

      // /loginに留まる
      await expect(page).toHaveURL('/login');
    });

    test('ログアウトフロー: ログアウトボタンクリックでログイン画面へ遷移すること', async ({
      page,
    }) => {
      // ログイン
      await page.goto('/login');
      await page.fill('input[type="email"]', 'admin@lumina-cms.com');
      await page.fill('input[type="password"]', 'Admin@12345');
      await page.click('button:has-text("ログイン")');

      await expect(page).toHaveURL('/dashboard');

      // ログアウト
      await page.click('button:has-text("ログアウト")');

      // ログイン画面へリダイレクト
      await expect(page).toHaveURL('/login');
    });
});

test.describe('セッション永続性', () => {
    test('ページリロード後のセッション維持: ページリロード後もログイン状態が維持されること', async ({
      page,
    }) => {
      // ログイン
      await page.goto('/login');
      await page.fill('input[type="email"]', 'admin@lumina-cms.com');
      await page.fill('input[type="password"]', 'Admin@12345');
      await page.click('button:has-text("ログイン")');

      await expect(page).toHaveURL('/dashboard');

      // ページリロード
      await page.reload();

      // ログイン状態が維持される
      await expect(page).toHaveURL('/dashboard');
    });

    test('タブ間のセッション共有: 新しいタブでもログイン状態が共有されること', async ({
      context,
      page,
    }) => {
      // タブ1でログイン
      await page.goto('/login');
      await page.fill('input[type="email"]', 'admin@lumina-cms.com');
      await page.fill('input[type="password"]', 'Admin@12345');
      await page.click('button:has-text("ログイン")');

      await expect(page).toHaveURL('/dashboard');

      // タブ2で/dashboardへアクセス
      const page2 = await context.newPage();
      await page2.goto('/dashboard');

      // タブ2でもログイン状態が維持される
      await expect(page2).toHaveURL('/dashboard');
    });
});

test.describe('フォームバリデーション', () => {
    test('空欄送信時のバリデーション: 空欄で送信時にクライアントサイドバリデーションが動作すること', async ({
      page,
    }) => {
      await page.goto('/login');

      // 空欄のままログインボタンをクリック
      await page.click('button:has-text("ログイン")');

      // バリデーションエラーメッセージが表示される
      await expect(
        page.locator('text=/有効なメールアドレスを入力してください/i')
      ).toBeVisible();
      await expect(
        page.locator('text=/パスワードは8文字以上で入力してください/i')
      ).toBeVisible();
    });

    test('不正なメール形式のバリデーション: 不正なメール形式でバリデーションエラーが表示されること', async ({
      page,
    }) => {
      await page.goto('/login');

      await page.fill('input[type="email"]', 'invalid-email');
      await page.fill('input[type="password"]', 'Password123');
      await page.click('button:has-text("ログイン")');

      await expect(
        page.locator('text=/有効なメールアドレスを入力してください/i')
      ).toBeVisible();
    });

    test('パスワード文字数不足のバリデーション: 8文字未満のパスワードでバリデーションエラーが表示されること', async ({
      page,
    }) => {
      await page.goto('/login');

      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'Pass123');
      await page.click('button:has-text("ログイン")');

      await expect(
        page.locator('text=/パスワードは8文字以上で入力してください/i')
      ).toBeVisible();
    });
});

test.describe('アクセシビリティ', () => {
    test('キーボードナビゲーション: Tabキーでフォーカス移動ができること', async ({
      page,
    }) => {
      await page.goto('/login');

      // Tabキーを連続押下
      await page.keyboard.press('Tab');
      await expect(page.locator('input[type="email"]')).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(page.locator('input[type="password"]')).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(page.locator('button:has-text("ログイン")')).toBeFocused();
    });

    test('Enterキーでのフォーム送信: パスワード入力欄でEnterキーを押すとフォームが送信されること', async ({
      page,
    }) => {
      await page.goto('/login');

      await page.fill('input[type="email"]', 'admin@lumina-cms.com');
      await page.fill('input[type="password"]', 'Admin@12345');

      // パスワード入力欄でEnterキーを押下
      await page.locator('input[type="password"]').press('Enter');

      // ダッシュボードへリダイレクト
      await expect(page).toHaveURL('/dashboard');
    });

    test('スクリーンリーダー対応: エラーメッセージがスクリーンリーダーで読み上げられること', async ({
      page,
    }) => {
      await page.goto('/login');

      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'wrongpassword');
      await page.click('button:has-text("ログイン")');

      // エラーメッセージにrole="alert"が設定されていることを確認
      const errorAlert = page.locator('[role="alert"]');
      await expect(errorAlert).toBeVisible();
    });
});

test.describe('レスポンシブデザイン', () => {
    test('モバイルビュー: モバイルサイズでレイアウトが崩れないこと', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/login');

      // フォームが正常に表示される
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.locator('button:has-text("ログイン")')).toBeVisible();

      // すべての要素がタップ可能である
      const emailInput = page.locator('input[type="email"]');
      await expect(emailInput).toBeEnabled();
      const passwordInput = page.locator('input[type="password"]');
      await expect(passwordInput).toBeEnabled();
      const submitButton = page.locator('button:has-text("ログイン")');
      await expect(submitButton).toBeEnabled();
    });

    test('タブレットビュー: タブレットサイズでレイアウトが崩れないこと', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/login');

      // フォームが正常に表示される
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.locator('button:has-text("ログイン")')).toBeVisible();
    });

    test('デスクトップビュー: デスクトップサイズでレイアウトが崩れないこと', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/login');

      // フォームが正常に表示される
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.locator('button:has-text("ログイン")')).toBeVisible();
    });
});

test.describe('エラーハンドリング', () => {
    test('アカウントロック時のエラー表示: ロック中のアカウントでログイン試行時に適切なエラーが表示されること', async ({
      page,
    }) => {
      // Note: この テストはバックエンドでアカウントロック機能が実装された後に有効化
      test.skip();

      await page.goto('/login');

      // ロック中のアカウントでログイン試行
      await page.fill('input[type="email"]', 'locked@example.com');
      await page.fill('input[type="password"]', 'Password123');
      await page.click('button:has-text("ログイン")');

      // エラーメッセージが表示される
      await expect(
        page.locator('text=/アカウントがロックされています/i')
      ).toBeVisible();
    });

    test('ネットワークエラー時の表示: ネットワークエラー時に適切なエラーが表示されること', async ({
      context,
      page,
    }) => {
      // ネットワークリクエストを失敗させる
      await context.route('**/auth/signin', (route) => route.abort());

      await page.goto('/login');

      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'Password123');
      await page.click('button:has-text("ログイン")');

      // エラーメッセージが表示される
      await expect(page.locator('text=/ログインに失敗しました/i')).toBeVisible();
    });
  });
