# Lumina CMS - Backend

NestJS + Drizzle ORM + PostgreSQL + Better Auth

## 🛠️ 技術スタック

- **Framework**: NestJS 10.3
- **ORM**: Drizzle ORM 0.29
- **Database**: PostgreSQL 15
- **認証**: Better Auth 1.3
- **言語**: TypeScript 5.x
- **テスト**: Jest
- **Linter/Formatter**: ESLint, Prettier

## 📋 前提条件

- **Node.js 22.x** (プロジェクトルートの `.nvmrc` で指定)
- **npm** (Node.jsに付属)
- **Docker と Docker Compose** (PostgreSQL用)

## 🚀 環境構築

### 1. 依存関係のインストール

```bash
cd backend
npm install
```

### 2. 環境変数の設定

`.env.example` をコピーして `.env` を作成：

```bash
cp .env.example .env
```
### 3. PostgreSQL の起動（Docker）

```bash
# backend/docker ディレクトリから起動
cd docker
docker compose up -d postgres

# ログ確認
docker compose logs -f postgres

# 停止
docker compose down
```

**よく使うDockerコマンド:**

```bash
# コンテナ一覧確認
docker ps

# PostgreSQLのみ起動
docker compose up -d postgres

# 全サービス停止
docker compose down

# データを含めて全削除（注意！）
docker compose down -v

# ログ確認
docker compose logs -f postgres
```

### 4. データベースのセットアップ

```bash
cd backend

# マイグレーションファイル生成
npm run db:generate

# マイグレーション実行
npm run db:migrate

# シードデータ投入
npm run db:seed
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3001 でAPIサーバーが起動します。

## 📜 利用可能なコマンド

### 開発

```bash
# 開発サーバー起動（ホットリロード有効）
npm run dev

# デバッグモードで起動
npm run start:debug
```

### ビルド・本番

```bash
# 本番用ビルド（dist/フォルダに出力）
npm run build

# 本番モードで起動（ビルド後）
npm run start:prod
```

### コード品質

```bash
# ESLintによるコードチェック
npm run lint

# Prettierによるコード整形
npm run format
```

### テスト

```bash
# ユニットテスト実行
npm test

# カバレッジ付きテスト
npm run test:cov

# E2Eテスト実行
npm run test:e2e
```

### データベース管理

```bash
# マイグレーションファイル生成（スキーマ変更時）
npm run db:generate

# マイグレーション実行（DBに反映）
npm run db:migrate

# シードデータ投入
npm run db:seed

# Drizzle Studio起動（GUIでDB管理）
npm run db:studio
# → http://localhost:4983 でアクセス

# マイグレーション削除
npm run db:drop
```

## 📂 ディレクトリ構造と役割

```
backend/
├── docker/                      # Docker設定
│   ├── docker-compose.yml       # PostgreSQL, Redis等の定義
│   └── Taskfile                 # Taskコマンド定義
│
├── src/
│   ├── config/                  # アプリケーション設定
│   │   ├── app.config.ts        # 環境変数管理
│   │   └── database.config.ts   # DB接続設定
│   │
│   ├── db/                      # データベース関連
│   │   ├── schema/              # Drizzle ORMスキーマ定義
│   │   │   ├── index.ts         # スキーマエクスポート
│   │   │   ├── users.ts         # ユーザーテーブル
│   │   │   ├── accounts.ts      # OAuthアカウント
│   │   │   ├── sessions.ts      # セッション
│   │   │   ├── verificationTokens.ts  # 認証トークン
│   │   │   ├── blogPosts.ts     # ブログ記事
│   │   │   ├── categories.ts    # カテゴリ
│   │   │   ├── comments.ts      # コメント
│   │   │   ├── likes.ts         # いいね
│   │   │   ├── contacts.ts      # お問い合わせ
│   │   │   ├── announcements.ts # お知らせ
│   │   │   ├── labels.ts        # ラベル
│   │   │   ├── postLabels.ts    # 記事ラベル中間テーブル
│   │   │   ├── contentDrafts.ts # 下書き
│   │   │   ├── contentRankings.ts # コンテンツランキング
│   │   │   ├── seoMetadata.ts   # SEOメタデータ
│   │   │   ├── auditLogs.ts     # 監査ログ
│   │   │   ├── ngWords.ts       # NGワード
│   │   │   └── enums.ts         # Enum定義
│   │   ├── migrations/          # マイグレーションファイル
│   │   │   └── meta/            # マイグレーションメタデータ
│   │   ├── seeds/               # シードデータ
│   │   │   └── index.ts         # シード実行スクリプト
│   │   ├── drizzle.module.ts    # Drizzle Module
│   │   ├── drizzle.service.ts   # Drizzle Service
│   │   └── migrate.ts           # マイグレーション実行
│   │
│   ├── modules/                 # 機能モジュール
│   │   ├── auth/                # 認証モジュール（Better Auth）
│   │   │   ├── dto/             # データ転送オブジェクト
│   │   │   │   ├── login.dto.ts
│   │   │   │   ├── register.dto.ts
│   │   │   │   └── auth-response.dto.ts
│   │   │   ├── auth.module.ts   # 認証モジュール定義
│   │   │   ├── auth.service.ts  # 認証ビジネスロジック
│   │   │   ├── auth.controller.ts  # 認証エンドポイント
│   │   │   └── better-auth.config.ts  # Better Auth設定
│   │   └── common/              # 共通モジュール
│   │       └── common.module.ts
│   │
│   ├── common/                  # 共通機能
│   │   ├── decorators/          # カスタムデコレーター
│   │   │   ├── current-user.decorator.ts  # @CurrentUser()
│   │   │   └── roles.decorator.ts         # @Roles()
│   │   ├── guards/              # 認証・認可ガード
│   │   │   ├── auth.guard.ts    # JWT認証ガード
│   │   │   └── roles.guard.ts   # ロールベース認可
│   │   ├── filters/             # 例外フィルター
│   │   ├── interceptors/        # インターセプター
│   │   └── pipes/               # バリデーションパイプ
│   │
│   ├── health/                  # ヘルスチェック
│   │   ├── health.module.ts
│   │   └── health.controller.ts
│   │
│   ├── app.module.ts            # ルートモジュール
│   └── main.ts                  # アプリケーションエントリーポイント
│
├── test/                        # テストファイル
│   ├── helpers/                 # テストヘルパー
│   │   ├── database.helper.ts   # DB操作ヘルパー
│   │   └── test-app.factory.ts  # テストアプリ生成
│   ├── setup.ts                 # ユニットテスト設定
│   ├── setup-e2e.ts             # E2Eテスト設定
│   └── jest-e2e.json            # E2Eテスト設定
│
├── .env                         # 環境変数（gitignore）
├── .env.example                 # 環境変数サンプル
├── drizzle.config.ts            # Drizzle設定
├── nest-cli.json                # NestJS CLI設定
├── jest.config.js               # Jest設定
├── tsconfig.json                # TypeScript設定
└── package.json                 # npm設定
```

### 主要ディレクトリの役割

| ディレクトリ | 役割 |
|------------|------|
| `config/` | 環境変数やアプリケーション設定の管理 |
| `db/schema/` | Drizzle ORMのテーブル定義（TypeScript） |
| `db/migrations/` | データベースマイグレーションファイル |
| `db/seeds/` | 開発用の初期データ投入スクリプト |
| `modules/` | 機能ごとのモジュール（auth、posts等） |
| `modules/auth/dto/` | 認証関連のデータ転送オブジェクト |
| `modules/common/` | 共通モジュール定義 |
| `common/` | 全モジュールで共有される横断的機能 |
| `common/guards/` | 認証・認可のガード（ミドルウェア） |
| `common/decorators/` | カスタムデコレーター（@CurrentUser等） |
| `common/filters/` | 例外フィルター（エラーハンドリング） |
| `common/interceptors/` | インターセプター（レスポンス変換、ログ等） |
| `common/pipes/` | バリデーションパイプ |
| `health/` | ヘルスチェックエンドポイント |

### NestJS公式推奨構造との整合性

✅ **このプロジェクトはNestJS公式推奨のモジュラーアーキテクチャに完全準拠しています。**

**主な特徴:**
- Module/Controller/Service の3層構造を厳守
- 横断的関心事（Guards, Filters, Interceptors, Pipes）を`common/`で適切に管理
- 機能別モジュールを`modules/`で分離
- Drizzle ORMのスキーマとマイグレーションを`db/`で一元管理
- 依存性注入（DI）の徹底活用

## 🗄️ データベース管理

### スキーマ変更の流れ

1. **スキーマファイルを編集** (`src/db/schema/*.ts`)

```typescript
// 例: src/db/schema/users.ts
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  // 新しいカラムを追加
  phoneNumber: varchar('phone_number', { length: 20 }),
})
```

2. **マイグレーションファイル生成**

```bash
npm run db:generate
# → src/db/migrations/ ディレクトリにSQLファイルが生成される
```

3. **マイグレーション実行**

```bash
npm run db:migrate
# → 生成されたSQLがDBに適用される
```

### Drizzle Studio の使い方

```bash
npm run db:studio
```

http://localhost:4983 でGUIが起動し、以下が可能：
- テーブルデータの閲覧・編集
- SQLクエリの実行
- スキーマの確認

## 🔐 認証システム

### Better Auth の仕組み

このアプリケーションは **Better Auth** を使用した認証システムを採用しています。

**主な特徴:**
- メール/パスワード認証
- OAuth認証（Google、GitHub）
- セッション管理（Cookie）
- ロールベースアクセス制御（RBAC）

### 認証エンドポイント

```
POST   /api/auth/sign-up/email      # 新規登録
POST   /api/auth/sign-in/email      # ログイン
POST   /api/auth/sign-out           # ログアウト
GET    /api/auth/session            # セッション取得
POST   /api/auth/sign-in/social     # OAuth認証
```

### 認証ガードの使い方

```typescript
import { UseGuards } from '@nestjs/common'
import { AuthGuard } from '@/common/guards/auth.guard'
import { RolesGuard } from '@/common/guards/roles.guard'
import { Roles } from '@/common/decorators/roles.decorator'
import { CurrentUser } from '@/common/decorators/current-user.decorator'

@Controller('posts')
@UseGuards(AuthGuard)  // 認証必須
export class PostsController {
  @Get()
  findAll(@CurrentUser() user) {
    // user にログインユーザー情報が入る
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')  // admin ロールのみアクセス可能
  create(@CurrentUser() user, @Body() dto) {
    // 管理者のみ実行可能
  }
}
```

## 🧪 テスト

### ユニットテスト

```bash
# 全テスト実行
npm test

# ウォッチモード
npm run test:watch

# カバレッジ付き
npm run test:cov
```

### E2Eテスト

```bash
# E2Eテスト実行
npm run test:e2e
```

**注意**: E2Eテストはテスト用データベースを使用します。
- ポート: `5433` （開発用は5432）
- データベース名: `lumina_cms_test`

## 🔧 トラブルシューティング

### ポートが既に使用されている

```bash
# プロセスを確認
lsof -i :3001

# プロセスを終了
kill -9 <PID>
```

### データベース接続エラー

```bash
# Dockerが起動しているか確認
docker ps

# PostgreSQLが起動していない場合
cd docker
docker compose up -d postgres

# ログ確認
docker compose logs postgres
```

### マイグレーションエラー

```bash
# マイグレーション削除
npm run db:drop

# 再度マイグレーション生成・実行
npm run db:generate
npm run db:migrate
```

### モジュールが見つからない

```bash
# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

## 📖 開発のベストプラクティス

### コーディング規約

- **TypeScript**: 型安全性を確保し、`any` の使用を避ける
- **NestJSパターン**: Module/Controller/Service の構成を守る
- **async/await**: Promise.then は避ける
- **ESLint/Prettier**: 自動フォーマットに従う

### ファイル命名規則

| 種類 | 命名規則 | 例 |
|------|---------|-----|
| モジュール | kebab-case.module.ts | `auth.module.ts` |
| コントローラー | kebab-case.controller.ts | `auth.controller.ts` |
| サービス | kebab-case.service.ts | `auth.service.ts` |
| DTO | kebab-case.dto.ts | `login.dto.ts` |
| 定数 | UPPER_SNAKE_CASE | `DATABASE_CONFIG` |

## 📄 ライセンス

MIT License
