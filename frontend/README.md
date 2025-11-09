# Lumina CMS - Frontend

Next.js + React + Tailwind CSS + Better Auth

## 🛠️ 技術スタック

- **Framework**: Next.js 15.5 (App Router)
- **UI Library**: React 19
- **スタイリング**: Tailwind CSS 3.4
- **UIコンポーネント**: shadcn/ui
- **認証**: Better Auth 1.3
- **言語**: TypeScript 5.x
- **Linter/Formatter**: ESLint, Prettier

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

```
frontend/
├── public/                  # 静的ファイル（画像、favicon等）
│
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/auth/       # Better Auth API routes
│   │   │   └── [...all]/
│   │   │       └── route.ts  # 全認証エンドポイント
│   │   ├── layout.tsx      # ルートレイアウト（共通UI）
│   │   ├── page.tsx        # ホームページ
│   │   └── globals.css     # グローバルスタイル（Tailwind）
│   │
│   ├── components/         # Reactコンポーネント
│   │   ├── ui/            # shadcn/ui ベースUIコンポーネント
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   └── auth/          # 認証関連コンポーネント
│   │       ├── LoginForm.tsx
│   │       └── RegisterForm.tsx
│   │
│   ├── hooks/             # カスタムReactフック
│   │   └── use-toast.ts
│   │
│   ├── lib/               # ユーティリティとライブラリ
│   │   ├── api/           # APIクライアント
│   │   │   └── client.ts  # バックエンドAPI通信用
│   │   ├── auth/          # Better Authクライアント設定
│   │   │   └── client.ts  # 認証クライアント
│   │   └── utils/         # ヘルパー関数
│   │       ├── utils.ts
│   │       └── cn.ts      # classname結合ユーティリティ
│   │
│   ├── types/             # TypeScript型定義
│   │   ├── api.ts         # API型定義
│   │   └── models.ts      # モデル型定義
│   │
│   └── middleware.ts      # Next.jsミドルウェア（認証チェック等）
│
├── .env.local             # 環境変数（gitignore）
├── .env.example           # 環境変数サンプル
├── next.config.js         # Next.js設定
├── tailwind.config.js     # Tailwind CSS設定
├── components.json        # shadcn/ui設定
├── postcss.config.js      # PostCSS設定
├── tsconfig.json          # TypeScript設定
└── package.json           # npm設定
```

### 主要ディレクトリの役割

| ディレクトリ | 役割 |
|------------|------|
| `app/` | Next.js App Routerのページとレイアウト |
| `components/ui/` | 再利用可能なUIコンポーネント（shadcn/ui） |
| `components/auth/` | 認証フォームなど認証特化コンポーネント |
| `hooks/` | カスタムReactフック（useState、useEffectを使ったロジック） |
| `lib/api/` | バックエンドAPIとの通信ロジック |
| `lib/auth/` | Better Auth クライアント設定 |
| `lib/utils/` | ヘルパー関数・ユーティリティ |
| `types/` | TypeScript型定義（API、モデル） |

## 🔐 認証の仕組み

このアプリケーションは **Better Auth** を使用した認証システムを採用しています。

### 認証フロー

1. **フロントエンド**: ユーザーがログインフォームに入力
2. **API Route** (`app/api/auth/[...all]/route.ts`): Better Auth APIをプロキシ
3. **バックエンド**: Better Auth がセッションを管理・検証
4. **Cookie**: セッショントークンがCookieに保存される

### 認証状態の確認

```typescript
import { authClient } from '@/lib/auth/client'

// セッション取得
const session = await authClient.getSession()

// ログイン状態確認
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

## 🧪 開発のベストプラクティス

### コーディング規約

- **TypeScript**: 型安全性を確保し、`any` の使用を避ける
- **関数コンポーネント**: クラスコンポーネントは使用しない
- **async/await**: Promise.then は避ける
- **ESLint/Prettier**: 自動フォーマットに従う

### ファイル命名規則

| 種類 | 命名規則 | 例 |
|------|---------|-----|
| コンポーネント | PascalCase | `Button.tsx`, `LoginForm.tsx` |
| ユーティリティ | camelCase | `apiClient.ts`, `formatDate.ts` |
| 定数 | UPPER_SNAKE_CASE | `API_ROUTES.ts` |
| ディレクトリ | kebab-case | `user-profile/` |

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

## 📄 ライセンス

MIT License
