/**
 * Evidence adapter: technician form state -> frozen TA-14-NIRET-GA-C1 input.
 *
 * Pure translation only. It never decides applicability, sufficiency, or a
 * determination, and it never fills a value the technician did not enter.
 * Empty entries become absent evidence; malformed entries are passed through
 * so the engine rejects them (fail closed). Nominal capacity (context only) is
 * never sent to Gate A, and certification is never marked verified here.
 */

import type { GateAInput, MeasurementKey } from "../../../../packages/domain/niret/types";
import type { InstrumentKind, MeasurementEntry, NiretFormState } from "./form-state";
import { governedMethodFor } from "./governed-methods";
import { manualOemReference, parseEntry, triState, unitFor, type OemReferenceSource } from "./oem-reference";

const KIND_FOR_UNIT: Readonly<Record<string, InstrumentKind>> = {
  F: "TEMPERATURE", PCT_RH: "HUMIDITY", IN_WC: "AIR_PRESSURE", CFM: "AIRFLOW", V: "VOLTAGE", A: "CURRENT",
};

const text = (value: string): string | undefined => (value.trim() === "" ? undefined : value.trim());
const choice = <T extends string>(value: T | ""): T | undefined => (value === "" ? undefined : value);

function measurement(form: NiretFormState, key: MeasurementKey, entry: MeasurementEntry, signed?: number | null) {
  const value = signed !== undefined ? signed : parseEntry(entry.value);
  const instrument = form.instruments.find((row) => row.id === entry.instrumentId);
  const unit = unitFor(key);
  // Accuracy is carried only when the instrument's kind matches the contract unit;
  // otherwise it is absent and the engine treats the reading as unestablished.
  const accuracy = instrument && KIND_FOR_UNIT[unit] === instrument.kind ? parseEntry(instrument.accuracy) : undefined;
  const result: Record<string, unknown> = {
    value: value ?? null,
    unit,
    measuredAt: entry.measuredAt,
    location: entry.location.trim(),
    instrumentId: entry.instrumentId,
    provenance: "MANUAL",
  };
  if (accuracy !== undefined) result.accuracy = accuracy;
  // A9: only an explicit technician affirmation records a governed measurement method.
  const methodId = entry.governedMethod ? governedMethodFor(key)?.id : undefined;
  if (methodId) result.methodId = methodId;
  return result;
}

function signedStatic(entry: MeasurementEntry, direction: "" | "BELOW_AMBIENT" | "ABOVE_AMBIENT"): number | null | undefined {
  const magnitude = parseEntry(entry.value);
  if (magnitude === undefined || magnitude === null) return magnitude;
  if (direction === "") return null; // direction required to express a signed static reading
  return direction === "BELOW_AMBIENT" ? -Math.abs(magnitude) : Math.abs(magnitude);
}

export interface AdapterOptions {
  requestId: string;
  oemSource?: OemReferenceSource;
}

export function buildGateAInput(form: NiretFormState, options: AdapterOptions): GateAInput {
  const measurements: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(form.measurements) as Array<[MeasurementKey, MeasurementEntry | undefined]>) {
    if (!entry || entry.value.trim() === "") continue; // not entered = not applicable / not yet established
    const signed = key === "returnStatic" || key === "supplyStatic" ? signedStatic(entry, form.staticDirection[key]) : undefined;
    measurements[key] = measurement(form, key, entry, signed);
  }

  // Amendment A4: the form states only how the credential was supplied. Verification is
  // never set here; the server records it from an independent source (or as unavailable).
  const verification = { assurance: form.job.certificationAssurance, status: "NOT_VERIFIED" };
  const certification = (() => {
    const job = form.job;
    if (job.certificationStatus === "") return undefined;
    if (job.certificationStatus === "NOT_CERTIFIED") return { status: "NOT_CERTIFIED" };
    if (job.certificationStatus === "SUPERVISED_APPRENTICE") {
      return { status: "SUPERVISED_APPRENTICE", supervisorCertificateRef: job.certificateRef.trim(), supervisorType: job.certificationType || null, verification };
    }
    return { status: "CERTIFIED", type: job.certificationType || null, certificateRef: job.certificateRef.trim(), verification };
  })();

  const observations = Object.fromEntries(
    Object.entries(form.observations).filter(([, value]) => value.trim() !== "").map(([key, value]) => [key, value.trim()]),
  );

  const evidence: Record<string, unknown> = {
    recordId: options.requestId,
    pressureSideEntry: form.pressureSideEntry,
    equipment: {
      manufacturer: text(form.equipment.manufacturer),
      indoorModel: text(form.equipment.indoorModel),
      outdoorModel: text(form.equipment.outdoorModel),
      pairingVerifiedAgainstOem: triState(form.equipment.pairingVerified),
      identityEstablishableFromOem: triState(form.equipment.identityEstablishableFromOem),
      configuration: form.equipment.configuration || "UNKNOWN",
      compressorStaging: form.equipment.compressorStaging || "UNKNOWN",
      verifiedAt: text(form.equipment.verifiedAt),
    },
    mode: form.equipment.mode || "UNKNOWN",
    metering: {
      type: form.metering.type || "UNKNOWN",
      evidenceBasis: form.metering.evidenceBasis || "NONE",
      establishableFromOem: triState(form.metering.establishableFromOem),
      verifiedAt: text(form.metering.verifiedAt),
    },
    refrigerant: {
      declared: text(form.refrigerant.declared),
      safetyClass: choice(form.refrigerant.safetyClass),
      a2lMarkingsObserved: form.refrigerant.a2lMarkingsObserved,
      flammableRefrigerantLabelsObserved: form.refrigerant.flammableLabelsObserved,
      integritySuspect: form.refrigerant.integritySuspect,
    },
    technician: { identity: form.job.technicianId.trim(), certification },
    authorization: {
      workScopeRef: text(form.job.workScopeRef),
      workScopeIncludesDiagnosis: triState(form.job.workScopeIncludesDiagnosis),
      sitePermission: choice(form.job.sitePermission),
      jurisdiction: choice(form.job.jurisdiction),
    },
    safety: { hazard: choice(form.job.hazard) },
    instruments: form.instruments.map((row) => ({ instrumentId: row.id, calibrationValid: row.calibrationValid, setupVerified: row.setupVerified })),
    plannedPressureInstruments: form.pressureInstruments.map((row) => ({
      instrumentId: row.id,
      ratedForRefrigerants: row.ratedFor.split(",").map((part) => part.trim()).filter(Boolean),
      calibrationValid: row.calibrationValid,
    })),
    operation: {
      runStartedAt: text(form.operation.runStartedAt),
      compressorRunningSteadily: triState(form.operation.compressorRunningSteadily),
    },
    events: form.events.map((event) => ({
      type: event.type, at: event.at,
      ...(event.affectsIdentity ? { affectsIdentity: true } : {}),
      ...(event.affectsRefrigerantCircuit ? { affectsRefrigerantCircuit: true } : {}),
    })),
    corrections: form.corrections.map((correction) => ({
      at: correction.at,
      declaredFinding: correction.declaredFinding,
      authorityRef: correction.authorityRef,
      beforeRecordRef: correction.beforeRecordRef,
      correctionDescription: correction.correctionDescription,
      afterRecordRef: correction.afterRecordRef,
      rebaselinedAt: text(correction.rebaselinedAt),
    })),
    evaporator: {
      iceStatus: choice(form.evaporator.iceStatus),
      iceObservedAt: text(form.evaporator.iceObservedAt),
      icingOccurred: form.evaporator.icingOccurred || undefined,
      iceRestoration: form.evaporator.icingOccurred
        ? { ...form.evaporator.restoration, causeDisposition: form.evaporator.restoration.causeDisposition || null, completedAt: form.evaporator.restoration.completedAt || null }
        : undefined,
    },
    condenser: {
      panelsInPlace: triState(form.condenser.panelsInPlace),
      coilCondition: choice(form.condenser.coilCondition),
      fanOperating: triState(form.condenser.fanOperating),
      observedAt: text(form.condenser.observedAt),
    },
    airflowMethod: form.airflowMethod.method
      ? {
          method: form.airflowMethod.method, motorType: form.airflowMethod.motorType || "UNKNOWN", componentsClean: triState(form.airflowMethod.componentsClean),
          ...(form.airflowMethod.blowerSetting?.trim() ? { blowerSetting: form.airflowMethod.blowerSetting.trim() } : {}),
        }
      : undefined,
    observations: Object.keys(observations).length ? observations : undefined,
    measurements,
    stabilityReadings: form.oem.stabilityMeasurement && form.stabilityReadings.length
      ? form.stabilityReadings.map((entry) => measurement(form, form.oem.stabilityMeasurement as MeasurementKey, entry))
      : undefined,
  };

  const input = {
    request: {
      requestId: options.requestId,
      question: "REFRIGERANT_CHARGE",
      statedProposition: form.job.statedProposition.trim(),
      statedBasis: [...form.job.statedBasis],
      // Stamped with server time by the evaluator endpoint.
      evaluatedAt: "",
    },
    evidence,
    oem: (options.oemSource ?? manualOemReference(form)).resolve(),
  };
  // Drop undefined keys so absent evidence is truly absent in the contract.
  return JSON.parse(JSON.stringify(input)) as GateAInput;
}
