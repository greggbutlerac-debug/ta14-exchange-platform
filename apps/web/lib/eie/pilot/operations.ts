/**
 * Tier 1 pilot operations. Every operation acts as the authenticated account (never a client-supplied
 * identity), stamps server time, and goes through the governed domain checks. Evidence acquisition
 * (assets, instruments, windows, readings) is separate from the Gate A declared input.
 */
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { assetEventRefusal, deriveAsset, type AssetEvent } from "../../../../../packages/domain/eie/pilot/asset-identity";
import { deriveInstruments, instrumentEventRefusal, type InstrumentEvent } from "../../../../../packages/domain/eie/pilot/instrument-register";
import { manualObservation, manualSubmitter, nextSequence, type ManualReading } from "../../../../../packages/domain/eie/pilot/manual-node";
import type { PilotExport } from "../../../../../packages/domain/eie/pilot/export-verification";
import { witnessSealedWindows } from "../../../../../packages/domain/eie/witness/checkpoint";
import type { EvidenceWindow, OpenWindowRequest, Submitter } from "../../../../../packages/domain/eie/types";
import { httpTsaTransport, PILOT_RECORDER_ID, type PilotRuntime } from "./pilot-recorder";

export const EVIDENCE_BUCKET = "eie-pilot-evidence";
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

type Result = { status: number; body: unknown };
const ok = (body: unknown): Result => ({ status: 200, body });
const refused = (reasonCodes: string[]): Result => ({ status: 422, body: { refused: true, reasonCodes } });
const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

export interface OperationContext {
  accountId: string;
  runtime: PilotRuntime;
  now: () => string;
}

function technician(accountId: string): Submitter {
  return { role: "TECHNICIAN", id: accountId };
}

/** Content-addressed upload of raw evidence (nameplate photo, calibration certificate). Never overwrites. */
async function storeEvidenceFile(kind: "nameplate" | "calibration", file: File): Promise<{ sha256: string; storageRef: string; mediaType: string }> {
  if (file.size === 0 || file.size > MAX_UPLOAD_BYTES) throw new Error("EIE_PILOT_UPLOAD_SIZE");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  const path = `${kind}/${sha256}`;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("EIE_EVIDENCE_STORE_NOT_CONFIGURED");
  const client = createServiceClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error } = await client.storage.from(EVIDENCE_BUCKET).upload(path, bytes, { contentType: file.type || "application/octet-stream", upsert: false });
  // Content addressing: an existing object at this path already holds these exact bytes.
  if (error && !/exists|duplicate/i.test(error.message)) throw new Error("EIE_PILOT_UPLOAD_FAILED");
  return { sha256, storageRef: `${EVIDENCE_BUCKET}/${path}`, mediaType: file.type || "application/octet-stream" };
}

async function witnessPending(ctx: OperationContext) {
  const { runtime } = ctx;
  if (!runtime.tsaUrl || !runtime.witnessTrust) return { witnessed: [], pending: [], failure: { windowId: "", detail: ["TSA_UNCONFIGURED"] } };
  const ids = new Set<string>();
  for (const record of await runtime.witnessStore.list(PILOT_RECORDER_ID)) ids.add(record.checkpoint.windowId);
  // Sealed windows of every asset this Recorder has touched are found through the asset event log.
  const windows: EvidenceWindow[] = [];
  for (const assetId of await assetIds(ctx)) {
    for (const id of await runtime.evidenceStore.listWindowIds(assetId)) {
      const w = await runtime.recorder.getWindow(id);
      if (w?.sealHash) windows.push(w);
    }
  }
  return witnessSealedWindows({
    recorderId: PILOT_RECORDER_ID, sealedWindows: windows, store: runtime.witnessStore, tsa: httpTsaTransport(runtime.tsaUrl),
    trust: runtime.witnessTrust, now: ctx.now, randomBytes: (n) => new Uint8Array(randomBytes(n)),
  });
}

async function assetIds(ctx: OperationContext): Promise<string[]> {
  const { data } = await ctx.runtime.gateway.select("ta14_eie_asset_events", "asset_id", { event_type: "ASSET_REGISTERED" }, ["event_seq"]);
  return (data ?? []).map((r) => r.asset_id as string);
}

export async function runOperation(operation: string, ctx: OperationContext, input: unknown, file: File | null): Promise<Result> {
  const { runtime, accountId } = ctx;
  const body = isRecord(input) ? input : {};
  switch (operation) {
    case "status":
      return ok({ recorderId: PILOT_RECORDER_ID, readiness: runtime.readiness, keyRecordEvents: runtime.keyRecord.length });

    case "asset": {
      const events = await runtime.assetStore.list(String(body.assetId ?? ""));
      return ok({ asset: deriveAsset(events) ?? null, events });
    }

    case "asset-event": {
      const event = { ...(body.event as object), by: { accountId }, at: ctx.now() } as AssetEvent;
      if (event.type === "NAMEPLATE_EVIDENCE") return refused(["USE_NAMEPLATE_UPLOAD"]);
      const existing = await runtime.assetStore.list(String(event.assetId ?? ""));
      const codes = assetEventRefusal(existing, event);
      if (codes.length > 0) return refused(codes);
      await runtime.assetStore.append(event);
      return ok({ appended: event, asset: deriveAsset([...existing, event]) });
    }

    case "nameplate": {
      if (!file) return refused(["FILE_REQUIRED"]);
      const stored = await storeEvidenceFile("nameplate", file);
      const event = {
        type: "NAMEPLATE_EVIDENCE", assetId: String(body.assetId ?? ""), componentId: String(body.componentId ?? ""), evidenceId: randomUUID(),
        imageSha256: stored.sha256, mediaType: stored.mediaType, storageRef: stored.storageRef, capturedAt: String(body.capturedAt ?? ""),
        by: { accountId }, at: ctx.now(),
      } as AssetEvent;
      const existing = await runtime.assetStore.list(event.assetId);
      const codes = assetEventRefusal(existing, event);
      if (codes.length > 0) return refused(codes);
      await runtime.assetStore.append(event);
      return ok({ appended: event });
    }

    case "instruments":
      return ok({ instruments: deriveInstruments(await runtime.instrumentStore.list()) });

    case "instrument-event": {
      const event = { ...(body.event as object), by: { accountId }, at: ctx.now() } as InstrumentEvent;
      if (event.type === "CALIBRATION_DOCUMENTED") return refused(["USE_CALIBRATION_UPLOAD"]);
      const existing = await runtime.instrumentStore.list();
      const codes = instrumentEventRefusal(existing, event);
      if (codes.length > 0) return refused(codes);
      await runtime.instrumentStore.append(event);
      return ok({ appended: event });
    }

    case "calibration": {
      if (!file) return refused(["FILE_REQUIRED"]);
      const stored = await storeEvidenceFile("calibration", file);
      const event = {
        type: "CALIBRATION_DOCUMENTED", instrumentId: String(body.instrumentId ?? ""), calibrationId: randomUUID(),
        certificateRef: `${String(body.certificateRef ?? "")}|${stored.storageRef}`, certificateSha256: stored.sha256, issuer: String(body.issuer ?? ""),
        calibratedAt: String(body.calibratedAt ?? ""), fitUntil: String(body.fitUntil ?? ""),
        accuracy: isRecord(body.accuracy)
          ? { value: Number(body.accuracy.value), unit: String(body.accuracy.unit ?? ""), basisRef: String(body.accuracy.basisRef ?? "") }
          : null,
        by: { accountId }, at: ctx.now(),
      } as InstrumentEvent;
      const existing = await runtime.instrumentStore.list();
      const codes = instrumentEventRefusal(existing, event);
      if (codes.length > 0) return refused(codes);
      await runtime.instrumentStore.append(event);
      return ok({ appended: event });
    }

    case "open-evidence-window":
    case "open-preserving-window": {
      const request = body.request as OpenWindowRequest;
      if (!isRecord(request) || request.purpose !== "BASELINE_NONINVASIVE") return refused(["REQUEST_INVALID"]);
      if (!deriveAsset(await runtime.assetStore.list(String(request.assetId ?? "")))) return refused(["EIE-PROV-ASSET_UNKNOWN"]);
      const result = await runtime.recorder.openWindow(request, technician(accountId));
      return result.opened ? ok({ windowId: result.windowId, window: result.window }) : refused(result.reasonCodes);
    }

    case "reading": {
      const windowId = String(body.windowId ?? "");
      const window = await runtime.recorder.getWindow(windowId);
      if (!window) return refused(["EIE-WIN-WINDOW_UNKNOWN"]);
      const reading = body.reading as ManualReading;
      const built = manualObservation(reading, {
        technicianAccountId: accountId, instruments: deriveInstruments(await runtime.instrumentStore.list()), receivedAt: ctx.now(),
        sequence: nextSequence(window.entries, String(reading?.instrumentId ?? ""), reading?.channel), observationId: `MANUAL:${randomUUID()}`,
      });
      if (!built.ok) return refused(built.reasonCodes);
      const outcome = await runtime.recorder.submitObservation(windowId, built.observation, manualSubmitter(accountId));
      return { status: outcome.accepted ? 200 : 422, body: outcome };
    }

    case "close-window": {
      const result = await runtime.recorder.closeWindow(String(body.windowId ?? ""), { type: "DECLARED_END_OF_PURPOSE", ref: null }, technician(accountId));
      if (!result.closed) return refused(result.reasonCodes);
      return ok({ window: result.window, witness: await witnessPending(ctx) });
    }

    case "witness":
      return ok(await witnessPending(ctx));

    case "gate-a": {
      await witnessPending(ctx);
      const result = await runtime.recorder.recordGateAEvaluation(String(body.preservingWindowId ?? ""), {
        evidenceWindowIds: Array.isArray(body.evidenceWindowIds) ? (body.evidenceWindowIds as string[]) : [],
        declared: body.declared,
      }, technician(accountId));
      if (!result.accepted) return refused(result.reasonCodes);
      await witnessPending(ctx);
      return ok({ receipt: result.record.receipt, inputManifest: result.record.inputManifest, preservingWindow: result.window });
    }

    case "window":
      return ok({ window: (await runtime.recorder.getWindow(String(body.windowId ?? ""))) ?? null });

    case "export": {
      const assetId = String(body.assetId ?? "");
      const windows: EvidenceWindow[] = [];
      for (const id of await runtime.evidenceStore.listWindowIds(assetId)) {
        const w = await runtime.recorder.getWindow(id);
        if (w) windows.push(w);
      }
      const bundle: PilotExport = {
        contract: "TA-14-EIE-PILOT-EXPORT/1", recorderId: PILOT_RECORDER_ID, windows, keyRecord: runtime.keyRecord,
        witness: [...(await runtime.witnessStore.list(PILOT_RECORDER_ID))],
      };
      return ok({ export: bundle, assetEvents: await runtime.assetStore.list(assetId), instrumentEvents: await runtime.instrumentStore.list() });
    }

    default:
      return { status: 404, body: { error: "Unknown pilot operation." } };
  }
}
