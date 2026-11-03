/*
 * Machine-readable evidence exports for the Refrigeration Consequence Boundary (SIMULATION).
 * Each export separates what TA-14 preserved (incidentRecord) from what actually happened in the
 * simulation (simulationGroundTruth), which a real deployment would never have.
 */
import { BASELINE, SIMULATION_LABEL } from './baseline';
import { MODEL } from './plant';
import type { ScenarioResult } from './scenarios';

export const EXPORT_SCHEMA = 'ta14.rcb.scenario-export.v1';

export function scenarioExport(r: ScenarioResult) {
  return {
    schema: EXPORT_SCHEMA,
    label: SIMULATION_LABEL,
    scenario: { id: r.id, number: r.number, title: r.title, attempted: r.attempted },
    aea: r.aea,
    ein: r.ein,
    alerts: r.alerts,
    response: r.response,
    outcome: r.outcome,
    claims: r.claims,
    unproven: r.unproven,
    eirSummary: { entries: r.eir.entries, byType: r.eir.byType, chainHead: r.eir.chainHead, verification: r.eir.verification, evidenceGaps: r.eir.evidenceGaps },
    incidentRecord: r.record,
    simulationGroundTruth: { ...r.groundTruth, physical: r.physical, series: r.series },
  };
}

export function summaryExport(results: ScenarioResult[]) {
  return {
    schema: 'ta14.rcb.summary.v1',
    label: SIMULATION_LABEL,
    baseline: BASELINE,
    model: MODEL,
    scenarios: results.map((r) => ({ id: r.id, title: r.title, chainHead: r.eir.chainHead, entries: r.eir.entries, claims: r.claims.map((c) => ({ capability: c.capability, status: c.status })) })),
    verification: 'Each incident record verifies with verifyIncidentRecord (apps/web/lib/refrigeration-boundary/verify.ts) or the showroom\'s in-browser verifier.',
  };
}
