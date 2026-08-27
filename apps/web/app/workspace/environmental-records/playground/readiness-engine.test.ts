import { describe, expect, it } from 'vitest';
import { examineEnvironmentalReadiness } from './readiness-engine';

const inspectionObject = 'Indoor environmental conditions and governed ventilation response in Conference Room 204 from 08:00-17:00 on August 24, 2026, including CO2 changed condition, intervention, and outcome.';
const proposition = 'Does the admitted environmental evidence support the declared bounded intervention and preserve the resulting governed execution chronology?';

const common = `
AIR ID: AIR-TEST-001
Record ID: AIR-TEST-001
Record Version: 1.0
Facility: Northpoint Professional Center
Location: Conference Room 204
Date: August 24, 2026
Record Boundary: 08:00-17:00 EDT
Device ID: EMS400-204-017
Serial: 400A-88271
Calibration Certificate: CAL-001
Calibration Status: CURRENT
Calibration Reference: NIST-traceable reference
Native sampling interval: 60 seconds
Raw observations retained: YES
Expected native observations: 541
Recorded native observations: 541
Missing observations: 0
Monitoring uptime: 100%
SHA-256: 7e184dc8fbb9258fd278814745916fc2af7cc09fd7e883c04ae24785e0196e41
Chain of custody: ESTABLISHED
Reference Standard: GO IAQS environmental reporting framework
Declared CO2 operating threshold: 900 ppm
`;

const sections = {
  changed: `
Changed Condition ID: CC-AIR-204-001
Observed condition: CO2 = 963 ppm
Changed-condition state: ESTABLISHED
`,
  validation: `
Validation ID: PEV-AIR-204-001
Validation Time: 14:02 EDT
Pre-execution evidence state: SUPPORTED FOR DECLARED BOUNDED INTERVENTION REVIEW
`,
  authority: `
Authority Record ID: AUTH-NPT-AHU2-2026-017
Authorized by: Northpoint Facilities Operations
Responsible Party: Facilities Operations Manager
Authority Status: ACTIVE
`,
  binding: `
Binding Record ID: BIND-AIR-204-001
Bound evidence: AIR-TEST-001
Bound changed condition: CC-AIR-204-001
Bound authority: AUTH-NPT-AHU2-2026-017
Bound permitted consequence: Increase outdoor-air damper command.
`,
  revalidation: `
PRE-COMMIT REVALIDATION
Authority Status: ACTIVE
Revalidation Determination: ALLOW
`,
  commit: `
Commit Record ID: COMMIT-AIR-204-001
Authorized execution: Increase outdoor-air damper command from 28% to 38%.
Execution boundary: AHU-2 outdoor-air control.
`,
  execution: `
Execution Event ID: EXEC-AIR-204-001
Command after intervention: 38%
Execution Result: COMPLETED WITHIN BOUND AUTHORITY
`,
  outcome: `
Outcome Record ID: OUT-AIR-204-001
Observed post-intervention condition: CO2 = 774 ppm
Observed state: BELOW DECLARED OPERATING REFERENCE
`,
  closure: `
Closure Record ID: CLOSE-AIR-204-001
Closure Time: 17:00 EDT
Record State: CLOSED
`,
} as const;

type Link = keyof typeof sections;
const links = Object.keys(sections) as Link[];

function recordWithout(removed?: Link, conflictLine = 'Conflicting evidence: NONE IDENTIFIED') {
  return [common, conflictLine, ...links.filter(link => link !== removed).map(link => sections[link])].join('\n');
}

function examine(text: string) {
  return examineEnvironmentalReadiness({
    text,
    inspectionObject,
    proposition,
    recordClass: 'TA-14 Atmospheric Integrity Record - Governed Environmental Intervention Record',
  });
}

function finding(text: string, id: string) {
  return examine(text).findings.find(item => item.id === id);
}

describe('TA14-EGRI v1.3 governed intervention chain', () => {
  it('recognizes the complete nine-link chain', () => {
    const report = examine(recordWithout());
    expect(report.engineVersion).toBe('1.3.0');
    expect(finding(recordWithout(), 'intervention_chain')?.status).toBe('ESTABLISHED');
  });

  it('does not convert an explicit no-conflict declaration into CONFLICT', () => {
    expect(finding(recordWithout(), 'conflict')?.status).toBe('NOT_APPLICABLE');
  });

  it('recognizes an affirmative conflict declaration', () => {
    expect(finding(recordWithout(undefined, 'Conflicting evidence: PRESENT'), 'conflict')?.status).toBe('CONFLICT');
  });

  for (const link of links) {
    it(`weakens the governed chain when ${link} is removed`, () => {
      expect(finding(recordWithout(link), 'intervention_chain')?.status).not.toBe('ESTABLISHED');
    });
  }
});
