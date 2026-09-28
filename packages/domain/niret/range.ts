/**
 * Amendment A8 (C1-R5): OEM range resolution.
 *
 * A range bound is one of:
 * - a number the OEM states (directly or as a table/chart cell);
 * - unbounded, only where the OEM states "and above" / "and below" (R5-11);
 * - derived deterministically from OEM-stated operands (R5-10): nominal ± tolerance,
 *   ± a percentage of a rated value, or a per-ton factor × nominal tonnage.
 *
 * No other arithmetic, no interpolation, no extrapolation, no generic value.
 * An inconsistent range resolves to null and the caller fails closed.
 */

import type { OemRange, RangeDerivation, Unit } from "./types";

/** Percent is defined per hundred; this is the definition of the OEM's stated unit, not a threshold. */
const PER_HUNDRED = 100;

export interface ResolvedBounds {
  min: number;
  max: number;
}

type RangeLike = Pick<OemRange, "min" | "max" | "unbounded"> & { derivation?: RangeDerivation };

function derive(derivation: RangeDerivation): ResolvedBounds | null {
  if (derivation.form === "TOLERANCE_BAND") {
    return derivation.tolerance >= 0 ? { min: derivation.nominal - derivation.tolerance, max: derivation.nominal + derivation.tolerance } : null;
  }
  if (derivation.form === "PERCENT_OF_RATED") {
    if (derivation.percent < 0 || derivation.rated <= 0) return null;
    const delta = (derivation.rated * derivation.percent) / PER_HUNDRED;
    return { min: derivation.rated - delta, max: derivation.rated + delta };
  }
  const { nominalTons, minPerTon, maxPerTon } = derivation;
  if (nominalTons <= 0 || (minPerTon === null && maxPerTon === null)) return null;
  return {
    min: minPerTon === null ? -Infinity : minPerTon * nominalTons,
    max: maxPerTon === null ? Infinity : maxPerTon * nominalTons,
  };
}

export function resolveRange(range: RangeLike): ResolvedBounds | null {
  if (range.derivation) {
    if (range.min !== null || range.max !== null || range.unbounded !== undefined) return null;
    const derived = derive(range.derivation);
    return derived && derived.min <= derived.max ? derived : null;
  }
  const min = range.min ?? (range.unbounded === "MIN" ? -Infinity : null);
  const max = range.max ?? (range.unbounded === "MAX" ? Infinity : null);
  if (min === null || max === null) return null;
  if (range.unbounded === "MIN" && range.min !== null) return null;
  if (range.unbounded === "MAX" && range.max !== null) return null;
  return min <= max ? { min, max } : null;
}

/** R5-04: a criterion establishes acceptance only when both sides are bounded. */
export function isTwoSided(range: RangeLike): boolean {
  const bounds = resolveRange(range);
  return bounds !== null && Number.isFinite(bounds.min) && Number.isFinite(bounds.max);
}

/** JSON-safe record of a resolved range for the receipt (unbounded sides as null, derivation preserved). */
export function rangeRecord(
  range: RangeLike & { unit: Unit; ref: string },
  bounds: ResolvedBounds,
): { min: number | null; max: number | null; unit: Unit; ref: string; derivation?: RangeDerivation } {
  return {
    min: Number.isFinite(bounds.min) ? bounds.min : null,
    max: Number.isFinite(bounds.max) ? bounds.max : null,
    unit: range.unit,
    ref: range.ref,
    ...(range.derivation ? { derivation: range.derivation } : {}),
  };
}

/** Interval of |value| for an OEM limit stated on magnitude (e.g. "return static must be less than 0.40"). */
export function magnitudeInterval(value: number, uncertainty: number): { value: number; uncertainty: number } {
  const magnitude = Math.abs(value);
  if (magnitude > uncertainty) return { value: magnitude, uncertainty };
  const high = magnitude + uncertainty;
  return { value: high / 2, uncertainty: high / 2 };
}
