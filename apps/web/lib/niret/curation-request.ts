/**
 * OEM curation request (Amendment A7).
 *
 * When no verified governed OEM record covers the technician's system, the
 * manual OEM transcription can be handed to curators as a request. It is not
 * an OEM record, it is never VERIFIED, and it is never sent to Gate A as
 * verified provenance. A curator must obtain the authentic manufacturer
 * document, hash it, transcribe it into a record, and have it independently
 * reviewed before anything becomes authoritative.
 */

import type { NiretFormState } from "./form-state";

export interface OemCurationRequest {
  kind: "NIRET_OEM_CURATION_REQUEST";
  contract: "TA-14-NIRET-GA-C1/A7";
  authoritative: false;
  verification: "NOT_VERIFIED";
  preparedAt: string;
  requestedBy: string | null;
  equipment: { manufacturer: string | null; indoorModel: string | null; outdoorModel: string | null };
  declaredSource: {
    manufacturer: string | null;
    model: string | null;
    document: string | null;
    revision: string | null;
    pageRef: string | null;
    sourceRef: string | null;
  };
  /** The technician's transcription, carried verbatim for the curator to check against the document. */
  transcription: NiretFormState["oem"];
  notice: string;
}

const text = (value: string): string | null => (value.trim() === "" ? null : value.trim());

export function buildCurationRequest(form: NiretFormState, preparedAt: string): OemCurationRequest {
  return {
    kind: "NIRET_OEM_CURATION_REQUEST",
    contract: "TA-14-NIRET-GA-C1/A7",
    authoritative: false,
    verification: "NOT_VERIFIED",
    preparedAt,
    requestedBy: text(form.job.technicianId),
    equipment: {
      manufacturer: text(form.equipment.manufacturer),
      indoorModel: text(form.equipment.indoorModel),
      outdoorModel: text(form.equipment.outdoorModel),
    },
    declaredSource: {
      manufacturer: text(form.oem.manufacturer),
      model: text(form.oem.model),
      document: text(form.oem.document),
      revision: text(form.oem.revision),
      pageRef: text(form.oem.section),
      sourceRef: text(form.oem.sourceRef),
    },
    transcription: JSON.parse(JSON.stringify(form.oem)) as NiretFormState["oem"],
    notice: "Curation request only. Not an OEM record and not verified. A governed record requires the authentic manufacturer document, its SHA-256, transcription, and independent review.",
  };
}
