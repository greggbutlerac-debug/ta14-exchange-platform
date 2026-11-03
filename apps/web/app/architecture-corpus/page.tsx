import type { Metadata } from "next";
import Link from "next/link";
import { listCorpusMetadata } from "../../lib/corpus";

export const metadata: Metadata = {
  title: "Architecture Corpus | TA-14 Exchange",
  description: "Publication metadata index for the TA-14 Authority Governance Institution architecture corpus.",
};

type Params = { q?: string | string[]; access?: string | string[] };

export default async function ArchitectureCorpusPage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.slice(0, 160) : "";
  const access = params.access === "open" || params.access === "restricted" ? params.access : undefined;
  const records = listCorpusMetadata({ query: q, access });
  return (
    <main style={{ maxWidth: 1080, margin: "0 auto", padding: "64px 24px", color: "inherit" }}>
      <p style={{ letterSpacing: "0.12em", fontSize: 12, fontWeight: 700 }}>TA-14 AUTHORITY GOVERNANCE INSTITUTION</p>
      <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1, margin: "18px 0" }}>Architecture Corpus</h1>
      <p style={{ maxWidth: 780, lineHeight: 1.7, opacity: 0.8 }}>
        A browsable metadata inventory of 47 Zenodo publication records supplied by the founder.
        This catalog is not a local PDF archive or evidence of implementation conformance.
        Original files remain at their source until separately verified and permission-cleared.
      </p>
      <form method="get" action="/architecture-corpus" style={{ display: "flex", flexWrap: "wrap", gap: 12, margin: "32px 0" }}>
        <input aria-label="Search architecture records" name="q" defaultValue={q} placeholder="Search architecture, identifier or DOI" style={{ flex: "1 1 280px", minWidth: 0, padding: 12, borderRadius: 8, border: "1px solid #888", background: "transparent", color: "inherit" }} />
        <select aria-label="Filter by source access" name="access" defaultValue={access ?? ""} style={{ padding: 12, borderRadius: 8, background: "transparent", color: "inherit", border: "1px solid #888" }}>
          <option value="">All access classifications</option>
          <option value="open">Open</option>
          <option value="restricted">Restricted</option>
        </select>
        <button type="submit" style={{ padding: "12px 22px", borderRadius: 8, border: "1px solid currentColor", fontWeight: 700 }}>Search</button>
      </form>
      <p aria-live="polite" style={{ marginBottom: 20 }}>{records.length} records found</p>
      <div style={{ display: "grid", gap: 12 }}>
        {records.map((record) => (
          <article key={record.id} style={{ padding: 22, border: "1px solid #8885", borderRadius: 12 }}>
            <p style={{ fontSize: 12, letterSpacing: "0.06em", opacity: 0.8, marginBottom: 8 }}>
              {record.id} · {record.publishedAt} · {record.access === "restricted" ? "RESTRICTED SOURCE" : "OPEN SOURCE"}
            </p>
            <h2 style={{ fontSize: "1.2rem", lineHeight: 1.4, margin: "0 0 10px" }}>{record.title}</h2>
            <p style={{ fontSize: 13, opacity: 0.7 }}>Exchange availability: metadata only · DOI: {record.doi ?? "Pending verification"}</p>
            {record.doi && <Link href={`https://doi.org/${record.doi}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>View source publication</Link>}
          </article>
        ))}
      </div>
      <p style={{ marginTop: 32, fontSize: 13, opacity: 0.7 }}>
        Published architecture does not imply implemented software, independently verified conformance, or production validation.
        Restricted-source classification is preserved; no restricted document bytes are served here.
      </p>
    </main>
  );
}
