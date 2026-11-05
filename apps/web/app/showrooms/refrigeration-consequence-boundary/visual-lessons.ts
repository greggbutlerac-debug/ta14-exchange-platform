/*
 * Editorial teaching layer for the eight supplied infographics.
 * All charts inside the artworks are illustrative. The simulation exports and
 * the live DriftChart / claims matrix remain authoritative.
 * Keep owner-gated until technical accuracy issues are resolved and approved.
 */
export const VISUAL_LESSONS = [
  {
    title: 'WHEN THE ATTACKER BYPASSES GOVERNANCE',
    file: 'Governance Bypass and Detection Paths.png',
    narration: 'An attacker may bypass the execution boundary without automatically escaping independent observation. In scenarios S1 and S7, the governed route refused unauthorized commands. Direct controller changes in S2 and S3 were not prevented. Independent observation detected the physical deviations in S2 through S5. When independent temperature evidence was unavailable in S6, detection failed. The examination preserves those three failures, instead of claiming that governance is a perfect defense.',
    note: 'Conceptual governance map. S1 to S8: 27 PASS and 3 FAIL. No real refrigeration system was tested.',
    intent: 'Separate prevention, independent detection, and preservation of evidence.',
    demonstrated: 'S1/S7 prevention PASS; S2/S3 prevention FAIL; S2-S5 detection PASS; S6 detection FAIL.',
    scenarioIds: ['S1','S2','S3','S6','S7']
  },
  {
    title: 'THE AUTHORIZED BASELINE',
    file: 'Authorized Baseline_ Freezer Control Reference.png',
    narration: 'Before the simulation evaluates a proposed consequence, the last authorized operating state is established and sealed. The freezer setpoint is minus twenty-two degrees Celsius. The approved air band is minus twenty-five to minus nineteen degrees. The simulation defines four twenty-minute defrosts each day and a maximum defrost duration of thirty minutes. A sealed baseline is a reference for evaluating proposed changes, not permanent permission for any future intervention. The controller claiming to return to its settings is not, by itself, evidence of physical recovery.',
    note: 'The baseline is simulated, not a real equipment specification. The drawn freezer and flow are illustrative.',
    intent: 'Establish the approved operating reference before evaluating change.',
    demonstrated: 'The sealed baseline remained unchanged in all eight simulated scenarios.',
    scenarioIds: ['S1','S7']
  },
  {
    title: 'THE UNAUTHORIZED COMMAND THAT GOVERNANCE REFUSED',
    file: 'Neon AEA Governance Prevents Unauthorized Defrost.png',
    narration: 'Scenario S1 tests an unauthorized six-hour defrost submitted through the governed route. The actor lacks sufficient authority and established standing; the command also exceeds the authorized operating limit. AEA returns DENY, and execution is not attempted. Scenario S7 also refuses an expired authorization, including when it is replayed by the original holder. This is what the governed execution boundary can demonstrate: it refuses the commands presented to it. It cannot refuse a command it never receives.',
    note: 'S1 tested a six-hour defrost, not a setpoint change. S7 tested expired authority replay.',
    intent: 'Prevent a proposed unauthorized consequence when the request passes through AEA.',
    demonstrated: 'S1 and S7 unauthorized governed commands were refused without execution.',
    scenarioIds: ['S1','S7']
  },
  {
    title: 'THE COMMAND THAT BYPASSED GOVERNANCE',
    file: 'Six-Hour Defrost Bypass_ Detection and Evidence.png',
    narration: 'In Scenario S2, the attacker does not submit the command to AEA. The attacker directly initiates a six-hour defrost at the controller. Prevention fails because AEA never receives the command. Independent observation flags the deviation ten minutes after the unauthorized change. The incident record preserves the event and does not fabricate an AEA authorization. Detection is not proof of who caused the change. The temperature drawing in this illustration is conceptual; the accompanying live simulation chart is the authoritative trace.',
    note: 'S2 command: unauthorized six-hour defrost. The artwork temperature curve is illustrative; use the live S2 chart for source values.',
    intent: 'Distinguish a bypassed execution from an authorized command.',
    demonstrated: 'S2 prevention FAIL; independent detection PASS after 10 minutes; record preservation PASS.',
    scenarioIds: ['S2']
  },
  {
    title: 'WHEN THE CONTROLLER LIES',
    file: 'When the Controller Lies_ Scenario S4.png',
    narration: 'In Scenario S4, the attacker raises the controller setpoint to plus two degrees Celsius and falsifies controller temperature reporting at minus twenty-one point eight degrees. Independent observation detects a physical deviation thirty-five minutes after the unauthorized change, even though the controller self-report appears normal. A controller cannot authenticate its own physical condition simply by declaring it. However, a hash-chained record by itself does not establish sensor accuracy, trusted custody, or admissibility. The graph inside this illustration is explanatory, not exported simulation data.',
    note: 'S4 reports a falsified minus 21.8 C while the setpoint is plus 2 C. The artwork curve is illustrative; the live S4 chart is authoritative.',
    intent: 'Separate controller self-reports from independent physical observation.',
    demonstrated: 'S4 DETECTION_INDEPENDENT_OF_CONTROLLER_REPORTS PASS; detection latency 35 minutes.',
    scenarioIds: ['S4']
  },
  {
    title: 'WHEN INDEPENDENT EVIDENCE DISAPPEARS',
    file: 'Refrigeration Governance_ Evidence Gap Hold.png',
    narration: 'In Scenario S6, one independent temperature probe sticks and other temperature probes stop reporting. The physical state is no longer established by the independent evidence. Detection fails. The recorder explicitly records three evidence gaps, and ordinary corrective action is placed on HOLD for unsupported continuity and admissibility. The simulator truth shows that the product continued warming; that truth was never provided to the governance gate. The separate E1 extension examines a limited protective pathway, but it does not change the failure recorded in S6.',
    note: 'The illustrated rise is NOT a sensor observation in S6. The independent sensor state was EVIDENCE_INSUFFICIENT.',
    intent: 'Preserve gaps and refuse unsupported ordinary execution.',
    demonstrated: 'S6 detection FAIL; three evidence gaps recorded; ordinary correction HOLD.',
    scenarioIds: ['S6']
  },
  {
    title: 'AUTHORIZED HUMAN INTERVENTION — REVALIDATE NOW',
    file: 'Authorized Intervention Revalidation Flow (1).png',
    narration: 'Detection does not authorize correction. Scenario S8 shows an alert, technician acknowledgement and investigation, followed by a fresh scoped corrective authority. A grant is then revoked between commit and execution; the execution gate checks authority again and returns DENY. Only a second fresh authority permits the simulated restore to the sealed baseline. This illustrates why commissioned once is not authorized forever. Separately, scenario S6 remains a detection failure when independent evidence disappears. Extension E1 tests only tightly bounded protective measures, including restoring a sealed setpoint, terminating an active defrost, or re-enabling an alarm. E1 does not authorize arbitrary defrost or override, and does not demonstrate a verified physical outcome.',
    note: 'S8: a revoked grant is refused at execution. The illustration focuses on the DENY branch; the simulation also demonstrates a subsequent fresh authority and authorized restore. E1 is a separate emergency extension, not part of this sequence.',
    intent: 'Distinguish ordinary corrective authorization and execution-time revalidation (S8) from the limited emergency pathway (E1).',
    demonstrated: 'S8: revoked corrective authority DENY at execution, fresh authority ALLOW in simulation. E1: limited setpoint restoration simulated; independent outcome verification NOT DEMONSTRATED.',
    scenarioIds: ['S8','S6']
  },
  {
    title: 'INDEPENDENT REVIEW: CAN THE EVIDENCE SURVIVE EXAMINATION?',
    file: 'Independent Review_ Evidence Under Examination (1).png',
    narration: 'The final task is to reproduce the examination, challenge the declared assumptions, and preserve failures. Across eight original scenarios, twenty-seven examined claims passed and three failed. Prevention failed for direct bypassed controller commands in S2 and S3. Detection failed when independent temperature evidence was lost in S6. E1 is a separate limited emergency-pathway simulation, not part of those thirty claims. Reviewers should verify incident record continuity and the authorization boundary, while keeping records distinct from evidence that has actually been found admissible. The governing question is whether Admissible Evidence, Applicable Authority, and Established Standing justify this consequence now.',
    note: 'Artwork is an educational overview, not a claims matrix: its one-result-per-scenario labels do NOT represent the 30 individual claims. Some pictured scenario examples are simplified or mismatched (especially S4/S5). Use the live claims matrix and evidence records below for all determinations.',
    intent: 'Expose the results, limitations and evidence record to independent challenge.',
    demonstrated: 'S1-S8: 27 PASS, 3 FAIL. E1 is separate. No physical-system validation or external endorsement.',
    scenarioIds: ['S1','S2','S3','S4','S5','S6','S7','S8']
  }
] as const;
