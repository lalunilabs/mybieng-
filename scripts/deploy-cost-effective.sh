#!/bin/bash

# MyBeing Cost-Effective Deployment Script
# Optimized for minimal costs and maximum performance

set -e

echo "🚀 Starting MyBeing cost-effective deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if required environment variables are set
check_env() {
    echo "🔍 Checking environment variables..."
    
    required_vars=(
        "SUPABASE_DATABASE_URL"
        "SUPABASE_DIRECT_URL"
        "NEXTAUTH_SECRET"
        "OPENAI_API_KEY"
        "RESEND_API_KEY"
    )
    
    missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            missing_vars+=($var)
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        echo -e "${RED}❌ Missing required environment variables:${NC}"
        printf '%s\n' "${missing_vars[@]}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ All required environment variables are set${NC}"
}

# Optimize build for performance
check_env

echo "📦 Optimizing build for cost-effectiveness..."

# Install dependencies with cache
npm ci --prefer-offline --no-audit --no-fund

# Run type checking
echo "🔍 Running type checks..."
npm run type-check

# Run linting
echo "🔍 Running linter..."
npm run lint

# Run tests
echo "🧪 Running tests..."
npm test

# Build with optimizations
echo "🏗️  Building optimized production bundle..."
NEXT_TELEMETRY_DISABLED=1 npm run build

# Check bundle size
echo "📊 Analyzing bundle size..."
npm run analyze || true

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
if command -v vercel &> /dev/null; then
    vercel --prod --yes
else
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
    vercel --prod --yes
fi

# Update database schema
echo "🗄️  Updating database schema..."
npx prisma db push

# Generate cost report
echo "💰 Generating cost report..."
node scripts/cost-monitor.js report

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo "📊 Next steps:"
echo "1. Check deployment: https://mybeing-self-discovery.vercel.app"
echo "2. Monitor costs: node scripts/cost-monitor.js report"
echo "3. Simulate growth: node scripts/cost-monitor.js simulate 100"
echo "4. Set up monitoring alerts"
echo ""
echo "💡 Cost optimization tips:"
echo "- Use static generation for quiz content"
echo "- Enable ISR for dynamic pages"
echo "- Compress images before upload"
echo "- Cache AI responses"
echo "- Monitor usage regularly"
