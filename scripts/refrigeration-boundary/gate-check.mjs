// Live check that the owner gate leaks nothing: status AND body.
// Usage (server running WITHOUT the preview flag): node scripts/refrigeration-boundary/gate-check.mjs <base-url>
// Exit code 1 if any gated URL is not 404 or any response body contains examination content.
const base = process.argv[2] ?? "http://localhost:3917";
const P = "/showrooms/refrigeration-consequence-boundary";
const urls = [P, `${P}/evidence/S2.json`, `${P}/evidence/summary.json`, `${P}/files/TA-14_Refrigeration_Consequence_Boundary_Technical_Examination_v1.pdf`];
const SENTINELS = [/When the Attacker Bypasses Governance/i, /Ice Cream Is Melting/i, /chain head/i, /SIMULATION — NOT PHYSICAL/i, /RESTORE_SEALED_SETPOINT/, /incidentRecord/, /%PDF-/, /ta14\.rcb\./];
const results = [];
for (const u of urls) {
  const r = await fetch(base + u, { redirect: "manual" });
  const body = await r.text();
  results.push({ url: u, status: r.status, leaks: SENTINELS.filter((s) => s.test(body)).map(String) });
}
const failures = results.filter((r) => r.status !== 404 || r.leaks.length);
console.log(JSON.stringify({ results, failures: failures.length }, null, 1));
process.exit(failures.length ? 1 : 0);
