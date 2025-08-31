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

- `npm run db:generate` - Prismaクライアントを生成
- `npm run db:migrate:dev` - データベースマイグレーションを実行
- `npm run db:seed` - データベースにシードデータを投入
- `npm run db:studio` - Prisma Studioを開く

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

# データベース再初期化
npm run db:generate
npm run db:migrate:dev
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

## 🤝 コントリビューション

1. リポジトリをフォーク
2. 機能ブランチを作成
3. 変更を行う
4. 変更に対するテストを追加
5. すべてのテストが通ることを確認
6. プルリクエストを提出
