/*
 * Builds the HTML source of the technical examination PDF from a fresh simulation run.
 * Skipped unless TA14_RCB_WRITE_REPORT=1:
 *   TA14_RCB_WRITE_REPORT=1 npx vitest run scripts/refrigeration-boundary/build-report.spec.tsx
 * Then print it to PDF with headless Chrome (see docs/refrigeration-consequence-boundary/README.md).
 * Every figure in the report comes from the run; nothing is typed in by hand except the test
 * counts in TEST_RESULTS, which are recorded from the validation runs and dated.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { it } from "vitest";
import { DriftChart } from "../../apps/web/app/showrooms/refrigeration-consequence-boundary/DriftChart";
import { BASELINE, SIMULATION_LABEL, sealBaseline } from "../../apps/web/lib/refrigeration-boundary/baseline";
import { MODEL } from "../../apps/web/lib/refrigeration-boundary/plant";
import { runAllScenarios, runExtensionScenarios, type ScenarioResult } from "../../apps/web/lib/refrigeration-boundary/scenarios";
import { PROTECTIVE_MEASURES, emergencyProtocol } from "../../apps/web/lib/refrigeration-boundary/emergency";
import { buildLessons } from "../../apps/web/app/showrooms/refrigeration-consequence-boundary/lessons";

const OUT = join(__dirname, "..", "..", "docs/refrigeration-consequence-boundary/TA-14_Refrigeration_Consequence_Boundary_Technical_Examination_v1.html");
const TEST_RESULTS = {
  date: "2026-11-04",
  base: "origin/main f636d639 (merged)",
  rcbSuite: "33 passed, 0 failed (tests/acceptance/refrigeration-consequence-boundary.spec.ts)",
  emergencySuite: "28 passed, 0 failed (tests/acceptance/refrigeration-emergency-pathway.spec.ts), of which 22 are adversarial",
  gateSuite: "15 passed, 0 failed (tests/acceptance/refrigeration-owner-gate.spec.ts): owner gate, no third-party attribution, no emergency authorization from untrusted signals",
  fullSuite: "266 passed, 3 skipped (the gated export and report generator scripts, which run only when explicitly enabled), 0 failed; 25 test files",
  typecheck: "tsc --noEmit: 0 errors",
  build: "next build: succeeded (963 pages); the showroom and its evidence and PDF routes are dynamic and owner-gated; no lint script exists in the repository",
};

const esc = (s: unknown) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const hhmm = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const badge = (s: string) => `<span class="b ${s}">${s.replace("_", " ")}</span>`;

function scenarioSection(r: ScenarioResult) {
  const chart = renderToStaticMarkup(<DriftChart series={r.series} band={BASELINE.approvedAirBandC} productLimit={BASELINE.productLimitC} title={`${r.id} temperatures`} events={r.groundTruth.bypassActions.map((b) => ({ minute: b.minute, label: "bypass" }))} />);
  const aea = r.aea.submissions.length === 0
    ? "Not involved. The command bypassed the governed route; no determination exists and none was fabricated."
    : `<ul>${r.aea.submissions.map((s) => `<li>${hhmm(s.atMinute)} · ${esc(s.label)} (actor ${esc(s.actorId)}): <b>${s.determination}</b>${s.execution ? ` → execution <b>${s.execution.determination}</b>` : ""} · <span class="m">${esc([...s.reasonCodes, ...(s.execution?.reasonCodes ?? [])].join(", "))}</span></li>`).join("")}</ul>`;
  const ein = r.ein.transitions.length === 0 ? "NORMAL throughout." : r.ein.transitions.map((t) => `${hhmm(t.minute)} ${t.to}`).join(" → ");
  const alerts = [
    r.alerts.ein.length ? `EIN alerts: ${r.alerts.ein.map((a) => `${a.status} at ${hhmm(a.minute)}`).join(", ")}` : "No EIN alert.",
    r.alerts.controllerAlarm.length ? `Controller self-reported alarm at ${r.alerts.controllerAlarm.map((a) => hhmm(a.minute)).join(", ")}.` : "No controller alarm.",
    r.alerts.controllerAlarmSuppressed ? "The controller alarm condition was met while the alarm was suppressed." : "",
  ].filter(Boolean).join(" ");
  return `<section class="scn"><h3>${r.id} · ${esc(r.title)}</h3>
  <table class="kv">
  <tr><th>Attempted</th><td>${esc(r.attempted)}</td></tr>
  <tr><th>What AEA observed</th><td>${aea}</td></tr>
  <tr><th>What EIN independently observed</th><td>${esc(ein)}${r.ein.firstDeviationMinute !== null ? ` First deviation finding at ${hhmm(r.ein.firstDeviationMinute)}.` : ""}</td></tr>
  <tr><th>What EIR preserved</th><td>${r.eir.entries} hash-chained entries (${Object.entries(r.eir.byType).map(([k, v]) => `${k} ${v}`).join(", ")}); verification ${r.eir.verification.valid ? "VALID" : "INVALID"}; ${r.eir.evidenceGaps} evidence gaps; chain head <span class="m">${r.eir.chainHead.slice(0, 32)}…</span></td></tr>
  <tr><th>Alert</th><td>${esc(alerts)}</td></tr>
  <tr><th>Physical change (simulation ground truth)</th><td>${r.physical.changed ? `Yes. Product peaked at ${r.physical.maxTruthProductC} °C; ${r.physical.truthMinutesProductAboveLimit} min above ${BASELINE.productLimitC} °C; ${r.physical.endTruthProductC} °C at the end.` : `No deviation beyond authorized defrosts (product max ${r.physical.maxTruthProductC} °C).`}</td></tr>
  <tr><th>Outcome</th><td>${esc(r.outcome)}</td></tr>
  <tr><th>Claims</th><td>${r.claims.map((c) => `<div>${badge(c.status)} <b>${c.capability}</b>: ${esc(c.basis)}</div>`).join("")}</td></tr>
  <tr><th>What remains unproven</th><td><ul>${r.unproven.map((u) => `<li>${esc(u)}</li>`).join("")}</ul></td></tr>
  </table><div class="chart">${chart}</div></section>`;
}

function emergencySection(extension: ScenarioResult[]) {
  const p = emergencyProtocol();
  return `<h2>9A. Emergency-response pathway (extension)</h2>
  <p>S6 is preserved unchanged as a documented failure: with independent evidence lost, ordinary governance held the corrective action and the product warmed. The GCEA engine is not modified to force an ALLOW. Instead, a separately authorized pathway is defined with three tiers that are never interchangeable.</p>
  <table><tr><th>Tier</th><th>Permitted</th><th>Required</th></tr>
  <tr><td>E0 Emergency notification</td><td>Notify the responder and facility manager. No equipment effect.</td><td>An evidence-loss trigger; always recorded.</td></tr>
  <tr><td>E1 Protective measure</td><td>${Object.entries(PROTECTIVE_MEASURES).map(([k, v]) => `<b>${k}</b>: ${esc(v)}`).join("<br>")}<br>Each takes no parameters and only re-asserts a sealed-baseline value.</td><td>Protocol ${p.protocolId} bound to the sealed baseline; a pre-issued GCEA authority scoped to route <span class="m">${p.routeId}</span> and the specific measure; emergency-responder standing; independent evidence lost for ≥ ${p.activation.sustainedMin} min, computed from the EIN record (never caller-supplied); one use per measure per incident; revalidation at execution, including the condition; ${p.followUp.toLowerCase().replace(/_/g, " ")}.</td></tr>
  <tr><td>E2 Consequential command</td><td>Defrost, any other setpoint, disabling alarms or reporting.</td><td><b>Not available on the emergency path</b>; ordinary governance only.</td></tr></table>
  <p><b>Evidence appropriate to the action.</b> E1's evidence is the recorded, continuous EIN determination that state cannot be established, combined with the structural guarantee that the measure can only restore sealed values. GCEA receives that evidence standing honestly. When independent evidence is available, the emergency route is refused (DENY), so it cannot substitute for ordinary governance. If evidence returns before execution, execution is refused.</p>
  <p><b>Adversarial tests (22, all passing):</b> evidence available → DENY; loss not yet sustained → HOLD; actor without responder standing (even with a stolen grant) → DENY; revoked standing → DENY; consequential commands (defrost, setpoint +2 °C, disabling the alarm) → DENY; consequential actions disguised as protective measures (four variants) → DENY; smuggled parameters → DENY; no authority → refused; an ordinary grant on the emergency route → DENY (scope mismatch); one measure's grant for another → DENY; an emergency grant on the ordinary route → DENY; expired grant → DENY; revocation between commit and execution → DENY; evidence returning before execution → DENY; reuse in the same incident → DENY; protocol bound to another baseline → DENY; a caller-supplied condition is ignored.</p>
  ${extension.map(scenarioSection).join("")}`;
}

function html(results: ScenarioResult[], extension: ScenarioResult[]) {
  const r = (id: string) => results.find((x) => x.id === id)!;
  const claims = results.flatMap((x) => x.claims.map((c) => ({ id: x.id, ...c })));
  const n = (s: string) => claims.filter((c) => c.status === s).length;
  const caps = [...new Set(claims.map((c) => c.capability))];
  const matrix = `<table class="mx"><tr><th>Capability</th>${results.map((x) => `<th>${x.id}</th>`).join("")}</tr>${caps.map((c) => `<tr><td>${c}</td>${results.map((x) => { const k = x.claims.find((y) => y.capability === c); return `<td>${k ? badge(k.status) : "·"}</td>`; }).join("")}</tr>`).join("")}</table>`;
  const subs = results.flatMap((x) => x.aea.submissions.map((s) => ({ id: x.id, ...s })));
  const seal = sealBaseline().sealSha256;
  return `<!doctype html><html><head><meta charset="utf-8"><title>WHEN THE ATTACKER BYPASSES GOVERNANCE · TA-14</title><style>
  @page{size:Letter;margin:16mm 15mm 18mm}
  body{font-family:Georgia,serif;color:#0b2235;font-size:10.5pt;line-height:1.5}
  h1,h2,h3{color:#062945}h1{font-size:30pt;line-height:1.05;margin:0}h2{font-size:16pt;border-bottom:2px solid #7BAFD4;padding-bottom:4px;margin-top:22px;page-break-after:avoid}h3{font-size:12.5pt;margin:16px 0 6px}
  .cover{background:#001426;color:#fff;padding:36px 32px;border-radius:8px;margin-bottom:18px}.cover h1{color:#fff}.cover .sub{color:#B9D9EB;font-size:15pt;font-style:italic;margin-top:10px}.cover .k{color:#7BAFD4;font:700 8.5pt Helvetica,Arial,sans-serif;letter-spacing:1.5px}
  .warn{background:#E8B04B;color:#001426;font:700 9pt Helvetica,Arial,sans-serif;padding:8px 12px;border-radius:4px;margin:10px 0}
  table{border-collapse:collapse;width:100%;font-size:9pt;font-family:Helvetica,Arial,sans-serif}th,td{border:1px solid #c7d6e2;padding:4px 6px;vertical-align:top;text-align:left}th{background:#eef4f8}
  .kv th{width:22%}.m{font-family:Menlo,monospace;font-size:7.5pt;color:#46627a}
  .b{display:inline-block;padding:1px 5px;border-radius:3px;color:#fff;font:700 7.5pt Helvetica,Arial,sans-serif}.PASS{background:#2f6f5e}.FAIL{background:#c0392b}.NOT_DEMONSTRATED{background:#5d6b75}
  .mx td,.mx th{text-align:center}.mx td:first-child{text-align:left}
  .scn{page-break-inside:auto}.chart{margin:8px 0 4px;page-break-inside:avoid}.chart svg{width:100%}
  ul{margin:4px 0;padding-left:18px}footer{font-size:8pt;color:#46627a}
  </style></head><body>
  <div class="cover"><div class="k">TA14 AUTHORITY GOVERNANCE INSTITUTION · TA-14 EXCHANGE · TECHNICAL EXAMINATION v1 · PROPOSED, NOT VALIDATED</div>
  <h1 style="margin-top:14px">WHEN THE ATTACKER BYPASSES GOVERNANCE</h1><div class="sub">Refrigeration Cybersecurity, Physical Drift, and Admissible Evidence</div></div>
  <p class="m">Revision 1.2: integrated with current main; the examination, its evidence exports and this PDF are owner-gated pending publication approval. Revision 1.1 added the emergency-response pathway and extension scenario E1 (section 9A) and revised the origin statement. Scenarios S1–S8 and their results are unchanged.</p>
  <div class="warn">${SIMULATION_LABEL}. Every result in this document comes from a deterministic software simulation. No physical refrigeration system, controller, network or sensor was tested.</div>

  <h2>1. Executive summary</h2>
  <p>This examination asks whether an unauthorized change to refrigeration equipment can be <b>prevented</b> when it passes through TA-14's Admissible Execution Architecture (AEA), <b>detected</b> by independent observation when it bypasses AEA, and <b>preserved</b> as an inspectable incident record. Central principle: <i>an attacker may bypass the governance boundary without automatically escaping independent observation and evidence preservation</i>. That is a conditional capability, not a guarantee.</p>
  <p>Eight adversarial scenarios were run. Across them, ${n("PASS")} examined claims passed, <b>${n("FAIL")} failed</b> and ${n("NOT_DEMONSTRATED")} were not demonstrated:</p>
  <ul>
  <li><b>Prevention</b> held for commands submitted through AEA (S1, S7) and <b>failed</b> for commands that bypassed it (S2, S3). AEA cannot refuse a command it never sees.</li>
  <li><b>Detection</b> by independent sensors succeeded in S2–S5 (${["S2", "S3", "S4", "S5"].map((id) => `${id} after ${r(id).ein.firstDeviationMinute! - 180} min`).join(", ")}), including against a controller that falsified its reports (S4) and a suppressed alarm (S5). It <b>failed</b> in S6, when the independent temperature evidence was lost; the gap was disclosed, and the corrective action was held for lack of admissible evidence.</li>
  <li><b>Evidence preservation</b>: all eight hash-chained records verify; five tamper types are detected; no authorization was fabricated for bypassed commands; no cause was attributed.</li>
  <li><b>Emergency pathway</b> (extension E1, section 9A): with independent evidence lost, a pre-authorized protective measure that only re-asserts a sealed-baseline value was allowed; consequential commands are never available on that path; ordinary governance still held. Detection and outcome verification remained NOT DEMONSTRATED. 22 adversarial tests show the pathway cannot be used to bypass ordinary governance. S6 is preserved as a failure case.</li>
  <li><b>Recovery</b> (S8): a routine command was held during the open incident, a corrective authority revoked between commit and execution was refused at the execution boundary, and a fresh authority restored the baseline, verified afterwards by independent observation.</li></ul>
  ${matrix}

  <h2>2. Origin of the challenge</h2>
  <p>This is an independent TA-14 technical examination. It examines a question that arises wherever refrigeration equipment is networked: what happens when an unauthorized actor changes equipment behaviour outside its intended governance boundary? No external party has reviewed, participated in, or endorsed this examination or its conclusions.</p>

  <h2>3. System architecture</h2>
  <table><tr><th>Component</th><th>Status in this examination</th><th>Role</th></tr>
  <tr><td>Thermal plant model</td><td>Simulation (illustrative, unvalidated)</td><td>${esc(MODEL.basis)} Two nodes (cabinet air, product); τ cool ${MODEL.tauCoolMin} min, τ leak ${MODEL.tauLeakMin} min, τ defrost ${MODEL.tauDefrostMin} min, τ product ${MODEL.tauProductMin} min; room ${MODEL.roomC} °C.</td></tr>
  <tr><td>Controller</td><td>Simulation</td><td>Thermostat and defrost schedule; can be written to directly (bypass), can falsify its reports and can suppress its alarm.</td></tr>
  <tr><td>AEA execution gate</td><td><b>Production GCEA module, unchanged</b>, plus simulation actor and bounds checks that can only tighten a determination</td><td>Evidence, authority, standing, material change, commit, and revalidation at execution (ALLOW / HOLD / DENY / ESCALATE).</td></tr>
  <tr><td>EIN</td><td>Simulation</td><td>Two product-simulant probes, a cabinet air probe, and heater and compressor current clamps on separate loggers. It never reads ground truth or trusts the controller.</td></tr>
  <tr><td>EIR</td><td>Simulation</td><td>Append-only SHA-256 hash chain anchored to the sealed baseline, with explicit evidence gaps.</td></tr>
  <tr><td>Response</td><td>Simulation (simulated people)</td><td>Notification, acknowledgement, investigation, re-authorization, revalidated corrective action, post-intervention observation.</td></tr></table>

  <h2>4. Threat model and trust boundaries</h2>
  <p><b>Modelled attacker capabilities:</b> submitting commands through the governed route without authority; replaying a genuine expired authority; writing directly to the controller (defrost, setpoint); making the controller report false temperatures; suppressing the controller alarm. <b>Independently modelled failure:</b> loss or sticking of the independent temperature probes.</p>
  <p><b>Not modelled:</b> compromise of the independent probes, their loggers or the recorder; theft of a current, unexpired authority together with the holder's identity; physical tampering; network-level attacks; real controller protocols.</p>
  <p><b>Trust boundaries:</b> (1) the AEA gate governs only commands that pass through it; (2) the controller's self-reports are recorded but treated as untrusted (<i>independentOfController: false</i>); (3) the EIN's independence from the controller is an <i>assumption</i> of the simulation, which real sites must establish; (4) the simulation's ground truth exists only for examination and is never supplied to the EIN, EIR or gate.</p>

  <h2>5. Authorized baseline</h2>
  <table><tr><th>Item</th><th>Value</th></tr>
  <tr><td>Baseline</td><td>${BASELINE.baselineId}, ${esc(BASELINE.equipment.description)} ${BASELINE.equipment.assetId}, controller ${BASELINE.equipment.controllerId}</td></tr>
  <tr><td>Setpoint / differential</td><td>${BASELINE.setpointC} °C / ${BASELINE.differentialK} K</td></tr>
  <tr><td>Approved air band</td><td>${BASELINE.approvedAirBandC.join(" to ")} °C</td></tr>
  <tr><td>Product limit / exception</td><td>${BASELINE.productLimitC} °C / ${BASELINE.productExceptionC} °C (configured; ${esc(BASELINE.thresholdBasis)})</td></tr>
  <tr><td>Defrost</td><td>${BASELINE.defrost.startsAt.join(", ")} for ${BASELINE.defrost.durationMin} min (max ${BASELINE.defrost.maxDurationMin}; recovery allowance ${BASELINE.defrost.recoveryMin} min)</td></tr>
  <tr><td>Operating limits</td><td>Setpoint ${BASELINE.operatingLimits.setpointRangeC.join(" to ")} °C; defrost ≤ ${BASELINE.operatingLimits.maxDefrostMin} min</td></tr>
  <tr><td>Actors</td><td>${BASELINE.actors.map((a) => `${a.actorId} (${a.role}, ${a.standing})`).join("; ")}</td></tr>
  <tr><td>Evidence sources</td><td>${BASELINE.evidenceSources.map((s) => `${s.sourceId}: ${esc(s.kind)} on ${s.logger}`).join("; ")}</td></tr>
  <tr><td>Seal (SHA-256)</td><td class="m">${seal}</td></tr></table>

  <h2>6. AEA execution-boundary behavior</h2>
  <table><tr><th>Scenario</th><th>Command</th><th>Commit</th><th>Execution (revalidated)</th><th>Reasons</th></tr>
  ${subs.map((s) => `<tr><td>${s.id}</td><td>${esc(s.label)}</td><td>${s.determination}</td><td>${s.execution ? s.execution.determination : "not attempted"}</td><td class="m">${esc([...s.reasonCodes, ...(s.execution?.reasonCodes ?? [])].join(", "))}</td></tr>`).join("")}</table>
  <p>Bypassed commands (S2–S6, S8) produced no AEA entry. The record states that an observed actuation has no authorization record (investigation finding <i>NO_AUTHORIZATION_RECORD_FOR_OBSERVED_STATE_CHANGE</i>).</p>

  <h2>7. Independent physical observation</h2>
  <p>Statuses: NORMAL · WATCH (product above ${BASELINE.productLimitC} °C, or air outside the band for ≥ ${BASELINE.einThresholds.watchAirOutsideBandMin} min outside an authorized defrost) · EXCEPTION (product above ${BASELINE.productExceptionC} °C) · FAULT (heater current outside every authorized defrost window; cooling not responding; controller report disagreeing with the independent air probe by &gt; ${BASELINE.einThresholds.reportDisagreementK} K for ${BASELINE.einThresholds.reportDisagreementSamples} samples) · EVIDENCE_INSUFFICIENT (product or air state cannot be established: missing, stuck for ${BASELINE.einThresholds.stuckSamples} samples, or disagreeing probes). Every finding is CAUSE_UNDETERMINED, with candidate causes listed.</p>
  <table><tr><th>Scenario</th><th>Change at 03:00 (ground truth)</th><th>First independent deviation</th><th>Latency</th><th>Max EIN status</th></tr>
  ${["S2", "S3", "S4", "S5", "S6"].map((id) => { const x = r(id); return `<tr><td>${id}</td><td>${esc(x.groundTruth.bypassActions[0]?.label)}</td><td>${x.ein.firstDeviationMinute === null ? "<b>not detected</b>" : hhmm(x.ein.firstDeviationMinute)}</td><td>${x.ein.firstDeviationMinute === null ? "—" : `${x.ein.firstDeviationMinute - 180} min`}</td><td>${x.ein.maxStatus}</td></tr>`; }).join("")}</table>
  <p>On normal days with four authorized defrosts (S1, S7) the EIN raised no alert.</p>

  <h2>8. EIN/EIR evidence preservation</h2>
  <p>Each entry records sequence, recorder time, observation time, source (EIN, AEA_GATE, CONTROLLER_REPORTED, HUMAN, RECORDER), independence from the controller, payload, the previous entry's hash and its own SHA-256 over canonical JSON. The sealed baseline is stored separately and anchors the chain (genesis = seal). Verification recomputes every hash and link, sequence continuity, monotonic recorder time and the chain head, in Node or in a browser via WebCrypto (same code).</p>
  <p><b>Limitations:</b> entries are not signed and carry no trusted third-party time-stamp. A valid chain shows the export was not altered; it does not show the sensors were right, and an existing record is not automatically admissible.</p>

  <h2>9. The eight adversarial scenarios</h2>
  ${results.map(scenarioSection).join("")}

  ${emergencySection(extension)}

  <h2>10. Actual test results and verification procedures</h2>
  <table><tr><th>Check (${TEST_RESULTS.date}, branch feat/refrigeration-consequence-boundary from ${TEST_RESULTS.base})</th><th>Result</th></tr>
  <tr><td>Refrigeration Consequence Boundary suite</td><td>${TEST_RESULTS.rcbSuite}</td></tr>
  <tr><td>Emergency-pathway suite</td><td>${TEST_RESULTS.emergencySuite}</td></tr>
  <tr><td>Owner-gate and attribution suite</td><td>${TEST_RESULTS.gateSuite}</td></tr>
  <tr><td>Full repository test suite</td><td>${TEST_RESULTS.fullSuite}</td></tr>
  <tr><td>Type check</td><td>${TEST_RESULTS.typecheck}</td></tr>
  <tr><td>Production build</td><td>${TEST_RESULTS.build}</td></tr></table>
  <p><b>Reproduce:</b> <span class="m">npx vitest run tests/acceptance/refrigeration-consequence-boundary.spec.ts</span>. The tests assert the verdict of every claim (including the failures), that the GCEA file equals origin/main, chain verification (server and WebCrypto), detection of five tamper types, determinism, absence of network or control endpoints, and that the committed evidence exports equal a fresh run.</p>
  <p><b>Verify an export:</b> download a record from the showroom (or <span class="m">docs/refrigeration-consequence-boundary/evidence/S1–S8.json</span>) and use the showroom's in-browser verifier, or call <span class="m">verifyIncidentRecord</span> from <span class="m">apps/web/lib/refrigeration-boundary/verify.ts</span> with any SHA-256 function. Chain heads: ${results.map((x) => `${x.id} <span class="m">${x.eir.chainHead.slice(0, 16)}…</span>`).join("; ")}.</p>

  <h2>11. Known limitations and untested conditions</h2>
  <ul>
  <li>No physical-system validation: the thermal model is illustrative, with unmeasured parameters.</li>
  <li>Detection depends on independent sensors that exist, are installed correctly and are genuinely independent of the compromised path. Attacks on the sensors, loggers or recorder were not modelled.</li>
  <li>S6: with independent evidence lost, the corrective action was held ("no admissible evidence, no admissible execution") while the controller's untrusted alarm fired, and the simulated product kept warming. An emergency procedure for acting without admissible evidence is needed in practice and is not modelled.</li>
  <li>The actor-standing and parameter-bounds checks are simulation additions around GCEA, not production components. EIN and EIR here are simulations, not the EIE implementation.</li>
  <li>Records are hash-chained but unsigned, with no trusted time-stamp. Notifications and human actions are simulated.</li>
  <li>Thresholds are configured for the simulation; food-safety limits and product disposition are outside TA-14's determination.</li>
  <li>Narration is browser speech synthesis. Its controls were exercised in a real (headless) browser, but audible playback was not verified.</li>
  <li>The examination is owner-gated (404 for everyone else; fails closed). Access by the real signed-in owner was not exercised locally, because no live Supabase session was available; the gate was verified closed in every other configuration.</li>
  <li>Not examined: subtle drift (for example −22 → −19 °C), slow sensor drift, multiple simultaneous faults, theft of a current authority, real network paths and protocols.</li></ul>

  <h2>12. Independent examination invitation</h2>
  <p>The simulation, tests, evidence exports and this report are offered for independent examination. Examiners are invited to rerun the tests, verify the published records, alter them and confirm the verifier rejects the changes, and challenge the threat model, the thresholds and the claim definitions. Findings that a claim does not hold will be recorded as findings, not corrected silently.</p>
  <footer><p>${SIMULATION_LABEL} · TA-14 Exchange · Refrigeration Consequence Boundary · Technical Examination v1 · Generated from a deterministic run on ${TEST_RESULTS.date}. Not endorsed by any named party.</p></footer>
  </body></html>`;
}

it.skipIf(process.env.TA14_RCB_WRITE_REPORT !== "1")("write report HTML", async () => {
  writeFileSync(OUT, html(await runAllScenarios(), await runExtensionScenarios()));
}, 120000);

it.skipIf(process.env.TA14_RCB_WRITE_REPORT !== "1")("write image specifications", async () => {
  const lessons = buildLessons(await runAllScenarios());
  const md = ["# Refrigeration Consequence Boundary: teaching image specifications", "", "Eight images are required. None has been produced; the showroom shows a labelled slot for each. Values quoted must come from the evidence exports (SIMULATION).", ""];
  for (const l of lessons) {
    md.push(`## ${l.number} · ${l.title}`, "", `- **Filename:** \`${l.image.filename}\` (${l.image.size})`, `- **Purpose:** ${l.image.purpose}`, "- **Layout:**", ...l.image.layout.map((x) => `  - ${x}`), `- **Labels:** ${l.image.labels.join(" · ")}`, "- **Constraints:**", ...l.image.constraints.map((x) => `  - ${x}`), "");
  }
  writeFileSync(join(__dirname, "..", "..", "docs/refrigeration-consequence-boundary/IMAGE_SPECIFICATIONS.md"), md.join("\n"));
}, 120000);
