// Email service using SendGrid/Postmark for transactional emails
import { prisma } from '@/lib/db';

export enum EmailType {
  SUBSCRIPTION_WELCOME = 'subscription_welcome',
  SUBSCRIPTION_CANCELLED = 'subscription_cancelled',
  SUBSCRIPTION_REACTIVATED = 'subscription_reactivated',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  PURCHASE_RECEIPT = 'purchase_receipt',
  QUIZ_RESULTS = 'quiz_results',
  NEWSLETTER = 'newsletter',
  WELCOME = 'welcome',
}

interface EmailData {
  to: string;
  type: EmailType;
  data: Record<string, any>;
  userId?: string;
}

// Email templates
const EMAIL_TEMPLATES = {
  [EmailType.SUBSCRIPTION_WELCOME]: {
    subject: 'Welcome to MyBeing Premium! 🎉',
    template: (data: any) => `
      <h1>Welcome to MyBeing Premium, ${data.name}!</h1>
      <p>Thank you for subscribing. Your premium membership is now active.</p>
      <h2>What's Included:</h2>
      <ul>
        <li>2 free quizzes per month (up to $50 value each)</li>
        <li>3 premium articles per month</li>
        <li>Unlimited AI conversations</li>
        <li>Personalized content curation</li>
        <li>Progress tracking</li>
        <li>Subscriber discounts on additional content</li>
      </ul>
      <p><a href="${process.env.NEXT_PUBLIC_URL}/dashboard">Go to Your Dashboard</a></p>
    `,
  },
  [EmailType.SUBSCRIPTION_CANCELLED]: {
    subject: 'Your MyBeing Subscription Has Been Cancelled',
    template: (data: any) => `
      <h1>We're sorry to see you go, ${data.name}</h1>
      <p>Your premium subscription has been cancelled. You'll continue to have access until the end of your billing period.</p>
      <p>We'd love to hear your feedback on how we can improve.</p>
      <p><a href="${process.env.NEXT_PUBLIC_URL}/feedback">Share Your Feedback</a></p>
    `,
  },
  [EmailType.SUBSCRIPTION_REACTIVATED]: {
    subject: 'Welcome Back to MyBeing Premium!',
    template: (data: any) => `
      <h1>Welcome back, ${data.name}! 🎉</h1>
      <p>Your premium subscription has been reactivated. We're glad to have you back!</p>
      <p><a href="${process.env.NEXT_PUBLIC_URL}/dashboard">Go to Your Dashboard</a></p>
    `,
  },
  [EmailType.PAYMENT_SUCCESS]: {
    subject: 'Payment Successful - MyBeing Premium',
    template: (data: any) => `
      <h1>Payment Received</h1>
      <p>Hi ${data.name},</p>
      <p>We've successfully processed your payment of $${data.amount}.</p>
      ${data.invoiceUrl ? `<p><a href="${data.invoiceUrl}">View Invoice</a></p>` : ''}
      <p>Thank you for being a premium member!</p>
    `,
  },
  [EmailType.PAYMENT_FAILED]: {
    subject: 'Payment Failed - Action Required',
    template: (data: any) => `
      <h1>Payment Failed</h1>
      <p>Hi ${data.name},</p>
      <p>We were unable to process your payment of $${data.amount}.</p>
      <p>Please update your payment method to continue your premium membership.</p>
      <p><a href="${process.env.NEXT_PUBLIC_URL}/account/billing">Update Payment Method</a></p>
    `,
  },
  [EmailType.PURCHASE_RECEIPT]: {
    subject: 'Purchase Receipt - MyBeing',
    template: (data: any) => `
      <h1>Purchase Confirmation</h1>
      <p>Hi ${data.name},</p>
      <p>Thank you for your purchase!</p>
      <h2>Order Details:</h2>
      <p><strong>${data.itemType === 'quiz' ? 'Quiz' : 'Article'}:</strong> ${data.itemTitle}</p>
      <p><strong>Amount:</strong> $${data.amount}</p>
      <p><a href="${process.env.NEXT_PUBLIC_URL}/${data.itemType === 'quiz' ? 'quizzes' : 'articles'}/${data.itemId}">Access Your ${data.itemType === 'quiz' ? 'Quiz' : 'Article'}</a></p>
    `,
  },
  [EmailType.QUIZ_RESULTS]: {
    subject: 'Your Quiz Results - MyBeing',
    template: (data: any) => `
      <h1>Your Quiz Results: ${data.quizTitle}</h1>
      <p>Hi ${data.name},</p>
      <p>You've completed "${data.quizTitle}". Here's a summary of your results:</p>
      <div style="padding: 20px; background: #f5f5f5; border-radius: 8px; margin: 20px 0;">
        <h2>${data.band}</h2>
        <p>${data.summary}</p>
      </div>
      <p><a href="${process.env.NEXT_PUBLIC_URL}/quizzes/${data.quizSlug}/results/${data.runId}">View Full Results</a></p>
      <p>Want to dive deeper? Chat with our AI about your results!</p>
    `,
  },
  [EmailType.WELCOME]: {
    subject: 'Welcome to MyBeing!',
    template: (data: any) => `
      <h1>Welcome to MyBeing, ${data.name}!</h1>
      <p>We're excited to have you on your self-discovery journey.</p>
      <h2>Get Started:</h2>
      <ul>
        <li><a href="${process.env.NEXT_PUBLIC_URL}/quizzes">Take your first quiz</a></li>
        <li><a href="${process.env.NEXT_PUBLIC_URL}/articles">Explore our articles</a></li>
        <li><a href="${process.env.NEXT_PUBLIC_URL}/subscribe">Learn about Premium</a></li>
      </ul>
      <p>Have questions? Just reply to this email.</p>
    `,
  },
  [EmailType.NEWSLETTER]: {
    subject: 'MyBeing Newsletter',
    template: (data: any) => `
      <h1>MyBeing Newsletter</h1>
      <p>Hi ${data.name},</p>
      ${data.content}
    `,
  },
};

// Send email using configured provider
export async function sendEmail({ to, type, data, userId }: EmailData): Promise<boolean> {
  const template = EMAIL_TEMPLATES[type];
  if (!template) {
    console.error(`Email template not found: ${type}`);
    return false;
  }

  const subject = template.subject;
  const htmlContent = template.template(data);

  // Log email attempt
  const emailLog = await prisma!.emailLog.create({
    data: {
      userId,
      email: to,
      type,
      subject,
      status: 'pending',
      metadata: JSON.stringify(data),
    },
  });

  try {
    // Check if email provider is configured
    const provider = process.env.EMAIL_PROVIDER || 'sendgrid';

    if (provider === 'sendgrid') {
      await sendWithSendGrid(to, subject, htmlContent);
    } else if (provider === 'postmark') {
      await sendWithPostmark(to, subject, htmlContent);
    } else if (provider === 'console') {
      // Development: log to console
      console.log('📧 Email:', { to, subject, htmlContent });
    } else {
      throw new Error(`Unknown email provider: ${provider}`);
    }

    // Update log as sent
    await prisma!.emailLog.update({
      where: { id: emailLog.id },
      data: {
        status: 'sent',
        provider,
        sentAt: new Date(),
      },
    });

    return true;
  } catch (error: any) {
    console.error('Failed to send email:', error);

    // Update log with error
    await prisma!.emailLog.update({
      where: { id: emailLog.id },
      data: {
        status: 'failed',
        errorMessage: error.message || String(error),
      },
    });

    return false;
  }
}

// SendGrid integration
async function sendWithSendGrid(to: string, subject: string, html: string) {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    throw new Error('SENDGRID_API_KEY not configured');
  }

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: {
        email: process.env.EMAIL_FROM || 'noreply@mybeing.app',
        name: 'MyBeing',
      },
      subject,
      content: [
        {
          type: 'text/html',
          value: html,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SendGrid error: ${error}`);
  }
}

// Postmark integration
async function sendWithPostmark(to: string, subject: string, html: string) {
  const apiKey = process.env.POSTMARK_API_KEY;
  if (!apiKey) {
    throw new Error('POSTMARK_API_KEY not configured');
  }

  const response = await fetch('https://api.postmarkapp.com/email', {
    method: 'POST',
    headers: {
      'X-Postmark-Server-Token': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      From: process.env.EMAIL_FROM || 'noreply@mybeing.app',
      To: to,
      Subject: subject,
      HtmlBody: html,
      MessageStream: 'outbound',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Postmark error: ${error}`);
  }
}

// Send quiz results email
export async function sendQuizResultsEmail(params: {
  userId: string;
  userEmail: string;
  userName: string;
  quizTitle: string;
  quizSlug: string;
  runId: string;
  band: string;
  summary: string;
}) {
  return sendEmail({
    to: params.userEmail,
    type: EmailType.QUIZ_RESULTS,
    userId: params.userId,
    data: {
      name: params.userName,
      quizTitle: params.quizTitle,
      quizSlug: params.quizSlug,
      runId: params.runId,
      band: params.band,
      summary: params.summary,
    },
  });
}
