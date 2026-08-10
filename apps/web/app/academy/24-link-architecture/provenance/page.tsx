"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import { TA14ProvenanceAdminLink } from "@/components/academy/ta14-provenance-admin-link";
import { TA14_24_LINKS, type TA14LinkId } from "@/lib/academy/ta14-24-link-canon";
import {
  loadTA14FullProvenanceMap,
  summarizeTA14Provenance,
  type TA14LinkProvenanceBundle,
} from "@/lib/academy/ta14-canonical-registry";

export default function TA14ProvenanceMapPage() {
  return (
    <Suspense fallback={<TA14ProvenanceMapRouteLoading />}>
      <TA14ProvenanceMapContent />
    </Suspense>
  );
}

function TA14ProvenanceMapContent() {
  const searchParams = useSearchParams();
  const requestedLink = searchParams.get("link");
  const [bundles, setBundles] = useState<TA14LinkProvenanceBundle[]>([]);
  const [selectedLinkId, setSelectedLinkId] = useState<TA14LinkId>("TA14-LINK-01");
  const [loading, setLoading] = useState(true);
  const [registryUnavailable, setRegistryUnavailable] = useState(false);

  useEffect(() => {
    if (!requestedLink) return;
    const matched = TA14_24_LINKS.find((item) => item.linkId === requestedLink);
    if (matched) setSelectedLinkId(matched.linkId);
  }, [requestedLink]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setRegistryUnavailable(false);
        const result = await loadTA14FullProvenanceMap();
        if (!cancelled) setBundles(result);
      } catch {
        if (!cancelled) {
          setBundles([]);
          setRegistryUnavailable(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const summary = useMemo(() => summarizeTA14Provenance(bundles), [bundles]);
  const selected = useMemo(() => {
    const canonical = TA14_24_LINKS.find((item) => item.linkId === selectedLinkId);
    return (
      bundles.find((bundle) => bundle.linkId === selectedLinkId) ?? {
        linkId: selectedLinkId,
        order: canonical?.order ?? 1,
        canonicalName: canonical?.canonicalName ?? "Unknown link",
        sources: [],
      }
    );
  }, [bundles, selectedLinkId]);

  const selectedCanonical = TA14_24_LINKS.find((item) => item.linkId === selected.linkId);

  return (
    <main className="prov">
      <style>{`
        .prov{--bg:#020711;--panel:rgba(7,18,30,.88);--line:rgba(126,180,214,.14);--cyan:#58e8ff;--indigo:#a8b1ff;--gold:#f2c85c;--text:#eef8ff;--muted:#8ca4b8;--dim:#61788d;min-height:100vh;color:var(--text);background:radial-gradient(circle at 12% 0%,rgba(88,232,255,.11),transparent 24%),radial-gradient(circle at 88% 4%,rgba(139,122,255,.10),transparent 26%),linear-gradient(180deg,#020711,#030a13 46%,#020711);overflow:hidden}.prov *{box-sizing:border-box}.prov a{color:inherit}.prov-shell{width:min(1460px,calc(100% - 48px));margin:0 auto}.prov-hero{position:relative;padding:76px 0 68px;border-bottom:1px solid var(--line)}.prov-hero:before{content:"";position:absolute;inset:0;background:linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px);background-size:54px 54px;mask-image:linear-gradient(to bottom,#000,transparent 88%);opacity:.42;pointer-events:none}.prov-top{position:relative;display:flex;justify-content:space-between;gap:20px;align-items:center}.prov-back{font-size:.75rem;font-weight:900;color:var(--cyan);text-decoration:none}.prov-actions{display:flex;flex-wrap:wrap;gap:9px}.prov-chip{display:inline-flex;align-items:center;min-height:34px;padding:0 12px;border:1px solid var(--line);border-radius:999px;background:rgba(255,255,255,.025);text-decoration:none;font-size:.62rem;font-weight:900;color:#dceaf5}.prov-chip:hover{border-color:rgba(88,232,255,.28);background:rgba(88,232,255,.05)}.prov-kicker{position:relative;margin-top:42px;color:var(--indigo);font-size:.64rem;font-weight:950;letter-spacing:.2em;text-transform:uppercase}.prov-title{position:relative;max-width:980px;margin:12px 0 0;font-size:clamp(3rem,6vw,6.1rem);line-height:.96;letter-spacing:-.055em}.prov-title span{display:block;color:#c8d0ff}.prov-lead{position:relative;max-width:930px;margin:24px 0 0;color:#c5d5e2;font-size:1.03rem;line-height:1.8}.prov-focus{position:relative;display:inline-flex;margin-top:22px;padding:10px 13px;border:1px solid rgba(168,177,255,.2);border-radius:13px;background:rgba(168,177,255,.055);font-size:.72rem;color:#e8ebff}.prov-metrics{padding:24px 0;border-bottom:1px solid var(--line);background:rgba(4,12,20,.78)}.prov-metric-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:1px;background:var(--line)}.prov-metric{padding:18px 20px;background:#04101a}.prov-metric strong{display:block;font-size:1.9rem;letter-spacing:-.04em}.prov-metric span{display:block;margin-top:5px;color:var(--dim);font-size:.58rem;font-weight:900;letter-spacing:.1em;text-transform:uppercase}.prov-status{margin-top:22px;display:flex;align-items:flex-start;gap:12px;padding:14px 16px;border:1px solid rgba(242,200,92,.18);border-radius:15px;background:rgba(242,200,92,.04)}.prov-status b{flex:0 0 auto;color:var(--gold);font-size:.6rem;letter-spacing:.12em;text-transform:uppercase}.prov-status span{color:var(--muted);font-size:.72rem;line-height:1.55}.prov-main{display:grid;grid-template-columns:minmax(0,1.12fr) minmax(360px,.88fr);gap:24px;padding:70px 0 86px}.prov-panel{border:1px solid var(--line);border-radius:24px;background:rgba(255,255,255,.025);box-shadow:0 30px 80px rgba(0,0,0,.14)}.prov-panel-head{padding:24px 24px 18px;border-bottom:1px solid var(--line)}.prov-eyebrow{color:var(--indigo);font-size:.6rem;font-weight:950;letter-spacing:.17em;text-transform:uppercase}.prov-panel-head h2{margin:8px 0 0;font-size:1.8rem;letter-spacing:-.03em}.prov-coverage{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;padding:18px}.prov-link{min-height:110px;display:flex;flex-direction:column;justify-content:space-between;padding:14px;border:1px solid var(--line);border-radius:15px;background:rgba(0,0,0,.10);color:inherit;text-align:left;cursor:pointer;transition:160ms ease}.prov-link:hover,.prov-link.active{transform:translateY(-2px);border-color:rgba(168,177,255,.32);background:rgba(168,177,255,.06)}.prov-link-top{display:flex;justify-content:space-between;gap:10px}.prov-link-num{color:var(--cyan);font-size:.62rem;font-weight:950}.prov-count{padding:3px 6px;border:1px solid var(--line);border-radius:999px;color:var(--dim);font-size:.5rem;font-weight:850}.prov-link strong{font-size:.75rem;line-height:1.25}.prov-detail{position:sticky;top:22px;align-self:start;padding:26px}.prov-detail-num{color:var(--cyan);font-size:.6rem;font-weight:950;letter-spacing:.15em;text-transform:uppercase}.prov-detail h2{margin:8px 0 0;font-size:2rem;letter-spacing:-.035em}.prov-detail-sub{margin-top:8px;color:var(--dim);font-size:.68rem}.prov-empty,.prov-source,.prov-loading{margin-top:22px;padding:18px;border:1px solid var(--line);border-radius:16px;background:rgba(0,0,0,.12)}.prov-empty strong,.prov-source h3{display:block;font-size:.88rem}.prov-empty p,.prov-source p,.prov-loading{margin:8px 0 0;color:var(--muted);font-size:.71rem;line-height:1.6}.prov-source+.prov-source{margin-top:10px}.prov-tags{display:flex;flex-wrap:wrap;gap:6px}.prov-tag{padding:4px 7px;border:1px solid var(--line);border-radius:999px;color:#dce8f2;font-size:.5rem;font-weight:900;text-transform:uppercase;letter-spacing:.08em}.prov-tag.primary{border-color:rgba(242,200,92,.18);color:#fff0bb;background:rgba(242,200,92,.04)}.prov-source-meta{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:12px;color:var(--dim);font-size:.6rem}.prov-source-link,.prov-lesson{display:inline-flex;margin-top:14px;color:var(--cyan);font-size:.7rem;font-weight:900;text-decoration:none}.prov-rule{padding:72px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);background:rgba(255,255,255,.018)}.prov-rule-grid{display:grid;grid-template-columns:.72fr 1.28fr;gap:36px}.prov-rule h2{margin:10px 0 0;font-size:2.6rem;line-height:1.05;letter-spacing:-.04em}.prov-rule p{margin:0;color:var(--muted);line-height:1.75;font-size:.8rem}.prov-boundary{margin-top:20px;padding:14px 15px;border:1px solid rgba(242,200,92,.14);border-radius:14px;background:rgba(242,200,92,.03);color:#d9cfae;font-size:.66rem;line-height:1.55}.prov-loading-page{min-height:70vh;display:grid;place-items:center;text-align:center;padding:40px}.prov-loading-page p{color:var(--muted)}
        @media(max-width:1050px){.prov-main,.prov-rule-grid{grid-template-columns:1fr}.prov-detail{position:static}.prov-metric-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.prov-coverage{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:700px){.prov-shell{width:min(100% - 28px,1460px)}.prov-top{display:grid}.prov-title{font-size:clamp(2.6rem,14vw,4.3rem)}.prov-metric-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.prov-coverage{grid-template-columns:1fr}.prov-actions{display:grid}.prov-chip{justify-content:center}.prov-rule h2{font-size:2rem}}
      `}</style>

      <section className="prov-hero">
        <div className="prov-shell">
          <div className="prov-top">
            <Link href="/academy/24-link-architecture" className="prov-back">← Back to 24-Link Explorer</Link>
            <div className="prov-actions">
              <Link href="/academy/24-link-architecture/provenance/patents" className="prov-chip">Explore patent portfolio</Link>
              <Link href="/academy/24-link-architecture/provenance/patents/families" className="prov-chip">Browse eight patent families</Link>
              <TA14ProvenanceAdminLink />
            </div>
          </div>

          <div className="prov-kicker">TA-14 Academy · Provenance Map</div>
          <h1 className="prov-title">Show the evidence <span>behind the architecture.</span></h1>
          <p className="prov-lead">Each canonical link can be connected to chronology, publications, patent applications, patents, artifacts, reviews, and other provenance-bearing records without collapsing those sources into a single claim.</p>

          {requestedLink && selectedCanonical ? (
            <div className="prov-focus">Focused provenance view: <strong>&nbsp;{requestedLink} · {selectedCanonical.canonicalName}</strong></div>
          ) : null}
        </div>
      </section>

      <section className="prov-metrics">
        <div className="prov-shell">
          <div className="prov-metric-grid">
            <Metric value={String(summary.linksWithSources)} label="Links with sources" />
            <Metric value={String(summary.totalRelationships)} label="Total relationships" />
            <Metric value={String(summary.primaryProvenanceRelationships)} label="Primary provenance" />
            <Metric value={String(summary.patentRelationships)} label="Patent relationships" />
            <Metric value={String(summary.publicationRelationships)} label="Publication relationships" />
          </div>
          {registryUnavailable ? (
            <div className="prov-status">
              <b>Registry status</b>
              <span>The canonical provenance registry is not available in the current production schema yet. The Academy remains usable, but source relationships will remain at zero until that governed registry is deployed and populated.</span>
            </div>
          ) : null}
        </div>
      </section>

      <section className="prov-shell prov-main">
        <section className="prov-panel">
          <div className="prov-panel-head">
            <div className="prov-eyebrow">24-Link provenance coverage</div>
            <h2>Choose a canonical link.</h2>
          </div>
          <div className="prov-coverage">
            {TA14_24_LINKS.map((item) => {
              const bundle = bundles.find((candidate) => candidate.linkId === item.linkId);
              const sourceCount = bundle?.sources.length ?? 0;
              return (
                <button key={item.linkId} type="button" onClick={() => setSelectedLinkId(item.linkId)} className={`prov-link ${selectedLinkId === item.linkId ? "active" : ""}`}>
                  <div className="prov-link-top"><span className="prov-link-num">{String(item.order).padStart(2,"0")}</span><span className="prov-count">{sourceCount} source{sourceCount === 1 ? "" : "s"}</span></div>
                  <strong>{item.canonicalName}</strong>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="prov-panel prov-detail">
          <div className="prov-detail-num">Link {String(selected.order).padStart(2,"0")}</div>
          <h2>{selected.canonicalName}</h2>
          <div className="prov-detail-sub">{selected.linkId}</div>

          {loading ? (
            <div className="prov-loading">Loading governed source relationships…</div>
          ) : registryUnavailable ? (
            <div className="prov-empty">
              <strong>Provenance registry not initialized in production.</strong>
              <p>This link can still be studied in the Academy. Source relationships will appear here when the canonical provenance registry is deployed and populated.</p>
              <div style={{ marginTop: 14 }}><TA14ProvenanceAdminLink linkId={selected.linkId} /></div>
            </div>
          ) : selected.sources.length === 0 ? (
            <div className="prov-empty">
              <strong>No source relationship recorded yet.</strong>
              <p>This does not mean the link lacks provenance. It means no governed public source relationship has yet been entered for this canonical link.</p>
              <div style={{ marginTop: 14 }}><TA14ProvenanceAdminLink linkId={selected.linkId} /></div>
            </div>
          ) : (
            selected.sources.map(({ relation, source }) => (
              <article key={`${relation.id}-${source.id}`} className="prov-source">
                <div className="prov-tags">
                  <span className="prov-tag">{relation.relationType.replaceAll("_"," ")}</span>
                  <span className="prov-tag">{source.sourceType.replaceAll("_"," ")}</span>
                  {relation.isPrimaryProvenance ? <span className="prov-tag primary">Primary provenance</span> : null}
                </div>
                <h3>{source.title}</h3>
                {relation.relationSummary ? <p>{relation.relationSummary}</p> : null}
                {source.publicSummary ? <p>{source.publicSummary}</p> : null}
                <div className="prov-source-meta">
                  {source.publicationDate ? <span>Published: {source.publicationDate}</span> : null}
                  {source.filingDate ? <span>Filed: {source.filingDate}</span> : null}
                  {source.priorityDate ? <span>Priority: {source.priorityDate}</span> : null}
                  {source.sourceIdentifier ? <span>ID: {source.sourceIdentifier}</span> : null}
                </div>
                {source.sourceUrl ? <a href={source.sourceUrl} target="_blank" rel="noreferrer" className="prov-source-link">Open public source →</a> : null}
              </article>
            ))
          )}

          <Link href={`/academy/24-link-architecture/${String(selected.order).padStart(2,"0")}-${selectedCanonical?.slug ?? ""}`} className="prov-lesson">Open canonical lesson →</Link>
        </aside>
      </section>

      <section className="prov-rule">
        <div className="prov-shell prov-rule-grid">
          <div>
            <div className="prov-eyebrow" style={{ color: "var(--gold)" }}>Provenance rule</div>
            <h2>Distinct records. Connected evidence.</h2>
          </div>
          <div>
            <p>A publication can establish public chronology. A patent application can establish a filing record and patent-position relationship. An artifact can demonstrate implementation. A review can establish a bounded finding. The Academy should show these relationships together without claiming that one source automatically proves all of the others.</p>
            <div className="prov-boundary">The foundational Chain of Eight — Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome — was created and publicly published May 1, 2025. The 24-link architecture is the later deeper-resolution expansion of that already-existing parent route.</div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return <div className="prov-metric"><strong>{value}</strong><span>{label}</span></div>;
}

function TA14ProvenanceMapRouteLoading() {
  return (
    <main className="prov-loading-page">
      <div>
        <strong>TA-14 Academy · Provenance Map</strong>
        <h1>Resolving link-focused provenance…</h1>
        <p>Preparing the requested canonical link and its governed source relationships.</p>
      </div>
    </main>
  );
}
