/**
 * Production composition of the Environmental Integrity Recorder. Every activation dependency is
 * wired explicitly and fails closed while unresolved:
 *   - seal signer: productionRecorderKeyCustody() (NOT_ESTABLISHED: no window can open);
 *   - continuity profiles: GOVERNED_CONTINUITY_PROFILES (empty: no window can open);
 *   - store: SupabaseEvidenceStore (requires the EIE migration to be applied);
 *   - Gate A: the NIRET server evaluation path (receipts preserved per s09).
 * Nothing here is exposed through a route.
 */
import { GOVERNED_CONTINUITY_PROFILES } from "../../../../packages/domain/eie/continuity-profile";
import { EvidenceRecorder } from "../../../../packages/domain/eie/recorder";
import type { EvaluationSources } from "../niret/server-evaluate";
import { createNiretGateAEvaluator } from "./niret-gate-a-evaluator";
import { productionRecorderKeyCustody, type RecorderKeyCustody } from "./recorder-key-custody";
import { serviceRoleRowGateway, SupabaseEvidenceStore, type EieRowGateway } from "./supabase-evidence-store";

export function createProductionRecorder(options: {
  recorderId: string;
  gateASources: EvaluationSources;
  gateway?: EieRowGateway;
  custody?: RecorderKeyCustody;
  clock?: () => string;
}): EvidenceRecorder {
  const custody = options.custody ?? productionRecorderKeyCustody();
  return new EvidenceRecorder({
    recorderId: options.recorderId,
    mode: "PRODUCTION",
    clock: options.clock ?? (() => new Date().toISOString()),
    signer: custody.signer(),
    store: new SupabaseEvidenceStore(options.gateway ?? serviceRoleRowGateway()),
    gateAEvaluator: createNiretGateAEvaluator(options.gateASources),
    profileRegistry: GOVERNED_CONTINUITY_PROFILES,
    resolveRecorderKey: custody.resolvePublicKey,
  });
}
