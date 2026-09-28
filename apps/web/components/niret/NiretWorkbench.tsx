"use client";

import { useState } from "react";

import { buildCurationRequest } from "../../lib/niret/curation-request";

import type { MeasurementKey, StateEventType } from "../../../../packages/domain/niret/types";
import { buildGateAInput } from "../../lib/niret/evidence-adapter";
import { emptyNiretForm, type MeasurementEntry, type NiretFormState, type RangeEntry } from "../../lib/niret/form-state";
import { STATE_EVENT_LABELS } from "../../lib/niret/labels";
import { BOUNDARY_NOTICE, fieldMessages } from "../../lib/niret/presentation";
import { CheckField, MeasurementField, nowIso, Section, SelectField, TextField, TimeField, TriField, UNIT_LABEL } from "./NiretFields";
import { DeterminationPanel, ReceiptPanel, type EvaluationResponse } from "./NiretResult";

const BASIS_OPTIONS: Array<[string, string]> = [
  ["NONINVASIVE_EVIDENCE", "Measured non-invasive evidence"],
  ["POST_CHARGE_CHANGE_OR_REPAIR_VERIFICATION", "Verification after a logged charge change or refrigerant-circuit repair"],
  ["CUSTOMER_CLAIM", "Customer says it needs refrigerant"],
  ["PRIOR_TECHNICIAN_CLAIM", "Previous technician's statement"],
  ["SERVICE_HISTORY", "Service history"],
  ["SYSTEMS_ARE_ALWAYS_LOW", "\"These systems are always low\""],
  ["GAUGE_AVAILABLE", "Gauges are available"],
  ["TIME_OR_DISPATCH_PRESSURE", "Time or dispatch pressure"],
  ["REFRIGERATION_CYCLE_KNOWLEDGE", "Refrigeration-cycle knowledge"],
  ["RH_ALONE", "Indoor humidity alone"],
];

const LOCATION_KEYS: Array<[MeasurementKey, string]> = [
  ["returnDryBulb", "Return dry bulb"], ["returnWetBulb", "Return wet bulb"], ["returnRh", "Return RH"],
  ["supplyDryBulb", "Supply dry bulb"], ["supplyWetBulb", "Supply wet bulb"], ["supplyRh", "Supply RH"],
  ["outdoorDryBulb", "Outdoor dry bulb"], ["outdoorWetBulb", "Outdoor wet bulb"], ["outdoorRh", "Outdoor RH"],
  ["returnStatic", "Return static"], ["supplyStatic", "Supply static"],
  ["suctionLineTemp", "Suction-line surface"], ["liquidLineTemp", "Liquid-line surface"],
];

export default function NiretWorkbench() {
  const [form, setForm] = useState<NiretFormState>(emptyNiretForm);
  const [response, setResponse] = useState<EvaluationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [newEvent, setNewEvent] = useState<StateEventType>("FILTER_REPLACED_OR_REMOVED");
  const [curationCopied, setCurationCopied] = useState(false);
  const copyCurationRequest = async () => {
    await navigator.clipboard.writeText(JSON.stringify(buildCurationRequest(form, nowIso()), null, 2));
    setCurationCopied(true);
  };

  const patch = (change: (draft: NiretFormState) => void) =>
    setForm((previous) => { const draft = structuredClone(previous); change(draft); return draft; });

  /** Engine-reported findings for a field, in plain language with the canonical code. */
  const attention = (key: string): string[] =>
    response ? fieldMessages(response.findings, key).map((item) => `${item.message} [${item.code}]`) : [];

  const measure = (key: MeasurementKey, label: string) => (
    <MeasurementField
      key={key} form={form} measurementKey={key} label={label} attention={attention(key)}
      onChange={(entry: MeasurementEntry) => patch((draft) => { draft.measurements[key] = entry; })}
      {...(key === "returnStatic" || key === "supplyStatic"
        ? { direction: form.staticDirection[key], onDirection: (direction) => patch((draft) => { draft.staticDirection[key] = direction; }) }
        : {})}
    />
  );

  const rangeFields = (label: string, unit: string, get: (state: NiretFormState) => RangeEntry) => (
    <div className="nrRange" key={label}>
      <b>{label} <small>({unit})</small></b>
      <div className="nrMeasureRow">
        <input aria-label={`${label} min`} placeholder="OEM min" value={get(form).min} onChange={(event) => patch((draft) => { get(draft).min = event.target.value; })} />
        <input aria-label={`${label} max`} placeholder="OEM max" value={get(form).max} onChange={(event) => patch((draft) => { get(draft).max = event.target.value; })} />
      </div>
      <input aria-label={`${label} reference`} placeholder="Chart / table / page" value={get(form).ref} onChange={(event) => patch((draft) => { get(draft).ref = event.target.value; })} />
    </div>
  );

  async function evaluate(pressureSideEntry: NiretFormState["pressureSideEntry"] = form.pressureSideEntry) {
    setBusy(true);
    setError(null);
    const submission = { ...form, pressureSideEntry };
    try {
      const result = await fetch("/api/niret/gate-a/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: buildGateAInput(submission, { requestId: `NIRET-${crypto.randomUUID()}` }),
        }),
      });
      const payload = await result.json();
      if (!result.ok) throw new Error(payload.error ?? `Evaluator returned ${result.status}`);
      setResponse(payload as EvaluationResponse);
      document.getElementById("niret-result")?.scrollIntoView({ behavior: "smooth" });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Evaluation failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="nrPage">
      <div className="nrShell">
        <header className="nrHero">
          <small>TA-14 ACADEMY · HVACD/R · NIRET GATE A · TA-14-NIRET-GA-C1</small>
          <h1>Pressure-instrument entry check</h1>
          <p>Enter what you measured and observed. The Gate-A engine — not this form — decides whether connecting pressure instruments is justified. A complete form can still return HOLD, DENY, or ESCALATE. Leave fields that do not apply empty.</p>
          <div className="nrBoundary">{BOUNDARY_NOTICE}</div>
        </header>

        <Section id="job" letter="0" title="Technician & authority">
          <TextField label="Technician ID" value={form.job.technicianId} onChange={(v) => patch((d) => { d.job.technicianId = v; })} />
          <SelectField label="EPA 608 certification" value={form.job.certificationStatus} onChange={(v) => patch((d) => { d.job.certificationStatus = v; })}
            options={[["", "Not provided"], ["CERTIFIED", "Certified"], ["SUPERVISED_APPRENTICE", "Supervised apprentice"], ["NOT_CERTIFIED", "Not certified"]]} />
          <SelectField label={form.job.certificationStatus === "SUPERVISED_APPRENTICE" ? "Supervisor certification type" : "Certification type"} value={form.job.certificationType}
            onChange={(v) => patch((d) => { d.job.certificationType = v; })}
            options={[["", "—"], ["TYPE_I", "Type I"], ["TYPE_II", "Type II"], ["TYPE_III", "Type III"], ["UNIVERSAL", "Universal"]]} />
          <TextField label={form.job.certificationStatus === "SUPERVISED_APPRENTICE" ? "Supervisor certificate #" : "Certificate #"} value={form.job.certificateRef} onChange={(v) => patch((d) => { d.job.certificateRef = v; })} />
          <SelectField label="How is this certification supplied?" value={form.job.certificationAssurance} onChange={(v) => patch((d) => { d.job.certificationAssurance = v; })}
            options={[["DECLARED", "Declared by technician"], ["DOCUMENTED", "Documented (card/record on file)"]]} />
          <p className="nrHint wide">Entering a certificate number declares it; it does not verify it. Verification must come from an independent source. None is connected in this version, so Gate A will not treat the certification as verified.</p>
          <p className="nrHint wide">Work scope, site permission and jurisdiction below are your declarations. They don't affect the technical NIRET answer. A declared restriction (for example, permission withheld) blocks execution, but a declaration never grants authority.</p>
          <TextField label="Work order / scope ref" value={form.job.workScopeRef} onChange={(v) => patch((d) => { d.job.workScopeRef = v; })} />
          <TriField label="Work scope includes diagnosis" value={form.job.workScopeIncludesDiagnosis} onChange={(v) => patch((d) => { d.job.workScopeIncludesDiagnosis = v; })} />
          <SelectField label="Site permission" value={form.job.sitePermission} onChange={(v) => patch((d) => { d.job.sitePermission = v; })}
            options={[["", "Not confirmed"], ["GRANTED", "Granted"], ["WITHHELD", "Withheld"], ["UNCONFIRMED", "Unconfirmed"]]} />
          <SelectField label="Jurisdictional authorization" value={form.job.jurisdiction} onChange={(v) => patch((d) => { d.job.jurisdiction = v; })}
            options={[["", "Not confirmed"], ["NOT_REQUIRED", "Not required"], ["CONFIRMED", "Confirmed"], ["UNCONFIRMED", "Unconfirmed"]]} />
          <SelectField label="Safety" value={form.job.hazard} onChange={(v) => patch((d) => { d.job.hazard = v; })}
            options={[["", "Not assessed"], ["NONE_IDENTIFIED", "No hazard identified"], ["CORRECTABLE_HAZARD", "Correctable hazard"], ["BEYOND_COMPETENCE", "Hazard beyond my competence"]]} />
          <TextField wide label="What refrigerant-charge question are you trying to answer?" value={form.job.statedProposition} onChange={(v) => patch((d) => { d.job.statedProposition = v; })} />
          <fieldset className="nrBasis wide">
            <legend>Basis for wanting pressure evidence (select all that apply)</legend>
            {BASIS_OPTIONS.map(([code, label]) => (
              <CheckField key={code} label={label} checked={form.job.statedBasis.includes(code)}
                onChange={(checked) => patch((d) => { d.job.statedBasis = checked ? [...d.job.statedBasis, code] : d.job.statedBasis.filter((item) => item !== code); })} />
            ))}
          </fieldset>
        </Section>

        <Section id="equipment" letter="A" title="Equipment" hint="Identity, refrigerant, metering device, capacity, and the OEM document you are using.">
          <TextField label="Nameplate manufacturer" value={form.equipment.manufacturer} onChange={(v) => patch((d) => { d.equipment.manufacturer = v; })} />
          <TextField label="Indoor model" value={form.equipment.indoorModel} onChange={(v) => patch((d) => { d.equipment.indoorModel = v; })} />
          <TextField label="Outdoor model" value={form.equipment.outdoorModel} onChange={(v) => patch((d) => { d.equipment.outdoorModel = v; })} />
          <TriField label="Pairing matches OEM documentation (declared)" value={form.equipment.pairingVerified} onChange={(v) => patch((d) => { d.equipment.pairingVerified = v; if (v === "YES" && !d.equipment.verifiedAt) d.equipment.verifiedAt = nowIso(); })} />
          <TriField label="Identity establishable from OEM docs" value={form.equipment.identityEstablishableFromOem} onChange={(v) => patch((d) => { d.equipment.identityEstablishableFromOem = v; })} />
          <SelectField label="System configuration" value={form.equipment.configuration} onChange={(v) => patch((d) => { d.equipment.configuration = v; })}
            options={[["", "Not established"], ["DUCTED_SPLIT", "Ducted split"], ["DUCTLESS", "Ductless"], ["MINI_SPLIT", "Mini-split"], ["MULTI_SPLIT", "Multi-split"], ["PACKAGED", "Packaged"], ["UNKNOWN", "Unknown"]]} />
          <SelectField label="Compressor staging" value={form.equipment.compressorStaging} onChange={(v) => patch((d) => { d.equipment.compressorStaging = v; })}
            options={[["", "Not established"], ["SINGLE_STAGE", "Single-stage"], ["TWO_STAGE", "Two-stage"], ["INVERTER", "Inverter"], ["UNKNOWN", "Unknown"]]} />
          <TextField label="Nominal capacity (Btu/h) — context only" value={form.equipment.nominalCapacityBtuh} onChange={(v) => patch((d) => { d.equipment.nominalCapacityBtuh = v; })} />
          <TextField label="Refrigerant (nameplate)" placeholder="as printed on the nameplate" value={form.refrigerant.declared} onChange={(v) => patch((d) => { d.refrigerant.declared = v; })} />
          <SelectField label="Refrigerant safety class" value={form.refrigerant.safetyClass} onChange={(v) => patch((d) => { d.refrigerant.safetyClass = v; })}
            options={[["", "Not established"], ["A1", "A1"], ["A2L", "A2L"], ["A2", "A2"], ["A3", "A3"], ["B1", "B1"], ["B2L", "B2L"], ["B2", "B2"], ["B3", "B3"], ["UNKNOWN", "Unknown"]]} />
          <CheckField label="Red A2L markings on ports/pipes/hoses" checked={form.refrigerant.a2lMarkingsObserved} onChange={(v) => patch((d) => { d.refrigerant.a2lMarkingsObserved = v; })} />
          <CheckField label="Flammable-refrigerant labels" checked={form.refrigerant.flammableLabelsObserved} onChange={(v) => patch((d) => { d.refrigerant.flammableLabelsObserved = v; })} />
          <CheckField label="Mixed/contaminated refrigerant suspected" checked={form.refrigerant.integritySuspect} onChange={(v) => patch((d) => { d.refrigerant.integritySuspect = v; })} />
          <SelectField label="Metering device" value={form.metering.type} onChange={(v) => patch((d) => { d.metering.type = v; })}
            options={[["", "Not established"], ["FIXED_ORIFICE", "Fixed orifice / piston"], ["CAPILLARY_TUBE", "Capillary tube"], ["TXV", "TXV"], ["EEV", "EEV"], ["UNKNOWN", "Unknown"]]} />
          <SelectField label="Metering device identified by" value={form.metering.evidenceBasis} onChange={(v) => patch((d) => { d.metering.evidenceBasis = v; if (v && !d.metering.verifiedAt) d.metering.verifiedAt = nowIso(); })}
            options={[["", "Not established"], ["DIRECT_OBSERVATION", "Direct observation"], ["CONFIGURATION_DOCUMENT", "Configuration document"], ["INFERRED_FROM_PRESSURE", "Inferred from pressure"], ["NONE", "Not identified"]]} />
          <TriField label="Metering device establishable from OEM docs" value={form.metering.establishableFromOem} onChange={(v) => patch((d) => { d.metering.establishableFromOem = v; })} />

          <h3 className="wide">OEM reference (manual transcription — transcribe exactly; never estimate)</h3>
          <TextField label="Manufacturer" value={form.oem.manufacturer} onChange={(v) => patch((d) => { d.oem.manufacturer = v; })} />
          <TextField label="Model (as documented)" value={form.oem.model} onChange={(v) => patch((d) => { d.oem.model = v; })} />
          <TextField label="Document (title / number)" value={form.oem.document} onChange={(v) => patch((d) => { d.oem.document = v; })} />
          <TextField label="Revision / publication date" value={form.oem.revision} onChange={(v) => patch((d) => { d.oem.revision = v; })} />
          <TextField label="Page / chart / table" value={form.oem.section} onChange={(v) => patch((d) => { d.oem.section = v; })} />
          <TextField label="Source (URL, file, or reference)" value={form.oem.sourceRef} onChange={(v) => patch((d) => { d.oem.sourceRef = v; })} />
          <p className="nrHint wide">If the governed OEM registry holds an independently reviewed record for this exact manufacturer and indoor/outdoor combination, Gate A uses that record and ignores the values below. Otherwise your entries are recorded as a transcription: evaluated against your measurements, but never enough on their own for an ALLOW. You can send them to curators as a curation request.</p>
          <div className="wide nrActions">
            <button type="button" className="nrSecondary" onClick={() => void copyCurationRequest()}>{curationCopied ? "Curation request copied" : "Copy OEM curation request"}</button>
            <p>A curation request is not an OEM record and is never verified. Curators must obtain and hash the manufacturer document and have the record independently reviewed.</p>
          </div>
          <SelectField label="OEM charging method" value={form.oem.chargingMethodStatus} onChange={(v) => patch((d) => { d.oem.chargingMethodStatus = v; })}
            options={[["", "Not obtained"], ["IDENTIFIED", "Identified"], ["NOT_OBTAINED", "Not obtained"]]} />
          {form.oem.chargingMethodStatus === "IDENTIFIED"
            ? <TextField label="Charging method reference" value={form.oem.chargingMethodRef} onChange={(v) => patch((d) => { d.oem.chargingMethodRef = v; })} />
            : <TriField label="Charging method obtainable" value={form.oem.chargingMethodObtainable} onChange={(v) => patch((d) => { d.oem.chargingMethodObtainable = v; })} />}
          <CheckField label="OEM procedure needs a tool/mode I don't have" checked={form.oem.requiresUnavailableToolOrMode} onChange={(v) => patch((d) => { d.oem.requiresUnavailableToolOrMode = v; })} />
          {rangeFields("OEM airflow range", "CFM", (s) => s.oem.airflow)}
          {rangeFields("OEM external static range", "in. w.c.", (s) => s.oem.esp)}
          {rangeFields("OEM outdoor ambient envelope", "°F", (s) => s.oem.ambient)}
          {rangeFields("OEM voltage range (if specified)", "V", (s) => s.oem.voltage)}
          <TextField label="OEM minimum run before measuring (minutes)" value={form.oem.minRunMinutes} onChange={(v) => patch((d) => { d.oem.minRunMinutes = v; })} />
          <TextField label="Minimum run reference" value={form.oem.minRunRef} onChange={(v) => patch((d) => { d.oem.minRunRef = v; })} />
          <TriField label="OEM permits table method with ECM" value={form.oem.permitsEcmWithTableMethod} onChange={(v) => patch((d) => { d.oem.permitsEcmWithTableMethod = v; })} />
          <SelectField label="OEM non-invasive criterion" value={form.oem.criterionStatus} onChange={(v) => patch((d) => { d.oem.criterionStatus = v; })}
            options={[["", "Not obtained"], ["PUBLISHED", "Published for this model"], ["NOT_OBTAINED", "Not obtained"]]} />
          {form.oem.criterionStatus === "PUBLISHED" ? (
            <>
              <SelectField label="Criterion is based on" value={form.oem.criterionDerivation} onChange={(v) => patch((d) => { d.oem.criterionDerivation = v; })}
                options={[["", "Select"], ["RETURN_MINUS_SUPPLY_DRY_BULB", "Return − supply dry bulb"], ["RETURN_MINUS_SUPPLY_WET_BULB", "Return − supply wet bulb"], ["SINGLE_MEASUREMENT", "A single measurement"]]} />
              {form.oem.criterionDerivation === "SINGLE_MEASUREMENT" && (
                <SelectField label="Criterion measurement" value={form.oem.criterionMeasurement} onChange={(v) => patch((d) => { d.oem.criterionMeasurement = v; })}
                  options={[["", "Select"], ...LOCATION_KEYS]} />
              )}
              {rangeFields("OEM criterion range (applicable to current conditions)", "per criterion", (s) => s.oem.criterion)}
            </>
          ) : (
            <TriField label="Criterion obtainable" value={form.oem.criterionObtainable} onChange={(v) => patch((d) => { d.oem.criterionObtainable = v; })} />
          )}
          <details className="wide nrDetails">
            <summary>OEM measurement locations</summary>
            <div className="nrGrid">
              {LOCATION_KEYS.map(([key, label]) => (
                <TextField key={key} label={label} value={form.oem.locations[key] ?? ""} onChange={(v) => patch((d) => { d.oem.locations[key] = v; })} />
              ))}
            </div>
          </details>
          <details className="wide nrDetails">
            <summary>OEM stability criterion (only if the OEM specifies one)</summary>
            <div className="nrGrid">
              <SelectField label="Variable" value={form.oem.stabilityMeasurement} onChange={(v) => patch((d) => { d.oem.stabilityMeasurement = v; })} options={[["", "None specified"], ...LOCATION_KEYS]} />
              <TextField label="Maximum change" value={form.oem.stabilityMaxChange} onChange={(v) => patch((d) => { d.oem.stabilityMaxChange = v; })} />
              <TextField label="Reference" value={form.oem.stabilityRef} onChange={(v) => patch((d) => { d.oem.stabilityRef = v; })} />
            </div>
          </details>
        </Section>

        <Section id="operating" letter="B" title="Operating condition" hint="Mode, compressor and blower state, stabilization, and anything that changed the system state.">
          <SelectField label="Mode" value={form.equipment.mode} onChange={(v) => patch((d) => { d.equipment.mode = v; })} options={[["", "Not established"], ["COOLING", "Cooling"], ["HEATING", "Heating"], ["UNKNOWN", "Unknown"]]} />
          <TriField label="Compressor running steadily" value={form.operation.compressorRunningSteadily} onChange={(v) => patch((d) => { d.operation.compressorRunningSteadily = v; })} />
          <TimeField label="Run started" value={form.operation.runStartedAt} onChange={(v) => patch((d) => { d.operation.runStartedAt = v; })} />
          <TextField label="Blower operating evidence" value={form.observations.blowerOperatingEvidence} onChange={(v) => patch((d) => { d.observations.blowerOperatingEvidence = v; })} />
          <div className="wide nrLog">
            <b>State changes since the run started</b>
            <div className="nrMeasureRow">
              <select aria-label="State change type" value={newEvent} onChange={(event) => setNewEvent(event.target.value as StateEventType)}>
                {Object.entries(STATE_EVENT_LABELS).map(([type, label]) => <option key={type} value={type}>{label}</option>)}
              </select>
              <button type="button" onClick={() => patch((d) => { d.events.push({ type: newEvent, at: nowIso(), affectsIdentity: false }); })}>Log now</button>
            </div>
            <ul>
              {form.events.map((event, index) => (
                <li key={`${event.type}-${event.at}`}>
                  {STATE_EVENT_LABELS[event.type]} · {event.at}
                  {event.type === "REPAIR_OR_COMPONENT_REPLACEMENT" && (
                    <>
                      <CheckField label="Affected identity or metering device" checked={event.affectsIdentity} onChange={(v) => patch((d) => { d.events[index].affectsIdentity = v; })} />
                      <CheckField label="Repair affected the refrigerant circuit" checked={event.affectsRefrigerantCircuit === true} onChange={(v) => patch((d) => { d.events[index].affectsRefrigerantCircuit = v; })} />
                    </>
                  )}
                  <button type="button" onClick={() => patch((d) => { d.events.splice(index, 1); })}>Remove</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="wide nrLog">
            <b>Corrections made before Gate A</b>
            <button type="button" onClick={() => patch((d) => { d.corrections.push({ at: nowIso(), declaredFinding: "", authorityRef: "", beforeRecordRef: "", correctionDescription: "", afterRecordRef: "", rebaselinedAt: "" }); })}>Add correction</button>
            {form.corrections.map((correction, index) => (
              <div className="nrGrid nrCard" key={`${correction.at}-${index}`}>
                <TextField label="Finding" value={correction.declaredFinding} onChange={(v) => patch((d) => { d.corrections[index].declaredFinding = v; })} />
                <TextField label="Authority ref" value={correction.authorityRef} onChange={(v) => patch((d) => { d.corrections[index].authorityRef = v; })} />
                <TextField label="Before record ref" value={correction.beforeRecordRef} onChange={(v) => patch((d) => { d.corrections[index].beforeRecordRef = v; })} />
                <TextField label="Correction" value={correction.correctionDescription} onChange={(v) => patch((d) => { d.corrections[index].correctionDescription = v; })} />
                <TextField label="After record ref" value={correction.afterRecordRef} onChange={(v) => patch((d) => { d.corrections[index].afterRecordRef = v; })} />
                <TimeField label="Re-baselined at" value={correction.rebaselinedAt} onChange={(v) => patch((d) => { d.corrections[index].rebaselinedAt = v; })} />
              </div>
            ))}
          </div>
          <SelectField label="Evaporator ice" value={form.evaporator.iceStatus} onChange={(v) => patch((d) => { d.evaporator.iceStatus = v; d.evaporator.iceObservedAt = v ? nowIso() : ""; })}
            options={[["", "Not observed"], ["NO_ICE", "No ice"], ["ICE_PRESENT", "Ice present"], ["UNDETERMINED", "Undetermined"]]} />
          <TimeField label="Evaporator observed at" value={form.evaporator.iceObservedAt} onChange={(v) => patch((d) => { d.evaporator.iceObservedAt = v; })} />
          <CheckField label="Icing occurred on this call" checked={form.evaporator.icingOccurred} onChange={(v) => patch((d) => { d.evaporator.icingOccurred = v; })} />
          {form.evaporator.icingOccurred && (
            <div className="wide nrCard">
              <b>TA-14 ice restoration (all six required)</b>
              {([
                ["iceCompletelyRemoved", "Ice completely removed"],
                ["causeInvestigated", "Cause of icing investigated"],
                ["airflowAndHeatTransferReestablished", "Airflow and heat transfer re-established"],
                ["returnedToOperatingEnvelope", "Returned to the valid operating envelope"],
                ["steadyStateReestablished", "Steady state re-established"],
                ["freshMeasurementSetObtained", "Fresh measurement set obtained"],
              ] as const).map(([key, label]) => (
                <CheckField key={key} label={label} checked={form.evaporator.restoration[key]} onChange={(v) => patch((d) => { d.evaporator.restoration[key] = v; })} />
              ))}
              <SelectField label="Icing cause" value={form.evaporator.restoration.causeDisposition} onChange={(v) => patch((d) => { d.evaporator.restoration.causeDisposition = v; })}
                options={[["", "Not recorded"], ["CORRECTED", "Corrected"], ["BOUNDED", "Explicitly bounded"], ["UNRESOLVED", "Unresolved"]]} />
              <TimeField label="Restoration completed" value={form.evaporator.restoration.completedAt} onChange={(v) => patch((d) => { d.evaporator.restoration.completedAt = v; })} />
            </div>
          )}
          {form.oem.stabilityMeasurement && (
            <div className="wide nrLog">
              <b>Stability readings ({form.oem.stabilityMeasurement})</b>
              <button type="button" onClick={() => patch((d) => { d.stabilityReadings.push({ value: "", instrumentId: "", location: d.oem.locations[d.oem.stabilityMeasurement as MeasurementKey] ?? "", measuredAt: nowIso() }); })}>Add reading</button>
              {form.stabilityReadings.map((reading, index) => (
                <div className="nrMeasureRow" key={`${reading.measuredAt}-${index}`}>
                  <input aria-label="Stability reading value" value={reading.value} placeholder="value" onChange={(event) => patch((d) => { d.stabilityReadings[index].value = event.target.value; })} />
                  <select aria-label="Stability reading instrument" value={reading.instrumentId} onChange={(event) => patch((d) => { d.stabilityReadings[index].instrumentId = event.target.value; })}>
                    <option value="">Instrument…</option>
                    {form.instruments.map((row) => <option key={row.id} value={row.id}>{row.id}</option>)}
                  </select>
                  <span>{reading.measuredAt}</span>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section id="airflow" letter="C" title="Airflow / static" hint="Enter static as magnitude and direction. Gate A derives TESP from the raw readings.">
          <SelectField label="Airflow method" value={form.airflowMethod.method} onChange={(v) => patch((d) => { d.airflowMethod.method = v; })}
            options={[["", "Not established"], ["OEM_SPECIFIED_METHOD", "OEM-specified method"], ["OEM_CFM_ESP_TABLE", "OEM CFM/ESP table"], ["DUCT_TRAVERSE", "Duct traverse"], ["FLOW_GRID", "Flow grid"], ["PRESSURE_MATCHING", "Pressure matching"], ["TEMPERATURE_RISE", "Temperature rise"]]} />
          <SelectField label="Blower motor" value={form.airflowMethod.motorType} onChange={(v) => patch((d) => { d.airflowMethod.motorType = v; })}
            options={[["", "Not established"], ["PSC", "PSC"], ["ECM", "ECM"], ["OTHER", "Other"], ["UNKNOWN", "Unknown"]]} />
          <TriField label="Filter, coil, and fan clean (table method / OEM operating point)" value={form.airflowMethod.componentsClean} onChange={(v) => patch((d) => { d.airflowMethod.componentsClean = v; })} />
          <TextField label="Installed blower setting (exactly as the OEM labels it, e.g. Tap 3 or NORMAL)" value={form.airflowMethod.blowerSetting ?? ""} onChange={(v) => patch((d) => { d.airflowMethod.blowerSetting = v; })} />
          {measure("airflow", "Established airflow")}
          {measure("returnStatic", "Return static")}
          {measure("supplyStatic", "Supply static")}
        </Section>

        <Section id="air" letter="D" title="Air conditions" hint="Wet bulb or RH as your instrument supports. Outdoor wet bulb/RH only where applicable.">
          {measure("returnDryBulb", "Return / entering dry bulb")}
          {measure("returnWetBulb", "Return / entering wet bulb")}
          {measure("returnRh", "Return / entering RH")}
          {measure("supplyDryBulb", "Supply / leaving dry bulb")}
          {measure("supplyWetBulb", "Supply / leaving wet bulb")}
          {measure("supplyRh", "Supply / leaving RH")}
          {measure("outdoorDryBulb", "Outdoor dry bulb (condenser entering)")}
          {measure("outdoorWetBulb", "Outdoor wet bulb")}
          {measure("outdoorRh", "Outdoor RH")}
        </Section>

        <Section id="lines" letter="E" title="Non-invasive refrigerant-side evidence" hint="Surface temperatures only. No pressure readings belong on this form.">
          {measure("suctionLineTemp", "Suction-line surface temperature")}
          {measure("liquidLineTemp", "Liquid-line surface temperature")}
          <TextField wide label="Leak indications observed (recorded, not evaluated)" value={form.observations.leakIndications} onChange={(v) => patch((d) => { d.observations.leakIndications = v; })} />
        </Section>

        <Section id="electrical" letter="F" title="Electrical, heat rejection & instruments">
          {measure("supplyVoltage", "Supply voltage")}
          {measure("compressorCurrent", "Compressor current")}
          {measure("blowerCurrent", "Blower current")}
          <TriField label="Condenser panels in place" value={form.condenser.panelsInPlace} onChange={(v) => patch((d) => { d.condenser.panelsInPlace = v; d.condenser.observedAt = nowIso(); })} />
          <SelectField label="Condenser coil" value={form.condenser.coilCondition} onChange={(v) => patch((d) => { d.condenser.coilCondition = v; d.condenser.observedAt = nowIso(); })}
            options={[["", "Not observed"], ["CLEAR", "Clear"], ["PARTIAL_OBSTRUCTION", "Partial obstruction"], ["MATERIALLY_RESTRICTED", "Materially restricted"], ["UNDETERMINED", "Undetermined"]]} />
          <TriField label="Condenser fan operating" value={form.condenser.fanOperating} onChange={(v) => patch((d) => { d.condenser.fanOperating = v; d.condenser.observedAt = nowIso(); })} />
          <TimeField label="Condenser observed at" value={form.condenser.observedAt} onChange={(v) => patch((d) => { d.condenser.observedAt = v; })} />
          <TextField label="Filter condition (recorded)" value={form.observations.filterCondition} onChange={(v) => patch((d) => { d.observations.filterCondition = v; })} />
          <TextField label="Compressor operating evidence (recorded)" value={form.observations.compressorOperatingEvidence} onChange={(v) => patch((d) => { d.observations.compressorOperatingEvidence = v; })} />
          <div className="wide nrLog">
            <b>Measurement instruments</b>
            <button type="button" onClick={() => patch((d) => { d.instruments.push({ id: `INST-${d.instruments.length + 1}`, kind: "TEMPERATURE", accuracy: "", calibrationValid: false, setupVerified: false }); })}>Add instrument</button>
            {form.instruments.map((row, index) => (
              <div className="nrMeasureRow nrCard" key={index}>
                <input aria-label="Instrument ID" value={row.id} onChange={(event) => patch((d) => { d.instruments[index].id = event.target.value; })} />
                <select aria-label="Instrument kind" value={row.kind} onChange={(event) => patch((d) => { d.instruments[index].kind = event.target.value as typeof row.kind; })}>
                  {Object.entries(UNIT_LABEL).map(([kind, unit]) => <option key={kind} value={kind}>{kind.toLowerCase().replace("_", " ")} ({unit})</option>)}
                </select>
                <input aria-label="Instrument accuracy" placeholder={`± accuracy (${UNIT_LABEL[row.kind]})`} value={row.accuracy} onChange={(event) => patch((d) => { d.instruments[index].accuracy = event.target.value; })} />
                <CheckField label="Calibration valid" checked={row.calibrationValid} onChange={(v) => patch((d) => { d.instruments[index].calibrationValid = v; })} />
                <CheckField label="Setup verified" checked={row.setupVerified} onChange={(v) => patch((d) => { d.instruments[index].setupVerified = v; })} />
              </div>
            ))}
          </div>
        </Section>

        <Section id="evaluate" letter="G" title="Evaluate" hint="Gate A decides. Pressure instruments may be connected only after a Gate-A ALLOW receipt.">
          <div className="wide nrLog">
            <b>Pressure instruments you intend to use</b>
            <button type="button" onClick={() => patch((d) => { d.pressureInstruments.push({ id: `GAUGE-${d.pressureInstruments.length + 1}`, ratedFor: "", calibrationValid: false }); })}>Add pressure instrument</button>
            {form.pressureInstruments.map((row, index) => (
              <div className="nrMeasureRow nrCard" key={index}>
                <input aria-label="Pressure instrument ID" value={row.id} onChange={(event) => patch((d) => { d.pressureInstruments[index].id = event.target.value; })} />
                <input aria-label="Rated refrigerants" placeholder="Rated refrigerants (comma-separated)" value={row.ratedFor} onChange={(event) => patch((d) => { d.pressureInstruments[index].ratedFor = event.target.value; })} />
                <CheckField label="Calibration valid" checked={row.calibrationValid} onChange={(v) => patch((d) => { d.pressureInstruments[index].calibrationValid = v; })} />
              </div>
            ))}
          </div>
          <SelectField wide label="Pressure-side status right now" value={form.pressureSideEntry} onChange={(v) => patch((d) => { d.pressureSideEntry = v; })}
            options={[["NOT_PERFORMED", "Not connected — awaiting Gate-A determination"], ["ATTEMPTED", "Connection attempted"], ["INSTRUMENTS_CONNECTED", "Instruments connected"], ["PROPOSED_OUTSIDE_GATE_A", "Requested outside a Gate-A evaluation"]]} />
          <div className="wide nrActions">
            <button type="button" className="nrPrimary" disabled={busy} onClick={() => evaluate()}>{busy ? "Evaluating…" : "EVALUATE NIRET GATE A"}</button>
            <button type="button" className="nrSecondary" disabled={busy} onClick={() => { patch((d) => { d.pressureSideEntry = "PROPOSED_OUTSIDE_GATE_A"; }); void evaluate("PROPOSED_OUTSIDE_GATE_A"); }}>
              Request gauge connection now
            </button>
            <p>“Request gauge connection now” asks to connect pressure instruments outside a Gate-A ALLOW. Gate A governs that request; it is not authorized by this form.</p>
          </div>
          {error && <p className="nrError wide" role="alert">Evaluator unavailable: {error}. No determination was made.</p>}
        </Section>

        <div id="niret-result">
          {response && <DeterminationPanel response={response} nominalCapacityBtuh={form.equipment.nominalCapacityBtuh} />}
          {response && <ReceiptPanel response={response} />}
        </div>
      </div>
      <style>{`
        .nrPage{min-height:100vh;background:#f5f8fa;color:#10202b;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;padding:0 16px}
        .nrShell{max-width:1080px;margin:0 auto;padding:28px 0 80px}
        .nrHero small,.nrSection header span{font-size:.68rem;font-weight:800;letter-spacing:.12em;color:#0e6f8c}
        .nrHero h1{margin:8px 0;font-size:clamp(1.8rem,4vw,2.6rem)}
        .nrHero p{max-width:760px;line-height:1.55;color:#3d5463}
        .nrBoundary{margin:14px 0;padding:12px 14px;border:2px solid #b3261e;border-radius:10px;background:#fff4f2;color:#7a1611;font-weight:800;font-size:.82rem;line-height:1.45}
        .nrSection{margin-top:22px;padding:18px;border:1px solid #d5e1e8;border-radius:14px;background:#fff}
        .nrSection header{display:flex;gap:12px;align-items:flex-start;margin-bottom:12px}
        .nrSection header span{display:grid;place-items:center;min-width:30px;height:30px;border-radius:8px;background:#e3f3f8}
        .nrSection h2{margin:0;font-size:1.1rem}.nrSection header p{margin:4px 0 0;color:#566c7a;font-size:.86rem}
        .nrGrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px}
        .wide{grid-column:1/-1}
        .nrField{display:flex;flex-direction:column;gap:4px;font-size:.8rem;color:#3d5463}
        .nrField input,.nrField select,.nrMeasureRow input,.nrMeasureRow select,.nrRange input{min-height:38px;padding:6px 8px;border:1px solid #c3d3dc;border-radius:8px;font:inherit;color:#10202b;background:#fff;min-width:0}
        .nrInline,.nrMeasureRow{display:flex;gap:6px;flex-wrap:wrap}.nrMeasureRow>*{flex:1 1 90px}
        button{min-height:38px;padding:6px 10px;border:1px solid #9fc3d2;border-radius:8px;background:#eef7fa;color:#0b4f64;font-weight:700;cursor:pointer}
        .nrCheck{display:flex;gap:8px;align-items:center;font-size:.82rem}
        .nrMeasure,.nrRange{display:flex;flex-direction:column;gap:6px;padding:10px;border:1px solid #d5e1e8;border-radius:10px;background:#fbfdfe}
        .nrMeasure.attention{border-color:#d08a00;background:#fff9ec}
        .nrMeasureHead{display:flex;justify-content:space-between;font-size:.84rem}.nrMeasureHead small{color:#6b808d}
        .nrAttention{margin:0;padding-left:18px;color:#8a5a00;font-size:.75rem}
        .nrBasis{border:1px solid #d5e1e8;border-radius:10px;padding:10px;display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:6px}
        .nrLog{display:flex;flex-direction:column;gap:8px}.nrLog ul{margin:0;padding-left:18px;font-size:.82rem}
        .nrCard{padding:10px;border:1px dashed #c3d3dc;border-radius:10px}
        .nrDetails summary{cursor:pointer;font-weight:700;margin-bottom:8px}
        .nrActions{display:flex;flex-wrap:wrap;gap:10px;align-items:center}.nrActions p{flex-basis:100%;margin:0;color:#566c7a;font-size:.8rem}
        .nrPrimary{background:#0b4f64;color:#fff;border-color:#0b4f64;padding:12px 18px;font-size:.95rem}
        .nrSecondary{background:#fff;color:#7a1611;border-color:#d8a39f}
        .nrError{color:#9b1c14;font-weight:700}
        .nrDetermination{margin-top:26px;padding:20px;border-radius:14px;border:3px solid;background:#fff}
        .nrDetermination.allow{border-color:#1b7a3d}.nrDetermination.hold{border-color:#c07b00}.nrDetermination.deny{border-color:#b3261e}.nrDetermination.escalate{border-color:#5b3fa6}
        .nrDetermination h2{margin:6px 0;font-size:clamp(1.3rem,3vw,1.8rem)}
        .nrPremature{font-weight:700;color:#7a1611}
        .nrCounts{margin:10px 0;font-size:.9rem}.nrNext,.nrReasons,.nrUnresolved,.nrContext{margin-top:12px}
        .nrNext small,.nrReasons small,.nrUnresolved small,.nrReceipt small{font-size:.66rem;font-weight:800;letter-spacing:.1em;color:#566c7a}
        .nrReasons code{display:inline-block;margin:4px 6px 0 0;padding:2px 6px;border-radius:6px;background:#eef2f5;font-size:.72rem}
        .nrUnresolved ul{padding-left:18px}.nrUnresolved li{margin:8px 0;display:flex;flex-direction:column;gap:2px;font-size:.84rem}
        .nrUnresolved li span{color:#6b808d;font-size:.74rem}.nrUnresolved a{color:#0b4f64;font-size:.76rem}.nrUnresolved em{color:#3d5463}
        .nrReceipt{margin-top:18px;padding:18px;border:1px solid #d5e1e8;border-radius:14px;background:#fff}
        .nrReceipt header{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}.nrReceipt h2{margin:4px 0;font-size:1rem;word-break:break-all}
        .nrReceiptActions{display:flex;gap:6px;flex-wrap:wrap}
        .nrReceipt dl{display:grid;grid-template-columns:minmax(120px,200px) 1fr;gap:6px 12px;font-size:.82rem}.nrReceipt dd{margin:0;word-break:break-all}
        .nrReceipt pre{max-height:420px;overflow:auto;padding:12px;background:#0f1d26;color:#dbeaf1;border-radius:10px;font-size:.72rem}
        .nrPropList{padding-left:18px;font-size:.82rem}.nrPropList li.ok{color:#1b7a3d}.nrPropList li.open{color:#8a5a00}
        .nrNote{color:#566c7a;font-size:.76rem}
        .nrHint{margin:0;padding:8px 10px;border-left:3px solid #c07b00;background:#fff9ec;color:#5c4200;font-size:.8rem}
        .nrParts{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px;margin:10px 0}
        .nrPart{padding:12px;border-radius:10px;border:2px solid #c3d3dc;background:#fbfdfe}.nrPart p{margin:6px 0 0;font-size:.86rem}
        .nrPart.allow{border-color:#1b7a3d}.nrPart.hold{border-color:#c07b00}.nrPart.deny{border-color:#b3261e}.nrPart.escalate{border-color:#5b3fa6}
        .nrRule{font-weight:800;color:#7a1611;margin:4px 0}
        .nrPlain{margin:2px 0;color:#10202b}.nrCertOk{color:#1b7a3d;font-weight:700}.nrCertOpen{color:#8a5a00;font-weight:700}
        @media print{.nrSection,.nrHero p,button{display:none}.nrReceipt pre{max-height:none}}
      `}</style>
    </main>
  );
}
