#!/usr/bin/env node

/**
 * Build-safe script for MyBeing
 * Ensures build succeeds even without database connection
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting build-safe process...');

// Set environment variables for build
process.env.NODE_ENV = 'production';
process.env.SKIP_BUILD = 'true';

// Create a temporary .env.build file if .env.local doesn't exist
const envLocalPath = path.join(process.cwd(), '.env.local');
const envBuildPath = path.join(process.cwd(), '.env.build');

if (!fs.existsSync(envLocalPath)) {
  console.log('⚠️  No .env.local found, creating minimal .env.build...');
  const minimalEnv = `# Build environment variables
NODE_ENV=production
NEXTAUTH_SECRET=build-secret-placeholder
DATABASE_URL=postgresql://placeholder
DIRECT_URL=postgresql://placeholder
OPENAI_API_KEY=placeholder
RESEND_API_KEY=placeholder
OWNER_EMAIL=placeholder@example.com
`;
  fs.writeFileSync(envBuildPath, minimalEnv);
  console.log('✅ Created .env.build for build process');
}

try {
  console.log('📦 Running Next.js build...');
  execSync('npm run build', { 
    stdio: 'inherit',
    env: { 
      ...process.env,
      SKIP_BUILD: 'true' // Skip database connections during build
    }
  });
  
  console.log('✅ Build completed successfully!');
  
  // Clean up temporary .env.build
  if (fs.existsSync(envBuildPath)) {
    fs.unlinkSync(envBuildPath);
    console.log('🧹 Cleaned up temporary .env.build');
  }
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  
  // Clean up temporary .env.build
  if (fs.existsSync(envBuildPath)) {
    fs.unlinkSync(envBuildPath);
  }
  
  process.exit(1);
}
