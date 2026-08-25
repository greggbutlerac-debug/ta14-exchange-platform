export const baselayerParticipantIntake = {
  intakeId: "TA14-CEI-BASELAYEROS-R1-INTAKE",
  status: "OPEN FOR PARTICIPANT FACTUAL INPUT — DOES NOT OPEN TECHNICAL FREEZE",
  participantResponseStates: ["CONFIRMED", "CORRECTED", "DECLINED / OUT OF SCOPE", "INSUFFICIENT INFORMATION"],
  sections: [
    { id: "P01", title: "Participant identity", fields: ["Attributable participant name", "Organization / project", "Role and authority to speak for the submitted architecture", "Preferred contact channel"] },
    { id: "P02", title: "Architecture identity", fields: ["Native architecture name", "Exact version / release / commit", "Repository or canonical artifact location", "Cryptographic hash or immutable identity where available", "Implementation object proposed for examination"] },
    { id: "P03", title: "Native claims", fields: ["Exact material execution-governance claim(s) participant is willing to freeze", "Explicit non-claims and limitations", "Native terminology that must be preserved", "Claims participant expressly declines to make"] },
    { id: "P04", title: "Authority and determination semantics", fields: ["Native authority model", "Native determination states", "Meaning of each determination", "Which native state prevents consequential progression", "Conditions that invalidate or re-establish authority"] },
    { id: "P05", title: "Consequence boundary", fields: ["Exact consequence being examined", "Last reversible state", "First irreversible or consequence-bearing state", "Execution adapter / gateway / enforcement object", "Evidence that proves whether a request crossed the boundary"] },
    { id: "P06", title: "Changed-condition event", fields: ["Initially supportable condition", "Material condition changed before execution", "Why the change is material under native architecture", "Expected native response", "Evidence source for the changed condition"] },
    { id: "P07", title: "Routes and bypass surface", fields: ["Primary governed route", "Known alternate routes", "Aliases / wrappers / equivalent tools", "Direct API or out-of-band pathways", "Declared out-of-scope routes and why"] },
    { id: "P08", title: "Evidence package", fields: ["Frozen inputs", "Logs / receipts / traces", "Policy or rule identity", "Environment identity", "Clock / time basis", "Dependency identities", "Expected output artifacts"] },
    { id: "P09", title: "Replay", fields: ["Replayable package available?", "Required runtime / infrastructure", "Secrets or credentials treatment", "Independent operator constraints", "Expected reproducibility boundary", "Known sources of nondeterminism"] },
    { id: "P10", title: "Acceptance and publication", fields: ["Acceptance-criteria corrections", "Confidentiality restrictions", "Permitted public statements", "Factual-review period", "Publication authorization", "Participant attribution requirements"] },
  ],
  declarations: [
    "Submission supplies proposed factual inputs; it does not establish that any claim is true.",
    "TA-14 may preserve corrections and disagreements without converting them into participant endorsement.",
    "Technical Freeze remains closed until the examination object is mutually attributable and sufficiently complete.",
    "Registration or examination does not transfer ownership, authority, or intellectual property.",
    "No result may be represented as certification, universal validation, or superiority beyond the frozen scope.",
  ],
} as const;
