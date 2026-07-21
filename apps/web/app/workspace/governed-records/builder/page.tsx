"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type RecordStatus =
  | "DRAFT"
  | "READY_FOR_REVIEW"
  | "PRESERVED"
  | "SUPERSEDED"
  | "WITHDRAWN";

type Visibility = "PRIVATE" | "SELECTIVE" | "PUBLIC";

type EvidenceItem = {
  evidenceId: string;
  title: string;
  source: string;
  evidenceType: string;
  notes: string;
  addedAt: string;
};

type GovernedRecord = {
  recordId: string;
  title: string;
  recordType: string;
  domain: string;
  owner: string;
  steward: string;
  status: RecordStatus;
  visibility: Visibility;
  version: string;
  realityObserved: string;
  recordStatement: string;
  timeBoundary: string;
  geographicBoundary: string;
  systemBoundary: string;
  authorityBoundary: string;
  includedClaims: string;
  explicitNonClaims: string;
  continuityStatement: string;
  admissibilityStatement: string;
  bindingStatement: string;
  commitStatement: string;
  executionStatement: string;
  outcomeStatement: string;
  limitations: string;
  evidence: EvidenceItem[];
  createdAt: string;
  updatedAt: string;
};

const WORKSPACE_KEY = "ta14-governed-record-builder-v1";
const LIBRARY_KEY = "ta14-governed-record-library-v1";

const emptyRecord: GovernedRecord = {
  recordId: "",
  title: "",
  recordType: "Governed Record",
  domain: "AI Governance",
  owner: "",
  steward: "",
  status: "DRAFT",
  visibility: "PRIVATE",
  version: "1.0",
  realityObserved: "",
  recordStatement: "",
  timeBoundary: "",
  geographicBoundary: "",
  systemBoundary: "",
  authorityBoundary: "",
  includedClaims: "",
  explicitNonClaims: "",
  continuityStatement: "",
  admissibilityStatement: "",
  bindingStatement: "",
  commitStatement: "",
  executionStatement: "",
  outcomeStatement: "",
  limitations: "",
  evidence: [],
  createdAt: "",
  updatedAt: "",
};

const statusLabels: Record<RecordStatus, string> = {
  DRAFT: "Draft",
  READY_FOR_REVIEW: "Ready for Review",
  PRESERVED: "Preserved",
  SUPERSEDED: "Superseded",
  WITHDRAWN: "Withdrawn",
};

function createIdentifier(prefix: string) {
  const now = new Date();
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");
  const time = [
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ].join("");
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();

  return `TA-14-${prefix}-${date}-${time}-${random}`;
}

export default function GovernedRecordBuilderPage() {
  const [record, setRecord] = useState<GovernedRecord>(emptyRecord);
  const [library, setLibrary] = useState<GovernedRecord[]>([]);
  const [notice, setNotice] = useState("");
  const [evidenceDraft, setEvidenceDraft] = useState({
    title: "",
    source: "",
    evidenceType: "Document",
    notes: "",
  });

  useEffect(() => {
    const savedWorkspace = window.localStorage.getItem(WORKSPACE_KEY);
    const savedLibrary = window.localStorage.getItem(LIBRARY_KEY);

    if (savedWorkspace) {
      try {
        setRecord(JSON.parse(savedWorkspace) as GovernedRecord);
      } catch {
        window.localStorage.removeItem(WORKSPACE_KEY);
      }
    }

    if (savedLibrary) {
      try {
        const parsed = JSON.parse(savedLibrary) as GovernedRecord[];
        setLibrary(Array.isArray(parsed) ? parsed : []);
      } catch {
        window.localStorage.removeItem(LIBRARY_KEY);
      }
    }
  }, []);

  const updateRecord = <K extends keyof GovernedRecord>(
    field: K,
    value: GovernedRecord[K],
  ) => {
    setRecord((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const chainCompletion = useMemo(() => {
    const fields = [
      record.realityObserved,
      record.recordStatement,
      record.continuityStatement,
      record.admissibilityStatement,
      record.bindingStatement,
      record.commitStatement,
      record.executionStatement,
      record.outcomeStatement,
    ];
    const completed = fields.filter((field) => field.trim()).length;

    return Math.round((completed / fields.length) * 100);
  }, [record]);

  const saveDraft = () => {
    const timestamp = new Date().toISOString();
    const nextRecord: GovernedRecord = {
      ...record,
      recordId: record.recordId || createIdentifier("GR"),
      createdAt: record.createdAt || timestamp,
      updatedAt: timestamp,
    };

    setRecord(nextRecord);
    window.localStorage.setItem(WORKSPACE_KEY, JSON.stringify(nextRecord));
    setNotice(
      `${nextRecord.recordId} has been saved as a browser-local working record. It has not been verified, interpreted, certified, or published.`,
    );
  };

  const preserveRecord = () => {
    if (!record.title.trim() || !record.recordStatement.trim()) {
      setNotice(
        "A record title and record statement are required before preservation.",
      );
      return;
    }

    const timestamp = new Date().toISOString();
    const nextRecord: GovernedRecord = {
      ...record,
      recordId: record.recordId || createIdentifier("GR"),
      status: record.status === "DRAFT" ? "PRESERVED" : record.status,
      createdAt: record.createdAt || timestamp,
      updatedAt: timestamp,
    };

    const exists = library.some((item) => item.recordId === nextRecord.recordId);
    const nextLibrary = exists
      ? library.map((item) =>
          item.recordId === nextRecord.recordId ? nextRecord : item,
        )
      : [nextRecord, ...library];

    setRecord(nextRecord);
    setLibrary(nextLibrary);
    window.localStorage.setItem(WORKSPACE_KEY, JSON.stringify(nextRecord));
    window.localStorage.setItem(LIBRARY_KEY, JSON.stringify(nextLibrary));
    setNotice(
      `${nextRecord.recordId} has been preserved in this browser. Preservation does not establish admissibility, truth, legal compliance, certification, or authority.`,
    );
  };

  const clearWorkspace = () => {
    setRecord(emptyRecord);
    setEvidenceDraft({
      title: "",
      source: "",
      evidenceType: "Document",
      notes: "",
    });
    window.localStorage.removeItem(WORKSPACE_KEY);
    setNotice(
      "The working record has been cleared. Preserved browser-local records remain available below.",
    );
  };

  const addEvidence = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!evidenceDraft.title.trim()) {
      setNotice("Evidence title is required.");
      return;
    }

    const evidence: EvidenceItem = {
      evidenceId: createIdentifier("EVID"),
      title: evidenceDraft.title.trim(),
      source: evidenceDraft.source.trim(),
      evidenceType: evidenceDraft.evidenceType,
      notes: evidenceDraft.notes.trim(),
      addedAt: new Date().toISOString(),
    };

    setRecord((current) => ({
      ...current,
      evidence: [...current.evidence, evidence],
    }));

    setEvidenceDraft({
      title: "",
      source: "",
      evidenceType: "Document",
      notes: "",
    });
    setNotice(
      `${evidence.evidenceId} has been added as declared evidence. Its authenticity, continuity, and admissibility remain separate determinations.`,
    );
  };

  const removeEvidence = (evidenceId: string) => {
    setRecord((current) => ({
      ...current,
      evidence: current.evidence.filter(
        (item) => item.evidenceId !== evidenceId,
      ),
    }));
    setNotice(`${evidenceId} has been removed from the working record.`);
  };

  const openRecord = (item: GovernedRecord) => {
    setRecord(item);
    window.localStorage.setItem(WORKSPACE_KEY, JSON.stringify(item));
    setNotice(`${item.recordId} has been reopened in the builder.`);
    document.getElementById("identity")?.scrollIntoView({ behavior: "smooth" });
  };

  const removeRecord = (recordId: string) => {
    const nextLibrary = library.filter((item) => item.recordId !== recordId);
    setLibrary(nextLibrary);
    window.localStorage.setItem(LIBRARY_KEY, JSON.stringify(nextLibrary));
    setNotice(`${recordId} has been removed from this browser.`);
  };

  const exportRecord = (item: GovernedRecord) => {
    const blob = new Blob([JSON.stringify(item, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${item.recordId || "TA-14-governed-record"}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="page">
      <div className="ambient" aria-hidden="true">
        <span className="star star-one" />
        <span className="star star-two" />
        <span className="star star-three" />
        <span className="line line-one" />
        <span className="line line-two" />
        <span className="orbit orbit-one" />
        <span className="orbit orbit-two" />
        <span className="particle particle-one" />
        <span className="particle particle-two" />
        <span className="particle particle-three" />
      </div>

      <header className="topbar">
        <Link className="brand" href="/">
          <span>TA-14</span>
          <div>
            <strong>Governed Record Builder</strong>
            <small>TA-14 AI Governance Exchange</small>
          </div>
        </Link>

        <nav>
          <Link href="/workspace/governed-records">Introduction</Link>
          <a href="#identity">Identity</a>
          <a href="#chain">TA-14 Chain</a>
          <a href="#evidence">Evidence</a>
          <a href="#library">Records</a>
        </nav>
      </header>

      <section className="hero shell">
        <div>
          <p className="eyebrow">GOVERNED RECORD BUILDER</p>
          <h1>Preserve the record before anyone interprets it.</h1>
          <p className="lead">
            Build a bounded, attributable record of what was observed, what was
            declared, which evidence was attached, what the record claims, and
            what it explicitly does not claim.
          </p>

          <div className="hero-actions">
            <a className="button primary" href="#identity">
              Begin Record
            </a>
            <a className="button secondary" href="#library">
              Open Preserved Records
            </a>
          </div>

          <div className="principles">
            <span>Record ≠ Interpretation</span>
            <span>Interpretation ≠ Diagnosis</span>
            <span>Diagnosis ≠ Optimization</span>
          </div>
        </div>

        <aside className="completion-card">
          <p className="panel-label">CHAIN COMPLETION</p>
          <strong>{chainCompletion}%</strong>
          <div className="progress">
            <span style={{ width: `${chainCompletion}%` }} />
          </div>
          <p>
            Completion only indicates that chain fields contain declarations. It
            does not establish admissibility or correctness.
          </p>
          <dl>
            <div>
              <dt>Evidence</dt>
              <dd>{record.evidence.length}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{statusLabels[record.status]}</dd>
            </div>
            <div>
              <dt>Version</dt>
              <dd>{record.version || "Not declared"}</dd>
            </div>
          </dl>
        </aside>
      </section>

      {notice ? (
        <div className="notice shell" role="status">
          {notice}
        </div>
      ) : null}

      <section className="section shell" id="identity">
        <div className="section-heading">
          <p className="eyebrow">01 — RECORD IDENTITY</p>
          <h2>Identify the artifact and the party responsible for it.</h2>
          <p>
            Identity fields preserve attribution. They do not independently
            verify identity, ownership, authority, or authorship.
          </p>
        </div>

        <div className="panel">
          {record.recordId ? (
            <div className="active-record">
              <span>ACTIVE RECORD</span>
              <strong>{record.recordId}</strong>
              <p>
                Saving or preserving now updates this identified record instead
                of creating a duplicate.
              </p>
            </div>
          ) : null}

          <div className="form-grid">
            <label className="wide">
              <span>Record title</span>
              <input
                value={record.title}
                onChange={(event) => updateRecord("title", event.target.value)}
                placeholder="Plain-language title for this governed record"
              />
            </label>

            <label>
              <span>Record type</span>
              <input
                value={record.recordType}
                onChange={(event) =>
                  updateRecord("recordType", event.target.value)
                }
                placeholder="Governed Record"
              />
            </label>

            <label>
              <span>Domain</span>
              <select
                value={record.domain}
                onChange={(event) => updateRecord("domain", event.target.value)}
              >
                <option>AI Governance</option>
                <option>Environmental Integrity</option>
                <option>Atmospheric Integrity</option>
                <option>Building Operations</option>
                <option>Healthcare</option>
                <option>Financial Execution</option>
                <option>Public Administration</option>
                <option>Other</option>
              </select>
            </label>

            <label>
              <span>Owner or claimant</span>
              <input
                value={record.owner}
                onChange={(event) => updateRecord("owner", event.target.value)}
                placeholder="Person, entity, system, or organization"
              />
            </label>

            <label>
              <span>Record steward</span>
              <input
                value={record.steward}
                onChange={(event) => updateRecord("steward", event.target.value)}
                placeholder="Party maintaining the record"
              />
            </label>

            <label>
              <span>Status</span>
              <select
                value={record.status}
                onChange={(event) =>
                  updateRecord("status", event.target.value as RecordStatus)
                }
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option value={value} key={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Visibility</span>
              <select
                value={record.visibility}
                onChange={(event) =>
                  updateRecord("visibility", event.target.value as Visibility)
                }
              >
                <option value="PRIVATE">Private</option>
                <option value="SELECTIVE">Selectively Shared</option>
                <option value="PUBLIC">Public</option>
              </select>
            </label>

            <label>
              <span>Version</span>
              <input
                value={record.version}
                onChange={(event) => updateRecord("version", event.target.value)}
                placeholder="1.0"
              />
            </label>
          </div>
        </div>
      </section>

      <section className="section shell">
        <div className="section-heading">
          <p className="eyebrow">02 — REALITY AND RECORD</p>
          <h2>Separate what occurred from what the record says occurred.</h2>
        </div>

        <div className="two-column">
          <label className="statement-card reality">
            <span>Reality observed or event declared</span>
            <textarea
              value={record.realityObserved}
              onChange={(event) =>
                updateRecord("realityObserved", event.target.value)
              }
              placeholder="Describe the event, condition, action, state, transaction, system behavior, or observation that gave rise to this record."
            />
          </label>

          <label className="statement-card record">
            <span>Record statement</span>
            <textarea
              value={record.recordStatement}
              onChange={(event) =>
                updateRecord("recordStatement", event.target.value)
              }
              placeholder="State exactly what this governed record preserves about that reality."
            />
          </label>
        </div>
      </section>

      <section className="section shell">
        <div className="section-heading">
          <p className="eyebrow">03 — RECORD BOUNDARIES</p>
          <h2>Define where the record begins and where it stops.</h2>
        </div>

        <div className="panel">
          <div className="form-grid">
            <label className="wide">
              <span>Time boundary</span>
              <textarea
                value={record.timeBoundary}
                onChange={(event) =>
                  updateRecord("timeBoundary", event.target.value)
                }
                placeholder="Dates, time window, duration, sequence, or observation period"
              />
            </label>

            <label className="wide">
              <span>Geographic boundary</span>
              <textarea
                value={record.geographicBoundary}
                onChange={(event) =>
                  updateRecord("geographicBoundary", event.target.value)
                }
                placeholder="Physical, legal, regional, jurisdictional, or site boundary"
              />
            </label>

            <label className="wide">
              <span>System boundary</span>
              <textarea
                value={record.systemBoundary}
                onChange={(event) =>
                  updateRecord("systemBoundary", event.target.value)
                }
                placeholder="Systems, models, routes, equipment, repositories, people, or processes included"
              />
            </label>

            <label className="wide">
              <span>Authority boundary</span>
              <textarea
                value={record.authorityBoundary}
                onChange={(event) =>
                  updateRecord("authorityBoundary", event.target.value)
                }
                placeholder="Whose authority applies, which authority is absent, and where the record has no power to bind"
              />
            </label>
          </div>
        </div>
      </section>

      <section className="section shell">
        <div className="section-heading">
          <p className="eyebrow">04 — CLAIMS AND NON-CLAIMS</p>
          <h2>Preserve the claim without allowing it to silently expand.</h2>
        </div>

        <div className="two-column">
          <label className="statement-card included">
            <span>Included claims</span>
            <textarea
              value={record.includedClaims}
              onChange={(event) =>
                updateRecord("includedClaims", event.target.value)
              }
              placeholder="What this record affirmatively claims or preserves"
            />
          </label>

          <label className="statement-card excluded">
            <span>Explicit non-claims</span>
            <textarea
              value={record.explicitNonClaims}
              onChange={(event) =>
                updateRecord("explicitNonClaims", event.target.value)
              }
              placeholder="What this record does not prove, certify, diagnose, validate, authorize, or guarantee"
            />
          </label>
        </div>
      </section>

      <section className="section shell" id="chain">
        <div className="section-heading">
          <p className="eyebrow">05 — TA-14 CHAIN</p>
          <h2>Build the complete chain without merging its links.</h2>
          <p>
            Reality → Record → Continuity → Admissibility → Binding → Commit →
            Execution → Outcome
          </p>
        </div>

        <div className="chain-grid">
          {[
            {
              number: "01",
              name: "Reality",
              value: record.realityObserved,
              field: "realityObserved" as const,
              placeholder: "What occurred or was observed?",
            },
            {
              number: "02",
              name: "Record",
              value: record.recordStatement,
              field: "recordStatement" as const,
              placeholder: "What was preserved about it?",
            },
            {
              number: "03",
              name: "Continuity",
              value: record.continuityStatement,
              field: "continuityStatement" as const,
              placeholder:
                "How was the record maintained across time, custody, version, or transmission?",
            },
            {
              number: "04",
              name: "Admissibility",
              value: record.admissibilityStatement,
              field: "admissibilityStatement" as const,
              placeholder:
                "Which conditions, rules, thresholds, or evidence requirements govern admissibility?",
            },
            {
              number: "05",
              name: "Binding",
              value: record.bindingStatement,
              field: "bindingStatement" as const,
              placeholder:
                "What person, route, authority, asset, or decision was bound to the record?",
            },
            {
              number: "06",
              name: "Commit",
              value: record.commitStatement,
              field: "commitStatement" as const,
              placeholder:
                "What commitment or declared decision was made, by whom, and when?",
            },
            {
              number: "07",
              name: "Execution",
              value: record.executionStatement,
              field: "executionStatement" as const,
              placeholder:
                "What action was actually executed, held, denied, or escalated?",
            },
            {
              number: "08",
              name: "Outcome",
              value: record.outcomeStatement,
              field: "outcomeStatement" as const,
              placeholder:
                "What outcome was observed after execution, and how does it compare with the original state?",
            },
          ].map((step) => (
            <label className="chain-card" key={step.name}>
              <div>
                <span>{step.number}</span>
                <strong>{step.name}</strong>
              </div>
              <textarea
                value={step.value}
                onChange={(event) =>
                  updateRecord(step.field, event.target.value)
                }
                placeholder={step.placeholder}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="section shell" id="evidence">
        <div className="section-heading">
          <p className="eyebrow">06 — EVIDENCE SET</p>
          <h2>Attach identifiable support without overstating what it proves.</h2>
        </div>

        <form className="panel evidence-entry" onSubmit={addEvidence}>
          <div className="form-grid">
            <label>
              <span>Evidence type</span>
              <select
                value={evidenceDraft.evidenceType}
                onChange={(event) =>
                  setEvidenceDraft((current) => ({
                    ...current,
                    evidenceType: event.target.value,
                  }))
                }
              >
                <option>Document</option>
                <option>URL</option>
                <option>PDF</option>
                <option>Image</option>
                <option>Video</option>
                <option>Runtime Log</option>
                <option>Sensor Record</option>
                <option>Witness Declaration</option>
                <option>Standard</option>
                <option>Other</option>
              </select>
            </label>

            <label>
              <span>Evidence title</span>
              <input
                value={evidenceDraft.title}
                onChange={(event) =>
                  setEvidenceDraft((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                placeholder="Name this evidence item"
              />
            </label>

            <label className="wide">
              <span>Source or location</span>
              <input
                value={evidenceDraft.source}
                onChange={(event) =>
                  setEvidenceDraft((current) => ({
                    ...current,
                    source: event.target.value,
                  }))
                }
                placeholder="URL, repository, source party, file reference, or storage location"
              />
            </label>

            <label className="wide">
              <span>Notes and limitations</span>
              <textarea
                value={evidenceDraft.notes}
                onChange={(event) =>
                  setEvidenceDraft((current) => ({
                    ...current,
                    notes: event.target.value,
                  }))
                }
                placeholder="Describe relevance, version, period, provenance, custody, limitations, or unresolved integrity questions"
              />
            </label>
          </div>

          <button className="button primary" type="submit">
            Add Evidence
          </button>
        </form>

        <div className="evidence-grid">
          {record.evidence.length ? (
            record.evidence.map((item) => (
              <article className="evidence-card" key={item.evidenceId}>
                <div className="card-top">
                  <span>{item.evidenceType}</span>
                  <button
                    type="button"
                    onClick={() => removeEvidence(item.evidenceId)}
                  >
                    Remove
                  </button>
                </div>
                <p className="record-id">{item.evidenceId}</p>
                <h3>{item.title}</h3>
                <dl>
                  <div>
                    <dt>Source</dt>
                    <dd>{item.source || "Not declared"}</dd>
                  </div>
                  <div>
                    <dt>Added</dt>
                    <dd>{new Date(item.addedAt).toLocaleString()}</dd>
                  </div>
                </dl>
                <p>{item.notes || "No evidence notes were declared."}</p>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <strong>No evidence has been attached.</strong>
              <p>
                The absence of evidence should remain visible rather than being
                hidden by an unsupported interpretation.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="section shell">
        <div className="section-heading">
          <p className="eyebrow">07 — LIMITATIONS AND PRESERVATION</p>
          <h2>State the limits before preserving the artifact.</h2>
        </div>

        <label className="panel limitation-panel">
          <span>Record limitations</span>
          <textarea
            value={record.limitations}
            onChange={(event) =>
              updateRecord("limitations", event.target.value)
            }
            placeholder="Missing evidence, unresolved continuity, unavailable sources, authority limits, time limits, technical limits, or uncertainty"
          />
        </label>

        <div className="boundary-box">
          <span>BUILDER BOUNDARY</span>
          <p>
            This builder creates and preserves declared records in browser-local
            storage. It does not independently verify identity, evidence
            integrity, continuity, admissibility, legal compliance, safety,
            authority, execution, or outcomes.
          </p>
        </div>

        <div className="actions">
          <button className="button secondary" type="button" onClick={saveDraft}>
            Save Working Record
          </button>
          <button
            className="button primary"
            type="button"
            onClick={preserveRecord}
          >
            Preserve Governed Record
          </button>
          <button
            className="button ghost danger"
            type="button"
            onClick={clearWorkspace}
          >
            Clear Working Record
          </button>
        </div>
      </section>

      <section className="section shell" id="library">
        <div className="section-heading">
          <p className="eyebrow">08 — PRESERVED RECORDS</p>
          <h2>Browser-local governed record history.</h2>
          <p>
            These artifacts have been preserved in this browser only. They have
            not automatically been submitted to verification, interpretation,
            review, publication, or a registry.
          </p>
        </div>

        {library.length ? (
          <div className="library-grid">
            {library.map((item) => (
              <article className="library-card" key={item.recordId}>
                <div className="card-top">
                  <span className={`status ${item.status.toLowerCase()}`}>
                    {statusLabels[item.status]}
                  </span>
                  <span>v{item.version}</span>
                </div>
                <p className="record-id">{item.recordId}</p>
                <h3>{item.title}</h3>
                <strong>{item.domain}</strong>
                <p>
                  {item.recordStatement ||
                    "No record statement has been declared."}
                </p>
                <dl>
                  <div>
                    <dt>Owner</dt>
                    <dd>{item.owner || "Not declared"}</dd>
                  </div>
                  <div>
                    <dt>Visibility</dt>
                    <dd>{item.visibility.replaceAll("_", " ")}</dd>
                  </div>
                  <div>
                    <dt>Evidence</dt>
                    <dd>{item.evidence.length}</dd>
                  </div>
                  <div>
                    <dt>Updated</dt>
                    <dd>{new Date(item.updatedAt).toLocaleString()}</dd>
                  </div>
                </dl>
                <div className="card-actions">
                  <button
                    className="button primary"
                    type="button"
                    onClick={() => openRecord(item)}
                  >
                    Open Record
                  </button>
                  <button
                    className="button secondary"
                    type="button"
                    onClick={() => exportRecord(item)}
                  >
                    Export JSON
                  </button>
                  <button
                    className="button ghost danger"
                    type="button"
                    onClick={() => removeRecord(item.recordId)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state large">
            <strong>No governed records have been preserved.</strong>
            <p>
              Build the first bounded record, attach its evidence, complete the
              relevant chain links, and preserve it when ready.
            </p>
            <a className="button primary" href="#identity">
              Begin First Record
            </a>
          </div>
        )}
      </section>

      <footer>
        <Link className="brand" href="/">
          <span>TA-14</span>
          <div>
            <strong>Governed Record Builder</strong>
            <small>No admissible evidence. No admissible execution.</small>
          </div>
        </Link>
        <p>
          Reality must be recorded before it can be interpreted. Interpretation
          must remain separate from diagnosis, optimization, approval, and
          execution.
        </p>
      </footer>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          scroll-behavior: smooth;
        }

        :global(body) {
          margin: 0;
          background: #05040a;
          color: #f8f5ff;
        }

        :global(a) {
          color: inherit;
          text-decoration: none;
        }

        :global(button),
        :global(input),
        :global(textarea),
        :global(select) {
          font: inherit;
        }

        .page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          isolation: isolate;
          background:
            radial-gradient(circle at 8% 4%, rgba(170, 100, 255, 0.16), transparent 27%),
            radial-gradient(circle at 90% 12%, rgba(255, 199, 92, 0.1), transparent 24%),
            linear-gradient(180deg, #08060f 0%, #0a0713 50%, #05040a 100%);
        }

        .page > :not(.ambient) {
          position: relative;
          z-index: 2;
        }

        .ambient {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .star,
        .particle {
          position: absolute;
          border-radius: 999px;
          background: white;
          box-shadow: 0 0 16px white, 0 0 34px rgba(184, 115, 255, 0.9);
        }

        .star {
          width: 6px;
          height: 6px;
          animation: pulse 7s ease-in-out infinite;
        }

        .star-one {
          top: 12%;
          left: 91%;
        }

        .star-two {
          top: 45%;
          left: 5%;
          animation-delay: -2.2s;
        }

        .star-three {
          top: 79%;
          left: 84%;
          animation-delay: -4.7s;
        }

        .particle {
          width: 3px;
          height: 3px;
          opacity: 0.55;
          animation: drift 20s linear infinite;
        }

        .particle-one {
          top: 25%;
          left: 21%;
        }

        .particle-two {
          top: 63%;
          left: 72%;
          animation-delay: -8s;
        }

        .particle-three {
          top: 87%;
          left: 37%;
          animation-delay: -13s;
        }

        .line {
          position: absolute;
          height: 1px;
          width: 58vw;
          opacity: 0.24;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(191, 124, 255, 0.8),
            transparent
          );
          animation: slide 18s linear infinite;
        }

        .line-one {
          top: 30%;
          left: -20%;
          transform: rotate(14deg);
        }

        .line-two {
          top: 73%;
          right: -22%;
          transform: rotate(-12deg);
          animation-delay: -9s;
        }

        .orbit {
          position: absolute;
          border: 1px solid rgba(195, 132, 255, 0.17);
          border-radius: 50%;
          animation: rotate 36s linear infinite;
        }

        .orbit-one {
          width: 520px;
          height: 520px;
          top: 11%;
          right: -240px;
        }

        .orbit-two {
          width: 360px;
          height: 360px;
          bottom: 6%;
          left: -170px;
          animation-direction: reverse;
        }

        .shell {
          width: min(1180px, calc(100% - 36px));
          margin: 0 auto;
        }

        .topbar {
          width: min(1240px, calc(100% - 36px));
          margin: 0 auto;
          padding: 24px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .brand > span {
          display: grid;
          place-items: center;
          width: 54px;
          height: 54px;
          border: 1px solid rgba(216, 168, 255, 0.45);
          border-radius: 15px;
          background: rgba(131, 61, 196, 0.18);
          font-size: 0.82rem;
          font-weight: 950;
          letter-spacing: 0.08em;
          box-shadow: inset 0 0 24px rgba(188, 119, 255, 0.1);
        }

        .brand div {
          display: grid;
          gap: 3px;
        }

        .brand strong {
          font-size: 0.94rem;
          letter-spacing: 0.03em;
        }

        .brand small {
          color: #afa6bb;
          font-size: 0.72rem;
        }

        nav {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: flex-end;
          gap: 18px;
          color: #c9c1d2;
          font-size: 0.78rem;
          font-weight: 800;
        }

        nav a:hover {
          color: white;
        }

        .hero {
          min-height: 630px;
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(310px, 0.75fr);
          align-items: center;
          gap: 70px;
          padding: 88px 0 100px;
        }

        .eyebrow,
        .panel-label {
          margin: 0 0 13px;
          color: #d8a6ff;
          font-size: 0.72rem;
          font-weight: 950;
          letter-spacing: 0.16em;
        }

        h1,
        h2,
        h3,
        p {
          margin-top: 0;
        }

        h1 {
          max-width: 760px;
          margin-bottom: 24px;
          font-size: clamp(3rem, 7vw, 6.7rem);
          line-height: 0.94;
          letter-spacing: -0.065em;
        }

        .lead {
          max-width: 760px;
          color: #c5bdce;
          font-size: clamp(1rem, 1.8vw, 1.24rem);
          line-height: 1.8;
        }

        .hero-actions,
        .actions,
        .card-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .hero-actions {
          margin-top: 31px;
        }

        .button {
          min-height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(211, 166, 255, 0.28);
          border-radius: 12px;
          padding: 0 18px;
          cursor: pointer;
          color: white;
          font-size: 0.78rem;
          font-weight: 950;
          letter-spacing: 0.02em;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease;
        }

        .button:hover {
          transform: translateY(-2px);
          border-color: rgba(224, 190, 255, 0.72);
        }

        .primary {
          background: linear-gradient(135deg, #8f45d3, #542279);
          box-shadow: 0 16px 38px rgba(109, 44, 162, 0.27);
        }

        .secondary {
          background: rgba(255, 255, 255, 0.045);
        }

        .ghost {
          background: transparent;
        }

        .danger {
          color: #ffc2c2;
          border-color: rgba(255, 111, 111, 0.28);
        }

        .principles {
          margin-top: 32px;
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        .principles span {
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 999px;
          padding: 8px 11px;
          color: #afa7b8;
          background: rgba(255, 255, 255, 0.025);
          font-size: 0.7rem;
          font-weight: 850;
        }

        .completion-card,
        .panel,
        .statement-card,
        .chain-card,
        .evidence-card,
        .library-card,
        .boundary-box,
        .empty-state {
          border: 1px solid rgba(215, 169, 255, 0.14);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.025)),
            rgba(14, 9, 23, 0.82);
          box-shadow:
            inset 0 1px rgba(255, 255, 255, 0.045),
            0 28px 80px rgba(0, 0, 0, 0.28);
          backdrop-filter: blur(20px);
        }

        .completion-card {
          border-radius: 26px;
          padding: 30px;
        }

        .completion-card > strong {
          display: block;
          margin-bottom: 14px;
          font-size: 4.5rem;
          line-height: 1;
          letter-spacing: -0.07em;
        }

        .completion-card > p:not(.panel-label) {
          color: #aaa1b4;
          line-height: 1.7;
          font-size: 0.83rem;
        }

        .progress {
          height: 8px;
          margin-bottom: 20px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.07);
        }

        .progress span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #8f45d3, #f1c36e);
          transition: width 260ms ease;
        }

        dl {
          margin: 0;
        }

        .completion-card dl,
        .library-card dl {
          display: grid;
          gap: 9px;
        }

        dl div {
          display: grid;
          grid-template-columns: 112px 1fr;
          gap: 12px;
        }

        dt {
          color: #8f8799;
          font-size: 0.68rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        dd {
          margin: 0;
          color: #d6cfdd;
          font-size: 0.8rem;
          overflow-wrap: anywhere;
        }

        .notice {
          margin-bottom: 25px;
          border: 1px solid rgba(239, 194, 106, 0.24);
          border-radius: 14px;
          padding: 14px 17px;
          color: #f7dca5;
          background: rgba(238, 181, 71, 0.07);
          font-size: 0.82rem;
          line-height: 1.6;
        }

        .section {
          padding: 90px 0;
        }

        .section-heading {
          max-width: 810px;
          margin-bottom: 32px;
        }

        .section-heading h2 {
          margin-bottom: 15px;
          font-size: clamp(2rem, 4.2vw, 4.2rem);
          line-height: 1.03;
          letter-spacing: -0.045em;
        }

        .section-heading > p:last-child {
          color: #aaa2b3;
          line-height: 1.75;
        }

        .panel {
          border-radius: 23px;
          padding: 25px;
        }

        .active-record {
          margin-bottom: 22px;
          border: 1px solid rgba(239, 194, 106, 0.22);
          border-radius: 15px;
          padding: 16px;
          background: rgba(235, 180, 70, 0.055);
        }

        .active-record span {
          display: block;
          margin-bottom: 6px;
          color: #e8be6d;
          font-size: 0.66rem;
          font-weight: 950;
          letter-spacing: 0.12em;
        }

        .active-record strong {
          font-size: 0.94rem;
        }

        .active-record p {
          margin: 6px 0 0;
          color: #afa6b7;
          font-size: 0.76rem;
          line-height: 1.6;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        label {
          display: grid;
          gap: 8px;
        }

        label > span {
          color: #d9d1df;
          font-size: 0.73rem;
          font-weight: 900;
        }

        .wide {
          grid-column: 1 / -1;
        }

        input,
        textarea,
        select {
          width: 100%;
          border: 1px solid rgba(220, 182, 255, 0.15);
          border-radius: 11px;
          outline: none;
          color: #f9f6fc;
          background: rgba(4, 3, 8, 0.58);
          transition:
            border-color 180ms ease,
            box-shadow 180ms ease;
        }

        input,
        select {
          min-height: 47px;
          padding: 0 13px;
        }

        textarea {
          min-height: 132px;
          resize: vertical;
          padding: 13px;
          line-height: 1.62;
        }

        input:focus,
        textarea:focus,
        select:focus {
          border-color: rgba(194, 128, 255, 0.68);
          box-shadow: 0 0 0 3px rgba(156, 75, 222, 0.1);
        }

        select option {
          color: white;
          background: #100b18;
        }

        .two-column {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .statement-card {
          border-radius: 21px;
          padding: 22px;
        }

        .statement-card textarea {
          min-height: 230px;
        }

        .statement-card.reality {
          border-color: rgba(122, 180, 255, 0.18);
        }

        .statement-card.record {
          border-color: rgba(207, 140, 255, 0.22);
        }

        .statement-card.included {
          border-color: rgba(123, 218, 169, 0.18);
        }

        .statement-card.excluded {
          border-color: rgba(255, 137, 137, 0.18);
        }

        .chain-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 17px;
        }

        .chain-card {
          border-radius: 20px;
          padding: 20px;
        }

        .chain-card > div {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-bottom: 12px;
        }

        .chain-card > div span {
          display: grid;
          place-items: center;
          width: 34px;
          height: 34px;
          border-radius: 10px;
          color: #e1b5ff;
          background: rgba(157, 75, 220, 0.15);
          font-size: 0.7rem;
          font-weight: 950;
        }

        .chain-card textarea {
          min-height: 152px;
        }

        .evidence-entry {
          margin-bottom: 20px;
        }

        .evidence-entry .button {
          margin-top: 18px;
        }

        .evidence-grid,
        .library-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .evidence-card,
        .library-card {
          border-radius: 20px;
          padding: 21px;
        }

        .card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 12px;
          color: #b99ccf;
          font-size: 0.67rem;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .card-top button {
          border: 0;
          padding: 0;
          cursor: pointer;
          color: #d59494;
          background: transparent;
          font-size: 0.67rem;
          font-weight: 900;
          text-transform: uppercase;
        }

        .record-id {
          margin-bottom: 8px;
          color: #8f8799;
          font-size: 0.66rem;
          font-weight: 900;
          letter-spacing: 0.06em;
          overflow-wrap: anywhere;
        }

        .evidence-card h3,
        .library-card h3 {
          margin-bottom: 9px;
          font-size: 1.28rem;
        }

        .evidence-card > p:last-child,
        .library-card > p {
          margin-top: 15px;
          color: #a9a1b2;
          line-height: 1.65;
          font-size: 0.82rem;
        }

        .evidence-card dl {
          display: grid;
          gap: 8px;
        }

        .limitation-panel textarea {
          min-height: 220px;
        }

        .boundary-box {
          margin-top: 18px;
          border-radius: 18px;
          padding: 20px;
          border-color: rgba(238, 190, 98, 0.21);
          background: rgba(237, 179, 69, 0.05);
        }

        .boundary-box span {
          display: block;
          margin-bottom: 8px;
          color: #e8bd69;
          font-size: 0.68rem;
          font-weight: 950;
          letter-spacing: 0.12em;
        }

        .boundary-box p {
          margin: 0;
          color: #c8bca6;
          line-height: 1.72;
          font-size: 0.82rem;
        }

        .actions {
          margin-top: 22px;
        }

        .status {
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          padding: 6px 8px;
          background: rgba(255, 255, 255, 0.04);
        }

        .status.preserved {
          color: #a9ebc5;
          border-color: rgba(100, 212, 146, 0.22);
        }

        .status.ready_for_review {
          color: #f0d19b;
          border-color: rgba(232, 182, 88, 0.22);
        }

        .library-card > strong {
          color: #c8a2e6;
          font-size: 0.76rem;
        }

        .card-actions {
          margin-top: 18px;
        }

        .card-actions .button {
          min-height: 40px;
          padding: 0 13px;
          font-size: 0.69rem;
        }

        .empty-state {
          grid-column: 1 / -1;
          border-radius: 20px;
          padding: 28px;
          text-align: center;
        }

        .empty-state strong {
          display: block;
          margin-bottom: 8px;
          font-size: 1.05rem;
        }

        .empty-state p {
          max-width: 650px;
          margin: 0 auto;
          color: #aaa2b3;
          line-height: 1.7;
        }

        .empty-state.large {
          padding: 48px 25px;
        }

        .empty-state.large .button {
          margin-top: 20px;
        }

        footer {
          width: min(1240px, calc(100% - 36px));
          margin: 40px auto 0;
          padding: 36px 0 45px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 28px;
          border-top: 1px solid rgba(255, 255, 255, 0.075);
        }

        footer > p {
          max-width: 610px;
          margin: 0;
          color: #8f8799;
          text-align: right;
          font-size: 0.76rem;
          line-height: 1.65;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(0.7);
          }
          50% {
            opacity: 1;
            transform: scale(1.6);
          }
        }

        @keyframes drift {
          from {
            transform: translate3d(-30px, 45px, 0);
          }
          to {
            transform: translate3d(90px, -90px, 0);
          }
        }

        @keyframes slide {
          from {
            translate: -15vw 0;
          }
          to {
            translate: 55vw 0;
          }
        }

        @keyframes rotate {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 900px) {
          .topbar {
            align-items: flex-start;
          }

          nav {
            max-width: 420px;
          }

          .hero {
            min-height: auto;
            grid-template-columns: 1fr;
            gap: 38px;
            padding: 70px 0 75px;
          }

          .completion-card {
            max-width: 600px;
          }

          .evidence-grid,
          .library-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 680px) {
          .shell,
          .topbar,
          footer {
            width: min(100% - 24px, 1180px);
          }

          .topbar {
            display: grid;
          }

          nav {
            justify-content: flex-start;
            gap: 12px 16px;
          }

          h1 {
            font-size: clamp(3rem, 17vw, 5.2rem);
          }

          .section {
            padding: 66px 0;
          }

          .form-grid,
          .two-column,
          .chain-grid {
            grid-template-columns: 1fr;
          }

          .wide {
            grid-column: auto;
          }

          .panel,
          .statement-card,
          .chain-card,
          .evidence-card,
          .library-card {
            padding: 18px;
          }

          .hero-actions,
          .actions,
          .card-actions {
            display: grid;
            grid-template-columns: 1fr;
          }

          .button {
            width: 100%;
          }

          footer {
            align-items: flex-start;
            flex-direction: column;
          }

          footer > p {
            text-align: left;
          }

          dl div {
            grid-template-columns: 95px 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          :global(*) {
            scroll-behavior: auto !important;
          }

          .star,
          .particle,
          .line,
          .orbit {
            animation: none !important;
          }
        }
      `}</style>
    </main>
  );
}
