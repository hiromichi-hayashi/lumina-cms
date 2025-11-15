/**
 * 統合テスト用のセットアップファイル
 *
 * NODE_ENV=test で起動されることを前提とし、
 * .envファイルから TEST_DB_* 環境変数を使用します
 */

// グローバルタイムアウトの設定
jest.setTimeout(30000);

/**
 * 全テストスイート実行前の処理
 */
beforeAll(async () => {
  console.log('🧪 統合テスト環境を初期化中...');
  console.log(
    `📦 データベース: ${process.env.TEST_DB_DATABASE}@${process.env.TEST_DB_HOST}:${process.env.TEST_DB_PORT}`,
  );
});

/**
 * 全テストスイート実行後の処理
 */
afterAll(async () => {
  console.log('✅ 統合テスト完了');
});
