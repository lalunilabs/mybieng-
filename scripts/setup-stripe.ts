// Script to set up Stripe products and prices
// Run with: npx ts-node scripts/setup-stripe.ts

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY not set in environment variables');
  process.exit(1);
}

const SECRET = process.env.STRIPE_SECRET_KEY as string;

const stripe = new Stripe(SECRET, {
  apiVersion: '2025-02-24.acacia',
});

async function setupStripeProducts() {
  console.log('🚀 Setting up Stripe products for MyBeing...\n');

  try {
    // Create or get Premium product
    console.log('📦 Creating Premium subscription product...');
    const product = await stripe.products.create({
      name: 'MyBeing Premium',
      description: 'Premium subscription with unlimited AI conversations, free quizzes, and premium articles',
      metadata: {
        plan: 'premium',
        features: JSON.stringify([
          '2 free quizzes per month (up to $50 value each)',
          '3 premium articles per month',
          'Unlimited AI conversations',
          'Personalized content curation',
          'Custom learning plans',
          'Subscriber discounts on additional content',
          'Progress tracking',
        ]),
      },
    });
    console.log('✅ Product created:', product.id);

    // Create monthly price
    console.log('\n💰 Creating monthly price ($32/month)...');
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 3200, // $32.00 in cents
      currency: 'usd',
      recurring: {
        interval: 'month',
        interval_count: 1,
      },
      metadata: {
        plan: 'premium',
        billingPeriod: 'monthly',
      },
    });
    console.log('✅ Price created:', price.id);

    // Create test product and price for development
    if (SECRET.includes('test')) {
      console.log('\n🧪 Creating test product for development...');
      const testProduct = await stripe.products.create({
        name: 'MyBeing Premium (Test)',
        description: 'Test product for development',
        metadata: {
          plan: 'premium',
          environment: 'test',
        },
      });
      console.log('✅ Test product created:', testProduct.id);

      console.log('\n💰 Creating test price ($1/month)...');
      const testPrice = await stripe.prices.create({
        product: testProduct.id,
        unit_amount: 100, // $1.00 for testing
        currency: 'usd',
        recurring: {
          interval: 'month',
          interval_count: 1,
        },
        metadata: {
          plan: 'premium',
          billingPeriod: 'monthly',
          environment: 'test',
        },
      });
      console.log('✅ Test price created:', testPrice.id);

      console.log('\n\n📋 TEST ENVIRONMENT SETUP:');
      console.log('─────────────────────────────────────────');
      console.log('Add these to your .env.local for testing:');
      console.log(`STRIPE_PRICE_ID=${testPrice.id}`);
      console.log('\nTest with card: 4242 4242 4242 4242');
      console.log('─────────────────────────────────────────\n');
    }

    console.log('\n\n📋 PRODUCTION SETUP:');
    console.log('─────────────────────────────────────────');
    console.log('Add this to your .env.production:');
    console.log(`STRIPE_PRICE_ID=${price.id}`);
    console.log('\nProduct ID:', product.id);
    console.log('Price ID:', price.id);
    console.log('Amount: $32.00/month');
    console.log('─────────────────────────────────────────\n');

    // Set up webhook endpoints info
    console.log('\n📡 WEBHOOK SETUP:');
    console.log('─────────────────────────────────────────');
    console.log('Configure webhooks in Stripe Dashboard:');
    console.log('https://dashboard.stripe.com/webhooks');
    console.log('\nDevelopment:');
    console.log('  stripe listen --forward-to localhost:3000/api/webhooks/stripe');
    console.log('\nProduction:');
    console.log('  Endpoint: https://yourdomain.com/api/webhooks/stripe');
    console.log('\nRequired events:');
    console.log('  - checkout.session.completed');
    console.log('  - customer.subscription.created');
    console.log('  - customer.subscription.updated');
    console.log('  - customer.subscription.deleted');
    console.log('  - invoice.payment_succeeded');
    console.log('  - invoice.payment_failed');
    console.log('─────────────────────────────────────────\n');

    console.log('✅ Stripe setup complete!\n');
  } catch (error: any) {
    console.error('❌ Error setting up Stripe:', error.message);
    process.exit(1);
  }
}

setupStripeProducts();
