/**
 * Declared window statistics (s05 catalogue), governed by CRR-TA14-WINDOW-STATISTICS-1 (CANDIDATE).
 *
 * count; minimum; maximum; arithmetic mean = sum / count; span = last observedAt - first observedAt.
 * No weighting, interpolation, resampling, outlier removal, gap filling or comparison.
 * Uncertainty is propagated only if the governing reference establishes a method; this implementation
 * defines none, so it reports NOT_PROPAGATED.
 *
 * This file's SHA-256 is its implementation identity (analyzer/implementations.ts). Any edit requires a
 * new identity and a new conformance record.
 */
import { MS_PER_SECOND } from "../../time";
import type { CalculationImplementation, CalculationOutput } from "../contract";

export const windowStatistics: CalculationImplementation = (inputs, method) => {
  const series = inputs.observations.series ?? [];
  if (series.length === 0) return { notEstablished: ["series"] };
  const unit = series[0].unit;
  const values = series.map((o) => o.value);
  const times = series.map((o) => Date.parse(o.observedAt));
  const notPropagated = { status: "NOT_PROPAGATED" as const, reason: method.uncertaintyMethod === null ? "NO_UNCERTAINTY_METHOD_ESTABLISHED" : "METHOD_NOT_IMPLEMENTED" };
  const output = (name: string, value: number, outputUnit: string): CalculationOutput => ({ name, value, unit: outputUnit, uncertainty: notPropagated });
  return {
    outputs: [
      output("count", series.length, "1"),
      output("minimum", Math.min(...values), unit),
      output("maximum", Math.max(...values), unit),
      output("mean", values.reduce((sum, v) => sum + v, 0) / series.length, unit),
      output("span", (Math.max(...times) - Math.min(...times)) / MS_PER_SECOND, "s"),
    ],
  };
};
