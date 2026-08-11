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

const categories: Array<"ALL" | CorpusCategory> = [
  "ALL",
  "BOOK",
  "ARTICLE",
  "ZENODO",
  "PATENT",
  "STANDARD",
  "REPOSITORY",
  "SITE",
  "IMPLEMENTATION",
  "CHRONOLOGY",
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
  const [year, setYear] = useState("ALL");
  const [sort, setSort] = useState("NEWEST");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedCategory = params.get("category") as CorpusCategory | null;
    if (requestedCategory && categories.includes(requestedCategory)) setCategory(requestedCategory);
  }, []);

  const years = useMemo(
    () => Array.from(new Set(TA14_PUBLIC_CORPUS.map((record) => record.year))).sort((a, b) => b - a),
    [],
  );

  const records = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = TA14_PUBLIC_CORPUS.filter((record) => {
      if (category !== "ALL" && record.category !== category) return false;
      if (year !== "ALL" && record.year !== Number(year)) return false;
      if (!normalized) return true;
      return [record.title, record.author, record.platform, record.identifier, record.description, record.relationship, record.sourceClass, ...(record.tags || [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    });
    return filtered.sort((a, b) => {
      if (sort === "TITLE") return a.title.localeCompare(b.title);
      const aDate = a.date || `${a.year}-01-01`;
      const bDate = b.date || `${b.year}-01-01`;
      return sort === "OLDEST" ? aDate.localeCompare(bDate) : bDate.localeCompare(aDate);
    });
  }, [query, category, year, sort]);

  const clearFilters = () => {
    setQuery("");
    setCategory("ALL");
    setYear("ALL");
    setSort("NEWEST");
  };

  return (
    <main style={{ minHeight: "100vh", background: "#06111d", color: "#eef5ff", padding: "32px 24px 80px" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <nav style={{ display: "flex", gap: 18, flexWrap: "wrap", marginBottom: 42 }}>
          <Link href="/foundation">TA-14 Foundation</Link>
          <a href="#search">Search</a><a href="#records">All Records</a><a href="#categories">Categories</a>
          <Link href="/registry">Registry</Link><Link href="/workspace">Open Exchange</Link>
        </nav>

        <section style={{ maxWidth: 980, marginBottom: 40 }}>
          <div style={{ letterSpacing: 2, fontSize: 12, fontWeight: 800 }}>TA-14 FOUNDATION • COMPLETE PUBLIC CORPUS</div>
          <h1 style={{ fontSize: "clamp(44px,7vw,92px)", lineHeight: .98, margin: "18px 0" }}>The whole body of work, <em>in one searchable place.</em></h1>
          <p style={{ fontSize: 18, lineHeight: 1.7, opacity: .78 }}>This is the master institutional ledger for TA-14 books, articles, public deposits, patent applications, standards, repositories, implementations, architecture sites, and dated milestones.</p>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 48 }}>
          <Metric value={CORPUS_TOTAL} label="structured public records" />
          <Metric value={CORPUS_COUNTS.BOOK} label="books & long-form" />
          <Metric value={CORPUS_COUNTS.ARTICLE} label="articles & essays" />
          <Metric value={CORPUS_COUNTS.ZENODO} label="Zenodo & DOI records" />
          <Metric value={CORPUS_COUNTS.PATENT} label="patent records" />
          <Metric value={CORPUS_COUNTS.STANDARD} label="standards & protocols" />
        </section>

        <section id="search" style={{ padding: 24, border: "1px solid #21435c", borderRadius: 22, background: "#091b2a", marginBottom: 48 }}>
          <h2>Search & filter</h2>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(240px,2fr) repeat(3,minmax(150px,1fr))", gap: 12 }}>
            <input aria-label="Search complete corpus" placeholder="Search title, DOI, ASIN, patent, subject…" value={query} onChange={(e) => setQuery(e.target.value)} style={controlStyle} />
            <select aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value as "ALL" | CorpusCategory)} style={controlStyle}><option value="ALL">All categories</option>{categories.slice(1).map((c) => <option key={c} value={c}>{CORPUS_CATEGORY_LABELS[c as CorpusCategory]}</option>)}</select>
            <select aria-label="Year" value={year} onChange={(e) => setYear(e.target.value)} style={controlStyle}><option value="ALL">All years</option>{years.map((y) => <option key={y}>{y}</option>)}</select>
            <select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value)} style={controlStyle}><option value="NEWEST">Newest first</option><option value="OLDEST">Oldest first</option><option value="TITLE">Title A–Z</option></select>
          </div>
          <div style={{ marginTop: 14 }}>{records.length} of {CORPUS_TOTAL} records shown · <button onClick={clearFilters}>Clear all filters</button></div>
        </section>

        <section id="categories" style={{ marginBottom: 52 }}>
          <h2>Public corpus categories</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: 16 }}>
            {categories.slice(1).map((c, index) => { const key = c as CorpusCategory; return <button key={key} onClick={() => setCategory(key)} style={{ textAlign: "left", padding: 24, minHeight: 180, borderRadius: 22, border: "1px solid #21435c", background: "#0a2031", color: "inherit" }}><div style={{ opacity: .65, fontSize: 12 }}>0{index + 1}</div><h3 style={{ fontSize: 25 }}>{CORPUS_CATEGORY_LABELS[key]} <span style={{ float: "right" }}>{CORPUS_COUNTS[key]}</span></h3><p style={{ opacity: .7, lineHeight: 1.55 }}>{categoryDescriptions[key]}</p></button>; })}
          </div>
        </section>

        <section id="records">
          <h2>Master record list</h2>
          <div style={{ display: "grid", gap: 14 }}>
            {records.map((record) => <RecordCard key={record.id} record={record} />)}
            {records.length === 0 && <div style={{ padding: 30, border: "1px solid #21435c", borderRadius: 20 }}><h3>No matching public record was found.</h3><button onClick={clearFilters}>Clear the filters</button></div>}
          </div>
        </section>

        <section style={{ marginTop: 64, paddingTop: 30, borderTop: "1px solid #21435c", opacity: .8 }}>
          <h2>Public corpus boundary</h2><p>Inclusion preserves the public record. It does not by itself establish legal priority, patent validity, certification, accreditation, regulatory approval, independent validation, or proof that every implementation performs as claimed.</p>
          <strong>No admissible evidence. No admissible execution.</strong>
        </section>
      </div>
    </main>
  );
}

const controlStyle = { width: "100%", minHeight: 48, borderRadius: 10, border: "1px solid #31546c", background: "#061522", color: "#eef5ff", padding: "0 12px" } as const;

function Metric({ value, label }: { value: number; label: string }) { return <div style={{ padding: 18, border: "1px solid #21435c", borderRadius: 16, background: "#091b2a" }}><div style={{ fontSize: 30, fontWeight: 800 }}>{value}</div><div style={{ opacity: .7 }}>{label}</div></div>; }

function RecordCard({ record }: { record: CorpusRecord }) {
  return <article style={{ padding: 22, border: "1px solid #21435c", borderRadius: 18, background: "#091b2a" }}><div style={{ fontSize: 12, letterSpacing: 1.2, opacity: .65 }}>{CORPUS_CATEGORY_LABELS[record.category]} • {record.date || record.year} • {record.status.replaceAll("_", " ")}</div><h3 style={{ margin: "9px 0", fontSize: 23 }}>{record.href ? <a href={record.href} target="_blank" rel="noreferrer">{record.title} ↗</a> : record.title}</h3><div style={{ display: "flex", gap: 14, flexWrap: "wrap", opacity: .78 }}>{record.author && <span>{record.author}</span>}{record.platform && <span>{record.platform}</span>}{record.identifier && <span>{record.identifier}</span>}</div>{(record.description || record.relationship) && <p style={{ lineHeight: 1.6, opacity: .75 }}>{record.description || record.relationship}</p>}</article>;
}
