"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ExecutionStatus =
  | "DRAFT"
  | "READY_TO_PRESERVE"
  | "PRESERVED"
  | "SUPERSEDED"
  | "WITHDRAWN";

type ExecutionOutcome =
  | "NOT_RECORDED"
  | "COMPLETED_AS_AUTHORIZED"
  | "COMPLETED_WITH_VARIANCE"
  | "PARTIALLY_COMPLETED"
  | "ABORTED"
  | "FAILED"
  | "DISPUTED";

type GateState = "PASS" | "HOLD" | "FAIL" | "UNKNOWN";

type ExecutionEvent = {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  authorityReference: string;
  evidenceReference: string;
  result: string;
};

type Variance = {
  id: string;
  category: string;
  severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  description: string;
  authorizationImpact: string;
  correctiveAction: string;
};

type ExecutionRecord = {
  recordId: string;
  title: string;
  sourceReadinessId: string;
  sourceAdmissibilityId: string;
  sourceAuthorityId: string;
  sourceEvidenceId: string;
  sourceContinuityId: string;
  sourceInterpretationId: string;
  sourceGovernedRecordId: string;
  executor: string;
  organization: string;
  executionLocation: string;
  executionStartedAt: string;
  executionEndedAt: string;
  authorizedScope: string;
  actualScope: string;
  governingAuthority: string;
  executionConstraints: string;
  preExecutionState: string;
  postExecutionState: string;
  outcome: ExecutionOutcome;
  outcomeSummary: string;
  whatOccurred: string;
  whatDidNotOccur: string;
  evidenceProduced: string;
  unresolvedIssues: string;
  events: ExecutionEvent[];
  variances: Variance[];
  gates: {
    readinessPreserved: GateState;
    authorityCurrent: GateState;
    admissibilityCurrent: GateState;
    identityVerified: GateState;
    scopeBounded: GateState;
    timeWindowValid: GateState;
    versionCurrent: GateState;
    noBlockingHold: GateState;
  };
  status: ExecutionStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
  preservedAt: string;
};

const WORKSPACE_KEY = "ta14-governed-execution-record-workspace-v1";
const LIBRARY_KEY = "ta14-governed-execution-record-library-v1";

const emptyEvent = (): ExecutionEvent => ({
  id: crypto.randomUUID(),
  timestamp: "",
  actor: "",
  action: "",
  authorityReference: "",
  evidenceReference: "",
  result: "",
});

const emptyVariance = (): Variance => ({
  id: crypto.randomUUID(),
  category: "",
  severity: "LOW",
  description: "",
  authorizationImpact: "",
  correctiveAction: "",
});

const makeRecordId = () => {
  const now = new Date();
  const stamp = now
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `TA-14-GER-${stamp}-${suffix}`;
};

const blankRecord = (): ExecutionRecord => {
  const now = new Date().toISOString();
  return {
    recordId: makeRecordId(),
    title: "",
    sourceReadinessId: "",
    sourceAdmissibilityId: "",
    sourceAuthorityId: "",
    sourceEvidenceId: "",
    sourceContinuityId: "",
    sourceInterpretationId: "",
    sourceGovernedRecordId: "",
    executor: "",
    organization: "",
    executionLocation: "",
    executionStartedAt: "",
    executionEndedAt: "",
    authorizedScope: "",
    actualScope: "",
    governingAuthority: "",
    executionConstraints: "",
    preExecutionState: "",
    postExecutionState: "",
    outcome: "NOT_RECORDED",
    outcomeSummary: "",
    whatOccurred: "",
    whatDidNotOccur: "",
    evidenceProduced: "",
    unresolvedIssues: "",
    events: [],
    variances: [],
    gates: {
      readinessPreserved: "UNKNOWN",
      authorityCurrent: "UNKNOWN",
      admissibilityCurrent: "UNKNOWN",
      identityVerified: "UNKNOWN",
      scopeBounded: "UNKNOWN",
      timeWindowValid: "UNKNOWN",
      versionCurrent: "UNKNOWN",
      noBlockingHold: "UNKNOWN",
    },
    status: "DRAFT",
    version: 1,
    createdAt: now,
    updatedAt: now,
    preservedAt: "",
  };
};

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

function GateSelector({
  label,
  value,
  onChange,
}: {
  label: string;
  value: GateState;
  onChange: (value: GateState) => void;
}) {
  return (
    <label className="gate">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as GateState)}
      >
        <option value="UNKNOWN">UNKNOWN</option>
        <option value="PASS">PASS</option>
        <option value="HOLD">HOLD</option>
        <option value="FAIL">FAIL</option>
      </select>
    </label>
  );
}

export default function GovernedExecutionRecordPage() {
  const [record, setRecord] = useState<ExecutionRecord>(blankRecord());
  const [library, setLibrary] = useState<ExecutionRecord[]>([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const storedWorkspace = safeParse<ExecutionRecord | null>(
      localStorage.getItem(WORKSPACE_KEY),
      null,
    );
    const storedLibrary = safeParse<ExecutionRecord[]>(
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

  const gateValues = Object.values(record.gates);

  const readiness = useMemo(() => {
    if (gateValues.includes("FAIL")) return "NOT READY";
    if (gateValues.includes("HOLD")) return "HOLD";
    if (gateValues.includes("UNKNOWN")) return "INCOMPLETE";
    return "READY";
  }, [gateValues]);

  const completion = useMemo(() => {
    const checks = [
      record.title,
      record.sourceReadinessId,
      record.sourceAdmissibilityId,
      record.sourceAuthorityId,
      record.sourceGovernedRecordId,
      record.executor,
      record.organization,
      record.executionStartedAt,
      record.executionEndedAt,
      record.authorizedScope,
      record.actualScope,
      record.governingAuthority,
      record.preExecutionState,
      record.postExecutionState,
      record.outcome !== "NOT_RECORDED" ? "yes" : "",
      record.outcomeSummary,
      record.whatOccurred,
      record.evidenceProduced,
      readiness === "READY" ? "yes" : "",
    ];
    return Math.round(
      (checks.filter((value) => Boolean(value)).length / checks.length) * 100,
    );
  }, [record, readiness]);

  const update = <K extends keyof ExecutionRecord>(
    key: K,
    value: ExecutionRecord[K],
  ) => {
    setRecord((current) => ({
      ...current,
      [key]: value,
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateGate = (key: keyof ExecutionRecord["gates"], value: GateState) => {
    setRecord((current) => ({
      ...current,
      gates: { ...current.gates, [key]: value },
      updatedAt: new Date().toISOString(),
    }));
  };

  const addEvent = () => {
    update("events", [...record.events, emptyEvent()]);
  };

  const updateEvent = (
    id: string,
    key: keyof ExecutionEvent,
    value: string,
  ) => {
    update(
      "events",
      record.events.map((event) =>
        event.id === id ? { ...event, [key]: value } : event,
      ),
    );
  };

  const removeEvent = (id: string) => {
    update(
      "events",
      record.events.filter((event) => event.id !== id),
    );
  };

  const addVariance = () => {
    update("variances", [...record.variances, emptyVariance()]);
  };

  const updateVariance = (
    id: string,
    key: keyof Variance,
    value: string,
  ) => {
    update(
      "variances",
      record.variances.map((variance) =>
        variance.id === id ? { ...variance, [key]: value } : variance,
      ),
    );
  };

  const removeVariance = (id: string) => {
    update(
      "variances",
      record.variances.filter((variance) => variance.id !== id),
    );
  };

  const preserve = () => {
    if (readiness !== "READY") {
      setNotice(
        "The execution record cannot be preserved as complete while governance gates remain unresolved.",
      );
      return;
    }

    const now = new Date().toISOString();
    const preserved: ExecutionRecord = {
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
    setNotice("Governed Execution Record preserved in this browser.");
  };

  const saveDraft = () => {
    const now = new Date().toISOString();
    const draft: ExecutionRecord = {
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
    setNotice("Draft saved in this browser.");
  };

  const reopen = (item: ExecutionRecord) => {
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
    setNotice("New Governed Execution Record started.");
  };

  const exportJson = (item: ExecutionRecord) => {
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

  const loadSample = () => {
    const now = new Date();
    const ended = new Date(now.getTime() + 45 * 60 * 1000);
    setRecord({
      ...blankRecord(),
      title: "Authorized Vendor Payment Execution",
      sourceReadinessId: "TA-14-ERR-EXAMPLE-001",
      sourceAdmissibilityId: "TA-14-ADR-EXAMPLE-001",
      sourceAuthorityId: "TA-14-AUR-EXAMPLE-001",
      sourceEvidenceId: "TA-14-ESR-EXAMPLE-001",
      sourceContinuityId: "TA-14-CR-EXAMPLE-001",
      sourceInterpretationId: "TA-14-GIR-EXAMPLE-001",
      sourceGovernedRecordId: "TA-14-GR-EXAMPLE-001",
      executor: "Authorized Finance Operator",
      organization: "TA-14 Demonstration Organization",
      executionLocation: "Governed digital payment environment",
      executionStartedAt: now.toISOString().slice(0, 16),
      executionEndedAt: ended.toISOString().slice(0, 16),
      authorizedScope:
        "Release one vendor payment of $27,500 to the verified beneficiary under the preserved procurement and finance authority.",
      actualScope:
        "One vendor payment of $27,500 was submitted to the verified beneficiary. No additional payment or account change occurred.",
      governingAuthority:
        "Preserved procurement approval, finance approval, verified beneficiary record, and execution-readiness determination.",
      executionConstraints:
        "Single payment only; named beneficiary only; amount not to exceed $27,500; execution within the approved time window.",
      preExecutionState:
        "Payment request approved, beneficiary verified, authority current, no blocking HOLD remained.",
      postExecutionState:
        "Payment instruction accepted by the authorized payment system and receipt generated.",
      outcome: "COMPLETED_AS_AUTHORIZED",
      outcomeSummary:
        "Execution completed within the declared authority, amount, beneficiary, and time boundaries.",
      whatOccurred:
        "The authorized operator submitted the approved payment instruction and received a transaction receipt.",
      whatDidNotOccur:
        "No beneficiary change, duplicate payment, amount increase, or execution outside the approved window occurred.",
      evidenceProduced:
        "Payment-system transaction receipt, executor identity log, timestamp, beneficiary confirmation, and preserved execution event history.",
      unresolvedIssues: "None declared at preservation.",
      gates: {
        readinessPreserved: "PASS",
        authorityCurrent: "PASS",
        admissibilityCurrent: "PASS",
        identityVerified: "PASS",
        scopeBounded: "PASS",
        timeWindowValid: "PASS",
        versionCurrent: "PASS",
        noBlockingHold: "PASS",
      },
      events: [
        {
          id: crypto.randomUUID(),
          timestamp: now.toISOString(),
          actor: "Authorized Finance Operator",
          action: "Submitted approved vendor payment instruction.",
          authorityReference: "TA-14-AUR-EXAMPLE-001",
          evidenceReference: "Payment receipt and identity log",
          result: "Instruction accepted.",
        },
      ],
    });
    setNotice("Sample execution record loaded.");
  };

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
            <Link href="/workspace/governed-records/execution-readiness">
              Previous
            </Link>
            <Link href="/workspace/governed-records">Records Home</Link>
          </div>
        </nav>

        <section className="hero panel">
          <div>
            <p className="eyebrow">FINAL EXECUTION LAYER</p>
            <h1>Governed Execution Record</h1>
            <p className="heroCopy">
              Preserve what actually occurred after admissibility, authority,
              and execution readiness were established. This page records
              execution. It does not retroactively create authority, repair
              missing evidence, or convert an unauthorized act into an
              admissible one.
            </p>
          </div>

          <div className="heroStats">
            <div>
              <strong>{completion}%</strong>
              <span>Complete</span>
            </div>
            <div>
              <strong>{readiness}</strong>
              <span>Gate state</span>
            </div>
            <div>
              <strong>{record.events.length}</strong>
              <span>Events</span>
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
              <h2>Execution identity</h2>
            </div>
            <span className="chip">{record.status}</span>
          </div>

          <div className="grid two">
            <Field
              label="Execution title"
              value={record.title}
              onChange={(value) => update("title", value)}
              placeholder="Name the governed execution"
            />
            <Field
              label="Execution record ID"
              value={record.recordId}
              onChange={(value) => update("recordId", value)}
            />
            <Field
              label="Executor"
              value={record.executor}
              onChange={(value) => update("executor", value)}
              placeholder="Authorized person or system"
            />
            <Field
              label="Organization"
              value={record.organization}
              onChange={(value) => update("organization", value)}
            />
            <Field
              label="Execution location"
              value={record.executionLocation}
              onChange={(value) => update("executionLocation", value)}
            />
            <Field
              label="Governing authority"
              value={record.governingAuthority}
              onChange={(value) => update("governingAuthority", value)}
            />
            <Field
              label="Execution started"
              value={record.executionStartedAt}
              onChange={(value) => update("executionStartedAt", value)}
              type="datetime-local"
            />
            <Field
              label="Execution ended"
              value={record.executionEndedAt}
              onChange={(value) => update("executionEndedAt", value)}
              type="datetime-local"
            />
          </div>
        </section>

        <section className="panel section">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">02 · GOVERNANCE LINEAGE</p>
              <h2>Bound upstream records</h2>
            </div>
          </div>

          <div className="grid two">
            <Field
              label="Execution Readiness Review ID"
              value={record.sourceReadinessId}
              onChange={(value) => update("sourceReadinessId", value)}
            />
            <Field
              label="Admissibility Review ID"
              value={record.sourceAdmissibilityId}
              onChange={(value) => update("sourceAdmissibilityId", value)}
            />
            <Field
              label="Authority Review ID"
              value={record.sourceAuthorityId}
              onChange={(value) => update("sourceAuthorityId", value)}
            />
            <Field
              label="Evidence Sufficiency Review ID"
              value={record.sourceEvidenceId}
              onChange={(value) => update("sourceEvidenceId", value)}
            />
            <Field
              label="Continuity Review ID"
              value={record.sourceContinuityId}
              onChange={(value) => update("sourceContinuityId", value)}
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
              <p className="eyebrow">03 · PRE-EXECUTION GATES</p>
              <h2>Execution boundary confirmation</h2>
            </div>
            <span className={`readiness ${readiness.replaceAll(" ", "-").toLowerCase()}`}>
              {readiness}
            </span>
          </div>

          <div className="gateGrid">
            <GateSelector
              label="Execution readiness preserved"
              value={record.gates.readinessPreserved}
              onChange={(value) => updateGate("readinessPreserved", value)}
            />
            <GateSelector
              label="Authority current"
              value={record.gates.authorityCurrent}
              onChange={(value) => updateGate("authorityCurrent", value)}
            />
            <GateSelector
              label="Admissibility current"
              value={record.gates.admissibilityCurrent}
              onChange={(value) => updateGate("admissibilityCurrent", value)}
            />
            <GateSelector
              label="Executor identity verified"
              value={record.gates.identityVerified}
              onChange={(value) => updateGate("identityVerified", value)}
            />
            <GateSelector
              label="Scope bounded"
              value={record.gates.scopeBounded}
              onChange={(value) => updateGate("scopeBounded", value)}
            />
            <GateSelector
              label="Execution window valid"
              value={record.gates.timeWindowValid}
              onChange={(value) => updateGate("timeWindowValid", value)}
            />
            <GateSelector
              label="Governing version current"
              value={record.gates.versionCurrent}
              onChange={(value) => updateGate("versionCurrent", value)}
            />
            <GateSelector
              label="No blocking HOLD"
              value={record.gates.noBlockingHold}
              onChange={(value) => updateGate("noBlockingHold", value)}
            />
          </div>
        </section>

        <section className="panel section">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">04 · AUTHORIZED VS. ACTUAL</p>
              <h2>Execution scope comparison</h2>
            </div>
          </div>

          <div className="grid two">
            <TextArea
              label="Authorized scope"
              value={record.authorizedScope}
              onChange={(value) => update("authorizedScope", value)}
              placeholder="Declare exactly what was authorized."
              rows={7}
            />
            <TextArea
              label="Actual scope"
              value={record.actualScope}
              onChange={(value) => update("actualScope", value)}
              placeholder="Declare exactly what was actually performed."
              rows={7}
            />
          </div>

          <TextArea
            label="Execution constraints"
            value={record.executionConstraints}
            onChange={(value) => update("executionConstraints", value)}
            placeholder="Amount, system, beneficiary, location, time, identity, version, or other constraints."
            rows={5}
          />
        </section>

        <section className="panel section">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">05 · STATE TRANSITION</p>
              <h2>Before and after execution</h2>
            </div>
          </div>

          <div className="grid two">
            <TextArea
              label="Pre-execution state"
              value={record.preExecutionState}
              onChange={(value) => update("preExecutionState", value)}
              placeholder="State immediately before execution."
              rows={7}
            />
            <TextArea
              label="Post-execution state"
              value={record.postExecutionState}
              onChange={(value) => update("postExecutionState", value)}
              placeholder="State immediately after execution."
              rows={7}
            />
          </div>
        </section>

        <section className="panel section">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">06 · EXECUTION EVENTS</p>
              <h2>Chronological event record</h2>
            </div>
            <button className="ghostButton" onClick={addEvent}>
              Add event
            </button>
          </div>

          {record.events.length === 0 ? (
            <div className="emptyState">
              No execution events have been added.
            </div>
          ) : (
            <div className="stack">
              {record.events.map((event, index) => (
                <article className="eventCard" key={event.id}>
                  <div className="cardHeader">
                    <strong>Event {index + 1}</strong>
                    <button onClick={() => removeEvent(event.id)}>Remove</button>
                  </div>
                  <div className="grid two">
                    <Field
                      label="Timestamp"
                      value={event.timestamp}
                      onChange={(value) =>
                        updateEvent(event.id, "timestamp", value)
                      }
                      type="datetime-local"
                    />
                    <Field
                      label="Actor"
                      value={event.actor}
                      onChange={(value) =>
                        updateEvent(event.id, "actor", value)
                      }
                    />
                    <Field
                      label="Authority reference"
                      value={event.authorityReference}
                      onChange={(value) =>
                        updateEvent(event.id, "authorityReference", value)
                      }
                    />
                    <Field
                      label="Evidence reference"
                      value={event.evidenceReference}
                      onChange={(value) =>
                        updateEvent(event.id, "evidenceReference", value)
                      }
                    />
                  </div>
                  <TextArea
                    label="Action"
                    value={event.action}
                    onChange={(value) =>
                      updateEvent(event.id, "action", value)
                    }
                    rows={3}
                  />
                  <TextArea
                    label="Result"
                    value={event.result}
                    onChange={(value) =>
                      updateEvent(event.id, "result", value)
                    }
                    rows={3}
                  />
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="panel section">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">07 · VARIANCE CONTROL</p>
              <h2>Departures from authorized execution</h2>
            </div>
            <button className="ghostButton" onClick={addVariance}>
              Add variance
            </button>
          </div>

          {record.variances.length === 0 ? (
            <div className="emptyState">
              No execution variances have been declared.
            </div>
          ) : (
            <div className="stack">
              {record.variances.map((variance, index) => (
                <article className="eventCard" key={variance.id}>
                  <div className="cardHeader">
                    <strong>Variance {index + 1}</strong>
                    <button onClick={() => removeVariance(variance.id)}>
                      Remove
                    </button>
                  </div>

                  <div className="grid two">
                    <Field
                      label="Category"
                      value={variance.category}
                      onChange={(value) =>
                        updateVariance(variance.id, "category", value)
                      }
                    />
                    <label className="field">
                      <span>Severity</span>
                      <select
                        value={variance.severity}
                        onChange={(event) =>
                          updateVariance(
                            variance.id,
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
                    label="Description"
                    value={variance.description}
                    onChange={(value) =>
                      updateVariance(variance.id, "description", value)
                    }
                    rows={4}
                  />
                  <TextArea
                    label="Authorization impact"
                    value={variance.authorizationImpact}
                    onChange={(value) =>
                      updateVariance(
                        variance.id,
                        "authorizationImpact",
                        value,
                      )
                    }
                    rows={4}
                  />
                  <TextArea
                    label="Corrective action"
                    value={variance.correctiveAction}
                    onChange={(value) =>
                      updateVariance(variance.id, "correctiveAction", value)
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
              <p className="eyebrow">08 · OUTCOME</p>
              <h2>Execution outcome determination</h2>
            </div>
          </div>

          <label className="field">
            <span>Outcome</span>
            <select
              value={record.outcome}
              onChange={(event) =>
                update("outcome", event.target.value as ExecutionOutcome)
              }
            >
              <option value="NOT_RECORDED">NOT RECORDED</option>
              <option value="COMPLETED_AS_AUTHORIZED">
                COMPLETED AS AUTHORIZED
              </option>
              <option value="COMPLETED_WITH_VARIANCE">
                COMPLETED WITH VARIANCE
              </option>
              <option value="PARTIALLY_COMPLETED">
                PARTIALLY COMPLETED
              </option>
              <option value="ABORTED">ABORTED</option>
              <option value="FAILED">FAILED</option>
              <option value="DISPUTED">DISPUTED</option>
            </select>
          </label>

          <TextArea
            label="Outcome summary"
            value={record.outcomeSummary}
            onChange={(value) => update("outcomeSummary", value)}
            rows={5}
          />

          <div className="grid two">
            <TextArea
              label="What occurred"
              value={record.whatOccurred}
              onChange={(value) => update("whatOccurred", value)}
              rows={7}
            />
            <TextArea
              label="What did not occur"
              value={record.whatDidNotOccur}
              onChange={(value) => update("whatDidNotOccur", value)}
              rows={7}
            />
          </div>

          <div className="grid two">
            <TextArea
              label="Evidence produced by execution"
              value={record.evidenceProduced}
              onChange={(value) => update("evidenceProduced", value)}
              rows={7}
            />
            <TextArea
              label="Unresolved issues"
              value={record.unresolvedIssues}
              onChange={(value) => update("unresolvedIssues", value)}
              rows={7}
            />
          </div>
        </section>

        <section className="panel section preserveSection">
          <div>
            <p className="eyebrow">09 · PRESERVATION</p>
            <h2>No admissible evidence. No admissible execution.</h2>
            <p>
              Preservation records what occurred under the declared authority,
              evidence, admissibility, and execution-readiness boundaries. It
              does not erase variance, repair missing authority, or authorize
              execution after the fact.
            </p>
          </div>
          <div className="preserveActions">
            <button className="ghostButton" onClick={() => exportJson(record)}>
              Export current JSON
            </button>
            <button className="primaryButton" onClick={preserve}>
              Preserve Governed Execution Record
            </button>
          </div>
        </section>

        <section className="panel section">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">LOCAL LIBRARY</p>
              <h2>Preserved and draft execution records</h2>
            </div>
            <span className="chip">{library.length} records</span>
          </div>

          {library.length === 0 ? (
            <div className="emptyState">
              No governed execution records have been preserved in this browser.
            </div>
          ) : (
            <div className="library">
              {library.map((item) => (
                <article className="libraryCard" key={item.recordId}>
                  <div>
                    <span className="chip">{item.status}</span>
                    <h3>{item.title || "Untitled execution record"}</h3>
                    <p>{item.recordId}</p>
                    <small>
                      Version {item.version} · Updated{" "}
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
          <Link href="/workspace/governed-records/execution-readiness">
            ← Execution Readiness
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
            radial-gradient(circle at 20% 10%, rgba(61, 72, 167, 0.18), transparent 32%),
            radial-gradient(circle at 85% 20%, rgba(0, 184, 255, 0.13), transparent 30%),
            linear-gradient(180deg, #050816 0%, #070b1c 45%, #040711 100%);
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
          width: 460px;
          height: 460px;
          border-radius: 999px;
          filter: blur(90px);
          opacity: 0.18;
          pointer-events: none;
          animation: drift 14s ease-in-out infinite alternate;
        }

        .ambientOne {
          background: #6048ff;
          top: -180px;
          left: -120px;
        }

        .ambientTwo {
          background: #00d7ff;
          right: -160px;
          top: 34%;
          animation-delay: -5s;
        }

        .stars {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.45;
          background-image:
            radial-gradient(circle, rgba(255,255,255,.7) 0 1px, transparent 1.5px),
            radial-gradient(circle, rgba(124,219,255,.6) 0 1px, transparent 1.5px);
          background-size: 90px 90px, 140px 140px;
          background-position: 0 0, 45px 55px;
          animation: starMove 28s linear infinite;
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
          font-size: clamp(38px, 7vw, 72px);
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
          line-height: 1.05;
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
        .readiness {
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

        .ready {
          color: #78f7be;
          border-color: rgba(120, 247, 190, 0.3);
        }

        .hold {
          color: #ffd87b;
          border-color: rgba(255, 216, 123, 0.3);
        }

        .not-ready {
          color: #ff8f9f;
          border-color: rgba(255, 143, 159, 0.3);
        }

        .incomplete {
          color: #aab8e5;
        }

        .grid {
          display: grid;
          gap: 16px;
        }

        .grid.two {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .field span,
        .gate span {
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

        .gateGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .gate {
          padding: 16px;
          border: 1px solid rgba(139, 163, 244, 0.16);
          background: rgba(255,255,255,0.025);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .stack,
        .library {
          display: grid;
          gap: 14px;
        }

        .eventCard,
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
            transform: translateY(140px);
          }
        }

        @media (max-width: 980px) {
          .hero {
            grid-template-columns: 1fr;
          }

          .gateGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
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
          .gateGrid {
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
