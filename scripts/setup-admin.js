#!/usr/bin/env node

/**
 * Admin Setup Script for MyBeing Platform
 * Creates initial admin user and validates environment configuration
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m'
};

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function generateSecureSecret(length = 32) {
  return crypto.randomBytes(length).toString('base64');
}

function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  const envExamplePath = path.join(process.cwd(), '.env.example');
  
  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
      log('Creating .env.local from .env.example...', 'yellow');
      fs.copyFileSync(envExamplePath, envPath);
      log('✓ Created .env.local file', 'green');
    } else {
      log('✗ No .env.example file found', 'red');
      return false;
    }
  }
  
  return true;
}

function updateEnvFile(updates) {
  const envPath = path.join(process.cwd(), '.env.local');
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  for (const [key, value] of Object.entries(updates)) {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
      envContent += `\n${key}=${value}`;
    }
  }
  
  fs.writeFileSync(envPath, envContent);
}

function validateRequiredEnvVars() {
  const required = [
    'NEXTAUTH_SECRET',
    'ADMIN_JWT_SECRET',
    'OWNER_EMAIL',
    'OPENAI_API_KEY',
    'EMAIL_API_KEY',
    'FROM_EMAIL',
    'UNSUBSCRIBE_SECRET'
  ];
  
  const missing = [];
  const toUpdate = {};
  
  for (const varName of required) {
    const value = process.env[varName];
    if (!value || value.includes('replace-with') || value.includes('your_') || value.includes('your-')) {
      missing.push(varName);
      
      // Generate secure values for secrets
      if (varName.includes('SECRET')) {
        toUpdate[varName] = generateSecureSecret();
      }
    }
  }
  
  if (Object.keys(toUpdate).length > 0) {
    log('Generating secure secrets...', 'yellow');
    updateEnvFile(toUpdate);
    
    for (const [key, value] of Object.entries(toUpdate)) {
      log(`✓ Generated ${key}`, 'green');
    }
  }
  
  return missing.filter(key => !toUpdate[key]);
}

function displaySetupInstructions(missingVars) {
  log('\n🚀 MyBeing Admin Setup', 'cyan');
  log('========================', 'cyan');
  
  if (missingVars.length === 0) {
    log('✓ All required environment variables are configured!', 'green');
    log('\nNext steps:', 'blue');
    log('1. Start the development server: npm run dev', 'white');
    log('2. Visit http://localhost:3000/admin/login', 'white');
    log('3. Use your OWNER_EMAIL to access the admin dashboard', 'white');
    return;
  }
  
  log('⚠️  Configuration required:', 'yellow');
  log('Please update the following in your .env.local file:\n', 'white');
  
  for (const varName of missingVars) {
    switch (varName) {
      case 'OWNER_EMAIL':
        log(`${varName}=your-admin-email@domain.com`, 'yellow');
        log('  → Your email address for admin access\n', 'white');
        break;
      case 'OPENAI_API_KEY':
        log(`${varName}=sk-...`, 'yellow');
        log('  → Get from https://platform.openai.com/api-keys\n', 'white');
        break;
      case 'EMAIL_API_KEY':
        log(`${varName}=SG.xxx (SendGrid) or key-xxx (Mailgun)`, 'yellow');
        log('  → Email service API key for notifications\n', 'white');
        break;
      case 'FROM_EMAIL':
        log(`${varName}=noreply@yourdomain.com`, 'yellow');
        log('  → Email address for outgoing emails\n', 'white');
        break;
      default:
        log(`${varName}=<required-value>`, 'yellow');
        break;
    }
  }
  
  log('Optional but recommended:', 'blue');
  log('STRIPE_SECRET_KEY=sk_test_... (for payments)', 'white');
  log('SUPABASE_URL=https://xxx.supabase.co (for database)', 'white');
  log('REDIS_URL=redis://localhost:6379 (for caching)\n', 'white');
}

function displayAdminInfo() {
  log('\n🔐 Admin Access Information', 'magenta');
  log('============================', 'magenta');
  log('Admin Login URL: /admin/login', 'white');
  log('Demo Credentials (Development Only):', 'yellow');
  log('  Email: admin@mybeing.com', 'white');
  log('  Password: admin123', 'white');
  log('\nProduction Access:', 'green');
  log('  Use the email specified in OWNER_EMAIL', 'white');
  log('  Authentication handled by NextAuth.js\n', 'white');
}

function displaySecurityReminders() {
  log('🔒 Security Reminders', 'red');
  log('=====================', 'red');
  log('1. Never commit .env.local to version control', 'white');
  log('2. Use strong, unique secrets in production', 'white');
  log('3. Regularly rotate API keys and secrets', 'white');
  log('4. Enable HTTPS in production', 'white');
  log('5. Remove demo credentials in production\n', 'white');
}

// Main setup function
function main() {
  log('🎯 MyBeing Platform - Admin Setup', 'cyan');
  log('==================================\n', 'cyan');
  
  // Check and create .env.local if needed
  if (!checkEnvFile()) {
    log('✗ Setup failed: Could not create environment file', 'red');
    process.exit(1);
  }
  
  // Load environment variables
  require('dotenv').config({ path: '.env.local' });
  
  // Validate required environment variables
  const missingVars = validateRequiredEnvVars();
  
  // Display setup instructions
  displaySetupInstructions(missingVars);
  
  if (missingVars.length === 0) {
    displayAdminInfo();
  }
  
  displaySecurityReminders();
  
  if (missingVars.length > 0) {
    log('Run this script again after updating your .env.local file', 'yellow');
    process.exit(1);
  }
  
  log('✅ Setup complete! Your MyBeing admin is ready to go.', 'green');
}

// Run setup
if (require.main === module) {
  main();
}

module.exports = { generateSecureSecret, validateRequiredEnvVars };
