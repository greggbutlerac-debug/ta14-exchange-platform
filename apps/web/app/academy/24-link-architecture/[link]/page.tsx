import Link from "next/link";
import { notFound } from "next/navigation";

import {
  TA14_24_LINKS,
  TA14_PROVENANCE_STATEMENT,
  getTA14LinkBySlug,
} from "@/lib/academy/ta14-24-link-canon";

type PageProps = {
  params: Promise<{
    link: string;
  }>;
};

function routeSegment(order: number, slug: string) {
  return `${String(order).padStart(2, "0")}-${slug}`;
}

function extractSlug(value: string) {
  return decodeURIComponent(value).replace(/^\d{1,2}-/, "");
}

export function generateStaticParams() {
  return TA14_24_LINKS.map((item) => ({
    link: routeSegment(item.order, item.slug),
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { link } = await params;
  const item = getTA14LinkBySlug(extractSlug(link));

  if (!item) {
    return { title: "TA-14 Link Not Found | TA-14 Academy" };
  }

  return {
    title: `${String(item.order).padStart(2, "0")} ${item.canonicalName} | TA-14 Academy`,
    description: item.definition,
  };
}

export default async function TA14CanonicalLinkPage({ params }: PageProps) {
  const { link } = await params;
  const item = getTA14LinkBySlug(extractSlug(link));

  if (!item) notFound();

  const index = TA14_24_LINKS.findIndex(
    (candidate) => candidate.linkId === item.linkId,
  );
  const previous = index > 0 ? TA14_24_LINKS[index - 1] : null;
  const next =
    index >= 0 && index < TA14_24_LINKS.length - 1
      ? TA14_24_LINKS[index + 1]
      : null;

  const progress = Math.round((item.order / 24) * 100);

  return (
    <main className="lesson24">
      <style>{`
        .lesson24 {
          --bg: #020711;
          --panel: rgba(8, 20, 32, .82);
          --panel-2: rgba(10, 26, 40, .72);
          --line: rgba(125,180,214,.14);
          --line-strong: rgba(84,232,255,.28);
          --cyan: #54e8ff;
          --cyan-soft: #c8f8ff;
          --green: #48efad;
          --amber: #f4ca6d;
          --indigo: #a8b2ff;
          --rose: #ff8ca7;
          --text: #edf8ff;
          --muted: #8da4b8;
          --dim: #60778b;
          min-height: 100vh;
          overflow: hidden;
          color: var(--text);
          background:
            radial-gradient(circle at 8% 0%, rgba(84,232,255,.11), transparent 24%),
            radial-gradient(circle at 92% 4%, rgba(124,105,255,.08), transparent 26%),
            linear-gradient(180deg, #020711 0%, #030a12 48%, #020711 100%);
        }
        .lesson24 * { box-sizing: border-box; }
        .lesson24 a { color: inherit; }
        .lesson24-shell { width: min(1380px, calc(100% - 48px)); margin: 0 auto; }
        .lesson24-hero {
          position: relative;
          min-height: 650px;
          display: grid;
          align-items: center;
          border-bottom: 1px solid var(--line);
          overflow: hidden;
        }
        .lesson24-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: linear-gradient(to bottom, #000, transparent 88%);
          opacity: .42;
          pointer-events: none;
        }
        .lesson24-hero-grid {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(320px, .95fr);
          gap: 64px;
          align-items: center;
          padding: 72px 0 80px;
        }
        .lesson24-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--cyan);
          text-decoration: none;
          font-size: .72rem;
          font-weight: 900;
          letter-spacing: .03em;
        }
        .lesson24-badges { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 28px; }
        .lesson24-badge {
          display: inline-flex;
          align-items: center;
          min-height: 29px;
          padding: 0 11px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: rgba(255,255,255,.028);
          color: var(--muted);
          font-size: .58rem;
          font-weight: 900;
          letter-spacing: .12em;
          text-transform: uppercase;
        }
        .lesson24-badge.primary {
          color: var(--cyan-soft);
          border-color: rgba(84,232,255,.24);
          background: rgba(84,232,255,.055);
        }
        .lesson24-title {
          margin: 20px 0 0;
          max-width: 900px;
          font-size: clamp(3.5rem, 7vw, 7.6rem);
          line-height: .92;
          letter-spacing: -.065em;
          font-weight: 900;
        }
        .lesson24-definition {
          max-width: 850px;
          margin: 26px 0 0;
          color: #c8d8e5;
          font-size: clamp(1rem, 1.4vw, 1.18rem);
          line-height: 1.78;
        }
        .lesson24-hero-card {
          position: relative;
          min-height: 430px;
          display: grid;
          place-items: center;
        }
        .lesson24-rings { position: absolute; inset: 0; }
        .lesson24-ring {
          position: absolute;
          inset: 50% auto auto 50%;
          transform: translate(-50%, -50%);
          border: 1px solid rgba(125,180,214,.11);
          border-radius: 50%;
        }
        .lesson24-ring.r1 { width: 92%; aspect-ratio: 1; }
        .lesson24-ring.r2 { width: 70%; aspect-ratio: 1; border-color: rgba(84,232,255,.13); }
        .lesson24-ring.r3 { width: 48%; aspect-ratio: 1; border-color: rgba(72,239,173,.13); }
        .lesson24-core {
          position: relative;
          z-index: 1;
          width: 190px;
          aspect-ratio: 1;
          display: grid;
          place-items: center;
          border: 1px solid rgba(84,232,255,.28);
          border-radius: 50%;
          background: radial-gradient(circle at 30% 25%, rgba(84,232,255,.12), transparent 40%), rgba(5,16,27,.96);
          box-shadow: 0 0 90px rgba(84,232,255,.11);
          text-align: center;
        }
        .lesson24-core small { display:block; color:var(--cyan); font-size:.62rem; font-weight:950; letter-spacing:.2em; }
        .lesson24-core strong { display:block; margin-top:4px; font-size:4rem; line-height:1; letter-spacing:-.07em; }
        .lesson24-core span { display:block; margin-top:6px; color:var(--muted); font-size:.66rem; }
        .lesson24-meta {
          position: absolute;
          min-width: 150px;
          padding: 12px 14px;
          border: 1px solid var(--line);
          border-radius: 14px;
          background: rgba(5,16,27,.92);
          box-shadow: 0 16px 42px rgba(0,0,0,.24);
        }
        .lesson24-meta small { display:block; color:var(--dim); font-size:.53rem; font-weight:900; letter-spacing:.12em; text-transform:uppercase; }
        .lesson24-meta strong { display:block; margin-top:5px; color:#dbe8f2; font-size:.72rem; overflow-wrap:anywhere; }
        .lesson24-meta.m1 { left: 0; top: 15%; }
        .lesson24-meta.m2 { right: 0; top: 22%; }
        .lesson24-meta.m3 { right: 6%; bottom: 13%; }
        .lesson24-meta.m4 { left: 4%; bottom: 15%; }
        .lesson24-progress { border-bottom:1px solid var(--line); background:rgba(4,12,20,.78); }
        .lesson24-progress-grid { display:grid; grid-template-columns: 220px 1fr 140px; gap:18px; align-items:center; min-height:78px; }
        .lesson24-progress-label small { display:block; color:var(--dim); font-size:.55rem; font-weight:900; letter-spacing:.11em; text-transform:uppercase; }
        .lesson24-progress-label strong { display:block; margin-top:5px; font-size:.8rem; }
        .lesson24-track { height:6px; border-radius:999px; background:rgba(255,255,255,.06); overflow:hidden; }
        .lesson24-track span { display:block; height:100%; border-radius:inherit; background:linear-gradient(90deg,var(--cyan),var(--green)); }
        .lesson24-progress-number { text-align:right; font-size:.74rem; color:var(--muted); }
        .lesson24-section { padding: 80px 0; }
        .lesson24-section.alt { border-top:1px solid var(--line); border-bottom:1px solid var(--line); background:rgba(4,12,20,.62); }
        .lesson24-kicker { color:var(--green); font-size:.6rem; font-weight:950; letter-spacing:.16em; text-transform:uppercase; }
        .lesson24-h2 { margin:9px 0 0; font-size:clamp(2rem,4vw,3.7rem); line-height:1; letter-spacing:-.045em; }
        .lesson24-grid-2 { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; }
        .lesson24-panel {
          min-height: 250px;
          padding: 24px;
          border:1px solid var(--line);
          border-radius:22px;
          background: radial-gradient(circle at 100% 0%, rgba(84,232,255,.045), transparent 38%), rgba(255,255,255,.026);
        }
        .lesson24-panel.critical { border-color:rgba(255,140,167,.18); background:radial-gradient(circle at 100% 0%, rgba(255,140,167,.055), transparent 38%), rgba(255,255,255,.025); }
        .lesson24-panel.amber { border-color:rgba(244,202,109,.18); background:radial-gradient(circle at 100% 0%, rgba(244,202,109,.05), transparent 38%), rgba(255,255,255,.025); }
        .lesson24-panel.indigo { border-color:rgba(168,178,255,.18); background:radial-gradient(circle at 100% 0%, rgba(168,178,255,.05), transparent 38%), rgba(255,255,255,.025); }
        .lesson24-panel .eyebrow { color:var(--cyan); font-size:.57rem; font-weight:950; letter-spacing:.14em; text-transform:uppercase; }
        .lesson24-panel.critical .eyebrow { color:var(--rose); }
        .lesson24-panel.amber .eyebrow { color:var(--amber); }
        .lesson24-panel.indigo .eyebrow { color:var(--indigo); }
        .lesson24-panel h3 { margin:12px 0 0; font-size:1.22rem; letter-spacing:-.02em; }
        .lesson24-panel p { margin:15px 0 0; color:var(--muted); font-size:.78rem; line-height:1.72; }
        .lesson24-list { display:grid; gap:9px; margin-top:16px; }
        .lesson24-list div { display:flex; gap:10px; align-items:flex-start; padding:11px 12px; border:1px solid rgba(255,255,255,.07); border-radius:12px; background:rgba(0,0,0,.10); color:#c9d8e3; font-size:.72rem; line-height:1.55; }
        .lesson24-list i { width:7px; height:7px; flex:0 0 auto; margin-top:6px; border-radius:50%; background:var(--cyan); box-shadow:0 0 14px rgba(84,232,255,.28); }
        .lesson24-panel.critical .lesson24-list i { background:var(--rose); box-shadow:0 0 14px rgba(255,140,167,.24); }
        .lesson24-deps { display:flex; flex-wrap:wrap; gap:8px; margin-top:17px; }
        .lesson24-deps a { padding:8px 10px; border:1px solid var(--line); border-radius:999px; text-decoration:none; color:#d6e6f1; font-size:.68rem; font-weight:800; transition:160ms ease; }
        .lesson24-deps a:hover { border-color:var(--line-strong); color:var(--cyan-soft); transform:translateY(-1px); }
        .lesson24-mastery {
          padding: 30px;
          border:1px solid rgba(72,239,173,.20);
          border-radius:26px;
          background: radial-gradient(circle at 100% 0%, rgba(72,239,173,.08), transparent 34%), rgba(72,239,173,.025);
        }
        .lesson24-mastery p { margin:16px 0 0; max-width:900px; color:#c8d9e3; font-size:.8rem; line-height:1.72; }
        .lesson24-mastery-steps { display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:10px; margin-top:22px; }
        .lesson24-mastery-steps div { padding:13px 10px; border:1px solid rgba(255,255,255,.08); border-radius:13px; background:rgba(0,0,0,.10); text-align:center; color:#dce8ef; font-size:.68rem; font-weight:900; }
        .lesson24-provenance {
          display:grid;
          grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);
          gap:28px;
          padding:30px;
          border:1px solid rgba(168,178,255,.18);
          border-radius:26px;
          background:radial-gradient(circle at 100% 0%, rgba(168,178,255,.08), transparent 36%), rgba(255,255,255,.023);
        }
        .lesson24-provenance p { color:var(--muted); font-size:.77rem; line-height:1.7; }
        .lesson24-provenance-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:10px; }
        .lesson24-action { display:flex; flex-direction:column; min-height:180px; padding:17px; border:1px solid var(--line); border-radius:16px; background:rgba(0,0,0,.10); text-decoration:none; transition:160ms ease; }
        .lesson24-action:hover { transform:translateY(-2px); border-color:rgba(84,232,255,.24); background:rgba(84,232,255,.035); }
        .lesson24-action small { color:var(--cyan); font-size:.54rem; font-weight:950; letter-spacing:.12em; text-transform:uppercase; }
        .lesson24-action strong { margin-top:9px; font-size:.8rem; }
        .lesson24-action span { margin-top:8px; color:var(--muted); font-size:.65rem; line-height:1.5; }
        .lesson24-boundary { margin-top:16px; padding:20px; border:1px solid rgba(244,202,109,.17); border-radius:18px; background:rgba(244,202,109,.035); }
        .lesson24-boundary small { color:var(--amber); font-size:.56rem; font-weight:950; letter-spacing:.14em; text-transform:uppercase; }
        .lesson24-boundary p { margin:9px 0 0; color:#c9d5de; font-size:.71rem; line-height:1.65; }
        .lesson24-nav { border-top:1px solid var(--line); background:rgba(255,255,255,.015); }
        .lesson24-nav-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; padding:28px 0 34px; }
        .lesson24-nav a, .lesson24-nav-empty { display:block; min-height:92px; padding:17px; border:1px solid var(--line); border-radius:16px; background:rgba(255,255,255,.02); text-decoration:none; transition:160ms ease; }
        .lesson24-nav a:hover { transform:translateY(-2px); border-color:var(--line-strong); background:rgba(84,232,255,.035); }
        .lesson24-nav small { display:block; color:var(--dim); font-size:.54rem; font-weight:950; letter-spacing:.12em; text-transform:uppercase; }
        .lesson24-nav strong { display:block; margin-top:8px; color:var(--cyan-soft); font-size:.78rem; }
        .lesson24-nav .right { text-align:right; }
        .lesson24-nav-empty { color:var(--dim); font-size:.72rem; display:grid; align-items:center; }

        @media (max-width: 980px) {
          .lesson24-hero-grid { grid-template-columns:1fr; gap:30px; }
          .lesson24-hero-card { max-width:520px; width:100%; margin:0 auto; }
          .lesson24-provenance { grid-template-columns:1fr; }
        }
        @media (max-width: 760px) {
          .lesson24-shell { width:min(100% - 28px, 1380px); }
          .lesson24-hero-grid { padding:54px 0 62px; }
          .lesson24-title { font-size:clamp(3rem,15vw,5.2rem); }
          .lesson24-progress-grid { grid-template-columns:1fr; gap:10px; padding:15px 0; }
          .lesson24-progress-number { text-align:left; }
          .lesson24-grid-2, .lesson24-provenance-grid, .lesson24-nav-grid { grid-template-columns:1fr; }
          .lesson24-mastery-steps { grid-template-columns:repeat(2,minmax(0,1fr)); }
          .lesson24-nav .right { text-align:left; }
          .lesson24-meta { display:none; }
        }
      `}</style>

      <section className="lesson24-hero">
        <div className="lesson24-shell lesson24-hero-grid">
          <div>
            <Link href="/academy/24-link-architecture" className="lesson24-back">
              ← Back to 24-Link Explorer
            </Link>

            <div className="lesson24-badges">
              <span className="lesson24-badge primary">
                Link {String(item.order).padStart(2, "0")}
              </span>
              <span className="lesson24-badge">Parent anchor · {item.parentAnchor}</span>
              <span className="lesson24-badge">{item.versionState}</span>
            </div>

            <h1 className="lesson24-title">{item.canonicalName}</h1>
            <p className="lesson24-definition">{item.definition}</p>
          </div>

          <div className="lesson24-hero-card">
            <div className="lesson24-rings">
              <div className="lesson24-ring r1" />
              <div className="lesson24-ring r2" />
              <div className="lesson24-ring r3" />
            </div>

            <div className="lesson24-core">
              <div>
                <small>{item.linkId}</small>
                <strong>{String(item.order).padStart(2, "0")}</strong>
                <span>{item.canonicalName}</span>
              </div>
            </div>

            <div className="lesson24-meta m1">
              <small>Architecture region</small>
              <strong>{item.region}</strong>
            </div>
            <div className="lesson24-meta m2">
              <small>Position</small>
              <strong>{item.order} of 24</strong>
            </div>
            <div className="lesson24-meta m3">
              <small>Parent anchor</small>
              <strong>{item.parentAnchor}</strong>
            </div>
            <div className="lesson24-meta m4">
              <small>State</small>
              <strong>{item.versionState}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="lesson24-progress">
        <div className="lesson24-shell lesson24-progress-grid">
          <div className="lesson24-progress-label">
            <small>Canonical route position</small>
            <strong>{item.canonicalName}</strong>
          </div>
          <div className="lesson24-track" aria-label={`${progress}% through the canonical route`}>
            <span style={{ width: `${progress}%` }} />
          </div>
          <div className="lesson24-progress-number">{item.order} / 24 · {progress}%</div>
        </div>
      </section>

      <section className="lesson24-section">
        <div className="lesson24-shell">
          <div className="lesson24-grid-2">
            <Panel eyebrow="Governing question" title="What must this link answer?" body={item.governingQuestion} />
            <Panel eyebrow="Proof object" title="What demonstrates the state?" body={item.proofObject} tone="indigo" />
            <ListPanel eyebrow="Evidence requirements" title="What evidence must support this link?" items={item.evidenceRequirements} />
            <ListPanel eyebrow="Failure modes" title="What can make this link unsupportable?" items={item.failureModes} tone="critical" />
            <Panel eyebrow="Transition rule" title="What must be true before progression?" body={item.transitionRule} tone="amber" />
            <Panel eyebrow="Hold / refuse / escalate" title="When must continuation stop or narrow?" body={item.holdRefuseEscalateRule} tone="critical" />
            <DependencyPanel item={item} />
            <Panel eyebrow="Downstream consequence" title="What becomes vulnerable if this link is weak?" body={item.downstreamConsequence} tone="amber" />
          </div>
        </div>
      </section>

      <section className="lesson24-section alt">
        <div className="lesson24-shell">
          <div className="lesson24-mastery">
            <div className="lesson24-kicker">Mastery task</div>
            <h2 className="lesson24-h2">Demonstrate capability, not seat time.</h2>
            <p>{item.masteryTask}</p>
            <div className="lesson24-mastery-steps">
              {["Recognize", "Explain", "Evidence-map", "Diagnose", "Apply"].map((step) => (
                <div key={step}>{step}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="lesson24-section">
        <div className="lesson24-shell">
          <div className="lesson24-provenance">
            <div>
              <div className="lesson24-kicker" style={{ color: "var(--indigo)" }}>Trace this canonical link</div>
              <h2 className="lesson24-h2">Move from doctrine to provenance.</h2>
              <p>
                Continue from this lesson into the governed public record behind {item.canonicalName}: chronology, publications, patent position, artifacts, reviews, and source relationships remain separate evidence classes and should be read within their declared boundaries.
              </p>
            </div>

            <div className="lesson24-provenance-grid">
              <Link href={`/academy/24-link-architecture/provenance?link=${encodeURIComponent(item.linkId)}`} className="lesson24-action">
                <small>Provenance map</small>
                <strong>Inspect source relationships</strong>
                <span>Trace chronology, publications, artifacts, reviews, and governed public sources.</span>
              </Link>
              <Link href="/academy/24-link-architecture/provenance/patents" className="lesson24-action">
                <small style={{ color: "var(--amber)" }}>Patent position</small>
                <strong>Explore mapped applications</strong>
                <span>Review documented application records and bounded architectural relationships.</span>
              </Link>
              <Link href={`/academy/24-link-architecture/provenance/intake?link=${encodeURIComponent(item.linkId)}`} className="lesson24-action">
                <small style={{ color: "var(--indigo)" }}>Administrative intake</small>
                <strong>Register a source for this link</strong>
                <span>Open provenance intake with {item.linkId} already selected.</span>
              </Link>
            </div>
          </div>

          <div className="lesson24-boundary">
            <small>Provenance boundary</small>
            <p>{TA14_PROVENANCE_STATEMENT}</p>
          </div>
        </div>
      </section>

      <nav className="lesson24-nav">
        <div className="lesson24-shell lesson24-nav-grid">
          {previous ? (
            <Link href={`/academy/24-link-architecture/${routeSegment(previous.order, previous.slug)}`}>
              <small>Previous link</small>
              <strong>{String(previous.order).padStart(2, "0")} {previous.canonicalName}</strong>
            </Link>
          ) : (
            <div className="lesson24-nav-empty">Beginning of canonical route</div>
          )}

          {next ? (
            <Link href={`/academy/24-link-architecture/${routeSegment(next.order, next.slug)}`} className="right">
              <small>Next link</small>
              <strong>{String(next.order).padStart(2, "0")} {next.canonicalName}</strong>
            </Link>
          ) : (
            <div className="lesson24-nav-empty right">Future Chain completes the canonical route</div>
          )}
        </div>
      </nav>
    </main>
  );
}

function Panel({ eyebrow, title, body, tone = "" }: { eyebrow: string; title: string; body: string; tone?: "" | "critical" | "amber" | "indigo" }) {
  return (
    <section className={`lesson24-panel ${tone}`}>
      <div className="eyebrow">{eyebrow}</div>
      <h3>{title}</h3>
      <p>{body}</p>
    </section>
  );
}

function ListPanel({ eyebrow, title, items, tone = "" }: { eyebrow: string; title: string; items: readonly string[]; tone?: "" | "critical" }) {
  return (
    <section className={`lesson24-panel ${tone}`}>
      <div className="eyebrow">{eyebrow}</div>
      <h3>{title}</h3>
      <div className="lesson24-list">
        {items.map((value) => (
          <div key={value}><i aria-hidden="true" /><span>{value}</span></div>
        ))}
      </div>
    </section>
  );
}

function DependencyPanel({ item }: { item: (typeof TA14_24_LINKS)[number] }) {
  const upstream = item.upstreamDependencies
    .map((linkId) => TA14_24_LINKS.find((candidate) => candidate.linkId === linkId))
    .filter((candidate): candidate is (typeof TA14_24_LINKS)[number] => Boolean(candidate));

  return (
    <section className="lesson24-panel indigo">
      <div className="eyebrow">Upstream dependencies</div>
      <h3>What prior states does this link depend on?</h3>
      {upstream.length === 0 ? (
        <p>This is the entry link. It establishes the bounded reality from which the governed route begins.</p>
      ) : (
        <div className="lesson24-deps">
          {upstream.map((dependency) => (
            <Link key={dependency.linkId} href={`/academy/24-link-architecture/${routeSegment(dependency.order, dependency.slug)}`}>
              {String(dependency.order).padStart(2, "0")} {dependency.canonicalName}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export const dynamicParams = false;
export const revalidate = false;
