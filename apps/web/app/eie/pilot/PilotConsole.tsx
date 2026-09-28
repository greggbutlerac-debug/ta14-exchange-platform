"use client";

import { useState } from "react";

/**
 * Minimal Tier 1 pilot console. Each step posts one governed operation; identity and time are stamped by
 * the server. Evidence acquisition (asset, instruments, windows, readings) comes first; the Gate A step
 * takes the separately governed declared input and names the sealed evidence windows.
 */
const STEPS: Array<{ operation: string; title: string; upload?: boolean; template: unknown }> = [
  { operation: "status", title: "0. Pilot readiness", template: {} },
  { operation: "asset-event", title: "1. Register asset / component / transcription / verification / correction", template: {
    event: { type: "ASSET_REGISTERED", assetId: "", siteRef: "", installedLocation: "" },
  } },
  { operation: "nameplate", title: "2. Nameplate photo (raw evidence)", upload: true, template: { assetId: "", componentId: "", capturedAt: "" } },
  { operation: "asset", title: "3. View asset identity", template: { assetId: "" } },
  { operation: "instrument-event", title: "4. Register instrument", template: {
    event: { type: "INSTRUMENT_REGISTERED", instrumentId: "", kind: "TEMPERATURE", manufacturer: "", model: "", serial: "" },
  } },
  { operation: "calibration", title: "5. Calibration certificate (documented, not verified)", upload: true, template: {
    instrumentId: "", certificateRef: "", issuer: "", calibratedAt: "", fitUntil: "", accuracy: { value: 0, unit: "F", basisRef: "" },
  } },
  { operation: "open-evidence-window", title: "6. Open evidence window", template: {
    request: { purpose: "BASELINE_NONINVASIVE", assetId: "", openTrigger: { type: "SESSION_START", ref: "" }, admittedChannels: [], admittedSources: [], continuityProfile: {}, predecessorWindowIds: [] },
  } },
  { operation: "reading", title: "7. Manual reading (exact C1-R7 unit; static pressure signed relative to ambient)", template: {
    windowId: "", reading: { channel: "RETURN_DRY_BULB", value: 0, unit: "F", observedAt: "", instrumentId: "", location: { physical: "", class: "A", basis: { kind: "OEM_CITATION", ref: "" } } },
  } },
  { operation: "close-window", title: "8. Seal evidence window (then witness)", template: { windowId: "" } },
  { operation: "witness", title: "9. Witness pending seals (RFC 3161)", template: {} },
  { operation: "open-preserving-window", title: "10. Open receipt-preserving window", template: {
    request: { purpose: "BASELINE_NONINVASIVE", assetId: "", openTrigger: { type: "SESSION_START", ref: "" }, admittedChannels: [], admittedSources: [], continuityProfile: {}, predecessorWindowIds: [] },
  } },
  { operation: "gate-a", title: "11. Gate A evaluation (declared input + sealed evidence windows)", template: {
    preservingWindowId: "", evidenceWindowIds: [], declared: { request: {}, evidence: {}, oem: {} },
  } },
  { operation: "export", title: "12. Export for offline verification", template: { assetId: "" } },
];

function Step({ step }: { step: (typeof STEPS)[number] }) {
  const [text, setText] = useState(JSON.stringify(step.template, null, 2));
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState("");
  async function run() {
    let response: Response;
    if (step.upload) {
      const form = new FormData();
      form.set("input", text);
      if (file) form.set("file", file);
      response = await fetch(`/api/eie/pilot/${step.operation}`, { method: "POST", body: form });
    } else {
      response = await fetch(`/api/eie/pilot/${step.operation}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: text });
    }
    setResult(`${response.status}\n${JSON.stringify(await response.json(), null, 2)}`);
  }
  return (
    <section style={{ border: "1px solid #ccc", borderRadius: 8, padding: 12, marginBottom: 12 }}>
      <h2 style={{ fontSize: 16, margin: "0 0 8px" }}>{step.title}</h2>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} style={{ width: "100%", fontFamily: "monospace", fontSize: 12 }} />
      {step.upload ? <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /> : null}
      <div><button type="button" onClick={run}>Submit</button></div>
      {result ? <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, maxHeight: 320, overflow: "auto" }}>{result}</pre> : null}
    </section>
  );
}

export function PilotConsole() {
  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 20 }}>TA-14 EIE — Tier 1 pilot (local only)</h1>
      <p style={{ fontSize: 13 }}>
        Real manual-instrument observation → Node → Recorder → sealed INTACT window → s09 adapter → real C1-R7 → attributable receipt.
        A HOLD receipt is an expected, successful Tier 1 outcome. Nothing here authorizes pressure-side entry, Gate B or refrigerant movement.
      </p>
      {STEPS.map((step) => <Step key={step.operation + step.title} step={step} />)}
    </main>
  );
}
