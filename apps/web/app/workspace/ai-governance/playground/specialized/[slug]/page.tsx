"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";

type Determination = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
type EvidenceState = "available" | "stale" | "missing" | "challenged";
type Lane = {
  code: string;
  title: string;
  slug: string;
  accent: string;
  mandate: string;
  claimPrompt: string;
  unsupportedWarning: string;
  evidence: readonly string[];
  gates: readonly { name: string; test: string }[];
  scenarios: readonly { name: string; description: string; result: Determination }[];
  nonClaims: readonly string[];
};

const LANES: readonly Lane[] = [
  {
    code: "RX",
    title: "Runtime & Execution",
    slug: "runtime-execution",
    accent: "#63e6ff",
    mandate: "Determine whether a specific action has admissible authority, evidence, continuity, boundaries, intervention controls, and outcome correspondence at the moment of execution.",
    claimPrompt: "This execution is authorized to proceed within the declared boundary now.",
    unsupportedWarning: "A runtime determination does not establish model quality, lawful data rights, regulatory compliance, or independent assurance unless those layers are separately tested.",
    evidence: ["Current execution authority", "Bound action and objective", "Tool and permission manifest", "Dependency state", "Intervention and termination capability", "Commit and outcome receipt"],
    gates: [
      { name: "Authority", test: "Is authority current, attributable, scoped, and valid for this exact action?" },
      { name: "Continuity", test: "Has identity, context, evidence, and boundary continuity been preserved?" },
      { name: "Commit", test: "Is the proposed commit identical to the reviewed and authorized action?" },
      { name: "Intervention", test: "Can execution be stopped, contained, corrected, and recorded?" },
    ],
    scenarios: [
      { name: "Baseline execution", description: "All required evidence is current and the commit remains inside the authorized boundary.", result: "ALLOW" },
      { name: "Authority expiration", description: "The approving authority expired before the execution commit.", result: "HOLD" },
      { name: "Boundary breach", description: "The tool attempts an action outside the approved objective and permissions.", result: "DENY" },
      { name: "Compound dependency drift", description: "A critical dependency changed and responsibility is disputed.", result: "ESCALATE" },
    ],
    nonClaims: ["Does not prove the model is accurate", "Does not create legal authority", "Does not replace security testing", "Does not guarantee a beneficial outcome"],
  },
  {
    code: "MG",
    title: "Model Governance",
    slug: "model",
    accent: "#b58cff",
    mandate: "Determine whether a specific model identity, version, approved purpose, evaluation basis, threshold, limitation, change history, and retirement state remain governable for the proposed use.",
    claimPrompt: "This identified model version remains approved and supported for the declared use.",
    unsupportedWarning: "Model approval is not execution authority and does not establish data rights, human review validity, or lawful deployment by itself.",
    evidence: ["Model identity and version", "Approved-purpose statement", "Evaluation corpus and method", "Performance thresholds", "Known limitations", "Change and retirement history"],
    gates: [
      { name: "Identity", test: "Is the exact deployed model and version unambiguously identified?" },
      { name: "Purpose", test: "Does the proposed use remain within the approved purpose and population?" },
      { name: "Evaluation", test: "Are evaluations current, reproducible, relevant, and threshold-bound?" },
      { name: "Change", test: "Have material changes been reviewed before continued reliance?" },
    ],
    scenarios: [
      { name: "Approved baseline", description: "The declared version meets current thresholds for the approved use.", result: "ALLOW" },
      { name: "Evaluation aging", description: "The last evaluation is outside the approved validity window.", result: "HOLD" },
      { name: "Unapproved use", description: "The model is proposed for a prohibited consequential decision.", result: "DENY" },
      { name: "Material version drift", description: "A vendor update changed behavior without sufficient comparative evidence.", result: "ESCALATE" },
    ],
    nonClaims: ["Does not authorize a live execution", "Does not prove training-data legality", "Does not establish human oversight", "Does not certify every downstream integration"],
  },
  {
    code: "DP",
    title: "Data & Provenance",
    slug: "data-provenance",
    accent: "#72e6b2",
    mandate: "Determine whether data origin, rights, basis, consent, lineage, quality, transformation, access, retention, and geography support the exact proposed governance claim.",
    claimPrompt: "The declared data is admissible for this bounded use and remains traceable through every material transformation.",
    unsupportedWarning: "Valid provenance does not prove model fitness, decision fairness, regulatory compliance, or execution authority.",
    evidence: ["Source and collection record", "Rights, consent, or lawful basis", "Lineage graph", "Quality and completeness measures", "Transformation history", "Retention and geographic controls"],
    gates: [
      { name: "Origin", test: "Can each material data source be identified and attributed?" },
      { name: "Rights", test: "Is the declared use supported by rights, consent, contract, or lawful basis?" },
      { name: "Lineage", test: "Are transformations, joins, exclusions, and derived fields preserved?" },
      { name: "Fitness", test: "Is quality sufficient for the exact claim without concealing unavailable data?" },
    ],
    scenarios: [
      { name: "Complete lineage", description: "Origin, rights, transformations, and quality are evidenced for the declared use.", result: "ALLOW" },
      { name: "Stale consent", description: "Consent scope may not cover a newly proposed secondary use.", result: "HOLD" },
      { name: "Prohibited transfer", description: "The proposed processing violates a binding geographic restriction.", result: "DENY" },
      { name: "Conflicting ownership", description: "Two sources assert incompatible rights over a material dataset.", result: "ESCALATE" },
    ],
    nonClaims: ["Does not prove predictions are correct", "Does not establish execution permission", "Does not eliminate bias", "Does not substitute for regulatory interpretation"],
  },
  {
    code: "AT",
    title: "Agent & Tool",
    slug: "agent-tools",
    accent: "#ffc65c",
    mandate: "Determine whether delegated objectives, tools, memory, sub-agents, communications, external actions, financial limits, escalation, and termination remain bounded and attributable.",
    claimPrompt: "This agent may use the declared tools to pursue the bounded objective under the stated limits.",
    unsupportedWarning: "Agent identity and tool permission do not make a specific action admissible; runtime authority must still be earned at execution.",
    evidence: ["Agent identity and owner", "Delegated objective", "Tool permission manifest", "Memory and communication boundaries", "Sub-agent inventory", "Financial and termination limits"],
    gates: [
      { name: "Delegation", test: "Is the objective explicit, current, attributable, and bounded?" },
      { name: "Tools", test: "Are every tool, scope, credential, and external effect declared?" },
      { name: "Propagation", test: "Are sub-agents, messages, and memory transfers controlled and reviewable?" },
      { name: "Termination", test: "Can the agent and every delegated branch be stopped reliably?" },
    ],
    scenarios: [
      { name: "Bounded delegation", description: "The agent remains inside objective, tool, spending, and communication limits.", result: "ALLOW" },
      { name: "Unknown sub-agent", description: "A delegated branch appears without a complete identity and permission record.", result: "HOLD" },
      { name: "Forbidden purchase", description: "The agent attempts a transaction above its financial authority.", result: "DENY" },
      { name: "Termination failure", description: "A remote tool continues acting after the principal agent is stopped.", result: "ESCALATE" },
    ],
    nonClaims: ["Does not prove model reliability", "Does not approve consequential decisions", "Does not establish legal compliance", "Does not guarantee third-party behavior"],
  },
  {
    code: "DG",
    title: "Decision Governance",
    slug: "decision",
    accent: "#c68cff",
    mandate: "Determine whether a consequential decision has a valid basis, authorized decision-maker, identified affected party, notice, review, appeal, traceability, and outcome accountability.",
    claimPrompt: "This consequential decision is supported, authorized, reviewable, and bounded to the identified affected party and purpose.",
    unsupportedWarning: "A decision record does not itself authorize execution or prove that every underlying model, dataset, or policy is valid.",
    evidence: ["Decision question and scope", "Authorized decision-maker", "Evidence and rationale", "Affected-party record", "Notice and review rights", "Appeal and correction history"],
    gates: [
      { name: "Basis", test: "Is the decision supported by relevant, available, and challengeable evidence?" },
      { name: "Authority", test: "Is the decision-maker authorized for this class of decision?" },
      { name: "Affected party", test: "Are notice, explanation, review, and appeal rights preserved?" },
      { name: "Traceability", test: "Can the decision be reconstructed and corrected without rewriting history?" },
    ],
    scenarios: [
      { name: "Supported decision", description: "Evidence, authority, notice, rationale, and review rights are complete.", result: "ALLOW" },
      { name: "Missing explanation", description: "The affected party cannot yet receive the required reason statement.", result: "HOLD" },
      { name: "Unauthorized denial", description: "A system attempts a binding denial without an authorized decision-maker.", result: "DENY" },
      { name: "Material counterevidence", description: "New evidence challenges the original basis after notice was issued.", result: "ESCALATE" },
    ],
    nonClaims: ["Does not authorize physical execution", "Does not certify model validity", "Does not eliminate legal review", "Does not make an outcome fair by declaration"],
  },
  {
    code: "PC",
    title: "Policy & Controls",
    slug: "policy-controls",
    accent: "#7da6ff",
    mandate: "Determine whether written policy has been translated into owned, enforceable, evidenced operational controls with exceptions, testing, consequences, and correction paths.",
    claimPrompt: "This policy requirement is implemented as an owned, enforceable, evidenced operational control.",
    unsupportedWarning: "Written policy and control design do not prove operating effectiveness or authorize a specific execution.",
    evidence: ["Policy source and owner", "Control objective", "Enforcement mechanism", "Required evidence", "Exception process", "Testing and remediation history"],
    gates: [
      { name: "Translation", test: "Is policy language mapped to a specific operational obligation?" },
      { name: "Ownership", test: "Is an accountable control owner identified and authorized?" },
      { name: "Enforcement", test: "Can the control prevent, detect, hold, or correct nonconforming activity?" },
      { name: "Evidence", test: "Does operation produce durable evidence instead of assertion alone?" },
    ],
    scenarios: [
      { name: "Operating control", description: "The control is owned, enforced, tested, and producing current evidence.", result: "ALLOW" },
      { name: "Unverified operation", description: "Design is approved but current operating evidence is unavailable.", result: "HOLD" },
      { name: "Policy-only control", description: "The claimed control exists only as written guidance with no enforcement.", result: "DENY" },
      { name: "Exception conflict", description: "An exception was approved outside the declared authority boundary.", result: "ESCALATE" },
    ],
    nonClaims: ["Does not prove regulatory compliance", "Does not authorize execution", "Does not replace control testing", "Does not establish beneficial outcomes"],
  },
  {
    code: "RG",
    title: "Risk Governance",
    slug: "risk",
    accent: "#ff826f",
    mandate: "Determine whether risks are identified, owned, treated, monitored, accepted by valid authority, bounded by expiration and triggers, and revalidated when conditions change.",
    claimPrompt: "This identified risk is treated or accepted within the declared authority, duration, and trigger boundaries.",
    unsupportedWarning: "Risk acceptance does not make an otherwise unlawful, unauthorized, or inadmissible execution permissible.",
    evidence: ["Risk statement and context", "Owner and affected assets", "Likelihood and impact basis", "Treatment plan", "Residual acceptance authority", "Expiration, triggers, and monitoring"],
    gates: [
      { name: "Identification", test: "Is the risk specific enough to test, own, treat, and monitor?" },
      { name: "Treatment", test: "Are controls tied to the stated causes, impacts, and exposure?" },
      { name: "Acceptance", test: "Is residual risk accepted by the correct authority for a bounded period?" },
      { name: "Revalidation", test: "Do changes, incidents, thresholds, or expiration trigger renewed review?" },
    ],
    scenarios: [
      { name: "Current acceptance", description: "Treatment and residual acceptance remain current and within authority.", result: "ALLOW" },
      { name: "Acceptance expiration", description: "The residual acceptance period ended before the next review.", result: "HOLD" },
      { name: "Forbidden exposure", description: "The declared risk exceeds a non-waivable institutional limit.", result: "DENY" },
      { name: "Compound risk change", description: "Multiple controls failed and ownership is no longer clear.", result: "ESCALATE" },
    ],
    nonClaims: ["Does not create authority", "Does not prove control effectiveness", "Does not override law or policy", "Does not guarantee loss prevention"],
  },
  {
    code: "CR",
    title: "Compliance & Regulation",
    slug: "compliance",
    accent: "#b7ef68",
    mandate: "Determine whether a law, regulation, standard, contract, or other duty applies to an identified actor and whether obligations are mapped to controls, evidence, interpretation, and continuing verification.",
    claimPrompt: "The declared regulated actor has satisfied the identified obligation for this bounded scope and review period.",
    unsupportedWarning: "A compliance determination is bounded to cited authorities, facts, actors, scope, and time; it is not universal legal clearance.",
    evidence: ["Source authority and version", "Applicability analysis", "Regulated actor and role", "Obligation-to-control mapping", "Evidence of performance", "Interpretation and continuing-duty record"],
    gates: [
      { name: "Applicability", test: "Does the cited authority apply to this actor, activity, jurisdiction, and date?" },
      { name: "Obligation", test: "Is each duty mapped without collapsing distinct requirements?" },
      { name: "Performance", test: "Do current records evidence actual satisfaction rather than policy intent?" },
      { name: "Continuing duty", test: "Are renewal, monitoring, reporting, and change duties preserved?" },
    ],
    scenarios: [
      { name: "Supported compliance", description: "Applicability, controls, evidence, and continuing duties are complete.", result: "ALLOW" },
      { name: "Interpretation gap", description: "A material term remains unresolved for the proposed activity.", result: "HOLD" },
      { name: "Prohibited activity", description: "A binding rule expressly prohibits the declared conduct.", result: "DENY" },
      { name: "Conflicting authorities", description: "Two applicable obligations produce incompatible duties.", result: "ESCALATE" },
    ],
    nonClaims: ["Does not provide universal legal advice", "Does not authorize execution", "Does not prove every jurisdiction was reviewed", "Does not replace competent counsel"],
  },
  {
    code: "SG",
    title: "Security Governance",
    slug: "security",
    accent: "#ff8db5",
    mandate: "Determine whether the declared environment, identities, credentials, permissions, dependencies, threats, incidents, containment, restoration, and proof support continued governed operation.",
    claimPrompt: "This environment remains within the declared security boundary and is supported for governed operation.",
    unsupportedWarning: "Security approval does not establish execution admissibility, model quality, data rights, or regulatory compliance by itself.",
    evidence: ["Environment and asset inventory", "Identity and credential state", "Permission graph", "Threat and dependency model", "Incident and containment record", "Restoration and verification evidence"],
    gates: [
      { name: "Boundary", test: "Are assets, interfaces, identities, and dependencies inside the review boundary known?" },
      { name: "Access", test: "Are credentials and permissions current, least-privileged, and attributable?" },
      { name: "Incident", test: "Can compromise be detected, contained, investigated, and preserved?" },
      { name: "Restoration", test: "Can trusted operation be re-established and independently verified?" },
    ],
    scenarios: [
      { name: "Supported environment", description: "Assets, access, dependencies, monitoring, and recovery evidence are current.", result: "ALLOW" },
      { name: "Credential uncertainty", description: "A privileged credential cannot be conclusively attributed.", result: "HOLD" },
      { name: "Active compromise", description: "Evidence shows an unresolved compromise in the execution environment.", result: "DENY" },
      { name: "Supply-chain incident", description: "A critical dependency reports compromise with incomplete scope.", result: "ESCALATE" },
    ],
    nonClaims: ["Does not authorize an action", "Does not prove privacy compliance", "Does not certify all vendors", "Does not guarantee absence of compromise"],
  },
  {
    code: "HO",
    title: "Human Oversight",
    slug: "human-oversight",
    accent: "#87d8ff",
    mandate: "Determine whether oversight is assigned to a qualified, informed, independent human with sufficient time, authority, intervention power, conflict controls, escalation paths, and a durable decision record.",
    claimPrompt: "The assigned human oversight is informed, qualified, timely, independent, and capable of stopping or changing the governed activity.",
    unsupportedWarning: "A human click, approval, or presence is not meaningful oversight unless capability, information, time, authority, and intervention power are evidenced.",
    evidence: ["Oversight role and identity", "Qualification record", "Information presented", "Time and workload context", "Intervention authority", "Conflict, escalation, and decision record"],
    gates: [
      { name: "Qualification", test: "Does the reviewer possess the knowledge required for this exact decision?" },
      { name: "Information", test: "Can the reviewer see limitations, uncertainty, evidence, and alternatives?" },
      { name: "Power", test: "Can the reviewer pause, deny, correct, override, and escalate?" },
      { name: "Independence", test: "Are conflicts, incentives, workload, and retaliation risks controlled?" },
    ],
    scenarios: [
      { name: "Meaningful oversight", description: "A qualified reviewer has adequate information, time, authority, and intervention power.", result: "ALLOW" },
      { name: "Insufficient time", description: "The reviewer is qualified but cannot complete the required review before action.", result: "HOLD" },
      { name: "Rubber-stamp approval", description: "The reviewer lacks the ability to reject or stop the system.", result: "DENY" },
      { name: "Conflict challenge", description: "A material conflict may have affected the oversight decision.", result: "ESCALATE" },
    ],
    nonClaims: ["Does not validate the model", "Does not create execution authority", "Does not eliminate automation risk", "Does not prove the decision was correct"],
  },
  {
    code: "VT",
    title: "Vendor & Third Party",
    slug: "vendor-third-party",
    accent: "#f0a86e",
    mandate: "Determine whether contracts, versions, access, subprocessors, evidence, change notice, incident duties, continuity, responsibility, and exit controls support continued reliance on a third party.",
    claimPrompt: "This third-party dependency remains governable within the declared contract, access, evidence, change, incident, and exit boundaries.",
    unsupportedWarning: "A contract or vendor attestation does not prove operational performance, security, compliance, or execution admissibility.",
    evidence: ["Vendor identity and service scope", "Contract and responsibility matrix", "Version and access inventory", "Subprocessor register", "Evidence and change-notice duties", "Incident, continuity, and exit plan"],
    gates: [
      { name: "Responsibility", test: "Are duties allocated without leaving material gaps or overlaps?" },
      { name: "Visibility", test: "Can versions, access, subprocessors, and changes be observed and evidenced?" },
      { name: "Incident", test: "Are notification, investigation, containment, and cooperation duties enforceable?" },
      { name: "Exit", test: "Can data, service, authority, and continuity be safely transferred or terminated?" },
    ],
    scenarios: [
      { name: "Governed reliance", description: "Contract, access, evidence, change, incident, and exit controls are current.", result: "ALLOW" },
      { name: "Unreported subprocessor", description: "A material subprocessor was added without required notice and review.", result: "HOLD" },
      { name: "Contractual prohibition", description: "The proposed use is outside the licensed or authorized service scope.", result: "DENY" },
      { name: "Vendor incident", description: "A third-party incident has uncertain scope and disputed responsibility.", result: "ESCALATE" },
    ],
    nonClaims: ["Does not certify vendor truthfulness", "Does not replace independent testing", "Does not authorize execution", "Does not eliminate concentration risk"],
  },
  {
    code: "OA",
    title: "Outcome & Assurance",
    slug: "outcome-assurance",
    accent: "#dce8f3",
    mandate: "Determine whether intended action, actual execution, measured result, claimed benefit, adverse effect, independent review, monitoring, and correction remain connected and challengeable.",
    claimPrompt: "The measured outcome corresponds to the governed execution and supports the bounded assurance claim.",
    unsupportedWarning: "An assurance report does not retroactively authorize execution and cannot exceed the evidence, independence, scope, method, and review period it preserves.",
    evidence: ["Intended outcome and measures", "Execution and commit receipts", "Observed result", "Adverse-effect record", "Assurance method and independence", "Monitoring, challenge, and correction history"],
    gates: [
      { name: "Correspondence", test: "Can the observed result be linked to the reviewed execution without substitution?" },
      { name: "Measurement", test: "Are success, failure, uncertainty, and adverse effects measured honestly?" },
      { name: "Independence", test: "Is assurance sufficiently independent for the claim being made?" },
      { name: "Correction", test: "Can challenged or superseded findings be corrected without erasing prior records?" },
    ],
    scenarios: [
      { name: "Supported outcome", description: "Execution receipts, measures, adverse effects, and independent review correspond.", result: "ALLOW" },
      { name: "Incomplete observation", description: "The monitoring window is too short to support the claimed outcome.", result: "HOLD" },
      { name: "False correspondence", description: "The claimed result cannot be linked to the governed execution.", result: "DENY" },
      { name: "Assurance challenge", description: "Counterevidence materially disputes the published assurance finding.", result: "ESCALATE" },
    ],
    nonClaims: ["Does not authorize execution", "Does not guarantee future performance", "Does not erase adverse effects", "Does not extend beyond reviewed scope"],
  },
];

const determinationCopy: Record<Determination, string> = {
  ALLOW: "The bounded lane claim is supported by the currently declared evidence and gate states.",
  HOLD: "One or more required conditions are unavailable, stale, or incomplete. Do not treat the claim as supported yet.",
  DENY: "The declared facts conflict with a non-waivable boundary or show that the claim cannot be supported.",
  ESCALATE: "The lane contains a material conflict, ambiguity, or authority question requiring qualified independent review.",
};

function determine(states: EvidenceState[], challenged: boolean): Determination {
  if (states.includes("missing")) return "DENY";
  if (challenged || states.includes("challenged")) return "ESCALATE";
  if (states.includes("stale")) return "HOLD";
  return "ALLOW";
}

export default function SpecializedGovernanceLanePage() {
  const params = useParams<{ slug: string }>();
  const lane = LANES.find((item) => item.slug === params.slug);
  if (!lane) notFound();

  const [claim, setClaim] = useState(lane.claimPrompt);
  const [states, setStates] = useState<EvidenceState[]>(lane.evidence.map(() => "available"));
  const [challenged, setChallenged] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [preserved, setPreserved] = useState(false);
  const liveDetermination = useMemo(() => determine(states, challenged), [states, challenged]);
  const scenario = lane.scenarios[selectedScenario];
  const finalDetermination = scenario.result === "ALLOW" ? liveDetermination : scenario.result;

  function updateEvidence(index: number, state: EvidenceState) {
    setStates((current) => current.map((item, itemIndex) => itemIndex === index ? state : item));
    setPreserved(false);
  }

  return (
    <main className="page" style={{ "--accent": lane.accent } as CSSProperties}>
      <div className="shell">
        <nav className="topbar">
          <Link href="/workspace/ai-governance/playground" className="button quiet">← Twelve Governance Lanes</Link>
          {lane.slug === "runtime-execution" ? (
            <Link href="/ai-governance/playground/runtime-execution" className="button primary">Open Full Runtime Playground →</Link>
          ) : (
            <Link href="/governance-library" className="button primary">Open Governance Library →</Link>
          )}
        </nav>

        <header className="hero">
          <div className="laneMark">{lane.code}</div>
          <div>
            <p className="eyebrow">TA-14 GOVERNANCE-SPECIFIC PLAYGROUND</p>
            <h1>{lane.title}</h1>
            <p className="mandate">{lane.mandate}</p>
          </div>
          <div className="statusBox">
            <span>Current determination</span>
            <strong data-result={finalDetermination}>{finalDetermination}</strong>
            <p>{determinationCopy[finalDetermination]}</p>
          </div>
        </header>

        <section className="warning">
          <strong>Unsupported-layer warning</strong>
          <p>{lane.unsupportedWarning}</p>
        </section>

        <section className="workspaceGrid">
          <div className="mainColumn">
            <article className="panel">
              <div className="panelHeading"><span>01</span><div><p className="eyebrow">BOUNDED CLAIM</p><h2>State only what this lane can determine.</h2></div></div>
              <label className="fieldLabel" htmlFor="claim">Governance claim</label>
              <textarea id="claim" value={claim} onChange={(event) => { setClaim(event.target.value); setPreserved(false); }} />
              <div className="claimFooter"><span>{claim.length} characters</span><strong>{claim.trim().length > 24 ? "Claim is testable" : "Claim needs more specificity"}</strong></div>
            </article>

            <article className="panel">
              <div className="panelHeading"><span>02</span><div><p className="eyebrow">EVIDENCE MANIFEST</p><h2>Declare availability without hiding uncertainty.</h2></div></div>
              <div className="evidenceList">
                {lane.evidence.map((item, index) => (
                  <div className="evidenceRow" key={item}>
                    <div><strong>{item}</strong><small>Required evidence class {String(index + 1).padStart(2, "0")}</small></div>
                    <select value={states[index]} onChange={(event) => updateEvidence(index, event.target.value as EvidenceState)} aria-label={`${item} state`}>
                      <option value="available">Available</option>
                      <option value="stale">Stale</option>
                      <option value="missing">Missing</option>
                      <option value="challenged">Challenged</option>
                    </select>
                  </div>
                ))}
              </div>
            </article>

            <article className="panel">
              <div className="panelHeading"><span>03</span><div><p className="eyebrow">SCENARIO TESTING</p><h2>Test baseline, failure, drift, and conflict.</h2></div></div>
              <div className="scenarioGrid">
                {lane.scenarios.map((item, index) => (
                  <button key={item.name} onClick={() => { setSelectedScenario(index); setPreserved(false); }} className={selectedScenario === index ? "scenario active" : "scenario"}>
                    <span data-result={item.result}>{item.result}</span><strong>{item.name}</strong><p>{item.description}</p>
                  </button>
                ))}
              </div>
            </article>

            <article className="panel">
              <div className="panelHeading"><span>04</span><div><p className="eyebrow">CHALLENGE & PRESERVATION</p><h2>Preserve the determination without converting it into universal authority.</h2></div></div>
              <label className="challenge"><input type="checkbox" checked={challenged} onChange={(event) => { setChallenged(event.target.checked); setPreserved(false); }} /><span><strong>Material counterevidence or challenge exists</strong><small>Checking this requires ESCALATE unless the challenge is resolved by a qualified review.</small></span></label>
              <div className="preserveBox">
                <div><p className="eyebrow">GOVERNED RECORD CANDIDATE</p><h3>{finalDetermination}: {lane.code}-{lane.slug.toUpperCase()}-001</h3><p>The record preserves the claim, evidence states, selected scenario, bounded determination, unsupported-layer warning, and invalidation conditions.</p></div>
                <button className="button primary" onClick={() => setPreserved(true)} disabled={!claim.trim()}>{preserved ? "Record Preserved ✓" : "Preserve Record Candidate"}</button>
              </div>
            </article>
          </div>

          <aside className="sideColumn">
            <article className="sidePanel sticky">
              <p className="eyebrow">LIVE DETERMINATION</p>
              <strong className="bigResult" data-result={finalDetermination}>{finalDetermination}</strong>
              <p>{determinationCopy[finalDetermination]}</p>
              <dl>
                <div><dt>Lane</dt><dd>{lane.title}</dd></div>
                <div><dt>Scenario</dt><dd>{scenario.name}</dd></div>
                <div><dt>Available evidence</dt><dd>{states.filter((state) => state === "available").length}/{states.length}</dd></div>
                <div><dt>Challenge state</dt><dd>{challenged ? "Open" : "None declared"}</dd></div>
                <div><dt>Preservation</dt><dd>{preserved ? "Preserved locally" : "Candidate only"}</dd></div>
              </dl>
            </article>

            <article className="sidePanel">
              <p className="eyebrow">LANE GATES</p>
              {lane.gates.map((gate) => <div className="gate" key={gate.name}><strong>{gate.name}</strong><p>{gate.test}</p></div>)}
            </article>

            <article className="sidePanel">
              <p className="eyebrow">NON-CLAIMS</p>
              <ul>{lane.nonClaims.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          </aside>
        </section>

        <footer>
          <div><strong>No admissible evidence. No admissible execution.</strong><p>Lane determinations remain bounded to declared evidence, authority, scope, scenario, and time.</p></div>
          <Link href="/workspace/ai-governance/playground">Return to all twelve lanes →</Link>
        </footer>
      </div>

      <style jsx>{`
        .page{min-height:100vh;color:#f7fbff;background:radial-gradient(circle at 16% 0,color-mix(in srgb,var(--accent) 13%,transparent),transparent 31%),radial-gradient(circle at 92% 28%,rgba(40,91,139,.12),transparent 30%),#030a12}.shell{width:min(1500px,calc(100% - 36px));margin:auto;padding:20px 0 70px}.topbar{display:flex;justify-content:space-between;gap:14px;padding:11px;border:1px solid rgba(255,255,255,.09);border-radius:17px;background:rgba(4,16,28,.82);backdrop-filter:blur(16px);position:sticky;top:12px;z-index:20}.button{min-height:44px;padding:0 16px;display:inline-flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.11);border-radius:11px;color:#d9e8ef;background:rgba(255,255,255,.035);font-size:10px;font-weight:950;letter-spacing:.09em;text-transform:uppercase;text-decoration:none;cursor:pointer}.button.primary{color:#03151c;border-color:color-mix(in srgb,var(--accent) 72%,white);background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 45%,white),var(--accent))}.button:disabled{opacity:.6;cursor:not-allowed}.hero{display:grid;grid-template-columns:120px minmax(0,1fr) 320px;gap:30px;align-items:center;padding:70px 12px 46px}.laneMark{width:104px;height:104px;display:grid;place-items:center;border:1px solid color-mix(in srgb,var(--accent) 64%,transparent);border-radius:28px;color:var(--accent);background:linear-gradient(145deg,color-mix(in srgb,var(--accent) 12%,#071421),#04101b);box-shadow:0 0 50px color-mix(in srgb,var(--accent) 13%,transparent);font:900 32px Georgia,serif}.eyebrow{margin:0;color:var(--accent);font-size:9px;font-weight:950;letter-spacing:.2em;text-transform:uppercase}.hero h1{margin:10px 0 0;font:700 clamp(44px,6vw,82px)/.96 Georgia,serif;letter-spacing:-.05em}.mandate{max-width:900px;margin:20px 0 0;color:#aebfc8;font-size:16px;line-height:1.72}.statusBox{padding:22px;border:1px solid color-mix(in srgb,var(--accent) 22%,rgba(255,255,255,.08));border-radius:22px;background:rgba(7,22,35,.83)}.statusBox>span{color:#718a96;font-size:9px;font-weight:900;letter-spacing:.13em;text-transform:uppercase}.statusBox strong,.bigResult{display:block;margin-top:8px;font-size:30px;letter-spacing:.04em}.statusBox p,.sidePanel>p{color:#9cafb8;font-size:12px;line-height:1.6}.warning{margin-bottom:24px;padding:20px 24px;display:grid;grid-template-columns:230px 1fr;gap:22px;border:1px solid rgba(255,195,91,.18);border-radius:18px;background:linear-gradient(90deg,rgba(255,186,64,.08),rgba(5,17,29,.82))}.warning strong{color:#f7cd75;font:700 19px Georgia,serif}.warning p{margin:0;color:#aebbc2;line-height:1.66}.workspaceGrid{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:20px}.mainColumn,.sideColumn{display:grid;gap:20px;align-content:start}.panel,.sidePanel{border:1px solid rgba(255,255,255,.085);border-radius:24px;background:linear-gradient(145deg,rgba(9,27,43,.92),rgba(4,13,23,.98));box-shadow:0 20px 55px rgba(0,0,0,.25)}.panel{padding:26px}.sidePanel{padding:22px}.sticky{position:sticky;top:88px}.panelHeading{display:flex;gap:17px;align-items:flex-start;margin-bottom:24px}.panelHeading>span{width:42px;height:42px;display:grid;place-items:center;border:1px solid color-mix(in srgb,var(--accent) 40%,transparent);border-radius:12px;color:var(--accent);font-size:10px;font-weight:950}.panel h2{margin:7px 0 0;font:700 28px/1.08 Georgia,serif}.fieldLabel{display:block;margin-bottom:9px;color:#91a5af;font-size:10px;font-weight:900;letter-spacing:.11em;text-transform:uppercase}textarea{width:100%;min-height:135px;resize:vertical;padding:16px;border:1px solid rgba(255,255,255,.11);border-radius:15px;color:#f6fbff;background:#040d16;font:500 15px/1.65 inherit;outline:none}textarea:focus{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 10%,transparent)}.claimFooter{display:flex;justify-content:space-between;margin-top:9px;color:#6f8793;font-size:10px}.claimFooter strong{color:var(--accent)}.evidenceList{display:grid;gap:10px}.evidenceRow{padding:14px 15px;display:flex;align-items:center;justify-content:space-between;gap:15px;border:1px solid rgba(255,255,255,.07);border-radius:14px;background:rgba(255,255,255,.025)}.evidenceRow strong{display:block;font-size:13px}.evidenceRow small{display:block;margin-top:5px;color:#667f8b;font-size:9px;text-transform:uppercase;letter-spacing:.09em}.evidenceRow select{min-width:132px;padding:10px;border:1px solid rgba(255,255,255,.1);border-radius:10px;color:#dceaf0;background:#07131e}.scenarioGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.scenario{text-align:left;padding:17px;border:1px solid rgba(255,255,255,.08);border-radius:16px;color:inherit;background:rgba(255,255,255,.025);cursor:pointer}.scenario:hover,.scenario.active{border-color:color-mix(in srgb,var(--accent) 58%,transparent);background:color-mix(in srgb,var(--accent) 7%,rgba(255,255,255,.02))}.scenario span{font-size:9px;font-weight:950;letter-spacing:.11em}.scenario strong{display:block;margin-top:10px;font-size:14px}.scenario p{margin:8px 0 0;color:#8fa3ad;font-size:11px;line-height:1.55}.challenge{padding:16px;display:flex;gap:13px;border:1px solid rgba(255,255,255,.08);border-radius:15px;background:rgba(255,255,255,.025);cursor:pointer}.challenge input{margin-top:3px;accent-color:var(--accent)}.challenge strong,.challenge small{display:block}.challenge small{margin-top:5px;color:#8398a3;line-height:1.5}.preserveBox{margin-top:14px;padding:18px;display:flex;justify-content:space-between;align-items:center;gap:20px;border:1px solid color-mix(in srgb,var(--accent) 18%,rgba(255,255,255,.06));border-radius:16px;background:linear-gradient(120deg,color-mix(in srgb,var(--accent) 6%,transparent),rgba(0,0,0,.12))}.preserveBox h3{margin:7px 0;font:700 20px Georgia,serif}.preserveBox p:not(.eyebrow){max-width:700px;margin:0;color:#849aa5;font-size:11px;line-height:1.55}.sidePanel dl{margin:20px 0 0}.sidePanel dl div{padding:11px 0;display:flex;justify-content:space-between;gap:15px;border-top:1px solid rgba(255,255,255,.065)}dt{color:#748b96;font-size:10px}dd{margin:0;text-align:right;font-size:10px;font-weight:800}.gate{padding:15px 0;border-top:1px solid rgba(255,255,255,.065)}.gate:first-of-type{margin-top:15px}.gate strong{color:#eaf4f8;font-size:12px}.gate p{margin:7px 0 0;color:#8499a4;font-size:11px;line-height:1.55}.sidePanel ul{margin:15px 0 0;padding:0;list-style:none}.sidePanel li{padding:11px 0 11px 19px;position:relative;border-top:1px solid rgba(255,255,255,.065);color:#91a4ae;font-size:11px;line-height:1.5}.sidePanel li:before{content:"×";position:absolute;left:0;color:#ff9f91;font-weight:900}[data-result="ALLOW"]{color:#77efb2}[data-result="HOLD"]{color:#ffd277}[data-result="DENY"]{color:#ff8d83}[data-result="ESCALATE"]{color:#c5a5ff}footer{margin-top:24px;padding:25px 28px;display:flex;justify-content:space-between;align-items:center;gap:20px;border:1px solid rgba(255,255,255,.08);border-radius:20px;background:rgba(4,15,26,.85)}footer strong{font:700 19px Georgia,serif}footer p{margin:7px 0 0;color:#788f9a;font-size:11px}footer a{color:var(--accent);font-size:10px;font-weight:950;letter-spacing:.08em;text-transform:uppercase;text-decoration:none}@media(max-width:1100px){.hero{grid-template-columns:100px 1fr}.statusBox{grid-column:1/-1}.workspaceGrid{grid-template-columns:1fr}.sticky{position:static}.sideColumn{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:760px){.shell{width:min(100% - 22px,1500px)}.topbar,.warning,.preserveBox,footer{align-items:stretch;flex-direction:column}.topbar{position:static}.hero{grid-template-columns:1fr;padding-top:45px}.laneMark{width:82px;height:82px}.warning{display:flex}.scenarioGrid,.sideColumn{grid-template-columns:1fr}.evidenceRow{align-items:stretch;flex-direction:column}.evidenceRow select{width:100%}.panel{padding:19px}.hero h1{font-size:44px}}
      `}</style>
    </main>
  );
}
