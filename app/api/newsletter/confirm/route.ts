import { NextRequest, NextResponse } from 'next/server';
import { verifyConfirmToken } from '@/lib/tokens';
import { DatabaseService } from '@/lib/database';
import { sendNewsletterWelcome } from '@/lib/email';

function renderHtml(title: string, heading: string, body: string, setLocalStorage = false) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fafafa; color: #111827; margin: 0; padding: 0; }
    .wrap { max-width: 560px; margin: 10vh auto; background: #fff; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.06); padding: 28px; border: 1px solid #eee; }
    h1 { margin: 0 0 12px; font-size: 24px; color: #111827; }
    p { margin: 10px 0; line-height: 1.6; color: #374151; }
    .ok { color: #065f46; }
    .err { color: #991b1b; }
    a.btn { display: inline-block; margin-top: 18px; padding: 10px 16px; background: #6b21a8; color: #fff; border-radius: 8px; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>${heading}</h1>
    <p>${body}</p>
    <a class="btn" href="/">Back to Home</a>
  </div>
  ${setLocalStorage ? `<script>try{localStorage.setItem('newsletter-subscribed','true')}catch(e){}</script>` : ''}
</body>
</html>`;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token') || '';
  const accept = req.headers.get('accept') || '';
  const wantsJSON = accept.includes('application/json') || url.searchParams.get('format') === 'json';

  if (!token) {
    if (wantsJSON) return NextResponse.json({ success: false, error: 'Missing token' }, { status: 400 });
    return new NextResponse(
      renderHtml('Confirm Subscription - MyBeing', 'Confirm Subscription', '<span class="err">Missing token.</span>'),
      { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  const verification = verifyConfirmToken(token);
  if (!verification.valid || !verification.email) {
    if (wantsJSON) return NextResponse.json({ success: false, error: verification.reason || 'Invalid token' }, { status: 400 });
    return new NextResponse(
      renderHtml('Confirm Subscription - MyBeing', 'Confirm Subscription', `<span class="err">${verification.reason || 'Invalid token.'}</span>`),
      { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  try {
    await DatabaseService.activateNewsletterSubscriptionByEmail(verification.email);

    // Fire-and-forget welcome email
    sendNewsletterWelcome(verification.email)
      .catch((e) => console.warn('Welcome email threw unexpectedly after confirm:', e));

    const successMessage = 'Subscription confirmed. Welcome to DID YOUR RESEARCH!';
    if (wantsJSON) return NextResponse.json({ success: true, message: successMessage });
    return new NextResponse(
      renderHtml('Subscription Confirmed - MyBeing', 'Subscription Confirmed', `<span class="ok">${successMessage}</span>`, true),
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  } catch (err) {
    if (wantsJSON) return NextResponse.json({ success: false, error: 'Failed to confirm subscription' }, { status: 500 });
    return new NextResponse(
      renderHtml('Confirm Subscription - MyBeing', 'Confirm Subscription', '<span class="err">Failed to confirm subscription. Please try again later.</span>'),
      { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
}
