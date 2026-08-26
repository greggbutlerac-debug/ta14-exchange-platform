'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const PRIMARY_PHONE = '386-337-7215';
const BASE = 'https://www.ta14exchange.com';

type IndexState = 'NOT SURFACED' | 'DISCOVERED' | 'CRAWLED' | 'INDEXED' | 'NEEDS REVIEW';
type PageRecord = {
  key: string;
  market: string;
  label: string;
  path: string;
  query: string;
  technical: 'READY';
};

const pages: PageRecord[] = [
  { key: 'second-opinion', market: 'Pinellas County', label: 'AC Second Opinion', path: '/transparent-air/second-opinion', query: 'AC second opinion Pinellas County', technical: 'READY' },
  { key: 'gulfport', market: 'Gulfport', label: 'AC Repair + Second Opinion', path: '/transparent-air/gulfport-ac-repair', query: 'AC repair Gulfport FL', technical: 'READY' },
  { key: 'seminole', market: 'Seminole', label: 'AC Repair + Second Opinion', path: '/transparent-air/seminole-ac-repair', query: 'AC repair Seminole FL', technical: 'READY' },
  { key: 'pinellas-park', market: 'Pinellas Park', label: 'AC Repair + Second Opinion', path: '/transparent-air/pinellas-park-ac-repair', query: 'AC repair Pinellas Park FL', technical: 'READY' },
  { key: 'south-st-pete', market: 'South St. Petersburg', label: 'AC Repair + Second Opinion', path: '/transparent-air/south-st-petersburg-ac-repair', query: 'AC repair South St Petersburg FL', technical: 'READY' },
];

const defaultStates: Record<string, IndexState> = Object.fromEntries(pages.map((page) => [page.key, 'NOT SURFACED'])) as Record<string, IndexState>;

const checklistSeed = [
  { id: 'sitemap', label: 'Submit www sitemap in Google Search Console', done: false },
  { id: 'inspect-second-opinion', label: 'Request indexing: Pinellas County second-opinion page', done: false },
  { id: 'inspect-gulfport', label: 'Request indexing: Gulfport page', done: false },
  { id: 'inspect-seminole', label: 'Request indexing: Seminole page', done: false },
  { id: 'inspect-pinellas-park', label: 'Request indexing: Pinellas Park page', done: false },
  { id: 'inspect-south-st-pete', label: 'Request indexing: South St. Petersburg page', done: false },
];

export default function ResidentialCommandCenter() {
  const [states, setStates] = useState<Record<string, IndexState>>(defaultStates);
  const [checks, setChecks] = useState(checklistSeed);

  useEffect(() => {
    try {
      const savedStates = window.localStorage.getItem('ta14-residential-index-states');
      const savedChecks = window.localStorage.getItem('ta14-residential-index-checklist');
      if (savedStates) setStates({ ...defaultStates, ...JSON.parse(savedStates) });
      if (savedChecks) setChecks(JSON.parse(savedChecks));
    } catch {}
  }, []);

  useEffect(() => {
    try { window.localStorage.setItem('ta14-residential-index-states', JSON.stringify(states)); } catch {}
  }, [states]);

  useEffect(() => {
    try { window.localStorage.setItem('ta14-residential-index-checklist', JSON.stringify(checks)); } catch {}
  }, [checks]);

  const totals = useMemo(() => {
    const indexed = Object.values(states).filter((value) => value === 'INDEXED').length;
    const surfaced = Object.values(states).filter((value) => value !== 'NOT SURFACED').length;
    const completed = checks.filter((item) => item.done).length;
    return { indexed, surfaced, completed };
  }, [states, checks]);

  const changeState = (key: string, value: IndexState) => setStates((current) => ({ ...current, [key]: value }));
  const toggleCheck = (id: string) => setChecks((current) => current.map((item) => item.id === id ? { ...item, done: !item.done } : item));

  return (
    <main className="shell">
      <nav>
        <Link className="brand" href="/command-center">TA-14 COMMAND CENTERS</Link>
        <div className="navlinks">
          <Link href="/eu-ai-act/command-center">COMMERCIAL</Link>
          <span>RESIDENTIAL</span>
          <Link href="/transparent-air/second-opinion">LIVE SERVICE</Link>
        </div>
      </nav>

      <header className="hero">
        <div>
          <span className="eyebrow">TRANSPARENT AIR · RESIDENTIAL ACQUISITION OPERATIONS</span>
          <h1>RESIDENTIAL <em>COMMAND CENTER</em></h1>
          <p>One operating view for local search visibility, indexing state, page readiness and phone-call conversion. Commercial governance stays in the commercial command center. This room exists for one outcome: qualified homeowners finding Transparent Air and calling.</p>
        </div>
        <aside>
          <small>PRIMARY CONVERSION</small>
          <strong>PHONE CALL</strong>
          <a href={`tel:+1${PRIMARY_PHONE.replaceAll('-', '')}`}>{PRIMARY_PHONE}</a>
        </aside>
      </header>

      <section className="truth">
        <b>INDEXING IS NOT THE GOAL. RANKING IS NOT THE GOAL. THE CALL IS THE GOAL.</b>
        <span>Search visibility matters only when it creates qualified residential demand.</span>
      </section>

      <section className="metrics">
        <article><span>LOCAL PAGES</span><b>5</b><small>commercial-intent routes</small></article>
        <article><span>TECHNICALLY READY</span><b>5/5</b><small>200 · index/follow · canonical</small></article>
        <article><span>INDEXED</span><b>{totals.indexed}/5</b><small>update from Search Console</small></article>
        <article><span>SEARCH STATE MOVED</span><b>{totals.surfaced}/5</b><small>beyond not surfaced</small></article>
        <article><span>SUBMISSION TASKS</span><b>{totals.completed}/6</b><small>Search Console actions</small></article>
      </section>

      <section>
        <div className="sectionHead">
          <div><span>LIVE TECHNICAL STATE</span><h2>What is already solved?</h2></div>
          <i>● TECHNICAL INDEXING PATH READY</i>
        </div>
        <div className="solved">
          <article><b>01</b><h3>Canonical host normalized</h3><p>Bare-domain traffic permanently redirects to www. Robots, sitemap and page canonicals now agree on the www host.</p></article>
          <article><b>02</b><h3>Sitemap contains all five pages</h3><p>Every Transparent Air local route is advertised on the preferred canonical hostname.</p></article>
          <article><b>03</b><h3>Pages are crawlable</h3><p>Public routes return 200, are prerendered and explicitly declare index/follow.</p></article>
          <article><b>04</b><h3>Call conversion tracking is live</h3><p>Transparent Air page views and tel: clicks emit GA4 events with landing path, source, medium, campaign and clicked number.</p></article>
        </div>
      </section>

      <section>
        <div className="sectionHead"><div><span>LOCAL SEARCH LEDGER</span><h2>Five markets. One residential funnel.</h2><p>Update the indexing state from Google Search Console as each URL progresses.</p></div></div>
        <div className="ledger">
          {pages.map((page) => (
            <article key={page.key}>
              <div className="market"><small>{page.market.toUpperCase()}</small><h3>{page.label}</h3><code>{page.path}</code></div>
              <div><span>PRIMARY QUERY</span><strong>{page.query}</strong></div>
              <div><span>TECHNICAL</span><strong className="ready">{page.technical}</strong></div>
              <div className="stateControl"><span>GOOGLE STATE</span><select value={states[page.key]} onChange={(event) => changeState(page.key, event.target.value as IndexState)}><option>NOT SURFACED</option><option>DISCOVERED</option><option>CRAWLED</option><option>INDEXED</option><option>NEEDS REVIEW</option></select></div>
              <div className="actions"><a href={`${BASE}${page.path}`} target="_blank" rel="noreferrer">OPEN PAGE</a><a href={`https://www.google.com/search?q=${encodeURIComponent(`site:www.ta14exchange.com${page.path}`)}`} target="_blank" rel="noreferrer">CHECK PUBLIC SEARCH</a></div>
            </article>
          ))}
        </div>
      </section>

      <section className="split">
        <div>
          <span>GOOGLE SEARCH CONSOLE</span>
          <h2>Move from guessing to recorded indexing state.</h2>
          <p>This command center does not pretend public search results are Search Console. Record the actual status Google reports for each URL, then act on the exclusion reason instead of rewriting pages blindly.</p>
          <div className="checklist">
            {checks.map((item) => <label key={item.id} className={item.done ? 'done' : ''}><input type="checkbox" checked={item.done} onChange={() => toggleCheck(item.id)} /><span>{item.label}</span></label>)}
          </div>
          <div className="toolLinks"><a href="https://search.google.com/search-console" target="_blank" rel="noreferrer">OPEN SEARCH CONSOLE →</a><a href={`${BASE}/sitemap.xml`} target="_blank" rel="noreferrer">OPEN SITEMAP →</a><a href={`${BASE}/robots.txt`} target="_blank" rel="noreferrer">OPEN ROBOTS →</a></div>
        </div>
        <aside>
          <small>CURRENT PUBLIC SEARCH SIGNAL</small>
          <b>0 / 5</b>
          <h3>Transparent Air local pages surfaced in our latest exact-URL public checks</h3>
          <p>That is a visibility signal, not a Search Console determination. Update the ledger when Google reports a stronger state.</p>
        </aside>
      </section>

      <section>
        <div className="sectionHead"><div><span>CONVERSION INSTRUMENT</span><h2>When traffic arrives, measure the phone.</h2></div></div>
        <div className="conversion">
          <article><span>EVENT</span><code>transparent_air_page_view</code><p>Landing path, traffic source, medium and campaign.</p></article>
          <article><span>EVENT</span><code>transparent_air_phone_click</code><p>Landing path, clicked phone number, link label, source, medium and campaign.</p></article>
          <article><span>SUCCESS TEST</span><strong>Qualified calls / week</strong><p>The residential program succeeds when local discovery produces actual service opportunities.</p></article>
        </div>
      </section>

      <section className="priority">
        <span>NEXT OPERATING ORDER</span>
        <h2>Submit. Inspect. Record. Then optimize only what Google proves needs work.</h2>
        <div className="order"><b>1</b><p>Submit the www sitemap.</p><b>2</b><p>Request indexing for all five routes.</p><b>3</b><p>Record each Search Console state here.</p><b>4</b><p>Watch impressions, queries, CTR and phone clicks.</p><b>5</b><p>Change titles/content only when evidence shows the opportunity.</p></div>
      </section>

      <style jsx>{`
        *{box-sizing:border-box}.shell{min-height:100vh;background:#07191d;color:#effdfd;font-family:Inter,system-ui,sans-serif}nav,.hero,.truth,.metrics,section{max-width:1500px;margin:auto}nav{height:72px;padding:0 4vw;border-bottom:1px solid #21474b;display:flex;justify-content:space-between;align-items:center}.brand,.navlinks a{color:#aef5ef;text-decoration:none;font-size:9px;font-weight:900;letter-spacing:.12em}.navlinks{display:flex;gap:20px;align-items:center}.navlinks span{font-size:9px;color:#ffd47a;font-weight:900;letter-spacing:.12em}.hero{padding:90px 4vw 65px;display:grid;grid-template-columns:1fr 330px;gap:55px;align-items:center;background:radial-gradient(circle at 15% 0,#14555b66,transparent 42%)}.eyebrow,section>span,.sectionHead span{font-size:9px;color:#7de4dc;font-weight:900;letter-spacing:.18em}.hero h1{font:clamp(58px,8vw,108px)/.88 Georgia,serif;margin:18px 0}.hero h1 em{font-style:normal;color:#78e7de}.hero p,section p{color:#a9c6c7;line-height:1.75}.hero aside{border:1px solid #2d686b;background:#0b262b;padding:28px;border-radius:18px}.hero aside small{font-size:8px;color:#78d8d1}.hero aside strong{display:block;font:42px Georgia,serif;margin:12px 0}.hero aside a{color:#ffd47a;font-weight:900;text-decoration:none}.truth{border:1px solid #6f5928;background:#191507;padding:20px 4vw;display:flex;gap:18px;justify-content:center;color:#ffdd8f}.truth span{color:#c9bb91}.metrics{padding:25px 4vw;display:grid;grid-template-columns:repeat(5,1fr);gap:8px}.metrics article,.solved article,.conversion article{border:1px solid #21474b;background:#0a2227;padding:20px}.metrics span,.conversion span{font-size:7px;color:#76aeb1}.metrics b{display:block;font:42px Georgia,serif;margin:8px 0}.metrics small{color:#8ea9aa}section{padding:72px 4vw;border-top:1px solid #17383c}.sectionHead{display:flex;justify-content:space-between;gap:25px;align-items:end;margin-bottom:26px}.sectionHead h2,section h2{font:clamp(34px,4vw,58px)/1 Georgia,serif;margin:8px 0}.sectionHead i{font-size:8px;color:#75e3b9}.solved{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.solved b{font:30px Georgia,serif;color:#73e4db}.solved h3{font-size:16px}.solved p{font-size:11px}.ledger{display:grid;gap:8px}.ledger>article{display:grid;grid-template-columns:1.5fr 1.2fr .6fr .8fr 1fr;gap:16px;align-items:center;border:1px solid #21474b;background:#0a2025;padding:18px}.ledger span{display:block;font-size:7px;color:#719b9e;margin-bottom:6px}.market h3{margin:4px 0}.market small{color:#76e2da;font-weight:900}.market code,.conversion code{color:#9fece7}.ledger strong{font-size:10px}.ready{color:#78e3b9!important}.stateControl select{width:100%;background:#08191d;color:#effdfd;border:1px solid #376266;padding:9px;font-size:9px;font-weight:900}.actions{display:flex;gap:7px;flex-wrap:wrap}.actions a,.toolLinks a{padding:9px 10px;border:1px solid #376266;color:#b9f3ef;text-decoration:none;font-size:7px;font-weight:900}.split{display:grid;grid-template-columns:1fr 360px;gap:45px}.split aside{border:1px solid #6f5928;background:#171407;padding:30px}.split aside b{display:block;font:68px Georgia,serif;color:#ffd47a;margin:10px 0}.checklist{display:grid;gap:8px;margin:25px 0}.checklist label{display:flex;gap:12px;padding:12px;border:1px solid #264e52;background:#0a2025;font-size:11px}.checklist label.done{opacity:.55;text-decoration:line-through}.toolLinks{display:flex;gap:8px;flex-wrap:wrap}.conversion{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.conversion code,.conversion strong{display:block;margin:10px 0;font-size:15px}.priority{background:#0b252a}.order{display:grid;grid-template-columns:40px 1fr;gap:6px 15px;max-width:900px}.order b{font:28px Georgia,serif;color:#ffd47a}.order p{margin:4px 0}@media(max-width:900px){.hero,.split{grid-template-columns:1fr}.metrics,.solved,.conversion{grid-template-columns:1fr 1fr}.ledger>article{grid-template-columns:1fr}.hero{padding-top:55px}.hero h1{font-size:58px}}@media(max-width:600px){nav{height:auto;padding:18px 4vw;align-items:flex-start;gap:15px}.navlinks{flex-direction:column;align-items:flex-end;gap:8px}.metrics,.solved,.conversion{grid-template-columns:1fr}.truth{flex-direction:column}.hero h1{font-size:45px}}
      `}</style>
    </main>
  );
}
