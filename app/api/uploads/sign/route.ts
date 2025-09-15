import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    if (!key) {
      return NextResponse.json({ error: 'Missing key' }, { status: 400 });
    }
    const expires = Math.max(60, Math.min(parseInt(searchParams.get('expires') || '604800', 10) || 604800, 60 * 60 * 24 * 7)); // 1 min to 7 days

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Storage not configured' }, { status: 500 });
    }

    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'uploads';
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(key, expires);
    if (error || !data?.signedUrl) {
      return NextResponse.json({ error: error?.message || 'Failed to sign URL' }, { status: 500 });
    }
    return NextResponse.json({ signedUrl: data.signedUrl, expiresIn: expires });
  } catch (error) {
    console.error('Uploads sign error:', error);
    return NextResponse.json({ error: 'Failed to sign URL' }, { status: 500 });
  }
}
