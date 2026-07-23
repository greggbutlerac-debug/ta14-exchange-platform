"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  CORPUS_CATEGORY_LABELS,
  TA14_PUBLIC_CORPUS,
} from "../app/foundation/public-corpus/corpus";

type SiteSearchItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  type: string;
  keywords: string[];
};

const STATIC_SEARCH_ITEMS: SiteSearchItem[] = [
  {
    id: "home",
    title: "TA-14 AI Governance Exchange",
    description:
      "Public front door for the TA-14 AI Governance Exchange, governed records, reviews, partners, runtime, and pricing.",
    href: "/",
    type: "Platform",
    keywords: ["home", "exchange", "AI governance", "platform"],
  },
  {
    id: "workspace",
    title: "Exchange Workspace",
    description:
      "Open the operational AI governance workspace and public playground.",
    href: "/workspace",
    type: "Workspace",
    keywords: ["workspace", "playground", "build", "test", "route"],
  },
  {
    id: "foundation",
    title: "TA-14 Credentials & Public Record",
    description:
      "Institutional identity, credentials, lineage, architecture, stewardship, and public evidence map.",
    href: "/foundation",
    type: "Credentials",
    keywords: [
      "foundation",
      "credentials",
      "identity",
      "lineage",
      "stewardship",
      "Greggory Don Butler",
    ],
  },
  {
    id: "public-corpus",
    title: "Complete TA-14 Public Corpus",
    description:
      "Search books, articles, DOI records, patent applications, standards, repositories, sites, implementations, and chronology.",
    href: "/foundation/public-corpus",
    type: "Public Corpus",
    keywords: [
      "public corpus",
      "publications",
      "books",
      "articles",
      "patents",
      "Zenodo",
      "DOI",
      "GitHub",
      "standards",
      "chronology",
    ],
  },
  {
    id: "registry",
    title: "TA-14 AI Governance Registry",
    description:
      "Search dated and attributable governance registrations, claims, evidence, status, limitations, and version history.",
    href: "/registry",
    type: "Registry",
    keywords: [
      "registry",
      "registration",
      "governance architecture",
      "claims",
      "evidence",
    ],
  },
  {
    id: "registry-workspace",
    title: "AI Governance Registry Workspace",
    description:
      "Open the registry workspace for submissions, records, review, and registration.",
    href: "/workspace/ai-governance/registry",
    type: "Registry",
    keywords: ["registry workspace", "submission", "register", "review"],
  },
  {
    id: "registry-register",
    title: "Register a Governance Architecture",
    description:
      "Begin a new AI governance registry submission.",
    href: "/workspace/ai-governance/registry/register",
    type: "Registry Action",
    keywords: ["register", "submission", "governance architecture", "intake"],
  },
  {
    id: "records",
    title: "Governed Records",
    description:
      "Create, inspect, preserve, and verify governed records.",
    href: "/records",
    type: "Records",
    keywords: ["records", "governed records", "evidence", "preserve"],
  },
  {
    id: "workspace-records",
    title: "Workspace Records",
    description:
      "Open governed records inside the Exchange workspace.",
    href: "/workspace/records",
    type: "Workspace Tool",
    keywords: ["records", "workspace records", "evidence"],
  },
  {
    id: "verification",
    title: "Verification",
    description:
      "Inspect verification records, receipts, replay history, and route evidence.",
    href: "/verification",
    type: "Verification",
    keywords: ["verification", "receipts", "replay", "proof"],
  },
  {
    id: "workspace-verification",
    title: "Workspace Verification",
    description:
      "Inspect verification activity inside the Exchange workspace.",
    href: "/workspace/verification",
    type: "Workspace Tool",
    keywords: ["workspace verification", "receipts", "replay"],
  },
  {
    id: "execution-map",
    title: "Execution Map",
    description:
      "Inspect the route from reality and evidence through execution and outcome.",
    href: "/workspace/execution-map",
    type: "Workspace Tool",
    keywords: ["execution map", "route", "outcome", "chain"],
  },
  {
    id: "my-routes",
    title: "My Routes",
    description:
      "Open account-scoped saved governance routes.",
    href: "/workspace/my-routes",
    type: "Workspace Tool",
    keywords: ["my routes", "saved routes", "account"],
  },
  {
    id: "route-builder",
    title: "Route Builder",
    description:
      "Build and preserve an AI governance route for testing and review.",
    href: "/workspace/build",
    type: "Workspace Tool",
    keywords: ["route builder", "build", "route", "governance"],
  },
  {
    id: "upload",
    title: "Upload Governance Materials",
    description:
      "Upload governance documents and supporting evidence for review.",
    href: "/workspace/upload",
    type: "Workspace Tool",
    keywords: ["upload", "documents", "evidence", "files"],
  },
  {
    id: "paste",
    title: "Paste Governance Materials",
    description:
      "Paste governance text directly into the Exchange workspace.",
    href: "/workspace/paste",
    type: "Workspace Tool",
    keywords: ["paste", "text", "governance material"],
  },
  {
    id: "scanner",
    title: "Governance Scanner",
    description:
      "Scan governance materials for route, evidence, authority, and continuity issues.",
    href: "/workspace/scanner",
    type: "Workspace Tool",
    keywords: ["scanner", "scan", "evidence gaps", "authority"],
  },
  {
    id: "demonstrations",
    title: "Demonstrations",
    description:
      "Open TA-14 public demonstrations and test routes.",
    href: "/workspace/demonstrations",
    type: "Demonstrations",
    keywords: ["demonstrations", "demo", "test route", "playground"],
  },
  {
    id: "eu-ai-act",
    title: "EU AI Act Requirements",
    description:
      "Inspect applicable EU AI Act requirements and how TA-14 can address each requirement.",
    href: "/workspace/ai-governance/eu-ai-act",
    type: "Regulatory",
    keywords: ["EU AI Act", "requirements", "Article 50", "compliance"],
  },
  {
    id: "marketplace",
    title: "TA-14 Governance Marketplace",
    description:
      "Open the marketplace for governance needs, review services, and collaboration.",
    href: "/marketplace",
    type: "Marketplace",
    keywords: ["marketplace", "post need", "services", "review"],
  },
  {
    id: "partner-review-network",
    title: "TA-14 Partner Review Network",
    description:
      "Independent review partners, review lanes, boundaries, and collaboration routes.",
    href: "/partners",
    type: "Network",
    keywords: ["partner review network", "PRN", "partners", "review"],
  },
  {
    id: "academy",
    title: "TA-14 Academy",
    description:
      "Education, evidence-before-intervention discipline, HVACDR, and workforce-development materials.",
    href: "/academy",
    type: "Academy",
    keywords: ["academy", "HVACDR", "education", "training"],
  },
];

const CORPUS_SEARCH_ITEMS: SiteSearchItem[] = TA14_PUBLIC_CORPUS.map((record) => ({
  id: `corpus-${record.id}`,
  title: record.title,
  description:
    record.description ??
    record.relationship ??
    `${CORPUS_CATEGORY_LABELS[record.category]} public record.`,
  href: `/foundation/public-corpus/${record.id}`,
  type: CORPUS_CATEGORY_LABELS[record.category],
  keywords: [
    record.category,
    record.author ?? "",
    record.platform ?? "",
    record.status,
    record.identifier ?? "",
    record.date ?? "",
    String(record.year),
    record.relationship ?? "",
    record.sourceClass ?? "",
    ...(record.tags ?? []),
  ].filter(Boolean),
}));

const SEARCH_ITEMS: SiteSearchItem[] = [
  ...STATIC_SEARCH_ITEMS,
  ...CORPUS_SEARCH_ITEMS,
];

function scoreItem(item: SiteSearchItem, terms: string[]) {
  const title = item.title.toLowerCase();
  const type = item.type.toLowerCase();
  const description = item.description.toLowerCase();
  const keywords = item.keywords.join(" ").toLowerCase();

  return terms.reduce((score, term) => {
    if (title === term) return score + 100;
    if (title.startsWith(term)) return score + 50;
    if (title.includes(term)) return score + 30;
    if (type.includes(term)) return score + 18;
    if (keywords.includes(term)) return score + 12;
    if (description.includes(term)) return score + 6;
    return score;
  }, 0);
}

export default function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const terms = query
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    if (!terms.length) {
      return SEARCH_ITEMS.slice(0, 10);
    }

    return SEARCH_ITEMS.map((item) => ({
      item,
      score: scoreItem(item, terms),
    }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
      .slice(0, 20)
      .map(({ item }) => item);
  }, [query]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const commandKey = navigator.platform.toLowerCase().includes("mac")
        ? event.metaKey
        : event.ctrlKey;

      if (commandKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }

      if (event.key === "/" && !open) {
        const target = event.target as HTMLElement | null;
        const isTyping =
          target?.tagName === "INPUT" ||
          target?.tagName === "TEXTAREA" ||
          target?.isContentEditable;

        if (!isTyping) {
          event.preventDefault();
          setOpen(true);
        }
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 20);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setActiveIndex(0);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) =>
        Math.min(current + 1, Math.max(results.length - 1, 0)),
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
    }

    if (event.key === "Enter" && results[activeIndex]) {
      event.preventDefault();
      window.location.href = results[activeIndex].href;
      setOpen(false);
    }
  }

  return (
    <>
      <button
        className="siteSearchTrigger"
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search the TA-14 AI Governance Exchange"
      >
        <span className="searchIcon" aria-hidden="true">
          ⌕
        </span>
        <span className="triggerLabel">Search TA-14</span>
        <kbd>Ctrl K</kbd>
      </button>

      {open ? (
        <div
          className="siteSearchOverlay"
          role="dialog"
          aria-modal="true"
          aria-label="Search the TA-14 AI Governance Exchange"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setOpen(false);
          }}
        >
          <section className="siteSearchPanel">
            <header>
              <div className="searchInputWrap">
                <span aria-hidden="true">⌕</span>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={handleInputKeyDown}
                  type="search"
                  placeholder="Search pages, records, tools, registry, corpus…"
                  aria-label="Search"
                />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close search"
                >
                  ESC
                </button>
              </div>

              <div className="searchScope">
                <span>Entire TA-14 AI Governance Exchange and Public Corpus</span>
                <span>{SEARCH_ITEMS.length} indexed pages and public records</span>
              </div>
            </header>

            <div className="searchResults" role="listbox">
              {results.length ? (
                results.map((result, index) => (
                  <Link
                    key={result.id}
                    href={result.href}
                    className={index === activeIndex ? "active" : ""}
                    role="option"
                    aria-selected={index === activeIndex}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => setOpen(false)}
                  >
                    <span className="resultType">{result.type}</span>
                    <span className="resultCopy">
                      <strong>{result.title}</strong>
                      <small>{result.description}</small>
                    </span>
                    <span className="resultArrow">→</span>
                  </Link>
                ))
              ) : (
                <div className="noResults">
                  <strong>No matching platform destination was found.</strong>
                  <p>
                    Try a broader term such as “registry,” “records,”
                    “verification,” “EU AI Act,” “academy,” or “corpus.”
                  </p>
                  <Link
                    href="/foundation/public-corpus"
                    onClick={() => setOpen(false)}
                  >
                    Open the Complete Public Corpus →
                  </Link>
                </div>
              )}
            </div>

            <footer>
              <span>
                <kbd>↑</kbd>
                <kbd>↓</kbd> navigate
              </span>
              <span>
                <kbd>Enter</kbd> open
              </span>
              <span>
                <kbd>Esc</kbd> close
              </span>
              <Link href="/foundation/public-corpus" onClick={() => setOpen(false)}>
                Complete Public Corpus
              </Link>
            </footer>
          </section>
        </div>
      ) : null}

      <style jsx global>{`
        .siteSearchTrigger {
          min-height: 42px;
          padding: 0 10px 0 13px;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: #c8d8e2;
          border: 1px solid rgba(115, 208, 232, 0.2);
          border-radius: 12px;
          background: rgba(4, 18, 30, 0.78);
          cursor: pointer;
          font: inherit;
        }

        .siteSearchTrigger:hover {
          color: white;
          border-color: rgba(241, 195, 109, 0.42);
          background: rgba(11, 31, 47, 0.94);
        }

        .searchIcon {
          color: #72dff0;
          font-size: 20px;
          line-height: 1;
          transform: rotate(-20deg);
        }

        .triggerLabel {
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .siteSearchTrigger kbd,
        .siteSearchPanel kbd {
          min-width: 30px;
          min-height: 24px;
          padding: 0 6px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #91a5b2;
          border: 1px solid rgba(130, 166, 188, 0.18);
          border-bottom-color: rgba(130, 166, 188, 0.32);
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.04);
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 8px;
          font-weight: 800;
        }

        .siteSearchOverlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          padding: 8vh 18px 30px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          background: rgba(0, 4, 10, 0.78);
          backdrop-filter: blur(16px);
        }

        .siteSearchPanel {
          width: min(880px, 100%);
          max-height: 84vh;
          display: grid;
          grid-template-rows: auto minmax(0, 1fr) auto;
          overflow: hidden;
          color: #f5f9ff;
          border: 1px solid rgba(116, 214, 238, 0.24);
          border-radius: 24px;
          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(241, 195, 109, 0.12),
              transparent 36%
            ),
            linear-gradient(
              155deg,
              rgba(10, 31, 48, 0.99),
              rgba(3, 13, 23, 0.995)
            );
          box-shadow:
            0 30px 100px rgba(0, 0, 0, 0.58),
            0 0 90px rgba(66, 194, 227, 0.09);
        }

        .siteSearchPanel > header {
          padding: 17px;
          border-bottom: 1px solid rgba(116, 214, 238, 0.13);
        }

        .searchInputWrap {
          min-height: 62px;
          display: grid;
          grid-template-columns: 34px 1fr auto;
          align-items: center;
          gap: 8px;
          padding: 0 12px;
          border: 1px solid rgba(116, 214, 238, 0.21);
          border-radius: 15px;
          background: rgba(1, 8, 15, 0.74);
        }

        .searchInputWrap > span {
          color: #72dff0;
          font-size: 25px;
          transform: rotate(-20deg);
        }

        .searchInputWrap input {
          width: 100%;
          height: 58px;
          padding: 0;
          color: white;
          border: 0;
          outline: none;
          background: transparent;
          font: inherit;
          font-size: 16px;
        }

        .searchInputWrap input::placeholder {
          color: #748b9a;
        }

        .searchInputWrap button {
          min-height: 29px;
          padding: 0 8px;
          color: #90a5b3;
          border: 1px solid rgba(130, 166, 188, 0.2);
          border-radius: 7px;
          background: rgba(255, 255, 255, 0.04);
          cursor: pointer;
          font-size: 8px;
          font-weight: 900;
        }

        .searchScope {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          padding: 12px 5px 0;
          color: #78909f;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .searchResults {
          min-height: 220px;
          overflow-y: auto;
          overscroll-behavior: contain;
          padding: 10px;
        }

        .searchResults > a {
          min-height: 86px;
          padding: 13px;
          display: grid;
          grid-template-columns: 106px 1fr 32px;
          align-items: center;
          gap: 13px;
          color: inherit;
          border: 1px solid transparent;
          border-radius: 14px;
          text-decoration: none;
        }

        .searchResults > a:hover,
        .searchResults > a.active {
          border-color: rgba(241, 195, 109, 0.24);
          background:
            linear-gradient(
              90deg,
              rgba(98, 63, 15, 0.16),
              rgba(23, 55, 73, 0.28)
            );
        }

        .resultType {
          min-height: 29px;
          padding: 0 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #061219;
          border-radius: 999px;
          background: linear-gradient(135deg, #c9f5ff, #70d7ed);
          font-size: 8px;
          font-weight: 950;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .resultCopy {
          min-width: 0;
          display: grid;
          gap: 6px;
        }

        .resultCopy strong {
          overflow: hidden;
          color: #f4f8fb;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 18px;
          font-weight: 500;
          line-height: 1.12;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .resultCopy small {
          display: -webkit-box;
          overflow: hidden;
          color: #93a8b6;
          font-size: 10px;
          line-height: 1.45;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .resultArrow {
          color: #f1c36d;
          font-size: 18px;
          text-align: center;
        }

        .noResults {
          padding: 58px 24px;
          text-align: center;
        }

        .noResults strong {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 27px;
          font-weight: 500;
        }

        .noResults p {
          max-width: 560px;
          margin: 13px auto;
          color: #93a8b6;
          line-height: 1.65;
        }

        .noResults a {
          color: #f1c36d;
          font-size: 11px;
          font-weight: 900;
        }

        .siteSearchPanel > footer {
          min-height: 57px;
          padding: 0 17px;
          display: flex;
          align-items: center;
          gap: 15px;
          border-top: 1px solid rgba(116, 214, 238, 0.13);
          color: #8298a6;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .siteSearchPanel > footer span {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .siteSearchPanel > footer a {
          margin-left: auto;
          color: #f1c36d;
          text-decoration: none;
        }

        @media (max-width: 700px) {
          .triggerLabel,
          .siteSearchTrigger > kbd {
            display: none;
          }

          .siteSearchTrigger {
            width: 42px;
            padding: 0;
            justify-content: center;
          }

          .siteSearchOverlay {
            padding: 12px;
            align-items: stretch;
          }

          .siteSearchPanel {
            max-height: calc(100vh - 24px);
            border-radius: 19px;
          }

          .searchScope span:last-child,
          .siteSearchPanel > footer span {
            display: none;
          }

          .searchResults > a {
            grid-template-columns: 1fr 25px;
          }

          .resultType {
            width: max-content;
            grid-column: 1 / -1;
          }

          .resultCopy strong {
            white-space: normal;
          }

          .siteSearchPanel > footer a {
            margin-left: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .siteSearchOverlay {
            backdrop-filter: none;
          }
        }
      `}</style>
    </>
  );
}
