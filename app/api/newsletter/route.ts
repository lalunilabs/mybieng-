import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { sendNewsletterWelcome, sendNewsletterConfirm } from '@/lib/email';
import { ipRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - 5 newsletter signups per minute per IP
    await ipRateLimit.check(request, 5);

    const body = await request.json();
    const { email, source = 'website' } = body;

    // Input validation
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Enhanced email format validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Sanitize email
    const sanitizedEmail = email.toLowerCase().trim();

    // Block common disposable email domains
    const disposableDomains = ['tempmail.org', '10minutemail.com', 'guerrillamail.com', 'mailinator.com'];
    const emailDomain = sanitizedEmail.split('@')[1];
    if (disposableDomains.includes(emailDomain)) {
      return NextResponse.json(
        { error: 'Please use a permanent email address' },
        { status: 400 }
      );
    }

    const DOUBLE_OPT_IN = (process.env.NEWSLETTER_DOUBLE_OPT_IN || '').toLowerCase() === 'true';

    // Rate limiting placeholder (can integrate later)
    
    // Check if already subscribed (direct lookup by email)
    const existing = await DatabaseService.getNewsletterSubscriptionByEmail(sanitizedEmail);
    if (existing && existing.active) {
      return NextResponse.json(
        { message: 'Already subscribed!', confirmed: true },
        { status: 200 }
      );
    }

    // Double opt-in flow
    if (DOUBLE_OPT_IN) {
      // Ensure a record exists but inactive
      await DatabaseService.upsertNewsletterSubscription({
        email: sanitizedEmail,
        active: false,
        subscribed_at: new Date().toISOString(),
      });

      // Send confirmation email asynchronously
      sendNewsletterConfirm(sanitizedEmail)
        .then((sent) => {
          if (!sent) console.warn('Confirmation email not sent (provider disabled or failed):', sanitizedEmail);
        })
        .catch((e) => console.warn('Confirmation email threw unexpectedly:', e));

      return NextResponse.json(
        { message: 'Please check your email to confirm your subscription.', confirmed: false },
        { status: 201 }
      );
    }

    // Immediate subscribe (no double opt-in)
    if (existing && !existing.active) {
      await DatabaseService.activateNewsletterSubscriptionByEmail(sanitizedEmail);
    } else {
      await DatabaseService.upsertNewsletterSubscription({
        email: sanitizedEmail,
        active: true,
        subscribed_at: new Date().toISOString(),
      });
    }

    // Fire-and-forget welcome email (non-blocking for user success)
    sendNewsletterWelcome(sanitizedEmail)
      .then((sent) => {
        if (!sent) console.warn('Welcome email not sent (provider disabled or failed):', sanitizedEmail);
      })
      .catch((e) => console.warn('Welcome email threw unexpectedly:', e));

    return NextResponse.json(
      { message: 'Successfully subscribed!', confirmed: true },
      { status: 201 }
    );
  } catch (error: any) {
    // Handle rate limiting errors
    if (error.message?.includes('Rate limit exceeded')) {
      return NextResponse.json(
        { error: 'Too many subscription attempts. Please try again later.' },
        { status: 429 }
      );
    }
    
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const subscriptions = await DatabaseService.getNewsletterSubscriptions();
    return NextResponse.json({
      success: true,
      data: subscriptions,
      count: subscriptions.length
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}
