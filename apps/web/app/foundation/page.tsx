"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type CorpusKind =
  | "Book"
  | "Article"
  | "Zenodo"
  | "Patent"
  | "Standard"
  | "Repository"
  | "Implementation";

type CorpusRecord = {
  id: string;
  kind: CorpusKind;
  title: string;
  date: string;
  status: string;
  identifier?: string;
  platform?: string;
  href?: string;
  note?: string;
};

const foundationDomains = [
  {
    code: "01",
    title: "Institution & Stewardship",
    text: "The named institution, founder, authorship, stewardship, declared ownership, contact route, and responsibility for maintaining the public record.",
    href: "#credentials-record",
  },
  {
    code: "02",
    title: "Founding Architecture",
    text: "The TA-14 Admissible Execution Architecture, governing chain, architecture family, scope, claims, non-claims, and declared boundaries.",
    href: "/registry/ta-14-admissible-execution-architecture",
  },
  {
    code: "03",
    title: "Standards Family",
    text: "Named standards, methods, thresholds, route classifications, admissibility disciplines, and implementation requirements associated with TA-14.",
    href: "#standards",
  },
  {
    code: "04",
    title: "Public Chronology",
    text: "Dated declarations, releases, public milestones, publication history, architecture versions, and institutional development.",
    href: "#corpus-ledger",
  },
  {
    code: "05",
    title: "Books & Articles",
    text: "Published books, technical articles, public explanations, and written works documenting the architecture and its applications.",
    href: "#publications",
  },
  {
    code: "06",
    title: "Zenodo & Public Deposits",
    text: "Dated public records and research deposits supporting attribution, chronology, provenance, and public inspection.",
    href: "#zenodo",
  },
  {
    code: "07",
    title: "GitHub & Technical Artifacts",
    text: "Repositories, code, public platform implementations, demonstrations, records, and technical artifacts associated with TA-14.",
    href: "#repositories",
  },
  {
    code: "08",
    title: "Patent Applications & Rights",
    text: "Patent references, filings, ownership declarations, licensing statements, and rights assertions preserved as public claims rather than automatic legal conclusions.",
    href: "#patents",
  },
  {
    code: "09",
    title: "Reference Implementations",
    text: "Operational examples showing how TA-14 architecture is translated into governed routes, records, review, verification, and execution controls.",
    href: "#implementations",
  },
  {
    code: "10",
    title: "Claims, Challenges & Corrections",
    text: "Declared claims, explicit non-claims, limitations, disputes, objections, corrections, superseded versions, and challenge routes.",
    href: "#boundary",
  },
];

const chain = [
  "Reality",
  "Record",
  "Continuity",
  "Admissibility",
  "Binding",
  "Commit",
  "Execution",
  "Outcome",
];

const corpus: CorpusRecord[] = [
  {
    id: "book-001",
    kind: "Book",
    title: "TA-14 Admissible Execution",
    date: "2026",
    status: "Published",
    platform: "Amazon Kindle",
    note: "Long-form publication in the TA-14 admissible governance corpus.",
  },
  {
    id: "book-002",
    kind: "Book",
    title: "Admissible Before Execution: The TA-14 Review Manual",
    date: "2026-07-01",
    status: "Live",
    identifier: "Kindle ASIN B0H78B79WB",
    platform: "Amazon",
    href: "https://www.amazon.com/",
  },
  {
    id: "book-003",
    kind: "Book",
    title: "The Human Performance Stack: Governing Human Action Before Consequence",
    date: "2026-07-01",
    status: "Live",
    identifier: "Kindle ASIN B0H732NR2F",
    platform: "Amazon",
    href: "https://www.amazon.com/",
  },
  {
    id: "book-004",
    kind: "Book",
    title: "Air Pollution Made Admissible",
    date: "2026-07-02",
    status: "Live",
    identifier: "ASIN B0H7CQCTKT",
    platform: "Amazon",
    href: "https://www.amazon.com/",
  },
  {
    id: "book-005",
    kind: "Book",
    title: "Environmental Integrity Governance: Atmospheric Integrity Records and the Governance of Air Reality",
    date: "2026-06-10",
    status: "Published",
    platform: "Amazon Kindle",
    href: "https://www.amazon.com/",
  },
  {
    id: "book-006",
    kind: "Book",
    title: "Admissible Reality: Why AI Fails Before Execution",
    date: "2026",
    status: "Published",
    identifier: "ASIN B0H49YHWS5",
    platform: "Amazon",
    href: "https://www.amazon.com/",
  },
  {
    id: "book-007",
    kind: "Book",
    title: "The Lettered Van Illusion",
    date: "2026-06-10",
    status: "Published",
    platform: "Amazon Kindle",
    href: "https://www.amazon.com/",
  },
  {
    id: "book-008",
    kind: "Book",
    title: "HVACDR: Why the D Is There",
    date: "2026-06-20",
    status: "Published",
    platform: "Amazon Kindle",
    href: "https://www.amazon.com/",
  },
  {
    id: "book-009",
    kind: "Book",
    title: "TA-14 Academy EPA 608 Universal Quick Memory Workbook",
    date: "2026-06-22",
    status: "Published",
    platform: "Amazon Kindle",
    href: "https://www.amazon.com/",
  },
  {
    id: "book-010",
    kind: "Book",
    title: "Transparent Air's S.O.P. of Residential Air Conditioning",
    date: "2025-05-01",
    status: "Live",
    identifier: "Kindle ASIN B0F74RTKTT",
    platform: "Amazon",
    href: "https://www.amazon.com/",
  },
  {
    id: "article-001",
    kind: "Article",
    title: "The TA-14 AI Governance Exchange Is Now Open: A Free Public Proving Ground for Governed AI",
    date: "2026-07",
    status: "Published",
    platform: "Medium",
    href: "https://medium.com/",
  },
  {
    id: "article-002",
    kind: "Article",
    title: "AI Governance Is Discovering the Pieces. TA-14 Governs the Route.",
    date: "2026-07",
    status: "Published",
    platform: "Medium",
    href: "https://medium.com/",
  },
  {
    id: "article-003",
    kind: "Article",
    title: "TA-14 Just Made Consequence-Bearing Execution Independently Verifiable",
    date: "2026-07-14",
    status: "Published",
    platform: "Medium",
    href: "https://medium.com/",
  },
  {
    id: "article-004",
    kind: "Article",
    title: "A Blocked Event Is Not Proof of Prevention",
    date: "2026-07-01",
    status: "Published",
    platform: "Medium",
    href: "https://medium.com/",
  },
  {
    id: "article-005",
    kind: "Article",
    title: "The Next AI Governance Layer Is Not More Oversight. It Is Admissibility Before Consequence",
    date: "2026-07-01",
    status: "Published",
    platform: "Medium",
    href: "https://medium.com/",
  },
  {
    id: "article-006",
    kind: "Article",
    title: "The Lung's Missing Record: Why the Next Medical Record May Begin With the Air We Breathe",
    date: "2026-06-25",
    status: "Published",
    platform: "Medium",
    href: "https://medium.com/",
  },
  {
    id: "article-007",
    kind: "Article",
    title: "Atmospheric Integrity Frameworks Will Appear. Environmental Integrity Governance Was Already Here.",
    date: "2026-06-21",
    status: "Published",
    platform: "Medium",
    href: "https://medium.com/",
  },
  {
    id: "article-008",
    kind: "Article",
    title: "Data Is Not Automatically Evidence: Introducing TA-14 Evidence Integrity Governance",
    date: "2026-06-20",
    status: "Published",
    platform: "Medium",
    href: "https://medium.com/",
  },
  {
    id: "article-009",
    kind: "Article",
    title: "The TA-14 Partner Review Network: A New Category for Admissible Execution Governance",
    date: "2026-06-14",
    status: "Published",
    platform: "Medium",
    href: "https://medium.com/",
  },
  {
    id: "article-010",
    kind: "Article",
    title: "TA-14 Admissible Reality Architecture: Why Reality Itself Must Be Governed Before AI, Execution, or Consequence",
    date: "2026-06-01",
    status: "Published",
    platform: "Medium",
    href: "https://medium.com/",
  },
  {
    id: "article-011",
    kind: "Article",
    title: "TA-14 and the Rise of Admissible Execution Governance",
    date: "2026-05-24",
    status: "Published",
    platform: "Medium",
    href: "https://medium.com/",
  },
  {
    id: "article-012",
    kind: "Article",
    title: "TA-14 Was Already Here: A Public Record of Admissible Execution Architecture Before the Current Wave",
    date: "2026-05-09",
    status: "Published",
    platform: "Medium",
    href: "https://medium.com/",
  },
  {
    id: "article-013",
    kind: "Article",
    title: "Buildings Can Measure Air. Almost None Can Prove What Happened.",
    date: "2026-04-29",
    status: "Published",
    platform: "Medium",
    href: "https://medium.com/",
  },
  {
    id: "article-014",
    kind: "Article",
    title: "Insurance Cannot Be Trusted Until Execution Is Governed",
    date: "2026-04-26",
    status: "Published",
    platform: "Medium",
    href: "https://medium.com/",
  },
  {
    id: "article-015",
    kind: "Article",
    title: "Admissible Execution: The Missing Layer in AI and System Governance",
    date: "2026-04-25",
    status: "Published",
    platform: "Medium",
    href: "https://medium.com/",
  },
  {
    id: "article-016",
    kind: "Article",
    title: "The Missing Layer in AI and Automation: What Must Be True Before a System Is Allowed to Act",
    date: "2026-04-22",
    status: "Published",
    platform: "Medium",
    href: "https://medium.com/",
  },
  {
    id: "article-017",
    kind: "Article",
    title: "Admissible Execution Architecture: The Missing Condition for Valid Action",
    date: "2026-03-31",
    status: "Published",
    platform: "Medium",
    href: "https://medium.com/",
  },
  {
    id: "article-018",
    kind: "Article",
    title: "The Missing Record: Why Medicine Has Never Truly Understood Air Exposure",
    date: "2026-03-25",
    status: "Published",
    platform: "Medium",
    href: "https://medium.com/",
  },
  {
    id: "article-019",
    kind: "Article",
    title: "The Moment Data Stopped Being Enough: Why Every System Now Requires Evidence",
    date: "2026-03-23",
    status: "Published",
    platform: "Medium",
    href: "https://medium.com/",
  },
  {
    id: "article-020",
    kind: "Article",
    title: "Cities Can't See Their Own Air",
    date: "2026-03-15",
    status: "Published",
    platform: "Medium",
    href: "https://medium.com/",
  },
  {
    id: "article-021",
    kind: "Article",
    title: "The Day Systems Learned to Remember",
    date: "2026-03-10",
    status: "Published",
    platform: "Medium",
    href: "https://medium.com/",
  },
  {
    id: "article-022",
    kind: "Article",
    title: "Notice to the U.S. Environmental Protection Agency and the HVAC Industry",
    date: "2026-03-05",
    status: "Published",
    platform: "Medium",
    href: "https://medium.com/",
  },
  {
    id: "article-023",
    kind: "Article",
    title: "Atmospheric Integrity Records: The Missing Infrastructure of Intelligent Buildings",
    date: "2026-02-25",
    status: "Published",
    platform: "Medium",
    href: "https://medium.com/",
  },
  {
    id: "article-024",
    kind: "Article",
    title: "Greggory Don Butler and the Origin of Environmental Integrity Governance",
    date: "2026-02-21",
    status: "Published",
    platform: "Medium",
    href: "https://medium.com/",
  },
  {
    id: "article-025",
    kind: "Article",
    title: "BAS Governance: Why Optimization Is Not Evidence",
    date: "2026-02-12",
    status: "Published",
    platform: "Medium",
    href: "https://medium.com/",
  },
  {
    id: "article-026",
    kind: "Article",
    title: "For the First Time in History, Diagnostic Truth Has Been Defined — Correctly",
    date: "2026-01-12",
    status: "Published",
    platform: "Medium",
    href: "https://medium.com/",
  },
  {
    id: "article-027",
    kind: "Article",
    title: "Field-Enforceable Refrigerant Emissions Prevention: A Blind Spot in Climate Policy",
    date: "2026-01-06",
    status: "Published",
    platform: "Medium",
    href: "https://medium.com/",
  },
  {
    id: "article-028",
    kind: "Article",
    title: "HVAC Diagnostics Need a Standard",
    date: "2025-12-26",
    status: "Published",
    platform: "Medium",
    href: "https://medium.com/",
  },
  {
    id: "zenodo-001",
    kind: "Zenodo",
    title: "TA-14 Admissible Execution Architecture: Volume 1 Foundational Monograph",
    date: "2026-05-30",
    status: "Public record",
    identifier: "DOI spine record 001",
    platform: "Zenodo",
    href: "https://zenodo.org/",
  },
  {
    id: "zenodo-002",
    kind: "Zenodo",
    title: "TA-14 Evidence Governance Architecture",
    date: "2026-05-30",
    status: "Public record",
    identifier: "DOI spine record 002",
    platform: "Zenodo",
    href: "https://zenodo.org/",
  },
  {
    id: "zenodo-003",
    kind: "Zenodo",
    title: "TA-14 Admissible Evidence Architecture",
    date: "2026-05-30",
    status: "Public record",
    identifier: "DOI spine record 003",
    platform: "Zenodo",
    href: "https://zenodo.org/",
  },
  {
    id: "zenodo-004",
    kind: "Zenodo",
    title: "TA-14 Reliance Governance Architecture",
    date: "2026-05-30",
    status: "Public record",
    identifier: "DOI spine record 004",
    platform: "Zenodo",
    href: "https://zenodo.org/",
  },
  {
    id: "zenodo-005",
    kind: "Zenodo",
    title: "TA-14 Corpus Self-Governance Architecture",
    date: "2026-05-31",
    status: "Public record",
    identifier: "DOI spine record 005",
    platform: "Zenodo",
    href: "https://zenodo.org/",
  },
  {
    id: "zenodo-006",
    kind: "Zenodo",
    title: "TA-14 Authority Governance Architecture",
    date: "2026",
    status: "Public record",
    identifier: "DOI spine record 006",
    platform: "Zenodo",
    href: "https://zenodo.org/",
  },
  {
    id: "zenodo-007",
    kind: "Zenodo",
    title: "TA-14 Admissible Records Architecture",
    date: "2026-07-02",
    status: "Public record",
    platform: "Zenodo",
    href: "https://zenodo.org/",
  },
  {
    id: "zenodo-008",
    kind: "Zenodo",
    title: "TA-14 Admissible Continuity Architecture",
    date: "2026-07-02",
    status: "Public record",
    platform: "Zenodo",
    href: "https://zenodo.org/",
  },
  {
    id: "zenodo-009",
    kind: "Zenodo",
    title: "TA-14 Admissible Non-Occurrence Architecture",
    date: "2026-07-02",
    status: "Public record",
    platform: "Zenodo",
    href: "https://zenodo.org/",
  },
  {
    id: "zenodo-010",
    kind: "Zenodo",
    title: "TA-14 Admissible Admissibility Architecture",
    date: "2026-07-02",
    status: "Public record",
    platform: "Zenodo",
    href: "https://zenodo.org/",
  },
  {
    id: "zenodo-011",
    kind: "Zenodo",
    title: "TA-14 Admissible Memory Architecture",
    date: "2026-07-02",
    status: "Public record",
    platform: "Zenodo",
    href: "https://zenodo.org/",
  },
  {
    id: "zenodo-012",
    kind: "Zenodo",
    title: "TA-14 Prevented Consequence Architecture",
    date: "2026-07-01",
    status: "Public record",
    platform: "Zenodo",
    href: "https://zenodo.org/",
  },
  {
    id: "standard-001",
    kind: "Standard",
    title: "TA-14 Living Authority Standard",
    date: "2026-07-14",
    status: "Open public standard",
    identifier: "DOI 10.5281/zenodo.21364604",
    platform: "Zenodo",
    href: "https://doi.org/10.5281/zenodo.21364604",
  },
  {
    id: "standard-002",
    kind: "Standard",
    title: "TA-14 Continuous Admissibility Governance Standard",
    date: "2026-07",
    status: "Open public standard",
    identifier: "DOI 10.5281/zenodo.21364756",
    platform: "Zenodo",
    href: "https://doi.org/10.5281/zenodo.21364756",
  },
  {
    id: "standard-003",
    kind: "Standard",
    title: "TA-14 Runtime Admissibility Protocol",
    date: "2026-07",
    status: "Open public standard",
    identifier: "DOI 10.5281/zenodo.21365032",
    platform: "Zenodo",
    href: "https://doi.org/10.5281/zenodo.21365032",
  },
  {
    id: "standard-004",
    kind: "Standard",
    title: "TA-14 Consequence Constitution Specification",
    date: "2026-07-15",
    status: "Open public standard",
    identifier: "DOI 10.5281/zenodo.21365796",
    platform: "Zenodo",
    href: "https://doi.org/10.5281/zenodo.21365796",
  },
  {
    id: "standard-005",
    kind: "Standard",
    title: "TA-14 Proof of Restraint Standard",
    date: "2026-07-15",
    status: "Open public standard",
    platform: "Zenodo",
    href: "https://zenodo.org/",
  },
  {
    id: "patent-001",
    kind: "Patent",
    title: "Analyzer-Driven Refrigerant Governor",
    date: "2026-01-09",
    status: "Provisional application filed",
    identifier: "U.S. Application 63/957,580",
    note: "Declared patent filing record.",
  },
  {
    id: "patent-002",
    kind: "Patent",
    title: "Standardized HVAC Diagnostic & Electrical Integrity",
    date: "2025-12-19",
    status: "Non-provisional application filed",
    identifier: "U.S. Application 19/427,932",
    note: "Declared patent filing record.",
  },
  {
    id: "patent-003",
    kind: "Patent",
    title: "Standardized HVAC Diagnostic & Electrical Integrity",
    date: "2025-12-14",
    status: "Provisional application filed",
    identifier: "U.S. Application 63/940,392",
    note: "Declared patent filing record.",
  },
  {
    id: "repo-001",
    kind: "Repository",
    title: "TA-14 Architecture Site",
    date: "2026",
    status: "Public repository",
    platform: "GitHub",
    href: "https://github.com/greggbutlerac-debug/ta14-architecture-site",
  },
  {
    id: "repo-002",
    kind: "Repository",
    title: "TA-14 Admissible Execution Gate",
    date: "2026",
    status: "Public repository",
    platform: "GitHub",
    href: "https://github.com/greggbutlerac-debug/ta14-admissible-execution-gate",
  },
  {
    id: "repo-003",
    kind: "Repository",
    title: "TA-14 AI Governance Exchange",
    date: "2026",
    status: "Public repository and live deployment",
    platform: "GitHub",
    href: "https://github.com/greggbutlerac-debug/ta14-exchange-platform",
  },
  {
    id: "implementation-001",
    kind: "Implementation",
    title: "TA-14 AI Governance Exchange",
    date: "2026-07",
    status: "Operational public workspace",
    platform: "Vercel",
    href: "https://ta14-exchange-platform-theta.vercel.app/",
  },
  {
    id: "implementation-002",
    kind: "Implementation",
    title: "TA-14 Admissible Execution Gate",
    date: "2026",
    status: "Reference implementation",
    platform: "GitHub",
    href: "https://github.com/greggbutlerac-debug/ta14-admissible-execution-gate",
  },
];

const kinds: Array<"All" | CorpusKind> = [
  "All",
  "Book",
  "Article",
  "Zenodo",
  "Patent",
  "Standard",
  "Repository",
  "Implementation",
];

const sectionLinks = [
  ["All Publications", "#publications"],
  ["All Books", "#books"],
  ["All Articles", "#articles"],
  ["All Zenodo Records", "#zenodo"],
  ["All Patent Applications", "#patents"],
  ["All Standards", "#standards"],
  ["All GitHub Repositories", "#repositories"],
  ["All Implementations", "#implementations"],
];

function LedgerSection({
  id,
  eyebrow,
  title,
  records,
}: {
  id: string;
  eyebrow: string;
  title: string;
  records: CorpusRecord[];
}) {
  return (
    <section id={id} className="ledgerSection shell">
      <div className="ledgerHeading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <span>{records.length} records currently listed</span>
      </div>

      <div className="recordTable" role="table" aria-label={title}>
        {records.map((record, index) => (
          <article className="recordRow" key={record.id} role="row">
            <span className="recordNumber">{String(index + 1).padStart(3, "0")}</span>
            <div className="recordMain">
              <div className="recordTopline">
                <span>{record.kind}</span>
                <span>{record.date}</span>
                <span>{record.status}</span>
              </div>
              <h3>{record.title}</h3>
              <div className="recordMeta">
                {record.identifier ? <code>{record.identifier}</code> : null}
                {record.platform ? <span>{record.platform}</span> : null}
                {record.note ? <span>{record.note}</span> : null}
              </div>
            </div>
            {record.href ? (
              <a
                className="recordAction"
                href={record.href}
                target="_blank"
                rel="noreferrer"
              >
                Open record ↗
              </a>
            ) : (
              <span className="recordAction mutedAction">Public-link entry pending</span>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default function FoundationPage() {
  const [activeKind, setActiveKind] = useState<"All" | CorpusKind>("All");
  const [query, setQuery] = useState("");

  const filteredCorpus = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return corpus.filter((record) => {
      const matchesKind = activeKind === "All" || record.kind === activeKind;
      const matchesQuery =
        !normalized ||
        [
          record.title,
          record.date,
          record.status,
          record.identifier,
          record.platform,
          record.note,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalized);

      return matchesKind && matchesQuery;
    });
  }, [activeKind, query]);

  const books = corpus.filter((record) => record.kind === "Book");
  const articles = corpus.filter((record) => record.kind === "Article");
  const zenodo = corpus.filter((record) => record.kind === "Zenodo");
  const patents = corpus.filter((record) => record.kind === "Patent");
  const standards = corpus.filter((record) => record.kind === "Standard");
  const repositories = corpus.filter((record) => record.kind === "Repository");
  const implementations = corpus.filter(
    (record) => record.kind === "Implementation",
  );

  return (
    <main className="page">
      <div className="cosmos" aria-hidden="true">
        <div className="stars starsOne" />
        <div className="stars starsTwo" />
        <div className="glow glowBlue" />
        <div className="glow glowGold" />
        <div className="route routeOne" />
        <div className="route routeTwo" />
      </div>

      <header className="topbar">
        <Link href="/" className="brand">
          <span className="brandMark">TA-14</span>
          <span>
            <strong>TA-14 Credentials & Public Record</strong>
            <small>Identity • Lineage • Publications • Patents • Evidence</small>
          </span>
        </Link>

        <nav aria-label="Foundation navigation">
          <a href="#credentials-record">Credentials</a>
          <a href="#corpus-ledger">Corpus Ledger</a>
          <a href="#patents">Patents</a>
          <a href="#boundary">Boundary</a>
          <Link href="/registry">Registry</Link>
        </nav>

        <Link className="topAction" href="/workspace">
          Open Exchange
        </Link>
      </header>

      <section className="hero shell">
        <div className="seal" aria-hidden="true">
          <span>TA-14</span>
          <strong>PUBLIC CORPUS</strong>
          <i />
          <i />
          <i />
        </div>

        <p className="eyebrow">TA-14 INSTITUTIONAL CREDENTIALS LEDGER</p>

        <h1>
          The proof should not be hidden
          <em> behind a directory.</em>
        </h1>

        <p className="heroLead">
          This page lists the books, articles, public deposits, standards,
          patent applications, repositories, implementations, identity records,
          and architectural lineage that make up the TA-14 public corpus. The
          category buttons provide direct routes, while the master ledger lets a
          visitor inspect the body of work without searching for it one document
          at a time.
        </p>

        <div className="heroActions">
          <a className="button gold" href="#corpus-ledger">
            Open the Master Corpus Ledger <span>↓</span>
          </a>
          <a className="button primary" href="#patents">
            View Patent Applications <span>↓</span>
          </a>
          <Link className="button glass" href="/workspace/ai-governance/registry">
            Open Architectural Registry <span>↗</span>
          </Link>
        </div>
      </section>

      <section id="credentials-record" className="recordSection shell">
        <div className="recordCopy">
          <span className="status">PUBLIC CREDENTIAL RECORD ACTIVE</span>
          <p className="eyebrow">IDENTITY & STEWARDSHIP</p>
          <h2>TA-14 Authority Governance Institution</h2>
          <p>
            This record allows a visitor to inspect who TA-14 says it is, who
            claims and stewards the architecture, what has been architected,
            published, deposited, filed, and implemented, and where challenge,
            correction, or dispute should be directed.
          </p>

          <div className="identityGrid">
            <div>
              <small>Institution</small>
              <strong>TA-14 Authority Governance Institution</strong>
            </div>
            <div>
              <small>Founder and steward</small>
              <strong>Greggory Don Butler</strong>
            </div>
            <div>
              <small>Public record identifier</small>
              <strong>TA-14-CREDENTIALS-000001</strong>
            </div>
            <div>
              <small>Current corpus index</small>
              <strong>{corpus.length} listed public records</strong>
            </div>
          </div>
        </div>

        <div className="chainPanel">
          <p className="eyebrow">THE TA-14 GOVERNING CHAIN</p>
          <div className="chain">
            {chain.map((item, index) => (
              <div key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item}</strong>
                {index < chain.length - 1 && <i>→</i>}
              </div>
            ))}
          </div>
          <p>
            Each link remains distinguishable so reality, records, continuity,
            admissibility, authority, commitment, execution, and outcome cannot
            silently collapse into one another.
          </p>
        </div>
      </section>

      <section id="evidence-map" className="mapSection shell">
        <div className="sectionHeading">
          <p className="eyebrow">CREDENTIALS & EVIDENCE MAP</p>
          <h2>Large doors into each body of public work.</h2>
          <p>
            These routes remain available for visitors who want a category-level
            entrance. The full list remains visible directly below.
          </p>
        </div>

        <div className="foundationGrid">
          {foundationDomains.map((item) => (
            <Link href={item.href} className="foundationCard" key={item.title}>
              <span>{item.code}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <div>
                Open record <b>→</b>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="corpusJump shell" aria-label="Corpus category routes">
        <p className="eyebrow">PUBLIC CORPUS ROUTES</p>
        <h2>Open one category—or inspect the entire ledger.</h2>
        <div>
          {sectionLinks.map(([title, href]) => (
            <a href={href} key={title}>
              {title} <span>↓</span>
            </a>
          ))}
        </div>
      </section>

      <section id="corpus-ledger" className="masterLedger shell">
        <div className="sectionHeading">
          <p className="eyebrow">TA-14 PUBLIC CORPUS & EVIDENCE LEDGER</p>
          <h2>A visible, searchable list of the current recorded corpus.</h2>
          <p>
            Search by title, date, identifier, platform, or status. Filter by
            record type. This index is designed to grow as additional books,
            articles, deposits, patent records, repositories, and documents are
            entered.
          </p>
        </div>

        <div className="ledgerControls">
          <label>
            <span>Search the TA-14 public corpus</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, identifier, date, platform, or status…"
            />
          </label>

          <div className="filterRow">
            {kinds.map((kind) => (
              <button
                type="button"
                key={kind}
                className={activeKind === kind ? "active" : ""}
                onClick={() => setActiveKind(kind)}
              >
                {kind}
                <span>
                  {kind === "All"
                    ? corpus.length
                    : corpus.filter((record) => record.kind === kind).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="ledgerResult">
          <span>{filteredCorpus.length} matching records</span>
          {filteredCorpus.length === 0 ? (
            <p>No currently entered corpus record matches this search.</p>
          ) : (
            <div className="recordTable">
              {filteredCorpus.map((record, index) => (
                <article className="recordRow" key={record.id}>
                  <span className="recordNumber">
                    {String(index + 1).padStart(3, "0")}
                  </span>
                  <div className="recordMain">
                    <div className="recordTopline">
                      <span>{record.kind}</span>
                      <span>{record.date}</span>
                      <span>{record.status}</span>
                    </div>
                    <h3>{record.title}</h3>
                    <div className="recordMeta">
                      {record.identifier ? <code>{record.identifier}</code> : null}
                      {record.platform ? <span>{record.platform}</span> : null}
                      {record.note ? <span>{record.note}</span> : null}
                    </div>
                  </div>
                  {record.href ? (
                    <a
                      className="recordAction"
                      href={record.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open record ↗
                    </a>
                  ) : (
                    <span className="recordAction mutedAction">
                      Public-link entry pending
                    </span>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="publications" className="categoryBand shell">
        <div>
          <p className="eyebrow">PUBLICATIONS</p>
          <h2>{books.length + articles.length} books and articles currently listed.</h2>
        </div>
        <div className="categoryActions">
          <a href="#books">Open All Books ↓</a>
          <a href="#articles">Open All Articles ↓</a>
          <a href="https://www.amazon.com/" target="_blank" rel="noreferrer">
            Open Amazon Catalog ↗
          </a>
          <a href="https://medium.com/" target="_blank" rel="noreferrer">
            Open Medium Publications ↗
          </a>
        </div>
      </section>

      <LedgerSection
        id="books"
        eyebrow="BOOKS & LONG-FORM PUBLICATIONS"
        title="Published books, manuals, workbooks, and long-form records."
        records={books}
      />

      <LedgerSection
        id="articles"
        eyebrow="ARTICLES & PUBLIC EXPLANATIONS"
        title="Chronological public articles currently entered into the credentials ledger."
        records={articles}
      />

      <LedgerSection
        id="zenodo"
        eyebrow="ZENODO & DOI CORPUS"
        title="Persistent architecture, standards, and public-deposit records."
        records={zenodo}
      />

      <LedgerSection
        id="patents"
        eyebrow="PATENT APPLICATIONS & FILING LINEAGE"
        title="Declared patent applications currently entered into the public credentials record."
        records={patents}
      />

      <LedgerSection
        id="standards"
        eyebrow="TA-14 STANDARDS FAMILY"
        title="Public standards and protocol records."
        records={standards}
      />

      <LedgerSection
        id="repositories"
        eyebrow="GITHUB & TECHNICAL ARTIFACTS"
        title="Public repositories and technical implementation records."
        records={repositories}
      />

      <LedgerSection
        id="implementations"
        eyebrow="REFERENCE IMPLEMENTATIONS"
        title="Operational surfaces that translate the architecture into inspectable systems."
        records={implementations}
      />

      <section id="boundary" className="boundarySection shell">
        <div>
          <p className="eyebrow">CREDENTIALS BOUNDARY</p>
          <h2>Public proof is not the same as independent validation.</h2>
          <p>
            This ledger documents identity, stewardship, architecture,
            chronology, publications, deposits, repositories, filings,
            implementations, claims, non-claims, and declared relationships. It
            does not automatically establish legal priority, regulatory
            approval, accreditation, certification, independent validation, or
            proof that an implementation performs as claimed.
          </p>
        </div>

        <div className="boundaryGrid">
          <article>
            <strong>The credentials ledger preserves</strong>
            <p>
              Titles, dates, identifiers, stewardship, lineage, public routes,
              publications, repositories, versions, filings, and declared scope.
            </p>
          </article>
          <article>
            <strong>The Registry preserves</strong>
            <p>
              Individual dated and attributable governance records, including
              claims, non-claims, evidence, status, and version history.
            </p>
          </article>
          <article>
            <strong>Verification must still establish</strong>
            <p>
              Whether a specific architecture, implementation, route,
              execution, or outcome remains supported by admissible evidence.
            </p>
          </article>
        </div>
      </section>

      <section className="closing shell">
        <p className="eyebrow">TA-14 CREDENTIALS & PUBLIC RECORD</p>
        <h2>The scale of the work should be visible before anyone has to search for it.</h2>
        <div className="heroActions">
          <a className="button gold" href="#corpus-ledger">
            Return to Master Ledger <span>↑</span>
          </a>
          <Link className="button primary" href="/workspace/ai-governance/registry">
            Open Architectural Registry <span>↗</span>
          </Link>
          <Link className="button glass" href="/workspace">
            Enter the Exchange <span>↗</span>
          </Link>
        </div>
        <strong>No admissible evidence. No admissible execution.</strong>
      </section>

      <footer className="shell">
        <span>TA-14 Credentials & Public Record</span>
        <span>
          Identity • Books • Articles • Zenodo • Patents • Standards • GitHub
        </span>
      </footer>

      <style jsx global>{`
        :root {
          color-scheme: dark;
          --bg: #020711;
          --text: #f5f9ff;
          --muted: #a9bac6;
          --blue: #72dff0;
          --gold: #f1c36d;
        }

        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; background: var(--bg); }
        body {
          margin: 0;
          background: var(--bg);
          color: var(--text);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        a { color: inherit; text-decoration: none; }

        .page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          isolation: isolate;
          background:
            radial-gradient(circle at 50% 0%, rgba(31,104,164,.2), transparent 34%),
            linear-gradient(180deg,#020711,#07121e 55%,#020711);
        }

        .shell {
          width: min(1320px, calc(100% - 40px));
          margin-inline: auto;
          position: relative;
          z-index: 2;
        }

        .cosmos { position: fixed; inset: 0; overflow: hidden; pointer-events: none; z-index: -2; }
        .stars { position: absolute; inset: -15%; }
        .starsOne {
          background-image: radial-gradient(circle,rgba(255,255,255,.8) 0 1px,transparent 1.4px);
          background-size: 96px 96px;
          animation: drift 50s linear infinite;
        }
        .starsTwo {
          background-image: radial-gradient(circle,rgba(102,214,241,.72) 0 1px,transparent 1.5px);
          background-size: 161px 161px;
          animation: drift 68s linear infinite reverse;
        }
        .glow { position: absolute; width: 680px; height: 680px; border-radius: 50%; filter: blur(120px); opacity: .15; }
        .glowBlue { left: -300px; top: 12%; background: #087ed2; }
        .glowGold { right: -340px; top: 40%; background: #c78220; }
        .route {
          position: absolute;
          width: 85vw;
          height: 1px;
          background: linear-gradient(90deg,transparent,rgba(111,218,239,.5),rgba(242,191,109,.45),transparent);
        }
        .routeOne { top: 28%; left: -20%; transform: rotate(-8deg); animation: routeMove 18s linear infinite; }
        .routeTwo { top: 70%; right: -25%; transform: rotate(10deg); animation: routeMove 24s linear infinite reverse; }

        .topbar {
          width: min(1480px, calc(100% - 36px));
          min-height: 76px;
          margin: 18px auto 0;
          padding: 12px 14px 12px 18px;
          position: relative;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          border: 1px solid rgba(123,208,232,.18);
          border-radius: 20px;
          background: rgba(2,10,19,.74);
          backdrop-filter: blur(18px);
        }

        .brand { display: flex; align-items: center; gap: 13px; }
        .brandMark {
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          border: 1px solid rgba(242,191,109,.44);
          color: var(--gold);
          background: rgba(117,72,13,.18);
          font-size: 12px;
          font-weight: 950;
        }
        .brand > span:last-child { display: grid; gap: 3px; }
        .brand strong { font-family: Georgia,serif; font-size: 17px; }
        .brand small { color: #8fa7b7; font-size: 9px; font-weight: 900; letter-spacing: .1em; text-transform: uppercase; }
        .topbar nav { display: flex; gap: 7px; }
        .topbar nav a { padding: 10px 12px; border-radius: 11px; color: #b6c8d4; font-size: 11px; font-weight: 850; }
        .topbar nav a:hover { color: white; background: rgba(109,216,255,.08); }
        .topAction {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          padding: 0 17px;
          border-radius: 13px;
          border: 1px solid rgba(137,205,255,.27);
          background: linear-gradient(180deg,rgba(34,79,112,.76),rgba(8,27,43,.88));
          font-size: 11px;
          font-weight: 900;
        }

        .hero { padding: 100px 0 105px; text-align: center; }
        .seal {
          width: 210px;
          height: 210px;
          margin: 0 auto 30px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 2px solid rgba(242,191,109,.56);
          background: radial-gradient(circle,rgba(83,200,224,.18),rgba(6,21,34,.95) 62%);
          box-shadow: 0 0 70px rgba(74,195,225,.18),inset 0 0 35px rgba(255,192,66,.08);
        }
        .seal span { color: var(--blue); font-size: 12px; font-weight: 950; letter-spacing: .2em; }
        .seal strong { margin-top: 8px; color: #ffe3a2; font-family: Georgia,serif; font-size: 21px; letter-spacing: .05em; }
        .seal i { position: absolute; inset: 15px; border-radius: 50%; border: 1px solid rgba(111,218,239,.24); animation: spin 15s linear infinite; }
        .seal i:nth-of-type(2) { inset: 32px; border-color: rgba(242,191,109,.25); animation-direction: reverse; animation-duration: 11s; }
        .seal i:nth-of-type(3) { inset: -22px; border-color: rgba(197,126,255,.18); animation-duration: 22s; }

        .eyebrow { margin: 0; color: var(--gold); font-size: 10px; font-weight: 950; letter-spacing: .22em; }
        h1,h2,h3,p { margin-top: 0; }
        .hero h1,
        .recordCopy h2,
        .sectionHeading h2,
        .boundarySection h2,
        .closing h2,
        .corpusJump h2,
        .ledgerHeading h2,
        .categoryBand h2 {
          font-family: Georgia,"Times New Roman",serif;
          letter-spacing: -.048em;
          text-wrap: balance;
        }
        .hero h1 { max-width: 1120px; margin: 18px auto 22px; font-size: clamp(52px,7.2vw,100px); line-height: .95; font-weight: 500; }
        .hero h1 em { color: #ffc95c; font-style: italic; }
        .heroLead { max-width: 980px; margin: 0 auto; color: #c0d0da; font-size: 18px; line-height: 1.75; }

        .heroActions { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 32px; }
        .button {
          min-height: 52px;
          padding: 0 21px;
          display: inline-flex;
          align-items: center;
          gap: 13px;
          border-radius: 14px;
          border: 1px solid transparent;
          font-size: 12px;
          font-weight: 950;
          transition: transform .22s ease;
        }
        .button:hover { transform: translateY(-3px); }
        .button.primary { color: #031019; border-color: #a8effa; background: linear-gradient(135deg,#c7f5ff,#68d2ec 62%,#339fc1); }
        .button.gold { color: #281600; border-color: #f6d487; background: linear-gradient(135deg,#fff0b0,#efbd58 62%,#b66e12); }
        .button.glass { color: #e8f8ff; border-color: rgba(124,215,236,.28); background: linear-gradient(180deg,rgba(18,49,68,.9),rgba(7,24,38,.92)); }

        .recordSection { display: grid; grid-template-columns: 1.08fr .92fr; gap: 24px; padding: 90px 0; }
        .recordCopy,.chainPanel {
          padding: 38px;
          border-radius: 28px;
          border: 1px solid rgba(112,210,234,.17);
          background: linear-gradient(145deg,rgba(12,35,51,.92),rgba(5,16,28,.97));
        }
        .status {
          display: inline-flex;
          min-height: 31px;
          align-items: center;
          padding: 0 11px;
          margin-bottom: 24px;
          border-radius: 999px;
          border: 1px solid rgba(242,191,109,.3);
          color: #ffdf9c;
          background: rgba(104,62,10,.16);
          font-size: 9px;
          font-weight: 950;
          letter-spacing: .1em;
        }
        .recordCopy h2,.sectionHeading h2,.boundarySection h2,.closing h2,.ledgerHeading h2,.categoryBand h2,.corpusJump h2 {
          margin: 12px 0 16px;
          font-size: clamp(40px,5vw,68px);
          line-height: 1;
          font-weight: 500;
        }
        .recordCopy > p:last-of-type,.sectionHeading > p:last-child,.boundarySection > div:first-child > p:last-child {
          color: var(--muted);
          line-height: 1.75;
        }
        .identityGrid { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-top: 28px; }
        .identityGrid div { padding: 15px; border-radius: 14px; border: 1px solid rgba(109,216,255,.14); background: rgba(4,20,33,.72); }
        .identityGrid small { display: block; color: #8099aa; font-size: 8px; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; }
        .identityGrid strong { display: block; margin-top: 7px; font-family: Georgia,serif; font-size: 16px; }
        .chain { display: grid; gap: 9px; margin-top: 24px; }
        .chain > div { min-height: 48px; display: grid; grid-template-columns: 42px 1fr 24px; align-items: center; gap: 12px; padding: 0 14px; border-radius: 12px; border: 1px solid rgba(242,191,109,.16); background: rgba(71,45,9,.11); }
        .chain span { color: var(--blue); font-size: 9px; font-weight: 950; }
        .chain strong { font-family: Georgia,serif; font-size: 16px; }
        .chain i { color: var(--gold); font-style: normal; }
        .chainPanel > p:last-child { color: #9fb0bb; font-size: 12px; line-height: 1.65; }

        .mapSection,.masterLedger,.ledgerSection { padding: 100px 0; }
        .sectionHeading { max-width: 950px; }
        .foundationGrid { display: grid; grid-template-columns: repeat(2,1fr); gap: 14px; margin-top: 40px; }
        .foundationCard {
          min-height: 255px;
          padding: 25px;
          display: flex;
          flex-direction: column;
          border-radius: 22px;
          border: 1px solid rgba(109,216,255,.16);
          background: radial-gradient(circle at 100% 0%,rgba(109,216,255,.08),transparent 38%),linear-gradient(155deg,rgba(12,35,54,.92),rgba(4,15,26,.97));
          transition: transform .24s ease,border-color .24s ease;
        }
        .foundationCard:hover { transform: translateY(-6px); border-color: rgba(242,191,109,.44); }
        .foundationCard > span { width: 40px; height: 40px; display: grid; place-items: center; border-radius: 50%; border: 1px solid rgba(109,216,255,.28); color: var(--blue); font-size: 9px; font-weight: 950; }
        .foundationCard h3 { margin: 24px 0 10px; font-family: Georgia,serif; font-size: 28px; font-weight: 500; }
        .foundationCard p { margin: 0; color: #9fb1bc; font-size: 13px; line-height: 1.68; }
        .foundationCard div { display: flex; justify-content: space-between; margin-top: auto; padding-top: 24px; color: #ddf4ff; font-size: 11px; font-weight: 900; }

        .corpusJump {
          margin-top: 30px;
          padding: 54px 42px;
          border-radius: 30px;
          border: 1px solid rgba(242,191,109,.22);
          background: radial-gradient(circle at 0 0,rgba(183,112,26,.14),transparent 35%),linear-gradient(145deg,rgba(11,28,43,.95),rgba(4,13,23,.98));
        }
        .corpusJump > div { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; margin-top: 28px; }
        .corpusJump a,.categoryActions a {
          min-height: 58px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          border: 1px solid rgba(109,216,255,.17);
          border-radius: 14px;
          background: rgba(6,23,37,.76);
          font-size: 12px;
          font-weight: 900;
        }
        .corpusJump a:hover,.categoryActions a:hover { border-color: rgba(242,191,109,.45); }

        .ledgerControls {
          margin-top: 38px;
          padding: 20px;
          display: grid;
          gap: 18px;
          border: 1px solid rgba(112,210,234,.17);
          border-radius: 22px;
          background: rgba(5,17,29,.86);
        }
        .ledgerControls label { display: grid; gap: 9px; }
        .ledgerControls label span { color: #b8cad6; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: .09em; }
        .ledgerControls input {
          width: 100%;
          min-height: 54px;
          padding: 0 16px;
          color: white;
          border: 1px solid rgba(109,216,255,.22);
          border-radius: 13px;
          background: rgba(2,10,18,.86);
          font: inherit;
          outline: none;
        }
        .ledgerControls input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(241,195,109,.1); }
        .filterRow { display: flex; flex-wrap: wrap; gap: 8px; }
        .filterRow button {
          min-height: 40px;
          padding: 0 12px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #c2d3df;
          border: 1px solid rgba(109,216,255,.14);
          border-radius: 999px;
          background: rgba(10,31,47,.68);
          cursor: pointer;
          font-weight: 850;
        }
        .filterRow button span { min-width: 22px; height: 22px; display: grid; place-items: center; border-radius: 999px; background: rgba(255,255,255,.07); font-size: 10px; }
        .filterRow button.active { color: #241600; border-color: #f6d487; background: linear-gradient(135deg,#fff0b0,#efbd58); }

        .ledgerResult { margin-top: 20px; }
        .ledgerResult > span { display: block; margin-bottom: 10px; color: #8da1b0; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; }
        .recordTable { display: grid; gap: 9px; }
        .recordRow {
          min-width: 0;
          display: grid;
          grid-template-columns: 58px minmax(0,1fr) 160px;
          gap: 16px;
          align-items: center;
          padding: 18px;
          border: 1px solid rgba(109,216,255,.12);
          border-radius: 17px;
          background: linear-gradient(145deg,rgba(11,31,47,.84),rgba(4,15,25,.94));
        }
        .recordNumber { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 50%; color: var(--blue); border: 1px solid rgba(109,216,255,.24); font-size: 9px; font-weight: 950; }
        .recordMain { min-width: 0; }
        .recordTopline { display: flex; flex-wrap: wrap; gap: 7px; }
        .recordTopline span { padding: 5px 8px; border-radius: 999px; color: #9eb2c0; background: rgba(255,255,255,.04); font-size: 9px; font-weight: 850; }
        .recordMain h3 { margin: 10px 0 8px; font-family: Georgia,serif; font-size: 21px; line-height: 1.25; font-weight: 500; }
        .recordMeta { display: flex; flex-wrap: wrap; gap: 10px; color: #879aa8; font-size: 10px; }
        .recordMeta code { color: #b8dbec; overflow-wrap: anywhere; }
        .recordAction {
          min-height: 42px;
          padding: 0 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          border-radius: 12px;
          border: 1px solid rgba(242,191,109,.27);
          color: #ffe3a2;
          background: rgba(100,64,14,.16);
          font-size: 10px;
          font-weight: 900;
        }
        .mutedAction { color: #748693; border-color: rgba(116,134,147,.16); background: rgba(255,255,255,.025); }

        .ledgerHeading { display: flex; align-items: end; justify-content: space-between; gap: 24px; margin-bottom: 28px; }
        .ledgerHeading > div { max-width: 900px; }
        .ledgerHeading > span { color: #91a6b5; font-size: 11px; font-weight: 900; white-space: nowrap; }
        .categoryBand {
          margin-top: 50px;
          padding: 46px 42px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          align-items: center;
          border: 1px solid rgba(242,191,109,.22);
          border-radius: 28px;
          background: linear-gradient(145deg,rgba(36,30,20,.88),rgba(5,15,25,.98));
        }
        .categoryActions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

        .boundarySection {
          margin-top: 90px;
          padding: 70px 42px;
          border-radius: 30px;
          border: 1px solid rgba(242,191,109,.22);
          background: radial-gradient(circle at 0 0,rgba(183,112,26,.14),transparent 35%),linear-gradient(145deg,rgba(11,28,43,.95),rgba(4,13,23,.98));
        }
        .boundarySection > div:first-child { max-width: 930px; }
        .boundaryGrid { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-top: 34px; }
        .boundaryGrid article { padding: 22px; border-radius: 17px; border: 1px solid rgba(109,216,255,.14); background: rgba(5,20,33,.73); }
        .boundaryGrid strong { font-family: Georgia,serif; font-size: 20px; }
        .boundaryGrid p { color: #9fb0bc; font-size: 12px; line-height: 1.65; }

        .closing {
          margin-top: 110px;
          padding: 78px 32px;
          text-align: center;
          border-radius: 30px;
          border: 1px solid rgba(242,191,109,.22);
          background: radial-gradient(circle at 50% 0%,rgba(242,191,109,.12),transparent 40%),linear-gradient(145deg,rgba(24,25,29,.94),rgba(5,15,25,.98));
        }
        .closing > strong { display: block; margin-top: 30px; color: #f4dfa7; font-family: Georgia,serif; }
        footer { min-height: 100px; display: flex; justify-content: space-between; align-items: center; color: #768c9b; font-size: 11px; }

        @keyframes drift { to { transform: translate3d(120px,90px,0); } }
        @keyframes routeMove {
          from { translate: -30vw 0; opacity: 0; }
          20% { opacity: .5; }
          80% { opacity: .35; }
          to { translate: 120vw 0; opacity: 0; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 1100px) {
          .topbar nav { display: none; }
          .recordSection { grid-template-columns: 1fr; }
          .corpusJump > div { grid-template-columns: repeat(2,1fr); }
          .categoryBand { grid-template-columns: 1fr; }
        }

        @media (max-width: 760px) {
          .shell { width: min(100% - 24px,1320px); }
          .topbar { width: min(100% - 22px,1480px); }
          .brand small,.topAction { display: none; }
          .hero { padding: 76px 0 82px; }
          .heroLead { font-size: 16px; }
          .heroActions .button { width: 100%; justify-content: center; }
          .recordCopy,.chainPanel,.boundarySection,.corpusJump,.categoryBand { padding: 28px 20px; }
          .foundationGrid,.identityGrid,.boundaryGrid,.corpusJump > div,.categoryActions { grid-template-columns: 1fr; }
          .recordRow { grid-template-columns: 42px 1fr; }
          .recordAction { grid-column: 1 / -1; width: 100%; }
          .ledgerHeading { align-items: flex-start; flex-direction: column; }
          .ledgerHeading > span { white-space: normal; }
          footer { flex-direction: column; align-items: flex-start; justify-content: center; gap: 6px; }
        }

        @media (prefers-reduced-motion: reduce) {
          *,*::before,*::after {
            animation-duration: .001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .001ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </main>
  );
}
