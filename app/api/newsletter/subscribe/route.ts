import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ipRateLimit } from '@/lib/rate-limit';
import { prisma } from '@/lib/db';

// Validation schema
const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  preferences: z.object({
    weeklyInsights: z.boolean().default(true),
    newQuizzes: z.boolean().default(true),
    researchUpdates: z.boolean().default(false)
  }).default({
    weeklyInsights: true,
    newQuizzes: true,
    researchUpdates: false
  }),
  source: z.string().optional(),
  leadMagnet: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional()
});

export async function POST(req: NextRequest) {
  try {
    // Rate limiting - 5 subscriptions per minute per IP
    await ipRateLimit.check(req, 5);

    // Parse and validate request
    const body = await req.json();
    const { email, preferences, source, leadMagnet, firstName, lastName } = subscribeSchema.parse(body);

    // Check if already subscribed
    const existingSubscription = await prisma.newsletter.findUnique({
      where: { email }
    });

    if (existingSubscription) {
      // Update preferences if already subscribed
      await prisma.newsletter.update({
        where: { email },
        data: {
          preferences: JSON.stringify(preferences),
          source: source || existingSubscription.source,
          leadMagnet: leadMagnet || existingSubscription.leadMagnet,
          updatedAt: new Date()
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Preferences updated successfully',
        isNewSubscriber: false
      });
    }

    // Create new subscription
    const subscription = await prisma.newsletter.create({
      data: {
        email,
        firstName,
        lastName,
        preferences: JSON.stringify(preferences),
        source: source || 'website',
        leadMagnet,
        isActive: true,
        confirmedAt: new Date() // Auto-confirm for now, implement double opt-in later
      }
    });

    // Send welcome email (implement email service)
    try {
      await sendWelcomeEmail(email, {
        firstName,
        leadMagnet,
        preferences
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the subscription if email fails
    }

    // Track analytics
    try {
      await prisma.analytics.create({
        data: {
          event: 'newsletter_signup',
          sessionId: req.headers.get('x-session-id') || 'unknown',
          data: JSON.stringify({
            email: email.split('@')[1], // Store domain only for privacy
            source,
            leadMagnet,
            preferences
          })
        }
      });
    } catch (analyticsError) {
      console.error('Failed to track newsletter signup:', analyticsError);
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      isNewSubscriber: true,
      subscriptionId: subscription.id
    });

  } catch (error: any) {
    console.error('Newsletter subscription error:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid subscription data', 
          details: error.format()
        },
        { status: 400 }
      );
    }

    // Handle rate limiting
    if (error.message?.includes('Rate limit exceeded')) {
      return NextResponse.json(
        { 
          error: 'Too many subscription attempts', 
          message: 'Please wait before trying again.'
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to subscribe to newsletter', 
        message: 'Please try again later.'
      },
      { status: 500 }
    );
  }
}

// Unsubscribe endpoint
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // For now, simple email-based unsubscribe
    // In production, implement secure token-based unsubscribe
    const subscription = await prisma.newsletter.findUnique({
      where: { email }
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Soft delete - mark as inactive
    await prisma.newsletter.update({
      where: { email },
      data: {
        isActive: false,
        unsubscribedAt: new Date()
      }
    });

    // Track unsubscribe
    try {
      await prisma.analytics.create({
        data: {
          event: 'newsletter_unsubscribe',
          data: JSON.stringify({
            email: email.split('@')[1], // Domain only
            reason: 'user_request'
          })
        }
      });
    } catch (analyticsError) {
      console.error('Failed to track unsubscribe:', analyticsError);
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });

  } catch (error: any) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}

// Helper function to send welcome email
async function sendWelcomeEmail(
  email: string, 
  data: { 
    firstName?: string; 
    leadMagnet?: string; 
    preferences: any 
  }
) {
  // This would integrate with your email service (SendGrid, Mailgun, etc.)
  // For now, just log the email that would be sent
  
  const emailContent = {
    to: email,
    subject: data.leadMagnet 
      ? `Your free guide: ${data.leadMagnet}` 
      : 'Welcome to MyBeing!',
    template: 'welcome',
    data: {
      firstName: data.firstName || 'Friend',
      leadMagnet: data.leadMagnet,
      preferences: data.preferences,
      unsubscribeUrl: `${process.env.NEXT_PUBLIC_DOMAIN}/unsubscribe?email=${encodeURIComponent(email)}`
    }
  };

  console.log('Would send welcome email:', emailContent);
  
  // TODO: Implement actual email sending
  // await emailService.send(emailContent);
}

export const dynamic = 'force-dynamic';
