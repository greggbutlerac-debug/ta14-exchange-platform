"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type VerificationState = "VERIFIED" | "DIVERGENT" | "INCOMPLETE" | "DISPUTED";
type CheckState = "PASS" | "FAIL" | "UNKNOWN";

type VerificationCheck = {
  id: string;
  label: string;
  detail: string;
  state: CheckState;
};

type ReplayPackage = {
  schema?: string;
  routeId?: string;
  routeVersion?: string;
  decision?: string;
  routeDigest?: string;
  committedDigest?: string;
  executionDigest?: string;
  outcomeDigest?: string;
  receipts?: {
    proposal?: unknown;
    admissibility?: unknown;
    commit?: unknown;
    execution?: unknown;
    outcome?: unknown;
  };
  dependencies?: string[];
  signatures?: Array<{ signer?: string; signature?: string }>;
  outcome?: {
    status?: string;
    correspondence?: boolean;
    authoritativeReceipt?: string;
  };
};

const verifiedSample: ReplayPackage = {
  schema: "TA14_REPLAY_PACKAGE_V1",
  routeId: "vendor-payment-2026-0717-0042",
  routeVersion: "3.0.0",
  decision: "ALLOW",
  routeDigest: "sha256:4f21e561c935e2c30b705482fd6957fd18d617d7a11e2a73a73b6797db92f134",
  committedDigest: "sha256:4f21e561c935e2c30b705482fd6957fd18d617d7a11e2a73a73b6797db92f134",
  executionDigest: "sha256:4f21e561c935e2c30b705482fd6957fd18d617d7a11e2a73a73b6797db92f134",
  outcomeDigest: "sha256:ba4de1b2ddc20d06dcfdbb4a0ec7f271e6ec48c7f79de4a76e62560b0f6d90aa",
  receipts: {
    proposal: { receiptId: "prop-0042", status: "PROPOSED" },
    admissibility: { receiptId: "adm-0042", decision: "ALLOW" },
    commit: { receiptId: "commit-0042", status: "COMMITTED" },
    execution: { receiptId: "exec-0042", status: "EXECUTED" },
    outcome: { receiptId: "outcome-0042", status: "SETTLED" },
  },
  dependencies: ["prop-0042", "adm-0042", "commit-0042", "exec-0042", "outcome-0042"],
  signatures: [
    { signer: "ta14-exchange-demo", signature: "demo-signature-present" },
  ],
  outcome: {
    status: "SETTLED",
    correspondence: true,
    authoritativeReceipt: "bank-settlement-881913",
  },
};

const divergentSample: ReplayPackage = {
  ...verifiedSample,
  routeId: "vendor-payment-2026-0717-0099",
  executionDigest: "sha256:7e29816a63859bd3cd6f59cab14b35898795dd40d23916af7eb460b7d895e902",
  outcome: {
    status: "SETTLED",
    correspondence: false,
    authoritativeReceipt: "bank-settlement-881991",
  },
};

function stateClasses(state: CheckState | VerificationState) {
  if (state === "PASS" || state === "VERIFIED") {
    return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
  }
  if (state === "FAIL" || state === "DIVERGENT" || state === "DISPUTED") {
    return "border-rose-400/30 bg-rose-400/10 text-rose-200";
  }
  return "border-amber-400/30 bg-amber-400/10 text-amber-200";
}

function present(value: unknown) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0 && value !== "UNKNOWN";
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value as object).length > 0;
  return true;
}

function inspect(pkg: ReplayPackage): VerificationCheck[] {
  const receiptNames = ["proposal", "admissibility", "commit", "execution", "outcome"] as const;
  const receipts = pkg.receipts ?? {};
  const dependencies = pkg.dependencies ?? [];

  const routeIdentity = present(pkg.routeId) && present(pkg.routeVersion);
  const schemaKnown = pkg.schema === "TA14_REPLAY_PACKAGE_V1";
  const routeCommitMatch = present(pkg.routeDigest) && pkg.routeDigest === pkg.committedDigest;
  const executionMatch = present(pkg.executionDigest) && pkg.executionDigest === pkg.committedDigest;
  const allReceipts = receiptNames.every((name) => present(receipts[name]));
  const allDependencies = receiptNames.every((name) => {
    const receipt = receipts[name] as { receiptId?: string } | undefined;
    return !!receipt?.receiptId && dependencies.includes(receipt.receiptId);
  });
  const signaturePresent = (pkg.signatures ?? []).some(
    (signature) => present(signature.signer) && present(signature.signature),
  );
  const outcomePresent = present(pkg.outcomeDigest) && present(pkg.outcome?.authoritativeReceipt);
  const outcomeCorresponds = pkg.outcome?.correspondence === true;

  return [
    {
      id: "schema",
      label: "Replay schema",
      detail: schemaKnown
        ? "The package declares TA14_REPLAY_PACKAGE_V1."
        : "The replay schema is missing or unsupported.",
      state: schemaKnown ? "PASS" : "UNKNOWN",
    },
    {
      id: "identity",
      label: "Route identity",
      detail: routeIdentity
        ? `${pkg.routeId} · version ${pkg.routeVersion}`
        : "Route identity or version is missing.",
      state: routeIdentity ? "PASS" : "UNKNOWN",
    },
    {
      id: "decision",
      label: "Admissibility decision",
      detail: present(pkg.decision)
        ? `The preserved decision is ${pkg.decision}.`
        : "No preserved route decision was found.",
      state: present(pkg.decision) ? "PASS" : "UNKNOWN",
    },
    {
      id: "commit",
      label: "Route-to-commit correspondence",
      detail: routeCommitMatch
        ? "The route digest matches the committed digest."
        : "The route digest does not match the committed digest, or one is missing.",
      state: routeCommitMatch ? "PASS" : present(pkg.routeDigest) && present(pkg.committedDigest) ? "FAIL" : "UNKNOWN",
    },
    {
      id: "execution",
      label: "Execution correspondence",
      detail: executionMatch
        ? "The executed payload corresponds to the committed route."
        : "The execution digest diverges from the committed route, or cannot be evaluated.",
      state: executionMatch
        ? "PASS"
        : present(pkg.executionDigest) && present(pkg.committedDigest)
          ? "FAIL"
          : "UNKNOWN",
    },
    {
      id: "receipts",
      label: "Required receipt set",
      detail: allReceipts
        ? "Proposal, admissibility, commit, execution, and outcome receipts are present."
        : "One or more required receipts are missing.",
      state: allReceipts ? "PASS" : "UNKNOWN",
    },
    {
      id: "dependencies",
      label: "Receipt dependency continuity",
      detail: allDependencies
        ? "Every required receipt is represented in the dependency chain."
        : "Receipt dependencies are incomplete or disconnected.",
      state: allDependencies ? "PASS" : "UNKNOWN",
    },
    {
      id: "signature",
      label: "Signature presence",
      detail: signaturePresent
        ? "At least one signer and signature value are preserved."
        : "No usable signature record is present.",
      state: signaturePresent ? "PASS" : "UNKNOWN",
    },
    {
      id: "outcome",
      label: "Outcome evidence",
      detail: outcomePresent
        ? "An outcome digest and authoritative external receipt are preserved."
        : "Authoritative outcome evidence is incomplete.",
      state: outcomePresent ? "PASS" : "UNKNOWN",
    },
    {
      id: "outcome-correspondence",
      label: "Outcome correspondence",
      detail: outcomeCorresponds
        ? "The authoritative outcome corresponds to the admitted and executed route."
        : pkg.outcome?.correspondence === false
          ? "The outcome is explicitly marked as divergent."
          : "Outcome correspondence is unresolved.",
      state: outcomeCorresponds ? "PASS" : pkg.outcome?.correspondence === false ? "FAIL" : "UNKNOWN",
    },
  ];
}

function deriveState(checks: VerificationCheck[]): VerificationState {
  const failed = checks.filter((check) => check.state === "FAIL");
  const unknown = checks.filter((check) => check.state === "UNKNOWN");

  if (failed.some((check) => check.id === "execution" || check.id === "outcome-correspondence")) {
    return "DIVERGENT";
  }
  if (failed.length > 0) return "DISPUTED";
  if (unknown.length > 0) return "INCOMPLETE";
  return "VERIFIED";
}

export default function ReplayVerificationPage() {
  const [source, setSource] = useState(JSON.stringify(verifiedSample, null, 2));
  const [packageValue, setPackageValue] = useState<ReplayPackage>(verifiedSample);
  const [parseError, setParseError] = useState("");
  const [notice, setNotice] = useState("Loaded a complete demonstration replay package.");

  const checks = useMemo(() => inspect(packageValue), [packageValue]);
  const verificationState = useMemo(() => deriveState(checks), [checks]);
  const passed = checks.filter((check) => check.state === "PASS").length;
  const failed = checks.filter((check) => check.state === "FAIL").length;
  const unknown = checks.filter((check) => check.state === "UNKNOWN").length;
  const score = Math.round((passed / checks.length) * 100);

  function verifyText(text = source) {
    try {
      const parsed = JSON.parse(text) as ReplayPackage;
      setPackageValue(parsed);
      setParseError("");
      setNotice(`Verification completed: ${deriveState(inspect(parsed))}.`);
    } catch (error) {
      setParseError(error instanceof Error ? error.message : "Invalid JSON.");
      setNotice("The package could not be parsed. Nothing was verified.");
    }
  }

  function loadSample(sample: ReplayPackage, label: string) {
    const serialized = JSON.stringify(sample, null, 2);
    setSource(serialized);
    setPackageValue(sample);
    setParseError("");
    setNotice(`${label} loaded.`);
  }

  function handleFile(file?: File) {
    if (!file) return;
    if (file.size > 1024 * 1024) {
      setParseError("The selected file exceeds the 1 MB verification limit.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      setSource(text);
      verifyText(text);
      setNotice(`Loaded ${file.name} and evaluated its replay structure.`);
    };
    reader.onerror = () => setParseError("The selected file could not be read.");
    reader.readAsText(file);
  }

  function downloadReport() {
    const report = {
      schema: "TA14_REPLAY_VERIFICATION_REPORT_V1",
      generatedAt: new Date().toISOString(),
      routeId: packageValue.routeId ?? "UNKNOWN",
      routeVersion: packageValue.routeVersion ?? "UNKNOWN",
      verificationState,
      score,
      totals: { passed, failed, unknown },
      checks,
      limitation:
        "This browser verification surface evaluates preserved package structure and declared correspondence. Production cryptographic verification requires trusted keys, canonicalization rules, and independent source access.",
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${packageValue.routeId ?? "ta14-route"}-verification-report.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice("Verification report downloaded.");
  }

  return (
    <main className="min-h-screen bg-[#07090d] text-white">
      <section className="relative overflow-hidden border-b border-white/10 px-5 py-16 sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(56,189,248,0.14),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(168,85,247,0.12),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-5 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.22em] text-sky-200/80">
            <span>TA-14 Exchange</span>
            <span className="h-1 w-1 rounded-full bg-sky-300" />
            <span>Independent Replay Verification</span>
          </div>
          <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
                Verify the route, not the dashboard.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                Load a preserved replay package and inspect whether identity, receipts, dependencies,
                commit correspondence, execution correspondence, and outcome evidence remain intact.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Governing principle</p>
              <p className="mt-3 text-xl font-medium">No admissible evidence. No admissible execution.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-12">
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Replay package</p>
                <h2 className="mt-2 text-2xl font-semibold">Paste or upload JSON</h2>
              </div>
              <label className="cursor-pointer rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-300/50 hover:bg-sky-300/10">
                Upload package
                <input
                  className="hidden"
                  type="file"
                  accept="application/json,.json"
                  onChange={(event) => handleFile(event.target.files?.[0])}
                />
              </label>
            </div>

            <textarea
              value={source}
              onChange={(event) => setSource(event.target.value)}
              spellCheck={false}
              className="mt-5 min-h-[430px] w-full resize-y rounded-2xl border border-white/10 bg-black/30 p-4 font-mono text-xs leading-6 text-slate-200 outline-none transition focus:border-sky-300/50"
              aria-label="Replay package JSON"
            />

            {parseError ? (
              <div className="mt-3 rounded-2xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-200">
                {parseError}
              </div>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => verifyText()}
                className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-sky-100"
              >
                Verify package
              </button>
              <button
                onClick={() => loadSample(verifiedSample, "Verified sample")}
                className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-slate-200 transition hover:bg-white/5"
              >
                Load verified sample
              </button>
              <button
                onClick={() => loadSample(divergentSample, "Divergent sample")}
                className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-slate-200 transition hover:bg-white/5"
              >
                Load divergence
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 text-sm leading-7 text-slate-300 sm:p-6">
            <h3 className="text-lg font-semibold text-white">Verification boundary</h3>
            <p className="mt-3">
              This surface deterministically evaluates the package fields provided to it. It does not
              invent absent receipts or treat a declared signature as cryptographically valid without
              trusted keys and canonicalization rules. Unsupported claims remain UNKNOWN.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Verification result</p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span className={`rounded-full border px-4 py-2 text-sm font-semibold ${stateClasses(verificationState)}`}>
                    {verificationState}
                  </span>
                  <span className="text-sm text-slate-400">{score}% structural verification score</span>
                </div>
              </div>
              <button
                onClick={downloadReport}
                className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-300/50 hover:bg-sky-300/10"
              >
                Download report
              </button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-2xl font-semibold text-emerald-200">{passed}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">Passed</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-2xl font-semibold text-rose-200">{failed}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">Failed</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-2xl font-semibold text-amber-200">{unknown}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">Unknown</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-400">Route</span>
                <span className="text-right font-mono text-xs text-slate-200">
                  {packageValue.routeId ?? "UNKNOWN"}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-400">Version</span>
                <span className="font-mono text-xs text-slate-200">
                  {packageValue.routeVersion ?? "UNKNOWN"}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-400">Decision</span>
                <span className="font-mono text-xs text-slate-200">
                  {packageValue.decision ?? "UNKNOWN"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {checks.map((check, index) => (
              <article
                key={check.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.05]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/25 text-xs text-slate-400">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-medium text-white">{check.label}</h3>
                      <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${stateClasses(check.state)}`}>
                        {check.state}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{check.detail}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="rounded-3xl border border-sky-300/20 bg-sky-300/[0.06] p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-sky-200/80">Next action</p>
            <h3 className="mt-2 text-xl font-semibold">Move from verification to governed correction.</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Divergent and incomplete packages should return to the builder or scanner. The original
              package remains preserved; corrections create a new version rather than rewriting history.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/workspace/scanner"
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-sky-100"
              >
                Open scanner
              </Link>
              <Link
                href="/workspace/build"
                className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/5"
              >
                Open builder
              </Link>
              <Link
                href="/workspace/demonstrations"
                className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/5"
              >
                Run demonstration
              </Link>
            </div>
          </div>

          {notice ? (
            <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-slate-300">
              {notice}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
