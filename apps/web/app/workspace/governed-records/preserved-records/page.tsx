"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type PreservationState = "PRESERVED" | "LIMITED" | "HOLD" | "COMPROMISED";

type PreservedRecord = {
  id: string;
  title: string;
  recordClass: string;
  source: string;
  authority: string;
  createdAt: string;
  preservedAt: string;
  version: string;
  digest: string;
  continuity: string;
  verification: string;
  status: PreservationState;
  notes: string;
};

const initialRecords: PreservedRecord[] = [
  {
    id: "AIR-2026-0720-04",
    title: "East Wing Atmospheric Integrity Record",
    recordClass: "Atmospheric Integrity Record",
    source: "AIR-HUB-04",
    authority: "Facilities Operations",
    createdAt: "2026-07-20 14:02 ET",
    preservedAt: "2026-07-20 14:04 ET",
    version: "v1.0",
    digest: "8c74d9a1f3b2e6c0",
    continuity: "CONTINUOUS",
    verification: "READY",
    status: "PRESERVED",
    notes:
      "Original record preserved separately from later comparison and interpretation artifacts.",
  },
  {
    id: "CR-2026-0720-04",
    title: "Continuity Review — East Wing",
    recordClass: "Continuity Review Record",
    source: "TA-14 Continuity Review",
    authority: "Declared Reviewer",
    createdAt: "2026-07-20 14:10 ET",
    preservedAt: "2026-07-20 14:11 ET",
    version: "v1.0",
    digest: "a62ef418cc90b731",
    continuity: "CONTINUOUS",
    verification: "READY",
    status: "PRESERVED",
    notes:
      "Generated as a separate review artifact. The source record remains unchanged.",
  },
  {
    id: "RC-2026-0721-04",
    title: "Record Comparison — Baseline to Later Record",
    recordClass: "Record Comparison",
    source: "TA-14 Record Comparison",
    authority: "Declared Reviewer",
    createdAt: "2026-07-21 14:18 ET",
    preservedAt: "2026-07-21 14:21 ET",
    version: "v1.0",
    digest: "f144a3b11d278c9e",
    continuity: "LIMITED",
    verification: "PENDING",
    status: "LIMITED",
    notes:
      "Comparison remains valid only within the declared comparison fields and captured periods.",
  },
];

function stateCopy(state: PreservationState) {
  const copy = {
    PRESERVED: {
      title: "Preservation standing retained",
      text: "Identity, version, timing, source, authority, and digest are present.",
    },
    LIMITED: {
      title: "Preservation standing is bounded",
      text: "The artifact remains preserved, but one or more declared limitations restrict downstream use.",
    },
    HOLD: {
      title: "Preservation cannot advance",
      text: "A required identity, authority, timing, or integrity field is unresolved.",
    },
    COMPROMISED: {
      title: "Preservation integrity is compromised",
      text: "The artifact contains a material integrity conflict or missing preservation boundary.",
    },
  };

  return copy[state];
}

function deriveLibraryState(records: PreservedRecord[]): PreservationState {
  if (records.some((record) => record.status === "COMPROMISED")) {
    return "COMPROMISED";
  }

  if (records.some((record) => record.status === "HOLD")) {
    return "HOLD";
  }

  if (records.some((record) => record.status === "LIMITED")) {
    return "LIMITED";
  }

  return "PRESERVED";
}

export default function PreservedRecordsPage() {
  const [records, setRecords] = useState(initialRecords);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"ALL" | PreservationState>("ALL");
  const [selectedId, setSelectedId] = useState(initialRecords[0].id);

  const selected =
    records.find((record) => record.id === selectedId) ?? records[0];

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return records.filter((record) => {
      const matchesFilter = filter === "ALL" || record.status === filter;
      const matchesQuery =
        !normalized ||
        [
          record.id,
          record.title,
          record.recordClass,
          record.source,
          record.authority,
          record.digest,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalized);

      return matchesFilter && matchesQuery;
    });
  }, [records, query, filter]);

  const libraryState = deriveLibraryState(records);

  const addDemonstrationRecord = () => {
    const next: PreservedRecord = {
      id: `AER-${Date.now().toString().slice(-8)}`,
      title: "New Preserved Demonstration Record",
      recordClass: "Admissible Execution Record",
      source: "TA-14 Demonstration Route",
      authority: "Declared Route Authority",
      createdAt: new Date().toLocaleString(),
      preservedAt: new Date().toLocaleString(),
      version: "v1.0",
      digest: crypto.randomUUID().replaceAll("-", "").slice(0, 16),
      continuity: "PENDING",
      verification: "PENDING",
      status: "HOLD",
      notes:
        "Demonstration artifact created locally. Durable storage remains a separate connected capability.",
    };

    setRecords((current) => [next, ...current]);
    setSelectedId(next.id);
  };

  return (
    <main className="page-shell">
      <div className="stars stars-one" />
      <div className="stars stars-two" />

      <header className="topbar">
        <Link className="brand" href="/workspace/governed-records">
          <span className="brand-mark">TA-14</span>
          <span>
            <strong>Governed Records</strong>
            <small>Preserved Records</small>
          </span>
        </Link>

        <nav aria-label="Governed Records">
          <Link href="/workspace/governed-records/my-records">My Records</Link>
          <Link href="/workspace/governed-records/continuity-review">
            Continuity Review
          </Link>
          <Link href="/workspace/governed-records/comparison">
            Record Comparison
          </Link>
          <Link
            className="active"
            href="/workspace/governed-records/preserved-records"
          >
            Preserved Records
          </Link>
          <Link href="/workspace/governed-records/verification">
            Verification
          </Link>
        </nav>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">PRESERVE WITHOUT REWRITING</p>
          <h1>Keep the original record and every governed layer distinct.</h1>
          <p className="hero-copy">
            Preserve source records, continuity reviews, comparisons,
            interpretations, corrections, and determinations without allowing
            one artifact to overwrite another.
          </p>
        </div>

        <div className={`state-card state-${libraryState.toLowerCase()}`}>
          <span>Library standing</span>
          <strong>{libraryState}</strong>
          <p>{stateCopy(libraryState).text}</p>
        </div>
      </section>

      <section className="canon-strip">
        <span>Reality</span>
        <b>→</b>
        <span>Record</span>
        <b>→</b>
        <span>Continuity</span>
        <b>→</b>
        <strong>Preservation</strong>
        <b>→</b>
        <span>Verification</span>
        <b>→</b>
        <span>Binding</span>
        <b>→</b>
        <span>Execution</span>
        <b>→</b>
        <span>Outcome</span>
      </section>

      <section className="summary-grid">
        <article className="summary-card">
          <span>Total artifacts</span>
          <strong>{records.length}</strong>
          <small>Source and review artifacts</small>
        </article>
        <article className="summary-card">
          <span>Fully preserved</span>
          <strong>
            {records.filter((record) => record.status === "PRESERVED").length}
          </strong>
          <small>Unrestricted preservation standing</small>
        </article>
        <article className="summary-card">
          <span>Bounded or held</span>
          <strong>
            {
              records.filter(
                (record) =>
                  record.status === "LIMITED" || record.status === "HOLD",
              ).length
            }
          </strong>
          <small>Requires declared limitation or correction</small>
        </article>
        <article className="summary-card">
          <span>Compromised</span>
          <strong>
            {
              records.filter((record) => record.status === "COMPROMISED")
                .length
            }
          </strong>
          <small>Material integrity conflicts</small>
        </article>
      </section>

      <section className="workspace-grid">
        <div className="panel library-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">PRESERVED ARTIFACT LIBRARY</p>
              <h2>Records and governed review layers</h2>
            </div>

            <button className="primary" type="button" onClick={addDemonstrationRecord}>
              Create demonstration record
            </button>
          </div>

          <div className="toolbar">
            <input
              aria-label="Search preserved records"
              placeholder="Search identity, class, source, authority, or digest"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />

            <select
              aria-label="Filter by preservation state"
              value={filter}
              onChange={(event) =>
                setFilter(
                  event.target.value as "ALL" | PreservationState,
                )
              }
            >
              <option value="ALL">All states</option>
              <option value="PRESERVED">Preserved</option>
              <option value="LIMITED">Limited</option>
              <option value="HOLD">Hold</option>
              <option value="COMPROMISED">Compromised</option>
            </select>
          </div>

          <div className="record-list">
            {filtered.map((record) => (
              <button
                className={`record-row ${
                  selectedId === record.id ? "selected" : ""
                }`}
                type="button"
                key={record.id}
                onClick={() => setSelectedId(record.id)}
              >
                <div className="record-identity">
                  <strong>{record.title}</strong>
                  <span>
                    {record.id} · {record.recordClass}
                  </span>
                </div>

                <div>
                  <span className="label">Preserved</span>
                  <strong>{record.preservedAt}</strong>
                </div>

                <div>
                  <span className="label">Digest</span>
                  <strong className="mono">{record.digest}</strong>
                </div>

                <span className={`status status-${record.status.toLowerCase()}`}>
                  {record.status}
                </span>
              </button>
            ))}

            {filtered.length === 0 ? (
              <div className="empty-state">
                No preserved records match this search and filter.
              </div>
            ) : null}
          </div>
        </div>

        <aside className="panel detail-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">PRESERVATION RECEIPT</p>
              <h2>{selected?.id ?? "No record selected"}</h2>
            </div>
            {selected ? (
              <span
                className={`status status-${selected.status.toLowerCase()}`}
              >
                {selected.status}
              </span>
            ) : null}
          </div>

          {selected ? (
            <>
              <h3>{selected.title}</h3>
              <p className="detail-copy">{selected.notes}</p>

              <dl>
                <div>
                  <dt>Record class</dt>
                  <dd>{selected.recordClass}</dd>
                </div>
                <div>
                  <dt>Source</dt>
                  <dd>{selected.source}</dd>
                </div>
                <div>
                  <dt>Authority</dt>
                  <dd>{selected.authority}</dd>
                </div>
                <div>
                  <dt>Created</dt>
                  <dd>{selected.createdAt}</dd>
                </div>
                <div>
                  <dt>Preserved</dt>
                  <dd>{selected.preservedAt}</dd>
                </div>
                <div>
                  <dt>Version</dt>
                  <dd>{selected.version}</dd>
                </div>
                <div>
                  <dt>Digest</dt>
                  <dd className="mono">{selected.digest}</dd>
                </div>
                <div>
                  <dt>Continuity</dt>
                  <dd>{selected.continuity}</dd>
                </div>
                <div>
                  <dt>Verification</dt>
                  <dd>{selected.verification}</dd>
                </div>
              </dl>

              <div className="detail-actions">
                <button
                  type="button"
                  onClick={() =>
                    setRecords((current) =>
                      current.map((record) =>
                        record.id === selected.id
                          ? {
                              ...record,
                              version: `v${(
                                Number(record.version.replace("v", "")) + 0.1
                              ).toFixed(1)}`,
                              preservedAt: new Date().toLocaleString(),
                              digest: crypto
                                .randomUUID()
                                .replaceAll("-", "")
                                .slice(0, 16),
                              status: "LIMITED",
                              notes:
                                "A new version was preserved. The earlier version remains represented by its prior receipt and must not be overwritten.",
                            }
                          : record,
                      ),
                    )
                  }
                >
                  Preserve new version
                </button>

                <Link href="/workspace/governed-records/verification">
                  Open verification →
                </Link>
              </div>
            </>
          ) : null}
        </aside>
      </section>

      <section className="panel boundary-panel">
        <div>
          <p className="eyebrow">PRESERVATION RULE</p>
          <h2>A correction is a new artifact, not a silent replacement.</h2>
        </div>

        <div className="boundary-columns">
          <article>
            <h3>Preserved separately</h3>
            <p>
              Original source record, continuity review, record comparison,
              interpretation, correction, verification, and determination.
            </p>
          </article>
          <article>
            <h3>Never implied</h3>
            <p>
              Preservation does not prove accuracy, safety, truth, authority,
              continuity, admissibility, or acceptable outcome.
            </p>
          </article>
          <article>
            <h3>Required for replay</h3>
            <p>
              Stable identity, version, timestamp, digest, source, authority,
              and a visible relationship to every later artifact.
            </p>
          </article>
        </div>
      </section>

      <section className="next-panel">
        <div>
          <p className="eyebrow">NEXT ADMISSIBLE STEP</p>
          <h2>Verify what has been preserved.</h2>
          <p>
            Preservation protects the artifact from silent substitution.
            Verification separately examines identity, integrity, authority,
            continuity, and standing.
          </p>
        </div>

        <div className="next-actions">
          <Link href="/workspace/governed-records/verification">
            <span>Inspect standing and integrity</span>
            <strong>Open Verification →</strong>
          </Link>
          <Link href="/workspace/governed-records/pricing">
            <span>Review preservation and verification access</span>
            <strong>Open Pricing →</strong>
          </Link>
        </div>
      </section>

      <footer>
        <strong>No admissible evidence. No admissible execution.</strong>
        <span>
          Preservation protects the record. It does not upgrade what the record
          proves.
        </span>
      </footer>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          background: #04100f;
        }

        :global(body) {
          margin: 0;
          background: #04100f;
          color: #eef8f4;
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        :global(a) {
          color: inherit;
          text-decoration: none;
        }

        button,
        input,
        select {
          font: inherit;
        }

        .page-shell {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          padding: 0 28px 48px;
          background:
            radial-gradient(circle at 12% 6%, rgba(37, 190, 152, 0.13), transparent 28%),
            radial-gradient(circle at 84% 18%, rgba(194, 151, 67, 0.11), transparent 24%),
            linear-gradient(180deg, #061513 0%, #03100f 48%, #020b0b 100%);
          isolation: isolate;
        }

        .stars {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: -1;
          opacity: 0.38;
          background-image:
            radial-gradient(circle, rgba(255, 255, 255, 0.75) 1px, transparent 1px),
            radial-gradient(circle, rgba(120, 255, 219, 0.48) 1px, transparent 1px);
          background-size: 86px 86px, 137px 137px;
          background-position: 0 0, 21px 39px;
        }

        .stars-two {
          opacity: 0.16;
          transform: scale(1.2);
        }

        .topbar {
          width: min(1500px, 100%);
          margin: 0 auto;
          min-height: 82px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          border-bottom: 1px solid rgba(153, 213, 196, 0.15);
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }

        .brand-mark {
          display: grid;
          place-items: center;
          width: 48px;
          height: 48px;
          border-radius: 16px;
          border: 1px solid rgba(213, 181, 102, 0.65);
          color: #f2d694;
          background: linear-gradient(
            145deg,
            rgba(211, 170, 75, 0.18),
            rgba(18, 52, 45, 0.92)
          );
          font-weight: 900;
          font-size: 13px;
        }

        .brand > span:last-child {
          display: grid;
          gap: 3px;
        }

        .brand strong {
          font-size: 14px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .brand small {
          color: #8eaaa2;
        }

        nav {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        nav a {
          padding: 10px 12px;
          border-radius: 999px;
          color: #91aaa3;
          font-size: 13px;
          transition: 160ms ease;
        }

        nav a:hover,
        nav a:focus-visible,
        nav a.active {
          color: #f7fffc;
          background: rgba(34, 128, 105, 0.18);
          outline: none;
        }

        .hero {
          width: min(1500px, 100%);
          margin: 0 auto;
          padding: 78px 0 34px;
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(290px, 0.6fr);
          gap: 36px;
          align-items: end;
        }

        .eyebrow {
          margin: 0 0 10px;
          color: #73d9bd;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.16em;
        }

        h1 {
          max-width: 940px;
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(42px, 6vw, 82px);
          line-height: 0.98;
          letter-spacing: -0.045em;
        }

        .hero-copy {
          max-width: 840px;
          margin: 24px 0 0;
          color: #a8beb8;
          font-size: 18px;
          line-height: 1.75;
        }

        .state-card,
        .panel,
        .next-panel,
        .summary-card {
          border: 1px solid rgba(135, 191, 176, 0.16);
          background: linear-gradient(
            180deg,
            rgba(10, 33, 29, 0.92),
            rgba(5, 20, 18, 0.92)
          );
          box-shadow: 0 18px 70px rgba(0, 0, 0, 0.22);
          backdrop-filter: blur(16px);
        }

        .state-card {
          padding: 24px;
          border-radius: 24px;
        }

        .state-card span {
          display: block;
          color: #809b94;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .state-card strong {
          display: block;
          margin: 8px 0;
          font-size: 30px;
        }

        .state-card p {
          margin: 0;
          color: #b4c8c2;
          line-height: 1.6;
        }

        .state-preserved {
          border-color: rgba(82, 223, 164, 0.45);
        }

        .state-limited {
          border-color: rgba(230, 189, 93, 0.45);
        }

        .state-hold {
          border-color: rgba(240, 167, 75, 0.48);
        }

        .state-compromised {
          border-color: rgba(241, 102, 102, 0.52);
        }

        .canon-strip {
          width: min(1500px, 100%);
          margin: 0 auto 24px;
          display: flex;
          gap: 12px;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          padding: 14px 20px;
          border-radius: 18px;
          border: 1px solid rgba(116, 186, 166, 0.14);
          background: rgba(4, 18, 16, 0.72);
          color: #738e87;
          font-size: 13px;
        }

        .canon-strip strong {
          color: #e8c976;
        }

        .canon-strip b {
          color: #43665d;
        }

        .summary-grid {
          width: min(1500px, 100%);
          margin: 0 auto 24px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .summary-card {
          padding: 18px;
          border-radius: 18px;
        }

        .summary-card span,
        .summary-card small {
          display: block;
          color: #78938b;
        }

        .summary-card span {
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .summary-card strong {
          display: block;
          margin: 7px 0;
          font-size: 28px;
        }

        .workspace-grid {
          width: min(1500px, 100%);
          margin: 0 auto 24px;
          display: grid;
          grid-template-columns: minmax(0, 1.45fr) minmax(340px, 0.55fr);
          gap: 24px;
        }

        .panel {
          border-radius: 24px;
          padding: 28px;
        }

        .panel-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 24px;
        }

        h2,
        h3,
        p {
          margin-top: 0;
        }

        h2 {
          margin-bottom: 0;
          font-size: 28px;
        }

        button,
        .detail-actions a,
        .next-actions a {
          border: 1px solid rgba(134, 186, 172, 0.18);
          border-radius: 12px;
          padding: 11px 14px;
          color: #dbeae6;
          background: rgba(7, 27, 24, 0.9);
          cursor: pointer;
          transition: 160ms ease;
        }

        button:hover,
        button:focus-visible,
        .detail-actions a:hover,
        .detail-actions a:focus-visible,
        .next-actions a:hover,
        .next-actions a:focus-visible {
          border-color: rgba(105, 221, 190, 0.5);
          transform: translateY(-1px);
          outline: none;
        }

        button.primary {
          color: #042019;
          background: linear-gradient(135deg, #7ce5c6, #d9bd6a);
          border-color: transparent;
          font-weight: 800;
        }

        .toolbar {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 190px;
          gap: 12px;
          margin-bottom: 18px;
        }

        input,
        select {
          width: 100%;
          min-width: 0;
          border: 1px solid rgba(133, 184, 170, 0.16);
          border-radius: 13px;
          padding: 12px 13px;
          color: #f4fffc;
          background: rgba(3, 16, 14, 0.82);
          outline: none;
        }

        input:focus,
        select:focus {
          border-color: rgba(100, 226, 192, 0.58);
          box-shadow: 0 0 0 3px rgba(55, 185, 149, 0.1);
        }

        .record-list {
          display: grid;
          gap: 10px;
        }

        .record-row {
          width: 100%;
          display: grid;
          grid-template-columns: minmax(260px, 1.35fr) minmax(160px, 0.8fr) minmax(140px, 0.7fr) 110px;
          gap: 16px;
          align-items: center;
          padding: 16px;
          text-align: left;
          background: rgba(3, 16, 14, 0.62);
        }

        .record-row.selected {
          border-color: rgba(112, 227, 197, 0.55);
          background: rgba(21, 67, 56, 0.5);
        }

        .record-identity,
        .record-row > div {
          display: grid;
          gap: 5px;
        }

        .record-identity span,
        .label {
          color: #718b84;
          font-size: 11px;
        }

        .mono {
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 12px;
        }

        .status {
          display: inline-flex;
          justify-content: center;
          padding: 8px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.06em;
        }

        .status-preserved {
          color: #8ae0c5;
          background: rgba(74, 188, 151, 0.12);
          border: 1px solid rgba(74, 188, 151, 0.22);
        }

        .status-limited {
          color: #f0c96f;
          background: rgba(215, 166, 56, 0.12);
          border: 1px solid rgba(215, 166, 56, 0.24);
        }

        .status-hold {
          color: #f2ad67;
          background: rgba(226, 132, 49, 0.12);
          border: 1px solid rgba(226, 132, 49, 0.24);
        }

        .status-compromised {
          color: #f28f8f;
          background: rgba(221, 76, 76, 0.12);
          border: 1px solid rgba(221, 76, 76, 0.24);
        }

        .detail-panel h3 {
          margin-bottom: 10px;
        }

        .detail-copy {
          color: #9fb5af;
          line-height: 1.7;
        }

        dl {
          margin: 22px 0 0;
          display: grid;
          gap: 12px;
        }

        dl > div {
          display: grid;
          grid-template-columns: 120px minmax(0, 1fr);
          gap: 16px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(132, 181, 168, 0.1);
        }

        dt {
          color: #6f8c84;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        dd {
          margin: 0;
          color: #c0d0cc;
          line-height: 1.5;
        }

        .detail-actions {
          display: grid;
          gap: 10px;
          margin-top: 22px;
        }

        .detail-actions a {
          text-align: center;
        }

        .boundary-panel {
          width: min(1500px, 100%);
          margin: 0 auto 24px;
        }

        .boundary-columns {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-top: 22px;
        }

        .boundary-columns article {
          padding: 18px;
          border-radius: 16px;
          background: rgba(3, 15, 13, 0.62);
          border: 1px solid rgba(131, 185, 171, 0.12);
        }

        .boundary-columns p {
          color: #9fb4ae;
          line-height: 1.7;
          margin-bottom: 0;
        }

        .empty-state {
          padding: 26px;
          border-radius: 16px;
          border: 1px dashed rgba(137, 187, 173, 0.2);
          color: #8ea59f;
          text-align: center;
        }

        .next-panel {
          width: min(1500px, 100%);
          margin: 0 auto;
          border-radius: 26px;
          padding: 28px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(360px, 0.8fr);
          gap: 30px;
          align-items: center;
        }

        .next-panel p {
          color: #a7bbb5;
          line-height: 1.7;
          margin-bottom: 0;
        }

        .next-actions {
          display: grid;
          gap: 12px;
        }

        .next-actions a {
          display: grid;
          gap: 6px;
          padding: 16px 18px;
        }

        .next-actions span {
          color: #809991;
          font-size: 12px;
        }

        .next-actions strong {
          color: #edf8f4;
        }

        footer {
          width: min(1500px, 100%);
          margin: 34px auto 0;
          padding: 22px 0 0;
          display: flex;
          gap: 16px;
          justify-content: space-between;
          color: #6f8881;
          border-top: 1px solid rgba(136, 184, 171, 0.12);
          font-size: 12px;
        }

        footer strong {
          color: #c9aa59;
        }

        @media (max-width: 1120px) {
          .hero,
          .workspace-grid,
          .next-panel {
            grid-template-columns: 1fr;
          }

          .summary-grid,
          .boundary-columns {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          nav {
            display: none;
          }
        }

        @media (max-width: 760px) {
          .page-shell {
            padding-inline: 16px;
          }

          .hero {
            padding-top: 54px;
          }

          .panel {
            padding: 21px;
          }

          .panel-heading {
            display: grid;
          }

          .summary-grid,
          .boundary-columns,
          .toolbar {
            grid-template-columns: 1fr;
          }

          .record-list {
            overflow-x: auto;
          }

          .record-row {
            min-width: 860px;
          }

          footer {
            display: grid;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            transition: none !important;
          }

          .stars {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}
