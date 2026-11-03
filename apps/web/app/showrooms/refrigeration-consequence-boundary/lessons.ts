/*
 * The eight lessons of the Refrigeration Consequence Boundary showroom. Narration is built from
 * the simulation's actual results, so every number spoken matches the evidence exports.
 * Every lesson separates ARCHITECTURAL INTENT from what the SIMULATION DEMONSTRATED.
 */
import { BASELINE, sealBaseline } from '@/lib/refrigeration-boundary/baseline';
import type { ScenarioResult } from '@/lib/refrigeration-boundary/scenarios';

export type ImageSpec = { filename: string; size: string; purpose: string; layout: string[]; labels: string[]; constraints: string[] };
export type Lesson = { number: string; slug: string; title: string; narration: string; explain: string[]; intent: string; demonstrated: string; scenarioIds: string[]; image: ImageSpec };

const hhmm = (minute: number) => `${String(Math.floor(minute / 60) % 24).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`;
const COMMON_CONSTRAINTS = [
  'Wide 16:9 educational infographic, 1920 × 1080 px, PNG.',
  'TA-14 palette: navy #001426 / #062945 background, ice-blue #7BAFD4 and #B9D9EB accents, white text; amber #E8B04B for WATCH, coral #E86A5B for EXCEPTION/FAULT, grey #8A9BA8 for missing evidence.',
  'Read left to right, top to bottom, with large numbered callouts.',
  'No photographs or likenesses of real people; no portraits. No real brand, product or equipment logos.',
  'Label all data "SIMULATION" in the lower-left corner; use only values from the evidence exports.',
];

export function buildLessons(results: ScenarioResult[]): Lesson[] {
  const r = (id: string) => results.find((x) => x.id === id)!;
  const s1 = r('S1'), s2 = r('S2'), s3 = r('S3'), s4 = r('S4'), s5 = r('S5'), s6 = r('S6'), s8 = r('S8');
  const seal = sealBaseline().sealSha256;
  const s1Sub = s1.aea.submissions[0];
  const restore2 = s8.aea.submissions.find((s) => s.commandId.endsWith('RESTORE-2'))!;
  const restore1 = s8.aea.submissions.find((s) => s.commandId.endsWith('RESTORE-1'))!;
  const routine = s8.aea.submissions.find((s) => s.commandId.includes('ROUTINE'))!;
  const lat = (x: ScenarioResult) => (x.ein.firstDeviationMinute! - 180);

  return [
    {
      number: '01', slug: 'the-ice-cream-is-melting', title: 'THE ICE CREAM IS MELTING',
      narration: `This is a simulation. At three in the morning, someone tells a display freezer to defrost for six hours. Nobody authorized it. In the simulation, the cabinet air climbs to ${s8.physical.maxTruthAirC} degrees Celsius, and the ice cream warms to ${s8.physical.maxTruthProductC} degrees, spending ${s8.physical.truthMinutesProductAboveLimit} minutes above the configured limit of minus eighteen. The question for this showroom is simple: who authorized that consequence? The answer, in the record, is that nobody did. There is no authorization record for it, and the record says so instead of inventing one.`,
      explain: [
        'A consequence is the physical result of an action: here, ice cream warming above its configured storage temperature.',
        'This showroom asks two separate questions. Was the action authorized? And what actually happened to the product? A governance gate answers the first. Only independent observation can answer the second.',
        `Figures come from scenario S8 of the simulation (a bypassed six-hour defrost followed by recovery). They are simulated values from an illustrative model, not measurements from real equipment.`,
      ],
      intent: 'TA-14 separates authorization from observed reality, so an unauthorized consequence can be recognized as unauthorized.',
      demonstrated: `In simulation S8, independent observation flagged the deviation ${lat(s8)} minutes after the change, and the record contains no authorization for it.`,
      scenarioIds: ['S2', 'S8'],
      image: { filename: 'rcb-01-the-ice-cream-is-melting.png', size: '1920×1080', purpose: 'Introduce the incident and its physical consequence.', layout: ['Left: a simplified display-freezer cutaway with product cartons and two product-simulant probes.', 'Centre: a 24-hour timeline marked "03:00 unauthorized 6-hour defrost" and the product temperature curve crossing −18 °C.', 'Right: the question "WHO AUTHORIZED THE CONSEQUENCE?" above an empty authorization-receipt card stamped "NO RECORD".'], labels: [`Product peak ${s8.physical.maxTruthProductC} °C (simulation)`, `${s8.physical.truthMinutesProductAboveLimit} min above −18 °C (simulation)`, 'No authorization record'], constraints: COMMON_CONSTRAINTS },
    },
    {
      number: '02', slug: 'the-last-authorized-state', title: 'THE LAST AUTHORIZED STATE',
      narration: `Before you can say something went wrong, you need to know what should be happening. The authorized baseline for this simulated freezer sets the controller to minus twenty-two degrees, keeps the cabinet air between minus twenty-five and minus nineteen, and allows four twenty-minute defrosts a day, at two, eight, fourteen and twenty hundred hours. It names who may act: a facility manager and a refrigeration technician. It lists five independent evidence sources. This baseline is sealed with a hash and stored apart from everything observed later, so later reality can never quietly overwrite what was authorized.`,
      explain: [
        `Baseline ${BASELINE.baselineId}: setpoint ${BASELINE.setpointC} °C, air band ${BASELINE.approvedAirBandC.join(' to ')} °C, product limit ${BASELINE.productLimitC} °C, defrost ${BASELINE.defrost.startsAt.join(', ')} for ${BASELINE.defrost.durationMin} min (maximum ${BASELINE.defrost.maxDurationMin}).`,
        `Seal (SHA-256 of the canonical baseline): ${seal}. Every incident record begins from this seal.`,
        'The thresholds are configured for the simulation. −18 °C is a commonly cited frozen-storage temperature, but a real site takes its limits from its own food-safety plan and equipment documentation.',
        '"Commissioned once does not mean authorized forever": a baseline is the reference for comparison, not a standing permission for every later action.',
      ],
      intent: 'An authorized baseline makes "what should be happening" explicit, versioned and tamper-evident.',
      demonstrated: 'In all eight scenarios the sealed baseline was unchanged at the end of the run (tested).',
      scenarioIds: ['S1'],
      image: { filename: 'rcb-02-the-last-authorized-state.png', size: '1920×1080', purpose: 'Show the authorized baseline as a sealed reference.', layout: ['Left: equipment identity card (simulated freezer RCB-FREEZER-01, controller CTRL-SIM-01).', 'Centre: approved operating envelope: air band −25 to −19 °C, setpoint −22 °C, product limit −18 °C, and a 24-hour clock face with four 20-minute defrost windows.', 'Right: authorized actors (roles only, no faces), five independent evidence sources, and a seal block showing the baseline hash.'], labels: ['AUTHORIZED BASELINE RCB-BL-1.0', 'SEALED · STORED SEPARATELY', 'Roles: Facility Manager · Refrigeration Technician'], constraints: COMMON_CONSTRAINTS },
    },
    {
      number: '03', slug: 'the-attacker-bypasses-aea', title: 'THE ATTACKER BYPASSES AEA',
      narration: `Here are the same defrost attack and two different paths. In the first, an unrecognized actor sends a six-hour defrost through the governed command route. The gate evaluates evidence, authority, standing and limits, and returns ${s1Sub.determination}. The defrost never runs. In the second, the attacker writes straight to the controller. The gate never sees the command, so it cannot refuse it. The simulation reports this honestly: prevention failed for the bypassed command. A bypassed authorization gate is not an authorized execution. It is simply an execution that nobody authorized.`,
      explain: [
        `Through AEA (scenario S1): ${s1Sub.determination}, with reasons ${s1Sub.reasonCodes.join(', ')}. The decision engine is TA-14's production GCEA module, used unchanged. The actor and limit checks are simulation additions that can only make a decision stricter.`,
        'Bypassing AEA (scenario S2): a direct controller write. There is no AEA record, and none is fabricated. PREVENTION is reported as FAIL.',
        'Expired authority replay (scenario S7): a genuine but expired grant is refused (DENY, AUTHORITY_EXPIRED), whether replayed by a stranger or by its original holder.',
      ],
      intent: 'AEA governs commands that pass through its execution boundary. It cannot govern a path that avoids it.',
      demonstrated: 'S1 and S7: unauthorized commands submitted to AEA were refused and never executed. S2 and S3: bypassed commands executed, and prevention is reported as FAIL.',
      scenarioIds: ['S1', 'S2', 'S7'],
      image: { filename: 'rcb-03-the-attacker-bypasses-aea.png', size: '1920×1080', purpose: 'Contrast the governed route with the bypass route.', layout: ['Top lane, "GOVERNED ROUTE": attacker → AEA gate (four checks: Evidence · Authority · Standing · Revalidation NOW) → DENY stamp → controller unchanged.', 'Bottom lane, "BYPASS ROUTE": attacker → direct write → controller changes → defrost heater ON; the AEA gate drawn beside the lane, greyed out, labelled "never consulted".', 'Right: results panel showing "S1 PREVENTION: PASS" and "S2 PREVENTION: FAIL".'], labels: ['A bypassed gate is not an authorized execution', 'No authorization record is fabricated'], constraints: COMMON_CONSTRAINTS },
    },
    {
      number: '04', slug: 'physical-reality-begins-to-drift', title: 'PHYSICAL REALITY BEGINS TO DRIFT',
      narration: `Watch what the controller says, and what the freezer actually does. In scenario four, the attacker raises the setpoint to plus two degrees and makes the controller keep reporting a calm minus twenty-one point eight. Every report the controller sends during the incident sits inside the approved band. But the cabinet air warms towards ${s4.physical.maxTruthAirC} degrees. In this chart, the dashed line is what the controller claims, the solid lines are the simulation's ground truth, and the dots are what the independent probes recorded. In a real building you would have no ground truth line. You would have only the probes, which is why they must stay independent.`,
      explain: [
        'The ground truth exists only because this is a simulation. The independent node never sees it: it sees only its own probes and current clamps.',
        'The controller\'s self-report is preserved in the record, but labelled as an untrusted channel ("independentOfController: false").',
        'A deviation is not proof of an attack. The same drift could come from a refrigeration fault, an open door or a mis-set controller, so the record says CAUSE_UNDETERMINED.',
      ],
      intent: 'Observed physical reality is compared with the authorized baseline, not with the equipment\'s own claims.',
      demonstrated: `In S4, all controller reports during the incident stayed inside the approved band while independent evidence showed the drift (DETECTION_INDEPENDENT_OF_CONTROLLER_REPORTS: ${s4.claims.find((c) => c.capability === 'DETECTION_INDEPENDENT_OF_CONTROLLER_REPORTS')?.status}).`,
      scenarioIds: ['S4', 'S3'],
      image: { filename: 'rcb-04-physical-reality-begins-to-drift.png', size: '1920×1080', purpose: 'Show the gap between reported and observed reality.', layout: ['Left: the controller display reading "−21.8 °C · OK", stamped "SELF-REPORT · UNTRUSTED".', 'Centre: a time-series chart from scenario S4: controller-reported air (flat dashed), independent probe air (rising dots), the approved band shaded.', 'Right: a divergence callout "Reported vs independent: > 3 K for 3 samples → FAULT".'], labels: ['What the controller claims', 'What independent probes observe', 'Simulation ground truth (not available in real deployments)'], constraints: COMMON_CONSTRAINTS },
    },
    {
      number: '05', slug: 'ein-detects-the-deviation', title: 'EIN DETECTS THE DEVIATION',
      narration: `The Environmental Integrity Node watches with its own instruments: two product-simulant probes, a cabinet air probe, and current clamps on the defrost heater and the compressor. It compares each reading with the sealed baseline. In the simulation, the unauthorized defrost was flagged ${lat(s2)} minutes after it began, because the heater drew current outside every authorized window. The setpoint change was flagged after ${lat(s3)} minutes. Even when the controller's own alarm was switched off, the node raised its own alert. But when its probes failed, it could not confirm anything. It said so, and detection is reported as failed.`,
      explain: [
        'Statuses: NORMAL · WATCH (early drift) · EXCEPTION (product beyond the configured exception limit) · FAULT (actuation outside the baseline, cooling not responding, or controller reports contradicting independent probes) · EVIDENCE_INSUFFICIENT (state cannot be established).',
        `Detection latencies in the simulation: S2 ${lat(s2)} min, S3 ${lat(s3)} min, S4 ${lat(s4)} min, S5 ${lat(s5)} min. S6: not detected; evidence was missing.`,
        `Alert independence (S5): the controller alarm was suppressed and did not fire while the condition was met; the independent node alerted at minute ${s5.ein.firstAlertMinute}.`,
        'Authorized defrosts are expected excursions: on normal days (S1 and S7) the node raised no alert.',
        'Detection is conditional. It depends on independent sensors that exist, work, and are not controlled by the same compromised path.',
      ],
      intent: 'Independent observation can reveal a deviation even when the command bypassed governance.',
      demonstrated: `DETECTION: PASS in S2, S3, S4 and S5; FAIL in S6 (independent evidence lost). No false alerts on normal days.`,
      scenarioIds: ['S2', 'S3', 'S5', 'S6'],
      image: { filename: 'rcb-05-ein-detects-the-deviation.png', size: '1920×1080', purpose: 'Explain independent observation, thresholds, evidence quality and alerts.', layout: ['Left: the five independent sources (P1, P2, AIR, HEATER_CT, COMPRESSOR_CT) on a separate logger, with the controller drawn apart and labelled "not trusted".', 'Centre: a status ladder NORMAL → WATCH → EXCEPTION → FAULT, with EVIDENCE_INSUFFICIENT on a separate grey rail, each with its trigger rule.', 'Right: a detection-latency bar chart for S2–S5 and an "S6: NOT DETECTED — evidence missing" bar in grey.'], labels: ['Configured thresholds (simulation)', 'Detection is conditional, not guaranteed'], constraints: COMMON_CONSTRAINTS },
    },
    {
      number: '06', slug: 'eir-preserves-the-incident', title: 'EIR PRESERVES THE INCIDENT',
      narration: `Everything the node sees, every gate decision and every human action goes into the Environmental Integrity Recorder. Each entry has a sequence number, the time it was recorded, the time it was observed, its source, and whether that source is independent of the controller. Each entry carries the hash of the one before it, back to the sealed baseline. Change one reading, delete one entry or swap two, and verification fails. The tests show exactly that. Gaps are written down too: in scenario six, three evidence gaps opened and were recorded. An evidence record is not admissible merely because it exists. Integrity is necessary, not sufficient.`,
      explain: [
        `Scenario S2 record: ${s2.eir.entries} entries; chain head ${s2.eir.chainHead.slice(0, 16)}…; verification ${s2.eir.verification.valid ? 'VALID' : 'INVALID'}.`,
        'Tamper tests: an altered observation, a deleted entry, reordered entries, an altered baseline and a truncated chain are all detected (automated tests).',
        'Limitations: entries are hash-chained but not signed, and carry no trusted third-party time-stamp. Integrity of the record does not prove the sensors were right.',
        'You can download each incident record below and verify it in your own browser.',
      ],
      intent: 'An inspectable, tamper-evident incident record that keeps observed reality, governance decisions and human actions apart.',
      demonstrated: 'All eight records verify. All five tamper types are detected. Evidence gaps are recorded explicitly.',
      scenarioIds: ['S2', 'S6'],
      image: { filename: 'rcb-06-eir-preserves-the-incident.png', size: '1920×1080', purpose: 'Show provenance, continuity, timestamps, integrity and the incident record.', layout: ['Left: a sealed baseline block feeding a vertical hash chain of entries (BASELINE_REFERENCE → EIN_OBSERVATION → EIN_STATUS_CHANGED → EIN_ALERT → NOTIFICATION_SENT → … → OUTCOME_RECORDED).', 'Centre: an exploded view of one entry: seq, recordedAt, observedAt, source, independentOfController, payload, prevHash, entryHash.', 'Right: a tamper panel. One altered entry turns red and every later link breaks. A separate "EVIDENCE GAP" entry is drawn in grey.'], labels: ['Hash-chained · append-only', 'Not signed · no trusted time-stamp (limitation)', 'Existence ≠ admissibility'], constraints: COMMON_CONSTRAINTS },
    },
    {
      number: '07', slug: 'authorized-human-intervention', title: 'AUTHORIZED HUMAN INTERVENTION',
      narration: `Detection is not correction. In scenario eight, the alert reaches the on-call technician, who acknowledges it and investigates. The investigation finds an actuation with no authorization record, and it does not decide who caused it. While the incident is open, even a routine defrost with a current grant is held. The facility manager issues a fresh, scoped authority to restore the baseline. Then, to test revalidation, that authority is revoked after commit and before execution. At the execution boundary the gate checks again, now, and refuses: ${restore1.execution?.determination}. A new authority is issued, the gate allows the restore, and the controller returns to its sealed configuration.`,
      explain: [
        `Routine command during the incident: ${routine.determination} (${routine.reasonCodes.join(', ')}).`,
        `First corrective authority: commit ${restore1.determination}; execution after revocation ${restore1.execution?.determination} (${restore1.execution?.reasonCodes.join(', ')}).`,
        `Second corrective authority: commit ${restore2.determination}; execution ${restore2.execution?.determination}; restored at ${hhmm(s8.response.restoredMinute!)}.`,
        'Each human step (acknowledgement, investigation, issuing and revoking authority) is recorded with the actor and time. The actors are simulated.',
        'In scenario S6 the corrective action was HOLD: without admissible evidence there is no admissible execution, so the product kept warming. Real sites need a separately authorized emergency procedure, which is not modelled here.',
      ],
      intent: 'Correction is itself a consequence: it needs fresh authority, admissible evidence and revalidation at the moment of execution.',
      demonstrated: 'S8: routine command held during the incident; revoked authority refused at execution; fresh authority executed (all PASS).',
      scenarioIds: ['S8', 'S6'],
      image: { filename: 'rcb-07-authorized-human-intervention.png', size: '1920×1080', purpose: 'Demonstrate investigation, authority revalidation, corrective action and accountability.', layout: ['Left to right: ALERT → ACKNOWLEDGE (technician role icon, no face) → INVESTIGATE ("no authorization record for observed actuation") → AUTHORITY ISSUED (facility manager role) → COMMIT.', 'Below the commit step: a branch "authority revoked" → EXECUTION: DENY (revalidated NOW).', 'Then: NEW AUTHORITY → COMMIT → EXECUTION: ALLOW → controller restored to the sealed baseline.'], labels: ['Commissioned once ≠ authorized forever', 'Revalidation NOW at the execution boundary', 'Every human action recorded'], constraints: COMMON_CONSTRAINTS },
    },
    {
      number: '08', slug: 'the-outcome-becomes-evidence', title: 'THE OUTCOME BECOMES EVIDENCE',
      narration: '', // completed from the outcome record in finishOutcomeLesson
      explain: [],
      intent: 'The outcome of an intervention is preserved as evidence and compared with what was authorized.',
      demonstrated: '',
      scenarioIds: ['S8'],
      image: { filename: 'rcb-08-the-outcome-becomes-evidence.png', size: '1920×1080', purpose: 'Compare the final outcome with the original baseline and show what was proven.', layout: ['Left: the sealed baseline envelope overlaid with the post-intervention independent temperatures returning inside it.', 'Centre: the outcome record (restored time, warmest independent product reading, minutes above limit, "product disposition: not decided by TA-14").', 'Right: a claims matrix (eight scenarios × capabilities) with PASS, FAIL and NOT DEMONSTRATED cells, and a footer "Simulation — not physical-system validation".'], labels: ['Outcome becomes the next evidence', 'What was proven · what was not'], constraints: COMMON_CONSTRAINTS },
    },
  ].map((l) => l.number === '08' ? finishOutcomeLesson(l as Lesson, results) : l as Lesson);
}

function finishOutcomeLesson(lesson: Lesson, results: ScenarioResult[]): Lesson {
  const s8 = results.find((x) => x.id === 'S8')!;
  const outcome = s8.record.entries.find((e) => e.type === 'OUTCOME_RECORDED')!.payload as { firstNormalAfterRestoreMinute: number; maxIndependentProductC: number; observedMinutesProductAboveLimit: number; restoredAtMinute: number };
  const hours = Math.round((outcome.firstNormalAfterRestoreMinute - outcome.restoredAtMinute) / 6) / 10;
  const all = results.flatMap((r) => r.claims);
  const count = (s: string) => all.filter((c) => c.status === s).length;
  const fails = results.flatMap((r) => r.claims.filter((c) => c.status === 'FAIL').map((c) => `${r.id} ${c.capability}`));
  return {
    ...lesson,
    narration: `After the restore, the node keeps watching. In scenario eight it reports normal again at ${hhmm(outcome.firstNormalAfterRestoreMinute)}, about ${hours} hours after the restore, and it stays normal to the end of the run. The outcome is recorded against the sealed baseline: when the restore happened, the warmest independent product reading of ${outcome.maxIndependentProductC} degrees, and ${outcome.observedMinutesProductAboveLimit} minutes observed above the limit. What happens to the ice cream is not TA-14's decision; it belongs to whoever is responsible for food safety. Across all eight scenarios, ${count('PASS')} examined claims passed, ${count('FAIL')} failed, and ${count('NOT_DEMONSTRATED')} were not demonstrated. Prevention failed for bypassed commands, and detection failed when evidence was lost. All of this is simulation, not a test of a physical system.`,
    explain: [
      `Outcome record (S8): restored ${hhmm(outcome.restoredAtMinute)}; first independent NORMAL ${hhmm(outcome.firstNormalAfterRestoreMinute)}; warmest independent product reading ${outcome.maxIndependentProductC} °C; observed above limit ${outcome.observedMinutesProductAboveLimit} min. Product disposition is not determined by TA-14.`,
      `Claims across all scenarios: ${count('PASS')} PASS · ${count('FAIL')} FAIL · ${count('NOT_DEMONSTRATED')} NOT DEMONSTRATED. FAIL: ${fails.join('; ')}.`,
      'Not demonstrated by this work: physical refrigeration behaviour, real controller protocols, real attacker capabilities, and the independence of real sensors from a compromised network.',
    ],
    demonstrated: `${count('PASS')} PASS, ${count('FAIL')} FAIL (${fails.join('; ')}), ${count('NOT_DEMONSTRATED')} NOT DEMONSTRATED, all in simulation.`,
  };
}
