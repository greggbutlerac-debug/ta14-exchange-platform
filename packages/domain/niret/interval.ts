/**
 * Owner ruling F1 — ambiguity fails closed.
 *
 * Every range comparison uses the interval [value - u, value + u], where u is
 * the recorded instrument accuracy. WITHIN and OUTSIDE require the whole
 * interval on one side of the OEM boundaries; anything else is AMBIGUOUS.
 * Derived values carry the worst-case linear sum of their inputs' accuracies.
 */

export type IntervalClass = "WITHIN" | "OUTSIDE" | "AMBIGUOUS";

export function classifyInterval(
  value: number,
  uncertainty: number,
  range: { min: number; max: number },
): IntervalClass {
  const low = value - uncertainty;
  const high = value + uncertainty;
  if (low >= range.min && high <= range.max) return "WITHIN";
  if (high < range.min || low > range.max) return "OUTSIDE";
  return "AMBIGUOUS";
}

export function worstCaseUncertainty(accuracies: readonly number[]): number {
  return accuracies.reduce((sum, accuracy) => sum + Math.abs(accuracy), 0);
}
