/**
 * OEM reference boundary.
 *
 * Manual entry: the technician transcribes OEM values and identifies the source
 * (manufacturer, model, document, chart/table). This is always a DECLARED
 * transcription. Amendment A7: when the governed registry holds a VERIFIED,
 * CURRENT record for the exact system, the server replaces these values with
 * the record; otherwise they are evaluated as unverified evidence only and may
 * become a curation request (never a verified record).
 *
 * No value is invented, defaulted, or substituted here.
 */

import type { MeasurementKey, OemRange, OemReference, Unit } from "../../../../packages/domain/niret/types";
import type { NiretFormState, RangeEntry, TriState } from "./form-state";

export interface OemReferenceSource {
  readonly kind: "MANUAL_ENTRY" | "GOVERNED_LIBRARY";
  resolve(): OemReference;
}

/** Number parsing without defaults: "" -> undefined; unparseable -> null (rejected by the contract). */
export function parseEntry(text: string): number | null | undefined {
  const trimmed = text.trim();
  if (trimmed === "") return undefined;
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
}

export function triState(value: TriState): boolean | undefined {
  return value === "YES" ? true : value === "NO" ? false : undefined;
}

export function oemSourceLabel(oem: NiretFormState["oem"]): string {
  return [oem.manufacturer, oem.model, oem.document, oem.revision, oem.section]
    .map((part) => part.trim()).filter(Boolean).join(" · ");
}

function range(entry: RangeEntry, unit: Unit, sourceLabel: string): OemRange | undefined {
  const min = parseEntry(entry.min);
  const max = parseEntry(entry.max);
  if (min === undefined && max === undefined) return undefined;
  // A partially or wrongly entered range is passed through as-is so the engine rejects it.
  return {
    min: min as number,
    max: max as number,
    unit,
    ref: [sourceLabel, entry.ref.trim()].filter(Boolean).join(" · "),
  };
}

export function manualOemReference(form: NiretFormState): OemReferenceSource {
  return {
    kind: "MANUAL_ENTRY",
    resolve(): OemReference {
      const oem = form.oem;
      const source = oemSourceLabel(oem);
      const described = (value: string) => (value.trim() === "" ? undefined : value.trim());
      const reference: Record<string, unknown> = {
        documentRefs: source ? [source] : [],
        // Amendment A5: manual entry is DECLARED transcription. Verification comes only from a governed source server-side.
        provenance: JSON.parse(JSON.stringify({
          acquisitionMethod: "MANUAL_TRANSCRIPTION",
          verification: "NOT_VERIFIED",
          manufacturer: described(oem.manufacturer),
          model: described(oem.model),
          documentId: described(oem.document),
          revision: described(oem.revision),
          pageRef: described(oem.section),
          sourceRef: described(oem.sourceRef),
        })),
        chargingMethod: oem.chargingMethodStatus === "IDENTIFIED"
          ? { status: "IDENTIFIED", ref: [source, oem.chargingMethodRef.trim()].filter(Boolean).join(" · ") }
          : { status: "NOT_OBTAINED", obtainable: triState(oem.chargingMethodObtainable) ?? true },
        requiresUnavailableToolOrMode: oem.requiresUnavailableToolOrMode,
        measurementLocations: Object.fromEntries(
          Object.entries(oem.locations).filter(([, location]) => (location ?? "").trim() !== ""),
        ) as Partial<Record<MeasurementKey, string>>,
        noninvasiveCriterion: oem.criterionStatus === "PUBLISHED"
          ? {
              status: "PUBLISHED",
              derivation: oem.criterionDerivation === "SINGLE_MEASUREMENT"
                ? { kind: "SINGLE_MEASUREMENT", measurement: oem.criterionMeasurement }
                : { kind: oem.criterionDerivation },
              // A7 contract: a manual criterion is one unconditioned candidate, declared PARTIAL. It is never verified.
              coverage: "PARTIAL",
              lookup: { interpolationRequired: false, calculationRequired: false, unrepresentedConditions: [] },
              candidates: [{
                candidateId: "MANUAL_TRANSCRIPTION",
                range: range(oem.criterion, criterionUnit(oem), source) ?? { min: null, max: null, unit: criterionUnit(oem), ref: source },
                appliesWhen: [],
              }],
            }
          : { status: "NOT_OBTAINED", obtainable: triState(oem.criterionObtainable) ?? true },
      };
      const optional: Array<[string, OemRange | undefined]> = [
        ["airflowRange", range(oem.airflow, "CFM", source)],
        ["espRange", range(oem.esp, "IN_WC", source)],
        ["ambientEnvelope", range(oem.ambient, "F", source)],
        ["voltageRange", range(oem.voltage, "V", source)],
      ];
      for (const [key, value] of optional) if (value) reference[key] = value;
      const minRun = parseEntry(oem.minRunMinutes);
      if (minRun !== undefined) reference.minRunMinutes = { value: minRun, ref: [source, oem.minRunRef.trim()].filter(Boolean).join(" · ") };
      if (oem.stabilityMeasurement) {
        reference.stabilityCriterion = {
          measurement: oem.stabilityMeasurement,
          maxChange: parseEntry(oem.stabilityMaxChange) ?? null,
          unit: unitFor(oem.stabilityMeasurement),
          ref: [source, oem.stabilityRef.trim()].filter(Boolean).join(" · "),
        };
      }
      const ecm = triState(oem.permitsEcmWithTableMethod);
      if (ecm !== undefined) reference.permitsEcmWithTableMethod = ecm;
      return reference as unknown as OemReference;
    },
  };
}

/** Contract units per measurement key (no conversion is ever performed). */
export function unitFor(key: MeasurementKey): Unit {
  if (key === "returnRh" || key === "supplyRh" || key === "outdoorRh") return "PCT_RH";
  if (key === "airflow") return "CFM";
  if (key === "returnStatic" || key === "supplyStatic") return "IN_WC";
  if (key === "supplyVoltage") return "V";
  if (key === "compressorCurrent" || key === "blowerCurrent") return "A";
  return "F";
}

function criterionUnit(oem: NiretFormState["oem"]): Unit {
  return oem.criterionDerivation === "SINGLE_MEASUREMENT" && oem.criterionMeasurement
    ? unitFor(oem.criterionMeasurement)
    : "F";
}
