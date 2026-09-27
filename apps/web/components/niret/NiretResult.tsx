"use client";

import { useState } from "react";

import { PROPOSITION_LABELS } from "../../lib/niret/labels";
import { cfmPerTonContext, presentReceipt, type FindingLike, type ReceiptLike } from "../../lib/niret/presentation";

export interface EvaluationResponse {
  receipt: ReceiptLike & Record<string, unknown>;
  findings: FindingLike[];
  context: {
    certificationVerificationSource: string;
    authorityEstablishmentSource: string;
    oemReferenceSource: string;
    oemReference?: {
      source: string;
      status: string;
      recordId: string | null;
      document: string | null;
      measurementLocations: Record<string, { location: string; oemText: string }>;
    } | null;
    note: string;
  };
}

/**
 * Renders the engine's determination exactly as returned. This component
 * reads receipt fields; it never derives or alters the determination.
 */
export function DeterminationPanel({ response, nominalCapacityBtuh }: { response: EvaluationResponse; nominalCapacityBtuh: string }) {
  const shown = presentReceipt(response.receipt, response.findings);
  const cfmPerTon = cfmPerTonContext(response.receipt, nominalCapacityBtuh);
  return (
    <section className={`nrDetermination ${shown.determination.toLowerCase()}`} aria-live="polite">
      <small>NIRET GATE A · {String(response.receipt.gate_version)}</small>
      <h2>{shown.headline}</h2>
      <div className="nrParts">
        <div className={`nrPart ${shown.technical.determination.toLowerCase()}`}>
          <b>{shown.technical.headline}</b>
          <p>{shown.technical.meaning}</p>
        </div>
        <div className={`nrPart ${shown.execution.determination.toLowerCase()}`}>
          <b>{shown.execution.headline}</b>
          <p>{shown.execution.meaning}</p>
        </div>
      </div>
      <p className="nrRule">Technical ALLOW is not authority to execute.</p>
      {shown.prematureEntry && (
        <p className="nrPremature">
          Pressure-instrument entry is not authorized before a Gate-A ALLOW. This does not end the diagnostic workflow:
          return to non-invasive evidence and submit a new Gate-A evaluation.
        </p>
      )}
      <div className="nrBoundary">{shown.boundaryNotice}</div>
      <div className="nrCounts">
        <b>{shown.establishedCount} of {shown.requiredCount}</b> required propositions established
        {shown.windowOpens && <span> · qualifying window opens {shown.windowOpens}</span>}
      </div>
      {shown.nextActions.length > 0 && (
        <div className="nrNext"><small>NEXT JUSTIFIED ACTION</small>{shown.nextActions.map((action) => <p key={action}>{action}</p>)}</div>
      )}
      {shown.reasons.length > 0 && (
        <div className="nrReasons"><small>REASON CODES</small>{shown.reasons.map((reason) => <code key={reason.code} title={reason.label}>{reason.code}</code>)}</div>
      )}
      {shown.unresolved.length > 0 && (
        <div className="nrUnresolved">
          <small>STILL REQUIRED / FAILED</small>
          <ul>
            {shown.unresolved.map((item) => (
              <li key={item.proposition}>
                <b>{item.label}</b>
                {item.messages.map((message) => <p key={message} className="nrPlain">{message}</p>)}
                <span>Canonical: {item.reasons.join(" · ")}</span>
                {item.fields.filter((field) => !field.startsWith("/")).map((field) => <a key={field} href={`#field-${field}`}>{field}</a>)}
                <em>{item.nextAction}</em>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="nrContext">
        {shown.derivedTesp && <p>TESP (derived by Gate A from raw return and supply static): <b>{shown.derivedTesp.value.toFixed(3)} ± {shown.derivedTesp.uncertainty.toFixed(3)} in. w.c.</b></p>}
        {cfmPerTon && <p>CFM per nominal ton: <b>{cfmPerTon.value.toFixed(0)}</b> — {cfmPerTon.note}</p>}
        <small>AUTHORITY &amp; STANDING (declared vs independently established)</small>
        {shown.submittedBy && <p>Submitted by authenticated account <code>{shown.submittedBy}</code> — this identifies the submitter only.</p>}
        {shown.certification && <p className={shown.certification.verified ? "nrCertOk" : "nrCertOpen"}>{shown.certification.summary}</p>}
        {shown.authority.map((item) => <p key={item.label} className={item.established ? "nrCertOk" : "nrCertOpen"}>{item.label}: {item.summary}</p>)}
        <small>OEM REFERENCE</small>
        {shown.oemProvenance && <p className={shown.oemProvenance.established ? "nrCertOk" : "nrCertOpen"}>{shown.oemProvenance.summary}</p>}
        {response.context.oemReference && <OemRecordContext oemReference={response.context.oemReference} />}
      </div>
    </section>
  );
}

const OEM_STATUS_TEXT: Readonly<Record<string, string>> = {
  RESOLVED: "A governed OEM record was used. Your manual OEM entries were not used.",
  NOT_VERIFIED: "A governed OEM record for this system is awaiting independent review. It cannot be relied on yet.",
  NO_RECORD: "No governed OEM record covers this exact manufacturer and indoor/outdoor combination. Your OEM entries were evaluated as a transcription only; copy a curation request to have a record created.",
  REGISTRY_UNAVAILABLE: "The governed OEM registry failed its integrity check and is unavailable. Nothing from it was relied on.",
  NO_REGISTRY: "No governed OEM registry is connected.",
};

function OemRecordContext({ oemReference }: { oemReference: NonNullable<EvaluationResponse["context"]["oemReference"]> }) {
  const locations = Object.entries(oemReference.measurementLocations);
  return (
    <>
      <p className={oemReference.status === "RESOLVED" ? "nrCertOk" : "nrCertOpen"}>
        {OEM_STATUS_TEXT[oemReference.status] ?? oemReference.status}
        {oemReference.recordId && <> Record <code>{oemReference.recordId}</code>{oemReference.document ? ` — ${oemReference.document}` : ""}.</>}
      </p>
      {locations.length > 0 && (
        <p>OEM measurement locations (enter the location exactly as listed):{" "}
          {locations.map(([key, value]) => <span key={key}><code>{key}</code>: {value.location} ({value.oemText}); </span>)}
        </p>
      )}
    </>
  );
}

export function ReceiptPanel({ response }: { response: EvaluationResponse }) {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(response.receipt, null, 2);
  const receipt = response.receipt;
  const copy = async () => {
    await navigator.clipboard.writeText(json);
    setCopied(true);
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([json], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${receipt.receipt_id}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };
  return (
    <section className="nrReceipt">
      <header>
        <div><small>CANONICAL GATE-A RECEIPT</small><h2>{receipt.receipt_id}</h2></div>
        <div className="nrReceiptActions">
          <button type="button" onClick={copy}>{copied ? "Copied" : "Copy JSON"}</button>
          <button type="button" onClick={download}>Download JSON</button>
          <button type="button" onClick={() => window.print()}>Print</button>
        </div>
      </header>
      <dl>
        <dt>Determination</dt><dd>{receipt.determination}</dd>
        <dt>Content hash (SHA-256)</dt><dd><code>{receipt.content_hash}</code></dd>
        <dt>Frozen spec fingerprint</dt><dd><code>{receipt.frozen_spec_sha256}</code></dd>
        <dt>Evaluated at (server)</dt><dd>{String(receipt.evaluated_at)}</dd>
        <dt>Scope</dt><dd>{String(receipt.scope)} · Gate B authorized: {String(receipt.gate_b_authorized)}</dd>
      </dl>
      <details>
        <summary>Propositions ({receipt.established_propositions.length} established)</summary>
        <ul className="nrPropList">
          {receipt.required_propositions.map((id) => (
            <li key={id} className={receipt.established_propositions.includes(id) ? "ok" : "open"}>
              <code>{id}</code> {PROPOSITION_LABELS[id] ?? id}
            </li>
          ))}
        </ul>
      </details>
      <details>
        <summary>Full receipt JSON</summary>
        <pre>{json}</pre>
      </details>
      <p className="nrNote">{response.context.note}</p>
    </section>
  );
}
