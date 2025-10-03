# 🚀 Backend Quick Start Guide

Get your MyBeing backend production-ready in 15 minutes!

---

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Supabase recommended)
- Stripe account (test mode for development)
- Email provider account (optional for development)

---

## Step 1: Install Dependencies (2 min)

```bash
# Install Stripe package
npm install stripe@latest

# Or if using yarn
yarn add stripe@latest
```

---

## Step 2: Configure Environment Variables (3 min)

Copy the template and fill in your values:

```bash
cp .env.example .env.local
```

**Required variables:**

```bash
# Database (Supabase)
DATABASE_URL=postgresql://your-connection-string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-here

# Stripe (Test Mode)
STRIPE_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRICE_ID=price_your_price_id  # Will get this in Step 4
NEXT_PUBLIC_URL=http://localhost:3000

# Email (Development)
EMAIL_PROVIDER=console  # Logs emails to console
EMAIL_FROM=noreply@mybeing.com

# AI (Optional)
OPENAI_API_KEY=sk-your-openai-key  # For AI chat features
```

---

## Step 3: Run Database Migrations (3 min)

```bash
# Generate Prisma client with new models
npx prisma generate

# Run migrations to create new tables
npx prisma migrate dev --name add_subscription_payment_models

# Open Prisma Studio to verify (optional)
npx prisma studio
```

**What this creates:**
- `Subscription` - User subscriptions
- `Purchase` - Quiz/article purchases
- `ManualDiscount` - Promo codes
- `AIConversation` + `AIMessage` - Chat history
- `LongitudinalCheckin` - Daily/weekly check-ins
- `EmailLog` - Email tracking
- `WebhookEvent` - Webhook logs

---

## Step 4: Set Up Stripe (5 min)

### Option A: Automatic Setup (Recommended)

```bash
npm run setup:stripe
```

This script will:
- Create Premium product ($32/month)
- Create test product ($1/month) for development
- Output the Price IDs you need

### Option B: Manual Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Create Product: "MyBeing Premium"
3. Add Price: $32/month recurring
4. Copy the Price ID (starts with `price_`)
5. Add to `.env.local`: `STRIPE_PRICE_ID=price_xxx`

### Set Up Webhooks

**Development:**
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret to `.env.local`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

---

## Step 5: Verify Setup (2 min)

```bash
# Check database and migration status
npm run migrate:check

# Start development server
npm run dev
```

**Test the integration:**

1. Navigate to `http://localhost:3000`
2. Sign up/login
3. Go to subscription page
4. Test checkout with: `4242 4242 4242 4242` (test card)
5. Check console for webhook events
6. Verify subscription in Prisma Studio

---

## 🎉 You're Ready!

Your backend now supports:

✅ **Real Payments** - Stripe integration working
✅ **Subscriptions** - $32/month premium plan
✅ **Purchase Tracking** - All transactions logged
✅ **Email System** - Transactional emails ready
✅ **AI Chat Persistence** - Conversations saved
✅ **Usage Tracking** - Entitlements enforced
✅ **Webhook Handling** - Automatic sync with Stripe

---

## 📋 What's Different Now?

### Before (In-Memory)
```typescript
const subscription = getSubscriptionByEmail(email);
const purchased = hasPurchasedQuiz(email, slug);
```

### After (Database)
```typescript
const subscription = await getSubscriptionByUserId(userId);
const purchased = await hasPurchasedQuiz(userId, slug);
```

**Key changes:**
- All subscription functions are now `async`
- Use `userId` instead of `email`
- Data persists across restarts
- Stripe handles recurring billing

---

## 🧪 Testing Checklist

- [ ] User can sign up/login
- [ ] User can start subscription checkout
- [ ] Test card (4242...) completes payment
- [ ] Webhook creates subscription in database
- [ ] Email logged to console (check terminal)
- [ ] User sees premium features unlocked
- [ ] Quiz purchase applies subscription discount
- [ ] Usage limits tracked correctly
- [ ] AI chat saves conversation history

---

## 🔧 Troubleshooting

### "Module 'stripe' not found"
```bash
npm install stripe@latest
npx prisma generate
# Restart TypeScript server in IDE
```

### "Property 'subscription' does not exist on type 'PrismaClient'"
```bash
npx prisma generate
# Restart your IDE/editor
```

### Webhooks not working
```bash
# Check webhook is running
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Test webhook
stripe trigger checkout.session.completed
```

### Emails not sending
- Check `EMAIL_PROVIDER=console` in `.env.local`
- Look for email output in terminal where dev server is running
- For production: configure SendGrid or Postmark

---

## 📚 Next Steps

### Production Deployment

1. **Get Stripe Live Keys**
   ```bash
   # In Stripe Dashboard, switch to Live mode
   # Copy live keys to production .env
   ```

2. **Configure Production Webhook**
   ```
   Endpoint: https://yourdomain.com/api/webhooks/stripe
   Events: (same as development)
   ```

3. **Set Up Email Provider**
   ```bash
   # SendGrid or Postmark
   EMAIL_PROVIDER=sendgrid
   SENDGRID_API_KEY=SG.xxx
   ```

4. **Deploy Database Migration**
   ```bash
   npx prisma migrate deploy
   ```

### Enable Advanced Features

**AI Chat Persistence** (Already configured):
```typescript
// Save conversation
POST /api/chat/save

// Get history
GET /api/chat/history?conversationId=xxx
```

**User Entitlements** (Already configured):
```typescript
// Check what user can access
GET /api/user/entitlements
```

**Admin Analytics** (Phase 2):
- Research data exports
- User cohort analysis
- Quiz response patterns

---

## 🆘 Need Help?

1. Check `BACKEND-MIGRATION-GUIDE.md` for detailed docs
2. Review `BACKEND-IMPROVEMENTS-SUMMARY.md` for what changed
3. Open Prisma Studio: `npx prisma studio`
4. Check server logs for errors
5. Verify environment variables are set

---

## ✨ Key Files

**Core Logic:**
- `lib/subscription.ts` - Subscription management
- `lib/purchases.ts` - Purchase tracking
- `lib/stripe/client.ts` - Stripe API wrapper
- `lib/stripe/webhooks.ts` - Webhook handlers
- `lib/email/service.ts` - Email service
- `lib/usageTracking.ts` - Entitlement enforcement

**API Endpoints:**
- `app/api/subscription/create/route.ts` - Start checkout
- `app/api/webhooks/stripe/route.ts` - Handle Stripe events
- `app/api/user/entitlements/route.ts` - Check user access
- `app/api/chat/save/route.ts` - Save AI conversation
- `app/api/chat/history/route.ts` - Get chat history

**Database:**
- `prisma/schema.prisma` - All models defined here

---

## 🎯 Success Criteria

You'll know it's working when:

1. ✅ Test card creates subscription in database
2. ✅ Webhook events appear in console
3. ✅ Email logged for subscription welcome
4. ✅ User entitlements API returns correct data
5. ✅ AI chat history persists in database
6. ✅ Quiz purchases apply subscription discounts

**Congratulations! Your backend is production-ready! 🚀**
