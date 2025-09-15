import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const referer = request.headers.get('referer') || undefined;

    const evt = {
      ...body,
      userAgent,
      referer,
      receivedAt: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || undefined,
    } as any;

    // Minimal: log to server for now. Future: persist to DB (Supabase) or analytics pipeline.
    console.info('[analytics event]', evt);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in /api/events:', error);
    return NextResponse.json({ success: false, error: 'Failed to record event' }, { status: 500 });
  }
}
