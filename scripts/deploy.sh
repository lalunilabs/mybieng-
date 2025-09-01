#!/bin/bash

# MyBeing Platform Deployment Script
# This script helps deploy your platform to various hosting providers

set -e

echo "🚀 MyBeing Platform Deployment Script"
echo "======================================"

# Check if environment file exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local file not found!"
    echo "Please copy .env.production to .env.local and fill in your values."
    exit 1
fi

# Check required environment variables
echo "🔍 Checking environment variables..."

required_vars=(
    "NEXTAUTH_URL"
    "NEXTAUTH_SECRET"
    "OWNER_EMAIL"
    "SUPABASE_URL"
    "SUPABASE_ANON_KEY"
    "EMAIL_API_KEY"
    "OPENAI_API_KEY"
)

missing_vars=()
for var in "${required_vars[@]}"; do
    if ! grep -q "^${var}=" .env.local || grep -q "^${var}=$" .env.local || grep -q "^${var}=your-" .env.local; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "❌ Missing or incomplete environment variables:"
    printf '%s\n' "${missing_vars[@]}"
    echo ""
    echo "Please update your .env.local file with actual values."
    exit 1
fi

echo "✅ Environment variables configured"

# Build the application
echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful"

# Ask for deployment target
echo ""
echo "Select deployment target:"
echo "1) Vercel"
echo "2) Netlify" 
echo "3) Railway"
echo "4) DigitalOcean App Platform"
echo "5) Custom (manual)"

read -p "Enter choice (1-5): " choice

case $choice in
    1)
        echo "🚀 Deploying to Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "Installing Vercel CLI..."
            npm install -g vercel
        fi
        vercel --prod
        ;;
    2)
        echo "🚀 Deploying to Netlify..."
        if ! command -v netlify &> /dev/null; then
            echo "Installing Netlify CLI..."
            npm install -g netlify-cli
        fi
        netlify deploy --prod --dir=.next
        ;;
    3)
        echo "🚀 Deploying to Railway..."
        if ! command -v railway &> /dev/null; then
            echo "Installing Railway CLI..."
            npm install -g @railway/cli
        fi
        railway deploy
        ;;
    4)
        echo "🚀 Deploying to DigitalOcean..."
        echo "Please follow the DigitalOcean App Platform documentation"
        echo "Upload your built application to your DigitalOcean app"
        ;;
    5)
        echo "📦 Manual deployment selected"
        echo "Your built application is ready in the .next directory"
        echo "Upload this to your hosting provider"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment process completed!"
echo ""
echo "📋 Post-deployment checklist:"
echo "- ✅ Verify your domain is working"
echo "- ✅ Test user registration/login"
echo "- ✅ Test quiz functionality"
echo "- ✅ Test admin panel access"
echo "- ✅ Verify email delivery"
echo "- ✅ Check database connectivity"
echo ""
echo "🔗 Your MyBeing platform should now be live!"
