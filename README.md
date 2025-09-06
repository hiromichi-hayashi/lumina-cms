# lumina-cms

## 🏗️ アーキテクチャ

- **フロントエンド**: App Router、Tailwind CSS、shadcn/uiを使用したNext.js 15.5
- **バックエンド**: TypeScriptを使用したFastify 5.x
- **データベース**: Prisma ORMを使用したPostgreSQL
- **モノレポ**: npmワークスペースを使用したTurborepo
- **テスト**: Jest、Playwright、Storybook
- **インフラ**: Docker、Docker Compose

## 📂 プロジェクト構造

```
lumina-cms/
├── apps/
│   ├── web/                      # Next.jsフロントエンド
│   └── api/                      # Fastifyバックエンド
├── packages/
│   ├── contracts/                # API契約（Zodスキーマ）
│   ├── env/                      # 環境変数管理
│   ├── db/                       # Prismaクライアント
│   ├── config/                   # 共有設定
│   ├── tsconfig/                 # TypeScript設定
│   └── shared/                   # 共有ユーティリティ
├── scripts/                      # ユーティリティスクリプト
│   └── health-check.sh           # 環境チェックスクリプト
├── turbo.json
├── package.json
├── docker-compose.yml
└── .env.example
```

## 🚀 クイックスタート

### 前提条件

- **nvm** (Node Version Manager)
- **Docker と Docker Compose** (データベース用)
- **Git**

### セットアップ

1. **Node.js環境のセットアップ**:

   ```bash
   # nvmがない場合はインストール
   # macOS/Linux
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

   # Node.js 22.0.0をインストールして使用
   nvm install 22.0.0
   nvm use 22.0.0

   # プロジェクトディレクトリでは自動的に切り替わります
   nvm use  # .nvmrcを読み取り
   ```

2. **自動セットアップ**:

   ```bash
   # 自動セットアップスクリプトを実行
   ./setup.sh
   ```

3. **手動セットアップ**（希望する場合）:

   ```bash
   # Node.jsバージョンを確認
   nvm use

   # 依存関係をインストール
   npm install --legacy-peer-deps

   # 環境変数をコピー
   cp .env.example .env.local

   # データベースを起動（PostgreSQLのみDocker）
   docker-compose up -d postgres

   # データベースをセットアップ
   npm run db:generate
   npm run db:migrate:dev
   npm run db:seed
   ```

4. **開発サーバーを起動**:

   **方法1: 一括起動（推奨）**

   ```bash
   # データベースを起動（必要に応じて）
   docker-compose up -d postgres

   # 全アプリケーションを起動
   npm run dev
   ```

   **方法2: 個別起動**

   ```bash
   # ターミナル1: フロントエンドサーバー起動
   cd apps/web && npm run dev

   # ターミナル2: バックエンドAPIサーバー起動
   cd apps/api && npm run dev
   ```

これにより以下が起動します：

- フロントエンド: http://localhost:3000 (ポート使用中の場合は自動的に3001等に変更)
- API: http://localhost:8080
- APIドキュメント: http://localhost:8080/docs

### 環境の確認

全ての環境が正常に起動しているか確認：

```bash
npm run health
# または
npm run check
```

## 🛠️ 利用可能なスクリプト

### ルートレベル

- `npm run dev` - すべての開発サーバーを起動
- `npm run build` - すべてのアプリケーションをビルド
- `npm run lint` - すべてのパッケージでリンティングを実行
- `npm run type-check` - TypeScriptの型チェックを実行
- `npm run test` - すべてのテストを実行
- `npm run test:e2e` - エンドツーエンドテストを実行
- `npm run health` - 全環境のヘルスチェック
- `npm run check` - 全環境のヘルスチェック（エイリアス）

### 個別アプリケーション

**フロントエンド (apps/web)**

- `cd apps/web && npm run dev` - Next.js開発サーバーを起動
- `cd apps/web && npm run build` - Next.jsアプリをビルド
- `cd apps/web && npm run storybook` - Storybookを起動

**バックエンド (apps/api)**

- `cd apps/api && npm run dev` - Fastify APIサーバーを起動
- `cd apps/api && npm run build` - APIをビルド
- `cd apps/api && npm run test` - APIテストを実行

### データベース

#### 基本コマンド

- `npm run db:generate` - Prismaクライアントを生成
- `npm run db:migrate:dev` - 開発環境でマイグレーション実行（新規マイグレーション作成も含む）
- `npm run db:migrate:deploy` - 本番環境でマイグレーション実行
- `npm run db:migrate:reset` - データベースをリセットしてマイグレーション再実行
- `npm run db:seed` - データベースにシードデータを投入
- `npm run db:studio` - Prisma Studioを開く（ブラウザでDB管理）
- `npm run db:push` - スキーマを直接データベースにプッシュ（開発時のみ）

#### マイグレーションワークフロー

**1. 初回セットアップ**

```bash
# PostgreSQLを起動
npm run docker:up

# Prismaクライアント生成
npm run db:generate

# 全マイグレーション実行
npm run db:migrate:dev

# テストデータ投入
npm run db:seed

# ブラウザでデータベース確認
npm run db:studio
```

**2. スキーマ変更時**

```bash
# 1. prisma/schema.prisma を編集

# 2. マイグレーション作成・実行
npm run db:migrate:dev --name describe_your_changes

# 3. Prismaクライアント再生成（自動実行されるが念のため）
npm run db:generate
```

**3. データベースリセット**

```bash
# 注意: 全データが削除されます
npm run db:migrate:reset

# シードデータ再投入
npm run db:seed
```

**4. 本番環境デプロイ**

```bash
# マイグレーション実行（本番環境）
npm run db:migrate:deploy

# Prismaクライアント生成
npm run db:generate
```

#### トラブルシューティング

**マイグレーションエラー時**

```bash
# マイグレーション状態確認
cd packages/db && npx prisma migrate status

# 特定マイグレーションを修正済みとしてマーク
cd packages/db && npx prisma migrate resolve --applied [migration-name]
```

**DATABASE_URL設定**

```bash
# 開発環境
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lumina"

# Supabase本番環境
DATABASE_URL="postgresql://postgres.[PROJECT-ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
```

### Docker（データベースのみ）

- `docker-compose up -d postgres` - PostgreSQLを起動
- `docker-compose down` - PostgreSQLを停止
- `npm run docker:up` - PostgreSQLを起動（エイリアス）
- `npm run docker:down` - PostgreSQLを停止（エイリアス）

## 🧪 テスト

プロジェクトには包括的なテストセットアップが含まれています：

- **ユニットテスト**: React Testing Libraryを使用したJest
- **E2Eテスト**: Playwright
- **コンポーネントテスト**: Storybook
- **APIテスト**: Jestを使用したSupertest

```bash
# すべてのテストを実行
npm run test

# ウォッチモードでテストを実行
npm run test:watch

# E2Eテストを実行
npm run test:e2e

# Storybookを起動
npm run storybook
```

## 👥 チーム開発ガイド

### Node.js環境の統一

```bash
# 各開発者は以下を実行
nvm install 22.0.0
nvm use 22.0.0

# プロジェクトディレクトリで自動切り替え
echo 'nvm use' >> ~/.bashrc  # bash
echo 'nvm use' >> ~/.zshrc   # zsh
```

### 推奨開発フロー

```bash
# 1. 最新のmainブランチから開始
git checkout main && git pull origin main

# 2. Node.jsバージョンを確認
nvm use

# 3. 依存関係を更新
npm install --legacy-peer-deps

# 4. データベース起動
docker-compose up -d postgres

# 5. 開発サーバー起動
npm run dev
```

## 🔧 開発ワークフロー

1. **新機能を作成**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Node.jsバージョン確認**:

   ```bash
   nvm use  # .nvmrcに基づいて自動設定
   ```

3. **変更をテスト**:

   ```bash
   npm run lint
   npm run type-check
   npm run test
   ```

4. **ビルドと検証**:
   ```bash
   npm run build
   ```

## 📦 パッケージ構造

### アプリ

- **web**: shadcn/uiコンポーネントを使用したNext.jsフロントエンドアプリケーション
- **api**: Swaggerドキュメント付きのFastifyバックエンドAPI

### パッケージ

- **contracts**: API検証用の共有Zodスキーマ
- **db**: Prismaクライアントとデータベースユーティリティ
- **env**: 環境変数検証
- **tsconfig**: 共有TypeScript設定

## 🗄️ データベース設計

### スキーマ構造

Lumina CMSは以下のテーブル構造で設計されています：

#### 主要テーブル

- **m_users** - ユーザー管理（認証、ロール、ステータス）
- **c_posts** - 記事・コンテンツ管理
- **m_categories** - 階層カテゴリー管理
- **m_tags** - タグ管理
- **c_comments** - コメントシステム（ネスト対応）
- **m_media_assets** - メディアファイル管理

#### 監査・履歴テーブル

- **a_user_role_history** - ユーザーロール変更履歴
- **a_user_login_audit** - ログイン監査ログ
- **a_post_revisions** - 記事バージョン管理
- **a_post_status_history** - 記事ステータス変更履歴
- **a_comment_moderation_history** - コメントモデレーション履歴

#### システムテーブル

- **a_user_invites** - ユーザー招待管理
- **r_posts_tags** - 記事とタグの多対多関連
- **q_revalidation_outbox** - ISR再検証キュー

### 主要な機能

- **ロールベースアクセス制御** (public, author, moderator, editor, admin)
- **記事ワークフロー** (draft → review → published → scheduled)
- **階層カテゴリー** (無限階層サポート)
- **ネストコメント** (返信機能付き)
- **包括的監査ログ** (全変更を追跡)
- **ソフトデリート** (データ復元可能)

## 🌍 環境変数

`.env.example`を`.env.local`にコピーして値を更新してください：

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lumina"
NEXT_PUBLIC_API_URL="http://localhost:8080"
API_PORT=8080
JWT_SECRET="your-jwt-secret-must-be-at-least-32-characters-long"
NODE_ENV="development"
```

## 🔧 トラブルシューティング

### よくある問題と解決方法

#### 1. ポートが使用中エラー

```bash
# 特定のポートを使用しているプロセスを終了
lsof -ti:3000 | xargs kill -9  # Next.js
lsof -ti:8080 | xargs kill -9  # API

# または全てのNode.jsプロセスを確認
ps aux | grep node
```

#### 2. Docker エラー

```bash
# Dockerサービスを再起動
npm run docker:down
npm run docker:up

# PostgreSQLのみ起動
docker-compose up -d postgres
```

#### 3. データベース接続エラー

```bash
# データベースが起動していることを確認
docker ps

# PostgreSQLコンテナ再起動
npm run docker:down
npm run docker:up

# データベース再初期化
npm run db:generate
npm run db:migrate:dev
```

#### 6. マイグレーション関連エラー

```bash
# DATABASE_URL環境変数エラー
# .envファイルが正しく設定されているか確認
cat .env | grep DATABASE_URL

# マイグレーション状態確認
cd packages/db && npx prisma migrate status

# マイグレーション履歴リセット
npm run db:migrate:reset

# 特定のマイグレーションをスキップ
cd packages/db && npx prisma migrate resolve --rolled-back [migration-name]
```

#### 7. Prisma関連エラー

```bash
# Prismaクライアント再生成
npm run db:generate

# スキーマ形式エラー
cd packages/db && npx prisma format

# データベースとスキーマの同期状態確認
cd packages/db && npx prisma db pull
cd packages/db && npx prisma db push --preview-feature
```

#### 4. 依存関係エラー

```bash
# package-lock.jsonを削除して再インストール
rm -f package-lock.json
npm install --legacy-peer-deps

# 個別パッケージも更新
cd apps/web && npm install --legacy-peer-deps
cd apps/api && npm install --legacy-peer-deps
```

#### 5. Turbo エラー

```bash
# 個別起動に切り替え
cd apps/web && npm run dev    # ターミナル1
cd apps/api && npm run dev    # ターミナル2
```

## 🚀 デプロイ

プロジェクトはVercelでのデプロイ用に設定されています：

1. **フロントエンド**: `apps/web`ディレクトリから自動デプロイ
2. **API**: Vercel Functionsとしてデプロイするか、Next.js APIルートに移行可能
3. **データベース**: 管理されたPostgreSQL（Supabase）を使用

## 📖 コーディング規約

プロジェクト全体の品質と一貫性を保つため、以下のコーディング規約に従ってください：

### ファイル形式

- **すべてのテキストファイルは最終行を改行文字で終了**（POSIX準拠）
- UTF-8エンコーディングの使用
- LF改行文字の使用（Windows開発者はgit設定で自動変換）

### 品質チェック

```bash
# リント実行
npm run lint

# 型チェック
npm run type-check

# フォーマット
npm run format
```

詳細は [コーディング規約](./docs/coding-standards.md) を参照してください。

## 🤝 コントリビューション

1. リポジトリをフォーク
2. 機能ブランチを作成
3. 変更を行う
4. 変更に対するテストを追加
5. コーディング規約を確認
6. すべてのテストが通ることを確認
7. プルリクエストを提出
