/*
 * SYNTHETIC calculation functions for TA-14 EIE Phase 2A tests. SIMULATION ONLY.
 * They are deliberately trivial and non-physical: they exist to exercise the calculation contract
 * (lineage, chaining, units, domain, uncertainty propagation), not to compute anything real.
 */
import type { CalculationImplementation, CalculationOutput } from "../../../packages/domain/eie/analyzer";

/** SYNTHETIC mean of one series. Uncertainty: SYNTHETIC worst case of the stated accuracies, when every input states one in the input unit. */
export const syntheticMean: CalculationImplementation = (inputs, method) => {
  const series = inputs.observations.series ?? [];
  if (series.length === 0) return { notEstablished: ["series"] };
  const unit = series[0].unit;
  const mean = series.reduce((sum, o) => sum + o.value, 0) / series.length;
  const stated = series.map((o) => o.accuracyOrUncertainty);
  const propagate = method.uncertaintyMethod !== null && stated.every((s) => s !== null && s.unit === unit);
  const output: CalculationOutput = {
    name: "mean", value: mean, unit,
    uncertainty: propagate
      ? { status: "PROPAGATED", methodRef: method.uncertaintyMethod!, value: Math.max(...stated.map((s) => s!.value)), unit }
      : { status: "NOT_PROPAGATED", reason: method.uncertaintyMethod === null ? "NO_UNCERTAINTY_METHOD_ESTABLISHED" : "INPUT_UNCERTAINTY_NOT_STATED" },
  };
  return { outputs: [output] };
};

/** SYNTHETIC difference a - b of two prior results. Uncertainty: SYNTHETIC linear sum when both are propagated. */
export const syntheticDifference: CalculationImplementation = (inputs, method) => {
  const { a, b } = inputs.priorResults;
  if (!a || !b || a.unit !== b.unit) return { notEstablished: ["a", "b"] };
  const both = a.uncertainty.status === "PROPAGATED" && b.uncertainty.status === "PROPAGATED";
  const output: CalculationOutput = {
    name: "difference", value: a.value - b.value, unit: a.unit,
    uncertainty: both && method.uncertaintyMethod !== null && a.uncertainty.status === "PROPAGATED" && b.uncertainty.status === "PROPAGATED"
      ? { status: "PROPAGATED", methodRef: method.uncertaintyMethod, value: a.uncertainty.value + b.uncertainty.value, unit: a.unit }
      : { status: "NOT_PROPAGATED", reason: "INPUT_UNCERTAINTY_NOT_PROPAGATED" },
  };
  return { outputs: [output] };
};
