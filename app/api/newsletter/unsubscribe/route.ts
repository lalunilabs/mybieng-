import { NextRequest, NextResponse } from 'next/server';
import { verifyUnsubscribeToken } from '@/lib/tokens';
import { DatabaseService } from '@/lib/database';

function renderHtml(title: string, heading: string, body: string) {
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
      renderHtml('Unsubscribe - MyBeing', 'Unsubscribe', '<span class="err">Missing token.</span>'),
      { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  const verification = verifyUnsubscribeToken(token);
  if (!verification.valid || !verification.email) {
    if (wantsJSON) return NextResponse.json({ success: false, error: verification.reason || 'Invalid token' }, { status: 400 });
    return new NextResponse(
      renderHtml('Unsubscribe - MyBeing', 'Unsubscribe', `<span class="err">${verification.reason || 'Invalid token.'}</span>`),
      { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  try {
    await DatabaseService.deactivateNewsletterSubscriptionByEmail(verification.email);
    if (wantsJSON) return NextResponse.json({ success: true, message: 'You have been unsubscribed.' });
    return new NextResponse(
      renderHtml('Unsubscribe - MyBeing', 'You are unsubscribed', '<span class="ok">You will no longer receive newsletter emails from MyBeing.</span>'),
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  } catch (err) {
    if (wantsJSON) return NextResponse.json({ success: false, error: 'Failed to process unsubscribe' }, { status: 500 });
    return new NextResponse(
      renderHtml('Unsubscribe - MyBeing', 'Unsubscribe', '<span class="err">Failed to process unsubscribe. Please try again later.</span>'),
      { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
}
