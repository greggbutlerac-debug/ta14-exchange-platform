"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type IntakeType =
  | "ROUTE_REVIEW"
  | "API_READINESS"
  | "EVIDENCE_REVIEW"
  | "RUNTIME_READINESS"
  | "PARTNER_FIT";

type Urgency = "STANDARD" | "PRIORITY" | "CRITICAL";
type IntakeState = "DRAFT" | "READY" | "BLOCKED";

type IntakeField = {
  key: string;
  label: string;
  value: string;
  required: boolean;
};

const serviceCopy: Record<
  IntakeType,
  { title: string; description: string; startingPrice: string }
> = {
  ROUTE_REVIEW: {
    title: "Route Review",
    description:
      "Independent written review of a consequential route against the TA-14 admissibility chain.",
    startingPrice: "From $450",
  },
  API_READINESS: {
    title: "API Readiness Check",
    description:
      "Determine whether an API can accept, preserve, return, and verify route evidence and execution receipts.",
    startingPrice: "$250",
  },
  EVIDENCE_REVIEW: {
    title: "Evidence Review",
    description:
      "Examine evidence completeness, provenance, continuity, substitutions, and unresolved UNKNOWN states.",
    startingPrice: "From $450",
  },
  RUNTIME_READINESS: {
    title: "Runtime Readiness",
    description:
      "Assess whether a system can enforce admissibility before consequence-bearing execution.",
    startingPrice: "From $1,000",
  },
  PARTNER_FIT: {
    title: "Partner-Fit Gap Brief",
    description:
      "Bounded review of a governance architecture for a possible referral, review, or partner lane.",
    startingPrice: "Scoped",
  },
};

function makeId() {
  return `TA14-INTAKE-${Math.random().toString(16).slice(2, 8).toUpperCase()}`;
}

function downloadJson(filename: string, value: unknown) {
  const blob = new Blob([JSON.stringify(value, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function RequestReviewPage() {
  const [intakeType, setIntakeType] =
    useState<IntakeType>("ROUTE_REVIEW");
  const [urgency, setUrgency] = useState<Urgency>("STANDARD");
  const [organization, setOrganization] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [routeName, setRouteName] = useState("");
  const [routeId, setRouteId] = useState("");
  const [publicUrl, setPublicUrl] = useState("");
  const [requestedOutcome, setRequestedOutcome] = useState("");
  const [knownUnknowns, setKnownUnknowns] = useState("");
  const [evidenceSummary, setEvidenceSummary] = useState("");
  const [authoritySummary, setAuthoritySummary] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [intakeId, setIntakeId] = useState("");

  const fields: IntakeField[] = useMemo(
    () => [
      {
        key: "organization",
        label: "Organization",
        value: organization,
        required: true,
      },
      {
        key: "contactName",
        label: "Contact name",
        value: contactName,
        required: true,
      },
      {
        key: "contactEmail",
        label: "Contact email",
        value: contactEmail,
        required: true,
      },
      {
        key: "routeName",
        label: "Route or system name",
        value: routeName,
        required: true,
      },
      {
        key: "requestedOutcome",
        label: "Requested outcome",
        value: requestedOutcome,
        required: true,
      },
      {
        key: "evidenceSummary",
        label: "Evidence summary",
        value: evidenceSummary,
        required: true,
      },
      {
        key: "authoritySummary",
        label: "Authority summary",
        value: authoritySummary,
        required: true,
      },
      {
        key: "knownUnknowns",
        label: "Known UNKNOWN states",
        value: knownUnknowns,
        required: false,
      },
    ],
    [
      organization,
      contactName,
      contactEmail,
      routeName,
      requestedOutcome,
      evidenceSummary,
      authoritySummary,
      knownUnknowns,
    ],
  );

  const missing = fields.filter(
    (field) => field.required && !field.value.trim(),
  );

  const intakeState: IntakeState =
    submitted ? "READY" : missing.length ? "BLOCKED" : "DRAFT";

  const completion = Math.round(
    ((fields.length - missing.length) / fields.length) * 100,
  );

  const selectedService = serviceCopy[intakeType];

  const packageData = {
    schema: "TA14_REVIEW_INTAKE_PACKAGE_V1",
    intakeId: intakeId || "UNASSIGNED",
    createdAt: new Date().toISOString(),
    intakeState,
    service: {
      type: intakeType,
      title: selectedService.title,
      startingPrice: selectedService.startingPrice,
    },
    urgency,
    requester: {
      organization: organization || "UNKNOWN",
      contactName: contactName || "UNKNOWN",
      contactEmail: contactEmail || "UNKNOWN",
    },
    subject: {
      routeName: routeName || "UNKNOWN",
      routeId: routeId || "UNKNOWN",
      publicUrl: publicUrl || "UNKNOWN",
    },
    reviewRequest: {
      requestedOutcome: requestedOutcome || "UNKNOWN",
      evidenceSummary: evidenceSummary || "UNKNOWN",
      authoritySummary: authoritySummary || "UNKNOWN",
      knownUnknowns: knownUnknowns || "NONE_DECLARED",
    },
    missingRequiredFields: missing.map((field) => field.key),
    limitation:
      "Submitting an intake package does not create certification, endorsement, approval, partnership, or execution authority.",
  };

  function submitIntake() {
    if (missing.length) {
      setSubmitted(false);
      return;
    }
    setIntakeId(makeId());
    setSubmitted(true);
  }

  return (
    <main className="intake-page">
      <style>{`
        * { box-sizing: border-box; }

        .intake-page {
          min-height: calc(100vh - 68px);
          padding: 48px 0 110px;
          color: #edf6ff;
        }

        .intake-wrap {
          width: min(1360px, calc(100% - 48px));
          margin: 0 auto;
        }

        .hero {
          position: relative;
          overflow: hidden;
          padding: clamp(32px, 5vw, 68px);
          border: 1px solid rgba(132, 177, 216, .16);
          border-radius: 34px;
          background:
            radial-gradient(circle at 85% 8%, rgba(57, 242, 161, .15), transparent 27%),
            radial-gradient(circle at 14% 0%, rgba(72, 223, 255, .17), transparent 32%),
            linear-gradient(135deg, rgba(14, 30, 48, .97), rgba(5, 11, 20, .98));
          box-shadow: 0 38px 120px rgba(0,0,0,.35);
        }

        .hero::after {
          content: "INTAKE";
          position: absolute;
          right: -10px;
          bottom: -42px;
          color: rgba(255,255,255,.025);
          font-size: clamp(6rem, 16vw, 14rem);
          font-weight: 1000;
          letter-spacing: -.1em;
          pointer-events: none;
        }

        .hero-content { position: relative; z-index: 1; max-width: 930px; }

        .eyebrow {
          margin: 0 0 17px;
          color: #70e6fb;
          font-size: .72rem;
          font-weight: 950;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        h1 {
          margin: 0;
          font-size: clamp(3.2rem, 7vw, 7rem);
          line-height: .92;
          letter-spacing: -.07em;
        }

        .gradient {
          color: transparent;
          background: linear-gradient(100deg, #fff, #8ceaff 50%, #53efae);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .hero-copy {
          max-width: 820px;
          margin: 24px 0 0;
          color: #9eb4c8;
          font-size: 1.08rem;
          line-height: 1.75;
        }

        .hero-actions, .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 11px;
          margin-top: 28px;
        }

        .button, .button-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 47px;
          padding: 0 19px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 900;
          cursor: pointer;
          transition: transform .2s ease;
        }

        .button:hover, .button-secondary:hover { transform: translateY(-2px); }

        .button {
          border: 0;
          color: #07100f;
          background: linear-gradient(100deg, #56e6ff, #53efae);
        }

        .button-secondary {
          border: 1px solid rgba(136, 180, 219, .22);
          color: #dce9f5;
          background: rgba(7, 17, 29, .72);
        }

        .grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(360px, .82fr);
          gap: 18px;
          align-items: start;
          margin-top: 22px;
        }

        .panel {
          border: 1px solid rgba(132, 177, 216, .14);
          border-radius: 25px;
          background: rgba(6, 15, 25, .8);
          box-shadow: 0 24px 80px rgba(0,0,0,.22);
        }

        .panel-inner { padding: 24px; }

        .section-label {
          margin: 0 0 8px;
          color: #70dff4;
          font-size: .7rem;
          font-weight: 950;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .panel h2 {
          margin: 0;
          font-size: 1.75rem;
          letter-spacing: -.04em;
        }

        .panel-copy {
          margin: 10px 0 0;
          color: #8fa6ba;
          line-height: 1.65;
        }

        .field { margin-top: 18px; }

        .field label {
          display: block;
          margin-bottom: 8px;
          color: #bdd0df;
          font-size: .78rem;
          font-weight: 850;
        }

        input, select, textarea {
          width: 100%;
          border: 1px solid rgba(135, 180, 220, .2);
          border-radius: 14px;
          outline: none;
          color: #edf6ff;
          background: rgba(2, 9, 16, .9);
          font: inherit;
        }

        input, select {
          min-height: 48px;
          padding: 0 14px;
        }

        textarea {
          min-height: 110px;
          padding: 13px 14px;
          resize: vertical;
          line-height: 1.55;
        }

        input:focus, select:focus, textarea:focus {
          border-color: rgba(84, 232, 255, .55);
          box-shadow: 0 0 0 3px rgba(84, 232, 255, .08);
        }

        .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .service-card {
          margin-top: 14px;
          padding: 17px;
          border: 1px solid rgba(132, 177, 216, .12);
          border-radius: 17px;
          background: rgba(2, 9, 16, .52);
        }

        .service-card strong { display: block; }
        .service-card span {
          display: block;
          margin-top: 5px;
          color: #53efae;
          font-weight: 900;
          font-size: .78rem;
        }
        .service-card p {
          margin: 10px 0 0;
          color: #90a7bb;
          line-height: 1.6;
        }

        .sticky { position: sticky; top: 92px; }

        .status-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-top: 20px;
        }

        .pill {
          display: inline-flex;
          align-items: center;
          min-height: 28px;
          padding: 0 10px;
          border: 1px solid rgba(135, 180, 220, .18);
          border-radius: 999px;
          font-size: .67rem;
          font-weight: 950;
          letter-spacing: .08em;
        }

        .pill.READY { color: #54efae; border-color: rgba(84, 239, 174, .3); }
        .pill.DRAFT { color: #7bd9ff; border-color: rgba(123, 217, 255, .3); }
        .pill.BLOCKED { color: #ffd27b; border-color: rgba(255, 210, 123, .3); }

        .score {
          margin-top: 18px;
          font-size: 3.8rem;
          font-weight: 950;
          letter-spacing: -.08em;
        }

        .score small {
          font-size: 1rem;
          color: #7590a8;
          letter-spacing: 0;
        }

        .progress {
          height: 9px;
          margin-top: 8px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255,255,255,.055);
        }

        .progress div {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #56e6ff, #53efae);
        }

        .missing-box, .ready-box {
          margin-top: 18px;
          padding: 16px;
          border-radius: 16px;
          line-height: 1.6;
        }

        .missing-box {
          border: 1px solid rgba(255, 210, 123, .16);
          background: rgba(65, 43, 8, .15);
          color: #b8c7d4;
        }

        .missing-box strong {
          color: #ffd27b;
          font-size: .75rem;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .missing-box ul {
          margin: 10px 0 0;
          padding-left: 18px;
        }

        .ready-box {
          border: 1px solid rgba(84, 239, 174, .16);
          background: rgba(14, 62, 44, .13);
          color: #acd9c6;
        }

        .summary {
          margin-top: 18px;
          padding: 17px;
          border: 1px solid rgba(132, 177, 216, .12);
          border-radius: 17px;
          background: rgba(2, 9, 16, .52);
        }

        .summary dl {
          display: grid;
          grid-template-columns: 130px 1fr;
          gap: 9px 12px;
          margin: 0;
          font-size: .78rem;
        }

        .summary dt { color: #718aa1; }
        .summary dd { margin: 0; color: #dce8f3; }

        .notice {
          margin-top: 18px;
          padding: 16px 18px;
          border-left: 3px solid #53efae;
          border-radius: 0 13px 13px 0;
          color: #91a8bd;
          background: rgba(83, 239, 174, .045);
          font-size: .82rem;
          line-height: 1.65;
        }

        @media (max-width: 980px) {
          .grid { grid-template-columns: 1fr; }
          .sticky { position: static; }
        }

        @media (max-width: 700px) {
          .intake-wrap { width: min(100% - 24px, 1360px); }
          .intake-page { padding-top: 24px; }
          .hero { padding: 28px 22px 34px; border-radius: 24px; }
          .two-col { grid-template-columns: 1fr; }
          .summary dl { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="intake-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">TA-14 Exchange · Request Review</p>
            <h1>
              Bring the route.
              <br />
              <span className="gradient">Preserve what is unknown.</span>
            </h1>
            <p className="hero-copy">
              Submit a bounded review request with the route, evidence,
              authority source, requested outcome, and known UNKNOWN states
              clearly separated before any review scope is accepted.
            </p>

            <div className="hero-actions">
              <Link className="button" href="/workspace/review">
                Open Review Desk
              </Link>
              <Link className="button-secondary" href="/workspace/scanner">
                Scan first
              </Link>
              <Link className="button-secondary" href="/workspace/build">
                Build a route
              </Link>
            </div>
          </div>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-inner">
              <p className="section-label">Review intake</p>
              <h2>Define the request before asking for a conclusion.</h2>
              <p className="panel-copy">
                Required fields remain visible and unresolved information is
                preserved rather than silently inferred.
              </p>

              <div className="field">
                <label htmlFor="service">Requested service</label>
                <select
                  id="service"
                  value={intakeType}
                  onChange={(event) =>
                    setIntakeType(event.target.value as IntakeType)
                  }
                >
                  {Object.entries(serviceCopy).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.title}
                    </option>
                  ))}
                </select>

                <div className="service-card">
                  <strong>{selectedService.title}</strong>
                  <span>{selectedService.startingPrice}</span>
                  <p>{selectedService.description}</p>
                </div>
              </div>

              <div className="two-col">
                <div className="field">
                  <label htmlFor="organization">Organization *</label>
                  <input
                    id="organization"
                    value={organization}
                    onChange={(event) => setOrganization(event.target.value)}
                    placeholder="Organization name"
                  />
                </div>

                <div className="field">
                  <label htmlFor="urgency">Urgency</label>
                  <select
                    id="urgency"
                    value={urgency}
                    onChange={(event) =>
                      setUrgency(event.target.value as Urgency)
                    }
                  >
                    <option value="STANDARD">STANDARD</option>
                    <option value="PRIORITY">PRIORITY</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>

              <div className="two-col">
                <div className="field">
                  <label htmlFor="contactName">Contact name *</label>
                  <input
                    id="contactName"
                    value={contactName}
                    onChange={(event) => setContactName(event.target.value)}
                    placeholder="Full name"
                  />
                </div>

                <div className="field">
                  <label htmlFor="contactEmail">Contact email *</label>
                  <input
                    id="contactEmail"
                    type="email"
                    value={contactEmail}
                    onChange={(event) => setContactEmail(event.target.value)}
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="two-col">
                <div className="field">
                  <label htmlFor="routeName">Route or system name *</label>
                  <input
                    id="routeName"
                    value={routeName}
                    onChange={(event) => setRouteName(event.target.value)}
                    placeholder="Name of route or governed system"
                  />
                </div>

                <div className="field">
                  <label htmlFor="routeId">Route ID</label>
                  <input
                    id="routeId"
                    value={routeId}
                    onChange={(event) => setRouteId(event.target.value)}
                    placeholder="TA14-RID-... or UNKNOWN"
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="publicUrl">Public documentation URL</label>
                <input
                  id="publicUrl"
                  value={publicUrl}
                  onChange={(event) => setPublicUrl(event.target.value)}
                  placeholder="Public repository, article, specification, or route page"
                />
              </div>

              <div className="field">
                <label htmlFor="requestedOutcome">Requested outcome *</label>
                <textarea
                  id="requestedOutcome"
                  value={requestedOutcome}
                  onChange={(event) => setRequestedOutcome(event.target.value)}
                  placeholder="What exact written determination, gap analysis, or readiness decision are you requesting?"
                />
              </div>

              <div className="field">
                <label htmlFor="evidenceSummary">Evidence summary *</label>
                <textarea
                  id="evidenceSummary"
                  value={evidenceSummary}
                  onChange={(event) => setEvidenceSummary(event.target.value)}
                  placeholder="Describe the evidence presently available, its source, versions, dependencies, and preservation method."
                />
              </div>

              <div className="field">
                <label htmlFor="authoritySummary">Authority summary *</label>
                <textarea
                  id="authoritySummary"
                  value={authoritySummary}
                  onChange={(event) => setAuthoritySummary(event.target.value)}
                  placeholder="Identify who may authorize the consequence, under what source, scope, limits, and duration."
                />
              </div>

              <div className="field">
                <label htmlFor="knownUnknowns">Known UNKNOWN states</label>
                <textarea
                  id="knownUnknowns"
                  value={knownUnknowns}
                  onChange={(event) => setKnownUnknowns(event.target.value)}
                  placeholder="List unresolved facts, missing records, disputed authority, unverified signatures, or unavailable outcome sources."
                />
              </div>
            </div>
          </div>

          <aside className="panel sticky">
            <div className="panel-inner">
              <p className="section-label">Intake readiness</p>
              <h2>{submitted ? "Package prepared" : "Review before submission"}</h2>
              <p className="panel-copy">
                The request must be reviewable before it can be placed into a
                bounded governance review workflow.
              </p>

              <div className="status-row">
                <span className={`pill ${intakeState}`}>{intakeState}</span>
                <span>{missing.length} required fields missing</span>
              </div>

              <div className="score">
                {completion}
                <small>%</small>
              </div>
              <div className="progress">
                <div style={{ width: `${completion}%` }} />
              </div>

              {missing.length ? (
                <div className="missing-box">
                  <strong>Required before submission</strong>
                  <ul>
                    {missing.map((field) => (
                      <li key={field.key}>{field.label}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="ready-box">
                  Required intake fields are present. This means the request is
                  ready for triage, not that the route is approved.
                </div>
              )}

              <div className="summary">
                <dl>
                  <dt>Service</dt>
                  <dd>{selectedService.title}</dd>
                  <dt>Starting price</dt>
                  <dd>{selectedService.startingPrice}</dd>
                  <dt>Urgency</dt>
                  <dd>{urgency}</dd>
                  <dt>Organization</dt>
                  <dd>{organization || "UNKNOWN"}</dd>
                  <dt>Route</dt>
                  <dd>{routeName || "UNKNOWN"}</dd>
                  <dt>Route ID</dt>
                  <dd>{routeId || "UNKNOWN"}</dd>
                  <dt>Intake ID</dt>
                  <dd>{intakeId || "UNASSIGNED"}</dd>
                </dl>
              </div>

              <div className="actions">
                <button className="button" type="button" onClick={submitIntake}>
                  Prepare intake package
                </button>
                <button
                  className="button-secondary"
                  type="button"
                  onClick={() =>
                    downloadJson(
                      `${(intakeId || "ta14-intake-draft").toLowerCase()}.json`,
                      packageData,
                    )
                  }
                >
                  Download JSON
                </button>
              </div>

              <div className="notice">
                Intake submission creates no certification, endorsement,
                approval, partnership, or execution authority. Scope, fee,
                reviewer, and deliverables remain subject to written acceptance.
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
