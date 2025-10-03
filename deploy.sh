#!/bin/bash

echo "🚀 MyBeing Deployment Script"
echo "============================"

echo "1. Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
    echo "2. Deploying to Vercel..."
    vercel deploy --prod --yes
    
    if [ $? -eq 0 ]; then
        echo "🎉 Deployment successful!"
        echo "3. Next steps:"
        echo "   - Set environment variables in Vercel dashboard"
        echo "   - Test your live application"
    else
        echo "❌ Deployment failed"
    fi
else
    echo "❌ Build failed"
fi
