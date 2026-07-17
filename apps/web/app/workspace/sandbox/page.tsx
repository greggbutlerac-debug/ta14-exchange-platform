"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Decision = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
type StageKey =
  | "reality"
  | "record"
  | "continuity"
  | "admissibility"
  | "binding"
  | "commit"
  | "execution"
  | "outcome";

type Stage = {
  key: StageKey;
  label: string;
  value: string;
};

type Finding = {
  id: string;
  stage: StageKey;
  severity: "BLOCKING" | "REVIEW" | "INFO";
  title: string;
  detail: string;
  correction: string;
};

type SandboxRun = {
  runId: string;
  createdAt: string;
  prompt: string;
  routeName: string;
  decision: Decision;
  score: number;
  stages: Stage[];
  findings: Finding[];
};

const stageDefinitions: Array<{ key: StageKey; label: string }> = [
  { key: "reality", label: "Reality" },
  { key: "record", label: "Record" },
  { key: "continuity", label: "Continuity" },
  { key: "admissibility", label: "Admissibility" },
  { key: "binding", label: "Binding" },
  { key: "commit", label: "Commit" },
  { key: "execution", label: "Execution" },
  { key: "outcome", label: "Outcome" },
];

const samples = {
  payment:
    "An AI agent may approve and release vendor payments above $25,000 after checking the invoice, purchase order, supplier account, authorized approver, and bank settlement outcome.",
  hiring:
    "An AI hiring assistant may reject a candidate after reviewing the application, role requirements, assessment results, decision authority, and required human review for disputed or incomplete evidence.",
  hvac:
    "An HVAC service agent may authorize refrigerant intervention only after verified measurements, technician identity, equipment binding, continuity of evidence, and post-intervention performance verification.",
};

function normalize(text: string) {
  return text.trim().replace(/\s+/g, " ");
}

function includesAny(text: string, words: string[]) {
  const lower = text.toLowerCase();
  return words.some((word) => lower.includes(word));
}

function inferRouteName(prompt: string) {
  if (includesAny(prompt, ["payment", "invoice", "vendor", "supplier"])) return "Governed Vendor Payment";
  if (includesAny(prompt, ["candidate", "hiring", "applicant", "employment"])) return "Governed Hiring Decision";
  if (includesAny(prompt, ["refrigerant", "hvac", "technician", "equipment"])) return "Governed HVAC Intervention";
  if (includesAny(prompt, ["medical", "patient", "clinical", "diagnosis"])) return "Governed Clinical Action";
  return "Generated Consequential Action Route";
}

function buildStages(prompt: string): Stage[] {
  const p = normalize(prompt);
  const actor = includesAny(p, ["ai", "agent", "assistant", "system"])
    ? "AI system or agent identified in the proposed workflow"
    : "Actor identity is UNKNOWN and must be supplied";

  const authority = includesAny(p, ["authorized", "authority", "approver", "human review"])
    ? "Authority source must be verified before execution"
    : "Authority basis is UNKNOWN";

  const outcome = includesAny(p, ["settlement", "verification", "outcome", "post-intervention", "result"])
    ? "Authoritative outcome evidence is required after execution"
    : "Outcome-verification source is UNKNOWN";

  return [
    {
      key: "reality",
      label: "Reality",
      value: p || "UNKNOWN",
    },
    {
      key: "record",
      label: "Record",
      value: p
        ? "Preserve the source facts, observations, identities, timestamps, and referenced artifacts as a durable record."
        : "UNKNOWN",
    },
    {
      key: "continuity",
      label: "Continuity",
      value: includesAny(p, ["verified", "identity", "evidence", "measurement", "invoice", "assessment"])
        ? "Track origin, transformations, version history, and custody for every material record."
        : "UNKNOWN",
    },
    {
      key: "admissibility",
      label: "Admissibility",
      value: "Evaluate required evidence, freshness, completeness, contradictions, and consequence-specific thresholds before action.",
    },
    {
      key: "binding",
      label: "Binding",
      value: `${actor}; ${authority}; bind the exact subject, beneficiary, destination, object, and environment.`,
    },
    {
      key: "commit",
      label: "Commit",
      value: "Canonicalize the admitted route, assign a version, create its digest, and preserve an immutable commit receipt.",
    },
    {
      key: "execution",
      label: "Execution",
      value: "Permit only an action that corresponds exactly to the admitted and committed route; block substitutions and material drift.",
    },
    {
      key: "outcome",
      label: "Outcome",
      value: outcome,
    },
  ];
}

function inspect(prompt: string, stages: Stage[]): Finding[] {
  const findings: Finding[] = [];
  const p = normalize(prompt);

  if (!p) {
    findings.push({
      id: "missing-prompt",
      stage: "reality",
      severity: "BLOCKING",
      title: "No consequential action supplied",
      detail: "The sandbox cannot construct a route without a proposed action or decision.",
      correction: "Describe the actor, proposed action, affected subject, and intended consequence.",
    });
    return findings;
  }

  if (!includesAny(p, ["authorized", "authority", "approver", "permission", "human review"])) {
    findings.push({
      id: "authority",
      stage: "binding",
      severity: "BLOCKING",
      title: "Authority is not established",
      detail: "The prompt describes an action but does not identify the source or limit of authority.",
      correction: "Name the authority source, scope, validity period, and escalation path.",
    });
  }

  if (!includesAny(p, ["evidence", "invoice", "measurement", "record", "assessment", "application", "purchase order"])) {
    findings.push({
      id: "evidence",
      stage: "record",
      severity: "BLOCKING",
      title: "Required evidence is undefined",
      detail: "The route does not specify what evidence must exist before consequence is created.",
      correction: "List the minimum evidence set and the rule each artifact satisfies.",
    });
  }

  if (!includesAny(p, ["verified", "verification", "settlement", "result", "outcome", "post-intervention"])) {
    findings.push({
      id: "outcome",
      stage: "outcome",
      severity: "REVIEW",
      title: "Outcome closure is unresolved",
      detail: "The proposed route does not name an authoritative source for confirming what actually happened.",
      correction: "Define the external outcome receipt and the expected correspondence test.",
    });
  }

  if (!includesAny(p, ["identity", "account", "candidate", "equipment", "patient", "supplier", "vendor"])) {
    findings.push({
      id: "subject-binding",
      stage: "binding",
      severity: "REVIEW",
      title: "Subject or destination binding is weak",
      detail: "The exact person, organization, account, asset, or destination is not clearly bound.",
      correction: "Bind stable identifiers for every consequence-bearing subject and destination.",
    });
  }

  if (!includesAny(p, ["timestamp", "time", "fresh", "current", "before", "after"])) {
    findings.push({
      id: "temporal",
      stage: "admissibility",
      severity: "REVIEW",
      title: "Temporal validity is not defined",
      detail: "Evidence may become stale or cease to describe the current state before execution.",
      correction: "Add freshness windows and require revalidation immediately before execution.",
    });
  }

  const unknownStages = stages.filter((stage) => stage.value.includes("UNKNOWN"));
  unknownStages.forEach((stage) => {
    findings.push({
      id: `unknown-${stage.key}`,
      stage: stage.key,
      severity: "INFO",
      title: `${stage.label} contains UNKNOWN`,
      detail: "The sandbox preserved an unsupported field rather than inventing a fact.",
      correction: `Supply authoritative information for ${stage.label.toLowerCase()} before production use.`,
    });
  });

  return findings;
}

function deriveDecision(findings: Finding[]): Decision {
  if (findings.some((finding) => finding.id === "missing-prompt")) return "DENY";
  if (findings.some((finding) => finding.severity === "BLOCKING")) return "HOLD";
  if (findings.some((finding) => finding.severity === "REVIEW")) return "ESCALATE";
  return "ALLOW";
}

function decisionClasses(decision: Decision) {
  if (decision === "ALLOW") return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
  if (decision === "HOLD") return "border-amber-400/30 bg-amber-400/10 text-amber-200";
  if (decision === "DENY") return "border-rose-400/30 bg-rose-400/10 text-rose-200";
  return "border-sky-400/30 bg-sky-400/10 text-sky-200";
}

function severityClasses(severity: Finding["severity"]) {
  if (severity === "BLOCKING") return "border-rose-400/30 bg-rose-400/10 text-rose-200";
  if (severity === "REVIEW") return "border-amber-400/30 bg-amber-400/10 text-amber-200";
  return "border-white/10 bg-white/5 text-slate-300";
}

function createRun(prompt: string): SandboxRun {
  const stages = buildStages(prompt);
  const findings = inspect(prompt, stages);
  const decision = deriveDecision(findings);
  const blocking = findings.filter((finding) => finding.severity === "BLOCKING").length;
  const review = findings.filter((finding) => finding.severity === "REVIEW").length;
  const unknown = findings.filter((finding) => finding.severity === "INFO").length;
  const score = Math.max(0, 100 - blocking * 24 - review * 10 - unknown * 4);

  return {
    runId: `sandbox-${Date.now()}`,
    createdAt: new Date().toISOString(),
    prompt: normalize(prompt),
    routeName: inferRouteName(prompt),
    decision,
    score,
    stages,
    findings,
  };
}

export default function GovernanceSandboxPage() {
  const [prompt, setPrompt] = useState(samples.payment);
  const [run, setRun] = useState<SandboxRun>(() => createRun(samples.payment));
  const [copied, setCopied] = useState(false);

  const packageJson = useMemo(
    () =>
      JSON.stringify(
        {
          schema: "TA14_SANDBOX_RUN_V1",
          ...run,
          notice:
            "This sandbox output is a proposed governance route. It is not proof of admissibility, authority, cryptographic validity, or production readiness.",
        },
        null,
        2,
      ),
    [run],
  );

  function runSandbox() {
    setRun(createRun(prompt));
    setCopied(false);
  }

  async function copyPackage() {
    await navigator.clipboard.writeText(packageJson);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function downloadPackage() {
    const blob = new Blob([packageJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${run.runId}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="border-b border-white/10 px-6 py-8 sm:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">TA-14 AI Governance Sandbox</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Propose a route. Test its admissibility gaps before consequence.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
                Describe a consequential AI action in ordinary language. The sandbox constructs a candidate Reality → Outcome route,
                preserves unsupported claims as UNKNOWN, and returns a deterministic preliminary decision.
              </p>
            </div>
            <Link
              href="/academy/what-is-a-route"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white transition hover:border-cyan-300/50 hover:bg-white/5"
            >
              Learn the chain
            </Link>
          </div>
        </div>

        <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="border-b border-white/10 p-6 sm:p-10 lg:border-b-0 lg:border-r">
            <div className="flex flex-wrap gap-2">
              {Object.entries(samples).map(([key, value]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPrompt(value)}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300 transition hover:border-cyan-300/40 hover:text-white"
                >
                  {key}
                </button>
              ))}
            </div>

            <label className="mt-6 block text-sm font-medium text-white" htmlFor="sandbox-prompt">
              Consequential action
            </label>
            <textarea
              id="sandbox-prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={10}
              className="mt-3 w-full rounded-3xl border border-white/10 bg-black/30 p-5 text-sm leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50"
              placeholder="Describe who or what may act, what consequence may be created, what evidence is required, who holds authority, and how the outcome will be verified."
            />

            <button
              type="button"
              onClick={runSandbox}
              className="mt-5 w-full rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
            >
              Generate and test route
            </button>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Sandbox boundary</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Generated language is only a route proposal. Production admissibility still requires real evidence, trusted authority,
                canonicalization, cryptographic verification, and execution/outcome correspondence.
              </p>
            </div>
          </section>

          <section className="p-6 sm:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Candidate route</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{run.routeName}</h2>
                <p className="mt-2 text-sm text-slate-400">Readiness score: {run.score}/100</p>
              </div>
              <span className={`w-fit rounded-full border px-4 py-2 text-xs font-bold tracking-[0.18em] ${decisionClasses(run.decision)}`}>
                {run.decision}
              </span>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {run.stages.map((stage, index) => (
                <article key={stage.key} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                      {String(index + 1).padStart(2, "0")} · {stage.label}
                    </p>
                    {stage.value.includes("UNKNOWN") && (
                      <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold text-amber-200">
                        UNKNOWN
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{stage.value}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.82fr]">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/65 p-6 sm:p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Deterministic findings</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">What must be corrected</h2>
            </div>
            <span className="text-sm text-slate-400">{run.findings.length} findings</span>
          </div>

          <div className="mt-6 space-y-4">
            {run.findings.length === 0 ? (
              <div className="rounded-3xl border border-emerald-400/25 bg-emerald-400/10 p-5 text-sm leading-6 text-emerald-100">
                No preliminary text-level defects were detected. This does not prove that the real-world route is admissible.
              </div>
            ) : (
              run.findings.map((finding) => (
                <article key={finding.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-3 py-1 text-[10px] font-bold tracking-[0.14em] ${severityClasses(finding.severity)}`}>
                      {finding.severity}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{finding.stage}</span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-white">{finding.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{finding.detail}</p>
                  <p className="mt-3 text-sm leading-6 text-cyan-200">Correction: {finding.correction}</p>
                </article>
              ))
            )}
          </div>
        </div>

        <aside className="rounded-[2rem] border border-white/10 bg-slate-950/65 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Preserved sandbox record</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">TA14_SANDBOX_RUN_V1</h2>
          <pre className="mt-6 max-h-[34rem] overflow-auto rounded-3xl border border-white/10 bg-black/35 p-5 text-xs leading-6 text-slate-300">
            {packageJson}
          </pre>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={copyPackage}
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              {copied ? "Copied" : "Copy JSON"}
            </button>
            <button
              type="button"
              onClick={downloadPackage}
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
            >
              Download run
            </button>
          </div>

          <div className="mt-6 grid gap-3">
            <Link
              href="/workspace/build"
              className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-center text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/15"
            >
              Correct in Route Builder
            </Link>
            <Link
              href="/workspace/scanner"
              className="rounded-full border border-white/10 px-5 py-3 text-center text-sm font-semibold text-slate-200 transition hover:bg-white/5"
            >
              Send to Readiness Scanner
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
