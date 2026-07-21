"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type VerificationState = "VERIFIED" | "LIMITED" | "HOLD" | "FAILED";

type VerificationCheck = {
  id: string;
  label: string;
  description: string;
  required: boolean;
  status: "PASS" | "LIMITED" | "MISSING" | "FAIL";
  evidence: string;
  authority: string;
};

type Finding = {
  code: string;
  title: string;
  effect: string;
  consequence: string;
  severity: "info" | "limited" | "hold" | "failed";
};

const initialChecks: VerificationCheck[] = [
  {
    id: "identity",
    label: "Record identity",
    description: "Stable identity is present and attributable.",
    required: true,
    status: "PASS",
    evidence: "AIR-2026-0720-04",
    authority: "Record issuer",
  },
  {
    id: "digest",
    label: "Integrity digest",
    description: "A preserved digest is available for the reviewed artifact.",
    required: true,
    status: "PASS",
    evidence: "8c74d9a1f3b2e6c0",
    authority: "Preservation service",
  },
  {
    id: "source",
    label: "Declared source",
    description: "The evidence source is identified and consistent.",
    required: true,
    status: "PASS",
    evidence: "AIR-HUB-04",
    authority: "Facilities Operations",
  },
  {
    id: "authority",
    label: "Reviewer authority",
    description: "The reviewer is current, scoped, and connected to this review.",
    required: true,
    status: "LIMITED",
    evidence: "Reviewer declaration supplied",
    authority: "TA-14 bounded reviewer",
  },
  {
    id: "continuity",
    label: "Continuity standing",
    description: "The evidence route remains connected through the declared period.",
    required: true,
    status: "PASS",
    evidence: "Continuity Review CR-2026-0720-04",
    authority: "Continuity review layer",
  },
  {
    id: "boundary",
    label: "Boundary of proof",
    description: "What the record proves and does not prove is explicit.",
    required: true,
    status: "PASS",
    evidence: "Proof boundary attached",
    authority: "Record owner",
  },
  {
    id: "exception",
    label: "Exception handling",
    description: "Known exceptions are declared and preserved.",
    required: false,
    status: "MISSING",
    evidence: "",
    authority: "",
  },
];

function deriveState(checks: VerificationCheck[]): {
  state: VerificationState;
  findings: Finding[];
} {
  const findings: Finding[] = [];

  for (const check of checks) {
    if (check.status === "FAIL") {
      findings.push({
        code: "VR-FAIL-001",
        title: `${check.label} failed`,
        effect: check.description,
        consequence:
          "The record cannot support a verified standing until the failed condition is corrected and re-reviewed.",
        severity: "failed",
      });
      continue;
    }

    if (check.status === "MISSING" && check.required) {
      findings.push({
        code: "VR-HOLD-001",
        title: `${check.label} is missing`,
        effect: check.description,
        consequence:
          "Verification remains on HOLD because a required condition is unresolved.",
        severity: "hold",
      });
      continue;
    }

    if (check.status === "LIMITED") {
      findings.push({
        code: "VR-LIMITED-001",
        title: `${check.label} is limited`,
        effect: check.description,
        consequence:
          "Verification may proceed only within the declared limitation.",
        severity: "limited",
      });
      continue;
    }

    if (check.status === "MISSING" && !check.required) {
      findings.push({
        code: "VR-INFO-001",
        title: `${check.label} was not supplied`,
        effect: check.description,
        consequence:
          "This optional condition is absent and remains visible without independently blocking verification.",
        severity: "info",
      });
    }
  }

  if (findings.some((finding) => finding.severity === "failed")) {
    return { state: "FAILED", findings };
  }

  if (findings.some((finding) => finding.severity === "hold")) {
    return { state: "HOLD", findings };
  }

  if (findings.some((finding) => finding.severity === "limited")) {
    return { state: "LIMITED", findings };
  }

  return {
    state: "VERIFIED",
    findings:
      findings.length > 0
        ? findings
        : [
            {
              code: "VR-PASS-001",
              title: "All required verification conditions passed",
              effect:
                "Identity, integrity, source, authority, continuity, and proof boundary are present within the declared review scope.",
              consequence:
                "The record may advance to the next governed layer without implying correctness, safety, or acceptable outcome.",
              severity: "info",
            },
          ],
  };
}

const stateCopy: Record<
  VerificationState,
  { title: string; text: string; next: string }
> = {
  VERIFIED: {
    title: "Verification standing retained",
    text: "All required verification conditions passed within the declared scope.",
    next: "The record may advance to the next governed layer without upgrading what it proves.",
  },
  LIMITED: {
    title: "Verification is bounded",
    text: "At least one required condition remains limited.",
    next: "Restrict downstream use to the verified scope that remains.",
  },
  HOLD: {
    title: "Verification is on HOLD",
    text: "A required condition is unresolved or missing.",
    next: "Supply the missing evidence or formally preserve the exception before advancing.",
  },
  FAILED: {
    title: "Verification failed",
    text: "A material verification condition failed.",
    next: "Preserve the failure, correct the underlying condition, and run a new verification.",
  },
};

export default function VerificationPage() {
  const [recordId, setRecordId] = useState("AIR-2026-0720-04");
  const [recordClass, setRecordClass] = useState(
    "Atmospheric Integrity Record",
  );
  const [reviewPurpose, setReviewPurpose] = useState(
    "Verify identity, integrity, source, authority, continuity, and proof boundary.",
  );
  const [checks, setChecks] = useState(initialChecks);
  const [hasRun, setHasRun] = useState(true);

  const result = useMemo(() => deriveState(checks), [checks]);

  const updateCheck = (
    id: string,
    patch: Partial<VerificationCheck>,
  ) => {
    setChecks((current) =>
      current.map((check) =>
        check.id === id ? { ...check, ...patch } : check,
      ),
    );
    setHasRun(false);
  };

  const loadVerifiedSample = () => {
    setChecks(
      initialChecks.map((check) => ({
        ...check,
        status: check.required ? "PASS" : "MISSING",
      })),
    );
    setHasRun(true);
  };

  const loadFailedSample = () => {
    setChecks(
      initialChecks.map((check) =>
        check.id === "digest"
          ? { ...check, status: "FAIL", evidence: "Digest mismatch detected" }
          : check,
      ),
    );
    setHasRun(true);
  };

  return (
    <main className="page-shell">
      <div className="stars" />

      <header className="topbar">
        <Link className="brand" href="/workspace/governed-records">
          <span className="brand-mark">TA-14</span>
          <span>
            <strong>Governed Records</strong>
            <small>Verification</small>
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
          <Link href="/workspace/governed-records/preserved-records">
            Preserved Records
          </Link>
          <Link
            className="active"
            href="/workspace/governed-records/verification"
          >
            Verification
          </Link>
        </nav>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">PRESERVATION → VERIFICATION</p>
          <h1>Verify standing without pretending verification proves outcome.</h1>
          <p className="hero-copy">
            Test identity, integrity, source, authority, continuity, and proof
            boundaries while keeping verification separate from diagnosis,
            approval, execution, and result.
          </p>
        </div>

        <div className={`state-card state-${result.state.toLowerCase()}`}>
          <span>Current verification</span>
          <strong>{hasRun ? result.state : "NOT RUN"}</strong>
          <p>
            {hasRun
              ? stateCopy[result.state].text
              : "The verification inputs changed. Run the review again."}
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
        <span>Admissibility</span>
        <b>→</b>
        <strong>Verification</strong>
        <b>→</b>
        <span>Binding</span>
        <b>→</b>
        <span>Execution</span>
        <b>→</b>
        <span>Outcome</span>
      </section>

      <section className="workspace-grid">
        <article className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">VERIFICATION SUBJECT</p>
              <h2>Record and review boundary</h2>
            </div>
          </div>

          <div className="field-grid">
            <label>
              <span>Record identity</span>
              <input
                value={recordId}
                onChange={(event) => {
                  setRecordId(event.target.value);
                  setHasRun(false);
                }}
              />
            </label>

            <label>
              <span>Record class</span>
              <input
                value={recordClass}
                onChange={(event) => {
                  setRecordClass(event.target.value);
                  setHasRun(false);
                }}
              />
            </label>

            <label className="wide">
              <span>Declared verification purpose</span>
              <textarea
                value={reviewPurpose}
                onChange={(event) => {
                  setReviewPurpose(event.target.value);
                  setHasRun(false);
                }}
              />
            </label>
          </div>
        </article>

        <aside className="panel boundary-panel">
          <p className="eyebrow">BOUNDARY OF VERIFICATION</p>
          <h2>Verification does not equal truth.</h2>
          <p>
            Verification establishes whether declared conditions are present
            and internally consistent within the reviewed scope. It does not
            prove that the underlying reality was safe, correct, lawful,
            complete, causal, or acceptable.
          </p>
          <div className="boundary-list">
            <span>Identity</span>
            <strong>Can be verified</strong>
            <span>Integrity</span>
            <strong>Can be verified</strong>
            <span>Diagnosis</span>
            <strong>Not performed</strong>
            <span>Outcome acceptance</span>
            <strong>Not implied</strong>
          </div>
        </aside>
      </section>

      <section className="panel checks-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">DECLARED VERIFICATION CONDITIONS</p>
            <h2>Verification checklist</h2>
          </div>

          <div className="button-row">
            <button type="button" onClick={loadVerifiedSample}>
              Load verified sample
            </button>
            <button type="button" onClick={loadFailedSample}>
              Load failed sample
            </button>
            <button
              className="primary"
              type="button"
              onClick={() => setHasRun(true)}
            >
              Run verification
            </button>
          </div>
        </div>

        <div className="check-list">
          {checks.map((check) => (
            <article className="check-row" key={check.id}>
              <div className="check-copy">
                <strong>{check.label}</strong>
                <span>{check.description}</span>
                <small>{check.required ? "Required" : "Optional"}</small>
              </div>

              <select
                aria-label={`${check.label} status`}
                value={check.status}
                onChange={(event) =>
                  updateCheck(check.id, {
                    status: event.target
                      .value as VerificationCheck["status"],
                  })
                }
              >
                <option value="PASS">Pass</option>
                <option value="LIMITED">Limited</option>
                <option value="MISSING">Missing</option>
                <option value="FAIL">Fail</option>
              </select>

              <input
                aria-label={`${check.label} evidence`}
                placeholder="Evidence reference"
                value={check.evidence}
                onChange={(event) =>
                  updateCheck(check.id, { evidence: event.target.value })
                }
              />

              <input
                aria-label={`${check.label} authority`}
                placeholder="Authority"
                value={check.authority}
                onChange={(event) =>
                  updateCheck(check.id, { authority: event.target.value })
                }
              />

              <span className={`status status-${check.status.toLowerCase()}`}>
                {check.status}
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="result-grid">
        <article className={`panel determination state-${result.state.toLowerCase()}`}>
          <div className="panel-heading">
            <div>
              <p className="eyebrow">VERIFICATION DETERMINATION</p>
              <h2>{hasRun ? result.state : "NOT RUN"}</h2>
            </div>
            <span className="determination-chip">
              {hasRun ? result.findings.length : 0} finding
              {hasRun && result.findings.length === 1 ? "" : "s"}
            </span>
          </div>

          <h3>
            {hasRun
              ? stateCopy[result.state].title
              : "The verification inputs changed"}
          </h3>
          <p>
            {hasRun
              ? stateCopy[result.state].next
              : "Run verification to generate a fresh bounded determination."}
          </p>
        </article>

        <article className="panel proof-panel">
          <p className="eyebrow">WHAT THIS CAN ESTABLISH</p>
          <div>
            <h3>Verified standing</h3>
            <p>
              The presence and consistency of declared identity, integrity,
              source, authority, continuity, and proof-boundary conditions.
            </p>
          </div>
          <div>
            <h3>Not established</h3>
            <p>
              Safety, diagnosis, compliance, causation, optimization, approval,
              execution correctness, or acceptable outcome.
            </p>
          </div>
        </article>
      </section>

      <section className="panel findings-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">EVIDENCE-BOUND FINDINGS</p>
            <h2>Why the record received this standing</h2>
          </div>
        </div>

        <div className="findings-list">
          {(hasRun ? result.findings : []).map((finding, index) => (
            <article
              className={`finding finding-${finding.severity}`}
              key={`${finding.code}-${index}`}
            >
              <div className="finding-code">{finding.code}</div>
              <div>
                <h3>{finding.title}</h3>
                <dl>
                  <div>
                    <dt>Verification effect</dt>
                    <dd>{finding.effect}</dd>
                  </div>
                  <div>
                    <dt>Bounded consequence</dt>
                    <dd>{finding.consequence}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}

          {!hasRun ? (
            <div className="empty-state">
              Run verification to generate a current verification artifact.
            </div>
          ) : null}
        </div>
      </section>

      <section className="next-panel">
        <div>
          <p className="eyebrow">NEXT ADMISSIBLE STEP</p>
          <h2>Advance only what remains verified.</h2>
          <p>
            Verification is a gate, not a guarantee. Any later binding,
            execution, or outcome review must remain separately governed.
          </p>
        </div>

        <div className="next-actions">
          <Link href="/workspace/governed-records/preserved-records">
            <span>Review preservation receipts</span>
            <strong>Open Preserved Records →</strong>
          </Link>
          <Link href="/workspace/governed-records/pricing">
            <span>Review access and preservation options</span>
            <strong>Open Pricing →</strong>
          </Link>
        </div>
      </section>

      <footer>
        <strong>No admissible evidence. No admissible execution.</strong>
        <span>
          Verification confirms standing within scope. It does not prove
          acceptable consequence.
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
          opacity: 0.36;
          background-image:
            radial-gradient(circle, rgba(255, 255, 255, 0.7) 1px, transparent 1px),
            radial-gradient(circle, rgba(120, 255, 219, 0.42) 1px, transparent 1px);
          background-size: 86px 86px, 137px 137px;
          background-position: 0 0, 21px 39px;
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
          max-width: 980px;
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(42px, 6vw, 82px);
          line-height: 0.98;
          letter-spacing: -0.045em;
        }

        .hero-copy {
          max-width: 850px;
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

        .state-verified {
          border-color: rgba(82, 223, 164, 0.45);
        }

        .state-limited {
          border-color: rgba(230, 189, 93, 0.45);
        }

        .state-hold {
          border-color: rgba(240, 167, 75, 0.48);
        }

        .state-failed {
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

        .workspace-grid,
        .result-grid {
          width: min(1500px, 100%);
          margin: 0 auto 24px;
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(320px, 0.6fr);
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

        .field-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        label {
          display: grid;
          gap: 8px;
        }

        label > span {
          color: #9bb1ab;
          font-size: 12px;
          font-weight: 700;
        }

        .wide {
          grid-column: 1 / -1;
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
          min-height: 130px;
          resize: vertical;
          line-height: 1.6;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: rgba(100, 226, 192, 0.58);
          box-shadow: 0 0 0 3px rgba(55, 185, 149, 0.1);
        }

        .boundary-panel p {
          color: #a7bbb5;
          line-height: 1.7;
        }

        .boundary-list {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 12px 18px;
          margin-top: 24px;
          padding-top: 22px;
          border-top: 1px solid rgba(140, 184, 172, 0.14);
        }

        .boundary-list span {
          color: #7f9a93;
        }

        .boundary-list strong {
          color: #dcebe7;
          text-align: right;
        }

        .checks-panel,
        .findings-panel {
          width: min(1500px, 100%);
          margin: 0 auto 24px;
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

        .check-list {
          display: grid;
          gap: 10px;
        }

        .check-row {
          display: grid;
          grid-template-columns: minmax(240px, 1.1fr) 130px minmax(220px, 1fr) minmax(180px, 0.8fr) 100px;
          gap: 12px;
          align-items: center;
          padding: 14px;
          border-radius: 16px;
          background: rgba(3, 16, 14, 0.62);
          border: 1px solid rgba(133, 184, 170, 0.12);
        }

        .check-copy {
          display: grid;
          gap: 5px;
        }

        .check-copy span,
        .check-copy small {
          color: #78938b;
        }

        .check-copy small {
          font-size: 11px;
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

        .status-pass {
          color: #8ae0c5;
          background: rgba(74, 188, 151, 0.12);
          border: 1px solid rgba(74, 188, 151, 0.22);
        }

        .status-limited {
          color: #f0c96f;
          background: rgba(215, 166, 56, 0.12);
          border: 1px solid rgba(215, 166, 56, 0.24);
        }

        .status-missing {
          color: #f2ad67;
          background: rgba(226, 132, 49, 0.12);
          border: 1px solid rgba(226, 132, 49, 0.24);
        }

        .status-fail {
          color: #f28f8f;
          background: rgba(221, 76, 76, 0.12);
          border: 1px solid rgba(221, 76, 76, 0.24);
        }

        .determination h2 {
          font-size: 38px;
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

        .finding-failed {
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
          .result-grid,
          .next-panel {
            grid-template-columns: 1fr;
          }

          nav {
            display: none;
          }

          .check-list {
            overflow-x: auto;
          }

          .check-row {
            min-width: 1080px;
          }
        }

        @media (max-width: 720px) {
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

          .button-row {
            justify-content: flex-start;
          }

          .field-grid {
            grid-template-columns: 1fr;
          }

          .wide {
            grid-column: auto;
          }

          .finding {
            grid-template-columns: 1fr;
          }

          dl > div {
            grid-template-columns: 1fr;
            gap: 5px;
          }

          footer {
            display: grid;
          }
        }
      `}</style>
    </main>
  );
}
