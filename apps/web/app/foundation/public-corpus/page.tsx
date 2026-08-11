"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CORPUS_CATEGORY_LABELS,
  CORPUS_COUNTS,
  CORPUS_TOTAL,
  TA14_PUBLIC_CORPUS,
  type CorpusCategory,
  type CorpusRecord,
} from "./corpus-merged";
import {
  CORPUS_FAMILIES,
  TA14_LINEAGE,
  recordMatchesFamily,
  type CorpusFamilyId,
} from "./corpus-families";
import RelatedFamilyBadges from "./RelatedFamilyBadges";

const categories: Array<"ALL" | CorpusCategory> = [
  "ALL", "BOOK", "ARTICLE", "ZENODO", "PATENT", "STANDARD", "REPOSITORY", "SITE", "IMPLEMENTATION", "CHRONOLOGY",
];

const categoryDescriptions: Record<CorpusCategory, string> = {
  BOOK: "Books, manuals, workbooks, and long-form publications documenting the TA-14 architecture and its applied domains.",
  ARTICLE: "Public articles, essays, industry publications, and chronological explanations of the TA-14 body of work.",
  ZENODO: "Persistent public deposits, DOI records, and architecture lineage preserved through Zenodo.",
  PATENT: "Patent applications, filing lineage, related inventions, and declared rights records.",
  STANDARD: "TA-14 standards, protocols, methods, and public implementation requirements.",
  REPOSITORY: "Public GitHub repositories preserving code, architecture, demonstrations, and implementation history.",
  SITE: "Public architecture, doctrine, patent-position, and institutional presentation sites.",
  IMPLEMENTATION: "Operational systems and reference implementations translating TA-14 architecture into usable public tools.",
  CHRONOLOGY: "Dated milestones showing the development of TA-14 from field evidence discipline to admissible execution governance.",
};

export default function PublicCorpusPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"ALL" | CorpusCategory>("ALL");
  const [family, setFamily] = useState<"ALL" | CorpusFamilyId>("ALL");
  const [year, setYear] = useState("ALL");
  const [sort, setSort] = useState("NEWEST");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedCategory = params.get("category") as CorpusCategory | null;
    const requestedFamily = params.get("family") as CorpusFamilyId | null;
    if (requestedCategory && categories.includes(requestedCategory)) setCategory(requestedCategory);
    if (requestedFamily && CORPUS_FAMILIES.some((item) => item.id === requestedFamily)) setFamily(requestedFamily);
  }, []);

  const years = useMemo(() => Array.from(new Set(TA14_PUBLIC_CORPUS.map((record) => record.year))).sort((a, b) => b - a), []);
  const familyCounts = useMemo(() => Object.fromEntries(CORPUS_FAMILIES.map((item) => [item.id, TA14_PUBLIC_CORPUS.filter((record) => recordMatchesFamily(record, item.id)).length])) as Record<CorpusFamilyId, number>, []);

  const records = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = TA14_PUBLIC_CORPUS.filter((record) => {
      if (category !== "ALL" && record.category !== category) return false;
      if (family !== "ALL" && !recordMatchesFamily(record, family)) return false;
      if (year !== "ALL" && record.year !== Number(year)) return false;
      if (!normalized) return true;
      return [record.title, record.author, record.platform, record.identifier, record.description, record.relationship, record.sourceClass, ...(record.tags || [])]
        .filter(Boolean).join(" ").toLowerCase().includes(normalized);
    });
    return filtered.sort((a, b) => {
      if (sort === "TITLE") return a.title.localeCompare(b.title);
      const aDate = a.date || `${a.year}-01-01`;
      const bDate = b.date || `${b.year}-01-01`;
      return sort === "OLDEST" ? aDate.localeCompare(bDate) : bDate.localeCompare(aDate);
    });
  }, [query, category, family, year, sort]);

  const clearFilters = () => { setQuery(""); setCategory("ALL"); setFamily("ALL"); setYear("ALL"); setSort("NEWEST"); };
  const openFamily = (id: CorpusFamilyId) => { setFamily(id); setCategory("ALL"); document.getElementById("records")?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <main style={{ minHeight: "100vh", background: "radial-gradient(circle at 50% -10%,#123651 0,#06111d 38%,#040b13 100%)", color: "#eef5ff", padding: "32px 24px 80px" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <nav style={{ display: "flex", gap: 18, flexWrap: "wrap", marginBottom: 42 }}>
          <Link href="/foundation">TA-14 Foundation</Link><a href="#families">Architecture Families</a><a href="#lineage">Lineage Map</a><a href="#search">Search</a><a href="#records">Records</a><Link href="/registry">Registry</Link><Link href="/workspace">Open Exchange</Link>
        </nav>

        <section style={{ maxWidth: 1050, marginBottom: 40 }}>
          <div style={{ letterSpacing: 2, fontSize: 12, fontWeight: 800, color: "#70ddff" }}>TA-14 FOUNDATION • COMPLETE PUBLIC CORPUS</div>
          <h1 style={{ fontSize: "clamp(44px,7vw,92px)", lineHeight: .98, margin: "18px 0" }}>The whole body of work, <em>with its lineage visible.</em></h1>
          <p style={{ fontSize: 18, lineHeight: 1.7, opacity: .8 }}>The public corpus is not only a document list. It is the institutional evidence ledger for the books, articles, DOI deposits, patent filings, standards, repositories, implementations, architecture sites, and milestones that form the TA-14 body of work.</p>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 58 }}>
          <Metric value={CORPUS_TOTAL} label="structured public records" /><Metric value={CORPUS_COUNTS.BOOK} label="books & long-form" /><Metric value={CORPUS_COUNTS.ARTICLE} label="articles & essays" /><Metric value={CORPUS_COUNTS.ZENODO} label="Zenodo & DOI records" /><Metric value={CORPUS_COUNTS.PATENT} label="patent records" /><Metric value={CORPUS_COUNTS.STANDARD} label="standards & protocols" />
        </section>

        <section id="families" style={{ marginBottom: 64 }}>
          <Eyebrow>INSTITUTIONAL NAVIGATION</Eyebrow>
          <h2 style={sectionTitle}>Explore the corpus by architecture family.</h2>
          <p style={sectionIntro}>A publication may belong to more than one family. These views expose intellectual and operational relationships that ordinary format categories cannot show.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 16 }}>
            {CORPUS_FAMILIES.map((item) => <button key={item.id} onClick={() => openFamily(item.id)} style={familyCardStyle}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "#70ddff", fontSize: 12, letterSpacing: 2 }}>{item.code} • FAMILY</span><span style={countPill}>{familyCounts[item.id]}</span></div><h3 style={{ fontSize: 25, margin: "18px 0 10px" }}>{item.title}</h3><p style={{ opacity: .72, lineHeight: 1.65, margin: 0 }}>{item.description}</p><div style={{ marginTop: 20, fontSize: 13, color: "#8ee8ff" }}>Open family record ↓</div></button>)}
          </div>
        </section>

        <section id="lineage" style={{ marginBottom: 64, padding: "clamp(24px,4vw,48px)", border: "1px solid #28556f", borderRadius: 28, background: "linear-gradient(145deg,rgba(11,37,55,.96),rgba(5,18,30,.96))" }}>
          <Eyebrow>TA-14 INSTITUTIONAL LINEAGE MAP</Eyebrow>
          <h2 style={sectionTitle}>From field evidence discipline to governed execution infrastructure.</h2>
          <p style={sectionIntro}>This is a navigational chronology, not a substitute for the underlying records. Each stage points back into the structured corpus where its public evidence can be inspected.</p>
          <div style={{ position: "relative", marginTop: 36 }}>
            <div aria-hidden="true" style={{ position: "absolute", left: 20, top: 10, bottom: 10, width: 1, background: "linear-gradient(#5ee1ff,#f5c76b)" }} />
            {TA14_LINEAGE.map((node, index) => <div key={`${node.date}-${node.title}`} style={{ position: "relative", padding: "0 0 32px 62px" }}><div aria-hidden="true" style={{ position: "absolute", left: 11, top: 7, width: 19, height: 19, borderRadius: "50%", background: index === TA14_LINEAGE.length - 1 ? "#f5c76b" : "#65defa", boxShadow: "0 0 22px rgba(101,222,250,.5)" }} /><div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}><span style={{ color: "#f5c76b", fontWeight: 800 }}>{node.date}</span><span style={{ fontSize: 11, letterSpacing: 2, opacity: .6 }}>{node.era}</span></div><h3 style={{ fontSize: 24, margin: "7px 0" }}>{node.title}</h3><p style={{ opacity: .74, lineHeight: 1.65, maxWidth: 980, margin: 0 }}>{node.detail}</p><button onClick={() => openFamily(node.family)} style={textButton}>Inspect related records →</button></div>)}
          </div>
        </section>

        <section id="search" style={{ padding: 24, border: "1px solid #21435c", borderRadius: 22, background: "#091b2a", marginBottom: 48 }}>
          <Eyebrow>SEARCH & FILTER</Eyebrow><h2>Find any entered TA-14 record.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(220px,2fr) repeat(4,minmax(140px,1fr))", gap: 12 }}>
            <input aria-label="Search complete corpus" placeholder="Search title, DOI, ASIN, patent, subject…" value={query} onChange={(e) => setQuery(e.target.value)} style={controlStyle} />
            <select aria-label="Architecture family" value={family} onChange={(e) => setFamily(e.target.value as "ALL" | CorpusFamilyId)} style={controlStyle}><option value="ALL">All architecture families</option>{CORPUS_FAMILIES.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select>
            <select aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value as "ALL" | CorpusCategory)} style={controlStyle}><option value="ALL">All record types</option>{categories.slice(1).map((c) => <option key={c} value={c}>{CORPUS_CATEGORY_LABELS[c as CorpusCategory]}</option>)}</select>
            <select aria-label="Year" value={year} onChange={(e) => setYear(e.target.value)} style={controlStyle}><option value="ALL">All years</option>{years.map((y) => <option key={y}>{y}</option>)}</select>
            <select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value)} style={controlStyle}><option value="NEWEST">Newest first</option><option value="OLDEST">Oldest first</option><option value="TITLE">Title A–Z</option></select>
          </div>
          <div style={{ marginTop: 14 }}>{records.length} of {CORPUS_TOTAL} records shown · <button onClick={clearFilters} style={textButton}>Clear all filters</button></div>
        </section>

        <section id="categories" style={{ marginBottom: 52 }}><Eyebrow>RECORD TYPES</Eyebrow><h2 style={sectionTitle}>Browse the public evidence by format.</h2><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: 16 }}>{categories.slice(1).map((c, index) => { const key = c as CorpusCategory; return <button key={key} onClick={() => { setCategory(key); setFamily("ALL"); }} style={familyCardStyle}><div style={{ opacity: .65, fontSize: 12 }}>0{index + 1}</div><h3 style={{ fontSize: 25 }}>{CORPUS_CATEGORY_LABELS[key]} <span style={{ float: "right" }}>{CORPUS_COUNTS[key]}</span></h3><p style={{ opacity: .7, lineHeight: 1.55 }}>{categoryDescriptions[key]}</p></button>; })}</div></section>

        <section id="records"><Eyebrow>MASTER RECORD LIST</Eyebrow><h2 style={sectionTitle}>{family === "ALL" ? "Complete structured corpus" : CORPUS_FAMILIES.find((item) => item.id === family)?.title}</h2><div style={{ display: "grid", gap: 14 }}>{records.map((record) => <RecordCard key={record.id} record={record} onSelectFamily={openFamily} />)}{records.length === 0 && <div style={{ padding: 30, border: "1px solid #21435c", borderRadius: 20 }}><h3>No matching public record was found.</h3><button onClick={clearFilters} style={textButton}>Clear the filters</button></div>}</div></section>

        <section style={{ marginTop: 64, paddingTop: 30, borderTop: "1px solid #21435c", opacity: .82 }}><Eyebrow>PUBLIC CORPUS BOUNDARY</Eyebrow><h2>Evidence visibility is not automatic validation.</h2><p>Inclusion preserves the public record. It does not by itself establish legal priority, patent validity, certification, accreditation, regulatory approval, independent validation, or proof that every implementation performs as claimed. Those determinations require their own evidence and review.</p><strong>No admissible evidence. No admissible execution.</strong></section>
      </div>
    </main>
  );
}

const controlStyle = { width: "100%", minHeight: 48, borderRadius: 10, border: "1px solid #31546c", background: "#061522", color: "#eef5ff", padding: "0 12px" } as const;
const sectionTitle = { fontSize: "clamp(32px,4vw,52px)", margin: "10px 0 14px", lineHeight: 1.05 } as const;
const sectionIntro = { fontSize: 17, lineHeight: 1.7, opacity: .72, maxWidth: 900, marginBottom: 28 } as const;
const familyCardStyle = { textAlign: "left", padding: 24, minHeight: 220, borderRadius: 22, border: "1px solid #21435c", background: "linear-gradient(145deg,#0b2435,#071724)", color: "inherit", cursor: "pointer" } as const;
const countPill = { minWidth: 38, height: 38, borderRadius: 19, display: "grid", placeItems: "center", background: "#f5c76b", color: "#07131d", fontWeight: 900 } as const;
const textButton = { border: 0, background: "transparent", color: "#82e7ff", padding: 0, marginTop: 12, cursor: "pointer", fontWeight: 700 } as const;

function Eyebrow({ children }: { children: React.ReactNode }) { return <div style={{ letterSpacing: 2, fontSize: 11, fontWeight: 900, color: "#70ddff" }}>{children}</div>; }
function Metric({ value, label }: { value: number; label: string }) { return <div style={{ padding: 18, border: "1px solid #21435c", borderRadius: 16, background: "rgba(9,27,42,.92)" }}><div style={{ fontSize: 30, fontWeight: 800 }}>{value}</div><div style={{ opacity: .7 }}>{label}</div></div>; }
function RecordCard({ record, onSelectFamily }: { record: CorpusRecord; onSelectFamily: (familyId: CorpusFamilyId) => void }) { return <article style={{ padding: 22, border: "1px solid #21435c", borderRadius: 18, background: "#091b2a" }}><div style={{ fontSize: 12, letterSpacing: 1.2, opacity: .65 }}>{CORPUS_CATEGORY_LABELS[record.category]} • {record.date || record.year} • {record.status.replaceAll("_", " ")}</div><h3 style={{ margin: "9px 0", fontSize: 23 }}>{record.href ? <a href={record.href} target="_blank" rel="noreferrer">{record.title} ↗</a> : record.title}</h3><div style={{ display: "flex", gap: 14, flexWrap: "wrap", opacity: .78 }}>{record.author && <span>{record.author}</span>}{record.platform && <span>{record.platform}</span>}{record.identifier && <span>{record.identifier}</span>}</div>{(record.description || record.relationship) && <p style={{ lineHeight: 1.6, opacity: .75 }}>{record.description || record.relationship}</p>}<RelatedFamilyBadges record={record} onSelectFamily={onSelectFamily} /></article>; }
