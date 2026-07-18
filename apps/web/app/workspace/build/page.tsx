"use client";

import Link from "next/link";
import {
  type ChangeEvent,
  type DragEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { TransferRouteDraft } from "../../../lib/route-draft-transfer";
import { saveStoredRoute } from "../../../lib/route-library";
import EvaluateRouteLink from "./evaluate-route-link";
import { useRouteBuilderHandoff } from "./use-route-builder-handoff";

type StageKey =
  | "reality"
  | "record"
  | "continuity"
  | "admissibility"
  | "binding"
  | "commit"
  | "execution"
  | "outcome";

type RouteStatus = "DRAFT" | "HOLD" | "READY_FOR_TEST";

type Stage = {
  key: StageKey;
  number: string;
  label: string;
  userTitle: string;
  description: string;
  placeholder: string;
  value: string;
};

type RouteTemplate = {
  label: string;
  domain: string;
  owner: string;
  stages: Partial<Record<StageKey, string>>;
};

type ImportNotice = {
  type: "success" | "error";
  title: string;
  message: string;
};

const routeStageKeys: StageKey[] = [
  "reality",
  "record",
  "continuity",
  "admissibility",
  "binding",
  "commit",
  "execution",
  "outcome",
];

const maximumImportBytes = 1024 * 1024;
const localDraftStorageKey = "ta14-exchange-route-builder-draft-v1";

const stageDefinitions: Omit<Stage, "value">[] = [
  {
    key: "reality",
    number: "01",
    label: "Reality",
    userTitle: "What consequence are you trying to create?",
    description:
      "Describe the real-world condition and the action being proposed. State only what is known.",
    placeholder:
      "Example: Pay supplier invoice INV-2048 for equipment delivered to the organization.",
  },
  {
    key: "record",
    number: "02",
    label: "Record",
    userTitle: "What evidence supports this request?",
    description:
      "Identify the durable records that establish the facts behind the proposed consequence.",
    placeholder:
      "Example: Signed invoice, purchase order, delivery confirmation, supplier identity record, and approval evidence.",
  },
  {
    key: "continuity",
    number: "03",
    label: "Continuity",
    userTitle: "How will the evidence remain trustworthy?",
    description:
      "Explain how origin, custody, timestamps, transformations, dependencies, and versions remain provable.",
    placeholder:
      "Example: Preserve source hashes, timestamps, signer identities, dependency references, and every superseded version.",
  },
  {
    key: "admissibility",
    number: "04",
    label: "Admissibility",
    userTitle: "What must be true before the route may proceed?",
    description:
      "Define the evidence, authority, policy, safety, and timing requirements the engine must evaluate.",
    placeholder:
      "Example: The invoice must match the purchase order, delivery must be confirmed, and the required approval threshold must be satisfied.",
  },
  {
    key: "binding",
    number: "05",
    label: "Binding",
    userTitle: "Who and what must be bound to this route?",
    description:
      "Bind the actor, authority, beneficiary, destination, object, system, and operating environment.",
    placeholder:
      "Example: Bind finance actor A-17, policy AP-4, supplier S-91, invoice INV-2048, approved bank destination, amount, currency, and payment environment.",
  },
  {
    key: "commit",
    number: "06",
    label: "Commit",
    userTitle: "What exact route state must be frozen?",
    description:
      "Define the canonical route object that cannot silently change after an admissibility decision.",
    placeholder:
      "Example: Freeze the route payload, evidence set, authority receipt, bindings, decision, expiry boundary, and route digest.",
  },
  {
    key: "execution",
    number: "07",
    label: "Execution",
    userTitle: "What action may actually occur?",
    description:
      "State the permitted action and how execution correspondence will be checked against the committed route.",
    placeholder:
      "Example: Release only the committed amount and currency to the bound destination when the execution payload matches the committed digest.",
  },
  {
    key: "outcome",
    number: "08",
    label: "Outcome",
    userTitle: "What will prove what actually happened?",
    description:
      "Identify the authoritative outcome artifact and the correspondence checks required after execution.",
    placeholder:
      "Example: Preserve the settlement receipt, trace identifier, final amount, destination confirmation, timestamp, and reconciliation result.",
  },
];

const initialStages: Stage[] = stageDefinitions.map((stage) => ({
  ...stage,
  value: "",
}));

const templates: Record<string, RouteTemplate> = {
  "Vendor payment": {
    label: "Vendor payment",
    domain: "Finance",
    owner: "Finance Operations",
    stages: {
      reality:
        "An approved supplier invoice exists for goods or services received by the organization.",
      record:
        "Invoice, purchase order, delivery confirmation, supplier identity record, and approval evidence.",
      continuity:
        "Preserve source digests, timestamps, signer identities, dependency references, and every superseded route version.",
      admissibility:
        "The invoice must match the purchase order, delivery must be confirmed, the supplier must be active, beneficiary identity must be verified, and approval must satisfy the payment threshold.",
      binding:
        "Bind the requesting actor, procurement authority, finance authority, supplier beneficiary, bank destination, invoice, amount, currency, and production payment environment.",
      commit:
        "Freeze the canonical payment route, evidence dependency set, decision receipt, bindings, expiry boundary, and route digest.",
      execution:
        "Release only the committed amount and currency to the bound beneficiary through the approved payment rail when execution correspondence is confirmed.",
      outcome:
        "Verify settlement using the processor receipt, bank trace, settled amount, destination confirmation, timestamp, and reconciliation result.",
    },
  },
  "AI agent action": {
    label: "AI agent action",
    domain: "AI Governance",
    owner: "AI Governance Team",
    stages: {
      reality:
        "An AI agent has proposed a consequence-bearing action in an operating environment.",
      record:
        "Prompt context, model and tool identifiers, retrieved evidence, proposed action payload, policy inputs, and affected resources.",
      continuity:
        "Preserve provenance for every input, transformation, model invocation, tool call, correction, and route version.",
      admissibility:
        "Required evidence must be complete, current, attributable, policy-conforming, and sufficient for the proposed consequence.",
      binding:
        "Bind the agent, delegated authority, affected party, tool destination, action object, model version, and execution environment.",
      commit:
        "Freeze the exact action payload, evidence dependency graph, authority receipt, admissibility decision, and cryptographic route identity.",
      execution:
        "Permit only tool calls whose actor, arguments, destination, timing, and environment correspond to the committed route.",
      outcome:
        "Capture authoritative tool and system receipts, resulting state, affected resources, exceptions, and independent verification status.",
    },
  },
  "HVAC intervention": {
    label: "HVAC intervention",
    domain: "HVAC",
    owner: "Field Operations",
    stages: {
      reality:
        "A measurable operating condition indicates that an HVAC system may require intervention.",
      record:
        "Analyzer measurements, equipment identity, ambient conditions, electrical readings, airflow evidence, refrigerant data, and video.",
      continuity:
        "Bind measurements to instrument identity, calibration state, technician, property, timestamps, media, and preserved revisions.",
      admissibility:
        "The non-invasive evidence threshold must establish that intervention is justified and that required safety conditions are satisfied.",
      binding:
        "Bind the technician, company authority, equipment, property, intervention type, governed tools, refrigerant container, and environmental conditions.",
      commit:
        "Freeze the diagnostic determination, supporting evidence, authorized intervention, limits, material identity, and route digest.",
      execution:
        "Allow only the authorized intervention within committed limits while recording measurements and governed material movement.",
      outcome:
        "Verify post-intervention performance, final readings, material balance, equipment response, technician record, and property outcome.",
    },
  },
};

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "untitled-route"
  );
}

function stageState(stage: Stage): "COMPLETE" | "UNKNOWN" {
  return stage.value.trim() ? "COMPLETE" : "UNKNOWN";
}

export default function BuildRoutePage() {
  const { handoff, checked: handoffChecked } = useRouteBuilderHandoff();
  const [routeName, setRouteName] = useState("Untitled governance route");
  const [domain, setDomain] = useState("AI Governance");
  const [owner, setOwner] = useState("UNKNOWN");
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [selected, setSelected] = useState<StageKey>("reality");
  const [showJson, setShowJson] = useState(false);
  const [copied, setCopied] = useState(false);
  const [importNotice, setImportNotice] = useState<ImportNotice | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [localDraftReady, setLocalDraftReady] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [storedRouteId, setStoredRouteId] = useState<string | null>(null);
  const [libraryNotice, setLibraryNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentIndex = stages.findIndex((stage) => stage.key === selected);

  const current = stages[currentIndex] ?? stages[0];

  const completed = stages.filter(
    (stage) => stage.value.trim().length > 0,
  ).length;

  const missing = stages
    .filter((stage) => !stage.value.trim())
    .map((stage) => stage.label);

  const progress = Math.round((completed / 8) * 100);

  const status: RouteStatus =
    completed === 8 ? "READY_FOR_TEST" : completed >= 4 ? "HOLD" : "DRAFT";

  const route = useMemo<TransferRouteDraft>(
    () => ({
      schema: "TA14_ROUTE_DRAFT_V1",
      routeId: `draft:${slugify(routeName)}`,
      status,
      metadata: {
        name: routeName.trim() || "Untitled governance route",
        domain: domain.trim() || "UNKNOWN",
        owner: owner.trim() || "UNKNOWN",
        version: 1,
      },
      chain: Object.fromEntries(
        stages.map((stage) => [stage.key, stage.value.trim() || "UNKNOWN"]),
      ) as TransferRouteDraft["chain"],
      readiness: {
        completedStages: completed,
        totalStages: 8,
        missingStages: missing,
        nextAction:
          completed === 8 ? "SUBMIT_TO_SANDBOX" : "COMPLETE_ROUTE_DEFINITION",
      },
      governingPrinciple: "No admissible evidence. No admissible execution.",
    }),
    [completed, domain, missing, owner, routeName, stages, status],
  );

  useEffect(() => {
    if (!handoffChecked) {
      return;
    }

    try {
      if (handoff) {
        const opened = handoff.route;

        setRouteName(
          opened.metadata.name.trim() || "Untitled governance route",
        );
        setDomain(opened.metadata.domain.trim() || "UNKNOWN");
        setOwner(opened.metadata.owner.trim() || "UNKNOWN");
        setStages(
          stageDefinitions.map((stage) => ({
            ...stage,
            value:
              opened.chain[stage.key] === "UNKNOWN"
                ? ""
                : opened.chain[stage.key],
          })),
        );
        setSelected("reality");
        setShowJson(false);
        setCopied(false);
        setSavedAt(null);
        setStoredRouteId(handoff.libraryRouteId);
        setLibraryNotice(null);
        setImportNotice({
          type: "success",
          title: "Saved route opened in builder",
          message: handoff.libraryRouteId
            ? `${opened.metadata.name} is connected to its My Routes entry. Saving changes will update that route.`
            : `${opened.metadata.name} was transferred into the builder as a new working draft.`,
        });

        return;
      }

      const stored = window.localStorage.getItem(localDraftStorageKey);

      if (stored) {
        const parsed = JSON.parse(stored) as {
          route?: unknown;
          savedAt?: unknown;
          storedRouteId?: unknown;
        };
        const restored = validateImportedRoute(parsed.route);

        setRouteName(
          restored.metadata.name.trim() || "Untitled governance route",
        );
        setDomain(restored.metadata.domain.trim() || "UNKNOWN");
        setOwner(restored.metadata.owner.trim() || "UNKNOWN");
        setStages(
          stageDefinitions.map((stage) => ({
            ...stage,
            value:
              restored.chain[stage.key] === "UNKNOWN"
                ? ""
                : restored.chain[stage.key],
          })),
        );
        setSavedAt(typeof parsed.savedAt === "string" ? parsed.savedAt : null);
        setStoredRouteId(
          typeof parsed.storedRouteId === "string"
            ? parsed.storedRouteId
            : null,
        );
        setImportNotice({
          type: "success",
          title: "Local draft restored",
          message:
            "Your unfinished route was recovered from this browser and can be continued immediately.",
        });
      }
    } catch {
      window.localStorage.removeItem(localDraftStorageKey);
    } finally {
      setLocalDraftReady(true);
    }
  }, [handoff, handoffChecked]);

  useEffect(() => {
    if (!localDraftReady) {
      return;
    }

    const hasWork =
      routeName !== "Untitled governance route" ||
      domain !== "AI Governance" ||
      owner !== "UNKNOWN" ||
      stages.some((stage) => stage.value.trim().length > 0);

    if (!hasWork) {
      window.localStorage.removeItem(localDraftStorageKey);
      setSavedAt(null);
      return;
    }

    const timeout = window.setTimeout(() => {
      const timestamp = new Date().toISOString();

      window.localStorage.setItem(
        localDraftStorageKey,
        JSON.stringify({
          route,
          savedAt: timestamp,
          storedRouteId,
        }),
      );
      setSavedAt(timestamp);
    }, 650);

    return () => window.clearTimeout(timeout);
  }, [domain, localDraftReady, owner, route, routeName, stages, storedRouteId]);

  function updateCurrent(value: string) {
    setStages((items) =>
      items.map((stage) =>
        stage.key === selected ? { ...stage, value } : stage,
      ),
    );
  }

  function selectTemplate(name: string) {
    const template = templates[name];

    setRouteName(template.label);
    setDomain(template.domain);
    setOwner(template.owner);
    setStages((items) =>
      items.map((stage) => ({
        ...stage,
        value: template.stages[stage.key] ?? stage.value,
      })),
    );
    setSelected("reality");
    setShowJson(false);
    setStoredRouteId(null);
    setLibraryNotice(null);
  }

  function clearRoute() {
    setRouteName("Untitled governance route");
    setDomain("AI Governance");
    setOwner("UNKNOWN");
    setStages(initialStages);
    setSelected("reality");
    setShowJson(false);
    setCopied(false);
    setImportNotice(null);
    setSavedAt(null);
    setStoredRouteId(null);
    setLibraryNotice(null);
    window.localStorage.removeItem(localDraftStorageKey);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function goPrevious() {
    if (currentIndex > 0) {
      setSelected(stages[currentIndex - 1].key);
    }
  }

  function goNext() {
    if (currentIndex < stages.length - 1) {
      setSelected(stages[currentIndex + 1].key);
    }
  }

  function routeHasWork(): boolean {
    return (
      routeName !== "Untitled governance route" ||
      domain !== "AI Governance" ||
      owner !== "UNKNOWN" ||
      stages.some((stage) => stage.value.trim().length > 0)
    );
  }

  function validateImportedRoute(value: unknown): TransferRouteDraft {
    if (!value || typeof value !== "object") {
      throw new Error("The selected file does not contain a route object.");
    }

    const candidate = value as Partial<TransferRouteDraft>;

    if (candidate.schema !== "TA14_ROUTE_DRAFT_V1") {
      throw new Error(
        "Unsupported schema. Import a TA14_ROUTE_DRAFT_V1 JSON draft.",
      );
    }

    if (!candidate.metadata || typeof candidate.metadata !== "object") {
      throw new Error("The route metadata block is missing or invalid.");
    }

    if (
      typeof candidate.metadata.name !== "string" ||
      typeof candidate.metadata.domain !== "string" ||
      typeof candidate.metadata.owner !== "string"
    ) {
      throw new Error("Route name, domain, and owner must be text values.");
    }

    if (!candidate.chain || typeof candidate.chain !== "object") {
      throw new Error("The canonical Reality → Outcome chain is missing.");
    }

    for (const key of routeStageKeys) {
      if (typeof candidate.chain[key] !== "string") {
        throw new Error(`The ${key} stage is missing or is not a text value.`);
      }
    }

    return candidate as TransferRouteDraft;
  }

  async function importRouteFile(file: File) {
    setImportNotice(null);

    if (!file.name.toLowerCase().endsWith(".json")) {
      setImportNotice({
        type: "error",
        title: "Unsupported file type",
        message:
          "Choose a .json route draft exported by the TA-14 Route Builder.",
      });
      return;
    }

    if (file.size > maximumImportBytes) {
      setImportNotice({
        type: "error",
        title: "File is too large",
        message: "Route drafts must be 1 MB or smaller.",
      });
      return;
    }

    if (
      routeHasWork() &&
      !window.confirm(
        "Importing this file will replace the route currently in the builder. Continue?",
      )
    ) {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    try {
      const raw = await file.text();
      const parsed = JSON.parse(raw) as unknown;
      const imported = validateImportedRoute(parsed);

      setRouteName(
        imported.metadata.name.trim() || "Untitled governance route",
      );
      setDomain(imported.metadata.domain.trim() || "UNKNOWN");
      setOwner(imported.metadata.owner.trim() || "UNKNOWN");
      setStages(
        stageDefinitions.map((stage) => ({
          ...stage,
          value:
            imported.chain[stage.key] === "UNKNOWN"
              ? ""
              : imported.chain[stage.key],
        })),
      );
      setSelected("reality");
      setShowJson(false);
      setCopied(false);
      setStoredRouteId(null);
      setLibraryNotice(null);
      setImportNotice({
        type: "success",
        title: "Route imported successfully",
        message: `${imported.metadata.name} · ${imported.readiness?.completedStages ?? "Unknown"} of 8 stages defined · Version ${imported.metadata.version ?? 1}`,
      });
    } catch (error) {
      setImportNotice({
        type: "error",
        title: "Route could not be imported",
        message:
          error instanceof Error
            ? error.message
            : "The file is not a valid TA-14 route draft.",
      });
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function chooseImportFile() {
    fileInputRef.current?.click();
  }

  function handleFileSelection(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      void importRouteFile(file);
    }
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (event.currentTarget === event.target) {
      setDragActive(false);
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      void importRouteFile(file);
    }
  }

  function saveToLibrary() {
    const wasExisting = Boolean(storedRouteId);
    const stored = saveStoredRoute(route, storedRouteId ?? undefined);

    setStoredRouteId(stored.id);
    setLibraryNotice(
      wasExisting ? "Saved changes to My Routes." : "Route saved to My Routes.",
    );

    window.setTimeout(() => {
      setLibraryNotice(null);
    }, 2200);
  }

  function downloadDraft() {
    const blob = new Blob([JSON.stringify(route, null, 2)], {
      type: "application/json",
    });

    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = href;
    anchor.download = `${slugify(routeName)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(href);
  }

  async function copyJson() {
    await navigator.clipboard.writeText(JSON.stringify(route, null, 2));

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1600);
  }

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">TA-14 Exchange · Route construction</p>
          <h1>Build a Governed Route</h1>
          <p className="intro">
            Define the consequence, supporting evidence, authority, binding,
            execution, and outcome. The canonical chain updates as the route
            becomes complete.
          </p>
        </div>

        <div className="topActions">
          <div className="autosaveState" aria-live="polite">
            <span className="autosaveDot" />
            <div>
              <strong>Autosave active</strong>
              <small>
                {savedAt
                  ? `Saved ${new Date(savedAt).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}`
                  : "Stored in this browser"}
              </small>
            </div>
          </div>

          <Link href="/workspace/routes" className="textButton">
            My Routes
          </Link>

          <button type="button" className="saveButton" onClick={saveToLibrary}>
            {storedRouteId ? "Save changes" : "Save to My Routes"}
          </button>

          <Link href="/workspace/discover" className="textButton">
            ← Discovery
          </Link>

          <button
            type="button"
            className="textButton"
            onClick={() => setShowJson((value) => !value)}
          >
            {showJson ? "Hide JSON" : "Preview JSON"}
          </button>

          <button type="button" className="textButton" onClick={downloadDraft}>
            Download draft
          </button>

          <button type="button" className="dangerButton" onClick={clearRoute}>
            Clear
          </button>
        </div>
      </header>

      {libraryNotice ? (
        <div className="libraryNotice" role="status">
          <strong>{libraryNotice}</strong>
          <Link href="/workspace/routes">Open My Routes →</Link>
        </div>
      ) : null}

      <section className="identityGrid">
        <label>
          <span>Route name</span>
          <input
            value={routeName}
            onChange={(event) => setRouteName(event.target.value)}
          />
        </label>

        <label>
          <span>Domain</span>
          <input
            value={domain}
            onChange={(event) => setDomain(event.target.value)}
          />
        </label>

        <label>
          <span>Route owner</span>
          <input
            value={owner}
            onChange={(event) => setOwner(event.target.value)}
          />
        </label>

        <div className="statusCard">
          <span>Construction state</span>
          <strong data-state={status}>{status}</strong>
        </div>
      </section>

      <section className="importPanel">
        <div>
          <p className="eyebrow">Continue an existing route</p>
          <h2>Import a route draft</h2>
          <p>
            Reopen a TA-14 JSON draft, continue another builder&apos;s work, or
            inspect a route before evaluation. Imported UNKNOWN values remain
            unresolved.
          </p>
        </div>

        <div
          className={`dropZone ${dragActive ? "dragActive" : ""}`}
          onDragEnter={handleDragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onClick={chooseImportFile}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              chooseImportFile();
            }
          }}
          aria-label="Import a TA-14 route draft"
        >
          <input
            ref={fileInputRef}
            className="fileInput"
            type="file"
            accept=".json,application/json"
            onChange={handleFileSelection}
          />

          <span className="dropIcon">⇧</span>

          <div>
            <strong>Drag and drop a route draft here</strong>
            <span>or click to browse for a .json file</span>
          </div>

          <small>TA14_ROUTE_DRAFT_V1 · Maximum 1 MB</small>
        </div>

        {importNotice ? (
          <div
            className={`importNotice ${importNotice.type}`}
            role={importNotice.type === "error" ? "alert" : "status"}
          >
            <strong>{importNotice.title}</strong>
            <span>{importNotice.message}</span>
          </div>
        ) : null}
      </section>

      <section className="workspace">
        <aside className="chainPanel">
          <div className="panelHeading">
            <div>
              <p className="eyebrow">Canonical chain</p>
              <h2>Execution progress</h2>
            </div>

            <strong>{progress}%</strong>
          </div>

          <div className="progressTrack">
            <div className="progressFill" style={{ width: `${progress}%` }} />
          </div>

          <div className="chain">
            {stages.map((stage) => {
              const isSelected = stage.key === selected;
              const state = stageState(stage);

              return (
                <button
                  key={stage.key}
                  type="button"
                  className={`chainStage ${isSelected ? "selected" : ""}`}
                  onClick={() => setSelected(stage.key)}
                >
                  <span className="stageNumber">{stage.number}</span>

                  <span className="stageName">{stage.label}</span>

                  <span className={`stageState ${state.toLowerCase()}`}>
                    {state === "COMPLETE" ? "✓" : "○"}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="principle">
            <span>Governing principle</span>
            <strong>No admissible evidence. No admissible execution.</strong>
          </div>
        </aside>

        <section className="editorPanel">
          <div className="stageMeta">
            <div>
              <p className="eyebrow">Stage {current.number}</p>
              <h2>{current.label}</h2>
            </div>

            <span>
              {currentIndex + 1} / {stages.length}
            </span>
          </div>

          <div className="questionBlock">
            <h3>{current.userTitle}</h3>
            <p>{current.description}</p>
          </div>

          <textarea
            value={current.value}
            onChange={(event) => updateCurrent(event.target.value)}
            placeholder={current.placeholder}
            rows={10}
          />

          <div className="ruleCard">
            <strong>Rule</strong>
            <p>
              Do not invent missing facts. Define the required proof, binding,
              authority, or correspondence. Unsupported values remain UNKNOWN
              until evidence resolves them.
            </p>
          </div>

          <div className="editorActions">
            <button
              type="button"
              className="secondaryButton"
              onClick={goPrevious}
              disabled={currentIndex === 0}
            >
              ← Previous
            </button>

            {currentIndex < stages.length - 1 ? (
              <button type="button" className="primaryButton" onClick={goNext}>
                Next stage →
              </button>
            ) : (
              <EvaluateRouteLink
                route={route}
                className="primaryButton linkButton"
              >
                Evaluate route →
              </EvaluateRouteLink>
            )}
          </div>
        </section>

        <aside className="readinessPanel">
          <p className="eyebrow">Construction readiness</p>

          <div className="score">
            <strong>{completed}</strong>
            <span>of 8 stages defined</span>
          </div>

          <div className="metric">
            <span>Schema</span>
            <strong>ROUTE_DRAFT_V1</strong>
          </div>

          <div className="metric">
            <span>Version</span>
            <strong>1</strong>
          </div>

          <div className="metric">
            <span>Unknown stages</span>
            <strong>{8 - completed}</strong>
          </div>

          <div className="metric">
            <span>Next action</span>
            <strong>{completed === 8 ? "EVALUATE" : "COMPLETE"}</strong>
          </div>

          {missing.length > 0 ? (
            <div className="missingBlock">
              <span>Unresolved stages</span>

              <div>
                {missing.map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      const stage = stages.find((item) => item.label === label);

                      if (stage) {
                        setSelected(stage.key);
                      }
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="readyCard">
              <strong>Route definition complete</strong>
              <p>
                All eight stages are defined. Submit the route to the live
                engine for an admissibility determination.
              </p>

              <EvaluateRouteLink route={route}>
                Evaluate route →
              </EvaluateRouteLink>
            </div>
          )}
        </aside>
      </section>

      <section className="templates">
        <div>
          <p className="eyebrow">Guided starting points</p>
          <h2>Start from a template</h2>
          <p>
            Templates provide declared route content only. They do not prove
            that evidence exists or that authority is valid.
          </p>
        </div>

        <div className="templateGrid">
          {Object.keys(templates).map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => selectTemplate(name)}
            >
              <span>{name}</span>
              <strong>Load route →</strong>
            </button>
          ))}
        </div>
      </section>

      {showJson ? (
        <section className="jsonPanel">
          <div className="jsonHeader">
            <div>
              <p className="eyebrow">Canonical draft</p>
              <h2>Route JSON</h2>
            </div>

            <button
              type="button"
              className="secondaryButton"
              onClick={copyJson}
            >
              {copied ? "Copied" : "Copy JSON"}
            </button>
          </div>

          <pre>{JSON.stringify(route, null, 2)}</pre>
        </section>
      ) : null}

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          padding: 42px;
          background: radial-gradient(
              circle at top right,
              rgba(49, 209, 158, 0.09),
              transparent 30%
            ),
            #f5f7f8;
          color: #10201a;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .topbar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 28px;
          max-width: 1480px;
          margin: 0 auto 28px;
        }

        .eyebrow {
          margin: 0 0 9px;
          color: #0f7c5c;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        h1,
        h2,
        h3,
        p {
          margin-top: 0;
        }

        h1 {
          margin-bottom: 12px;
          font-size: clamp(36px, 5vw, 64px);
          line-height: 0.98;
          letter-spacing: -0.055em;
        }

        .intro {
          max-width: 760px;
          margin-bottom: 0;
          color: #5b6b64;
          font-size: 17px;
          line-height: 1.65;
        }

        .topActions {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 10px;
        }

        .autosaveState {
          display: flex;
          align-items: center;
          gap: 9px;
          min-height: 42px;
          padding: 8px 12px;
          border: 1px solid #cfe4da;
          border-radius: 11px;
          background: #f0f8f5;
        }

        .autosaveDot {
          width: 9px;
          height: 9px;
          flex: 0 0 auto;
          border-radius: 50%;
          background: #14946d;
          box-shadow: 0 0 0 4px rgba(20, 148, 109, 0.12);
        }

        .autosaveState strong,
        .autosaveState small {
          display: block;
          line-height: 1.2;
        }

        .autosaveState strong {
          color: #18523f;
          font-size: 11px;
        }

        .autosaveState small {
          margin-top: 3px;
          color: #65766e;
          font-size: 10px;
        }

        button,
        input,
        textarea {
          font: inherit;
        }

        button,
        a {
          -webkit-tap-highlight-color: transparent;
        }

        .textButton,
        .dangerButton,
        .saveButton,
        .secondaryButton,
        .primaryButton {
          border-radius: 11px;
          text-decoration: none;
          cursor: pointer;
        }

        .textButton,
        .dangerButton,
        .saveButton {
          padding: 11px 14px;
          border: 1px solid #dce4df;
          background: white;
          color: #263c33;
          font-size: 13px;
          font-weight: 800;
        }

        .dangerButton {
          color: #a33b3b;
        }

        .saveButton {
          border-color: #123c2e;
          background: #123c2e;
          color: white;
          font-size: 13px;
          font-weight: 850;
        }

        .libraryNotice {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          max-width: 1480px;
          margin: 0 auto 18px;
          padding: 14px 17px;
          border: 1px solid #b9dfd0;
          border-radius: 14px;
          background: #eaf8f2;
          color: #15513d;
          box-shadow: 0 14px 35px rgba(20, 47, 36, 0.05);
        }

        .libraryNotice strong {
          font-size: 13px;
        }

        .libraryNotice a {
          color: #08724f;
          font-size: 12px;
          font-weight: 900;
          text-decoration: none;
        }

        .identityGrid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 0.8fr;
          gap: 14px;
          max-width: 1480px;
          margin: 0 auto 18px;
        }

        .identityGrid label,
        .statusCard {
          padding: 16px;
          border: 1px solid #dde5e0;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.92);
        }

        .identityGrid label span,
        .statusCard span {
          display: block;
          margin-bottom: 8px;
          color: #718078;
          font-size: 11px;
          font-weight: 850;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .identityGrid input {
          width: 100%;
          padding: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #12251c;
          font-weight: 800;
        }

        .statusCard strong {
          display: inline-flex;
          padding: 7px 10px;
          border-radius: 999px;
          background: #edf2ef;
          font-size: 12px;
          letter-spacing: 0.06em;
        }

        .statusCard strong[data-state="HOLD"] {
          background: #fff3d7;
          color: #8d5d00;
        }

        .statusCard strong[data-state="READY_FOR_TEST"] {
          background: #dcf8eb;
          color: #08724f;
        }

        .importPanel {
          display: grid;
          grid-template-columns: minmax(260px, 0.8fr) minmax(360px, 1.2fr);
          gap: 24px;
          align-items: center;
          max-width: 1480px;
          margin: 0 auto 18px;
          padding: 22px;
          border: 1px solid #dce4df;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 20px 60px rgba(20, 47, 36, 0.05);
        }

        .importPanel h2 {
          margin-bottom: 9px;
          font-size: 26px;
          letter-spacing: -0.04em;
        }

        .importPanel p:last-child {
          margin-bottom: 0;
          color: #68766f;
          font-size: 14px;
          line-height: 1.6;
        }

        .dropZone {
          display: grid;
          grid-template-columns: 46px minmax(0, 1fr);
          gap: 14px;
          align-items: center;
          min-height: 128px;
          padding: 20px;
          border: 2px dashed #b8c9c0;
          border-radius: 16px;
          background: #f8fbf9;
          cursor: pointer;
          transition:
            border-color 160ms ease,
            background 160ms ease,
            transform 160ms ease;
        }

        .dropZone:hover,
        .dropZone:focus-visible,
        .dropZone.dragActive {
          border-color: #14946d;
          background: #edf9f4;
          outline: none;
          transform: translateY(-1px);
        }

        .dropIcon {
          display: grid;
          width: 46px;
          height: 46px;
          place-items: center;
          border-radius: 13px;
          background: #dff5eb;
          color: #0f7c5c;
          font-size: 24px;
          font-weight: 900;
        }

        .dropZone strong,
        .dropZone span {
          display: block;
        }

        .dropZone strong {
          margin-bottom: 5px;
          color: #173128;
          font-size: 15px;
        }

        .dropZone div > span {
          color: #6b7972;
          font-size: 13px;
        }

        .dropZone small {
          grid-column: 2;
          color: #849089;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        .fileInput {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          opacity: 0;
          pointer-events: none;
        }

        .importNotice {
          grid-column: 1 / -1;
          display: grid;
          gap: 5px;
          padding: 14px 16px;
          border-radius: 13px;
          font-size: 13px;
        }

        .importNotice.success {
          border: 1px solid #a9dbc8;
          background: #ecfdf5;
          color: #075f47;
        }

        .importNotice.error {
          border: 1px solid #fecaca;
          background: #fff1f2;
          color: #991b1b;
        }

        .importNotice span {
          line-height: 1.5;
        }

        .workspace {
          display: grid;
          grid-template-columns: 290px minmax(0, 1fr) 285px;
          gap: 18px;
          max-width: 1480px;
          margin: 0 auto;
        }

        .chainPanel,
        .editorPanel,
        .readinessPanel,
        .templates,
        .jsonPanel {
          border: 1px solid #dce4df;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 20px 60px rgba(20, 47, 36, 0.06);
        }

        .chainPanel,
        .readinessPanel {
          padding: 20px;
        }

        .panelHeading,
        .stageMeta,
        .jsonHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
        }

        .panelHeading h2,
        .stageMeta h2,
        .jsonHeader h2 {
          margin-bottom: 0;
          font-size: 21px;
          letter-spacing: -0.03em;
        }

        .panelHeading > strong {
          color: #0f7c5c;
          font-size: 22px;
        }

        .progressTrack {
          height: 7px;
          margin: 18px 0;
          overflow: hidden;
          border-radius: 999px;
          background: #e8eeea;
        }

        .progressFill {
          height: 100%;
          border-radius: inherit;
          background: #14946d;
          transition: width 180ms ease;
        }

        .chain {
          display: grid;
          gap: 7px;
        }

        .chainStage {
          display: grid;
          grid-template-columns: 36px 1fr 26px;
          align-items: center;
          width: 100%;
          padding: 12px;
          border: 1px solid transparent;
          border-radius: 12px;
          background: transparent;
          color: #52615a;
          text-align: left;
          cursor: pointer;
        }

        .chainStage:hover {
          background: #f4f8f6;
        }

        .chainStage.selected {
          border-color: #bcded0;
          background: #eaf7f2;
          color: #10251c;
        }

        .stageNumber {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .stageName {
          font-weight: 800;
        }

        .stageState {
          display: grid;
          width: 24px;
          height: 24px;
          place-items: center;
          border-radius: 50%;
          font-weight: 900;
        }

        .stageState.complete {
          background: #d9f5e9;
          color: #08724f;
        }

        .stageState.unknown {
          background: #edf1ef;
          color: #8a9690;
        }

        .principle {
          margin-top: 20px;
          padding-top: 18px;
          border-top: 1px solid #e3e9e5;
        }

        .principle span {
          display: block;
          margin-bottom: 7px;
          color: #7a8781;
          font-size: 11px;
          font-weight: 850;
          text-transform: uppercase;
        }

        .principle strong {
          font-size: 13px;
          line-height: 1.45;
        }

        .editorPanel {
          padding: 28px;
        }

        .stageMeta > span {
          padding: 8px 11px;
          border-radius: 999px;
          background: #eff4f1;
          color: #52615a;
          font-size: 12px;
          font-weight: 850;
        }

        .questionBlock {
          max-width: 760px;
          margin: 38px 0 22px;
        }

        .questionBlock h3 {
          margin-bottom: 12px;
          font-size: clamp(27px, 4vw, 43px);
          line-height: 1.05;
          letter-spacing: -0.045em;
        }

        .questionBlock p {
          margin-bottom: 0;
          color: #627169;
          font-size: 16px;
          line-height: 1.65;
        }

        textarea {
          width: 100%;
          min-height: 250px;
          padding: 20px;
          resize: vertical;
          border: 1px solid #cfd9d3;
          border-radius: 15px;
          outline: none;
          background: #fbfcfb;
          color: #14251d;
          font-size: 16px;
          line-height: 1.65;
        }

        textarea:focus {
          border-color: #4fae8d;
          box-shadow: 0 0 0 4px rgba(79, 174, 141, 0.12);
        }

        .ruleCard {
          margin-top: 16px;
          padding: 16px 18px;
          border: 1px solid #e1e7e3;
          border-radius: 13px;
          background: #f7f9f8;
        }

        .ruleCard strong {
          display: block;
          margin-bottom: 5px;
          font-size: 12px;
          text-transform: uppercase;
        }

        .ruleCard p {
          margin-bottom: 0;
          color: #68766f;
          font-size: 13px;
          line-height: 1.6;
        }

        .editorActions {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          margin-top: 22px;
        }

        .secondaryButton,
        .primaryButton {
          padding: 13px 17px;
          border: 1px solid #ced8d2;
          background: white;
          color: #20382d;
          font-weight: 850;
        }

        .primaryButton {
          border-color: #123c2e;
          background: #123c2e;
          color: white;
        }

        .linkButton {
          display: inline-flex;
          align-items: center;
        }

        .secondaryButton:disabled {
          opacity: 0.38;
          cursor: not-allowed;
        }

        .readinessPanel > .eyebrow {
          margin-bottom: 22px;
        }

        .score {
          margin-bottom: 24px;
        }

        .score strong {
          display: block;
          font-size: 50px;
          line-height: 1;
          letter-spacing: -0.06em;
        }

        .score span {
          color: #718078;
          font-size: 13px;
        }

        .metric {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 13px 0;
          border-top: 1px solid #e4eae6;
          font-size: 12px;
        }

        .metric span {
          color: #75827c;
        }

        .metric strong {
          text-align: right;
        }

        .missingBlock {
          margin-top: 20px;
        }

        .missingBlock > span {
          display: block;
          margin-bottom: 10px;
          color: #75827c;
          font-size: 11px;
          font-weight: 850;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .missingBlock > div {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .missingBlock button {
          padding: 8px 10px;
          border: 1px solid #e2e7e4;
          border-radius: 999px;
          background: #f6f8f7;
          color: #4e5e56;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
        }

        .readyCard {
          margin-top: 20px;
          padding: 16px;
          border-radius: 14px;
          background: #eaf8f2;
        }

        .readyCard strong {
          display: block;
          margin-bottom: 7px;
        }

        .readyCard p {
          color: #4d685c;
          font-size: 13px;
          line-height: 1.55;
        }

        .readyCard :global(button) {
          padding: 0;
          border: 0;
          background: transparent;
          color: #08724f;
          font-size: 13px;
          font-weight: 900;
          cursor: pointer;
        }

        .templates,
        .jsonPanel {
          max-width: 1480px;
          margin: 18px auto 0;
          padding: 26px;
        }

        .templates {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 28px;
        }

        .templates h2 {
          margin-bottom: 10px;
          font-size: 28px;
          letter-spacing: -0.04em;
        }

        .templates p:last-child {
          margin-bottom: 0;
          color: #68766f;
          line-height: 1.6;
        }

        .templateGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .templateGrid button {
          display: flex;
          min-height: 125px;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
          padding: 18px;
          border: 1px solid #d8e1dc;
          border-radius: 15px;
          background: #fbfcfb;
          color: #173128;
          text-align: left;
          cursor: pointer;
        }

        .templateGrid button:hover {
          border-color: #72b79e;
          background: #f0f8f5;
        }

        .templateGrid span {
          font-size: 17px;
          font-weight: 900;
        }

        .templateGrid strong {
          color: #0d7d5b;
          font-size: 12px;
        }

        .jsonPanel pre {
          max-height: 620px;
          overflow: auto;
          margin: 22px 0 0;
          padding: 22px;
          border-radius: 15px;
          background: #0f1c17;
          color: #dff6eb;
          font-size: 12px;
          line-height: 1.65;
        }

        @media (max-width: 1100px) {
          .identityGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .importPanel {
            grid-template-columns: 1fr;
          }

          .workspace {
            grid-template-columns: 240px minmax(0, 1fr);
          }

          .readinessPanel {
            grid-column: 1 / -1;
          }

          .templates {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .page {
            padding: 22px 14px;
          }

          .topbar {
            flex-direction: column;
          }

          .topActions {
            justify-content: flex-start;
          }

          .libraryNotice {
            align-items: flex-start;
            flex-direction: column;
          }

          .identityGrid,
          .workspace,
          .templates,
          .templateGrid,
          .importPanel {
            grid-template-columns: 1fr;
          }

          .importPanel {
            padding: 18px;
          }

          .dropZone {
            grid-template-columns: 40px minmax(0, 1fr);
            padding: 16px;
          }

          .dropIcon {
            width: 40px;
            height: 40px;
          }

          .chainPanel,
          .readinessPanel {
            grid-column: auto;
          }

          .chain {
            grid-template-columns: repeat(2, 1fr);
          }

          .editorPanel {
            padding: 20px;
          }

          .questionBlock {
            margin-top: 28px;
          }

          .editorActions {
            flex-direction: column;
          }

          .secondaryButton,
          .primaryButton {
            width: 100%;
            justify-content: center;
            text-align: center;
          }
        }
      `}</style>
    </main>
  );
}
