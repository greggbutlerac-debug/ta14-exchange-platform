import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ artifactIdentifier: string }> };

type ChronologyEvent = {
  event_key: string;
  event_type: string;
  event_at: string;
  title: string;
  summary: string | null;
  sequence_number: number;
  metadata: Record<string, unknown>;
};

export default async function InstitutionalFindingRecordPage({ params }: Props) {
  const { artifactIdentifier: encoded } = await params;
  const artifactIdentifier = decodeURIComponent(encoded);
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return <main className="shell"><section className="card"><small>CONTROLLED INSTITUTIONAL RECORD</small><h1>Authenticated institutional session required.</h1><p>This finding is not part of the public artifact projection. Sign in through the Exchange before attempting retrieval.</p><Link href="/workspace/ai-governance">Return to AI Governance</Link></section></main>;
  }

  const { data: artifact, error } = await supabase.from('ta14_governed_artifact_records').select('*').eq('artifact_identifier', artifactIdentifier).eq('artifact_type', 'INSTITUTIONAL_EXAMINATION_FINDING').maybeSingle();
  if (error || !artifact) notFound();
  const { data: events } = await supabase.from('ta14_governed_artifact_events').select('event_key,event_type,event_at,title,summary,sequence_number,metadata').eq('artifact_record_id', artifact.id).order('sequence_number', { ascending: true });
  const chronology = (events ?? []) as ChronologyEvent[];
  const metadata = (artifact.metadata ?? {}) as Record<string, unknown>;
  const evidence = Array.isArray(artifact.evidence_object_identifiers) ? artifact.evidence_object_identifiers as string[] : [];
  const limitations = Array.isArray(artifact.limitations) ? artifact.limitations as string[] : [];

  return <main className="shell"><nav><Link href="/workspace/ai-governance/adversarial-examination/review">← Institutional Review</Link><b>CONTROLLED INSTITUTIONAL FINDING RECORD</b></nav><header><p>AUTHORITATIVE GOVERNED ARTIFACT</p><h1>{artifact.artifact_identifier}</h1><div className="determination">{artifact.finding_class ?? 'INDETERMINATE'}</div></header><section className="grid"><div className="card"><small>REGISTERED GOVERNANCE</small><strong>{artifact.governance_name}</strong><span>{artifact.governance_registry_identifier} · {artifact.governance_version ?? 'version not recorded'}</span></div><div className="card"><small>PRESERVATION</small><strong>{artifact.administrative_verification_status ?? 'Recorded'}</strong><span>{new Date(artifact.registered_at).toLocaleString()}</span></div></section><section className="card"><small>BOUNDED PROPOSITION</small><h2>{artifact.claims_boundary}</h2><p>{artifact.public_finding_language}</p></section><section className="grid"><div className="card"><small>FINDING DIGEST</small><code>{artifact.source_sha256 ?? 'Not recorded'}</code></div><div className="card"><small>RECEIPT BINDING</small><code>{String(metadata.receiptDigest ?? 'Not recorded')}</code><span>{String(metadata.receiptId ?? '')}</span></div></section><section className="card"><small>LIMITATIONS</small>{limitations.length?<ul>{limitations.map((item,index)=><li key={`${index}-${item}`}>{item}</li>)}</ul>:<p>No limitations were recorded.</p>}</section><section className="card"><small>ADMITTED EVIDENCE REFERENCES</small>{evidence.length?<ul>{evidence.map(item=><li key={item}><code>{item}</code></li>)}</ul>:<p>No admitted evidence references are exposed on this record.</p>}</section><section className="card"><small>INSTITUTIONAL CHRONOLOGY</small>{chronology.length?<ol>{chronology.map(event=><li key={event.event_key}><div><strong>{event.sequence_number}. {event.title}</strong><span>{new Date(event.event_at).toLocaleString()} · {event.event_type}</span>{event.summary&&<p>{event.summary}</p>}</div></li>)}</ol>:<p>No chronology events were returned.</p>}</section><section className="boundary"><strong>Authority boundary</strong><p>This controlled view presents the authoritative governed-artifact record available to the authenticated Exchange session. It does not expand the finding beyond its bounded proposition, admitted evidence, recorded limitations, issuer authority, or preserved chronology.</p></section><style>{`body{margin:0;background:#02070d;color:#edf7fb}.shell{width:min(1080px,calc(100% - 32px));margin:auto;padding:24px 0 70px;font-family:Arial,sans-serif}nav{display:flex;justify-content:space-between;gap:16px;padding:14px 16px;border:1px solid #193243;background:#071824;border-radius:14px}a{color:#8fdcf2;text-decoration:none}header{padding:52px 0 24px}header p,.card small{font-size:11px;font-weight:900;letter-spacing:.14em;color:#e5b960}h1{font-size:clamp(40px,7vw,72px);margin:8px 0}.determination{display:inline-block;padding:9px 12px;border:1px solid #2e7650;border-radius:999px;color:#83e6b0;font-weight:900}.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.card,.boundary{margin:14px 0;padding:20px;border:1px solid #173347;background:#06141f;border-radius:16px}.card{display:grid;gap:9px}.card strong{font-size:20px}.card span,.card p,.boundary p{color:#9cb1bc;line-height:1.55}.card code{color:#83dff3;overflow-wrap:anywhere}.card li{margin:9px 0;color:#c7d6dd}.card ol{padding-left:22px}.boundary strong{color:#e5b960}@media(max-width:760px){.grid{grid-template-columns:1fr}nav{flex-direction:column}}`}</style></main>;
}
