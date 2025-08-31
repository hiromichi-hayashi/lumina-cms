# Lumina CMS環境構築プロンプト

## プロジェクト概要

Next.js 14.2とFastify 5.xを使用したLumina CMSのモノレポ環境を構築してください。Turborepoを使用し、フロントエンド・バックエンド・共有パッケージを効率的に管理する構成とします。データベースのみDockerコンテナで管理し、Node.js環境はnvmで統一します。

## 技術スタック要件

- **モノレポ**: Turborepo
- **パッケージマネージャー**: npm (workspaces)
- **フロントエンド**: Next.js 14.2 (App Router)
- **バックエンド**: Fastify 5.x
- **データベース**: PostgreSQL (Dockerコンテナ) + Prisma ORM
- **スタイリング**: Tailwind CSS + shadcn/ui
- **バリデーション**: Zod
- **認証**: JWT認証
- **Node.js**: 22.x LTS (nvmで管理)
- **テスト**:
  - Jest (単体テスト・統合テスト)
  - @testing-library/react (Reactコンポーネントテスト)
  - Playwright (E2Eテスト)
  - Storybook (UIコンポーネントカタログ・ビジュアルテスト)
  - supertest (APIテスト)

## ディレクトリ構造

以下の構造でプロジェクトを作成してください：

```
lumina-cms/
├── apps/
│   ├── web/                      # Next.js フロントエンド
│   └── api/                      # Fastify バックエンド
├── packages/
│   ├── contracts/                # API契約（Zodスキーマ）
│   ├── env/                      # 環境変数管理
│   ├── db/                       # Prismaクライアント
│   ├── config/                   # 共有設定
│   ├── tsconfig/                 # TypeScript設定
│   └── shared/                   # 共有ユーティリティ
├── scripts/                      # ユーティリティスクリプト
│   ├── health-check.sh           # 環境チェックスクリプト
│   └── setup.sh                  # セットアップスクリプト
├── turbo.json
├── package.json
├── docker-compose.yml            # PostgreSQLのみ
├── .nvmrc                        # Node.jsバージョン指定
├── .prettierrc                   # コードフォーマット設定
├── .gitignore
└── .env.example
```

## 実装手順

### 1. プロジェクト初期化

```bash
# プロジェクトディレクトリ作成
mkdir lumina-cms && cd lumina-cms

# package.json作成（ルート）
npm init -y

# .nvmrc作成（Node.js 22.x）
echo "22" > .nvmrc

# Turborepoインストール
npm install -D turbo
```

### 2. ルートpackage.json設定

```json
{
  "name": "lumina-cms",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "test": "turbo run test",
    "test:watch": "turbo run test:watch",
    "test:coverage": "turbo run test:coverage",
    "test:e2e": "turbo run test:e2e",
    "storybook": "turbo run storybook --filter=web",
    "db:generate": "npm run generate --workspace=db",
    "db:push": "npm run push --workspace=db",
    "db:migrate:dev": "npm run migrate:dev --workspace=db",
    "db:seed": "npm run seed --workspace=db",
    "db:studio": "npm run studio --workspace=db",
    "docker:up": "docker-compose up -d postgres",
    "docker:down": "docker-compose down",
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

### 3. turbo.json作成

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
    "test:watch": {
      "cache": false,
      "persistent": true
    },
    "test:coverage": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "test:e2e": {
      "dependsOn": ["build"],
      "outputs": ["test-results/**", "playwright-report/**"]
    },
    "storybook": {
      "cache": false,
      "persistent": true
    },
    "build-storybook": {
      "dependsOn": ["^build"],
      "outputs": ["storybook-static/**"]
    },
    "db:generate": {
      "cache": false,
      "outputs": ["node_modules/.prisma/**"]
    }
  }
}
```

### 4. Next.jsアプリケーション作成（apps/web）

```bash
# apps/webディレクトリ作成
mkdir -p apps/web
cd apps/web

# Next.js 14.2セットアップ
npx create-next-app@14.2 . --typescript --tailwind --app --no-src-dir --import-alias "@/*"

# 必要な依存関係追加
npm install @radix-ui/react-dialog @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react
npm install react-hook-form @hookform/resolvers zod axios dayjs
npm install -D @types/react @types/node

# テスト関連パッケージインストール
npm install -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D @playwright/test
npm install -D @storybook/react @storybook/nextjs @storybook/addon-essentials @storybook/addon-interactions
npm install -D jest-environment-jsdom
```

### 5. Fastify APIサーバー作成（apps/api）

```bash
# apps/apiディレクトリ作成
mkdir -p apps/api/src
cd apps/api

# package.json作成
npm init -y

# Fastify関連パッケージインストール
npm install fastify@5 @fastify/cors @fastify/helmet @fastify/rate-limit @fastify/swagger
npm install zod dotenv
npm install -D typescript tsx nodemon @types/node

# テスト関連パッケージインストール
npm install -D jest @types/jest ts-jest supertest @types/supertest
```

### 6. 共有パッケージ作成

#### packages/contracts（API契約）

```bash
mkdir -p packages/contracts/src
cd packages/contracts
npm init -y

# Zodインストール
npm install zod

# サンプルスキーマ作成（src/posts/create.contract.ts）
```

#### packages/db（Prismaデータベース）

```bash
mkdir -p packages/db/prisma
cd packages/db
npm init -y

# Prismaインストール
npm install @prisma/client
npm install -D prisma

# Prismaスキーマ作成（prisma/schema.prisma）
```

#### packages/env（環境変数管理）

```bash
mkdir -p packages/env/src
cd packages/env
npm init -y

# Zodインストール
npm install zod
```

#### packages/tsconfig（TypeScript設定）

```bash
mkdir -p packages/tsconfig
cd packages/tsconfig
npm init -y

# base.json, next.json, node.json作成
```

### 7. Prismaスキーマ定義（packages/db/prisma/schema.prisma）

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

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

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  tags      Tag[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("posts")
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  posts Post[]

  @@map("tags")
}
```

### 8. Docker Compose設定（docker-compose.yml）

```yaml
version: '3.8'

services:
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

### 9. 環境変数ファイル（.env.example）

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lumina"

# API
NEXT_PUBLIC_API_URL="http://localhost:8080"
API_PORT=8080

# Auth
JWT_SECRET="your-jwt-secret-must-be-at-least-32-characters-long"

# Environment
NODE_ENV="development"
```

### 10. PostgreSQLローカル設定

```bash
# PostgreSQLコンテナ起動（Dockerのみ使用）
docker-compose up -d postgres

# データベース接続確認
docker exec lumina-postgres pg_isready -U postgres

# Prismaマイグレーション実行
npm run db:generate
npm run db:migrate:dev
```

### 11. 主要ファイルの実装

#### Next.js App Router構造（apps/web/app）

- (marketing)グループ: ランディング、ブログ等の公開ページ
- (app)グループ: 認証済みダッシュボード
- \_features/: 機能別コンポーネント（auth, posts, users）
- api/: Route Handlers（必要に応じて）

#### Fastify APIサーバー（apps/api/src）

- app.ts: Fastifyインスタンス生成とプラグイン登録
- server.ts: サーバー起動
- plugins/: 横断的プラグイン（cors, helmet, prisma等）
- routes/: 機能別ルート（posts, users, auth）

#### shadcn/ui設定（apps/web）

```bash
# shadcn/ui初期化
npx shadcn-ui@latest init

# コンポーネント追加
npx shadcn-ui@latest add button card dialog form input label
```

### 12. 開発環境起動スクリプト

```bash
#!/bin/bash
# setup.sh

# Node.jsバージョン確認
nvm use

# 依存関係インストール
npm install

# 環境変数設定
cp .env.example .env.local

# Docker起動（PostgreSQLのみ）
docker-compose up -d postgres

# DBマイグレーション
npm run db:generate
npm run db:migrate:dev
npm run db:seed

# 開発サーバー起動
npm run dev
```

## 実装のポイント

1. **型安全性**: ZodスキーマをcontractsパッケージでAPI契約として一元管理
2. **認証**: JWT認証でセキュリティ確保
3. **スタイリング**: Tailwind CSS + shadcn/uiでモダンなUI実装
4. **パフォーマンス**: Next.js 14.2のSSG/ISR機能を活用
5. **開発効率**: Turborepoによる高速ビルドとホットリロード
6. **環境統一**: nvmによるNode.jsバージョン管理でチーム開発環境を統一
7. **軽量化**: データベースのみDockerコンテナ化し、開発環境を軽量に保つ

## テスト実装

### Jest設定（apps/web/jest.config.js）

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)': '<rootDir>/src/$1',
  },
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

### Jest設定（apps/api/jest.config.js）

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts

## デプロイ準備
本番環境はVercel Hobbyプランを使用：
- フロントエンド: Vercelで自動デプロイ
- API: Vercel FunctionsまたはNext.js API Routesに移行
- データベース: Supabase無料プラン

## 注意事項
- Node.js 22.x LTSを使用
- npm workspacesでモノレポ管理
- 環境変数は.env.localで管理（.gitignore必須）
- Prismaスキーマ変更後は必ず`npm run db:generate`実行

このプロンプトに従って、段階的に環境構築を進めてください。各ステップで必要なファイルの内容も生成し、動作確認を行いながら進めることを推奨します。: 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
}
```

### Playwright設定（apps/web/playwright.config.ts）

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

### Storybook設定（apps/web/.storybook/main.ts）

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

### サンプルテストファイル作成

#### Reactコンポーネントテスト（apps/web/src/components/ui/button.test.tsx）

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

#### APIテスト（apps/api/src/routes/posts/service.test.ts）

```typescript
import { PostService } from './service'
import { PrismaClient } from '@prisma/client'

jest.mock('@prisma/client')

describe('PostService', () => {
  let service: PostService
  let prisma: jest.Mocked<PrismaClient>

  beforeEach(() => {
    prisma = new PrismaClient() as jest.Mocked<PrismaClient>
    service = new PostService(prisma)
  })

  describe('findAll', () => {
    it('returns all posts', async () => {
      const mockPosts = [{ id: '1', title: 'Test Post', content: 'Content' }]
      prisma.post.findMany = jest.fn().mockResolvedValue(mockPosts)

      const result = await service.findAll({})
      expect(result).toEqual(mockPosts)
      expect(prisma.post.findMany).toHaveBeenCalled()
    })
  })
})
```

#### E2Eテスト（apps/web/tests/e2e/auth.spec.ts）

```typescript
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
  })

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/dashboard')
  })
})
```

## デプロイ準備

本番環境はVercel Hobbyプランを使用：

- フロントエンド: Vercelで自動デプロイ
- API: Vercel FunctionsまたはNext.js API Routesに移行
- データベース: Supabase無料プラン（PostgreSQL互換）

## 注意事項

- Node.js 22.x LTSを使用（nvmで管理）
- npm workspacesでモノレポ管理
- 環境変数は.env.localで管理（.gitignore必須）
- Prismaスキーマ変更後は必ず`npm run db:generate`実行
- データベースのみDockerコンテナで実行
- 開発サーバー（Next.js/Fastify）はローカルのNode.jsで実行
- `npm run health`で全環境の状態確認が可能

このプロンプトに従って、段階的に環境構築を進めてください。各ステップで必要なファイルの内容も生成し、動作確認を行いながら進めることを推奨します。
