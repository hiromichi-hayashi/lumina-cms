#!/bin/bash
# Lumina CMS Health Check Script

echo "🔍 Lumina CMS 環境チェック開始..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Track overall status
ALL_GOOD=true

# 1. Node.js バージョンチェック
echo ""
echo "📦 Node.js環境チェック..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    if [[ "$NODE_VERSION" == v22.* ]]; then
        echo -e "${GREEN}✅ Node.js: $NODE_VERSION${NC}"
    else
        echo -e "${YELLOW}⚠️  Node.js: $NODE_VERSION (推奨: v22.0.0)${NC}"
    fi
else
    echo -e "${RED}❌ Node.jsがインストールされていません${NC}"
    ALL_GOOD=false
fi

# 2. npm バージョンチェック
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm: v$NPM_VERSION${NC}"
else
    echo -e "${RED}❌ npmがインストールされていません${NC}"
    ALL_GOOD=false
fi

# 3. Docker & PostgreSQL チェック
echo ""
echo "🐳 Docker & データベースチェック..."
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ Dockerがインストールされています${NC}"

    # PostgreSQLコンテナの状態確認
    if docker ps | grep -q lumina-postgres; then
        echo -e "${GREEN}✅ PostgreSQLコンテナが起動中${NC}"

        # データベース接続テスト
        if docker exec lumina-postgres pg_isready -U postgres &> /dev/null; then
            echo -e "${GREEN}✅ PostgreSQLデータベースが応答しています${NC}"
        else
            echo -e "${RED}❌ PostgreSQLデータベースが応答していません${NC}"
            ALL_GOOD=false
        fi
    else
        echo -e "${YELLOW}⚠️  PostgreSQLコンテナが起動していません${NC}"
        echo "  実行: docker-compose up -d postgres"
    fi
else
    echo -e "${RED}❌ Dockerがインストールされていません${NC}"
    ALL_GOOD=false
fi

# 4. フロントエンド (Next.js) チェック
echo ""
echo "🌐 フロントエンドサーバーチェック..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|404"; then
    echo -e "${GREEN}✅ Next.js サーバーが起動中 (http://localhost:3000)${NC}"

    # ページタイトル確認
    if curl -s http://localhost:3000 | grep -q "Lumina CMS"; then
        echo -e "${GREEN}✅ フロントエンドページが正常に表示されています${NC}"
    else
        echo -e "${YELLOW}⚠️  フロントエンドページの内容が確認できません${NC}"
    fi
elif curl -s -o /dev/null -w "%{http_code}" http://localhost:3001 | grep -q "200\|404"; then
    echo -e "${GREEN}✅ Next.js サーバーが起動中 (http://localhost:3001)${NC}"
else
    echo -e "${YELLOW}⚠️  Next.jsサーバーが起動していません${NC}"
    echo "  実行: cd apps/web && npm run dev"
fi

# 5. バックエンド API (Fastify) チェック
echo ""
echo "🔌 APIサーバーチェック..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/health | grep -q "200"; then
    echo -e "${GREEN}✅ Fastify APIサーバーが起動中 (http://localhost:8080)${NC}"

    # Health endpoint確認
    HEALTH_RESPONSE=$(curl -s http://localhost:8080/health)
    if echo "$HEALTH_RESPONSE" | grep -q "ok"; then
        echo -e "${GREEN}✅ APIヘルスチェックが正常${NC}"
    else
        echo -e "${YELLOW}⚠️  APIヘルスチェックの応答が異常です${NC}"
    fi

    # Swagger確認
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/docs | grep -q "200"; then
        echo -e "${GREEN}✅ API Documentationが利用可能 (http://localhost:8080/docs)${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  APIサーバーが起動していません${NC}"
    echo "  実行: cd apps/api && npm run dev"
fi

# 6. 環境変数チェック
echo ""
echo "🔐 環境変数チェック..."
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✅ .env.localファイルが存在します${NC}"

    # 必須環境変数の確認
    if grep -q "DATABASE_URL=" .env.local; then
        echo -e "${GREEN}✅ DATABASE_URLが設定されています${NC}"
    else
        echo -e "${RED}❌ DATABASE_URLが設定されていません${NC}"
        ALL_GOOD=false
    fi
else
    echo -e "${RED}❌ .env.localファイルが存在しません${NC}"
    echo "  実行: cp .env.example .env.local"
    ALL_GOOD=false
fi

# 7. 依存関係チェック
echo ""
echo "📚 依存関係チェック..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ node_modulesが存在します${NC}"
else
    echo -e "${RED}❌ node_modulesが存在しません${NC}"
    echo "  実行: npm install --legacy-peer-deps"
    ALL_GOOD=false
fi

# 8. Prismaクライアントチェック
if [ -d "node_modules/.prisma" ]; then
    echo -e "${GREEN}✅ Prismaクライアントが生成されています${NC}"
else
    echo -e "${YELLOW}⚠️  Prismaクライアントが生成されていません${NC}"
    echo "  実行: npm run db:generate"
fi

# 総合結果
echo ""
echo "=================================="
if [ "$ALL_GOOD" = true ]; then
    echo -e "${GREEN}✅ 環境チェック完了: すべて正常です！${NC}"
    echo ""
    echo "📋 アクセス先:"
    echo "  - フロントエンド: http://localhost:3000"
    echo "  - API: http://localhost:8080"
    echo "  - API Docs: http://localhost:8080/docs"
    echo "  - Prisma Studio: npm run db:studio"
else
    echo -e "${RED}❌ 環境チェック完了: 問題が見つかりました${NC}"
    echo ""
    echo "📝 推奨される修正手順:"
    echo "  1. nvm use"
    echo "  2. npm install --legacy-peer-deps"
    echo "  3. docker-compose up -d postgres"
    echo "  4. npm run db:generate"
    echo "  5. npm run dev"
fi

echo ""
echo "🔄 再チェック: ./scripts/health-check.sh"
