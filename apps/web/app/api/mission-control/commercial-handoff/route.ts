import { NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
const GATEWAY_REACHED = 'Registered Participant Continuation Reached';
const WORKSPACE_OPENED = 'Registered Workspace Opened';
const OFFER_VIEWED = 'Registered Trial Offer Viewed';
const CTA_CLICKED = 'Start 60-Day TA-14 Workspace';

export async function GET() {
  const auth = await createServerClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return NextResponse.json({ error: 'AUTH_REQUIRED' }, { status: 401 });
  const ownerId = (process.env.TA14_SEO_OWNER_USER_ID || process.env.TA14_REVENUE_OWNER_USER_ID || '').trim();
  const adminEmails = new Set((process.env.TA14_SEO_ADMIN_EMAILS || process.env.NEXT_PUBLIC_TA14_MISSION_CONTROL_ADMIN_EMAILS || 'ta14admissibleexecution@gmail.com,greggbutlerac@gmail.com').split(',').map(v => v.trim().toLowerCase()).filter(Boolean));
  const email = (user.email || '').trim().toLowerCase();
  if (!((ownerId && user.id === ownerId) || (email && adminEmails.has(email)))) return NextResponse.json({ error: 'OWNER_ACCESS_REQUIRED' }, { status: 403 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: 'NOT_CONFIGURED' }, { status: 503 });
  const db = createServiceClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const since = new Date(Date.now() - 30 * 86400000).toISOString();
  const [eventsResult, trialsResult, subscriptionsResult] = await Promise.all([
    db.from('ta14_seo_intelligence_events').select('occurred_at,event_type,visit_id,page_path,target_href,target_text,metadata').gte('occurred_at', since).in('target_text', [GATEWAY_REACHED, WORKSPACE_OPENED, OFFER_VIEWED, CTA_CLICKED]).order('occurred_at', { ascending: false }).limit(5000),
    db.from('ta14_commercial_trials').select('user_id,status,started_at,ends_at,converted_at,converted_subscription_id,source_visit_id,source_page,metadata').gte('started_at', since).limit(5000),
    db.from('ta14_seo_subscription_attribution_v1').select('*').limit(5000),
  ]);
  const degraded = {events:Boolean(eventsResult.error),trials:Boolean(trialsResult.error),paid:Boolean(subscriptionsResult.error)};
  if (eventsResult.error) return NextResponse.json({error:'COMMERCIAL_HANDOFF_EVENTS_UNAVAILABLE',tracking:degraded},{status:500});
  const events=eventsResult.data||[], trials=trialsResult.data||[], subscriptions=subscriptionsResult.data||[];
  const adminUserIds=new Set<string>(); if(ownerId)adminUserIds.add(ownerId); if(adminEmails.has(email))adminUserIds.add(String(user.id));
  const participantEvents=events.filter(event=>{const metadata=event.metadata&&typeof event.metadata==='object'?event.metadata as Record<string,unknown>:{};return metadata.operator!==true});
  const gatewayEvents=participantEvents.filter(e=>e.event_type==='page_view'&&e.target_text===GATEWAY_REACHED);
  const workspaceEvents=participantEvents.filter(e=>e.event_type==='click'&&e.target_text===WORKSPACE_OPENED);
  const offerViewedEvents=participantEvents.filter(e=>e.event_type==='page_view'&&e.target_text===OFFER_VIEWED);
  const ctaClickEvents=participantEvents.filter(e=>e.event_type==='click'&&e.target_text===CTA_CLICKED);
  const visitSet=(rows:any[])=>new Set(rows.map(e=>String(e.visit_id||'')).filter(Boolean));
  const gatewayVisitIds=visitSet(gatewayEvents), workspaceVisitIds=visitSet(workspaceEvents), offerVisitIds=visitSet(offerViewedEvents), clickVisitIds=visitSet(ctaClickEvents);
  const registryTrials=degraded.trials?[]:trials.filter(trial=>{const visitId=String(trial.source_visit_id||'');const metadata=trial.metadata&&typeof trial.metadata==='object'?trial.metadata as Record<string,unknown>:{};return !adminUserIds.has(String(trial.user_id||''))&&Boolean(visitId)&&clickVisitIds.has(visitId)&&(metadata.commercial_source==='registry'||Boolean(metadata.registry_identifier));});
  const activeTrials=registryTrials.filter(t=>String(t.status||'').toLowerCase()==='active'&&!t.converted_at);
  const convertedTrials=registryTrials.filter(t=>Boolean(t.converted_at)||String(t.status||'').toLowerCase()==='converted');
  const registryTrialUsers=new Set(registryTrials.map(t=>String(t.user_id||'')).filter(Boolean));
  const paidSubscriptions=degraded.paid?[]:subscriptions.filter((s:any)=>{const attributedVisit=String(s.first_visit_id||s.latest_visit_id||s.visit_id||s.source_visit_id||'');const attributedUser=String(s.user_id||s.owner_user_id||'');const status=String(s.subscription_status||s.status||'').toUpperCase();return ['ACTIVE','APPROVAL_PENDING','APPROVED'].includes(status)&&((attributedVisit&&clickVisitIds.has(attributedVisit))||(attributedUser&&registryTrialUsers.has(attributedUser)));});
  const gatewayVisitors=gatewayVisitIds.size, workspaceOpenedVisitors=workspaceVisitIds.size, offerViewedVisitors=offerVisitIds.size, ctaClickVisitors=clickVisitIds.size;
  const pct=(n:number,d:number)=>d>0?Number(((n/d)*100).toFixed(1)):null;
  return NextResponse.json({generatedAt:new Date().toISOString(),windowDays:30,summary:{gatewayReachedEvents:gatewayEvents.length,gatewayReachedVisitors:gatewayVisitors,workspaceOpenedEvents:workspaceEvents.length,workspaceOpenedVisitors,offerViewedEvents:offerViewedEvents.length,offerViewedVisitors,ctaClickEvents:ctaClickEvents.length,ctaClickVisitors,trialActivated:degraded.trials?null:registryTrials.length,activeTrials:degraded.trials?null:activeTrials.length,convertedTrials:degraded.trials?null:convertedTrials.length,paidSubscriptions:degraded.paid?null:paidSubscriptions.length,gatewayToWorkspaceRate:pct(workspaceOpenedVisitors,gatewayVisitors),workspaceToOfferRate:pct(offerViewedVisitors,workspaceOpenedVisitors),clickThroughRate:pct(ctaClickVisitors,offerViewedVisitors),clickToTrialRate:!degraded.trials?pct(registryTrials.length,ctaClickVisitors):null},tracking:{gatewayReached:'AVAILABLE',workspaceOpened:'AVAILABLE',offerViewed:'AVAILABLE',ctaClicked:'AVAILABLE',trialStarted:degraded.trials?'TRACKING_UNAVAILABLE':'AVAILABLE',paid:degraded.paid?'TRACKING_UNAVAILABLE':'AVAILABLE'},boundary:'Registered participant continuation is measured as a separate voluntary commercial progression. Gateway reach and workspace-open events do not alter Registry status or establish consent. Offer views and CTA clicks use exact behavioral telemetry labels. Trial activation is counted only when source_visit_id matches a Registry CTA visit and Registry source metadata is preserved. Paid is asserted only from authoritative subscription attribution; unavailable attribution is TRACKING_UNAVAILABLE, never zero.'},{headers:{'Cache-Control':'no-store, max-age=0'}});
}
