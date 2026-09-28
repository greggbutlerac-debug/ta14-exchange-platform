/**
 * s20 simulated Node source: a deterministic, read-only fixture adapter. It produces
 * raw observations under the s04 contract with acquisitionMethod=SIMULATED and
 * performs no physical action. It connects to no hardware.
 */
import { MS_PER_SECOND, parseInstant } from "./time";
import type { Channel, NodeObservation } from "./types";

/** Adapters map a source onto the Node contract. They only read. */
export interface NodeAdapter {
  readonly adapterVersion: string;
  read(): NodeObservation[];
}

export interface SimulatedStreamFixture {
  provider: string;
  deviceId: string;
  channel: Channel;
  unit: string;
  /** Raw fixture values, emitted in order. */
  values: number[];
  firstObservedAt: string;
  /** Fixture spacing between readings; a property of this fixture only. */
  spacingSeconds: number;
  firstSequence: number;
  location: NodeObservation["location"];
  instrument: NodeObservation["instrument"];
  accuracyOrUncertainty: NodeObservation["accuracyOrUncertainty"];
}

export const SIMULATED_ADAPTER_VERSION = "ta14-eie-simulated-node/1.0.0";

export class SimulatedNodeAdapter implements NodeAdapter {
  readonly adapterVersion = SIMULATED_ADAPTER_VERSION;
  readonly #fixture: SimulatedStreamFixture;

  constructor(fixture: SimulatedStreamFixture) {
    if (parseInstant(fixture.firstObservedAt) === null) throw new Error("fixture firstObservedAt must be zoned ISO 8601");
    this.#fixture = structuredClone(fixture);
  }

  read(): NodeObservation[] {
    const f = this.#fixture;
    const start = parseInstant(f.firstObservedAt)!;
    return f.values.map((value, index) => {
      const observedAt = new Date(start + index * f.spacingSeconds * MS_PER_SECOND).toISOString();
      const sequence = f.firstSequence + index;
      return {
        observationId: `SIM:${f.provider}:${f.deviceId}:${f.channel}:${sequence}`,
        channel: f.channel,
        source: { provider: f.provider, deviceId: f.deviceId },
        instrument: { ...f.instrument },
        location: { ...f.location, basis: { ...f.location.basis } },
        value,
        unit: f.unit,
        observedAt,
        receivedAt: observedAt,
        sequence,
        acquisitionMethod: "SIMULATED",
        accuracyOrUncertainty: f.accuracyOrUncertainty ? { ...f.accuracyOrUncertainty } : null,
        sourceQuality: "SIMULATED",
        adapterVersion: this.adapterVersion,
      };
    });
  }
}
