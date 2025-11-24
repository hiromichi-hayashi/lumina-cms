# Lumina CMS - Frontend

> ✅ **Next.js 15 公式推奨構造に完全準拠したエンタープライズCMSフロントエンド**

Next.js + React + Tailwind CSS + Better Auth

## 🛠️ 技術スタック

- **Framework**: Next.js 15.5 (App Router)
- **UI Library**: React 19
- **スタイリング**: Tailwind CSS 3.4
- **UIコンポーネント**: shadcn/ui
- **認証**: Better Auth 1.3
- **バリデーション**: Zod
- **状態管理**: React Context API
- **言語**: TypeScript 5.x
- **Linter/Formatter**: ESLint, Prettier

## ✨ 主要な特徴

- ✅ **Next.js 15 App Router完全対応** - Route Groups、特殊ファイル（loading, error, not-found）
- ✅ **エンタープライズ級の構造** - スケーラブルなディレクトリ設計
- ✅ **型安全性** - TypeScript + Zodバリデーション
- ✅ **設定の一元管理** - config/ディレクトリで定数・ルート管理
- ✅ **3層コンポーネントアーキテクチャ** - 基盤層による高い再利用性
- ✅ **コンポーネント階層化** - ui/layout/features/shared の明確な分離
- ✅ **認証・テーマ管理** - React Context APIによる状態管理

## 📋 前提条件

- **Node.js 22.x** (プロジェクトルートの `.nvmrc` で指定)
- **npm** (Node.jsに付属)
- **バックエンドAPIが起動していること** (http://localhost:3001)

## 🚀 環境構築

### 1. 依存関係のインストール

```bash
cd frontend
npm install
```

### 2. 環境変数の設定

`.env.example` をコピーして `.env.local` を作成：

```bash
cp .env.example .env.local
```

**`.env.local` の内容:**

```env
# アプリケーション設定
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Lumina CMS

# バックエンドAPI接続先
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Better Auth設定（フロントエンド側）
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
```

**注意事項:**
- `NEXT_PUBLIC_` プレフィックスは、ブラウザからアクセス可能な変数
- `BETTER_AUTH_SECRET` はバックエンドと同じ値を設定
- 認証処理はバックエンドの Better Auth API を経由

### 3. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアクセス可能になります。

## 📜 利用可能なコマンド

### 開発

```bash
# 開発サーバー起動（ホットリロード有効）
npm run dev
```

### ビルド・本番

```bash
# 本番用ビルド
npm run build

# 本番モードで起動（ビルド後）
npm start
```

### コード品質

```bash
# ESLintによるコードチェック
npm run lint

# TypeScript型チェック
npm run type-check
```

## 📂 ディレクトリ構造と役割

> ✅ **Next.js 15 公式推奨構造に完全準拠**

```
frontend/
├── public/                      # 静的ファイル
│   ├── images/
│   │   ├── icons/              # favicon等のアイコン
│   │   └── logos/              # ロゴ画像
│   └── fonts/                  # カスタムフォント
│
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/          # 公開ページ（Route Group）
│   │   │   ├── layout.tsx      # 公開ページレイアウト
│   │   │   └── page.tsx        # ホームページ
│   │   │
│   │   ├── (protected)/       # 認証必須ページ（Route Group）
│   │   │   ├── layout.tsx      # 認証ページレイアウト
│   │   │   └── dashboard/      # ダッシュボード
│   │   │       └── page.tsx
│   │   │
│   │   ├── api/               # API Routes
│   │   │   └── auth/[...all]/ # Better Auth API
│   │   │       └── route.ts
│   │   │
│   │   ├── layout.tsx         # ルートレイアウト
│   │   ├── loading.tsx        # グローバルローディングUI
│   │   ├── error.tsx          # エラーバウンダリ
│   │   └── not-found.tsx      # 404ページ
│   │
│   ├── components/            # Reactコンポーネント
│   │   ├── ui/               # shadcn/uiベースコンポーネント
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/           # レイアウトコンポーネント
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Navigation.tsx
│   │   │
│   │   ├── features/         # 機能別コンポーネント
│   │   │   ├── auth/         # 認証関連
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── RegisterForm.tsx
│   │   │   ├── posts/        # 記事管理
│   │   │   ├── media/        # メディア管理
│   │   │   └── users/        # ユーザー管理
│   │   │
│   │   └── shared/           # 共通コンポーネント
│   │
│   ├── config/               # アプリケーション設定
│   │   ├── constants.ts      # 定数定義
│   │   ├── routes.ts         # ルート定義
│   │   ├── site.ts           # サイト設定
│   │   └── navigation.ts     # ナビゲーション設定
│   │
│   ├── context/              # React Context
│   │   ├── AuthContext.tsx   # 認証状態管理
│   │   └── ThemeContext.tsx  # テーマ管理
│   │
│   ├── hooks/                # カスタムReactフック
│   │   └── use-toast.ts
│   │
│   ├── lib/                  # ユーティリティとライブラリ
│   │   ├── api/              # APIクライアント
│   │   │   └── client.ts
│   │   │
│   │   ├── auth/             # Better Authクライアント
│   │   │   └── client.ts
│   │   │
│   │   ├── helpers/          # ヘルパー関数
│   │   │   ├── date.ts       # 日付操作
│   │   │   ├── string.ts     # 文字列操作
│   │   │   └── format.ts     # フォーマット
│   │   │
│   │   ├── constants/        # 定数
│   │   │   └── api.ts        # API関連定数
│   │   │
│   │   ├── validators/       # バリデーション
│   │   │   ├── auth.ts       # 認証フォーム
│   │   │   └── post.ts       # 記事フォーム
│   │   │
│   │   └── utils/            # ユーティリティ
│   │       ├── cn.ts         # classname結合
│   │       └── index.ts      # 統合エクスポート
│   │
│   ├── styles/               # スタイルシート
│   │   └── globals.css       # グローバルスタイル
│   │
│   ├── types/                # TypeScript型定義
│   │   ├── api.ts
│   │   └── models.ts
│   │
│   └── middleware.ts         # Next.jsミドルウェア
│
├── .env.local                # 環境変数（gitignore）
├── .env.example              # 環境変数サンプル
├── next.config.js            # Next.js設定
├── tailwind.config.js        # Tailwind CSS設定
├── components.json           # shadcn/ui設定
├── postcss.config.js         # PostCSS設定
├── tsconfig.json             # TypeScript設定
└── package.json              # npm設定
```

### 主要ディレクトリの役割

| ディレクトリ | 役割 |
|------------|------|
| `app/(public)/` | **Route Group**: 認証不要な公開ページ |
| `app/(protected)/` | **Route Group**: 認証必須の管理画面 |
| `components/ui/` | **Phase 0 - 基盤UIコンポーネント**（shadcn/ui） |
| `components/layout/` | **Phase 0 - レイアウトコンポーネント**（Header, Footer, AdminSidebar等） |
| `components/features/` | **Phase 1-6 - 機能別コンポーネント**（auth, posts, users等） |
| `components/shared/` | **共有コンポーネント**（複数機能で利用） |
| `config/` | **設定の一元管理**（定数、ルート、サイト設定） |
| `context/` | **React Context**（認証、テーマ等の状態管理） |
| `lib/helpers/` | ヘルパー関数（日付、文字列、フォーマット） |
| `lib/validators/` | **Zodスキーマ**によるバリデーション |
| `styles/` | グローバルスタイルシート |

### Next.js 15 App Router 特殊ファイル

| ファイル | 役割 |
|---------|------|
| `layout.tsx` | ページレイアウト（共通UI） |
| `page.tsx` | ページコンテンツ |
| `loading.tsx` | ローディング状態のUI |
| `error.tsx` | エラーバウンダリ |
| `not-found.tsx` | 404ページ |
| `route.ts` | API Routes |

## 🎯 主要機能と設計パターン

### Route Groups（ルートグルーピング）

認証の有無でレイアウトを分離する **Next.js 15 推奨パターン** を採用：

```
app/
├── (public)/         # 公開ページ - 認証不要
│   ├── layout.tsx    # 公開用レイアウト
│   └── page.tsx      # ホームページ
│
└── (protected)/      # 管理画面 - 認証必須
    ├── layout.tsx    # 管理画面レイアウト
    └── dashboard/    # ダッシュボード
```

**メリット:**
- URLには影響しない（`/dashboard`のまま）
- レイアウトを明確に分離
- middlewareでの保護が容易

### React Context による状態管理

```typescript
// 認証状態の利用
import { useAuth } from '@/context/AuthContext'

function MyComponent() {
  const { user, isAuthenticated, signIn, signOut } = useAuth()
  // ...
}

// テーマの利用
import { useTheme } from '@/context/ThemeContext'

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  // ...
}
```

### 設定の一元管理（config/）

ハードコードを避け、設定を集約：

```typescript
// ルート定義の利用
import { PROTECTED_ROUTES } from '@/config/routes'

<Link href={PROTECTED_ROUTES.POSTS.LIST}>記事一覧</Link>
<Link href={PROTECTED_ROUTES.POSTS.EDIT('123')}>記事編集</Link>

// 定数の利用
import { API, PAGINATION } from '@/config/constants'

const response = await fetch(`${API.BASE_URL}/posts`, {
  timeout: API.TIMEOUT,
})
```

### Zodバリデーション

型安全なフォームバリデーション：

```typescript
import { loginSchema } from '@/lib/validators/auth'

// フォーム送信時
const result = loginSchema.safeParse(formData)

if (!result.success) {
  console.error(result.error.errors)
} else {
  // result.data は型安全
  await signIn(result.data.email, result.data.password)
}
```

## 🔐 認証の仕組み

このアプリケーションは **Better Auth** を使用した認証システムを採用しています。

### 認証フロー

1. **フロントエンド**: ユーザーがログインフォームに入力
2. **API Route** (`app/api/auth/[...all]/route.ts`): Better Auth APIをプロキシ
3. **バックエンド**: Better Auth がセッションを管理・検証
4. **Cookie**: セッショントークンがCookieに保存される
5. **Middleware**: `middleware.ts`で保護されたルートをチェック

### 認証状態の確認

```typescript
// Context経由（推奨）
import { useAuth } from '@/context/AuthContext'

function MyComponent() {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <LoginPrompt />
  }

  return <div>ようこそ、{user.name}さん</div>
}

// 直接クライアント経由
import { authClient } from '@/lib/auth/client'

const session = await authClient.getSession()
if (session?.user) {
  console.log('ログイン中:', session.user.email)
}
```

## 🎨 UIコンポーネントの追加

shadcn/ui コンポーネントを追加する場合：

```bash
# 例: Dialogコンポーネントを追加
npx shadcn@latest add dialog
```

追加されたコンポーネントは `src/components/ui/` に配置されます。

**注意:**
- 既存コンポーネントの変更は全画面に影響するため慎重に行ってください
- プロジェクト固有のカスタマイズが必要な場合は `shared/` に新規作成を検討

## 🧪 開発のベストプラクティス

### コーディング規約

- **TypeScript**: 型安全性を確保し、`any` の使用を避ける
- **関数コンポーネント**: クラスコンポーネントは使用しない
- **async/await**: Promise.then は避ける
- **ESLint/Prettier**: 自動フォーマットに従う
- **設定の集約**: 定数やルートは`config/`から参照
- **バリデーション**: Zodスキーマを`lib/validators/`に配置
- **Context優先**: グローバル状態は`context/`で管理

### ファイル命名規則

| 種類 | 命名規則 | 例 |
|------|---------|-----|
| コンポーネント | PascalCase | `Button.tsx`, `LoginForm.tsx` |
| ユーティリティ | camelCase | `apiClient.ts`, `formatDate.ts` |
| 定数 | UPPER_SNAKE_CASE | `API_ROUTES.ts` |
| ディレクトリ | kebab-case | `user-profile/` |
| Route Groups | (kebab-case) | `(public)/`, `(protected)/` |

### コンポーネント配置ルール

```
components/
├── ui/           # shadcn/uiベースのプリミティブコンポーネント
│                 # Button, Input, Card, Table, Dialog等（基本的に編集しない）
│
├── layout/       # レイアウトコンポーネント
│                 # AdminSidebar, Header, Footer, Navigation等
│                 # 全画面で共有される構造的なコンポーネント
│
├── features/     # 機能別コンポーネント
│   ├── auth/     # 認証機能（ログイン、登録等）
│   ├── posts/    # 記事管理（一覧、編集、プレビュー等）
│   ├── users/    # ユーザー管理
│   ├── categories/ # カテゴリ管理
│   ├── labels/   # ラベル管理
│   ├── contacts/ # お問い合わせ管理
│   └── rankings/ # ランキング表示
│
└── shared/       # 複数機能で共有される汎用コンポーネント
                  # ImageWithFallback, EmptyState等
```

**配置の判断基準:**

| 条件 | 配置先 | 例 |
|------|--------|-----|
| shadcn/uiから追加したプリミティブUI | `ui/` | Button, Input, Card, Dialog |
| 全画面で使うレイアウト構造 | `layout/` | AdminSidebar, Header, Footer |
| 特定機能に紐づくビジネスロジック | `features/[feature]/` | UserManagement, PostEditor |
| 複数機能で再利用される汎用UI | `shared/` | ImageWithFallback, LoadingSpinner |

**Phase 0 依存関係:**
- すべての `features/` コンポーネントは `ui/` と `layout/` に依存
- `features/` 間の相互依存は避ける（疎結合を維持）
- 共通ロジックは `lib/` または `shared/` に抽出

### ヘルパー関数の配置

```typescript
// 日付関連 → lib/helpers/date.ts
import { formatDate, getRelativeTime } from '@/lib/helpers/date'

// 文字列関連 → lib/helpers/string.ts
import { truncate, slugify } from '@/lib/helpers/string'

// フォーマット関連 → lib/helpers/format.ts
import { formatNumber, formatFileSize } from '@/lib/helpers/format'
```

## 🔧 トラブルシューティング

### ポートが既に使用されている

```bash
# プロセスを確認
lsof -i :3000

# プロセスを終了
kill -9 <PID>
```

### モジュールが見つからない

```bash
# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

### ビルドエラー

```bash
# キャッシュをクリア
rm -rf .next
npm run build
```

### 型エラー

```bash
# 型チェック実行
npm run type-check

# TypeScriptサーバー再起動（VSCode）
Cmd+Shift+P → "TypeScript: Restart TS Server"
```
