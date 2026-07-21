"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ChainState =
  | "PRESERVED"
  | "DRAFT"
  | "SUPERSEDED"
  | "WITHDRAWN"
  | "DISPUTED";

type ChainNodeType =
  | "GOVERNED_RECORD"
  | "INTERPRETATION"
  | "CONTINUITY_REVIEW"
  | "EVIDENCE_REVIEW"
  | "AUTHORITY_REVIEW"
  | "ADMISSIBILITY_REVIEW"
  | "EXECUTION_READINESS"
  | "EXECUTION_RECORD"
  | "OUTCOME_VERIFICATION";

type ChainNode = {
  id: string;
  nodeType: ChainNodeType;
  recordId: string;
  title: string;
  version: number;
  state: ChainState;
  preservedAt: string;
  actor: string;
  organization: string;
  sourceRecordId: string;
  notes: string;
};

type HistoryEvent = {
  id: string;
  timestamp: string;
  eventType:
    | "CREATED"
    | "UPDATED"
    | "PRESERVED"
    | "REOPENED"
    | "SUPERSEDED"
    | "WITHDRAWN"
    | "DISPUTED"
    | "LINKED"
    | "EXPORTED";
  recordId: string;
  actor: string;
  description: string;
  evidenceReference: string;
};

type ChainAuditRecord = {
  auditId: string;
  title: string;
  rootRecordId: string;
  steward: string;
  organization: string;
  auditStartedAt: string;
  auditEndedAt: string;
  chainPurpose: string;
  chainScope: string;
  chainBoundary: string;
  continuityStatement: string;
  custodyStatement: string;
  unresolvedGaps: string;
  auditConclusion: string;
  nodes: ChainNode[];
  events: HistoryEvent[];
  status: "DRAFT" | "PRESERVED";
  version: number;
  createdAt: string;
  updatedAt: string;
  preservedAt: string;
};

const WORKSPACE_KEY = "ta14-governance-history-workspace-v1";
const LIBRARY_KEY = "ta14-governance-history-library-v1";

function makeAuditId() {
  const stamp = new Date()
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `TA-14-GHA-${stamp}-${suffix}`;
}

function blankNode(): ChainNode {
  return {
    id: crypto.randomUUID(),
    nodeType: "GOVERNED_RECORD",
    recordId: "",
    title: "",
    version: 1,
    state: "DRAFT",
    preservedAt: "",
    actor: "",
    organization: "",
    sourceRecordId: "",
    notes: "",
  };
}

function blankEvent(): HistoryEvent {
  return {
    id: crypto.randomUUID(),
    timestamp: "",
    eventType: "CREATED",
    recordId: "",
    actor: "",
    description: "",
    evidenceReference: "",
  };
}

function blankAudit(): ChainAuditRecord {
  const now = new Date().toISOString();
  return {
    auditId: makeAuditId(),
    title: "",
    rootRecordId: "",
    steward: "",
    organization: "",
    auditStartedAt: "",
    auditEndedAt: "",
    chainPurpose: "",
    chainScope: "",
    chainBoundary: "",
    continuityStatement: "",
    custodyStatement: "",
    unresolvedGaps: "",
    auditConclusion: "",
    nodes: [],
    events: [],
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

function prettyNodeType(type: ChainNodeType) {
  return type.replaceAll("_", " ");
}

export default function GovernanceHistoryPage() {
  const [audit, setAudit] = useState<ChainAuditRecord>(blankAudit());
  const [library, setLibrary] = useState<ChainAuditRecord[]>([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const savedWorkspace = safeParse<ChainAuditRecord | null>(
      localStorage.getItem(WORKSPACE_KEY),
      null,
    );
    const savedLibrary = safeParse<ChainAuditRecord[]>(
      localStorage.getItem(LIBRARY_KEY),
      [],
    );

    if (savedWorkspace) setAudit(savedWorkspace);
    setLibrary(savedLibrary);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      WORKSPACE_KEY,
      JSON.stringify({ ...audit, updatedAt: new Date().toISOString() }),
    );
  }, [audit]);

  const update = <K extends keyof ChainAuditRecord>(
    key: K,
    value: ChainAuditRecord[K],
  ) => {
    setAudit((current) => ({
      ...current,
      [key]: value,
      updatedAt: new Date().toISOString(),
    }));
  };

  const addNode = () => update("nodes", [...audit.nodes, blankNode()]);

  const updateNode = (
    id: string,
    key: keyof ChainNode,
    value: string | number,
  ) => {
    update(
      "nodes",
      audit.nodes.map((node) =>
        node.id === id ? { ...node, [key]: value } : node,
      ),
    );
  };

  const removeNode = (id: string) => {
    update(
      "nodes",
      audit.nodes.filter((node) => node.id !== id),
    );
  };

  const addEvent = () => update("events", [...audit.events, blankEvent()]);

  const updateEvent = (
    id: string,
    key: keyof HistoryEvent,
    value: string,
  ) => {
    update(
      "events",
      audit.events.map((event) =>
        event.id === id ? { ...event, [key]: value } : event,
      ),
    );
  };

  const removeEvent = (id: string) => {
    update(
      "events",
      audit.events.filter((event) => event.id !== id),
    );
  };

  const sortedNodes = useMemo(() => {
    const order: ChainNodeType[] = [
      "GOVERNED_RECORD",
      "INTERPRETATION",
      "CONTINUITY_REVIEW",
      "EVIDENCE_REVIEW",
      "AUTHORITY_REVIEW",
      "ADMISSIBILITY_REVIEW",
      "EXECUTION_READINESS",
      "EXECUTION_RECORD",
      "OUTCOME_VERIFICATION",
    ];

    return [...audit.nodes].sort(
      (a, b) => order.indexOf(a.nodeType) - order.indexOf(b.nodeType),
    );
  }, [audit.nodes]);

  const preservedCount = audit.nodes.filter(
    (node) => node.state === "PRESERVED",
  ).length;

  const brokenLinks = audit.nodes.filter(
    (node, index) =>
      index > 0 &&
      !node.sourceRecordId &&
      node.nodeType !== "GOVERNED_RECORD",
  ).length;

  const completion = useMemo(() => {
    const checks = [
      audit.title,
      audit.rootRecordId,
      audit.steward,
      audit.organization,
      audit.chainPurpose,
      audit.chainScope,
      audit.chainBoundary,
      audit.continuityStatement,
      audit.custodyStatement,
      audit.auditConclusion,
      audit.nodes.length > 0 ? "yes" : "",
      audit.events.length > 0 ? "yes" : "",
    ];

    return Math.round(
      (checks.filter(Boolean).length / checks.length) * 100,
    );
  }, [audit]);

  const saveDraft = () => {
    const now = new Date().toISOString();
    const draft = { ...audit, status: "DRAFT" as const, updatedAt: now };
    const nextLibrary = [
      draft,
      ...library.filter((item) => item.auditId !== audit.auditId),
    ];

    setAudit(draft);
    setLibrary(nextLibrary);
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(nextLibrary));
    setNotice("Governance history draft saved in this browser.");
  };

  const preserve = () => {
    if (!audit.rootRecordId || audit.nodes.length === 0) {
      setNotice(
        "Preservation requires a root governed record and at least one chain node.",
      );
      return;
    }

    const now = new Date().toISOString();
    const preserved = {
      ...audit,
      status: "PRESERVED" as const,
      preservedAt: now,
      updatedAt: now,
    };

    const nextLibrary = [
      preserved,
      ...library.filter((item) => item.auditId !== audit.auditId),
    ];

    setAudit(preserved);
    setLibrary(nextLibrary);
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(nextLibrary));
    setNotice("Governance History and Chain Audit preserved.");
  };

  const exportJson = (item: ChainAuditRecord) => {
    const blob = new Blob([JSON.stringify(item, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${item.auditId}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const reopen = (item: ChainAuditRecord) => {
    setAudit({
      ...item,
      version: item.version + 1,
      status: "DRAFT",
      updatedAt: new Date().toISOString(),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    setNotice(`Reopened ${item.auditId}.`);
  };

  const remove = (auditId: string) => {
    const nextLibrary = library.filter((item) => item.auditId !== auditId);
    setLibrary(nextLibrary);
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(nextLibrary));
    setNotice("Audit removed from the local library.");
  };

  const newAudit = () => {
    const next = blankAudit();
    setAudit(next);
    localStorage.setItem(WORKSPACE_KEY, JSON.stringify(next));
    setNotice("New Governance History and Chain Audit started.");
  };

  const loadSample = () => {
    const now = new Date();
    const types: ChainNodeType[] = [
      "GOVERNED_RECORD",
      "INTERPRETATION",
      "CONTINUITY_REVIEW",
      "EVIDENCE_REVIEW",
      "AUTHORITY_REVIEW",
      "ADMISSIBILITY_REVIEW",
      "EXECUTION_READINESS",
      "EXECUTION_RECORD",
      "OUTCOME_VERIFICATION",
    ];

    const nodes: ChainNode[] = types.map((nodeType, index) => ({
      id: crypto.randomUUID(),
      nodeType,
      recordId: `TA-14-${nodeType.slice(0, 3)}-EXAMPLE-${String(
        index + 1,
      ).padStart(3, "0")}`,
      title: prettyNodeType(nodeType),
      version: 1,
      state: "PRESERVED",
      preservedAt: new Date(now.getTime() + index * 60_000).toISOString(),
      actor: "TA-14 Demonstration Reviewer",
      organization: "TA-14 Demonstration Organization",
      sourceRecordId:
        index === 0
          ? ""
          : `TA-14-${types[index - 1].slice(0, 3)}-EXAMPLE-${String(
              index,
            ).padStart(3, "0")}`,
      notes: "Preserved demonstration chain node.",
    }));

    const events: HistoryEvent[] = nodes.map((node, index) => ({
      id: crypto.randomUUID(),
      timestamp: node.preservedAt,
      eventType: "PRESERVED",
      recordId: node.recordId,
      actor: node.actor,
      description: `${prettyNodeType(node.nodeType)} preserved and linked into the governed chain.`,
      evidenceReference: `Event-${index + 1}`,
    }));

    setAudit({
      ...blankAudit(),
      title: "Vendor Payment Governance History",
      rootRecordId: nodes[0].recordId,
      steward: "Governance Chain Steward",
      organization: "TA-14 Demonstration Organization",
      auditStartedAt: now.toISOString().slice(0, 16),
      auditEndedAt: new Date(now.getTime() + 15 * 60_000)
        .toISOString()
        .slice(0, 16),
      chainPurpose:
        "Preserve and inspect the complete governed lifecycle of a vendor payment route.",
      chainScope:
        "Record creation through outcome verification, including all review and execution layers.",
      chainBoundary:
        "This audit covers only the records explicitly linked in this chain and does not infer missing external records.",
      continuityStatement:
        "Each preserved layer identifies its source record and follows the declared governance sequence without an unresolved gap.",
      custodyStatement:
        "The chain history preserves actor, organization, timestamp, version, and state for each linked artifact.",
      unresolvedGaps: "None declared in the demonstration chain.",
      auditConclusion:
        "The governed record chain is complete, sequentially linked, and preserved through outcome verification.",
      nodes,
      events,
    });

    setNotice("Sample governance history loaded.");
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
            <Link href="/workspace/governed-records/outcome-verification">
              Previous
            </Link>
            <Link href="/workspace/governed-records">Records Home</Link>
          </div>
        </nav>

        <section className="hero panel">
          <div>
            <p className="eyebrow">CHAIN-LEVEL GOVERNANCE</p>
            <h1>Governance History and Chain Audit</h1>
            <p className="heroCopy">
              Assemble the complete governed lifecycle of a record into one
              attributable, version-aware, chronological chain. This page shows
              what exists, what changed, what was superseded, and whether each
              layer remains connected to the records that came before it.
            </p>
          </div>

          <div className="heroStats">
            <div>
              <strong>{completion}%</strong>
              <span>Complete</span>
            </div>
            <div>
              <strong>{preservedCount}</strong>
              <span>Preserved nodes</span>
            </div>
            <div>
              <strong>{brokenLinks}</strong>
              <span>Unlinked nodes</span>
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
            <span className="recordLabel">ACTIVE AUDIT</span>
            <strong>{audit.auditId}</strong>
            <small>
              Version {audit.version} · {audit.status}
            </small>
          </div>

          <div className="toolbarActions">
            <button className="ghostButton" onClick={newAudit}>
              New audit
            </button>
            <button className="ghostButton" onClick={loadSample}>
              Load sample
            </button>
            <button className="ghostButton" onClick={saveDraft}>
              Save draft
            </button>
            <button className="primaryButton" onClick={preserve}>
              Preserve audit
            </button>
          </div>
        </section>

        <section className="panel section">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">01 · AUDIT IDENTITY</p>
              <h2>Governance chain identity</h2>
            </div>
            <span className="chip">{audit.status}</span>
          </div>

          <div className="grid two">
            <Field
              label="Audit title"
              value={audit.title}
              onChange={(value) => update("title", value)}
            />
            <Field
              label="Audit ID"
              value={audit.auditId}
              onChange={(value) => update("auditId", value)}
            />
            <Field
              label="Root governed record ID"
              value={audit.rootRecordId}
              onChange={(value) => update("rootRecordId", value)}
            />
            <Field
              label="Steward"
              value={audit.steward}
              onChange={(value) => update("steward", value)}
            />
            <Field
              label="Organization"
              value={audit.organization}
              onChange={(value) => update("organization", value)}
            />
            <Field
              label="Audit started"
              value={audit.auditStartedAt}
              onChange={(value) => update("auditStartedAt", value)}
              type="datetime-local"
            />
            <Field
              label="Audit ended"
              value={audit.auditEndedAt}
              onChange={(value) => update("auditEndedAt", value)}
              type="datetime-local"
            />
          </div>
        </section>

        <section className="panel section">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">02 · PURPOSE AND BOUNDARY</p>
              <h2>What this audit covers</h2>
            </div>
          </div>

          <div className="grid two">
            <TextArea
              label="Chain purpose"
              value={audit.chainPurpose}
              onChange={(value) => update("chainPurpose", value)}
              rows={6}
            />
            <TextArea
              label="Chain scope"
              value={audit.chainScope}
              onChange={(value) => update("chainScope", value)}
              rows={6}
            />
          </div>

          <TextArea
            label="Chain boundary"
            value={audit.chainBoundary}
            onChange={(value) => update("chainBoundary", value)}
            rows={6}
          />
        </section>

        <section className="panel section">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">03 · GOVERNED CHAIN</p>
              <h2>Linked record sequence</h2>
            </div>
            <button className="ghostButton" onClick={addNode}>
              Add chain node
            </button>
          </div>

          {sortedNodes.length === 0 ? (
            <div className="emptyState">No chain nodes have been added.</div>
          ) : (
            <div className="chain">
              {sortedNodes.map((node, index) => (
                <article className="nodeCard" key={node.id}>
                  <div className="nodeIndex">{index + 1}</div>
                  <div className="nodeBody">
                    <div className="cardHeader">
                      <div>
                        <span className="chip">
                          {prettyNodeType(node.nodeType)}
                        </span>
                        <h3>{node.title || "Untitled chain node"}</h3>
                      </div>
                      <button onClick={() => removeNode(node.id)}>
                        Remove
                      </button>
                    </div>

                    <div className="grid three">
                      <label className="field">
                        <span>Node type</span>
                        <select
                          value={node.nodeType}
                          onChange={(event) =>
                            updateNode(
                              node.id,
                              "nodeType",
                              event.target.value,
                            )
                          }
                        >
                          <option value="GOVERNED_RECORD">
                            GOVERNED RECORD
                          </option>
                          <option value="INTERPRETATION">
                            INTERPRETATION
                          </option>
                          <option value="CONTINUITY_REVIEW">
                            CONTINUITY REVIEW
                          </option>
                          <option value="EVIDENCE_REVIEW">
                            EVIDENCE REVIEW
                          </option>
                          <option value="AUTHORITY_REVIEW">
                            AUTHORITY REVIEW
                          </option>
                          <option value="ADMISSIBILITY_REVIEW">
                            ADMISSIBILITY REVIEW
                          </option>
                          <option value="EXECUTION_READINESS">
                            EXECUTION READINESS
                          </option>
                          <option value="EXECUTION_RECORD">
                            EXECUTION RECORD
                          </option>
                          <option value="OUTCOME_VERIFICATION">
                            OUTCOME VERIFICATION
                          </option>
                        </select>
                      </label>

                      <Field
                        label="Record ID"
                        value={node.recordId}
                        onChange={(value) =>
                          updateNode(node.id, "recordId", value)
                        }
                      />

                      <Field
                        label="Title"
                        value={node.title}
                        onChange={(value) =>
                          updateNode(node.id, "title", value)
                        }
                      />

                      <label className="field">
                        <span>State</span>
                        <select
                          value={node.state}
                          onChange={(event) =>
                            updateNode(node.id, "state", event.target.value)
                          }
                        >
                          <option value="DRAFT">DRAFT</option>
                          <option value="PRESERVED">PRESERVED</option>
                          <option value="SUPERSEDED">SUPERSEDED</option>
                          <option value="WITHDRAWN">WITHDRAWN</option>
                          <option value="DISPUTED">DISPUTED</option>
                        </select>
                      </label>

                      <Field
                        label="Version"
                        value={String(node.version)}
                        onChange={(value) =>
                          updateNode(
                            node.id,
                            "version",
                            Number(value || 1),
                          )
                        }
                        type="number"
                      />

                      <Field
                        label="Preserved at"
                        value={node.preservedAt}
                        onChange={(value) =>
                          updateNode(node.id, "preservedAt", value)
                        }
                        type="datetime-local"
                      />

                      <Field
                        label="Actor"
                        value={node.actor}
                        onChange={(value) =>
                          updateNode(node.id, "actor", value)
                        }
                      />

                      <Field
                        label="Organization"
                        value={node.organization}
                        onChange={(value) =>
                          updateNode(node.id, "organization", value)
                        }
                      />

                      <Field
                        label="Source record ID"
                        value={node.sourceRecordId}
                        onChange={(value) =>
                          updateNode(node.id, "sourceRecordId", value)
                        }
                      />
                    </div>

                    <TextArea
                      label="Node notes"
                      value={node.notes}
                      onChange={(value) =>
                        updateNode(node.id, "notes", value)
                      }
                      rows={4}
                    />
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="panel section">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">04 · HISTORY EVENTS</p>
              <h2>Chronological audit trail</h2>
            </div>
            <button className="ghostButton" onClick={addEvent}>
              Add history event
            </button>
          </div>

          {audit.events.length === 0 ? (
            <div className="emptyState">No history events have been added.</div>
          ) : (
            <div className="stack">
              {audit.events.map((event, index) => (
                <article className="eventCard" key={event.id}>
                  <div className="cardHeader">
                    <strong>Event {index + 1}</strong>
                    <button onClick={() => removeEvent(event.id)}>
                      Remove
                    </button>
                  </div>

                  <div className="grid three">
                    <Field
                      label="Timestamp"
                      value={event.timestamp}
                      onChange={(value) =>
                        updateEvent(event.id, "timestamp", value)
                      }
                      type="datetime-local"
                    />

                    <label className="field">
                      <span>Event type</span>
                      <select
                        value={event.eventType}
                        onChange={(change) =>
                          updateEvent(
                            event.id,
                            "eventType",
                            change.target.value,
                          )
                        }
                      >
                        <option value="CREATED">CREATED</option>
                        <option value="UPDATED">UPDATED</option>
                        <option value="PRESERVED">PRESERVED</option>
                        <option value="REOPENED">REOPENED</option>
                        <option value="SUPERSEDED">SUPERSEDED</option>
                        <option value="WITHDRAWN">WITHDRAWN</option>
                        <option value="DISPUTED">DISPUTED</option>
                        <option value="LINKED">LINKED</option>
                        <option value="EXPORTED">EXPORTED</option>
                      </select>
                    </label>

                    <Field
                      label="Record ID"
                      value={event.recordId}
                      onChange={(value) =>
                        updateEvent(event.id, "recordId", value)
                      }
                    />

                    <Field
                      label="Actor"
                      value={event.actor}
                      onChange={(value) =>
                        updateEvent(event.id, "actor", value)
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
                    label="Description"
                    value={event.description}
                    onChange={(value) =>
                      updateEvent(event.id, "description", value)
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
              <p className="eyebrow">05 · CONTINUITY AND CUSTODY</p>
              <h2>Chain integrity statements</h2>
            </div>
          </div>

          <div className="grid two">
            <TextArea
              label="Continuity statement"
              value={audit.continuityStatement}
              onChange={(value) => update("continuityStatement", value)}
              rows={7}
            />
            <TextArea
              label="Custody statement"
              value={audit.custodyStatement}
              onChange={(value) => update("custodyStatement", value)}
              rows={7}
            />
          </div>

          <TextArea
            label="Unresolved gaps"
            value={audit.unresolvedGaps}
            onChange={(value) => update("unresolvedGaps", value)}
            rows={6}
          />
        </section>

        <section className="panel section conclusionSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">06 · AUDIT CONCLUSION</p>
              <h2>Governance history determination</h2>
            </div>
          </div>

          <TextArea
            label="Audit conclusion"
            value={audit.auditConclusion}
            onChange={(value) => update("auditConclusion", value)}
            rows={8}
          />
        </section>

        <section className="panel section preserveSection">
          <div>
            <p className="eyebrow">07 · PRESERVATION</p>
            <h2>The chain is only as strong as its weakest link.</h2>
            <p>
              Preserve the complete lifecycle without erasing superseded
              versions, disputed events, withdrawals, or unresolved gaps. A
              chain audit records governance history; it does not rewrite it.
            </p>
          </div>

          <div className="preserveActions">
            <button className="ghostButton" onClick={() => exportJson(audit)}>
              Export current JSON
            </button>
            <button className="primaryButton" onClick={preserve}>
              Preserve Chain Audit
            </button>
          </div>
        </section>

        <section className="panel section">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">LOCAL LIBRARY</p>
              <h2>Governance history audits</h2>
            </div>
            <span className="chip">{library.length} audits</span>
          </div>

          {library.length === 0 ? (
            <div className="emptyState">
              No governance history audits have been saved in this browser.
            </div>
          ) : (
            <div className="library">
              {library.map((item) => (
                <article className="libraryCard" key={item.auditId}>
                  <div>
                    <span className="chip">{item.status}</span>
                    <h3>{item.title || "Untitled governance history audit"}</h3>
                    <p>{item.auditId}</p>
                    <small>
                      {item.nodes.length} nodes · {item.events.length} events ·
                      Version {item.version}
                    </small>
                  </div>

                  <div className="libraryActions">
                    <button onClick={() => reopen(item)}>Reopen</button>
                    <button onClick={() => exportJson(item)}>Export</button>
                    <button onClick={() => remove(item.auditId)}>Remove</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer>
          <Link href="/workspace/governed-records/outcome-verification">
            ← Outcome Verification
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
            radial-gradient(circle at 14% 10%, rgba(71, 64, 176, 0.2), transparent 34%),
            radial-gradient(circle at 88% 28%, rgba(0, 190, 255, 0.14), transparent 30%),
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

        .chip {
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

        .chain {
          display: grid;
          gap: 18px;
        }

        .nodeCard {
          display: grid;
          grid-template-columns: 48px 1fr;
          gap: 16px;
          position: relative;
        }

        .nodeCard:not(:last-child)::after {
          content: "";
          position: absolute;
          left: 23px;
          top: 48px;
          bottom: -18px;
          width: 2px;
          background: linear-gradient(#6bdcff, rgba(107, 220, 255, 0.08));
        }

        .nodeIndex {
          width: 48px;
          height: 48px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #806dff, #42d8ff);
          color: #06101c;
          font-weight: 900;
          position: relative;
          z-index: 2;
        }

        .nodeBody,
        .eventCard,
        .libraryCard {
          border-radius: 18px;
          border: 1px solid rgba(138, 160, 244, 0.16);
          background: rgba(255, 255, 255, 0.024);
          padding: 20px;
        }

        .stack,
        .library {
          display: grid;
          gap: 14px;
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

        .conclusionSection {
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

          .nodeCard {
            grid-template-columns: 1fr;
          }

          .nodeCard::after {
            display: none;
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
