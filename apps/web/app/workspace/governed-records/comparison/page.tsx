"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ComparisonState =
  | "MATCHED"
  | "CHANGED"
  | "LIMITED"
  | "HOLD"
  | "CONFLICT";

type RecordField = {
  key: string;
  label: string;
  category: "Identity" | "Boundary" | "Evidence" | "Outcome";
  left: string;
  right: string;
  weight: "critical" | "material" | "context";
};

type Difference = {
  code: string;
  title: string;
  category: string;
  leftValue: string;
  rightValue: string;
  consequence: string;
  severity: "info" | "limited" | "hold" | "conflict";
};

const initialFields: RecordField[] = [
  {
    key: "record_class",
    label: "Record class",
    category: "Identity",
    left: "Atmospheric Integrity Record",
    right: "Atmospheric Integrity Record",
    weight: "critical",
  },
  {
    key: "subject",
    label: "Governed subject",
    category: "Identity",
    left: "Building 04 — East Wing",
    right: "Building 04 — East Wing",
    weight: "critical",
  },
  {
    key: "period",
    label: "Record period",
    category: "Boundary",
    left: "2026-07-20 08:00–14:00",
    right: "2026-07-21 08:00–14:00",
    weight: "material",
  },
  {
    key: "source",
    label: "Declared source",
    category: "Boundary",
    left: "AIR-HUB-04",
    right: "AIR-HUB-04",
    weight: "critical",
  },
  {
    key: "authority",
    label: "Source authority",
    category: "Boundary",
    left: "Facilities Operations",
    right: "Facilities Operations",
    weight: "critical",
  },
  {
    key: "continuity",
    label: "Continuity standing",
    category: "Evidence",
    left: "CONTINUOUS",
    right: "LIMITED",
    weight: "critical",
  },
  {
    key: "evidence_count",
    label: "Evidence intervals",
    category: "Evidence",
    left: "3",
    right: "3",
    weight: "context",
  },
  {
    key: "exception",
    label: "Declared exception",
    category: "Evidence",
    left: "None",
    right: "20-minute source outage",
    weight: "material",
  },
  {
    key: "outcome",
    label: "Governed outcome",
    category: "Outcome",
    left: "No material continuity break detected",
    right: "Continuity bounded to captured intervals",
    weight: "material",
  },
];

function normalize(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function compareFields(fields: RecordField[]): {
  state: ComparisonState;
  differences: Difference[];
  matched: number;
  changed: number;
} {
  const differences: Difference[] = [];
  let matched = 0;
  let changed = 0;

  for (const field of fields) {
    const left = normalize(field.left);
    const right = normalize(field.right);

    if (!left || !right) {
      differences.push({
        code: "RC-HOLD-001",
        title: `${field.label} is unresolved`,
        category: field.category,
        leftValue: field.left || "Not supplied",
        rightValue: field.right || "Not supplied",
        consequence:
          "The comparison cannot establish whether this field changed because one or both values are missing.",
        severity: "hold",
      });
      changed += 1;
      continue;
    }

    if (left === right) {
      matched += 1;
      continue;
    }

    changed += 1;

    if (field.weight === "critical") {
      differences.push({
        code: "RC-CONFLICT-001",
        title: `${field.label} conflicts`,
        category: field.category,
        leftValue: field.left,
        rightValue: field.right,
        consequence:
          "A critical identity, source, authority, or continuity field changed. The two records cannot be treated as equivalent without an independently preserved explanation.",
        severity: "conflict",
      });
      continue;
    }

    if (field.weight === "material") {
      differences.push({
        code: "RC-LIMITED-001",
        title: `${field.label} materially changed`,
        category: field.category,
        leftValue: field.left,
        rightValue: field.right,
        consequence:
          "The comparison supports a changed-state finding, but not a cause, diagnosis, or claim that the later condition is better or worse.",
        severity: "limited",
      });
      continue;
    }

    differences.push({
      code: "RC-INFO-001",
      title: `${field.label} changed`,
      category: field.category,
      leftValue: field.left,
      rightValue: field.right,
      consequence:
        "The field differs and should remain visible in the comparison record, but it does not independently defeat comparability.",
      severity: "info",
    });
  }

  if (differences.some((difference) => difference.severity === "conflict")) {
    return { state: "CONFLICT", differences, matched, changed };
  }

  if (differences.some((difference) => difference.severity === "hold")) {
    return { state: "HOLD", differences, matched, changed };
  }

  if (differences.some((difference) => difference.severity === "limited")) {
    return { state: "LIMITED", differences, matched, changed };
  }

  if (changed > 0) {
    return { state: "CHANGED", differences, matched, changed };
  }

  return {
    state: "MATCHED",
    matched,
    changed,
    differences: [
      {
        code: "RC-MATCH-001",
        title: "No declared field difference detected",
        category: "Comparison boundary",
        leftValue: "Equivalent within submitted fields",
        rightValue: "Equivalent within submitted fields",
        consequence:
          "The records match within the declared comparison fields. This does not prove the underlying reality was unchanged.",
        severity: "info",
      },
    ],
  };
}

const stateCopy: Record<
  ComparisonState,
  { title: string; text: string; next: string }
> = {
  MATCHED: {
    title: "The submitted fields match",
    text: "No difference was detected within the declared comparison boundary.",
    next: "The records may advance to verification if identity, continuity, and authority remain separately sufficient.",
  },
  CHANGED: {
    title: "A change was detected",
    text: "At least one declared field changed without defeating comparability.",
    next: "Preserve the change as its own comparison artifact. Do not convert difference into diagnosis.",
  },
  LIMITED: {
    title: "The comparison is bounded",
    text: "Material differences remain visible, but the records are still comparable within a restricted boundary.",
    next: "Limit downstream use to the fields and periods that remain comparable.",
  },
  HOLD: {
    title: "Required comparison evidence is missing",
    text: "One or more values required to establish a bounded comparison were not supplied.",
    next: "Supply or formally except the missing field before advancing.",
  },
  CONFLICT: {
    title: "The records conflict",
    text: "A critical identity, source, authority, or continuity field changed.",
    next: "Treat the records as non-equivalent unless the transition is independently preserved and reviewed.",
  },
};

function stateClass(state: ComparisonState): string {
  return `state-${state.toLowerCase()}`;
}

export default function RecordComparisonPage() {
  const [leftName, setLeftName] = useState("Baseline Record");
  const [rightName, setRightName] = useState("Later Record");
  const [leftId, setLeftId] = useState("AIR-2026-0720-04");
  const [rightId, setRightId] = useState("AIR-2026-0721-04");
  const [purpose, setPurpose] = useState(
    "Compare two preserved records without collapsing difference into diagnosis.",
  );
  const [fields, setFields] = useState<RecordField[]>(initialFields);
  const [hasRun, setHasRun] = useState(true);

  const result = useMemo(() => compareFields(fields), [fields]);

  const updateField = (
    key: string,
    side: "left" | "right" | "weight",
    value: string,
  ) => {
    setFields((current) =>
      current.map((field) =>
        field.key === key
          ? {
              ...field,
              [side]:
                side === "weight"
                  ? (value as RecordField["weight"])
                  : value,
            }
          : field,
      ),
    );
    setHasRun(false);
  };

  const addField = () => {
    const index = fields.length + 1;
    setFields((current) => [
      ...current,
      {
        key: `custom_${Date.now()}`,
        label: `Custom field ${index}`,
        category: "Evidence",
        left: "",
        right: "",
        weight: "context",
      },
    ]);
    setHasRun(false);
  };

  const loadMatchedSample = () => {
    setLeftName("Baseline Record");
    setRightName("Replay Record");
    setLeftId("AER-ROUTE-104");
    setRightId("AER-ROUTE-104-R1");
    setPurpose(
      "Determine whether a replay preserved the same declared route fields.",
    );
    setFields(
      initialFields.map((field) => ({
        ...field,
        right: field.left,
      })),
    );
    setHasRun(true);
  };

  const loadConflictSample = () => {
    setLeftName("Original Record");
    setRightName("Submitted Replacement");
    setLeftId("AIR-2026-0720-04");
    setRightId("AIR-2026-0721-04");
    setPurpose(
      "Determine whether a later record can be treated as equivalent to the original record.",
    );
    setFields([
      ...initialFields.map((field) => ({ ...field })),
      {
        key: "critical_authority_change",
        label: "Execution authority",
        category: "Boundary",
        left: "Facilities Operations",
        right: "External Vendor",
        weight: "critical",
      },
    ]);
    setHasRun(true);
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
            <small>Record Comparison</small>
          </span>
        </Link>

        <nav aria-label="Governed Records">
          <Link href="/workspace/governed-records/my-records">My Records</Link>
          <Link href="/workspace/governed-records/continuity-review">
            Continuity Review
          </Link>
          <Link
            className="active"
            href="/workspace/governed-records/comparison"
          >
            Record Comparison
          </Link>
          <Link href="/workspace/governed-records/preserved-records">
            Preserved Records
          </Link>
          <Link href="/workspace/governed-records/verification">
            Verification
          </Link>
        </nav>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">RECORD A ↔ RECORD B</p>
          <h1>Compare records without rewriting either one.</h1>
          <p className="hero-copy">
            Expose what matches, what changed, what conflicts, and what remains
            unresolved while keeping the original records, continuity reviews,
            interpretations, diagnoses, and optimizations separate.
          </p>
        </div>

        <div className={`state-card ${stateClass(result.state)}`}>
          <span>Current comparison</span>
          <strong>{hasRun ? result.state : "NOT RUN"}</strong>
          <p>
            {hasRun
              ? stateCopy[result.state].text
              : "The submitted fields changed. Run the comparison to refresh the artifact."}
          </p>
        </div>
      </section>

      <section className="canon-strip">
        <span>Reality</span>
        <b>→</b>
        <span>Record</span>
        <b>→</b>
        <span>Continuity</span>
        <b>→</b>
        <strong>Comparison</strong>
        <b>→</b>
        <span>Verification</span>
        <b>→</b>
        <span>Binding</span>
        <b>→</b>
        <span>Execution</span>
        <b>→</b>
        <span>Outcome</span>
      </section>

      <section className="record-header-grid">
        <article className="panel record-card">
          <p className="eyebrow">LEFT RECORD</p>
          <label>
            <span>Record label</span>
            <input
              value={leftName}
              onChange={(event) => {
                setLeftName(event.target.value);
                setHasRun(false);
              }}
            />
          </label>
          <label>
            <span>Record identity</span>
            <input
              value={leftId}
              onChange={(event) => {
                setLeftId(event.target.value);
                setHasRun(false);
              }}
            />
          </label>
        </article>

        <article className="panel comparison-purpose">
          <p className="eyebrow">DECLARED PURPOSE</p>
          <h2>What question is this comparison allowed to answer?</h2>
          <textarea
            value={purpose}
            onChange={(event) => {
              setPurpose(event.target.value);
              setHasRun(false);
            }}
          />
          <div className="purpose-boundary">
            <span>Can establish</span>
            <strong>Declared difference or equivalence</strong>
            <span>Cannot establish</span>
            <strong>Cause, diagnosis, safety, or optimization</strong>
          </div>
        </article>

        <article className="panel record-card">
          <p className="eyebrow">RIGHT RECORD</p>
          <label>
            <span>Record label</span>
            <input
              value={rightName}
              onChange={(event) => {
                setRightName(event.target.value);
                setHasRun(false);
              }}
            />
          </label>
          <label>
            <span>Record identity</span>
            <input
              value={rightId}
              onChange={(event) => {
                setRightId(event.target.value);
                setHasRun(false);
              }}
            />
          </label>
        </article>
      </section>

      <section className="panel comparison-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">DECLARED COMPARISON FIELDS</p>
            <h2>Record-to-record field comparison</h2>
          </div>

          <div className="button-row">
            <button type="button" onClick={loadMatchedSample}>
              Load matched sample
            </button>
            <button type="button" onClick={loadConflictSample}>
              Load conflict sample
            </button>
            <button
              className="primary"
              type="button"
              onClick={() => setHasRun(true)}
            >
              Run comparison
            </button>
          </div>
        </div>

        <div className="summary-strip">
          <div>
            <span>Matched</span>
            <strong>{hasRun ? result.matched : "—"}</strong>
          </div>
          <div>
            <span>Changed</span>
            <strong>{hasRun ? result.changed : "—"}</strong>
          </div>
          <div>
            <span>Total fields</span>
            <strong>{fields.length}</strong>
          </div>
          <div>
            <span>Determination</span>
            <strong>{hasRun ? result.state : "NOT RUN"}</strong>
          </div>
        </div>

        <div className="comparison-table">
          <div className="comparison-head">
            <span>Field</span>
            <span>{leftName || "Left record"}</span>
            <span>{rightName || "Right record"}</span>
            <span>Weight</span>
            <span>Result</span>
            <span />
          </div>

          {fields.map((field) => {
            const equal = normalize(field.left) === normalize(field.right);

            return (
              <div className="comparison-row" key={field.key}>
                <div className="field-label">
                  <strong>{field.label}</strong>
                  <span>{field.category}</span>
                </div>

                <input
                  aria-label={`${field.label} left value`}
                  value={field.left}
                  onChange={(event) =>
                    updateField(field.key, "left", event.target.value)
                  }
                />

                <input
                  aria-label={`${field.label} right value`}
                  value={field.right}
                  onChange={(event) =>
                    updateField(field.key, "right", event.target.value)
                  }
                />

                <select
                  aria-label={`${field.label} comparison weight`}
                  value={field.weight}
                  onChange={(event) =>
                    updateField(field.key, "weight", event.target.value)
                  }
                >
                  <option value="critical">Critical</option>
                  <option value="material">Material</option>
                  <option value="context">Context</option>
                </select>

                <span
                  className={`field-result ${
                    equal ? "field-match" : "field-change"
                  }`}
                >
                  {equal ? "MATCH" : "CHANGE"}
                </span>

                <button
                  className="icon-button"
                  type="button"
                  aria-label={`Remove ${field.label}`}
                  onClick={() => {
                    setFields((current) =>
                      current.filter((item) => item.key !== field.key),
                    );
                    setHasRun(false);
                  }}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>

        <button className="add-button" type="button" onClick={addField}>
          + Add comparison field
        </button>
      </section>

      <section className="result-grid">
        <article className={`panel determination ${stateClass(result.state)}`}>
          <div className="panel-heading">
            <div>
              <p className="eyebrow">COMPARISON DETERMINATION</p>
              <h2>{hasRun ? result.state : "NOT RUN"}</h2>
            </div>
            <span className="determination-chip">
              {hasRun ? result.differences.length : 0} finding
              {hasRun && result.differences.length === 1 ? "" : "s"}
            </span>
          </div>

          <h3>
            {hasRun
              ? stateCopy[result.state].title
              : "The submitted records changed"}
          </h3>
          <p>
            {hasRun
              ? stateCopy[result.state].next
              : "Run the comparison to generate a fresh bounded determination."}
          </p>
        </article>

        <article className="panel proof-panel">
          <p className="eyebrow">BOUNDARY OF PROOF</p>
          <div>
            <h3>What this comparison can prove</h3>
            <p>
              Whether the submitted fields match, differ, conflict, or remain
              unresolved within the declared comparison purpose.
            </p>
          </div>
          <div>
            <h3>What this comparison does not prove</h3>
            <p>
              Why the change occurred, whether the later record is better,
              safer, healthier, compliant, causal, diagnostic, or optimized.
            </p>
          </div>
        </article>
      </section>

      <section className="panel findings-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">PRESERVED DIFFERENCE RECORD</p>
            <h2>Why the records received this determination</h2>
          </div>
        </div>

        <div className="findings-list">
          {(hasRun ? result.differences : []).map((difference, index) => (
            <article
              className={`finding finding-${difference.severity}`}
              key={`${difference.code}-${difference.title}-${index}`}
            >
              <div className="finding-code">{difference.code}</div>
              <div>
                <h3>{difference.title}</h3>
                <div className="difference-values">
                  <div>
                    <span>{leftName || "Left record"}</span>
                    <strong>{difference.leftValue}</strong>
                  </div>
                  <div>
                    <span>{rightName || "Right record"}</span>
                    <strong>{difference.rightValue}</strong>
                  </div>
                </div>
                <dl>
                  <div>
                    <dt>Category</dt>
                    <dd>{difference.category}</dd>
                  </div>
                  <div>
                    <dt>Bounded consequence</dt>
                    <dd>{difference.consequence}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}

          {!hasRun ? (
            <div className="empty-state">
              The comparison changed. Run it again to generate a fresh
              difference artifact.
            </div>
          ) : null}
        </div>
      </section>

      <section className="next-panel">
        <div>
          <p className="eyebrow">NEXT ADMISSIBLE STEP</p>
          <h2>Preserve the comparison before verification.</h2>
          <p>
            The comparison does not replace either source record. Verification
            remains a separate review of identity, authority, integrity, and
            standing.
          </p>
        </div>

        <div className="next-actions">
          <Link href="/workspace/governed-records/preserved-records">
            <span>Store the source records and comparison artifact</span>
            <strong>Open Preserved Records →</strong>
          </Link>
          <Link href="/workspace/governed-records/verification">
            <span>Inspect evidence and authority standing</span>
            <strong>Open Verification →</strong>
          </Link>
        </div>
      </section>

      <footer>
        <strong>No admissible evidence. No admissible execution.</strong>
        <span>
          Difference is not diagnosis. Equivalence is not admissibility.
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
        select,
        textarea {
          font: inherit;
        }

        .page-shell {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          padding: 0 28px 48px;
          background:
            radial-gradient(circle at 14% 6%, rgba(37, 190, 152, 0.13), transparent 28%),
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
          max-width: 920px;
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
        .next-panel {
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

        .state-matched {
          border-color: rgba(82, 223, 164, 0.45);
        }

        .state-changed {
          border-color: rgba(122, 197, 236, 0.45);
        }

        .state-limited {
          border-color: rgba(230, 189, 93, 0.45);
        }

        .state-hold {
          border-color: rgba(240, 167, 75, 0.48);
        }

        .state-conflict {
          border-color: rgba(241, 102, 102, 0.52);
        }

        .canon-strip {
          width: min(1500px, 100%);
          margin: 0 auto 28px;
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

        .record-header-grid {
          width: min(1500px, 100%);
          margin: 0 auto 24px;
          display: grid;
          grid-template-columns: minmax(240px, 0.7fr) minmax(360px, 1.2fr) minmax(240px, 0.7fr);
          gap: 24px;
        }

        .panel {
          border-radius: 24px;
          padding: 28px;
        }

        .record-card {
          display: grid;
          gap: 16px;
          align-content: start;
        }

        label {
          display: grid;
          gap: 8px;
        }

        label span {
          color: #9bb1ab;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        input,
        select,
        textarea {
          width: 100%;
          min-width: 0;
          border: 1px solid rgba(133, 184, 170, 0.16);
          border-radius: 13px;
          padding: 12px 13px;
          color: #f4fffc;
          background: rgba(3, 16, 14, 0.82);
          outline: none;
        }

        textarea {
          min-height: 120px;
          resize: vertical;
          line-height: 1.6;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: rgba(100, 226, 192, 0.58);
          box-shadow: 0 0 0 3px rgba(55, 185, 149, 0.1);
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

        .comparison-purpose {
          display: grid;
          gap: 16px;
        }

        .purpose-boundary {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 10px 18px;
          padding-top: 16px;
          border-top: 1px solid rgba(134, 183, 170, 0.12);
        }

        .purpose-boundary span {
          color: #768f88;
        }

        .purpose-boundary strong {
          color: #dcebe7;
          text-align: right;
        }

        .comparison-panel,
        .findings-panel {
          width: min(1500px, 100%);
          margin: 0 auto 24px;
        }

        .panel-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 24px;
        }

        .button-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        button,
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

        .summary-strip {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 22px;
        }

        .summary-strip div {
          padding: 16px;
          border-radius: 16px;
          border: 1px solid rgba(132, 183, 169, 0.12);
          background: rgba(3, 16, 14, 0.6);
        }

        .summary-strip span {
          display: block;
          color: #718b84;
          font-size: 11px;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .summary-strip strong {
          display: block;
          margin-top: 7px;
          font-size: 23px;
        }

        .comparison-table {
          overflow-x: auto;
        }

        .comparison-head,
        .comparison-row {
          display: grid;
          grid-template-columns:
            minmax(170px, 0.85fr) minmax(240px, 1.2fr)
            minmax(240px, 1.2fr) 130px 105px 44px;
          gap: 10px;
          align-items: center;
          min-width: 1080px;
        }

        .comparison-head {
          padding: 0 4px 10px;
          color: #6f8c84;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .comparison-row {
          padding: 12px 0;
          border-top: 1px solid rgba(136, 183, 171, 0.1);
        }

        .field-label {
          display: grid;
          gap: 5px;
        }

        .field-label span {
          color: #718b84;
          font-size: 11px;
        }

        .field-result {
          display: inline-flex;
          justify-content: center;
          padding: 8px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.06em;
        }

        .field-match {
          color: #8ae0c5;
          background: rgba(74, 188, 151, 0.12);
          border: 1px solid rgba(74, 188, 151, 0.22);
        }

        .field-change {
          color: #f0c96f;
          background: rgba(215, 166, 56, 0.12);
          border: 1px solid rgba(215, 166, 56, 0.24);
        }

        .icon-button {
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          padding: 0;
          color: #f29a9a;
          font-size: 22px;
        }

        .add-button {
          margin-top: 18px;
        }

        .result-grid {
          width: min(1500px, 100%);
          margin: 0 auto 24px;
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(300px, 0.65fr);
          gap: 24px;
        }

        .determination h2 {
          font-size: 38px;
          letter-spacing: 0.04em;
        }

        .determination > p,
        .proof-panel p {
          color: #a8bdb7;
          line-height: 1.7;
        }

        .determination-chip {
          padding: 8px 11px;
          border-radius: 999px;
          background: rgba(80, 187, 156, 0.12);
          border: 1px solid rgba(80, 187, 156, 0.22);
          color: #9ce0ce;
          font-size: 12px;
          white-space: nowrap;
        }

        .proof-panel {
          display: grid;
          gap: 16px;
        }

        .proof-panel > div {
          padding: 18px;
          border-radius: 16px;
          background: rgba(3, 15, 13, 0.62);
          border: 1px solid rgba(131, 185, 171, 0.12);
        }

        .proof-panel h3 {
          margin-bottom: 8px;
        }

        .proof-panel p {
          margin-bottom: 0;
        }

        .findings-list {
          display: grid;
          gap: 14px;
        }

        .finding {
          display: grid;
          grid-template-columns: 132px minmax(0, 1fr);
          gap: 20px;
          padding: 20px;
          border-radius: 18px;
          border: 1px solid rgba(133, 184, 170, 0.14);
          background: rgba(3, 16, 14, 0.62);
        }

        .finding-limited {
          border-color: rgba(223, 186, 88, 0.3);
        }

        .finding-hold {
          border-color: rgba(238, 157, 65, 0.34);
        }

        .finding-conflict {
          border-color: rgba(241, 99, 99, 0.38);
        }

        .finding-code {
          align-self: start;
          padding: 8px 10px;
          border-radius: 10px;
          color: #82d9c1;
          background: rgba(76, 180, 151, 0.11);
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 12px;
        }

        .difference-values {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin: 15px 0;
        }

        .difference-values div {
          padding: 14px;
          border-radius: 14px;
          background: rgba(2, 14, 12, 0.65);
          border: 1px solid rgba(130, 181, 167, 0.1);
        }

        .difference-values span {
          display: block;
          color: #708b83;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .difference-values strong {
          display: block;
          margin-top: 8px;
          line-height: 1.5;
        }

        dl {
          margin: 0;
          display: grid;
          gap: 12px;
        }

        dl > div {
          display: grid;
          grid-template-columns: 170px minmax(0, 1fr);
          gap: 18px;
        }

        dt {
          color: #6f8c84;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        dd {
          margin: 0;
          color: #b7c9c4;
          line-height: 1.6;
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
          .record-header-grid,
          .result-grid,
          .next-panel {
            grid-template-columns: 1fr;
          }

          nav {
            display: none;
          }
        }

        @media (max-width: 720px) {
          .page-shell {
            padding-inline: 16px;
          }

          .topbar {
            min-height: 72px;
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

          .button-row {
            justify-content: flex-start;
          }

          .summary-strip {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .finding {
            grid-template-columns: 1fr;
          }

          .difference-values,
          dl > div {
            grid-template-columns: 1fr;
          }

          footer {
            display: grid;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
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
