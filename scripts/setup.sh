#!/bin/bash
# Lumina CMS Environment Setup Script

set -e

echo "🚀 Setting up Lumina CMS Environment..."

# Check and setup Node.js version with nvm
echo "📦 Setting up Node.js environment..."
if command -v nvm &> /dev/null; then
    echo "✅ NVM found"

    # Install and use Node.js 22.0.0
    echo "📦 Installing Node.js 22.0.0..."
    nvm install 22.0.0
    nvm use 22.0.0

    echo "✅ Node.js version: $(node --version)"
    echo "✅ npm version: $(npm --version)"
else
    echo "❌ NVM not found!"
    echo "📝 Please install nvm first:"
    echo "   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo "   Then restart your terminal and run this script again."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Set up environment variables
echo "🔧 Setting up environment variables..."
if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
    echo "✅ Created .env.local from .env.example"
    echo "⚠️  Please update .env.local with your actual values"
else
    echo "✅ .env.local already exists"
fi

echo "📦 Installing workspace dependencies..."
npm install --workspace=web --legacy-peer-deps
npm install --workspace=api --legacy-peer-deps
npm install --workspace=contracts --legacy-peer-deps
npm install --workspace=db --legacy-peer-deps
npm install --workspace=env --legacy-peer-deps

echo "🔨 Building shared packages..."
npm run build --workspace=contracts
npm run build --workspace=env

# Start PostgreSQL database only
echo "🐳 Starting PostgreSQL database..."
docker-compose up -d postgres

echo "⏳ Waiting for database to be ready..."
sleep 10

# Generate Prisma client and run migrations
echo "🗄️  Setting up database..."
npm run db:generate
npm run db:migrate:dev --name init
npm run db:seed

echo "✅ Environment setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env.local with your actual environment values"
echo "2. Run 'npm run dev' to start both frontend and API servers"
echo "3. Visit http://localhost:3000 for the frontend"
echo "4. Visit http://localhost:8080/docs for the API documentation"
echo ""
echo "💡 Tips for team development:"
echo "- Always run 'nvm use' when switching to this project"
echo "- Use 'docker-compose up -d postgres' to start just the database"
echo "- PostgreSQL runs in Docker, Node.js apps run locally with nvm"
echo ""
echo "🎉 Happy coding!"
