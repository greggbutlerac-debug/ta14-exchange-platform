"use client";

import type { ReactNode } from "react";

import type { MeasurementKey } from "../../../../packages/domain/niret/types";
import type { InstrumentKind, MeasurementEntry, NiretFormState, StaticDirection, TriState } from "../../lib/niret/form-state";
import { governedMethodFor } from "../../lib/niret/governed-methods";
import { unitFor } from "../../lib/niret/oem-reference";

export const nowIso = (): string => new Date().toISOString();

const KIND_FOR_UNIT: Readonly<Record<string, InstrumentKind>> = {
  F: "TEMPERATURE", PCT_RH: "HUMIDITY", IN_WC: "AIR_PRESSURE", CFM: "AIRFLOW", V: "VOLTAGE", A: "CURRENT",
};
export const kindForKey = (key: MeasurementKey): InstrumentKind => KIND_FOR_UNIT[unitFor(key)];

export const UNIT_LABEL: Readonly<Record<InstrumentKind, string>> = {
  TEMPERATURE: "°F", HUMIDITY: "% RH", AIR_PRESSURE: "in. w.c.", AIRFLOW: "CFM", VOLTAGE: "V", CURRENT: "A",
};

export function Section({ id, letter, title, hint, children }: { id: string; letter: string; title: string; hint?: string; children: ReactNode }) {
  return (
    <section id={id} className="nrSection">
      <header><span>{letter}</span><div><h2>{title}</h2>{hint && <p>{hint}</p>}</div></header>
      <div className="nrGrid">{children}</div>
    </section>
  );
}

export function TextField({ label, value, onChange, placeholder, wide }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; wide?: boolean }) {
  return (
    <label className={`nrField${wide ? " wide" : ""}`}>
      <span>{label}</span>
      <input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export function SelectField<T extends string>({ label, value, options, onChange, wide }: { label: string; value: T; options: Array<[T, string]>; onChange: (value: T) => void; wide?: boolean }) {
  return (
    <label className={`nrField${wide ? " wide" : ""}`}>
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value as T)}>
        {options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
      </select>
    </label>
  );
}

export function TriField({ label, value, onChange }: { label: string; value: TriState; onChange: (value: TriState) => void }) {
  return <SelectField label={label} value={value} onChange={onChange} options={[["", "Not established"], ["YES", "Yes"], ["NO", "No"]]} />;
}

export function CheckField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="nrCheck">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

export function TimeField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="nrField">
      <span>{label}</span>
      <div className="nrInline">
        <input value={value} placeholder="YYYY-MM-DDTHH:MM:SSZ" onChange={(event) => onChange(event.target.value)} />
        <button type="button" onClick={() => onChange(nowIso())}>Now</button>
      </div>
    </label>
  );
}

const emptyEntry = (): MeasurementEntry => ({ value: "", instrumentId: "", location: "", measuredAt: "" });

/**
 * One measurement: value, instrument, location, time. The value is evidence
 * only; this component never judges it. Attention messages come from the
 * engine's receipt.
 */
export function MeasurementField({
  form, measurementKey, label, attention, onChange, direction, onDirection,
}: {
  form: NiretFormState;
  measurementKey: MeasurementKey;
  label: string;
  attention: string[];
  onChange: (entry: MeasurementEntry) => void;
  direction?: StaticDirection;
  onDirection?: (direction: StaticDirection) => void;
}) {
  const entry = form.measurements[measurementKey] ?? emptyEntry();
  const kind = kindForKey(measurementKey);
  const instruments = form.instruments.filter((row) => row.kind === kind);
  const oemLocation = form.oem.locations[measurementKey] ?? "";
  const method = governedMethodFor(measurementKey);
  const update = (patch: Partial<MeasurementEntry>) => onChange({ ...entry, ...patch });
  return (
    <div id={`field-${measurementKey}`} className={`nrMeasure${attention.length ? " attention" : ""}`}>
      <div className="nrMeasureHead"><b>{label}</b><small>{UNIT_LABEL[kind]}{onDirection ? " · magnitude" : ""}</small></div>
      <div className="nrMeasureRow">
        <input
          inputMode="decimal"
          aria-label={`${label} value`}
          value={entry.value}
          placeholder="value"
          onChange={(event) => update({ value: event.target.value, measuredAt: event.target.value.trim() === "" ? "" : entry.measuredAt || nowIso() })}
        />
        {onDirection && (
          <select aria-label={`${label} direction`} value={direction ?? ""} onChange={(event) => onDirection(event.target.value as StaticDirection)}>
            <option value="">Direction?</option>
            <option value="BELOW_AMBIENT">Below ambient (−)</option>
            <option value="ABOVE_AMBIENT">Above ambient (+)</option>
          </select>
        )}
        <select aria-label={`${label} instrument`} value={entry.instrumentId} onChange={(event) => update({ instrumentId: event.target.value })}>
          <option value="">Instrument…</option>
          {instruments.map((row) => <option key={row.id} value={row.id}>{row.id}</option>)}
        </select>
      </div>
      <div className="nrMeasureRow">
        <input aria-label={`${label} location`} value={entry.location} placeholder={oemLocation ? `OEM location: ${oemLocation}` : "Measurement location"} onChange={(event) => update({ location: event.target.value })} />
        {method && (
          <label className="nrCheck" title={`${method.procedure} Sources: ${method.sources.join("; ")}`}>
            <input type="checkbox" checked={entry.governedMethod === true} onChange={(event) => update({ governedMethod: event.target.checked })} />
            Measured per TA-14 governed method {method.id} ({method.title}) — applies only where the OEM prescribes no location
          </label>
        )}
        {oemLocation && entry.location !== oemLocation && <button type="button" onClick={() => update({ location: oemLocation })}>Use OEM location</button>}
      </div>
      <div className="nrMeasureRow">
        <input aria-label={`${label} time`} value={entry.measuredAt} placeholder="Time taken" onChange={(event) => update({ measuredAt: event.target.value })} />
        <button type="button" onClick={() => update({ measuredAt: nowIso() })}>Now</button>
      </div>
      {attention.length > 0 && <ul className="nrAttention">{attention.map((reason) => <li key={reason}>{reason}</li>)}</ul>}
    </div>
  );
}
