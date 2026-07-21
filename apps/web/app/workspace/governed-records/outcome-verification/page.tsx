"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type RecordStatus =
  | "DRAFT"
  | "READY_FOR_REVIEW"
  | "PRESERVED"
  | "SUPERSEDED"
  | "WITHDRAWN";

type VerificationState =
  | "NOT_ASSESSED"
  | "VERIFIED"
  | "PARTIALLY_VERIFIED"
  | "NOT_VERIFIED"
  | "DISPUTED";

type EvidenceState = "PRESENT" | "PARTIAL" | "MISSING" | "DISPUTED";

type OutcomeMetric = {
  id: string;
  name: string;
  baselineValue: string;
  targetValue: string;
  observedValue: string;
  unit: string;
  evidenceReference: string;
  verification: VerificationState;
  notes: string;
};

type OutcomeFinding = {
  id: string;
  category: string;
  severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  statement: string;
  evidenceReference: string;
  boundary: string;
  requiredAction: string;
};

type OutcomeRecord = {
  recordId: string;
  title: string;
  sourceExecutionRecordId: string;
  sourceReadinessReviewId: string;
  sourceAdmissibilityReviewId: string;
  sourceAuthorityReviewId: string;
  sourceEvidenceReviewId: string;
  sourceContinuityReviewId: string;
  sourceInterpretationId: string;
  sourceGovernedRecordId: string;
  reviewer: string;
  organization: string;
  reviewLocation: string;
  observationStartedAt: string;
  observationEndedAt: string;
  baselineBoundary: string;
  intendedOutcome: string;
  declaredSuccessCriteria: string;
  actualObservedOutcome: string;
  counterfactualBoundary: string;
  causalLimitations: string;
  evidenceProduced: string;
  evidenceState: EvidenceState;
  outcomeVerification: VerificationState;
  whatIsVerified: string;
  whatIsNotVerified: string;
  unresolvedQuestions: string;
  nextRequiredRecord: string;
  metrics: OutcomeMetric[];
  findings: OutcomeFinding[];
  status: RecordStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
  preservedAt: string;
};

const WORKSPACE_KEY = "ta14-governed-outcome-verification-workspace-v1";
const LIBRARY_KEY = "ta14-governed-outcome-verification-library-v1";

function makeRecordId() {
  const stamp = new Date()
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `TA-14-GOVR-${stamp}-${suffix}`;
}

function blankMetric(): OutcomeMetric {
  return {
    id: crypto.randomUUID(),
    name: "",
    baselineValue: "",
    targetValue: "",
    observedValue: "",
    unit: "",
    evidenceReference: "",
    verification: "NOT_ASSESSED",
    notes: "",
  };
}

function blankFinding(): OutcomeFinding {
  return {
    id: crypto.randomUUID(),
    category: "",
    severity: "LOW",
    statement: "",
    evidenceReference: "",
    boundary: "",
    requiredAction: "",
  };
}

function blankRecord(): OutcomeRecord {
  const now = new Date().toISOString();
  return {
    recordId: makeRecordId(),
    title: "",
    sourceExecutionRecordId: "",
    sourceReadinessReviewId: "",
    sourceAdmissibilityReviewId: "",
    sourceAuthorityReviewId: "",
    sourceEvidenceReviewId: "",
    sourceContinuityReviewId: "",
    sourceInterpretationId: "",
    sourceGovernedRecordId: "",
    reviewer: "",
    organization: "",
    reviewLocation: "",
    observationStartedAt: "",
    observationEndedAt: "",
    baselineBoundary: "",
    intendedOutcome: "",
    declaredSuccessCriteria: "",
    actualObservedOutcome: "",
    counterfactualBoundary: "",
    causalLimitations: "",
    evidenceProduced: "",
    evidenceState: "MISSING",
    outcomeVerification: "NOT_ASSESSED",
    whatIsVerified: "",
    whatIsNotVerified: "",
    unresolvedQuestions: "",
    nextRequiredRecord: "",
    metrics: [],
    findings: [],
    status: "DRAFT",
    version: 1,
    createdAt: now,
    updatedAt: now,
    preservedAt: "",
  };
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
    </label>
  );
}

export default function GovernedOutcomeVerificationPage() {
  const [record, setRecord] = useState<OutcomeRecord>(blankRecord());
  const [library, setLibrary] = useState<OutcomeRecord[]>([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const storedWorkspace = safeParse<OutcomeRecord | null>(
      localStorage.getItem(WORKSPACE_KEY),
      null,
    );
    const storedLibrary = safeParse<OutcomeRecord[]>(
      localStorage.getItem(LIBRARY_KEY),
      [],
    );

    if (storedWorkspace) setRecord(storedWorkspace);
    setLibrary(storedLibrary);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      WORKSPACE_KEY,
      JSON.stringify({ ...record, updatedAt: new Date().toISOString() }),
    );
  }, [record]);

  const completion = useMemo(() => {
    const checks = [
      record.title,
      record.sourceExecutionRecordId,
      record.sourceGovernedRecordId,
      record.reviewer,
      record.organization,
      record.observationStartedAt,
      record.observationEndedAt,
      record.baselineBoundary,
      record.intendedOutcome,
      record.declaredSuccessCriteria,
      record.actualObservedOutcome,
      record.evidenceProduced,
      record.evidenceState !== "MISSING" ? "yes" : "",
      record.outcomeVerification !== "NOT_ASSESSED" ? "yes" : "",
      record.whatIsVerified,
      record.whatIsNotVerified,
      record.metrics.length > 0 ? "yes" : "",
    ];

    return Math.round(
      (checks.filter(Boolean).length / checks.length) * 100,
    );
  }, [record]);

  const update = <K extends keyof OutcomeRecord>(
    key: K,
    value: OutcomeRecord[K],
  ) => {
    setRecord((current) => ({
      ...current,
      [key]: value,
      updatedAt: new Date().toISOString(),
    }));
  };

  const addMetric = () => {
    update("metrics", [...record.metrics, blankMetric()]);
  };

  const updateMetric = (
    id: string,
    key: keyof OutcomeMetric,
    value: string,
  ) => {
    update(
      "metrics",
      record.metrics.map((metric) =>
        metric.id === id ? { ...metric, [key]: value } : metric,
      ),
    );
  };

  const removeMetric = (id: string) => {
    update(
      "metrics",
      record.metrics.filter((metric) => metric.id !== id),
    );
  };

  const addFinding = () => {
    update("findings", [...record.findings, blankFinding()]);
  };

  const updateFinding = (
    id: string,
    key: keyof OutcomeFinding,
    value: string,
  ) => {
    update(
      "findings",
      record.findings.map((finding) =>
        finding.id === id ? { ...finding, [key]: value } : finding,
      ),
    );
  };

  const removeFinding = (id: string) => {
    update(
      "findings",
      record.findings.filter((finding) => finding.id !== id),
    );
  };

  const saveDraft = () => {
    const now = new Date().toISOString();
    const draft: OutcomeRecord = {
      ...record,
      status: "DRAFT",
      updatedAt: now,
    };

    const nextLibrary = [
      draft,
      ...library.filter((item) => item.recordId !== draft.recordId),
    ];

    setRecord(draft);
    setLibrary(nextLibrary);
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(nextLibrary));
    setNotice("Draft outcome verification record saved in this browser.");
  };

  const preserve = () => {
    if (
      !record.sourceExecutionRecordId ||
      !record.baselineBoundary ||
      !record.actualObservedOutcome ||
      record.outcomeVerification === "NOT_ASSESSED"
    ) {
      setNotice(
        "Preservation requires an execution record, baseline boundary, observed outcome, and declared verification determination.",
      );
      return;
    }

    const now = new Date().toISOString();
    const preserved: OutcomeRecord = {
      ...record,
      status: "PRESERVED",
      preservedAt: now,
      updatedAt: now,
    };

    const nextLibrary = [
      preserved,
      ...library.filter((item) => item.recordId !== preserved.recordId),
    ];

    setRecord(preserved);
    setLibrary(nextLibrary);
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(nextLibrary));
    setNotice("Governed Outcome Verification Record preserved.");
  };

  const exportJson = (item: OutcomeRecord) => {
    const blob = new Blob([JSON.stringify(item, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${item.recordId}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const reopen = (item: OutcomeRecord) => {
    setRecord({
      ...item,
      version: item.version + 1,
      status: item.status === "PRESERVED" ? "SUPERSEDED" : item.status,
      updatedAt: new Date().toISOString(),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    setNotice(`Reopened ${item.recordId}.`);
  };

  const remove = (recordId: string) => {
    const nextLibrary = library.filter((item) => item.recordId !== recordId);
    setLibrary(nextLibrary);
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(nextLibrary));
    setNotice("Record removed from the local library.");
  };

  const newRecord = () => {
    const next = blankRecord();
    setRecord(next);
    localStorage.setItem(WORKSPACE_KEY, JSON.stringify(next));
    setNotice("New Governed Outcome Verification Record started.");
  };

  const loadSample = () => {
    const now = new Date();
    const end = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    setRecord({
      ...blankRecord(),
      title: "Vendor Payment Outcome Verification",
      sourceExecutionRecordId: "TA-14-GER-EXAMPLE-001",
      sourceReadinessReviewId: "TA-14-ERR-EXAMPLE-001",
      sourceAdmissibilityReviewId: "TA-14-ADR-EXAMPLE-001",
      sourceAuthorityReviewId: "TA-14-AUR-EXAMPLE-001",
      sourceEvidenceReviewId: "TA-14-ESR-EXAMPLE-001",
      sourceContinuityReviewId: "TA-14-CR-EXAMPLE-001",
      sourceInterpretationId: "TA-14-GIR-EXAMPLE-001",
      sourceGovernedRecordId: "TA-14-GR-EXAMPLE-001",
      reviewer: "Outcome Verification Reviewer",
      organization: "TA-14 Demonstration Organization",
      reviewLocation: "Governed finance environment",
      observationStartedAt: now.toISOString().slice(0, 16),
      observationEndedAt: end.toISOString().slice(0, 16),
      baselineBoundary:
        "Before execution, the approved invoice remained unpaid and the verified beneficiary account showed no receipt.",
      intendedOutcome:
        "The verified beneficiary receives one payment of $27,500 under the preserved authority.",
      declaredSuccessCriteria:
        "A single payment settles successfully to the verified beneficiary, with no duplicate payment, amount variance, or unauthorized account change.",
      actualObservedOutcome:
        "One payment of $27,500 settled to the verified beneficiary. The transaction was acknowledged and no duplicate payment was detected.",
      counterfactualBoundary:
        "This record does not prove what would have occurred without the governed execution route.",
      causalLimitations:
        "The evidence verifies the payment outcome but does not independently establish every external factor affecting the beneficiary after receipt.",
      evidenceProduced:
        "Settlement confirmation, beneficiary acknowledgment, payment ledger, executor log, and duplicate-payment check.",
      evidenceState: "PRESENT",
      outcomeVerification: "VERIFIED",
      whatIsVerified:
        "The declared payment outcome occurred within the amount, beneficiary, timing, and single-payment boundaries.",
      whatIsNotVerified:
        "No claim is made regarding downstream use of funds or unrelated financial activity.",
      unresolvedQuestions: "None declared.",
      nextRequiredRecord:
        "Preserve the outcome verification record and link it to the governed execution chain.",
      metrics: [
        {
          id: crypto.randomUUID(),
          name: "Payment amount settled",
          baselineValue: "$0",
          targetValue: "$27,500",
          observedValue: "$27,500",
          unit: "USD",
          evidenceReference: "Settlement confirmation",
          verification: "VERIFIED",
          notes: "Observed value matched the authorized target.",
        },
      ],
      findings: [],
    });

    setNotice("Sample outcome verification record loaded.");
  };

  const verificationClass = record.outcomeVerification
    .toLowerCase()
    .replaceAll("_", "-");

  return (
    <main>
      <div className="ambient ambientOne" />
      <div className="ambient ambientTwo" />
      <div className="stars" />

      <div className="shell">
        <nav className="topbar">
          <Link href="/workspace/governed-records" className="brand">
            <span className="brandMark">TA-14</span>
            <span>Governed Records</span>
          </Link>

          <div className="navLinks">
            <Link href="/workspace/governed-records/execution-record">
              Previous
            </Link>
            <Link href="/workspace/governed-records">Records Home</Link>
          </div>
        </nav>

        <section className="hero panel">
          <div>
            <p className="eyebrow">POST-EXECUTION EVIDENCE LAYER</p>
            <h1>Governed Outcome Verification Record</h1>
            <p className="heroCopy">
              Compare the declared outcome against the preserved baseline,
              success criteria, execution record, and observed evidence. This
              page verifies what happened after execution. It does not rewrite
              the execution record, infer unsupported causation, or convert an
              unobserved result into a verified outcome.
            </p>
          </div>

          <div className="heroStats">
            <div>
              <strong>{completion}%</strong>
              <span>Complete</span>
            </div>
            <div>
              <strong>{record.metrics.length}</strong>
              <span>Metrics</span>
            </div>
            <div>
              <strong>{record.findings.length}</strong>
              <span>Findings</span>
            </div>
          </div>
        </section>

        {notice && (
          <div className="notice">
            <span>{notice}</span>
            <button onClick={() => setNotice("")}>Dismiss</button>
          </div>
        )}

        <section className="toolbar panel">
          <div>
            <span className="recordLabel">ACTIVE RECORD</span>
            <strong>{record.recordId}</strong>
            <small>
              Version {record.version} · {record.status}
            </small>
          </div>

          <div className="toolbarActions">
            <button className="ghostButton" onClick={newRecord}>
              New record
            </button>
            <button className="ghostButton" onClick={loadSample}>
              Load sample
            </button>
            <button className="ghostButton" onClick={saveDraft}>
              Save draft
            </button>
            <button className="primaryButton" onClick={preserve}>
              Preserve record
            </button>
          </div>
        </section>

        <section className="panel section">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">01 · IDENTITY</p>
              <h2>Outcome verification identity</h2>
            </div>
            <span className="chip">{record.status}</span>
          </div>

          <div className="grid two">
            <Field
              label="Verification title"
              value={record.title}
              onChange={(value) => update("title", value)}
              placeholder="Name the outcome verification"
            />
            <Field
              label="Outcome verification record ID"
              value={record.recordId}
              onChange={(value) => update("recordId", value)}
            />
            <Field
              label="Reviewer"
              value={record.reviewer}
              onChange={(value) => update("reviewer", value)}
            />
            <Field
              label="Organization"
              value={record.organization}
              onChange={(value) => update("organization", value)}
            />
            <Field
              label="Review location"
              value={record.reviewLocation}
              onChange={(value) => update("reviewLocation", value)}
            />
            <Field
              label="Observation started"
              value={record.observationStartedAt}
              onChange={(value) => update("observationStartedAt", value)}
              type="datetime-local"
            />
            <Field
              label="Observation ended"
              value={record.observationEndedAt}
              onChange={(value) => update("observationEndedAt", value)}
              type="datetime-local"
            />
          </div>
        </section>

        <section className="panel section">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">02 · GOVERNANCE LINEAGE</p>
              <h2>Bound source records</h2>
            </div>
          </div>

          <div className="grid two">
            <Field
              label="Governed Execution Record ID"
              value={record.sourceExecutionRecordId}
              onChange={(value) => update("sourceExecutionRecordId", value)}
            />
            <Field
              label="Execution Readiness Review ID"
              value={record.sourceReadinessReviewId}
              onChange={(value) => update("sourceReadinessReviewId", value)}
            />
            <Field
              label="Admissibility Review ID"
              value={record.sourceAdmissibilityReviewId}
              onChange={(value) =>
                update("sourceAdmissibilityReviewId", value)
              }
            />
            <Field
              label="Authority Review ID"
              value={record.sourceAuthorityReviewId}
              onChange={(value) => update("sourceAuthorityReviewId", value)}
            />
            <Field
              label="Evidence Sufficiency Review ID"
              value={record.sourceEvidenceReviewId}
              onChange={(value) => update("sourceEvidenceReviewId", value)}
            />
            <Field
              label="Continuity Review ID"
              value={record.sourceContinuityReviewId}
              onChange={(value) => update("sourceContinuityReviewId", value)}
            />
            <Field
              label="Governed Interpretation ID"
              value={record.sourceInterpretationId}
              onChange={(value) => update("sourceInterpretationId", value)}
            />
            <Field
              label="Source Governed Record ID"
              value={record.sourceGovernedRecordId}
              onChange={(value) => update("sourceGovernedRecordId", value)}
            />
          </div>
        </section>

        <section className="panel section">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">03 · BASELINE AND INTENT</p>
              <h2>Before-state and declared outcome</h2>
            </div>
          </div>

          <div className="grid two">
            <TextArea
              label="Baseline boundary"
              value={record.baselineBoundary}
              onChange={(value) => update("baselineBoundary", value)}
              placeholder="Describe the admissible state before execution."
              rows={7}
            />
            <TextArea
              label="Intended outcome"
              value={record.intendedOutcome}
              onChange={(value) => update("intendedOutcome", value)}
              placeholder="Describe the outcome the authorized execution was intended to produce."
              rows={7}
            />
          </div>

          <TextArea
            label="Declared success criteria"
            value={record.declaredSuccessCriteria}
            onChange={(value) => update("declaredSuccessCriteria", value)}
            placeholder="State the measurable or reviewable conditions required for success."
            rows={6}
          />
        </section>

        <section className="panel section">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">04 · OBSERVED OUTCOME</p>
              <h2>Post-execution state</h2>
            </div>
          </div>

          <TextArea
            label="Actual observed outcome"
            value={record.actualObservedOutcome}
            onChange={(value) => update("actualObservedOutcome", value)}
            placeholder="Describe only what the post-execution evidence supports."
            rows={8}
          />

          <div className="grid two">
            <TextArea
              label="Counterfactual boundary"
              value={record.counterfactualBoundary}
              onChange={(value) => update("counterfactualBoundary", value)}
              placeholder="State what this record cannot prove about what would have happened otherwise."
              rows={6}
            />
            <TextArea
              label="Causal limitations"
              value={record.causalLimitations}
              onChange={(value) => update("causalLimitations", value)}
              placeholder="State limits on causal attribution."
              rows={6}
            />
          </div>
        </section>

        <section className="panel section">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">05 · OUTCOME METRICS</p>
              <h2>Baseline-to-outcome comparison</h2>
            </div>
            <button className="ghostButton" onClick={addMetric}>
              Add metric
            </button>
          </div>

          {record.metrics.length === 0 ? (
            <div className="emptyState">
              No outcome metrics have been added.
            </div>
          ) : (
            <div className="stack">
              {record.metrics.map((metric, index) => (
                <article className="recordCard" key={metric.id}>
                  <div className="cardHeader">
                    <strong>Metric {index + 1}</strong>
                    <button onClick={() => removeMetric(metric.id)}>
                      Remove
                    </button>
                  </div>

                  <div className="grid three">
                    <Field
                      label="Metric name"
                      value={metric.name}
                      onChange={(value) =>
                        updateMetric(metric.id, "name", value)
                      }
                    />
                    <Field
                      label="Unit"
                      value={metric.unit}
                      onChange={(value) =>
                        updateMetric(metric.id, "unit", value)
                      }
                    />
                    <label className="field">
                      <span>Verification</span>
                      <select
                        value={metric.verification}
                        onChange={(event) =>
                          updateMetric(
                            metric.id,
                            "verification",
                            event.target.value,
                          )
                        }
                      >
                        <option value="NOT_ASSESSED">NOT ASSESSED</option>
                        <option value="VERIFIED">VERIFIED</option>
                        <option value="PARTIALLY_VERIFIED">
                          PARTIALLY VERIFIED
                        </option>
                        <option value="NOT_VERIFIED">NOT VERIFIED</option>
                        <option value="DISPUTED">DISPUTED</option>
                      </select>
                    </label>
                    <Field
                      label="Baseline value"
                      value={metric.baselineValue}
                      onChange={(value) =>
                        updateMetric(metric.id, "baselineValue", value)
                      }
                    />
                    <Field
                      label="Target value"
                      value={metric.targetValue}
                      onChange={(value) =>
                        updateMetric(metric.id, "targetValue", value)
                      }
                    />
                    <Field
                      label="Observed value"
                      value={metric.observedValue}
                      onChange={(value) =>
                        updateMetric(metric.id, "observedValue", value)
                      }
                    />
                  </div>

                  <Field
                    label="Evidence reference"
                    value={metric.evidenceReference}
                    onChange={(value) =>
                      updateMetric(metric.id, "evidenceReference", value)
                    }
                  />
                  <TextArea
                    label="Notes"
                    value={metric.notes}
                    onChange={(value) =>
                      updateMetric(metric.id, "notes", value)
                    }
                    rows={4}
                  />
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="panel section">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">06 · EVIDENCE</p>
              <h2>Outcome evidence state</h2>
            </div>
          </div>

          <label className="field">
            <span>Evidence state</span>
            <select
              value={record.evidenceState}
              onChange={(event) =>
                update("evidenceState", event.target.value as EvidenceState)
              }
            >
              <option value="PRESENT">PRESENT</option>
              <option value="PARTIAL">PARTIAL</option>
              <option value="MISSING">MISSING</option>
              <option value="DISPUTED">DISPUTED</option>
            </select>
          </label>

          <TextArea
            label="Evidence produced"
            value={record.evidenceProduced}
            onChange={(value) => update("evidenceProduced", value)}
            placeholder="List the measurements, receipts, logs, records, observations, or artifacts supporting the outcome."
            rows={7}
          />
        </section>

        <section className="panel section">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">07 · FINDINGS</p>
              <h2>Outcome verification findings</h2>
            </div>
            <button className="ghostButton" onClick={addFinding}>
              Add finding
            </button>
          </div>

          {record.findings.length === 0 ? (
            <div className="emptyState">
              No outcome findings have been declared.
            </div>
          ) : (
            <div className="stack">
              {record.findings.map((finding, index) => (
                <article className="recordCard" key={finding.id}>
                  <div className="cardHeader">
                    <strong>Finding {index + 1}</strong>
                    <button onClick={() => removeFinding(finding.id)}>
                      Remove
                    </button>
                  </div>

                  <div className="grid two">
                    <Field
                      label="Category"
                      value={finding.category}
                      onChange={(value) =>
                        updateFinding(finding.id, "category", value)
                      }
                    />
                    <label className="field">
                      <span>Severity</span>
                      <select
                        value={finding.severity}
                        onChange={(event) =>
                          updateFinding(
                            finding.id,
                            "severity",
                            event.target.value,
                          )
                        }
                      >
                        <option value="LOW">LOW</option>
                        <option value="MODERATE">MODERATE</option>
                        <option value="HIGH">HIGH</option>
                        <option value="CRITICAL">CRITICAL</option>
                      </select>
                    </label>
                  </div>

                  <TextArea
                    label="Finding statement"
                    value={finding.statement}
                    onChange={(value) =>
                      updateFinding(finding.id, "statement", value)
                    }
                    rows={4}
                  />
                  <Field
                    label="Evidence reference"
                    value={finding.evidenceReference}
                    onChange={(value) =>
                      updateFinding(finding.id, "evidenceReference", value)
                    }
                  />
                  <TextArea
                    label="Boundary"
                    value={finding.boundary}
                    onChange={(value) =>
                      updateFinding(finding.id, "boundary", value)
                    }
                    rows={4}
                  />
                  <TextArea
                    label="Required action"
                    value={finding.requiredAction}
                    onChange={(value) =>
                      updateFinding(finding.id, "requiredAction", value)
                    }
                    rows={4}
                  />
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="panel section determinationSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">08 · DETERMINATION</p>
              <h2>Outcome verification determination</h2>
            </div>
            <span className={`verification ${verificationClass}`}>
              {record.outcomeVerification.replaceAll("_", " ")}
            </span>
          </div>

          <label className="field">
            <span>Overall determination</span>
            <select
              value={record.outcomeVerification}
              onChange={(event) =>
                update(
                  "outcomeVerification",
                  event.target.value as VerificationState,
                )
              }
            >
              <option value="NOT_ASSESSED">NOT ASSESSED</option>
              <option value="VERIFIED">VERIFIED</option>
              <option value="PARTIALLY_VERIFIED">
                PARTIALLY VERIFIED
              </option>
              <option value="NOT_VERIFIED">NOT VERIFIED</option>
              <option value="DISPUTED">DISPUTED</option>
            </select>
          </label>

          <div className="grid two">
            <TextArea
              label="What is verified"
              value={record.whatIsVerified}
              onChange={(value) => update("whatIsVerified", value)}
              rows={7}
            />
            <TextArea
              label="What is not verified"
              value={record.whatIsNotVerified}
              onChange={(value) => update("whatIsNotVerified", value)}
              rows={7}
            />
          </div>

          <div className="grid two">
            <TextArea
              label="Unresolved questions"
              value={record.unresolvedQuestions}
              onChange={(value) => update("unresolvedQuestions", value)}
              rows={6}
            />
            <TextArea
              label="Next required record"
              value={record.nextRequiredRecord}
              onChange={(value) => update("nextRequiredRecord", value)}
              rows={6}
            />
          </div>
        </section>

        <section className="panel section preserveSection">
          <div>
            <p className="eyebrow">09 · PRESERVATION</p>
            <h2>Outcome claims remain bounded by evidence.</h2>
            <p>
              Preservation records the observed result, its evidence, its
              baseline comparison, and its limitations. It does not erase
              disputed evidence, create missing measurements, or prove
              causation beyond the declared record boundary.
            </p>
          </div>

          <div className="preserveActions">
            <button className="ghostButton" onClick={() => exportJson(record)}>
              Export current JSON
            </button>
            <button className="primaryButton" onClick={preserve}>
              Preserve Outcome Verification
            </button>
          </div>
        </section>

        <section className="panel section">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">LOCAL LIBRARY</p>
              <h2>Outcome verification records</h2>
            </div>
            <span className="chip">{library.length} records</span>
          </div>

          {library.length === 0 ? (
            <div className="emptyState">
              No outcome verification records have been saved in this browser.
            </div>
          ) : (
            <div className="library">
              {library.map((item) => (
                <article className="libraryCard" key={item.recordId}>
                  <div>
                    <span className="chip">{item.status}</span>
                    <h3>{item.title || "Untitled outcome verification"}</h3>
                    <p>{item.recordId}</p>
                    <small>
                      {item.outcomeVerification.replaceAll("_", " ")} · Version{" "}
                      {item.version} · Updated{" "}
                      {new Date(item.updatedAt).toLocaleString()}
                    </small>
                  </div>

                  <div className="libraryActions">
                    <button onClick={() => reopen(item)}>Reopen</button>
                    <button onClick={() => exportJson(item)}>Export</button>
                    <button onClick={() => remove(item.recordId)}>Remove</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer>
          <Link href="/workspace/governed-records/execution-record">
            ← Governed Execution Record
          </Link>
          <span>TA-14 Governed Records System</span>
          <Link href="/workspace/governed-records">
            Governed Records Home →
          </Link>
        </footer>
      </div>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          background: #050816;
        }

        :global(body) {
          margin: 0;
          background:
            radial-gradient(circle at 15% 12%, rgba(72, 68, 182, 0.2), transparent 34%),
            radial-gradient(circle at 86% 24%, rgba(0, 193, 255, 0.14), transparent 30%),
            linear-gradient(180deg, #050816 0%, #070b1c 48%, #040711 100%);
          color: #f7f9ff;
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        main {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }

        .shell {
          width: min(1240px, calc(100% - 32px));
          margin: 0 auto;
          padding: 24px 0 56px;
          position: relative;
          z-index: 2;
        }

        .ambient {
          position: fixed;
          width: 470px;
          height: 470px;
          border-radius: 999px;
          filter: blur(95px);
          opacity: 0.17;
          pointer-events: none;
          animation: drift 15s ease-in-out infinite alternate;
        }

        .ambientOne {
          background: #654cff;
          top: -180px;
          left: -140px;
        }

        .ambientTwo {
          background: #00d7ff;
          right: -170px;
          top: 40%;
          animation-delay: -6s;
        }

        .stars {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.42;
          background-image:
            radial-gradient(circle, rgba(255,255,255,.72) 0 1px, transparent 1.5px),
            radial-gradient(circle, rgba(113,219,255,.58) 0 1px, transparent 1.5px);
          background-size: 92px 92px, 148px 148px;
          background-position: 0 0, 46px 61px;
          animation: starMove 30s linear infinite;
        }

        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          margin-bottom: 24px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          color: white;
          text-decoration: none;
          font-weight: 800;
        }

        .brandMark {
          padding: 8px 10px;
          border-radius: 10px;
          background: linear-gradient(135deg, #8b72ff, #29c7ff);
          color: #050816;
          font-size: 13px;
          letter-spacing: 0.08em;
        }

        .navLinks {
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
        }

        .navLinks a,
        footer a {
          color: #b9c7ff;
          text-decoration: none;
        }

        .panel {
          background: linear-gradient(
            180deg,
            rgba(14, 20, 46, 0.9),
            rgba(8, 12, 29, 0.88)
          );
          border: 1px solid rgba(147, 167, 255, 0.18);
          box-shadow:
            0 28px 90px rgba(0, 0, 0, 0.34),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border-radius: 24px;
        }

        .hero {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 28px;
          padding: 42px;
          margin-bottom: 20px;
        }

        .eyebrow {
          margin: 0 0 10px;
          color: #6fdfff;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.16em;
        }

        h1 {
          margin: 0;
          font-size: clamp(38px, 7vw, 70px);
          line-height: 0.98;
          letter-spacing: -0.05em;
        }

        h2 {
          margin: 0;
          font-size: clamp(24px, 3vw, 34px);
          letter-spacing: -0.03em;
        }

        h3 {
          margin: 8px 0 5px;
        }

        .heroCopy {
          max-width: 760px;
          color: #c5cce5;
          line-height: 1.7;
          margin: 22px 0 0;
        }

        .heroStats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          align-self: end;
        }

        .heroStats div {
          min-height: 120px;
          padding: 18px;
          border-radius: 18px;
          border: 1px solid rgba(138, 166, 255, 0.18);
          background: rgba(255, 255, 255, 0.03);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }

        .heroStats strong {
          font-size: 22px;
        }

        .heroStats span,
        small {
          color: #8f9abe;
          margin-top: 6px;
        }

        .notice {
          margin: 16px 0;
          padding: 14px 18px;
          display: flex;
          justify-content: space-between;
          gap: 16px;
          border: 1px solid rgba(82, 210, 255, 0.34);
          border-radius: 16px;
          background: rgba(15, 84, 107, 0.24);
        }

        .notice button,
        .cardHeader button,
        .libraryActions button {
          border: 0;
          background: transparent;
          color: #9fe6ff;
          cursor: pointer;
        }

        .toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 20px 24px;
          margin-bottom: 20px;
        }

        .toolbar > div:first-child {
          display: flex;
          flex-direction: column;
        }

        .recordLabel {
          font-size: 11px;
          color: #7edfff;
          letter-spacing: 0.15em;
          font-weight: 800;
        }

        .toolbarActions,
        .preserveActions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        button {
          font: inherit;
        }

        .ghostButton,
        .primaryButton {
          border-radius: 12px;
          padding: 11px 15px;
          cursor: pointer;
          font-weight: 750;
        }

        .ghostButton {
          border: 1px solid rgba(154, 174, 255, 0.23);
          background: rgba(255, 255, 255, 0.035);
          color: #dbe3ff;
        }

        .primaryButton {
          border: 0;
          color: #05101c;
          background: linear-gradient(135deg, #8c7bff, #5be2ff);
          box-shadow: 0 12px 36px rgba(71, 193, 255, 0.2);
        }

        .section {
          padding: 32px;
          margin-bottom: 20px;
        }

        .sectionHeading {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 24px;
        }

        .chip,
        .verification {
          display: inline-flex;
          align-items: center;
          border: 1px solid rgba(134, 160, 255, 0.22);
          background: rgba(255, 255, 255, 0.04);
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
        }

        .verified {
          color: #78f7be;
          border-color: rgba(120, 247, 190, 0.3);
        }

        .partially-verified {
          color: #ffd87b;
          border-color: rgba(255, 216, 123, 0.3);
        }

        .not-verified {
          color: #ff8f9f;
          border-color: rgba(255, 143, 159, 0.3);
        }

        .disputed {
          color: #e5a5ff;
          border-color: rgba(229, 165, 255, 0.3);
        }

        .grid {
          display: grid;
          gap: 16px;
        }

        .grid.two {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .grid.three {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .field span {
          color: #b9c6ec;
          font-size: 13px;
          font-weight: 700;
        }

        input,
        textarea,
        select {
          width: 100%;
          border: 1px solid rgba(137, 157, 231, 0.2);
          border-radius: 13px;
          background: rgba(4, 7, 18, 0.72);
          color: #f6f8ff;
          padding: 13px 14px;
          outline: none;
        }

        textarea {
          resize: vertical;
          line-height: 1.55;
        }

        input:focus,
        textarea:focus,
        select:focus {
          border-color: rgba(89, 216, 255, 0.64);
          box-shadow: 0 0 0 3px rgba(89, 216, 255, 0.08);
        }

        .stack,
        .library {
          display: grid;
          gap: 14px;
        }

        .recordCard,
        .libraryCard {
          border-radius: 18px;
          border: 1px solid rgba(138, 160, 244, 0.16);
          background: rgba(255, 255, 255, 0.024);
          padding: 20px;
        }

        .cardHeader,
        .libraryCard {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 18px;
        }

        .emptyState {
          padding: 34px;
          text-align: center;
          color: #8996be;
          border-radius: 16px;
          border: 1px dashed rgba(142, 164, 240, 0.22);
        }

        .determinationSection {
          background:
            linear-gradient(135deg, rgba(58, 74, 168, 0.16), rgba(16, 112, 149, 0.12)),
            linear-gradient(180deg, rgba(14, 20, 46, 0.9), rgba(8, 12, 29, 0.88));
        }

        .preserveSection {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          background:
            linear-gradient(135deg, rgba(80, 61, 174, 0.22), rgba(16, 123, 164, 0.18)),
            linear-gradient(180deg, rgba(14, 20, 46, 0.9), rgba(8, 12, 29, 0.88));
        }

        .preserveSection p:last-child {
          max-width: 780px;
          line-height: 1.65;
          color: #bdc6e3;
        }

        .libraryCard p {
          margin: 0;
          color: #9ca9cd;
        }

        .libraryActions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        footer {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          padding: 22px 4px 0;
          color: #7f8aad;
          font-size: 13px;
        }

        @keyframes drift {
          from {
            transform: translate3d(0, 0, 0) scale(1);
          }
          to {
            transform: translate3d(70px, 35px, 0) scale(1.12);
          }
        }

        @keyframes starMove {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(148px);
          }
        }

        @media (max-width: 980px) {
          .hero {
            grid-template-columns: 1fr;
          }

          .grid.three {
            grid-template-columns: 1fr 1fr;
          }

          .toolbar,
          .preserveSection {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 700px) {
          .shell {
            width: min(100% - 20px, 1240px);
          }

          .topbar,
          .sectionHeading,
          .libraryCard,
          footer {
            flex-direction: column;
            align-items: flex-start;
          }

          .hero,
          .section {
            padding: 24px;
          }

          .heroStats,
          .grid.two,
          .grid.three {
            grid-template-columns: 1fr;
          }

          .toolbarActions,
          .preserveActions {
            width: 100%;
          }

          .toolbarActions button,
          .preserveActions button {
            flex: 1;
          }
        }
      `}</style>
    </main>
  );
}
