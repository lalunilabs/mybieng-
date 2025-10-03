// Migration script to help transition from in-memory to database storage
// This is a one-time migration helper for any existing data

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateToDatabase() {
  console.log('🔄 Starting migration to database-backed storage...\n');

  try {
    // Check database connection
    console.log('📡 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connected\n');

    // Check if tables exist
    console.log('🔍 Verifying schema...');
    const tableCheck = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('Subscription', 'Purchase', 'ManualDiscount', 'AIConversation', 'EmailLog', 'WebhookEvent')
    `;
    console.log(`✅ Found ${(tableCheck as any[]).length} new tables\n`);

    // Count existing records
    console.log('📊 Current database status:');
    const [
      userCount,
      subscriptionCount,
      purchaseCount,
      discountCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.subscription.count(),
      prisma.purchase.count(),
      prisma.manualDiscount.count(),
    ]);

    console.log(`  Users: ${userCount}`);
    console.log(`  Subscriptions: ${subscriptionCount}`);
    console.log(`  Purchases: ${purchaseCount}`);
    console.log(`  Discounts: ${discountCount}\n`);

    if (subscriptionCount === 0 && userCount > 0) {
      console.log('ℹ️  No subscriptions found. This is expected for new installations.');
      console.log('   Users can now subscribe through Stripe checkout.\n');
    }

    // Verify indexes
    console.log('🔍 Verifying indexes...');
    const indexes = await prisma.$queryRaw`
      SELECT indexname, tablename 
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      AND tablename IN ('Subscription', 'Purchase', 'ManualDiscount')
      ORDER BY tablename, indexname
    `;
    console.log(`✅ Found ${(indexes as any[]).length} indexes\n`);

    console.log('✅ Migration verification complete!\n');
    console.log('📋 Next Steps:');
    console.log('─────────────────────────────────────────');
    console.log('1. Set up Stripe: npm run setup:stripe');
    console.log('2. Configure email provider in .env');
    console.log('3. Test subscription flow in development');
    console.log('4. Set up webhook endpoint');
    console.log('─────────────────────────────────────────\n');

  } catch (error: any) {
    console.error('❌ Migration check failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrateToDatabase();
