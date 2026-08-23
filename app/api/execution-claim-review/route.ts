import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

type Payload = Record<string, unknown>;
const MAX_BODY_BYTES = 64 * 1024;
const MAX_LONG = 8000;
function text(v: unknown, max = 500) { return typeof v === 'string' ? v.trim().slice(0, max) : ''; }
function nullable(v: unknown, max = 500) { return text(v, max) || null; }
function email(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 320; }
function service(v: unknown) { return text(v, 40).toUpperCase() === 'EXECUTION_EVIDENCE_SNAPSHOT' ? 'EXECUTION_EVIDENCE_SNAPSHOT' : 'EXECUTION_CLAIM_REVIEW'; }
function urgency(v: unknown) { const x = text(v, 20).toUpperCase(); return x === 'PRIORITY' || x === 'CRITICAL' ? x : 'STANDARD'; }
function sameOrigin(r: NextRequest) { const o = r.headers.get('origin'); if (!o) return true; try { return new URL(o).host === r.nextUrl.host; } catch { return false; } }
function intakeId(kind: string) { const stamp = new Date().toISOString().slice(0,10).replaceAll('-',''); const token = randomUUID().replaceAll('-','').slice(0,10).toUpperCase(); return `TA14-${kind === 'EXECUTION_EVIDENCE_SNAPSHOT' ? 'EES' : 'ECR'}-${stamp}-${token}`; }
function client() { const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? ''; const key = process.env.SUPABASE_SECRET_KEY?.trim() || process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || ''; if (!url || !key) throw new Error('Commercial intake server configuration unavailable.'); return createClient(url, key, { auth: { persistSession:false, autoRefreshToken:false, detectSessionInUrl:false } }); }

export async function POST(request: NextRequest) {
  try {
    if (!sameOrigin(request)) return NextResponse.json({error:'Cross-origin submission is not allowed.'},{status:403});
    if (!(request.headers.get('content-type') ?? '').toLowerCase().includes('application/json')) return NextResponse.json({error:'Expected application/json.'},{status:415});
    const length = Number(request.headers.get('content-length') ?? '0');
    if (Number.isFinite(length) && length > MAX_BODY_BYTES) return NextResponse.json({error:'Request body is too large.'},{status:413});
    const p = await request.json() as Payload;
    if (text(p.website,200)) return NextResponse.json({ok:true,accepted:true});
    const kind = service(p.serviceType);
    const organizationName = text(p.organizationName,300), contactName = text(p.contactName,300), contactEmail = text(p.contactEmail,320).toLowerCase(), systemName = text(p.systemName,500), claim = text(p.consequentialClaim,MAX_LONG), consequence = text(p.executionConsequence,MAX_LONG), evidence = text(p.evidenceSummary,MAX_LONG), requested = text(p.requestedExamination,MAX_LONG);
    const required = {organizationName,contactName,contactEmail,systemName,consequentialClaim:claim,executionConsequence:consequence,evidenceSummary:evidence,requestedExamination:requested};
    const missing = Object.entries(required).filter(([,v])=>!v).map(([k])=>k);
    if (missing.length) return NextResponse.json({error:'Required fields are missing.',missing},{status:400});
    if (!email(contactEmail)) return NextResponse.json({error:'Contact email is invalid.'},{status:400});
    if (p.limitationAcknowledged !== true || p.accuracyAcknowledged !== true) return NextResponse.json({error:'Required intake acknowledgements must be accepted.'},{status:400});
    const id = intakeId(kind);
    const row = { intake_id:id, service_type:kind, status:'submitted', urgency:urgency(p.urgency), organization_name:organizationName, contact_name:contactName, contact_email:contactEmail, system_name:systemName, system_public_url:nullable(p.systemPublicUrl,2000), consequential_claim:claim, execution_consequence:consequence, evidence_summary:evidence, authority_boundary:nullable(p.authorityBoundary,MAX_LONG), changed_conditions:nullable(p.changedConditions,MAX_LONG), known_gaps:nullable(p.knownGaps,MAX_LONG), requested_examination:requested, additional_context:nullable(p.additionalContext,MAX_LONG), source_page:nullable(p.sourcePage,2000), referrer:nullable(p.referrer,2000), utm_source:nullable(p.utmSource,500), utm_medium:nullable(p.utmMedium,500), utm_campaign:nullable(p.utmCampaign,500), limitation_acknowledged:true, accuracy_acknowledged:true, metadata:{schema:'TA14_EXECUTION_CLAIM_INTAKE_V1',userAgent:text(request.headers.get('user-agent'),1000)||null,submittedHost:request.nextUrl.host} };
    const {data,error} = await client().from('ta14_execution_claim_review_intakes').insert(row).select('intake_id,status,submitted_at').single();
    if (error) { console.error('Execution claim intake insert failed',{code:error.code,message:error.message}); return NextResponse.json({error:'Unable to preserve the review request.'},{status:500}); }
    return NextResponse.json({ok:true,intakeId:data.intake_id,status:data.status,submittedAt:data.submitted_at,boundary:'Submission creates an intake record only. It is not certification, endorsement, acceptance of scope, payment, or a favorable finding.'},{status:201});
  } catch (e) { console.error('Execution claim intake route failed',e); return NextResponse.json({error:'Unable to process the review request.'},{status:500}); }
}
