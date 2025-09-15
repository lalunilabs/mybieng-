// Email service for quiz results delivery
// This eliminates the need for user accounts and data storage

import { QuizAnalysis } from './ai';
import { signUnsubscribeToken, signConfirmToken } from './tokens';

export interface EmailQuizResult {
  userEmail: string;
  quizTitle: string;
  quizSlug: string;
  analysis: QuizAnalysis;
  completedAt: Date;
  chatSessionId?: string; // For AI chat access
}

// Email template for quiz results
export function generateQuizResultEmail(result: EmailQuizResult): {
  subject: string;
  html: string;
  text: string;
} {
  const { analysis, quizTitle, completedAt } = result;
  
  const subject = `Your ${quizTitle} Results - MyBeing Self-Discovery`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px; }
    .score-badge { background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 25px; display: inline-block; margin-top: 10px; }
    .insight-card { background: #f8fafc; border-left: 4px solid #7c3aed; padding: 20px; margin: 20px 0; border-radius: 8px; }
    .action-item { background: #ecfdf5; border: 1px solid #d1fae5; padding: 15px; margin: 10px 0; border-radius: 8px; }
    .chat-cta { background: #7c3aed; color: white; padding: 20px; border-radius: 12px; text-align: center; margin: 30px 0; }
    .chat-button { background: white; color: #7c3aed; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: 600; margin-top: 15px; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your ${quizTitle} Results</h1>
      <div class="score-badge">
        <strong>${analysis.band}</strong> • Score: ${analysis.score}
      </div>
    </div>
    
    <div style="margin-bottom: 30px;">
      <h2 style="color: #7c3aed;">Your Personal Analysis</h2>
      <p style="font-size: 16px; background: #faf5ff; padding: 20px; border-radius: 8px; border-left: 4px solid #7c3aed;">
        ${analysis.personalizedMessage}
      </p>
    </div>
    
    <div style="margin-bottom: 30px;">
      <h2 style="color: #7c3aed;">Key Insights</h2>
      ${analysis.keyInsights.map(insight => `
        <div class="insight-card">
          <h3 style="margin-top: 0; color: #374151;">${insight.pattern}</h3>
          <p style="margin-bottom: 10px;">${insight.description}</p>
          <p style="margin-bottom: 0; font-weight: 500; color: #059669;">💡 ${insight.actionableAdvice}</p>
        </div>
      `).join('')}
    </div>
    
    <div style="margin-bottom: 30px;">
      <h2 style="color: #7c3aed;">Recommended Actions</h2>
      ${analysis.recommendedActions.map(action => `
        <div class="action-item">
          <p style="margin: 0;">✓ ${action}</p>
        </div>
      `).join('')}
    </div>
    
    <div style="margin-bottom: 30px;">
      <h2 style="color: #7c3aed;">Next Steps</h2>
      <ul style="padding-left: 20px;">
        ${analysis.nextSteps.map(step => `<li style="margin-bottom: 8px;">${step}</li>`).join('')}
      </ul>
    </div>
    
    ${result.chatSessionId ? `
    <div class="chat-cta">
      <h3 style="margin-top: 0;">Have Questions About Your Results?</h3>
      <p style="margin-bottom: 0;">Chat with our AI to dive deeper into your insights and get personalized guidance.</p>
      <a href="https://mybeing.com/chat/${result.chatSessionId}" class="chat-button">Start AI Chat Session</a>
    </div>
    ` : ''}
    
    <div class="footer">
      <p>Completed on ${completedAt.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}</p>
      <p>
        <a href="https://mybeing.com" style="color: #7c3aed;">MyBeing</a> • 
        <a href="https://mybeing.com/quizzes" style="color: #7c3aed;">Take Another Quiz</a> • 
        <a href="https://mybeing.com/blog" style="color: #7c3aed;">Read Our Blog</a>
      </p>
      <p style="font-size: 12px; margin-top: 20px;">
        This email contains your personal quiz results. Your privacy is important to us - 
        we don't store your responses on our servers.
      </p>
    </div>
  </div>
</body>
</html>
  `;
  
  const text = `
Your ${quizTitle} Results - MyBeing Self-Discovery

Score: ${analysis.score} - ${analysis.band}

Personal Analysis:
${analysis.personalizedMessage}

Key Insights:
${analysis.keyInsights.map(insight => `
${insight.pattern}:
${insight.description}
Action: ${insight.actionableAdvice}
`).join('\n')}

Recommended Actions:
${analysis.recommendedActions.map(action => `• ${action}`).join('\n')}

Next Steps:
${analysis.nextSteps.map(step => `• ${step}`).join('\n')}

${result.chatSessionId ? `
Have questions? Chat with our AI: https://mybeing.com/chat/${result.chatSessionId}
` : ''}

Completed on ${completedAt.toLocaleDateString()}

Visit MyBeing: https://mybeing.com
Take Another Quiz: https://mybeing.com/quizzes
Read Our Blog: https://mybeing.com/blog

Your privacy matters - we don't store your responses on our servers.
  `;
  
  return { subject, html, text };
}

// Send quiz results via email (integrate with your email service)
export async function sendQuizResults(result: EmailQuizResult): Promise<boolean> {
  try {
    const { subject, html, text } = generateQuizResultEmail(result);
    
    if (emailConfig.provider === 'sendgrid') {
      return await sendWithSendGrid(result.userEmail, subject, html, text);
    } else if (emailConfig.provider === 'mailgun') {
      return await sendWithMailgun(result.userEmail, subject, html, text);
    } else if (emailConfig.provider === 'ses') {
      return await sendWithSES(result.userEmail, subject, html, text);
    } else {
      // Development mode - just log
      console.log('📧 [DEV MODE] Quiz results email:', {
        to: result.userEmail,
        subject,
        quizSlug: result.quizSlug,
        score: result.analysis.score
      });
      return true;
    }
  } catch (error) {
    console.error('Failed to send quiz results email:', error);
    return false;
  }
}

export async function sendNewsletterWelcome(to: string): Promise<boolean> {
  try {
    const subject = 'Welcome to MyBeing — Let’s begin your self-discovery';
    const token = signUnsubscribeToken(to);
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const unsubscribeUrl = `${baseUrl}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to MyBeing</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
    .button { background: #7c3aed; color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; }
  </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to MyBeing</h1>
        <p style="margin-bottom:0;">Thanks for subscribing! You’ll get research-backed insights and new self-discovery quizzes.</p>
      </div>
      <p>Here’s what you can do next:</p>
      <ul>
        <li>Take a quiz to get personalized insights</li>
        <li>Read the latest research-backed posts</li>
        <li>Come back weekly to track changes over time</li>
      </ul>
      <p style="text-align:center;margin:28px 0;">
        <a class="button" href="${baseUrl}/quizzes">Explore Quizzes</a>
      </p>
      <div class="footer">
        <p>You’ll receive occasional updates only. Your privacy matters.</p>
        <p style="font-size:12px; margin-top:8px;">If this wasn’t you or you no longer wish to receive emails, <a href="${unsubscribeUrl}" style="color:#6b21a8;">unsubscribe</a>.</p>
      </div>
    </div>
  </body>
  </html>
`;
    const text = `Welcome to MyBeing!

Thanks for subscribing. You’ll receive research-backed insights and self-discovery quizzes.

Get started: ${baseUrl}/quizzes
Blog: ${baseUrl}/blog

You’ll receive occasional updates. Your privacy matters.

Unsubscribe: ${unsubscribeUrl}`;

    if (emailConfig.provider === 'sendgrid') {
      return await sendWithSendGrid(to, subject, html, text);
    } else if (emailConfig.provider === 'mailgun') {
      return await sendWithMailgun(to, subject, html, text);
    } else if (emailConfig.provider === 'ses') {
      return await sendWithSES(to, subject, html, text);
    } else {
      console.log('📧 [DEV MODE] Newsletter welcome email:', { to, subject });
      return true;
    }
  } catch (error) {
    console.error('Failed to send newsletter welcome email:', error);
    return false;
  }
}

export async function sendNewsletterConfirm(to: string): Promise<boolean> {
  try {
    const subject = 'Confirm your subscription to MyBeing';
    const token = signConfirmToken(to);
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const confirmUrl = `${baseUrl}/api/newsletter/confirm?token=${encodeURIComponent(token)}`;
    const unsubscribeToken = signUnsubscribeToken(to);
    const unsubscribeUrl = `${baseUrl}/api/newsletter/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`;
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm your subscription</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
    .button { background: #7c3aed; color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; }
  </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Confirm your subscription</h1>
        <p style="margin-bottom:0;">Please confirm to start receiving DID YOUR RESEARCH every 14 days.</p>
      </div>
      <p>Click the button below to confirm your email address:</p>
      <p style="text-align:center;margin:28px 0;">
        <a class="button" href="${confirmUrl}">Confirm Subscription</a>
      </p>
      <p>If you did not request this, you can safely ignore this email.</p>
      <div class="footer">
        <p>You’ll receive occasional updates only. Your privacy matters.</p>
        <p style="font-size:12px; margin-top:8px;">No longer wish to receive emails? <a href="${unsubscribeUrl}" style="color:#6b21a8;">unsubscribe</a>.</p>
      </div>
    </div>
  </body>
  </html>
`;
    const text = `Confirm your subscription to MyBeing\n\nConfirm: ${confirmUrl}\n\nIf you did not request this, ignore this email.\n\nUnsubscribe: ${unsubscribeUrl}`;

    if (emailConfig.provider === 'sendgrid') {
      return await sendWithSendGrid(to, subject, html, text);
    } else if (emailConfig.provider === 'mailgun') {
      return await sendWithMailgun(to, subject, html, text);
    } else if (emailConfig.provider === 'ses') {
      return await sendWithSES(to, subject, html, text);
    } else {
      console.log('📧 [DEV MODE] Newsletter confirm email:', { to, subject });
      return true;
    }
  } catch (error) {
    console.error('Failed to send newsletter confirmation email:', error);
    return false;
  }
}

async function sendWithSendGrid(to: string, subject: string, html: string, text: string): Promise<boolean> {
  if (!emailConfig.apiKey) {
    throw new Error('SendGrid API key not configured');
  }

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${emailConfig.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: emailConfig.fromEmail, name: emailConfig.fromName },
      subject,
      content: [
        { type: 'text/plain', value: text },
        { type: 'text/html', value: html }
      ]
    })
  });

  return response.ok;
}

async function sendWithMailgun(to: string, subject: string, html: string, text: string): Promise<boolean> {
  if (!emailConfig.apiKey) {
    throw new Error('Mailgun API key not configured');
  }

  const domain = process.env.MAILGUN_DOMAIN;
  if (!domain) {
    throw new Error('Mailgun domain not configured');
  }

  const formData = new FormData();
  formData.append('from', `${emailConfig.fromName} <${emailConfig.fromEmail}>`);
  formData.append('to', to);
  formData.append('subject', subject);
  formData.append('text', text);
  formData.append('html', html);

  const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`api:${emailConfig.apiKey}`).toString('base64')}`,
    },
    body: formData
  });

  return response.ok;
}

async function sendWithSES(to: string, subject: string, html: string, text: string): Promise<boolean> {
  // AWS SES implementation would go here
  // This requires AWS SDK setup
  throw new Error('AWS SES integration not implemented yet');
}

// Generate a temporary chat session for AI interaction
export function generateChatSession(emailResult: EmailQuizResult): string {
  // Generate a unique session ID that expires after 30 days
  const sessionId = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
  
  // In a real implementation, you'd store this temporarily with the quiz results
  // for AI chat context, but it would expire automatically
  
  return sessionId;
}

// Email service configuration (would be in environment variables)
export const emailConfig = {
  // These would come from environment variables
  provider: process.env.EMAIL_PROVIDER || 'sendgrid', // 'sendgrid', 'mailgun', 'ses'
  apiKey: process.env.EMAIL_API_KEY,
  fromEmail: process.env.FROM_EMAIL || 'noreply@mybeing.com',
  fromName: process.env.FROM_NAME || 'MyBeing Self-Discovery'
};
