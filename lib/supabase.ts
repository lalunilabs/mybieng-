import { createClient, SupabaseClient } from '@supabase/supabase-js';

export function getSupabaseAdminClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !serviceKey) return null;
  try {
    return createClient(url, serviceKey);
  } catch {
    return null;
  }
}
