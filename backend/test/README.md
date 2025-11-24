# テストディレクトリ構成

このディレクトリには、バックエンドAPIの統合テストとテストヘルパーが含まれています。

## ディレクトリ構造

```
test/
├── unit/                          # ユニットテスト
│   ├── modules/
│   │   └── auth/
│   │       ├── auth.service.spec.ts      # AuthServiceのユニットテスト
│   │       └── auth.controller.spec.ts   # AuthControllerのユニットテスト
│   └── common/
│       ├── guards/
│       │   ├── auth.guard.spec.ts        # AuthGuardのユニットテスト
│       │   └── roles.guard.spec.ts       # RolesGuardのユニットテスト
│       └── pipes/
│           └── zod-validation.pipe.spec.ts  # ZodValidationPipeのユニットテスト
├── integration/                   # 統合テスト（E2E）
│   └── auth.integration-spec.ts   # 認証APIの統合テスト
├── helpers/                       # テストヘルパー
│   ├── test-app.factory.ts        # NestJSアプリケーションファクトリー
│   └── database.helper.ts         # テスト用DB管理ヘルパー
├── jest-integration.json          # 統合テスト用Jest設定
├── setup-integration.ts           # 統合テスト前処理
└── setup.ts                       # ユニットテスト前処理
```

## テストの種類

### 1. ユニットテスト (`test/unit/**/*.spec.ts`)

**場所**: `test/unit/` ディレクトリ（ソースコードのディレクトリ構造を再現）

**実行方法**:
```bash
# すべてのユニットテストを実行
npm run test:unit

# 監視モード
npm run test:unit:watch

# カバレッジレポート付き
npm run test:unit:cov
```

**設定**: `jest.config.js`

**特徴**:
- モジュール/コンポーネント単位のテスト
- モック/スタブを使用
- 高速実行
- 外部依存なし（DB不要）

**現在のテスト数**: 85テスト
- AuthService: 23テスト
- AuthController: 12テスト
- AuthGuard: 11テスト
- RolesGuard: 21テスト
- ZodValidationPipe: 20テスト (一部スキップ)

### 2. 統合テスト (`test/integration/**/*.integration-spec.ts`)

**場所**: `test/integration/` ディレクトリ

**実行方法**:
```bash
# すべての統合テストを実行
npm run test:integration
```

**設定**: `test/jest-integration.json`

**特徴**:
- API エンドポイントの実際の動作をテスト
- 実際のDBを使用（テスト用DB必須）
- Supertest を使用した HTTP リクエストテスト
- Cookie、セッション、認証フロー全体をテスト

## 統合テストの実行に必要な環境

統合テストを実行するには、テスト用データベースが必要です。

### テスト用DBのセットアップ（Docker Compose）

**業界標準のアプローチ**: Docker Composeでテスト用PostgreSQLを管理します。

1. **環境変数の確認**

`.env` ファイルにテスト用DB設定があることを確認:

```env
# テスト用DB設定
TEST_DB_HOST=localhost
TEST_DB_PORT=5433
TEST_DB_USERNAME=test_developer
TEST_DB_PASSWORD=test_password
TEST_DB_DATABASE=lumina_cms_test
```

2. **Docker Composeでテスト用DBを起動**

```bash
# docker/docker-compose.yml の postgres-test サービスを起動
docker compose -f docker/docker-compose.yml up -d postgres-test
```

これにより、以下が自動的に行われます:
- テスト用PostgreSQLコンテナの起動
- `lumina_cms_test` データベースの自動作成
- `test_developer` ユーザーの自動作成
- tmpfsを使用した高速なデータベース（再起動でデータ消去）

3. **マイグレーションを実行（初回のみ）**

```bash
npm run test:db:migrate
```

4. **統合テストを実行**

```bash
npm run test:integration
```

5. **テスト用DBを停止・削除する場合**

```bash
# 停止
docker compose -f docker/docker-compose.yml stop postgres-test

# 完全に削除
docker compose -f docker/docker-compose.yml down postgres-test
```

## テストヘルパー

### test-app.factory.ts

NestJSアプリケーションのテスト用インスタンスを作成するファクトリー。

**提供する関数**:
- `createTestApp()`: テスト用アプリケーションを作成・初期化
- `closeTestApp(app)`: アプリケーションをクローズ

**使用例**:
```typescript
import { createTestApp, closeTestApp } from '../helpers/test-app.factory';

let app: INestApplication;

beforeAll(async () => {
  app = await createTestApp();
  await app.init();
});

afterAll(async () => {
  await closeTestApp(app);
});
```

### database.helper.ts

テスト用データベースの管理ヘルパー。

**提供する機能**:
- DB接続管理
- テストデータのクリーンアップ
- トランザクション管理

**使用例**:
```typescript
import { testDb } from '../helpers/database.helper';

beforeAll(async () => {
  await testDb.connect();
});

beforeEach(async () => {
  await testDb.cleanup(); // 各テスト前にDBをクリーンアップ
});

afterAll(async () => {
  await testDb.close();
});
```

## テストの命名規則

### ファイル名
- **ユニットテスト**: `*.spec.ts`
- **統合テスト**: `*.integration-spec.ts`

### テストケースの記述
- `describe()`: コンポーネント/機能のグループ化
- `it()`: 個別のテストケース
- 日本語で明確な説明を記述

**例**:
```typescript
describe('Auth Integration Tests (E2E)', () => {
  describe('認証フロー全体', () => {
    it('ログイン → セッション確認 → ログアウト: 完全な認証フローが正常に動作すること', async () => {
      // テストコード
    });
  });
});
```

## カバレッジ目標

- **ユニットテスト**: ≥90% (全コンポーネント)
- **統合テスト**: 主要なAPI エンドポイントと認証フローをカバー

## トラブルシューティング

### 統合テストが「No tests found」エラーで失敗する

**原因**: Jest設定が統合テストファイルを認識していない

**解決策**:
- `test/jest-integration.json` の `testMatch` が正しいか確認
- ファイル名が `*.integration-spec.ts` で終わっているか確認

### 統合テストでDB接続エラー

**原因**: テスト用DBが起動していない、または接続情報が正しくない

**解決策**:
1. PostgreSQLが起動しているか確認
2. `.env.test` の接続情報が正しいか確認
3. テスト用DBが作成されているか確認

### ユニットテストは通るが統合テストが失敗する

**原因**: 実際のDB状態、認証設定、APIエンドポイントの問題

**解決策**:
1. テスト用DBをクリーンアップ: `await testDb.cleanup()`
2. マイグレーションが最新か確認
3. エラーログを確認して具体的な問題を特定

## 参考

- [Jest公式ドキュメント](https://jestjs.io/)
- [NestJSテストドキュメント](https://docs.nestjs.com/fundamentals/testing)
- [Supertest](https://github.com/visionmedia/supertest)
- [Drizzle ORM](https://orm.drizzle.team/)
