/**
 * Frozen state-change invalidation (spec section "invalidation").
 *
 * Evidence expires by state change, not by elapsed clock. Every recorded
 * event restarts the OEM minimum run; the qualifying measurement set must be
 * taken after the restarted run has completed.
 */

import spec from "./gate-a-c1.spec.json";
import type { StateEventType } from "./types";

const EVENT_KEY: Readonly<Record<StateEventType, string>> = {
  FILTER_REPLACED_OR_REMOVED: "filter_replaced_or_removed",
  BLOWER_SETTING_CHANGED: "blower_setting_changed",
  DUCT_DAMPER_ZONING_CHANGE: "duct_damper_zoning_change",
  EVAPORATOR_COIL_CLEANED: "evaporator_coil_cleaned",
  CONDENSER_COIL_CLEANED: "condenser_coil_cleaned",
  PANELS_REMOVED: "panels_removed",
  THERMOSTAT_CONTROL_MODE_CHANGE: "thermostat_control_mode_change",
  COMPRESSOR_POWER_INTERRUPTED_OR_CYCLED: "compressor_power_interrupted_or_cycled",
  REFRIGERANT_CHARGE_CHANGED: "refrigerant_charge_changed",
  FREEZE_SWITCH_TRIP_OR_ICING: "freeze_switch_trip_or_icing",
  DEFROST_CYCLE: "defrost_cycle",
  REPAIR_OR_COMPONENT_REPLACEMENT: "repair_or_component_replacement",
  MATERIAL_WEATHER_OR_LOAD_CHANGE: "material_weather_or_load_change",
};

const EVENTS = spec.invalidation.events as Readonly<Record<string, readonly string[]>>;

export const STATE_EVENT_TYPES = Object.keys(EVENT_KEY) as StateEventType[];

/** Prerequisite (and policy) identifiers the frozen map says an event invalidates. */
export function invalidatedBy(type: StateEventType): readonly string[] {
  return EVENTS[EVENT_KEY[type]] ?? [];
}

/** Conditions that end the validity of any Gate-A determination. */
export function validityTerminatingConditions(): string[] {
  return STATE_EVENT_TYPES.map((type) => type);
}
