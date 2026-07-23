import Link from "next/link";
import { notFound } from "next/navigation";

import {
  CORPUS_CATEGORY_LABELS,
  TA14_PUBLIC_CORPUS,
  type CorpusRecord,
} from "../corpus";

type PageProps = {
  params: Promise<{
    recordId: string;
  }>;
};

function formatStatus(status: string) {
  return status
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

function formatDate(value?: string, year?: number) {
  if (!value) return year ? String(year) : "Not declared";

  const parsed = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsed);
}

function findRelatedRecords(record: CorpusRecord) {
  const recordTags = new Set(
    (record.tags ?? []).map((tag) => tag.toLowerCase()),
  );

  return TA14_PUBLIC_CORPUS.filter((candidate) => candidate.id !== record.id)
    .map((candidate) => {
      const sharedTags = (candidate.tags ?? []).filter((tag) =>
        recordTags.has(tag.toLowerCase()),
      ).length;

      const sameCategory = candidate.category === record.category ? 2 : 0;
      const sameYear = candidate.year === record.year ? 1 : 0;

      return {
        candidate,
        score: sharedTags * 3 + sameCategory + sameYear,
      };
    })
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.candidate.year - a.candidate.year ||
        a.candidate.title.localeCompare(b.candidate.title),
    )
    .slice(0, 4)
    .map(({ candidate }) => candidate);
}

export function generateStaticParams() {
  return TA14_PUBLIC_CORPUS.map((record) => ({
    recordId: record.id,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { recordId } = await params;
  const record = TA14_PUBLIC_CORPUS.find((item) => item.id === recordId);

  if (!record) {
    return {
      title: "Public Corpus Record Not Found | TA-14",
    };
  }

  return {
    title: `${record.title} | TA-14 Public Corpus`,
    description:
      record.description ??
      record.relationship ??
      `${CORPUS_CATEGORY_LABELS[record.category]} record in the complete TA-14 Public Corpus.`,
  };
}

export default async function PublicCorpusRecordPage({ params }: PageProps) {
  const { recordId } = await params;
  const record = TA14_PUBLIC_CORPUS.find((item) => item.id === recordId);

  if (!record) notFound();

  const relatedRecords = findRelatedRecords(record);

  return (
    <main className="recordPage">
      <div className="ambient ambientOne" aria-hidden="true" />
      <div className="ambient ambientTwo" aria-hidden="true" />

      <section className="recordShell">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/foundation">Credentials & Public Record</Link>
          <span>/</span>
          <Link href="/foundation/public-corpus">Public Corpus</Link>
          <span>/</span>
          <span>{record.id}</span>
        </nav>

        <header className="hero">
          <div className="eyebrowRow">
            <span className="category">
              {CORPUS_CATEGORY_LABELS[record.category]}
            </span>
            <span className="status">{formatStatus(record.status)}</span>
          </div>

          <h1>{record.title}</h1>

          <p className="lead">
            {record.description ??
              record.relationship ??
              "A dated and attributable record preserved within the complete TA-14 Public Corpus."}
          </p>

          <div className="heroActions">
            {record.href ? (
              <a href={record.href} target="_blank" rel="noreferrer">
                Open external public record ↗
              </a>
            ) : null}

            <Link
              href={`/foundation/public-corpus?category=${record.category}`}
            >
              View all {CORPUS_CATEGORY_LABELS[record.category]} →
            </Link>
          </div>
        </header>

        <section className="recordGrid" aria-label="Record details">
          <article className="primaryCard">
            <div className="sectionLabel">Canonical record</div>

            <dl>
              <div>
                <dt>Corpus identifier</dt>
                <dd>
                  <code>{record.id}</code>
                </dd>
              </div>

              <div>
                <dt>Category</dt>
                <dd>{CORPUS_CATEGORY_LABELS[record.category]}</dd>
              </div>

              <div>
                <dt>Date / year</dt>
                <dd>{formatDate(record.date, record.year)}</dd>
              </div>

              <div>
                <dt>Status</dt>
                <dd>{formatStatus(record.status)}</dd>
              </div>

              {record.author ? (
                <div>
                  <dt>Author / steward</dt>
                  <dd>{record.author}</dd>
                </div>
              ) : null}

              {record.platform ? (
                <div>
                  <dt>Platform</dt>
                  <dd>{record.platform}</dd>
                </div>
              ) : null}

              {record.identifier ? (
                <div>
                  <dt>External identifier</dt>
                  <dd>
                    <code>{record.identifier}</code>
                  </dd>
                </div>
              ) : null}

              {record.sourceClass ? (
                <div>
                  <dt>Source class</dt>
                  <dd>{record.sourceClass}</dd>
                </div>
              ) : null}
            </dl>
          </article>

          <aside className="boundaryCard">
            <div className="sectionLabel">Public Corpus boundary</div>
            <h2>What this record establishes</h2>
            <p>
              This page preserves how the item is represented inside the TA-14
              public record: its title, category, date, declared status,
              identifiers, relationship, and public route.
            </p>

            <h2>What this record does not establish</h2>
            <p>
              Inclusion does not independently certify legal validity,
              technical performance, regulatory acceptance, ownership beyond
              the declared record, or adoption by another institution.
            </p>
          </aside>
        </section>

        {record.relationship ? (
          <section className="relationshipSection">
            <div className="sectionLabel">Relationship to TA-14</div>
            <h2>Place in the architecture and chronology</h2>
            <p>{record.relationship}</p>
          </section>
        ) : null}

        {record.tags?.length ? (
          <section className="tagSection">
            <div className="sectionLabel">Indexed subjects</div>
            <div className="tags">
              {record.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/foundation/public-corpus?q=${encodeURIComponent(tag)}`}
                >
                  {tag}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {relatedRecords.length ? (
          <section className="relatedSection">
            <div className="sectionHeading">
              <div>
                <div className="sectionLabel">Connected public record</div>
                <h2>Related corpus records</h2>
              </div>

              <Link href="/foundation/public-corpus">
                Search the complete corpus →
              </Link>
            </div>

            <div className="relatedGrid">
              {relatedRecords.map((related) => (
                <Link
                  key={related.id}
                  href={`/foundation/public-corpus/${related.id}`}
                >
                  <span>{CORPUS_CATEGORY_LABELS[related.category]}</span>
                  <strong>{related.title}</strong>
                  <small>
                    {related.date ?? related.year} ·{" "}
                    {formatStatus(related.status)}
                  </small>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <footer className="recordFooter">
          <p>
            <strong>TA-14 Public Corpus</strong>
            <br />
            Public evidence should be attributable, bounded, searchable, and
            connected to its source record.
          </p>

          <div>
            <Link href="/foundation">Return to Credentials & Public Record</Link>
            <Link href="/foundation/public-corpus">
              Return to the Complete Public Corpus
            </Link>
          </div>
        </footer>
      </section>

      <style>{`
        :root {
          color-scheme: dark;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #020911;
        }

        .recordPage {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: #eef7fb;
          background:
            radial-gradient(circle at 15% 8%, rgba(43, 156, 191, 0.15), transparent 31rem),
            radial-gradient(circle at 86% 21%, rgba(224, 168, 72, 0.11), transparent 28rem),
            linear-gradient(180deg, #061421 0%, #020911 58%, #04101a 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .recordPage::before {
          position: absolute;
          inset: 0;
          content: "";
          pointer-events: none;
          opacity: 0.2;
          background-image:
            linear-gradient(rgba(103, 210, 234, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(103, 210, 234, 0.08) 1px, transparent 1px);
          background-size: 72px 72px;
          mask-image: linear-gradient(to bottom, black, transparent 75%);
        }

        .ambient {
          position: absolute;
          width: 420px;
          height: 420px;
          border: 1px solid rgba(116, 218, 239, 0.1);
          border-radius: 50%;
          pointer-events: none;
          animation: drift 18s ease-in-out infinite alternate;
        }

        .ambient::before,
        .ambient::after {
          position: absolute;
          content: "";
          border-radius: 50%;
          background: rgba(126, 224, 243, 0.72);
          box-shadow: 0 0 24px rgba(126, 224, 243, 0.72);
        }

        .ambient::before {
          top: 17%;
          left: 3%;
          width: 4px;
          height: 4px;
        }

        .ambient::after {
          right: 9%;
          bottom: 23%;
          width: 3px;
          height: 3px;
        }

        .ambientOne {
          top: 7rem;
          right: -190px;
        }

        .ambientTwo {
          bottom: 12rem;
          left: -270px;
          transform: scale(1.4);
          animation-delay: -8s;
        }

        .recordShell {
          position: relative;
          z-index: 1;
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
          padding: 34px 0 70px;
        }

        .breadcrumbs {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 9px;
          color: #6f8796;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .breadcrumbs a {
          color: #9fc4d2;
          text-decoration: none;
        }

        .breadcrumbs a:hover {
          color: #f0c36c;
        }

        .hero {
          max-width: 980px;
          padding: 92px 0 66px;
        }

        .eyebrowRow {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 25px;
        }

        .category,
        .status {
          min-height: 31px;
          padding: 0 12px;
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .category {
          color: #041017;
          background: linear-gradient(135deg, #ccf7ff, #70d7ed);
        }

        .status {
          color: #f4ce81;
          border: 1px solid rgba(240, 195, 108, 0.27);
          background: rgba(105, 68, 16, 0.16);
        }

        h1,
        h2 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 500;
        }

        h1 {
          max-width: 1050px;
          font-size: clamp(42px, 7vw, 85px);
          line-height: 0.98;
          letter-spacing: -0.046em;
        }

        .lead {
          max-width: 830px;
          margin: 31px 0 0;
          color: #a8bcc8;
          font-size: clamp(16px, 2vw, 21px);
          line-height: 1.7;
        }

        .heroActions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 32px;
        }

        .heroActions a {
          min-height: 48px;
          padding: 0 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #06131b;
          border-radius: 12px;
          background: linear-gradient(135deg, #f3d28f, #d79f45);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.04em;
          text-decoration: none;
          text-transform: uppercase;
        }

        .heroActions a + a {
          color: #d9ebf2;
          border: 1px solid rgba(117, 213, 235, 0.24);
          background: rgba(6, 25, 38, 0.72);
        }

        .recordGrid {
          display: grid;
          grid-template-columns: minmax(0, 1.55fr) minmax(300px, 0.85fr);
          gap: 18px;
        }

        .primaryCard,
        .boundaryCard,
        .relationshipSection,
        .tagSection,
        .relatedSection {
          border: 1px solid rgba(107, 203, 226, 0.16);
          border-radius: 22px;
          background:
            linear-gradient(145deg, rgba(11, 34, 50, 0.88), rgba(4, 16, 27, 0.9));
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.18);
        }

        .primaryCard,
        .boundaryCard {
          padding: 27px;
        }

        .sectionLabel {
          margin-bottom: 18px;
          color: #77dced;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        dl {
          margin: 0;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1px;
          overflow: hidden;
          border: 1px solid rgba(119, 213, 234, 0.11);
          border-radius: 15px;
          background: rgba(112, 204, 226, 0.08);
        }

        dl > div {
          min-height: 103px;
          padding: 19px;
          background: rgba(2, 13, 22, 0.72);
        }

        dt {
          margin-bottom: 9px;
          color: #718997;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        dd {
          margin: 0;
          color: #e4f0f5;
          font-size: 14px;
          line-height: 1.5;
          overflow-wrap: anywhere;
        }

        code {
          color: #f1c879;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 12px;
        }

        .boundaryCard h2 {
          margin-top: 25px;
          color: #f0f6f8;
          font-size: 25px;
          line-height: 1.12;
        }

        .boundaryCard h2:first-of-type {
          margin-top: 0;
        }

        .boundaryCard p {
          margin: 12px 0 0;
          color: #91a8b5;
          font-size: 13px;
          line-height: 1.7;
        }

        .relationshipSection,
        .tagSection,
        .relatedSection {
          margin-top: 18px;
          padding: 31px;
        }

        .relationshipSection h2,
        .relatedSection h2 {
          font-size: clamp(29px, 4vw, 47px);
          line-height: 1.05;
        }

        .relationshipSection p {
          max-width: 900px;
          margin: 20px 0 0;
          color: #a7bbc6;
          font-size: 17px;
          line-height: 1.78;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        .tags a {
          min-height: 35px;
          padding: 0 12px;
          display: inline-flex;
          align-items: center;
          color: #bfe8f1;
          border: 1px solid rgba(111, 214, 236, 0.18);
          border-radius: 999px;
          background: rgba(11, 42, 57, 0.57);
          font-size: 10px;
          font-weight: 800;
          text-decoration: none;
        }

        .tags a:hover {
          color: #071118;
          background: #8be2f1;
        }

        .sectionHeading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 25px;
        }

        .sectionHeading .sectionLabel {
          margin-bottom: 10px;
        }

        .sectionHeading > a {
          color: #f1c36d;
          font-size: 10px;
          font-weight: 900;
          text-decoration: none;
          text-transform: uppercase;
        }

        .relatedGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .relatedGrid > a {
          min-height: 172px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          color: inherit;
          border: 1px solid rgba(116, 211, 233, 0.13);
          border-radius: 16px;
          background: rgba(2, 13, 22, 0.64);
          text-decoration: none;
          transition:
            transform 160ms ease,
            border-color 160ms ease,
            background 160ms ease;
        }

        .relatedGrid > a:hover {
          transform: translateY(-3px);
          border-color: rgba(240, 195, 108, 0.32);
          background: rgba(12, 37, 52, 0.86);
        }

        .relatedGrid span {
          margin-bottom: 13px;
          color: #72dced;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .relatedGrid strong {
          color: #eef6f9;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 20px;
          font-weight: 500;
          line-height: 1.18;
        }

        .relatedGrid small {
          margin-top: auto;
          padding-top: 18px;
          color: #708895;
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .recordFooter {
          margin-top: 48px;
          padding: 27px 0 0;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 25px;
          border-top: 1px solid rgba(111, 204, 226, 0.13);
        }

        .recordFooter p {
          margin: 0;
          color: #718895;
          font-size: 11px;
          line-height: 1.7;
        }

        .recordFooter strong {
          color: #d9eaf0;
        }

        .recordFooter > div {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 15px;
        }

        .recordFooter a {
          color: #f0c36d;
          font-size: 9px;
          font-weight: 900;
          text-decoration: none;
          text-transform: uppercase;
        }

        @keyframes drift {
          from {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          to {
            transform: translate3d(-40px, 25px, 0) rotate(14deg);
          }
        }

        @media (max-width: 860px) {
          .hero {
            padding-top: 67px;
          }

          .recordGrid {
            grid-template-columns: 1fr;
          }

          .relatedGrid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 620px) {
          .recordShell {
            width: min(100% - 22px, 1180px);
            padding-top: 22px;
          }

          .hero {
            padding: 54px 0 45px;
          }

          h1 {
            font-size: clamp(39px, 13vw, 62px);
          }

          .primaryCard,
          .boundaryCard,
          .relationshipSection,
          .tagSection,
          .relatedSection {
            padding: 21px;
            border-radius: 17px;
          }

          dl {
            grid-template-columns: 1fr;
          }

          .sectionHeading,
          .recordFooter {
            align-items: flex-start;
            flex-direction: column;
          }

          .recordFooter > div {
            justify-content: flex-start;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ambient {
            animation: none;
          }

          .relatedGrid > a {
            transition: none;
          }
        }
      `}</style>
    </main>
  );
}
