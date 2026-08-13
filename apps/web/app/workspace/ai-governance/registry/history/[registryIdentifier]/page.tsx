import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

type LifeEvent = {
  registry_identifier: string;
  event_key: string;
  event_type: string;
  event_date: string;
  title: string;
  summary: string | null;
  governance_version: string | null;
  artifact_identifier: string | null;
  demonstration_identifier: string | null;
  related_record_href: string | null;
  evidence_state: string | null;
  sequence_number: number;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(value));
}
function label(value: string) { return value.replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()); }
function eventFamily(type: string) {
  if (['participant_review','participant_response','technical_comment','external_publication'].includes(type)) return 'Independent voice';
  if (['evidence_challenge','factual_correction'].includes(type)) return 'Challenge & correction';
  if (['demonstration','interoperability_examination'].includes(type)) return 'Governed examination';
  if (['artifact','finding'].includes(type)) return 'Evidence & finding';
  if (type === 'registration') return 'Identity';
  return 'Progression';
}

export default async function GovernanceLifeHistoryPage({ params }: { params: Promise<{ registryIdentifier: string }> }) {
  const { registryIdentifier } = await params;
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error('Supabase environment variables are not configured.');
  const supabase = createServerClient(url, anonKey, { cookies: { getAll: () => cookieStore.getAll(), setAll: () => undefined } });
  const [{ data: eventsData }, { data: registryData }] = await Promise.all([
    supabase.from('ta14_governance_life_history_public_v1').select('*').eq('registry_identifier', registryIdentifier).order('sequence_number', { ascending: true }),
    supabase.from('ta14_registry_public_records').select('governance_name,version,steward_name,organization_name,registered_at').eq('registry_identifier', registryIdentifier).maybeSingle(),
  ]);
  const events = (eventsData ?? []) as LifeEvent[];
  const registry = registryData as null | { governance_name?: string; version?: string; steward_name?: string; organization_name?: string; registered_at?: string };
  const name = registry?.governance_name ?? registryIdentifier;
  const families = Array.from(new Set(events.map((event) => eventFamily(event.event_type))));
  const versions = Array.from(new Set(events.map((event) => event.governance_version).filter(Boolean)));
  const examinationCount = events.filter((event) => ['demonstration','interoperability_examination'].includes(event.event_type)).length;
  const findingCount = events.filter((event) => ['artifact','finding'].includes(event.event_type)).length;
  const voiceCount = events.filter((event) => ['participant_review','participant_response','technical_comment','external_publication','evidence_challenge','factual_correction'].includes(event.event_type)).length;

  return (
    <main className="page">
      <div className="grid" aria-hidden="true" />
      <header>
        <Link href="/workspace/ai-governance/registry">TA-14 Registry</Link>
        <span>GOVERNANCE LIFE HISTORY</span>
        <Link href={`/workspace/ai-governance/registry/records/${registryIdentifier}`}>Permanent Record →</Link>
      </header>

      <section className="hero">
        <p className="eyebrow">PERMANENT INSTITUTIONAL BIOGRAPHY</p>
        <div className="id">{registryIdentifier}</div>
        <h1>{name}</h1>
        <p className="lead">One governance identity. Every preserved state beneath it. Versions, demonstrations, examinations, artifacts, findings, challenges, corrections, responses and independent publications accumulate here without rewriting what came before.</p>
        <div className="badges">
          <span>{events.length} preserved events</span>
          {registry?.version ? <span>Current version {registry.version}</span> : null}
          <span>{families.length} event families</span>
          <span>Append-oriented chronology</span>
        </div>
      </section>

      <section className="principle">
        <div><small>INSTITUTIONAL RULE</small><h2>History accumulates. It does not disappear.</h2></div>
        <p>A later version does not silently inherit an earlier finding. A participant response does not become TA-14's voice. A correction does not erase the original record. Each event remains attributable to its own source, evidence state, version and governed boundary.</p>
      </section>

      <section className="metrics">
        {[['Preserved events',events.length],['Governed examinations',examinationCount],['Evidence & findings',findingCount],['Responses / corrections',voiceCount],['Versions observed',versions.length || (registry?.version ? 1 : 0)]].map(([k,v]) => <article key={String(k)}><span>{k}</span><strong>{v}</strong></article>)}
      </section>

      <section className="history">
        <div className="historyHead"><div><p className="eyebrow">CHRONOLOGICAL RECORD</p><h2>What happened, in order.</h2></div><Link href={`/workspace/ai-governance/registry/records/${registryIdentifier}`}>Inspect registered identity →</Link></div>
        {events.length === 0 ? <div className="empty">No published progression events have been recorded for this governance identity yet.</div> : <div className="timeline">
          {events.map((event,index) => <article className="event" key={event.event_key}>
            <div className="rail"><b>{String(index+1).padStart(2,'0')}</b><span>{formatDate(event.event_date)}</span><i /></div>
            <div className="eventCard">
              <div className="eventTop"><span className="family">{eventFamily(event.event_type)}</span><span>{label(event.event_type)}</span>{event.governance_version ? <span>Version {event.governance_version}</span> : null}{event.evidence_state ? <span>{label(event.evidence_state)}</span> : null}</div>
              <h3>{event.title}</h3>
              {event.summary ? <p>{event.summary}</p> : null}
              <div className="refs">{event.demonstration_identifier ? <span>Proceeding · {event.demonstration_identifier}</span> : null}{event.artifact_identifier ? <span>Artifact · {event.artifact_identifier}</span> : null}</div>
              {event.related_record_href ? <Link className="open" href={event.related_record_href}>Open governed record →</Link> : null}
            </div>
          </article>)}
        </div>}
      </section>

      <section className="legend"><p className="eyebrow">VOICE & RECORD SEPARATION</p><h2>The chronology can contain disagreement without collapsing identity.</h2><div>{['TA-14 finding','Participant response','Independent review','Evidence challenge','Factual correction','External publication'].map(x=><span key={x}>{x}</span>)}</div><p>Each record remains attributable. Presence in this history means the event is part of the preserved institutional chronology; it does not mean TA-14 adopted another party's statement, endorsed the architecture, or changed an earlier finding.</p></section>
      <footer><strong>TA-14 AI Governance Exchange</strong><span>One governance identity · many preserved states</span></footer>

      <style>{`
        *{box-sizing:border-box} body{margin:0;background:#020711;color:#edf5fb;font-family:Inter,system-ui,sans-serif}.page{min-height:100vh;position:relative;overflow:hidden;background:radial-gradient(circle at 80% 0,rgba(32,122,184,.18),transparent 30%),radial-gradient(circle at 8% 55%,rgba(218,174,85,.07),transparent 24%),#020711}.grid{position:fixed;inset:0;pointer-events:none;opacity:.13;background-image:linear-gradient(rgba(100,210,255,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(100,210,255,.07) 1px,transparent 1px);background-size:56px 56px}a{color:inherit;text-decoration:none}header{position:relative;z-index:2;height:72px;padding:0 5vw;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(105,211,255,.13);color:#91a9b9;font-size:.68rem;font-weight:850;letter-spacing:.09em}header span{color:#d9ad55}.hero,.principle,.metrics,.history,.legend{position:relative;z-index:2;width:min(1180px,90vw);margin-inline:auto}.hero{padding:96px 0 54px}.eyebrow{margin:0 0 11px;color:#d9ad55;font-size:.62rem;font-weight:900;letter-spacing:.18em}.id{color:#68d8ff;font:800 .75rem ui-monospace,monospace;letter-spacing:.08em}.hero h1{max-width:1000px;margin:13px 0 22px;font-size:clamp(3.2rem,7vw,6.6rem);line-height:.92;letter-spacing:-.06em}.lead{max-width:900px;color:#a9bfce;font-size:1.1rem;line-height:1.8}.badges{display:flex;flex-wrap:wrap;gap:8px;margin-top:27px}.badges span,.eventTop span,.refs span,.legend div span{border:1px solid rgba(105,211,255,.15);border-radius:999px;padding:7px 10px;color:#9fb7c7;font-size:.66rem;font-weight:800}.principle{display:grid;grid-template-columns:1fr 1.25fr;gap:50px;padding:35px;border:1px solid rgba(218,174,85,.28);border-radius:20px;background:linear-gradient(120deg,rgba(218,174,85,.09),rgba(5,20,32,.72))}.principle h2{margin:8px 0 0;font-size:2rem}.principle p,.legend>p{margin:0;color:#a9bfce;line-height:1.8}.metrics{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-top:18px}.metrics article{padding:20px;border:1px solid rgba(105,211,255,.13);border-radius:15px;background:rgba(6,20,32,.7)}.metrics span,.metrics strong{display:block}.metrics span{color:#718da0;font-size:.6rem;font-weight:850;text-transform:uppercase;letter-spacing:.09em}.metrics strong{margin-top:8px;font-size:2rem}.history{padding:90px 0 40px}.historyHead{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:30px}.historyHead h2,.legend h2{margin:7px 0 0;font-size:clamp(2.3rem,4vw,4rem);letter-spacing:-.045em}.historyHead>a{color:#d9ad55;font-size:.75rem;font-weight:850}.timeline{display:grid;gap:4px}.event{display:grid;grid-template-columns:125px 1fr;gap:22px}.rail{position:relative;padding-top:25px;text-align:right}.rail b{display:block;color:#d9ad55;font-size:.7rem}.rail span{display:block;margin-top:5px;color:#6f899b;font-size:.65rem}.rail i{position:absolute;right:-14px;top:30px;width:8px;height:8px;border-radius:50%;background:#67d9ff;box-shadow:0 0 20px rgba(103,217,255,.7)}.event:not(:last-child) .rail:after{content:'';position:absolute;right:-10.5px;top:38px;bottom:-8px;width:1px;background:linear-gradient(#67d9ff33,#d9ad5530)}.eventCard{margin-bottom:14px;padding:25px 27px;border:1px solid rgba(105,211,255,.14);border-radius:19px;background:rgba(6,20,32,.76)}.eventTop{display:flex;flex-wrap:wrap;gap:7px}.eventTop .family{border-color:rgba(218,174,85,.32);color:#d9ad55}.eventCard h3{margin:15px 0 0;font-size:1.45rem}.eventCard p{color:#a7bdcc;line-height:1.75}.refs{display:flex;flex-wrap:wrap;gap:7px;margin-top:14px}.open{display:inline-block;margin-top:17px;color:#67d9ff;font-size:.75rem;font-weight:850}.empty{padding:30px;border:1px solid rgba(105,211,255,.14);border-radius:18px;color:#9bb2c2}.legend{margin-top:50px;margin-bottom:100px;padding:42px;border:1px solid rgba(105,211,255,.14);border-radius:22px;background:rgba(5,18,29,.72)}.legend div{display:flex;flex-wrap:wrap;gap:8px;margin:24px 0}.legend div span{color:#d6e6ef}.page footer{position:relative;z-index:2;padding:30px 5vw;display:flex;justify-content:space-between;border-top:1px solid rgba(105,211,255,.12);color:#7893a4;font-size:.68rem}.page footer span{color:#d9ad55}@media(max-width:850px){header span{display:none}.principle{grid-template-columns:1fr}.metrics{grid-template-columns:1fr 1fr}.event{grid-template-columns:76px 1fr}.historyHead{align-items:flex-start;flex-direction:column}.page footer{flex-direction:column;gap:8px}}@media(max-width:520px){.metrics{grid-template-columns:1fr}.event{grid-template-columns:1fr}.rail{text-align:left;padding-top:10px}.rail i,.rail:after{display:none}}
      `}</style>
    </main>
  );
}
