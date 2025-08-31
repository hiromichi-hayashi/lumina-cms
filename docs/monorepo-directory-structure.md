# モノレポディレクトリ構造ドキュメント

## 概要

本ドキュメントは、Next.js 14.2 + Fastify 5.x を使用したLumina CMSプロジェクトのモノレポ構成を定義します。2025年のベストプラクティスに基づき、Turborepoを使用して効率的な開発環境を構築します。データベースのみDocker化し、Node.js環境はnvmで統一します。

## プロジェクト構成

- **モノレポツール**: Turborepo
- **パッケージマネージャー**: npm (workspaces)
- **フロントエンド**: Next.js 14.2 (App Router)
- **バックエンド**: Fastify 5.x
- **データベース**: PostgreSQL (Dockerコンテナ) / Prisma ORM
- **デプロイ**: Vercel
- **Node.js管理**: nvm (22.x LTS)

---

## ルートディレクトリ構造

```
lumina-cms/
├── apps/
│   ├── web/                      # Next.js フロントエンド
│   │   ├── public/
│   │   └── src/
│   │       ├── app/              # (marketing)/(app) 等のルートグループを使用
│   │       ├── components/       # フロント専用UIコンポーネント
│   │       ├── lib/
│   │       ├── styles/
│   │       └── types/
│   └── api/                      # Fastify バックエンド
│       └── src/
│           ├── app.ts            # プラグイン登録の起点
│           ├── server.ts         # listen/close（起動専用）
│           ├── plugins/          # cors/helmet/swagger/auth など横断
│           ├── routes/
│           │   ├── health.ts
│           │   └── users/
│           │       ├── index.ts      # 1機能=1プラグイン
│           │       ├── schema.ts
│           │       ├── controller.ts
│           │       ├── service.ts
│           │       └── repo.ts
│           ├── shared/           # errors/types/config 等（Node専用）
│           └── test/
├── packages/
│   ├── contracts/                # API契約: zod（入出力）※唯一の真実源
│   ├── env/                      # envローダ: server.ts / client.ts 分離
│   ├── db/                       # DBクライアント初期化（Prisma）
│   ├── config/                   # eslint/tailwind/postcss 共有
│   ├── tsconfig/                 # base.json / node.json / next.json
│   └── shared/                   # UI/Node依存のない純関数・型
├── scripts/                      # ユーティリティスクリプト
│   ├── health-check.sh           # 環境チェックスクリプト
│   └── setup.sh                  # セットアップスクリプト
├── .github/
│   └── workflows/                # CI（任意）
├── turbo.json
├── package.json                  # ルートスクリプト（turbo 経由）
├── package-lock.json
├── docker-compose.yml            # PostgreSQLのみ
├── .nvmrc                        # Node.jsバージョン指定
├── .prettierrc                   # コードフォーマット設定
├── .gitignore
└── .env.example                  # 開発テンプレ（本番はSecret管理）
```

---

## 詳細ディレクトリ構造

### **apps/web (Next.js 14.2)**

```
apps/web/
├── public/
│   ├── images/
│   ├── fonts/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── (marketing)/          # ルートグループ（URLに出さないセクション）
│   │   │   ├── page.tsx          # ランディングページ
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   └── layout.tsx        # マーケティング用レイアウト
│   │   ├── (app)/                # 認証済みアプリケーションエリア
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── error.tsx
│   │   │   ├── posts/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx
│   │   │   └── layout.tsx        # アプリ用レイアウト（サイドバー等）
│   │   ├── api/                   # Route Handlers（外部公開REST）
│   │   │   └── webhook/
│   │   │       └── route.ts
│   │   ├── _features/             # 機能固有UI/ロジックを"近接配置"
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── queries.ts    # データフェッチ
│   │   │   │   └── actions.ts    # Server Actions
│   │   │   ├── posts/
│   │   │   │   ├── PostList.tsx
│   │   │   │   ├── PostForm.tsx
│   │   │   │   ├── queries.ts
│   │   │   │   └── actions.ts
│   │   │   └── users/
│   │   │       ├── UserList.tsx
│   │   │       ├── UserProfile.tsx
│   │   │       ├── queries.ts
│   │   │       └── actions.ts
│   │   ├── layout.tsx            # ルートレイアウト
│   │   ├── page.tsx              # ルートページ（リダイレクト等）
│   │   ├── not-found.tsx
│   │   └── global-error.tsx
│   ├── components/                # 横断再利用UI（デザインシステム系）
│   │   ├── ui/                   # shadcn/ui コンポーネント
│   │   │   ├── button.tsx
│   │   │   ├── button.stories.tsx
│   │   │   ├── button.test.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   └── ...
│   │   ├── layouts/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   └── common/
│   │       ├── Logo.tsx
│   │       └── ThemeToggle.tsx
│   ├── lib/                      # 純粋ロジック（formatter, auth helpers 等）
│   │   ├── api-client.ts         # Axios/fetch wrapper
│   │   ├── auth.ts               # 認証ヘルパー
│   │   ├── utils.ts              # ユーティリティ関数
│   │   └── constants.ts
│   ├── styles/
│   │   └── globals.css
│   └── types/
│       └── next.d.ts             # Next.js 型拡張
├── tests/
│   ├── e2e/                      # Playwright E2Eテスト
│   │   ├── auth.spec.ts
│   │   └── posts.spec.ts
│   └── unit/                     # Jest単体テスト
│       └── utils.test.ts
├── .storybook/                   # Storybook設定
│   ├── main.ts
│   └── preview.ts
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── jest.config.js                # Jest設定
├── playwright.config.ts          # Playwright設定
├── tsconfig.json                 # extends: ../../packages/tsconfig/next.json
├── env.d.ts                      # client で参照可能な環境変数の型
└── package.json
```

### **apps/api (Fastify 5.x)**

```
apps/api/
├── src/
│   ├── app.ts                    # fastify インスタンス生成・プラグイン登録の起点
│   ├── server.ts                 # listen/close など起動専用（test で差し替え容易）
│   ├── plugins/                  # 横断プラグイン
│   │   ├── sensible.ts           # 基本的な設定
│   │   ├── cors.ts               # CORS設定
│   │   ├── helmet.ts             # セキュリティヘッダー
│   │   ├── rate-limit.ts         # レート制限
│   │   ├── auth.ts               # 認証ミドルウェア
│   │   ├── prisma.ts             # Prismaクライアント統合
│   │   └── swagger.ts            # API ドキュメント
│   ├── routes/
│   │   ├── health.ts             # ヘルスチェック
│   │   ├── auth/                 # 認証関連
│   │   │   ├── index.ts
│   │   │   ├── schema.ts
│   │   │   ├── controller.ts
│   │   │   ├── service.ts        # Prismaを使用したDB操作
│   │   │   └── service.test.ts   # Jest単体テスト
│   │   ├── posts/                # 投稿機能（1機能=1ディレクトリ）
│   │   │   ├── index.ts          # ルート宣言（fastify.register で読み込まれる）
│   │   │   ├── schema.ts         # Zodスキーマ定義
│   │   │   ├── controller.ts     # ハンドラ（薄く）
│   │   │   ├── service.ts        # ビジネスロジック + Prisma操作
│   │   │   └── service.test.ts   # Jest単体テスト
│   │   └── users/
│   │       ├── index.ts
│   │       ├── schema.ts
│   │       ├── controller.ts
│   │       ├── service.ts
│   │       └── service.test.ts
│   ├── shared/                   # 共有コード（Node専用）
│   │   ├── errors.ts             # カスタムエラークラス
│   │   ├── types.ts              # 共通型定義
│   │   ├── logger.ts             # ロガー設定
│   │   └── config.ts             # packages/env で検証済 env を受け取る
│   └── index.d.ts                # Fastify型拡張（Prismaクライアント追加）
├── tests/
│   ├── integration/              # 統合テスト
│   │   └── api.test.ts
│   └── fixtures/                 # テストデータ
│       └── users.ts
├── Dockerfile
├── jest.config.js                # Jest設定
├── tsconfig.json                 # extends: ../../packages/tsconfig/node.json
└── package.json
```

### **packages/contracts（API契約）**

```
packages/contracts/
├── src/
│   ├── auth/
│   │   ├── login.contract.ts    # Zodスキーマ定義
│   │   ├── logout.contract.ts
│   │   └── refresh.contract.ts
│   ├── posts/
│   │   ├── create.contract.ts
│   │   ├── read.contract.ts
│   │   ├── update.contract.ts
│   │   └── delete.contract.ts
│   ├── users/
│   │   └── profile.contract.ts
│   ├── common/                   # 共通スキーマ
│   │   ├── pagination.ts
│   │   ├── error.ts
│   │   └── response.ts
│   └── index.ts                  # エクスポート集約
├── tsconfig.json
└── package.json
```

### **packages/env（環境変数管理）**

```
packages/env/
├── src/
│   ├── server.ts                 # サーバー側環境変数の検証とエクスポート
│   ├── client.ts                 # クライアント側環境変数の検証とエクスポート
│   ├── schema.ts                 # Zodによる環境変数スキーマ定義
│   └── index.ts
├── tsconfig.json
└── package.json
```

### **packages/db（Prismaデータベース管理）**

```
packages/db/
├── prisma/
│   ├── schema.prisma             # Prismaスキーマ定義
│   ├── migrations/               # マイグレーションファイル
│   │   ├── 20250101000000_init/
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── seed.ts                   # 初期データ投入スクリプト
├── src/
│   ├── client.ts                 # PrismaClient初期化とエクスポート
│   ├── types.ts                  # Prismaから生成された型
│   └── index.ts                  # エクスポート集約
├── scripts/
│   ├── migrate.ts                # マイグレーション実行スクリプト
│   └── reset.ts                  # DB リセットスクリプト
├── .env.example                  # DB接続情報のテンプレート
├── tsconfig.json
└── package.json
```

### **packages/config（設定ファイル共有）**

```
packages/config/
├── eslint/
│   ├── base.js                  # 基本ESLint設定
│   ├── next.js                  # Next.js用
│   └── node.js                  # Node.js用
├── tailwind/
│   └── tailwind.config.ts       # 共有Tailwind設定
├── postcss/
│   └── postcss.config.js        # 共有PostCSS設定
└── package.json
```

### **packages/tsconfig（TypeScript設定）**

```
packages/tsconfig/
├── base.json                     # 基本設定
├── next.json                     # Next.js用設定
├── node.json                     # Node.js用設定
└── package.json
```

### **packages/shared（純粋な共有コード）**

```
packages/shared/
├── src/
│   ├── utils/                    # UI/Node依存のない純関数
│   │   ├── date.ts              # 日付処理
│   │   ├── string.ts            # 文字列処理
│   │   └── validation.ts        # バリデーション
│   ├── types/                    # 共通型定義
│   │   ├── models.ts            # データモデル
│   │   └── common.ts            # 汎用型
│   └── index.ts
├── tsconfig.json
└── package.json
```

---

## 設定ファイル

### **Prismaスキーマ定義 (packages/db/prisma/schema.prisma)**

```prisma
// データベース接続設定
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// クライアント生成設定
generator client {
  provider = "prisma-client-js"
}

// ユーザーモデル
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

// 投稿モデル
model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("posts")
}
```

### **Prismaクライアント設定 (packages/db/src/client.ts)**

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

### **Fastifyプラグイン (apps/api/src/plugins/prisma.ts)**

```typescript
import fp from 'fastify-plugin'
import { prisma } from '@lumina/db'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: typeof prisma
  }
}

export default fp(async fastify => {
  await prisma.$connect()

  fastify.decorate('prisma', prisma)

  fastify.addHook('onClose', async () => {
    await prisma.$disconnect()
  })
})
```

### **サービス層の実装例 (apps/api/src/routes/posts/service.ts)**

```typescript
import type { Prisma, PrismaClient } from '@prisma/client'
import { z } from 'zod'

export class PostService {
  constructor(private prisma: PrismaClient) {}

  async findAll(params: {
    skip?: number
    take?: number
    where?: Prisma.PostWhereInput
    orderBy?: Prisma.PostOrderByWithRelationInput
  }) {
    const { skip, take, where, orderBy } = params

    return this.prisma.post.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  }

  async findById(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
      },
    })
  }

  async create(data: { title: string; content?: string; authorId: string }) {
    return this.prisma.post.create({
      data,
      include: {
        author: true,
      },
    })
  }

  async update(id: string, data: Prisma.PostUpdateInput) {
    return this.prisma.post.update({
      where: { id },
      data,
      include: {
        author: true,
      },
    })
  }

  async delete(id: string) {
    return this.prisma.post.delete({
      where: { id },
    })
  }
}
```

### **turbo.json**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build", "db:generate"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true,
      "dependsOn": ["db:generate"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "type-check": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "test:e2e": {
      "dependsOn": ["build"],
      "outputs": ["test-results/**"]
    },
    "storybook": {
      "cache": false,
      "persistent": true
    },
    "db:generate": {
      "cache": false,
      "outputs": ["node_modules/.prisma/**"]
    },
    "db:push": {
      "cache": false
    },
    "db:migrate": {
      "cache": false
    },
    "db:seed": {
      "cache": false
    }
  }
}
```

### **package.json (ルート)**

```json
{
  "name": "lumina-cms",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "turbo run dev",
    "dev:web": "turbo run dev --filter=web",
    "dev:api": "turbo run dev --filter=api",
    "build": "turbo run build",
    "build:web": "turbo run build --filter=web",
    "build:api": "turbo run build --filter=api",
    "start": "turbo run start",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "test": "turbo run test",
    "test:e2e": "turbo run test:e2e",
    "storybook": "turbo run storybook --filter=web",
    "format": "prettier --write \"**/*.{ts,tsx,md,json}\"",
    "clean": "turbo run clean && rm -rf node_modules",
    "db:generate": "npm run generate --workspace=db",
    "db:push": "npm run push --workspace=db",
    "db:migrate": "npm run migrate --workspace=db",
    "db:migrate:dev": "npm run migrate:dev --workspace=db",
    "db:migrate:deploy": "npm run migrate:deploy --workspace=db",
    "db:seed": "npm run seed --workspace=db",
    "db:studio": "npm run studio --workspace=db",
    "db:reset": "npm run reset --workspace=db",
    "docker:up": "docker-compose up -d postgres",
    "docker:down": "docker-compose down",
    "docker:logs": "docker-compose logs -f",
    "health": "./scripts/health-check.sh",
    "check": "./scripts/health-check.sh",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "prettier": "^3.3.0",
    "eslint": "^8.57.0",
    "@types/node": "^22.0.0"
  },
  "engines": {
    "node": ">=22.0.0",
    "npm": ">=10.0.0"
  }
}
```

### **package.json (apps/web)**

```json
{
  "name": "@lumina/web",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "playwright test",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@lumina/contracts": "workspace:*",
    "@lumina/db": "workspace:*",
    "@lumina/env": "workspace:*"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/node": "^22.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0",
    "@playwright/test": "^1.40.0",
    "@storybook/react": "^7.6.0",
    "@storybook/nextjs": "^7.6.0"
  }
}
```

### **package.json (apps/api)**

```json
{
  "name": "@lumina/api",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "lint": "eslint . --ext .ts",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "dependencies": {
    "fastify": "^5.0.0",
    "@fastify/cors": "^9.0.0",
    "@fastify/helmet": "^11.0.0",
    "@fastify/rate-limit": "^9.0.0",
    "@fastify/swagger": "^8.0.0",
    "@lumina/contracts": "workspace:*",
    "@lumina/db": "workspace:*",
    "@lumina/env": "workspace:*",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "typescript": "^5.0.0",
    "tsx": "^4.0.0",
    "jest": "^29.0.0",
    "@types/jest": "^29.0.0",
    "ts-jest": "^29.0.0"
  }
}
```

### **docker-compose.yml**

```yaml
version: '3.8'

services:
  # PostgreSQL のみ（アプリケーションはローカルのNode.jsで実行）
  postgres:
    image: postgres:15
    container_name: lumina-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: lumina
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - '5432:5432'
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  postgres-data:

networks:
  default:
    name: lumina-network
```

### **vercel.json**

```json
{
  "framework": null,
  "buildCommand": "npm run build --workspace=web",
  "outputDirectory": "apps/web/.next",
  "installCommand": "npm install",
  "ignoreCommand": "npx turbo-ignore web",
  "functions": {
    "apps/web/app/api/**/*.ts": {
      "maxDuration": 10
    }
  }
}
```

---

## 開発コマンド

### **初期セットアップ**

```bash
# Node.jsバージョン設定
nvm use

# 依存関係インストール
npm install

# 環境変数設定
cp .env.example .env.local

# Docker環境起動（PostgreSQLのみ）
npm run docker:up

# Prismaクライアント生成
npm run db:generate

# データベースマイグレーション
npm run db:migrate:dev

# 初期データ投入
npm run db:seed
```

### **開発サーバー起動**

```bash
# 全サービス起動
npm run dev

# 個別起動
npm run dev:web  # Next.jsのみ
npm run dev:api  # Fastifyのみ

# Prisma Studio（データベース管理GUI）
npm run db:studio
```

### **データベース管理**

```bash
# マイグレーション作成・実行（開発）
npm run db:migrate:dev

# マイグレーション実行（本番）
npm run db:migrate:deploy

# データベースリセット
npm run db:reset

# Prismaクライアント再生成（スキーマ変更後）
npm run db:generate

# Prisma Studio起動
npm run db:studio
```

### **ビルド・テスト**

```bash
# ビルド
npm run build

# 型チェック
npm run type-check

# Lint実行
npm run lint

# 単体テスト実行（Jest）
npm run test

# E2Eテスト実行（Playwright）
npm run test:e2e

# Storybook起動
npm run storybook

# コードフォーマット
npm run format
```

---

## パッケージ構成の設計思想

### **責務分離の原則**

| パッケージ    | 責務                                     | 依存方向 |
| ------------- | ---------------------------------------- | -------- |
| **contracts** | API契約定義（唯一の真実源）              | なし     |
| **env**       | 環境変数の型安全な管理                   | なし     |
| **db**        | Prismaクライアント・マイグレーション管理 | env      |
| **shared**    | UI/Node非依存の純粋なコード              | なし     |
| **config**    | 設定ファイルの共有                       | なし     |
| **tsconfig**  | TypeScript設定の共有                     | なし     |

### **1機能1ディレクトリの原則（Prisma統合）**

Fastify APIでは各機能を独立したディレクトリにカプセル化：

- `index.ts`: ルート定義
- `schema.ts`: Zodバリデーションスキーマ
- `controller.ts`: HTTPハンドラ（薄く）
- `service.ts`: ビジネスロジック + Prisma操作

注: `repo.ts`は削除し、Prismaの操作は`service.ts`に統合してシンプル化

### **近接配置の原則**

Next.jsでは機能に関連するコードを`_features`ディレクトリに集約：

- コンポーネント
- Server Actions
- データフェッチング関数

---

## ベストプラクティス

### **1. 型安全性の確保**

- Zodによるスキーマ定義をcontractsパッケージで一元管理
- 環境変数もZodで検証

### **2. テスタビリティの向上**

- server.tsとapp.tsを分離（テスト時の差し替えが容易）
- Prismaのモック化が容易（依存性注入）
- 各層を薄く保ち、単体テストを書きやすく

### **3. スケーラビリティ**

- 1機能1ディレクトリで機能追加が容易
- パッケージ分離により、将来的なマイクロサービス化も視野に

### **4. 開発体験の最適化**

- Turborepoによる高速ビルド
- Docker Composeによる環境構築の簡素化

### **5. 保守性の向上**

- 明確な責務分離
- 一貫したディレクトリ構造

### **Jest設定例 (apps/web/jest.config.js)**

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*): '<rootDir>/src/$1',
  },
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

### **Playwright設定例 (apps/web/playwright.config.ts)**

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### **Storybook設定例 (apps/web/.storybook/main.ts)**

```typescript
import type { StorybookConfig } from '@storybook/nextjs'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
}

export default config
```

---

## ベストプラクティス

### **1. 型安全性の確保**

- Zodによるスキーマ定義をcontractsパッケージで一元管理
- 環境変数もZodで検証

### **2. テスタビリティの向上**

- server.tsとapp.tsを分離（テスト時の差し替えが容易）
- Prismaのモック化が容易（依存性注入）
- 各層を薄く保ち、単体テストを書きやすく
- Jest/Playwright/Storybookによる包括的なテスト

### **3. スケーラビリティ**

- 1機能1ディレクトリで機能追加が容易
- パッケージ分離により、将来的なマイクロサービス化も視野に

### **4. 開発体験の最適化**

- Turborepoによる高速ビルド
- Docker Composeによる環境構築の簡素化

### **5. 保守性の向上**

- 明確な責務分離
- 一貫したディレクトリ構造

---

## 注意事項

1. **Node.jsバージョン**: 22.x LTS（nvmで管理）
2. **パッケージマネージャー**: npm 10.0.0以上を使用
3. **環境変数**: `.env.example`を参考に設定（DATABASE_URLを含む）
4. **Docker**: PostgreSQLのみDocker化（アプリはローカル実行）
5. **Prisma**: スキーマ変更後は必ず`npm run db:generate`を実行
6. **マイグレーション**: 本番環境では`db:migrate:deploy`を使用
7. **環境チェック**: `npm run health`で全環境の状態を確認可能
8. **コードフォーマット**: `npm run format`でPrettier実行

---

## 関連ドキュメント

- [フロントエンド技術ドキュメント](./frontend-tech-doc.md)
- [バックエンド技術ドキュメント](./backend-tech-doc.md)
- [本番環境インフラドキュメント](./production-infrastructure.md)

---

_最終更新日: 2025年_
