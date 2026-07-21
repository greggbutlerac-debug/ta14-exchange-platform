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
  signatures: [{ signer: "ta14-exchange-demo", signature: "demo-signature-present" }],
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
      state: routeCommitMatch
        ? "PASS"
        : present(pkg.routeDigest) && present(pkg.committedDigest)
          ? "FAIL"
          : "UNKNOWN",
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
      state: outcomeCorresponds
        ? "PASS"
        : pkg.outcome?.correspondence === false
          ? "FAIL"
          : "UNKNOWN",
    },
  ];
}

function deriveState(checks: VerificationCheck[]): VerificationState {
  const failed = checks.filter((check) => check.state === "FAIL");
  const unknown = checks.filter((check) => check.state === "UNKNOWN");

  if (
    failed.some(
      (check) =>
        check.id === "execution" || check.id === "outcome-correspondence",
    )
  ) {
    return "DIVERGENT";
  }

  if (failed.length > 0) return "DISPUTED";
  if (unknown.length > 0) return "INCOMPLETE";
  return "VERIFIED";
}

function statusClass(state: CheckState | VerificationState) {
  if (state === "PASS" || state === "VERIFIED") return "statusGood";
  if (state === "FAIL" || state === "DIVERGENT" || state === "DISPUTED") {
    return "statusBad";
  }
  return "statusUnknown";
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="17" height="17" fill="none">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ReplayVerificationPage() {
  const [source, setSource] = useState(JSON.stringify(verifiedSample, null, 2));
  const [packageValue, setPackageValue] = useState<ReplayPackage>(verifiedSample);
  const [parseError, setParseError] = useState("");
  const [notice, setNotice] = useState(
    "Loaded a complete demonstration replay package.",
  );
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const checks = useMemo(() => inspect(packageValue), [packageValue]);
  const verificationState = useMemo(() => deriveState(checks), [checks]);
  const passed = checks.filter((check) => check.state === "PASS").length;
  const failed = checks.filter((check) => check.state === "FAIL").length;
  const unknown = checks.filter((check) => check.state === "UNKNOWN").length;
  const score = Math.round((passed / checks.length) * 100);

  function verifyText(text = source) {
    setIsVerifying(true);

    window.setTimeout(() => {
      try {
        const parsed = JSON.parse(text) as ReplayPackage;
        setPackageValue(parsed);
        setParseError("");
        setNotice(`Verification completed: ${deriveState(inspect(parsed))}.`);
      } catch (error) {
        setParseError(error instanceof Error ? error.message : "Invalid JSON.");
        setNotice("The package could not be parsed. Nothing was verified.");
      } finally {
        setIsVerifying(false);
      }
    }, 900);
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

    reader.onerror = () =>
      setParseError("The selected file could not be read.");

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

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${packageValue.routeId ?? "ta14-route"}-verification-report.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice("Verification report downloaded.");
  }

  const chain = [
    ["Identity", checks.find((check) => check.id === "identity")?.state],
    ["Proposal", checks.find((check) => check.id === "receipts")?.state],
    ["Admissibility", checks.find((check) => check.id === "decision")?.state],
    ["Commit", checks.find((check) => check.id === "commit")?.state],
    ["Execution", checks.find((check) => check.id === "execution")?.state],
    ["Outcome", checks.find((check) => check.id === "outcome-correspondence")?.state],
    ["Replay", verificationState === "VERIFIED" ? "PASS" : verificationState === "INCOMPLETE" ? "UNKNOWN" : "FAIL"],
  ] as const;

  return (
    <main className="verificationPage">
      <div className="ambient" aria-hidden="true">
        <span className="glow glowOne" />
        <span className="glow glowTwo" />
        <span className="orbit orbitOne" />
        <span className="orbit orbitTwo" />
        <span className="particle particleOne" />
        <span className="particle particleTwo" />
        <span className="particle particleThree" />
        <span className="scanLine scanLineOne" />
        <span className="scanLine scanLineTwo" />
      </div>

      <section className="hero">
        <div className="shell">
          <div className="eyebrowRow">
            <span>TA-14 EXCHANGE</span>
            <i />
            <span>INDEPENDENT REPLAY VERIFICATION</span>
          </div>

          <div className="heroGrid">
            <div>
              <h1>Verify the route, not the dashboard.</h1>
              <p>
                Load a preserved replay package and inspect whether identity,
                receipts, dependencies, commit correspondence, execution
                correspondence, and outcome evidence remain intact.
              </p>

              <div className="heroActions">
                <button className="primaryButton" onClick={() => verifyText()}>
                  {isVerifying ? "Verifying route..." : "Verify current package"}
                  <ArrowIcon />
                </button>
                <button
                  className="secondaryButton"
                  onClick={() => loadSample(divergentSample, "Divergent sample")}
                >
                  Test divergence
                </button>
              </div>
            </div>

            <aside className="principleCard">
              <span>GOVERNING PRINCIPLE</span>
              <strong>No admissible evidence. No admissible execution.</strong>
              <p>
                Verification is bounded to the preserved package, declared
                fields, and available continuity evidence.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="scoreboardSection">
        <div className="shell">
          <div className="scoreboard">
            <div className="scorePrimary">
              <span className={`stateBadge ${statusClass(verificationState)}`}>
                {verificationState}
              </span>
              <strong>{score}%</strong>
              <small>Structural verification score</small>
            </div>

            <div className="metric">
              <span>ROUTE</span>
              <strong>{packageValue.routeId ?? "UNKNOWN"}</strong>
            </div>

            <div className="metric">
              <span>VERSION</span>
              <strong>{packageValue.routeVersion ?? "UNKNOWN"}</strong>
            </div>

            <div className="metric">
              <span>DECISION</span>
              <strong>{packageValue.decision ?? "UNKNOWN"}</strong>
            </div>

            <div className="metric">
              <span>EVIDENCE CHAIN</span>
              <strong>{unknown === 0 ? "COMPLETE" : "PARTIAL"}</strong>
            </div>
          </div>

          <div className="chainPanel">
            <div className="panelHeading">
              <div>
                <span>REPLAY ROUTE</span>
                <h2>Evidence continuity across the execution chain.</h2>
              </div>
              <small>
                Every node reflects the preserved state evaluated from the
                current replay package.
              </small>
            </div>

            <div className="chain">
              {chain.map(([label, state], index) => (
                <div className="chainSegment" key={label}>
                  <div className={`chainNode ${statusClass(state ?? "UNKNOWN")}`}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{label}</strong>
                  </div>
                  {index < chain.length - 1 ? <div className="connector" /> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="workspaceSection">
        <div className="shell workspaceGrid">
          <div className="inputColumn">
            <div className="dropPanel">
              <div className="panelHeading compact">
                <div>
                  <span>REPLAY PACKAGE</span>
                  <h2>Load preserved evidence.</h2>
                </div>
              </div>

              <label
                className={`dropZone ${isDragging ? "dropZoneActive" : ""}`}
                onDragEnter={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setIsDragging(true);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  event.dataTransfer.dropEffect = "copy";
                  setIsDragging(true);
                }}
                onDragLeave={(event) => {
                  event.preventDefault();
                  event.stopPropagation();

                  if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    return;
                  }

                  setIsDragging(false);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setIsDragging(false);
                  handleFile(event.dataTransfer.files?.[0]);
                }}
              >
                <span className="uploadOrb">+</span>
                <strong>
                  {isDragging
                    ? "Release to load replay package"
                    : "Drop replay package here"}
                </strong>
                <small>JSON only · maximum file size 1 MB</small>
                <span className="browseButton">Browse file</span>
                <input
                  type="file"
                  accept="application/json,.json"
                  onChange={(event) => {
                    handleFile(event.target.files?.[0]);
                    event.currentTarget.value = "";
                  }}
                />
              </label>

              <div className="sampleActions">
                <button
                  onClick={() => loadSample(verifiedSample, "Verified sample")}
                >
                  Load verified sample
                </button>
                <button
                  onClick={() => loadSample(divergentSample, "Divergent sample")}
                >
                  Load divergence
                </button>
              </div>

              <button
                className="advancedToggle"
                onClick={() => setAdvancedOpen((open) => !open)}
                aria-expanded={advancedOpen}
              >
                {advancedOpen ? "Hide advanced JSON editor" : "Open advanced JSON editor"}
              </button>

              {advancedOpen ? (
                <textarea
                  value={source}
                  onChange={(event) => setSource(event.target.value)}
                  spellCheck={false}
                  className="jsonEditor"
                  aria-label="Replay package JSON"
                />
              ) : null}

              {parseError ? <div className="errorPanel">{parseError}</div> : null}

              <button
                onClick={() => verifyText()}
                className="primaryButton fullButton"
                disabled={isVerifying}
              >
                {isVerifying ? "Inspecting evidence chain..." : "Verify replay package"}
                <ArrowIcon />
              </button>
            </div>

            <div className="boundaryCard">
              <span>VERIFICATION BOUNDARY</span>
              <h3>Claims remain bounded to what the package can prove.</h3>
              <p>
                This surface deterministically evaluates the supplied package.
                It does not invent absent receipts or treat declared
                signatures as cryptographically valid without trusted keys and
                canonicalization rules. Unsupported claims remain UNKNOWN.
              </p>
            </div>
          </div>

          <div className="resultColumn">
            <div className="resultPanel">
              <div className="resultHeader">
                <div>
                  <span>VERIFICATION RESULT</span>
                  <h2>{verificationState}</h2>
                </div>
                <button className="secondaryButton" onClick={downloadReport}>
                  Download report
                </button>
              </div>

              <div className="resultMeter">
                <div className="meterTrack">
                  <div className="meterFill" style={{ width: `${score}%` }} />
                </div>
                <div className="meterLabels">
                  <span>Route integrity</span>
                  <strong>{score}%</strong>
                </div>
              </div>

              <div className="totalsGrid">
                <div>
                  <strong>{passed}</strong>
                  <span>PASSED</span>
                </div>
                <div>
                  <strong>{failed}</strong>
                  <span>FAILED</span>
                </div>
                <div>
                  <strong>{unknown}</strong>
                  <span>UNKNOWN</span>
                </div>
              </div>
            </div>

            <div className="checksGrid">
              {checks.map((check, index) => (
                <article className="checkCard" key={check.id}>
                  <div className="checkTopline">
                    <span className="checkNumber">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={`statusPill ${statusClass(check.state)}`}>
                      {check.state}
                    </span>
                  </div>
                  <h3>{check.label}</h3>
                  <p>{check.detail}</p>
                </article>
              ))}
            </div>

            <div className="nextActionCard">
              <div>
                <span>NEXT ACTION</span>
                <h3>Move from verification to governed correction.</h3>
                <p>
                  Divergent and incomplete packages should return to the
                  builder or scanner. The original package remains preserved;
                  corrections create a new version rather than rewriting
                  history.
                </p>
              </div>

              <div className="nextLinks">
                <Link href="/workspace/scanner">
                  Open scanner
                  <ArrowIcon />
                </Link>
                <Link href="/workspace/build">
                  Open builder
                  <ArrowIcon />
                </Link>
                <Link href="/workspace/demonstrations">
                  Run demonstration
                  <ArrowIcon />
                </Link>
              </div>
            </div>

            {notice ? <div className="notice">{notice}</div> : null}
          </div>
        </div>
      </section>

      <section className="certificateSection">
        <div className="shell certificate">
          <div>
            <span>TA-14 REPLAY VERIFICATION</span>
            <h2>Preserved route verification certificate.</h2>
            <p>
              This certificate summarizes the current browser-based structural
              review. Production-grade cryptographic validation requires
              trusted keys, canonicalization rules, and independent source
              access.
            </p>
          </div>

          <div className="certificateGrid">
            <div>
              <span>STATE</span>
              <strong>{verificationState}</strong>
            </div>
            <div>
              <span>ROUTE ID</span>
              <strong>{packageValue.routeId ?? "UNKNOWN"}</strong>
            </div>
            <div>
              <span>VERSION</span>
              <strong>{packageValue.routeVersion ?? "UNKNOWN"}</strong>
            </div>
            <div>
              <span>SCORE</span>
              <strong>{score}%</strong>
            </div>
          </div>

          <div className="certificateFooter">
            <button className="primaryButton" onClick={downloadReport}>
              Download certificate
              <ArrowIcon />
            </button>
            <span>No admissible evidence. No admissible execution.</span>
          </div>
        </div>
      </section>

      <style>{`
        :root {
          --page-bg: #03080d;
          --panel: rgba(8, 26, 35, 0.82);
          --panel-strong: rgba(5, 19, 27, 0.96);
          --border: rgba(116, 223, 222, 0.16);
          --border-strong: rgba(116, 223, 222, 0.34);
          --text: #f5fbfc;
          --muted: #9fb7be;
          --teal: #72e7e4;
          --blue: #73b4ff;
          --gold: #ffd979;
          --violet: #bca8ff;
          --good: #79f0b0;
          --bad: #ff8fa7;
          --unknown: #ffd36d;
        }

        * {
          box-sizing: border-box;
        }

        .verificationPage {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: var(--text);
          background:
            radial-gradient(circle at 10% 0%, rgba(55, 205, 205, 0.14), transparent 28%),
            radial-gradient(circle at 88% 10%, rgba(111, 134, 255, 0.11), transparent 30%),
            linear-gradient(180deg, #02070b 0%, #06131b 48%, #02070b 100%);
        }

        .verificationPage::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.22;
          background-image:
            linear-gradient(rgba(255,255,255,.024) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.024) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: linear-gradient(to bottom, black, transparent 88%);
        }

        .ambient {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .glow {
          position: absolute;
          width: 360px;
          height: 360px;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.12;
          animation: pulseGlow 8s ease-in-out infinite;
        }

        .glowOne {
          top: 5%;
          left: -120px;
          background: var(--teal);
        }

        .glowTwo {
          top: 42%;
          right: -120px;
          background: var(--violet);
          animation-delay: 2.5s;
        }

        .orbit {
          position: absolute;
          border: 1px solid rgba(114, 231, 228, 0.12);
          border-radius: 50%;
          animation: rotateOrbit 20s linear infinite;
        }

        .orbitOne {
          width: 240px;
          height: 240px;
          top: 11%;
          right: 8%;
        }

        .orbitTwo {
          width: 150px;
          height: 150px;
          top: 47%;
          left: 4%;
          animation-direction: reverse;
        }

        .particle {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 0 14px rgba(255,255,255,.9);
          animation: drift 9s ease-in-out infinite;
        }

        .particleOne { top: 15%; left: 22%; }
        .particleTwo { top: 37%; right: 18%; animation-delay: 2s; }
        .particleThree { top: 71%; left: 12%; animation-delay: 4s; }

        .scanLine {
          position: absolute;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(114,231,228,.58), transparent);
          animation: scanMove 12s linear infinite;
        }

        .scanLineOne {
          width: 42vw;
          top: 22%;
          left: -8%;
          transform: rotate(14deg);
        }

        .scanLineTwo {
          width: 36vw;
          top: 64%;
          right: -5%;
          transform: rotate(-17deg);
          animation-delay: -5s;
        }

        .shell {
          position: relative;
          z-index: 2;
          width: min(1240px, calc(100% - 40px));
          margin: 0 auto;
        }

        .hero {
          padding: 92px 0 54px;
          border-bottom: 1px solid rgba(116, 223, 222, 0.09);
        }

        .eyebrowRow {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
          color: var(--teal);
          font-size: 0.72rem;
          font-weight: 850;
          letter-spacing: 0.15em;
        }

        .eyebrowRow i {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--teal);
          box-shadow: 0 0 10px var(--teal);
        }

        .heroGrid {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(320px, .48fr);
          gap: 54px;
          align-items: end;
          margin-top: 26px;
        }

        h1, h2, h3, p {
          margin-top: 0;
        }

        h1 {
          margin-bottom: 22px;
          max-width: 920px;
          font-size: clamp(3.4rem, 7vw, 7.2rem);
          line-height: .92;
          letter-spacing: -.065em;
          text-wrap: balance;
        }

        .hero p {
          max-width: 820px;
          color: var(--muted);
          font-size: 1.08rem;
          line-height: 1.75;
        }

        .heroActions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .primaryButton,
        .secondaryButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 46px;
          padding: 0 18px;
          border-radius: 999px;
          border: 0;
          font: inherit;
          font-size: .86rem;
          font-weight: 850;
          cursor: pointer;
          transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
        }

        .primaryButton {
          color: #031113;
          background: linear-gradient(135deg, var(--teal), #c4fbf7);
          box-shadow: 0 14px 34px rgba(61, 202, 199, .22);
        }

        .secondaryButton {
          color: var(--text);
          border: 1px solid var(--border-strong);
          background: rgba(9, 29, 39, .7);
        }

        .primaryButton:hover,
        .secondaryButton:hover {
          transform: translateY(-2px);
        }

        .primaryButton:disabled {
          cursor: wait;
          opacity: .72;
          transform: none;
        }

        .principleCard {
          padding: 24px;
          border: 1px solid var(--border-strong);
          border-radius: 24px;
          background:
            radial-gradient(circle at 0 0, rgba(114,231,228,.11), transparent 30%),
            linear-gradient(145deg, rgba(10,32,42,.92), rgba(4,15,22,.96));
        }

        .principleCard > span,
        .panelHeading span,
        .boundaryCard > span,
        .resultHeader span,
        .nextActionCard > div > span,
        .certificate > div:first-child > span,
        .metric span,
        .certificateGrid span {
          color: var(--teal);
          font-size: .67rem;
          font-weight: 850;
          letter-spacing: .13em;
        }

        .principleCard strong {
          display: block;
          margin-top: 12px;
          font-size: 1.45rem;
          line-height: 1.25;
        }

        .principleCard p {
          margin: 14px 0 0;
          font-size: .88rem;
          line-height: 1.65;
        }

        .scoreboardSection {
          padding: 28px 0 40px;
        }

        .scoreboard {
          display: grid;
          grid-template-columns: 1.25fr repeat(4, minmax(0, 1fr));
          gap: 10px;
        }

        .scorePrimary,
        .metric {
          min-height: 126px;
          padding: 18px;
          border: 1px solid var(--border);
          border-radius: 18px;
          background: rgba(6, 22, 31, .74);
          backdrop-filter: blur(14px);
        }

        .scorePrimary {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 10px 16px;
          align-items: center;
        }

        .scorePrimary strong {
          font-size: 2.7rem;
          letter-spacing: -.05em;
        }

        .scorePrimary small {
          grid-column: 1 / -1;
          color: var(--muted);
        }

        .stateBadge,
        .statusPill {
          display: inline-flex;
          align-items: center;
          width: fit-content;
          border: 1px solid;
          border-radius: 999px;
          padding: 7px 10px;
          font-size: .68rem;
          font-weight: 900;
          letter-spacing: .08em;
        }

        .statusGood {
          color: var(--good);
          border-color: rgba(121,240,176,.34);
          background: rgba(121,240,176,.09);
        }

        .statusBad {
          color: var(--bad);
          border-color: rgba(255,143,167,.34);
          background: rgba(255,143,167,.09);
        }

        .statusUnknown {
          color: var(--unknown);
          border-color: rgba(255,211,109,.34);
          background: rgba(255,211,109,.09);
        }

        .metric {
          display: grid;
          gap: 12px;
          align-content: center;
        }

        .metric strong {
          overflow-wrap: anywhere;
          font-size: .94rem;
          line-height: 1.4;
        }

        .chainPanel,
        .dropPanel,
        .resultPanel,
        .boundaryCard,
        .nextActionCard,
        .certificate {
          border: 1px solid var(--border-strong);
          background:
            radial-gradient(circle at 0 0, rgba(114,231,228,.08), transparent 28%),
            linear-gradient(145deg, rgba(8,28,39,.88), rgba(4,16,23,.96));
          box-shadow: 0 24px 60px rgba(0,0,0,.2);
        }

        .chainPanel {
          margin-top: 16px;
          padding: 24px;
          border-radius: 22px;
        }

        .panelHeading {
          display: grid;
          grid-template-columns: 1fr minmax(250px, 420px);
          gap: 30px;
          align-items: end;
        }

        .panelHeading.compact {
          grid-template-columns: 1fr;
        }

        .panelHeading h2,
        .dropPanel h2,
        .resultHeader h2,
        .certificate h2 {
          margin: 8px 0 0;
          font-size: clamp(1.8rem, 3.4vw, 3.6rem);
          line-height: 1.05;
          letter-spacing: -.045em;
        }

        .panelHeading small {
          color: var(--muted);
          line-height: 1.6;
        }

        .chain {
          display: flex;
          align-items: center;
          overflow-x: auto;
          margin-top: 26px;
          padding-bottom: 4px;
        }

        .chainSegment {
          display: flex;
          flex: 1 0 auto;
          align-items: center;
        }

        .chainNode {
          min-width: 126px;
          padding: 14px;
          border: 1px solid;
          border-radius: 16px;
        }

        .chainNode span {
          display: block;
          font-size: .62rem;
          opacity: .7;
        }

        .chainNode strong {
          display: block;
          margin-top: 8px;
          font-size: .84rem;
        }

        .connector {
          width: 36px;
          height: 1px;
          background: linear-gradient(90deg, rgba(114,231,228,.2), rgba(114,231,228,.8));
          box-shadow: 0 0 10px rgba(114,231,228,.28);
        }

        .workspaceSection {
          padding: 42px 0 96px;
        }

        .workspaceGrid {
          display: grid;
          grid-template-columns: minmax(0, .82fr) minmax(0, 1.18fr);
          gap: 22px;
          align-items: start;
        }

        .inputColumn,
        .resultColumn {
          display: grid;
          gap: 16px;
        }

        .dropPanel,
        .resultPanel,
        .boundaryCard,
        .nextActionCard {
          padding: 24px;
          border-radius: 22px;
        }

        .dropZone {
          display: grid;
          place-items: center;
          min-height: 285px;
          margin-top: 22px;
          padding: 28px;
          border: 1px dashed rgba(114,231,228,.42);
          border-radius: 20px;
          text-align: center;
          background:
            radial-gradient(circle at center, rgba(114,231,228,.08), transparent 50%),
            rgba(255,255,255,.012);
          cursor: pointer;
          transition: border-color 180ms ease, background 180ms ease, transform 180ms ease;
        }

        .dropZone:hover,
        .dropZoneActive {
          transform: translateY(-2px);
          border-color: var(--teal);
          background:
            radial-gradient(circle at center, rgba(114,231,228,.15), transparent 52%),
            rgba(114,231,228,.035);
          box-shadow:
            inset 0 0 0 1px rgba(114,231,228,.12),
            0 0 34px rgba(114,231,228,.1);
        }

        .dropZoneActive .uploadOrb {
          transform: scale(1.08);
          box-shadow: 0 0 46px rgba(114,231,228,.42);
        }

        .dropZone input {
          display: none;
        }

        .uploadOrb {
          display: grid;
          place-items: center;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          color: #031113;
          background: var(--teal);
          box-shadow: 0 0 34px rgba(114,231,228,.26);
          font-size: 1.8rem;
          font-weight: 500;
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        .dropZone strong {
          margin-top: 18px;
          font-size: 1.3rem;
        }

        .dropZone small {
          margin-top: 8px;
          color: var(--muted);
        }

        .browseButton {
          margin-top: 18px;
          padding: 10px 16px;
          border-radius: 999px;
          border: 1px solid var(--border-strong);
          background: rgba(7,24,33,.8);
          font-size: .82rem;
          font-weight: 800;
        }

        .sampleActions {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 12px;
        }

        .sampleActions button,
        .advancedToggle {
          min-height: 42px;
          border: 1px solid var(--border);
          border-radius: 12px;
          color: var(--text);
          background: rgba(255,255,255,.018);
          font: inherit;
          font-size: .78rem;
          font-weight: 750;
          cursor: pointer;
        }

        .advancedToggle {
          width: 100%;
          margin-top: 12px;
        }

        .jsonEditor {
          width: 100%;
          min-height: 360px;
          margin-top: 12px;
          resize: vertical;
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 15px;
          color: #d7e7ea;
          background: rgba(0,0,0,.34);
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: .75rem;
          line-height: 1.65;
          outline: none;
        }

        .jsonEditor:focus {
          border-color: var(--teal);
        }

        .errorPanel {
          margin-top: 12px;
          padding: 13px;
          border: 1px solid rgba(255,143,167,.35);
          border-radius: 14px;
          color: var(--bad);
          background: rgba(255,143,167,.08);
          font-size: .82rem;
        }

        .fullButton {
          width: 100%;
          margin-top: 14px;
        }

        .boundaryCard h3,
        .nextActionCard h3 {
          margin: 10px 0 12px;
          font-size: 1.45rem;
          line-height: 1.2;
        }

        .boundaryCard p,
        .nextActionCard p,
        .certificate p {
          margin: 0;
          color: var(--muted);
          line-height: 1.7;
        }

        .resultHeader {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 18px;
        }

        .resultMeter {
          margin-top: 24px;
        }

        .meterTrack {
          height: 12px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255,255,255,.07);
        }

        .meterFill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, var(--teal), var(--blue));
          box-shadow: 0 0 18px rgba(114,231,228,.28);
          transition: width 500ms ease;
        }

        .meterLabels {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          color: var(--muted);
          font-size: .78rem;
        }

        .meterLabels strong {
          color: var(--text);
        }

        .totalsGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0,1fr));
          gap: 10px;
          margin-top: 18px;
        }

        .totalsGrid > div {
          padding: 16px;
          border: 1px solid var(--border);
          border-radius: 15px;
          background: rgba(0,0,0,.18);
        }

        .totalsGrid strong {
          display: block;
          font-size: 1.8rem;
        }

        .totalsGrid span {
          display: block;
          margin-top: 5px;
          color: var(--muted);
          font-size: .64rem;
          letter-spacing: .12em;
        }

        .checksGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 12px;
        }

        .checkCard {
          min-height: 180px;
          padding: 18px;
          border: 1px solid var(--border);
          border-radius: 18px;
          background: rgba(7,24,33,.72);
          transition: transform 180ms ease, border-color 180ms ease;
        }

        .checkCard:hover {
          transform: translateY(-3px);
          border-color: var(--border-strong);
        }

        .checkTopline {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .checkNumber {
          display: grid;
          place-items: center;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          color: #031113;
          background: var(--teal);
          font-size: .66rem;
          font-weight: 900;
        }

        .checkCard h3 {
          margin: 24px 0 10px;
          font-size: 1.05rem;
        }

        .checkCard p {
          margin: 0;
          color: var(--muted);
          font-size: .84rem;
          line-height: 1.6;
        }

        .nextActionCard {
          display: grid;
          grid-template-columns: 1fr minmax(200px, .42fr);
          gap: 24px;
          align-items: center;
        }

        .nextLinks {
          display: grid;
          gap: 9px;
        }

        .nextLinks a {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 42px;
          padding: 0 14px;
          border: 1px solid var(--border);
          border-radius: 12px;
          color: var(--text);
          text-decoration: none;
          font-size: .78rem;
          font-weight: 800;
          background: rgba(255,255,255,.018);
        }

        .notice {
          padding: 13px 15px;
          border: 1px solid var(--border);
          border-radius: 14px;
          color: #cde0e4;
          background: rgba(0,0,0,.24);
          font-size: .82rem;
        }

        .certificateSection {
          padding: 0 0 86px;
        }

        .certificate {
          padding: 32px;
          border-radius: 26px;
        }

        .certificate p {
          max-width: 760px;
          margin-top: 14px;
        }

        .certificateGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0,1fr));
          gap: 10px;
          margin-top: 28px;
        }

        .certificateGrid > div {
          padding: 16px;
          border: 1px solid var(--border);
          border-radius: 15px;
          background: rgba(0,0,0,.18);
        }

        .certificateGrid strong {
          display: block;
          margin-top: 8px;
          overflow-wrap: anywhere;
          font-size: .9rem;
        }

        .certificateFooter {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
          margin-top: 24px;
          padding-top: 22px;
          border-top: 1px solid var(--border);
        }

        .certificateFooter > span {
          color: var(--teal);
          font-size: .74rem;
          font-weight: 850;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        @keyframes pulseGlow {
          0%,100% { opacity: .08; transform: scale(.95); }
          50% { opacity: .15; transform: scale(1.08); }
        }

        @keyframes rotateOrbit {
          to { transform: rotate(360deg); }
        }

        @keyframes drift {
          0%,100% { transform: translate3d(0,0,0) scale(.8); opacity: .28; }
          50% { transform: translate3d(18px,-24px,0) scale(1.3); opacity: 1; }
        }

        @keyframes scanMove {
          0% { opacity: 0; translate: -12% 0; }
          20%,80% { opacity: .7; }
          100% { opacity: 0; translate: 40% 0; }
        }

        @media (max-width: 1100px) {
          .scoreboard {
            grid-template-columns: repeat(2, minmax(0,1fr));
          }

          .scorePrimary {
            grid-column: 1 / -1;
          }

          .workspaceGrid,
          .heroGrid,
          .nextActionCard {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .shell {
            width: min(100% - 24px, 1240px);
          }

          .hero {
            padding-top: 68px;
          }

          .panelHeading,
          .certificateGrid {
            grid-template-columns: 1fr;
          }

          .checksGrid {
            grid-template-columns: 1fr;
          }

          .resultHeader,
          .certificateFooter {
            align-items: stretch;
            flex-direction: column;
          }

          .secondaryButton,
          .certificateFooter .primaryButton {
            width: 100%;
          }
        }

        @media (max-width: 560px) {
          h1 {
            font-size: clamp(2.8rem, 16vw, 4.5rem);
          }

          .scoreboard,
          .sampleActions,
          .totalsGrid {
            grid-template-columns: 1fr;
          }

          .heroActions {
            flex-direction: column;
          }

          .heroActions .primaryButton,
          .heroActions .secondaryButton {
            width: 100%;
          }

          .dropPanel,
          .resultPanel,
          .boundaryCard,
          .nextActionCard,
          .certificate {
            padding: 20px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: .001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .001ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </main>
  );
}
