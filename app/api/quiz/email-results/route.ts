import { NextRequest, NextResponse } from 'next/server';
import { getQuizBySlug, getBandForScore } from '@/data/quizzes';

// Simple in-memory rate limiting (best-effort; resets per cold start)
const ipRate = new Map<string, { count: number; resetAt: number }>();
const emailRate = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_PER_WINDOW = 5; // max requests per IP/email per window

function checkRate(map: Map<string, { count: number; resetAt: number }>, key: string) {
  const now = Date.now();
  const entry = map.get(key);
  if (!entry || now > entry.resetAt) {
    map.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_PER_WINDOW - 1 };
  }
  if (entry.count >= MAX_PER_WINDOW) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt } as const;
  }
  entry.count += 1;
  return { allowed: true, remaining: MAX_PER_WINDOW - entry.count };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, quizId, quizTitle, score, maxScore, band } = body as {
      email: string;
      quizId: string;
      quizTitle: string;
      score: number;
      maxScore: number;
      band?: string;
    };

    if (!email || !quizId || !quizTitle || typeof score !== 'number' || typeof maxScore !== 'number') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Rate limit by IP and email (best-effort; serverless-safe fallback)
    const ipHeader = req.headers.get('x-forwarded-for') || '';
    const ip = ipHeader.split(',')[0].trim() || 'unknown';
    const ipCheck = checkRate(ipRate, ip);
    if (!ipCheck.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }
    const emailKey = email.toLowerCase();
    const emailCheck = checkRate(emailRate, emailKey);
    if (!emailCheck.allowed) {
      return NextResponse.json({ error: 'Too many requests for this email. Please try again later.' }, { status: 429 });
    }

    const base = process.env.NEXT_PUBLIC_DOMAIN || 'https://mybeing.in';
    const reportUrl = `${base}/reports/${encodeURIComponent(quizId)}`;

    // Compute a consistent band/advice server-side as a fallback
    const computedBand = getBandForScore(score, maxScore);
    const briefLabel = band || computedBand?.label || 'Your result';

    // Try to enrich with quiz-defined advice if available
    let briefAdvice = computedBand?.advice || 'We will send you the detailed interpretation, patterns, and next steps.';
    const quiz = getQuizBySlug(quizId);
    if (quiz?.bands?.length) {
      const match = quiz.bands.find(b => b.label.toLowerCase() === briefLabel.toLowerCase());
      if (match?.advice) briefAdvice = match.advice;
    }

    const title = `${quizTitle} — Your Report`; // email subject
    const from = process.env.EMAIL_FROM || 'no-reply@mybeing.in';
    const previewText = `Summary: ${briefLabel}`;

    // Build AI follow-up suggestions (seed ideas)
    function getSuggestions(slug?: string): string[] {
      const s = (slug || '').toLowerCase();
      if (s.includes('cognitive') || s.includes('dissonance')) {
        return [
          'Where am I rationalizing a values conflict this week?',
          'What is one small action to realign without major friction?',
          'What value do I want to honor in a tough situation?'
        ];
      }
      if (s.includes('stress')) {
        return [
          'Which signal shows up first when stress builds for me?',
          'What is one lever (sleep, movement, breaks) I can steady this week?',
          'What is a small stress amplifier I can reduce for 7 days?'
        ];
      }
      return [
        'What patterns should I pay attention to next week?',
        'What is one small change that could have outsized benefits?',
        'Which habit can I try for 7 days to test a better pattern?'
      ];
    }
    const suggestions = getSuggestions(quiz?.slug);

    const logo = `${base}/apple-touch-icon.png`;
    const html = `
      <!doctype html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <title>${title}</title>
          <style>
            body { background: #f8fafc; color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 24px; }
            .card { max-width: 640px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 24px; }
            .h1 { font-size: 20px; margin: 0 0 8px; font-weight: 700; }
            .muted { color: #475569; }
            .pill { display:inline-block; background:#ede9fe; color:#6d28d9; padding:4px 10px; border-radius:999px; font-size:12px; font-weight:600; }
            .btn { display:inline-block; background:#6d28d9; color:#fff !important; text-decoration:none; padding:10px 16px; border-radius:12px; font-weight:600; }
            .footer { max-width: 640px; margin: 12px auto; color:#64748b; font-size:12px; }
            .brand { display:flex; align-items:center; gap:10px; margin-bottom: 12px; }
            .brand img { width: 28px; height: 28px; border-radius: 6px; }
            .brand-name { font-weight: 800; letter-spacing: 0.2px; }
            ul { padding-left: 18px; }
          </style>
        </head>
        <body>
          <span style="display:none !important; visibility:hidden; opacity:0; height:0; width:0; overflow:hidden;">${previewText}</span>
          <div class="card">
            <div class="brand">
              <img src="${logo}" alt="MyBeing" />
              <div class="brand-name">MyBeing</div>
            </div>
            <div class="pill">${briefLabel}</div>
            <h1 class="h1">${quizTitle}</h1>
            <p class="muted">Here is a brief summary of your result. Your detailed report with interpretation, patterns, and next steps is ready.</p>
            <p>${briefAdvice}</p>
            <p class="muted">When you’re ready, view your report and discuss it with the AI companion.</p>
            <p>
              <a class="btn" href="${reportUrl}" target="_blank" rel="noopener noreferrer">View your report</a>
            </p>
            <div style="height:12px"></div>
            <div>
              <div class="muted" style="font-weight:600; margin-bottom:4px;">Suggested questions for the AI</div>
              <ul>
                ${suggestions.map(q => `<li>${q}</li>`).join('')}
              </ul>
            </div>
          </div>
          <div class="footer">
            You’re receiving this because you requested your report from MyBeing. If this wasn’t you, you can ignore this email.
          </div>
        </body>
      </html>
    `;

    let sent = false;
    const providerErrors: string[] = [];

    // Loader to avoid compile-time module resolution for optional deps
    const dynImport = new Function('m', 'return import(m)') as (m: string) => Promise<any>;

    // Try Resend (if available)
    if (process.env.RESEND_API_KEY) {
      try {
        const resendMod = await dynImport('resend');
        const Resend = resendMod?.Resend;
        if (Resend) {
          const resend = new Resend(process.env.RESEND_API_KEY);
          const res = await resend.emails.send({
            from,
            to: email,
            subject: title,
            html,
          } as any);
          if ((res as any)?.id || (res as any)?.data?.id) {
            sent = true;
          } else if ((res as any)?.error) {
            providerErrors.push(`Resend: ${(res as any).error?.message || 'unknown error'}`);
          }
        } else {
          providerErrors.push('Resend module missing Resend export');
        }
      } catch (e: any) {
        providerErrors.push(`Resend import/send failed: ${e?.message || e}`);
      }
    }

    // Try SendGrid (if available and not yet sent)
    if (!sent && process.env.SENDGRID_API_KEY) {
      try {
        const sgMod = await dynImport('@sendgrid/mail');
        const sg = sgMod?.default || sgMod; // default export
        if (sg?.setApiKey && sg?.send) {
          sg.setApiKey(process.env.SENDGRID_API_KEY);
          const res = await sg.send({
            to: email,
            from,
            subject: title,
            html,
          } as any);
          if (Array.isArray(res) && (res[0]?.statusCode || 0) >= 200 && (res[0]?.statusCode || 0) < 300) {
            sent = true;
          } else {
            providerErrors.push(`SendGrid returned unexpected response`);
          }
        } else {
          providerErrors.push('SendGrid module missing expected exports');
        }
      } catch (e: any) {
        providerErrors.push(`SendGrid import/send failed: ${e?.message || e}`);
      }
    }

    if (!sent) {
      // Graceful fallback: log payload so the UI still succeeds
      console.info('[email-results] queued (no provider configured)', { email, quizId, quizTitle, score, maxScore, band, errors: providerErrors });
    }

    return NextResponse.json({ ok: true, sent, providerErrors });
  } catch (e) {
    console.error('POST /api/quiz/email-results error', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
