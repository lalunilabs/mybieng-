import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function fmt(n: number) { return String(n).padStart(2, '0'); }

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Storage not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'uploads';
    const days = Math.max(1, Math.min(parseInt(searchParams.get('days') || '30', 10) || 30, 365));
    const limit = Math.max(1, Math.min(parseInt(searchParams.get('limit') || '50', 10) || 50, 200));

    type Item = { key: string; name: string; updatedAt?: string; size?: number; url: string };
    const items: Item[] = [];

    const now = new Date();

    // Iterate last N days and list date-based prefixes: YYYY/MM/DD
    for (let i = 0; i < days && items.length < limit; i++) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const prefix = `${d.getFullYear()}/${fmt(d.getMonth() + 1)}/${fmt(d.getDate())}`;
      const { data: list, error } = await supabase.storage.from(bucket).list(prefix, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'updated_at', order: 'desc' as const },
      });
      if (error) continue;
      for (const f of list || []) {
        if ((f as any).id === null && (f as any).name && !(f as any).metadata) {
          // This is a subdirectory placeholder, skip
          continue;
        }
        const key = `${prefix}/${f.name}`;
        const { data: pub } = supabase.storage.from(bucket).getPublicUrl(key);
        items.push({
          key,
          name: f.name,
          updatedAt: (f as any).updated_at || undefined,
          size: (f as any).metadata?.size || (f as any).size || undefined,
          url: pub?.publicUrl || '',
        });
        if (items.length >= limit) break;
      }
    }

    // Sort by updatedAt desc if present
    items.sort((a, b) => {
      const at = a.updatedAt ? Date.parse(a.updatedAt) : 0;
      const bt = b.updatedAt ? Date.parse(b.updatedAt) : 0;
      return bt - at;
    });

    return NextResponse.json({ items: items.slice(0, limit) });
  } catch (error) {
    console.error('Uploads list error:', error);
    return NextResponse.json({ error: 'Failed to list uploads' }, { status: 500 });
  }
}
