/**
 * s09 Gate A interface: the configured C1-R7 evaluator the Recorder preserves receipts from.
 *
 * It calls the same server evaluation path as POST /api/niret/gate-a/evaluate, with sources wired by
 * the trusted server context (authenticated submitter, appointed-verifier certification records,
 * governed OEM registry). It reads the NIRET engine; it changes nothing in C1-R7.
 */
import type { GateAEvaluator } from "../../../../packages/domain/eie/recorder";
import { evaluateNiretSubmission, type EvaluationSources } from "../niret/server-evaluate";

export function createNiretGateAEvaluator(sources: EvaluationSources): GateAEvaluator {
  return (input, { now }) => evaluateNiretSubmission(input, now, sources).receipt;
}
