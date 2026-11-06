export type Intake = {
  manufacturer: string;
  model: string;
  serial: string;
  equipmentType: string;
  concern: string;
  operatingMode: string;
  technicianId: string;
};

export type IntakeField = keyof Intake;

export const emptyIntake: Intake = {
  manufacturer: '', model: '', serial: '', equipmentType: '',
  concern: '', operatingMode: '', technicianId: '',
};

export const requiredIntakeFields: IntakeField[] = [
  'manufacturer', 'model', 'serial', 'equipmentType',
  'concern', 'operatingMode', 'technicianId',
];

export function validateIntake(intake: Intake): IntakeField[] {
  return requiredIntakeFields.filter(field => !intake[field].trim());
}

export function createIntakeRecord(intake: Intake, capturedAt: string) {
  const missing = validateIntake(intake);
  if (missing.length) throw new Error('Incomplete intake: ' + missing.join(', '));
  if (!Number.isFinite(Date.parse(capturedAt))) throw new Error('Invalid capture timestamp');
  return {
    schemaVersion: 'hvac-intake-v0.1',
    capturedAt,
    intake: Object.fromEntries(
      requiredIntakeFields.map(field => [field, intake[field].trim()])
    ) as Intake,
    baselineStatus: 'NOT_STARTED' as const,
    completedBaselineSteps: 0 as const,
    baselineFrozen: false as const,
    dddStatus: 'LOCKED' as const,
    interventionAuthorization: 'NONE' as const,
  };
}
