/*
 * SIMULATION ONLY: Environmental Integrity Recorder for the simulated freezer.
 *
 * Append-only, hash-chained entries with recorder time, source time, sequence, source and
 * provenance. The sealed baseline is held separately and anchors the chain, so later observed
 * reality can never overwrite the last authorized state. Evidence gaps are recorded explicitly.
 * Entries are not signed and carry no trusted third-party time-stamp (stated limitation).
 */
import { canonical } from './canonical';
import { minuteToIso, sealBaseline, sha256, SIMULATION_LABEL, BASELINE, type AuthorizedBaseline } from './baseline';
import { entryBody, genesisHash, type EirEntry, type IncidentRecord } from './verify';

export class EnvironmentalIntegrityRecorder {
  readonly sealed: ReturnType<typeof sealBaseline>;
  private readonly chain: EirEntry[] = [];

  constructor(readonly scenarioId: string, baseline: AuthorizedBaseline = BASELINE) {
    this.sealed = sealBaseline(baseline);
  }

  append(minute: number, type: string, source: EirEntry['source'], independentOfController: boolean, payload: unknown, observedMinute: number | null = minute): EirEntry {
    const prevHash = this.chain.at(-1)?.entryHash ?? genesisHash(this.sealed.sealSha256);
    const body = { seq: this.chain.length, type, recordedAt: minuteToIso(minute), observedAt: observedMinute === null ? null : minuteToIso(observedMinute), source, independentOfController, payload, prevHash };
    const entry: EirEntry = { ...body, entryHash: sha256(canonical(entryBody({ ...body, entryHash: '' }))) };
    this.chain.push(Object.freeze(entry));
    return entry;
  }

  get entries(): readonly EirEntry[] { return this.chain; }
  count(type: string) { return this.chain.filter((e) => e.type === type).length; }

  export(): IncidentRecord {
    return {
      schema: 'ta14.rcb.incident-record.v1',
      label: SIMULATION_LABEL,
      scenarioId: this.scenarioId,
      sealedBaseline: this.sealed,
      entries: [...this.chain],
      chainHead: this.chain.at(-1)?.entryHash ?? genesisHash(this.sealed.sealSha256),
    };
  }
}
