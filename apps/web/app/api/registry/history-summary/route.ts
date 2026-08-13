import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return NextResponse.json({ records: [] }, { status: 503 });
  const supabase = createClient(url, anonKey, { auth: { persistSession: false } });
  const { data, error } = await supabase
    .from('ta14_governance_life_history_summary_v1')
    .select('registry_identifier,event_count,examination_count,response_correction_count,latest_event_date,latest_event_type,latest_event_title')
    .order('registry_identifier');
  if (error) return NextResponse.json({ records: [], error: 'History summary unavailable.' }, { status: 503 });
  return NextResponse.json({ records: data ?? [], generatedAt: new Date().toISOString() }, { headers: { 'Cache-Control': 'no-store' } });
}
