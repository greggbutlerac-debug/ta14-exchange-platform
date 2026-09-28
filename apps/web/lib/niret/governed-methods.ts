/**
 * TA-14 governed measurement methods (Amendment A9, policy T7), read from the frozen
 * specification so the interface never defines its own. A governed method establishes
 * where and how to measure when the OEM prescribes no location; it never supplies an
 * acceptance value.
 */

import spec from "../../../../packages/domain/niret/gate-a-c1.spec.json";
import type { MeasurementKey } from "../../../../packages/domain/niret/types";

export interface GovernedMethod {
  id: string;
  title: string;
  appliesTo: string[];
  procedure: string;
  sources: string[];
}

export const GOVERNED_METHODS: readonly GovernedMethod[] = (spec.governed_measurement_methods as Array<{
  id: string; title: string; applies_to: string[]; procedure: string; sources: string[];
}>).map((method) => ({ id: method.id, title: method.title, appliesTo: method.applies_to, procedure: method.procedure, sources: method.sources }));

export function governedMethodFor(key: MeasurementKey): GovernedMethod | undefined {
  return GOVERNED_METHODS.find((method) => method.appliesTo.includes(key));
}
