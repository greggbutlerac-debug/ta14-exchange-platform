/**
 * Tier 1 pilot composition of the Environmental Integrity Recorder. PRODUCTION mode semantics in an
 * isolated pilot environment, with every activation dependency explicit and failing closed:
 *   - seal signer: the Key Record's ACTIVE PILOT key, signed by Google Cloud KMS (Ed25519, SOFTWARE);
 *   - verification: the Key Record, as of each seal's time (historical verification);
 *   - continuity profiles: PILOT_PINNED_CONTINUITY_PROFILES (empty until independent review);
 *   - evidence witness: RFC 3161 checkpoint chain to a pinned TSA trust anchor;
 *   - asset identity: declared equipment must equal independently verified nameplate transcriptions;
 *   - Gate A: the real C1-R7 server evaluation path (NIRET), receipts preserved with s09 lineage.
 */
import { readFile } from "node:fs/promises";
import type { SupabaseClient } from "@supabase/supabase-js";
import { deriveKeyRecord, keyMaySeal, keyRecordResolver, type KeyRecordEvent, type KeyState } from "../../../../../packages/domain/eie/key-record";
import { EvidenceRecorder } from "../../../../../packages/domain/eie/recorder";
import type { ContinuityProfileRegistry } from "../../../../../packages/domain/eie/continuity-profile";
import type { RecorderSealSigner } from "../../../../../packages/domain/eie/signer";
import type { EvidenceStore } from "../../../../../packages/domain/eie/store";
import { witnessPort, type WitnessStore, type WitnessTrust } from "../../../../../packages/domain/eie/witness/checkpoint";
import { declaredEquipmentConsistency, deriveAsset, type AssetEvent } from "../../../../../packages/domain/eie/pilot/asset-identity";
import { PILOT_PINNED_CONTINUITY_PROFILES } from "../../../../../packages/domain/eie/pilot/pinned-profiles";
import { GOVERNED_OEM_REGISTRY } from "../../../../../packages/domain/niret/oem-registry";
import { loadCertificationVerifier } from "../../niret/certification-verifier";
import { NO_SOURCES, type EvaluationSources } from "../../niret/server-evaluate";
import { createNiretGateAEvaluator } from "../niret-gate-a-evaluator";
import { serviceRoleRowGateway, SupabaseEvidenceStore, type EieRowGateway } from "../supabase-evidence-store";
import { googleKmsClient, kmsSealSigner } from "./kms-seal-signer";
import { readKeyRecord, SupabaseAssetEventStore, SupabaseInstrumentEventStore, SupabaseWitnessStore } from "./stores";
import { httpTsaTransport } from "./tsa-transport";

export const PILOT_RECORDER_ID = "TA14-EIE-PILOT-RECORDER-01";

export interface PilotDependencies {
  evidenceStore: EvidenceStore;
  keyRecord: readonly KeyRecordEvent[];
  keyId: string | null;
  /** Builds the signer for the ACTIVE pilot key; never called for any other key. */
  signerFor: (state: KeyState) => RecorderSealSigner | null;
  gateASources: EvaluationSources;
  witnessStore: WitnessStore;
  witnessTrust: WitnessTrust | null;
  assetEvents: (assetId: string) => Promise<readonly AssetEvent[]>;
  profileRegistry?: ContinuityProfileRegistry;
  clock?: () => string;
}

/** Readiness findings: each one alone keeps the pilot fail-closed. */
export function pilotReadiness(deps: Pick<PilotDependencies, "keyRecord" | "keyId" | "witnessTrust" | "profileRegistry">): string[] {
  const findings: string[] = [];
  const record = deriveKeyRecord(deps.keyRecord);
  if (!deps.keyId || !keyMaySeal(record, deps.keyId, "PILOT")) findings.push("PILOT_KEY_NOT_ACTIVE");
  if (!deps.witnessTrust || deps.witnessTrust.trustAnchorsPem.length === 0) findings.push("TSA_TRUST_ANCHOR_ABSENT");
  if ((deps.profileRegistry ?? PILOT_PINNED_CONTINUITY_PROFILES).size === 0) findings.push("NO_CONTINUITY_PROFILE_PINNED");
  return findings;
}

export function buildPilotRecorder(deps: PilotDependencies): EvidenceRecorder {
  const record = deriveKeyRecord(deps.keyRecord);
  const signer = deps.keyId && keyMaySeal(record, deps.keyId, "PILOT") ? deps.signerFor(record[deps.keyId]) : null;
  const trust = deps.witnessTrust;
  return new EvidenceRecorder({
    recorderId: PILOT_RECORDER_ID,
    mode: "PRODUCTION",
    clock: deps.clock ?? (() => new Date().toISOString()),
    signer,
    store: deps.evidenceStore,
    gateAEvaluator: createNiretGateAEvaluator(deps.gateASources),
    profileRegistry: deps.profileRegistry ?? PILOT_PINNED_CONTINUITY_PROFILES,
    resolveRecorderKey: keyRecordResolver(record, ["PILOT"]),
    evidenceWitness: trust ? witnessPort(deps.witnessStore, PILOT_RECORDER_ID, trust) : async () => false,
    assetIdentity: async (assetId, declared) => declaredEquipmentConsistency(deriveAsset(await deps.assetEvents(assetId)), declared),
  });
}

export interface PilotRuntime {
  recorder: EvidenceRecorder;
  gateway: EieRowGateway;
  evidenceStore: SupabaseEvidenceStore;
  witnessStore: SupabaseWitnessStore;
  assetStore: SupabaseAssetEventStore;
  instrumentStore: SupabaseInstrumentEventStore;
  keyRecord: KeyRecordEvent[];
  witnessTrust: WitnessTrust | null;
  tsaUrl: string | null;
  readiness: string[];
}

/** Builds the pilot runtime from the (already guarded) local pilot environment for one authenticated account. */
export async function pilotRuntime(accountId: string, userClient: SupabaseClient, env: Record<string, string | undefined> = process.env): Promise<PilotRuntime> {
  const gateway = serviceRoleRowGateway();
  const evidenceStore = new SupabaseEvidenceStore(gateway);
  const witnessStore = new SupabaseWitnessStore(gateway);
  const assetStore = new SupabaseAssetEventStore(gateway);
  const instrumentStore = new SupabaseInstrumentEventStore(gateway);
  const keyRecord = await readKeyRecord(gateway);
  const anchorsFile = env.TA14_EIE_PILOT_TSA_TRUST_ANCHORS_FILE;
  const witnessTrust = anchorsFile
    ? { trustAnchorsPem: ((await readFile(anchorsFile, "utf8")).match(/-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/g) ?? []) }
    : null;
  const keyId = env.TA14_EIE_PILOT_KEY_ID ?? null;
  const keyVersionName = env.TA14_EIE_PILOT_KMS_KEY_VERSION ?? null;
  const now = new Date();
  const gateASources: EvaluationSources = {
    ...NO_SOURCES,
    submitter: { accountId },
    certificationVerifier: await loadCertificationVerifier(userClient, accountId, now),
    oemRegistry: GOVERNED_OEM_REGISTRY,
  };
  const kms = keyVersionName ? await googleKmsClient() : null;
  const deps: PilotDependencies = {
    evidenceStore, keyRecord, keyId, gateASources, witnessStore, witnessTrust,
    assetEvents: (assetId) => assetStore.list(assetId),
    signerFor: (state) => kms && keyVersionName && state.registration.providerResource === keyVersionName
      ? kmsSealSigner({ keyId: state.keyId, keyVersionName, publicKeyPem: state.registration.publicKeyPem, client: kms })
      : null,
  };
  const readiness = pilotReadiness(deps);
  if (!keyVersionName) readiness.push("KMS_KEY_VERSION_UNCONFIGURED");
  return {
    recorder: buildPilotRecorder(deps), gateway, evidenceStore, witnessStore, assetStore, instrumentStore, keyRecord, witnessTrust,
    tsaUrl: env.TA14_EIE_PILOT_TSA_URL ?? null, readiness,
  };
}

export { httpTsaTransport };
