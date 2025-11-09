# Lumina CMS

エンタープライズ向けコンテンツ管理システム

## 🏗️ アーキテクチャ

- **フロントエンド**: Next.js 15.5 (App Router) + React 19 + Tailwind CSS 3.4
- **バックエンド**: NestJS 10.3 + TypeScript 5.x
- **データベース**: PostgreSQL 15 + Drizzle ORM 0.29
- **認証**: Better Auth 1.3.34（バックエンドで管理）
- **開発環境**: Node.js 22.x + Docker Compose

## 📂 ディレクトリ構造

```
lumina-cms/
├── backend/                      # NestJS バックエンドAPI
│   ├── docker/                   # Docker設定（PostgreSQL、Redis等）
│   ├── src/
│   │   ├── config/              # アプリケーション設定
│   │   ├── db/                  # データベース関連
│   │   │   ├── schema/          # Drizzle ORMスキーマ定義
│   │   │   ├── seeds/           # シードデータ
│   │   │   └── migrate.ts       # マイグレーション実行スクリプト
│   │   ├── modules/             # 機能モジュール
│   │   │   ├── auth/            # 認証モジュール (Better Auth)
│   │   │   └── common/          # 共通モジュール
│   │   ├── common/              # 共通機能
│   │   │   ├── guards/          # 認証・認可ガード
│   │   │   ├── decorators/      # カスタムデコレーター
│   │   │   ├── filters/         # 例外フィルター
│   │   │   ├── interceptors/    # インターセプター
│   │   │   └── pipes/           # バリデーションパイプ
│   │   ├── health/              # ヘルスチェックエンドポイント
│   │   ├── app.module.ts        # ルートモジュール
│   │   └── main.ts              # アプリケーションエントリーポイント
│   ├── test/                    # テストファイル
│   │   ├── helpers/             # テストヘルパー
│   │   ├── setup.ts             # ユニットテスト設定
│   │   └── setup-e2e.ts         # E2Eテスト設定
│   ├── .env.example             # 環境変数サンプル
│   ├── drizzle.config.ts        # Drizzle設定
│   ├── nest-cli.json            # NestJS CLI設定
│   ├── package.json
│   └── README.md                # バックエンド詳細ドキュメント
│
├── frontend/                     # Next.js フロントエンドアプリ
│   ├── public/                  # 静的ファイル（画像、favicon等）
│   ├── src/
│   │   ├── app/                 # Next.js App Router
│   │   │   ├── api/auth/        # Better Auth API routes
│   │   │   ├── layout.tsx       # ルートレイアウト
│   │   │   ├── page.tsx         # ホームページ
│   │   │   └── globals.css      # グローバルスタイル
│   │   ├── components/          # Reactコンポーネント
│   │   │   ├── ui/              # shadcn/ui ベースUIコンポーネント
│   │   │   └── auth/            # 認証関連コンポーネント
│   │   ├── hooks/               # カスタムReactフック
│   │   ├── lib/                 # ユーティリティとライブラリ
│   │   │   ├── api/             # APIクライアント
│   │   │   ├── auth/            # Better Authクライアント設定
│   │   │   └── utils/           # ヘルパー関数
│   │   ├── types/               # TypeScript型定義
│   │   │   ├── api.ts           # API型定義
│   │   │   └── models.ts        # モデル型定義
│   │   └── middleware.ts        # Next.jsミドルウェア（認証チェック等）
│   ├── .env.example             # 環境変数サンプル
│   ├── next.config.js           # Next.js設定
│   ├── tailwind.config.js       # Tailwind CSS設定
│   ├── components.json          # shadcn/ui設定
│   ├── package.json
│   └── README.md                # フロントエンド詳細ドキュメント
│
├── .gitignore                   # Git除外設定
├── .nvmrc                       # Node.jsバージョン指定
└── README.md                    # このファイル
```

## 🚀 クイックスタート

### 前提条件

- **Node.js 22.x** (.nvmrc に記載)
- **Docker と Docker Compose**
- **Git**

### セットアップ手順

詳細な環境構築手順は各ディレクトリのREADMEを参照してください：

- **バックエンド**: [backend/README.md](./backend/README.md)
- **フロントエンド**: [frontend/README.md](./frontend/README.md)

### 基本的な起動フロー

```bash
# 1. Node.jsバージョン設定
nvm use

# 2. バックエンドセットアップ
cd backend
npm install
# Dockerでデータベース起動・マイグレーション実行
# 詳細は backend/README.md 参照

# 3. フロントエンドセットアップ
cd ../frontend
npm install
# 詳細は frontend/README.md 参照
```

### アクセスURL

起動後、以下のURLでアクセス可能：

- **フロントエンド**: http://localhost:3000
- **バックエンドAPI**: http://localhost:3001
- **API ドキュメント**: http://localhost:3001/api/docs

## 📖 技術ドキュメント

- [バックエンド詳細](./backend/README.md) - NestJS、Drizzle ORM、データベース設定
- [フロントエンド詳細](./frontend/README.md) - Next.js、認証、UIコンポーネント

## 📄 ライセンス

MIT License
