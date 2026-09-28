/**
 * The frozen s05 Analyzer calculation catalogue, as function descriptors.
 *
 * Only "declared window statistics" has an implementation in Phase 2A. Psychrometric and
 * refrigerant-property calculations need a possessed, activated governing reference (G1): none exists,
 * so no equation is implemented and every such request is CALCULATION NOT ESTABLISHED.
 */
import type { CalculationFunction } from "./contract";
import { windowStatistics } from "./functions/window-statistics";
import { WINDOW_STATISTICS_IMPLEMENTATION } from "./implementations";

const unimplemented = (functionId: string, catalogueItem: string, role: CalculationFunction["role"], requiresSaturationConvention = false): CalculationFunction => ({
  functionId, functionVersion: "0.0.0-unimplemented", catalogueItem, role, synthetic: false, inputs: null,
  requiresSaturationConvention, implementation: null, compute: null,
});

export const WINDOW_STATISTICS_FUNCTION: CalculationFunction = Object.freeze({
  functionId: "EIE-FN-WINDOW-STATISTICS",
  functionVersion: "1.0.0",
  catalogueItem: "declared window statistics",
  role: "WINDOW_STATISTICS",
  synthetic: false,
  inputs: [{ name: "series", kind: "WINDOW_CHANNEL" as const }],
  requiresSaturationConvention: false,
  implementation: WINDOW_STATISTICS_IMPLEMENTATION,
  compute: windowStatistics,
});

export const EIE_CALCULATION_CATALOGUE: readonly CalculationFunction[] = Object.freeze([
  unimplemented("EIE-FN-HUMIDITY-RATIO", "humidity ratio", "PSYCHROMETRIC_PROPERTIES"),
  unimplemented("EIE-FN-ENTHALPY", "enthalpy", "PSYCHROMETRIC_PROPERTIES"),
  unimplemented("EIE-FN-DEW-POINT", "dew point", "PSYCHROMETRIC_PROPERTIES"),
  unimplemented("EIE-FN-AIR-MASS-FLOW", "air mass flow from governed airflow evidence", "PSYCHROMETRIC_PROPERTIES"),
  unimplemented("EIE-FN-HEAT-RATES", "sensible, latent and total heat rate", "PSYCHROMETRIC_PROPERTIES"),
  unimplemented("EIE-FN-MOISTURE-REMOVAL-RATE", "moisture removal rate", "PSYCHROMETRIC_PROPERTIES"),
  unimplemented("EIE-FN-SATURATION-TEMPERATURE", "refrigerant saturation temperature from pressure", "REFRIGERANT_PROPERTIES", true),
  unimplemented("EIE-FN-SUPERHEAT", "superheat", "REFRIGERANT_PROPERTIES", true),
  unimplemented("EIE-FN-SUBCOOLING", "subcooling", "REFRIGERANT_PROPERTIES", true),
  WINDOW_STATISTICS_FUNCTION,
]);
