'use client';

import { useState } from 'react';
import Link from 'next/link';

type MovementId = 'truth' | 'commit' | 'future';

type CanonicalLink = {
  number: string;
  name: string;
  movement: MovementId;
  statement: string;
  detail: string;
  proof: string;
  failure: string;
};

type RuntimeControl = {
  name: string;
  detail: string;
  supports: string;
};

type Decision = {
  state: 'ALLOW' | 'HOLD' | 'DENY' | 'ESCALATE';
  color: 'green' | 'gold' | 'red' | 'blue';
  headline: string;
  description: string;
};

const chainMovements: Array<{
  id: MovementId;
  range: string;
  title: string;
  subtitle: string;
  description: string;
}> = [
  {
    id: 'truth',
    range: '01-06',
    title: 'Reality to Truth',
    subtitle: 'Establish the factual spine.',
    description:
      'Reality becomes a governed record, continuity is preserved, evidence is governed, and only evidence fit for the route may support admissible truth.',
  },
  {
    id: 'commit',
    range: '07-15',
    title: 'Reliance to Commit',
    subtitle: 'Establish permission to matter.',
    description:
      'Reliance, authority, legitimacy, consequence formation, assent, binding reality, binding, and commit reality converge into one exact committed route.',
  },
  {
    id: 'future',
    range: '16-24',
    title: 'Execution to Future Chain',
    subtitle: 'Preserve consequence and inheritance.',
    description:
      'Execution reality, governed non-occurrence, prevented consequence, execution, outcome, new reality, memory, and future-chain reliance remain reconstructable.',
  },
];

const canonicalChain: CanonicalLink[] = [
  {
    number: '01',
    name: 'Reality',
    movement: 'truth',
    statement: 'What actually exists before interpretation, policy, or representation.',
    detail:
      'Reality is the condition, event, object, environment, transaction, system state, or human circumstance from which the route begins. TA-14 does not permit the record to replace the thing the record claims to describe.',
    proof:
      'A bounded statement of the actual condition, including the time, place, object, environment, and relevant actors.',
    failure:
      'The route begins from assumption, simulation, stale state, or an unverified claim presented as fact.',
  },
  {
    number: '02',
    name: 'Record',
    movement: 'truth',
    statement: 'Reality must become inspectable without losing its identity.',
    detail:
      'Measurements, documents, sensor output, identity records, images, video, testimony, system events, timestamps, and other observations are captured as bounded records that can be examined and referenced.',
    proof:
      'A retrievable record with stable identity, content, timestamps, scope, and a defined relationship to the observed reality.',
    failure:
      'The route relies on an undocumented event, an unverifiable summary, or a record that cannot be inspected.',
  },
  {
    number: '03',
    name: 'Continuity',
    movement: 'truth',
    statement: 'The record must remain connected to its origin and history.',
    detail:
      'Continuity preserves provenance, custody, sequence, timestamps, version history, freshness, alteration status, and the relationship between the record and the reality it represents.',
    proof:
      'A reconstructable chain showing where the record came from, how it changed, who handled it, and whether it remains current.',
    failure:
      'The route contains unexplained gaps, broken custody, silent edits, stale evidence, or a record detached from its source.',
  },
  {
    number: '04',
    name: 'Evidence Governance',
    movement: 'truth',
    statement: 'Evidence must be governed before it can govern consequence.',
    detail:
      'Rules for capture, provenance, integrity, freshness, access, retention, contradiction, privacy, use, and review determine how each evidence object may participate in the route.',
    proof:
      'Declared evidence rules and controls applied to every required evidence object before the route relies on it.',
    failure:
      'Evidence is collected or used without defined custody, integrity, access, freshness, contradiction, or retention rules.',
  },
  {
    number: '05',
    name: 'Admissible Evidence',
    movement: 'truth',
    statement: 'Available evidence is not automatically fit for this consequence.',
    detail:
      'The route determines whether required evidence is authentic enough, relevant, complete, current, sufficient, within scope, and free of unresolved contradictions for the exact consequence being considered.',
    proof:
      'An explicit determination showing which evidence requirements passed, failed, remained incomplete, or required escalation.',
    failure:
      'Evidence exists but is insufficient, irrelevant, expired, contradictory, incomplete, or outside the route boundary.',
  },
  {
    number: '06',
    name: 'Admissible Truth',
    movement: 'truth',
    statement: 'Only bounded truth established by admissible evidence may support reliance.',
    detail:
      'Admissible truth is not a universal claim. It is the limited factual position the route can legitimately rely upon after evidence governance and admissibility have been applied.',
    proof:
      'A bounded truth statement tied to the admitted evidence, declared uncertainty, limitations, and route purpose.',
    failure:
      'The route converts partial evidence, inference, confidence, or institutional preference into certainty it has not earned.',
  },
  {
    number: '07',
    name: 'Reliance',
    movement: 'commit',
    statement: 'The route must declare who or what intends to depend on the established truth.',
    detail:
      'Reliance identifies the actor, system, institution, agent, reviewer, or execution layer that proposes to use admissible truth to form a consequential decision or action.',
    proof:
      'A named relying party, declared purpose, exact dependency, and the limits under which the truth will be used.',
    failure:
      'A system acts on evidence or truth without identifying the party, purpose, dependency, or boundary of reliance.',
  },
  {
    number: '08',
    name: 'Authority',
    movement: 'commit',
    statement: 'Capability to act is not authority to create consequence.',
    detail:
      'TA-14 identifies the legal, institutional, contractual, professional, delegated, technical, or personal authority that permits the accountable actor or system to participate in the exact route.',
    proof:
      'Current authority tied to an identified actor, source, scope, effective period, organization, system, and proposed consequence.',
    failure:
      'Authority is missing, expired, revoked, borrowed, outside scope, attached to another actor, or unrelated to the proposed route.',
  },
  {
    number: '09',
    name: 'Legitimacy',
    movement: 'commit',
    statement: 'Valid authority must still be exercised for a legitimate purpose and route.',
    detail:
      'Legitimacy tests whether identity, authority, purpose, policy, scope, process, evidence, affected interests, and governing boundaries align well enough for the proposed consequence to proceed.',
    proof:
      'A route-level determination that the exercise of authority is proper, attributable, bounded, and consistent with governing obligations.',
    failure:
      'A technically authorized actor uses authority for an improper purpose, outside required process, or against a governing boundary.',
  },
  {
    number: '10',
    name: 'Consequence Formation',
    movement: 'commit',
    statement: 'The proposed consequence must become an exact object before approval.',
    detail:
      'The route defines what will happen, to whom or what, for what value, through which tool or system, at which destination, under what timing, and with what expected outcome.',
    proof:
      'A complete consequence object with stable identity, payload, destination, beneficiary, value, timing, environment, and expected effect.',
    failure:
      'Approval is sought for a vague intention, open-ended capability, undefined destination, mutable payload, or unspecified outcome.',
  },
  {
    number: '11',
    name: 'Attachment / Assent',
    movement: 'commit',
    statement: 'Required parties must knowingly attach to the consequence and its boundaries.',
    detail:
      'Where the route requires consent, acceptance, certification, acknowledgment, professional sign-off, institutional assent, or accountable attachment, that act must bind to the exact consequence object.',
    proof:
      'A attributable act of attachment or assent tied to the route identity, object, scope, limitations, and time.',
    failure:
      'Consent or approval is generic, implied, stale, coerced, detached from the object, or supplied by the wrong party.',
  },
  {
    number: '12',
    name: 'Binding Reality',
    movement: 'commit',
    statement: 'The real actors, objects, systems, and destinations to be bound must actually correspond.',
    detail:
      'Before formal binding, TA-14 tests the current reality of the actor, beneficiary, destination, asset, tool, model, environment, payment object, and other elements that will carry consequence.',
    proof:
      'Current correspondence between declared route elements and the actual entities, systems, objects, and environments that exist at binding time.',
    failure:
      'The route attempts to bind aliases, substituted objects, stale identities, unverified destinations, or entities that do not correspond to reality.',
  },
  {
    number: '13',
    name: 'Binding',
    movement: 'commit',
    statement: 'Every admitted dependency must bind to one exact route.',
    detail:
      'Evidence, admissible truth, reliance, actor identity, authority, policy, assent, payload, beneficiary, destination, tool, model, environment, and intended consequence are attached to one route identity.',
    proof:
      'A complete binding map showing that each required dependency points to the same exact route and consequence object.',
    failure:
      'A valid element is attached to the wrong route, wrong actor, wrong object, wrong destination, wrong environment, or wrong consequence.',
  },
  {
    number: '14',
    name: 'Commit Reality',
    movement: 'commit',
    statement: 'The route prepared for commitment must still match the admissible bound route.',
    detail:
      'Immediately before commitment, TA-14 verifies the actual payload, parameters, destination, beneficiary, tool, model, environment, authority state, timing, and route version that are about to be frozen.',
    proof:
      'A pre-commit correspondence check showing that the executable object is still the object that passed admissibility and binding.',
    failure:
      'The executable object changed after approval, a parameter drifted, a destination was swapped, or the commit candidate no longer corresponds.',
  },
  {
    number: '15',
    name: 'Commit',
    movement: 'commit',
    statement: 'The admissible route must be frozen before execution can occur.',
    detail:
      'Commit creates the immutable or tamper-evident execution manifest against which the runtime event will be tested. Silent substitution, expansion, redirection, or rewriting must become detectable.',
    proof:
      'A stable commit identity or hash covering the exact route version, payload, dependencies, authority, destination, environment, and timing.',
    failure:
      'Execution can proceed from an uncommitted object, mutable approval, altered payload, or route that can be silently rewritten.',
  },
  {
    number: '16',
    name: 'Execution Reality',
    movement: 'future',
    statement: 'The actual runtime state must correspond to the committed route.',
    detail:
      'Execution reality examines the live system, actor, tool, model, environment, destination, credentials, timing, controls, and reachable capabilities immediately before consequence is created.',
    proof:
      'A runtime-state record demonstrating correspondence between the committed route and the actual execution environment.',
    failure:
      'The live environment differs from the committed environment, credentials changed, a tool was substituted, or unapproved capability became reachable.',
  },
  {
    number: '17',
    name: 'Admissible Non-Occurrence',
    movement: 'future',
    statement: 'When the route is not admissible, non-execution is a governed result.',
    detail:
      'TA-14 recognizes that the correct consequence may be no consequence. A HOLD, DENY, or unresolved ESCALATE must preserve the route while preventing execution from being treated as inevitable.',
    proof:
      'A recorded decision and technical state showing that non-occurrence was required, attributable, preserved, and not mistaken for system failure.',
    failure:
      'A stopped route is treated as an error to bypass, or the absence of execution is not preserved as an accountable outcome.',
  },
  {
    number: '18',
    name: 'Prevented Consequence',
    movement: 'future',
    statement: 'A prohibited or incomplete route must remain unable to create consequence.',
    detail:
      'The architecture records whether the governing decision actually prevented the consequence, including bypass attempts, alternate paths, replay, duplicate execution, and unauthorized substitution.',
    proof:
      'Evidence that the blocked route was technically unreachable and that no parallel or bypass path created the prohibited consequence.',
    failure:
      'The interface says HOLD or DENY while another endpoint, tool, credential, replay, or manual path still creates the consequence.',
  },
  {
    number: '19',
    name: 'Execution',
    movement: 'future',
    statement: 'Only the committed route may create the authorized consequence.',
    detail:
      'Execution is the consequence-bearing event. It must occur through the committed route, under the approved identity, authority, policy, payload, destination, environment, timing, and controls.',
    proof:
      'An execution receipt tied to the commit, route identity, actor, system, time, destination, object, and actual consequence event.',
    failure:
      'The action occurs outside the committed route, under different authority, through another tool, at another destination, or without required receipts.',
  },
  {
    number: '20',
    name: 'Outcome Reality',
    movement: 'future',
    statement: 'The actual result exists independently of what the route expected or reported.',
    detail:
      'Outcome reality captures the real post-execution state, including what changed, what did not change, who or what was affected, and which observations establish the result.',
    proof:
      'A bounded observation of the actual post-execution condition with provenance, timing, scope, and correspondence to the route.',
    failure:
      'The route substitutes expected output, system acknowledgment, or self-reported success for evidence of the actual result.',
  },
  {
    number: '21',
    name: 'Outcome',
    movement: 'future',
    statement: 'The actual result must be compared with the committed consequence.',
    detail:
      'TA-14 evaluates correspondence between intended and actual outcomes, preserves deviations and adverse results, and attributes the result to the route without rewriting the original decision.',
    proof:
      'A comparison record connecting expected outcome, actual outcome, deviations, attribution, limitations, and required follow-up.',
    failure:
      'The outcome is omitted, selectively described, detached from the route, or used to retroactively alter the evidence or decision that preceded execution.',
  },
  {
    number: '22',
    name: 'New Reality',
    movement: 'future',
    statement: 'Every consequence changes the factual baseline for what comes next.',
    detail:
      'The outcome becomes part of the world or system state. TA-14 treats that changed condition as new reality rather than allowing the route to end at a receipt or dashboard status.',
    proof:
      'A defined post-consequence baseline identifying the new condition, affected entities, changed dependencies, and unresolved effects.',
    failure:
      'The route closes without recognizing the changed state, downstream obligations, residual risk, or new evidence created by the consequence.',
  },
  {
    number: '23',
    name: 'Memory',
    movement: 'future',
    statement: 'The route must remain reconstructable after people, systems, and vendors change.',
    detail:
      'Memory preserves route identity, records, versions, decisions, corrections, signatures, manifests, receipts, limitations, execution, outcome, and the history needed for later review or challenge.',
    proof:
      'Durable, attributable, tamper-evident records that can be retrieved and interpreted without depending on the original interface or operator.',
    failure:
      'The route survives only as dashboard state, ephemeral logs, vendor-controlled context, or institutional recollection.',
  },
  {
    number: '24',
    name: 'Future Chain',
    movement: 'future',
    statement: 'Future reliance must inherit verified history, not convenient assumptions.',
    detail:
      'The preserved route, its limitations, outcome, new reality, and memory become governed inputs to later decisions. Future chains must know what may be inherited, challenged, expired, or re-established.',
    proof:
      'A defined inheritance boundary showing which facts, authorities, records, outcomes, limitations, and unresolved conditions may support a subsequent route.',
    failure:
      'A later system treats prior execution, status, reputation, or success as permanent authority or proof without re-establishing admissibility.',
  },
];

const runtimeControls: RuntimeControl[] = [
  {
    name: 'Route identity',
    detail:
      'The exact consequential route has a stable identity that survives evaluation, correction, commitment, execution, and preservation.',
    supports: 'Record · Binding · Commit · Memory',
  },
  {
    name: 'Actor identity',
    detail:
      'The accountable human, system, agent, or institution participating in the route is identified and attributable.',
    supports: 'Reliance · Authority · Legitimacy · Binding',
  },
  {
    name: 'Organization identity',
    detail:
      'The organization or institutional boundary under which the route operates is established and connected to the actor and system.',
    supports: 'Authority · Legitimacy · Binding Reality',
  },
  {
    name: 'Authority source',
    detail:
      'The route identifies where authority comes from rather than treating possession of capability or credentials as permission.',
    supports: 'Authority · Legitimacy',
  },
  {
    name: 'Authority validity',
    detail:
      'Authority is current, active, correctly delegated, within scope, and attached to the accountable actor and exact route.',
    supports: 'Authority · Legitimacy · Binding',
  },
  {
    name: 'Policy applicability',
    detail:
      'The governing policy actually applies to this actor, system, object, consequence, jurisdiction, time, and environment.',
    supports: 'Evidence Governance · Legitimacy',
  },
  {
    name: 'Evidence existence',
    detail:
      'Every required evidence object exists and can be inspected rather than merely referenced by name or assumption.',
    supports: 'Record · Admissible Evidence',
  },
  {
    name: 'Evidence freshness',
    detail:
      'Evidence remains temporally valid for the route and has not expired or become detached from the current reality.',
    supports: 'Continuity · Admissible Evidence',
  },
  {
    name: 'Evidence provenance',
    detail:
      'The origin, capture method, creator, custody, transformations, and relationship to reality are reconstructable.',
    supports: 'Continuity · Evidence Governance',
  },
  {
    name: 'Evidence integrity',
    detail:
      'Required records are complete enough and protected against undetected alteration, substitution, or corruption.',
    supports: 'Continuity · Evidence Governance · Admissible Evidence',
  },
  {
    name: 'Required completeness',
    detail:
      'All mandatory evidence and route dependencies are present before the route claims admissibility.',
    supports: 'Admissible Evidence · Admissible Truth',
  },
  {
    name: 'Contradiction review',
    detail:
      'Material conflicts are surfaced, evaluated, resolved, or escalated instead of being hidden inside a generic score.',
    supports: 'Admissible Evidence · Admissible Truth',
  },
  {
    name: 'Scope boundary',
    detail:
      'The route defines what is included, excluded, permitted, prohibited, and unresolved for this specific consequence.',
    supports: 'Reliance · Authority · Legitimacy',
  },
  {
    name: 'Object binding',
    detail:
      'Evidence, authority, policy, and approvals point to the exact consequential object rather than a category or intention.',
    supports: 'Consequence Formation · Binding Reality · Binding',
  },
  {
    name: 'Beneficiary binding',
    detail:
      'The actual recipient or affected beneficiary corresponds to the beneficiary approved within the route.',
    supports: 'Binding Reality · Binding · Commit Reality',
  },
  {
    name: 'Destination binding',
    detail:
      'The approved endpoint, account, system, address, environment, or recipient remains the actual execution destination.',
    supports: 'Binding Reality · Binding · Execution Reality',
  },
  {
    name: 'Tool and model binding',
    detail:
      'The exact tool, model, version, capability, and configuration used for execution correspond to the governed route.',
    supports: 'Binding · Commit Reality · Execution Reality',
  },
  {
    name: 'Environment binding',
    detail:
      'The production, test, physical, legal, technical, or operational environment matches the environment that was governed.',
    supports: 'Binding Reality · Commit Reality · Execution Reality',
  },
  {
    name: 'Commit correspondence',
    detail:
      'The object presented for execution is identical to the object frozen in the committed route manifest.',
    supports: 'Commit Reality · Commit · Execution',
  },
  {
    name: 'Temporal validity',
    detail:
      'Evidence, authority, policy, assent, commit, and execution remain valid at the time consequence is created.',
    supports: 'Continuity · Authority · Execution Reality',
  },
  {
    name: 'Required receipts',
    detail:
      'The route produces the decision, correction, commitment, execution, outcome, and other receipts required by its boundary.',
    supports: 'Commit · Execution · Outcome · Memory',
  },
  {
    name: 'Bypass resistance',
    detail:
      'A HOLD, DENY, or unresolved ESCALATE cannot be defeated through another endpoint, credential, replay, tool, or manual path.',
    supports: 'Admissible Non-Occurrence · Prevented Consequence',
  },
  {
    name: 'Execution correspondence',
    detail:
      'The actual consequence-bearing event matches the committed route, actor, authority, object, destination, and environment.',
    supports: 'Execution Reality · Execution',
  },
  {
    name: 'Outcome correspondence',
    detail:
      'The real result is captured and compared with the intended consequence, with deviations and limitations preserved.',
    supports: 'Outcome Reality · Outcome · New Reality · Memory',
  },
];

const decisions: Decision[] = [
  {
    state: 'ALLOW',
    color: 'green',
    headline: 'The bounded route satisfies every mandatory requirement.',
    description:
      'ALLOW does not mean the world is safe, perfect, or risk-free. It means the exact route, under the exact declared scope, satisfied the requirements necessary to proceed.',
  },
  {
    state: 'HOLD',
    color: 'gold',
    headline: 'The route is incomplete but may be corrected.',
    description:
      'HOLD protects the route while preserving the opportunity to supply missing evidence, repair continuity, renew authority, correct binding, or resolve another remediable deficiency.',
  },
  {
    state: 'DENY',
    color: 'red',
    headline: 'The route cannot legitimately proceed.',
    description:
      'DENY applies when a prohibited condition exists, authority is invalid, evidence contradicts execution, the route violates a governing boundary, or correction cannot cure the defect.',
  },
  {
    state: 'ESCALATE',
    color: 'blue',
    headline: 'The route requires accountable higher review.',
    description:
      'ESCALATE moves the route to a qualified human, institutional, legal, technical, medical, or specialized authority without pretending the unresolved issue has disappeared.',
  },
];

const records = [
  {
    title: 'Decision Receipt',
    code: 'TA14-DR',
    description:
      'The signed result of a route evaluation, including state, findings, governing requirements, boundaries, timestamps, and correction instructions.',
  },
  {
    title: 'Admissible Execution Record',
    code: 'TA14-AER',
    description:
      'The preserved route record connecting evidence, authority, policy, binding, commit, execution, outcome, limitations, and essential history.',
  },
  {
    title: 'Route Identity',
    code: 'TA14-RID',
    description:
      'A stable identity for one consequential route so its record can be referenced, preserved, retrieved, challenged, and independently examined.',
  },
  {
    title: 'Replay Package',
    code: 'TA14-RP',
    description:
      'A verification package that allows an independent reviewer to reconstruct and test whether the preserved route corresponds to the decision and consequence.',
  },
];

export default function ArchitecturePage() {
  const [activeChain, setActiveChain] = useState(0);
  const [activeDecision, setActiveDecision] = useState(0);
  const [expandedControl, setExpandedControl] = useState<number | null>(null);

  const activeLink = canonicalChain[activeChain];
  const activeMovement =
    chainMovements.find((movement) => movement.id === activeLink.movement) ??
    chainMovements[0];

  function selectMovement(id: MovementId) {
    const firstIndex = canonicalChain.findIndex((link) => link.movement === id);

    if (firstIndex >= 0) {
      setActiveChain(firstIndex);
    }
  }

  function selectPreviousLink() {
    setActiveChain((current) =>
      current === 0 ? canonicalChain.length - 1 : current - 1,
    );
  }

  function selectNextLink() {
    setActiveChain((current) =>
      current === canonicalChain.length - 1 ? 0 : current + 1,
    );
  }

  return (
    <>
      <style>{`
        :root {
          --background: #02050a;
          --background-soft: #07101a;
          --panel: rgba(9, 18, 30, 0.74);
          --panel-strong: rgba(7, 14, 24, 0.95);
          --line: rgba(129, 178, 230, 0.15);
          --line-bright: rgba(84, 232, 255, 0.34);
          --text: #f4f8ff;
          --muted: #91a5ba;
          --blue: #29a7ff;
          --cyan: #54e8ff;
          --green: #39f2a1;
          --red: #ff456b;
          --gold: #ffd46a;
          --violet: #a98cff;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          color: var(--text);
          background:
            radial-gradient(circle at 10% 8%, rgba(41, 167, 255, 0.15), transparent 28%),
            radial-gradient(circle at 88% 18%, rgba(57, 242, 161, 0.08), transparent 27%),
            radial-gradient(circle at 50% 100%, rgba(169, 140, 255, 0.08), transparent 34%),
            linear-gradient(180deg, #02050a 0%, #06101b 52%, #02050a 100%);
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        button,
        a {
          font: inherit;
        }

        a {
          color: inherit;
        }

        .architecture-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
        }

        .architecture-page::before {
          content: "";
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.24;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 38px 38px;
          mask-image: linear-gradient(to bottom, black, transparent 94%);
        }

        .container {
          position: relative;
          z-index: 2;
          width: min(1220px, 92vw);
          margin: 0 auto;
        }

        .navigation {
          position: sticky;
          top: 0;
          z-index: 100;
          border-bottom: 1px solid var(--line);
          background: rgba(3, 7, 13, 0.8);
          backdrop-filter: blur(22px);
        }

        .navigation-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 72px;
          gap: 24px;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: white;
          text-decoration: none;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .brand-mark {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          border: 1px solid rgba(84, 232, 255, 0.4);
          border-radius: 14px;
          color: var(--cyan);
          background:
            linear-gradient(145deg, rgba(41, 167, 255, 0.18), rgba(57, 242, 161, 0.07));
          box-shadow:
            0 0 26px rgba(84, 232, 255, 0.17),
            inset 0 0 18px rgba(255,255,255,0.05);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 22px;
        }

        .nav-links a {
          color: var(--muted);
          text-decoration: none;
          font-size: 14px;
          transition: color 180ms ease;
        }

        .nav-links a:hover {
          color: white;
        }

        .nav-button,
        .primary-button,
        .secondary-button,
        .link-step-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border-radius: 14px;
          padding: 13px 20px;
          border: 0;
          cursor: pointer;
          text-decoration: none;
          font-weight: 850;
          transition:
            transform 180ms ease,
            box-shadow 180ms ease,
            border-color 180ms ease,
            background 180ms ease;
        }

        .nav-button:hover,
        .primary-button:hover,
        .secondary-button:hover,
        .link-step-button:hover {
          transform: translateY(-2px);
        }

        .nav-button,
        .primary-button {
          color: #03110c !important;
          background: linear-gradient(90deg, var(--cyan), var(--green));
          box-shadow:
            0 0 30px rgba(84, 232, 255, 0.2),
            0 0 46px rgba(57, 242, 161, 0.08);
        }

        .secondary-button,
        .link-step-button {
          color: white;
          border: 1px solid var(--line);
          background: rgba(255,255,255,0.04);
        }

        .hero {
          display: grid;
          grid-template-columns: 1.08fr 0.92fr;
          align-items: center;
          min-height: 84vh;
          padding: 100px 0 78px;
          gap: 56px;
        }

        .eyebrow {
          color: var(--cyan);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .hero h1 {
          max-width: 840px;
          margin: 17px 0 24px;
          font-size: clamp(58px, 7.8vw, 104px);
          line-height: 0.91;
          letter-spacing: -0.062em;
        }

        .hero-gradient {
          color: transparent;
          background:
            linear-gradient(
              90deg,
              #ffffff 0%,
              var(--cyan) 34%,
              var(--green) 68%,
              #ffffff 100%
            );
          background-clip: text;
          -webkit-background-clip: text;
        }

        .hero-copy {
          max-width: 760px;
          color: #b1c1d3;
          font-size: 20px;
          line-height: 1.7;
        }

        .hero-note {
          max-width: 730px;
          margin-top: 20px;
          padding: 15px 17px;
          border: 1px solid rgba(255, 212, 106, 0.15);
          border-radius: 14px;
          color: #c9bd96;
          background: rgba(255, 212, 106, 0.045);
          font-size: 14px;
          line-height: 1.65;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 13px;
          margin-top: 30px;
        }

        .hero-visual {
          position: relative;
          display: grid;
          place-items: center;
          min-height: 540px;
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 38px;
          background:
            radial-gradient(circle at center, rgba(41,167,255,0.15), transparent 35%),
            linear-gradient(145deg, rgba(255,255,255,0.045), rgba(255,255,255,0.012));
          box-shadow:
            0 0 80px rgba(41,167,255,0.12),
            inset 0 0 90px rgba(41,167,255,0.025);
        }

        .hero-visual::after {
          content: "";
          position: absolute;
          inset: 18px;
          border: 1px solid rgba(255,255,255,0.035);
          border-radius: 28px;
        }

        .orbit {
          position: absolute;
          border: 1px solid rgba(84,232,255,0.22);
          border-radius: 50%;
          animation: orbitSpin 20s linear infinite;
        }

        .orbit-one {
          width: 410px;
          height: 410px;
        }

        .orbit-two {
          width: 315px;
          height: 315px;
          border-color: rgba(57,242,161,0.24);
          animation-direction: reverse;
          animation-duration: 14s;
        }

        .orbit-three {
          width: 440px;
          height: 160px;
          border-color: rgba(169,140,255,0.22);
          transform: rotate(28deg);
          animation: orbitPulse 4s ease-in-out infinite alternate;
        }

        .architecture-core {
          position: relative;
          z-index: 4;
          display: grid;
          place-items: center;
          width: 192px;
          height: 192px;
          border-radius: 50%;
          text-align: center;
          font-weight: 950;
          letter-spacing: 0.1em;
          background:
            radial-gradient(circle at 34% 27%, #ffffff 0 2%, var(--cyan) 4%, #0c4a7e 34%, #061321 68%);
          box-shadow:
            0 0 70px rgba(41,167,255,0.5),
            0 0 125px rgba(57,242,161,0.12),
            inset 0 0 38px rgba(255,255,255,0.23);
        }

        .core-label {
          position: absolute;
          z-index: 5;
          padding: 9px 12px;
          border: 1px solid var(--line);
          border-radius: 999px;
          color: #a9bbcd;
          background: rgba(3,8,14,0.84);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .label-one { left: 8%; top: 20%; }
        .label-two { right: 8%; top: 23%; }
        .label-three { right: 9%; bottom: 21%; }
        .label-four { left: 8%; bottom: 18%; }
        .label-five { top: 8%; left: 50%; transform: translateX(-50%); }
        .label-six { bottom: 7%; left: 50%; transform: translateX(-50%); }

        .visual-count {
          position: absolute;
          z-index: 5;
          top: 28px;
          left: 30px;
          color: rgba(255,255,255,0.13);
          font-size: 88px;
          font-weight: 950;
          letter-spacing: -0.08em;
        }

        @keyframes orbitSpin {
          to { transform: rotate(360deg); }
        }

        @keyframes orbitPulse {
          from {
            opacity: 0.38;
            transform: rotate(28deg) scale(0.96);
          }
          to {
            opacity: 0.9;
            transform: rotate(28deg) scale(1.04);
          }
        }

        .section {
          padding: 96px 0;
          scroll-margin-top: 72px;
        }

        .section-heading {
          max-width: 900px;
          margin-bottom: 38px;
        }

        .section-heading h2 {
          margin: 11px 0 15px;
          font-size: clamp(40px, 5.6vw, 68px);
          line-height: 1;
          letter-spacing: -0.048em;
        }

        .section-heading p {
          margin: 0;
          color: var(--muted);
          font-size: 18px;
          line-height: 1.72;
        }

        .movement-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 24px;
        }

        .movement-card {
          min-height: 210px;
          padding: 24px;
          border: 1px solid var(--line);
          border-radius: 22px;
          color: white;
          text-align: left;
          background: rgba(255,255,255,0.025);
          cursor: pointer;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease,
            box-shadow 180ms ease;
        }

        .movement-card:hover,
        .movement-card.active {
          transform: translateY(-4px);
          border-color: rgba(84,232,255,0.3);
          box-shadow: 0 22px 56px rgba(0,0,0,0.2);
        }

        .movement-card.truth.active {
          background: linear-gradient(145deg, rgba(41,167,255,0.11), rgba(84,232,255,0.025));
        }

        .movement-card.commit.active {
          background: linear-gradient(145deg, rgba(169,140,255,0.12), rgba(41,167,255,0.025));
        }

        .movement-card.future.active {
          background: linear-gradient(145deg, rgba(57,242,161,0.1), rgba(84,232,255,0.025));
        }

        .movement-range {
          color: var(--cyan);
          font-family: monospace;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.14em;
        }

        .movement-card h3 {
          margin: 17px 0 8px;
          font-size: 25px;
          letter-spacing: -0.025em;
        }

        .movement-card strong {
          display: block;
          margin-bottom: 10px;
          color: #dbe9f6;
          font-size: 14px;
        }

        .movement-card p {
          margin: 0;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.62;
        }

        .canonical-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.3fr) minmax(350px, 0.7fr);
          gap: 20px;
          align-items: start;
        }

        .chain-map,
        .chain-detail {
          border: 1px solid var(--line);
          border-radius: 26px;
          background: var(--panel);
          backdrop-filter: blur(16px);
        }

        .chain-map {
          display: grid;
          gap: 18px;
          padding: 18px;
        }

        .movement-block {
          padding: 17px;
          border: 1px solid rgba(255,255,255,0.055);
          border-radius: 19px;
          background: rgba(3,8,14,0.32);
        }

        .movement-block-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 13px;
        }

        .movement-block-head strong {
          font-size: 15px;
        }

        .movement-block-head span {
          color: #6f879d;
          font-family: monospace;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .movement-links {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 9px;
        }

        .chain-button {
          display: grid;
          grid-template-columns: 34px 1fr;
          align-items: center;
          min-height: 68px;
          padding: 12px;
          gap: 10px;
          border: 1px solid transparent;
          border-radius: 14px;
          color: var(--muted);
          background: rgba(255,255,255,0.018);
          text-align: left;
          cursor: pointer;
          transition:
            color 180ms ease,
            background 180ms ease,
            border-color 180ms ease,
            transform 180ms ease;
        }

        .chain-button:hover {
          color: white;
          background: rgba(255,255,255,0.04);
        }

        .chain-button.active {
          color: white;
          border-color: rgba(84,232,255,0.25);
          background: linear-gradient(90deg, rgba(41,167,255,0.12), rgba(57,242,161,0.04));
          transform: translateY(-2px);
        }

        .chain-number {
          color: var(--cyan);
          font-family: monospace;
          font-size: 11px;
          font-weight: 900;
        }

        .chain-name {
          font-size: 13px;
          font-weight: 850;
          line-height: 1.28;
        }

        .chain-detail {
          position: sticky;
          top: 94px;
          min-height: 650px;
          overflow: hidden;
          padding: 34px;
        }

        .chain-detail::after {
          content: attr(data-number);
          position: absolute;
          right: -12px;
          bottom: -64px;
          z-index: 0;
          color: rgba(255,255,255,0.028);
          font-size: 250px;
          line-height: 1;
          font-weight: 950;
          letter-spacing: -0.09em;
        }

        .chain-detail > * {
          position: relative;
          z-index: 1;
        }

        .detail-topline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .detail-number {
          color: var(--cyan);
          font-family: monospace;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.16em;
        }

        .movement-pill {
          display: inline-flex;
          min-height: 29px;
          align-items: center;
          padding: 0 10px;
          border: 1px solid rgba(84,232,255,0.18);
          border-radius: 999px;
          color: #a5bed2;
          background: rgba(3,8,14,0.46);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .chain-detail h3 {
          margin: 22px 0 14px;
          font-size: clamp(46px, 5.6vw, 76px);
          line-height: 0.94;
          letter-spacing: -0.055em;
        }

        .detail-statement {
          margin: 0 0 18px;
          color: white;
          font-size: 20px;
          line-height: 1.45;
        }

        .detail-copy {
          margin: 0;
          color: var(--muted);
          font-size: 16px;
          line-height: 1.72;
        }

        .detail-proof-grid {
          display: grid;
          gap: 10px;
          margin-top: 24px;
        }

        .detail-proof {
          padding: 15px;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          background: rgba(3,8,14,0.38);
        }

        .detail-proof strong {
          display: block;
          margin-bottom: 7px;
          color: var(--cyan);
          font-size: 10px;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .detail-proof.failure strong {
          color: #ff8ca3;
        }

        .detail-proof span {
          color: #9fb1c3;
          font-size: 13px;
          line-height: 1.58;
        }

        .detail-controls {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-top: 24px;
        }

        .link-step-button {
          min-width: 120px;
          padding: 11px 15px;
          border-radius: 12px;
          font-size: 13px;
        }

        .architecture-distinction {
          margin-bottom: 26px;
          padding: 22px 24px;
          border: 1px solid rgba(255,212,106,0.16);
          border-radius: 18px;
          color: #c7ba91;
          background: rgba(255,212,106,0.045);
          line-height: 1.7;
        }

        .architecture-distinction strong {
          color: #f4e5b0;
        }

        .control-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .control-card {
          position: relative;
          min-height: 154px;
          overflow: hidden;
          padding: 18px;
          border: 1px solid var(--line);
          border-radius: 18px;
          color: white;
          background: rgba(255,255,255,0.025);
          text-align: left;
          cursor: pointer;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease,
            box-shadow 180ms ease;
        }

        .control-card:hover,
        .control-card.expanded {
          transform: translateY(-4px);
          border-color: rgba(84,232,255,0.3);
          background: rgba(84,232,255,0.045);
          box-shadow: 0 18px 46px rgba(0,0,0,0.2);
        }

        .control-index {
          color: var(--cyan);
          font-family: monospace;
          font-size: 11px;
          font-weight: 900;
        }

        .control-state {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--green);
          box-shadow: 0 0 13px var(--green);
        }

        .control-title {
          display: block;
          margin-top: 20px;
          font-weight: 850;
          line-height: 1.35;
        }

        .control-expanded-copy {
          display: grid;
          gap: 10px;
          margin-top: 12px;
          color: var(--muted);
          font-size: 12px;
          line-height: 1.56;
        }

        .control-supports {
          padding-top: 9px;
          border-top: 1px solid rgba(255,255,255,0.06);
          color: #80dff2;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .decision-layout {
          display: grid;
          grid-template-columns: 0.78fr 1.22fr;
          gap: 20px;
        }

        .decision-tabs {
          display: grid;
          gap: 11px;
        }

        .decision-tab {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 20px;
          gap: 20px;
          border: 1px solid var(--line);
          border-radius: 18px;
          color: white;
          background: rgba(255,255,255,0.025);
          text-align: left;
          cursor: pointer;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease;
        }

        .decision-tab:hover {
          transform: translateX(4px);
        }

        .decision-tab.active {
          border-color: rgba(84,232,255,0.25);
          background: rgba(41,167,255,0.06);
        }

        .decision-tab strong {
          font-size: 22px;
          letter-spacing: 0.04em;
        }

        .decision-dot {
          width: 11px;
          height: 11px;
          border-radius: 50%;
        }

        .decision-dot.green { background: var(--green); box-shadow: 0 0 18px var(--green); }
        .decision-dot.gold { background: var(--gold); box-shadow: 0 0 18px var(--gold); }
        .decision-dot.red { background: var(--red); box-shadow: 0 0 18px var(--red); }
        .decision-dot.blue { background: var(--blue); box-shadow: 0 0 18px var(--blue); }

        .decision-detail {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 390px;
          padding: 42px;
          border: 1px solid var(--line);
          border-radius: 26px;
          background:
            linear-gradient(145deg, rgba(255,255,255,0.045), rgba(255,255,255,0.012));
        }

        .decision-name {
          font-size: clamp(62px, 9vw, 116px);
          line-height: 0.9;
          font-weight: 950;
          letter-spacing: -0.05em;
        }

        .decision-name.green { color: var(--green); text-shadow: 0 0 40px rgba(57,242,161,0.26); }
        .decision-name.gold { color: var(--gold); text-shadow: 0 0 40px rgba(255,212,106,0.24); }
        .decision-name.red { color: var(--red); text-shadow: 0 0 40px rgba(255,69,107,0.28); }
        .decision-name.blue { color: var(--blue); text-shadow: 0 0 40px rgba(41,167,255,0.3); }

        .decision-detail h3 {
          margin: 24px 0 12px;
          font-size: 25px;
        }

        .decision-detail p {
          max-width: 720px;
          margin: 0;
          color: var(--muted);
          font-size: 17px;
          line-height: 1.72;
        }

        .record-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
        }

        .record-card {
          position: relative;
          overflow: hidden;
          padding: 28px;
          border: 1px solid var(--line);
          border-radius: 22px;
          background:
            linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.014));
        }

        .record-code {
          display: inline-flex;
          padding: 7px 10px;
          border: 1px solid rgba(84,232,255,0.22);
          border-radius: 999px;
          color: var(--cyan);
          font-family: monospace;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .record-card h3 {
          margin: 19px 0 11px;
          font-size: 24px;
        }

        .record-card p {
          margin: 0;
          color: var(--muted);
          line-height: 1.7;
        }

        .record-card::after {
          content: "";
          position: absolute;
          right: -50px;
          bottom: -50px;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          opacity: 0.12;
          background: var(--blue);
          filter: blur(60px);
        }

        .principle {
          position: relative;
          overflow: hidden;
          padding: 56px;
          border: 1px solid rgba(84,232,255,0.22);
          border-radius: 34px;
          background:
            linear-gradient(
              135deg,
              rgba(41,167,255,0.09),
              rgba(57,242,161,0.055),
              rgba(255,69,107,0.045)
            );
        }

        .principle::after {
          content: "24";
          position: absolute;
          right: 20px;
          bottom: -80px;
          color: rgba(255,255,255,0.03);
          font-size: 300px;
          line-height: 1;
          font-weight: 950;
          letter-spacing: -0.1em;
        }

        .principle > * {
          position: relative;
          z-index: 1;
        }

        .principle h2 {
          max-width: 920px;
          margin: 13px 0 21px;
          font-size: clamp(46px, 6.3vw, 82px);
          line-height: 0.98;
          letter-spacing: -0.056em;
        }

        .principle p {
          max-width: 880px;
          margin: 0;
          color: #b4c5d7;
          font-size: 19px;
          line-height: 1.75;
        }

        .boundary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          margin-top: 28px;
          gap: 14px;
        }

        .boundary {
          padding: 20px;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 17px;
          background: rgba(3,8,14,0.34);
        }

        .boundary strong {
          display: block;
          margin-bottom: 8px;
          color: white;
        }

        .boundary span {
          color: var(--muted);
          font-size: 14px;
          line-height: 1.6;
        }

        .footer {
          margin-top: 48px;
          padding: 54px 0;
          border-top: 1px solid var(--line);
        }

        .footer-inner {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 30px;
        }

        .footer-copy {
          max-width: 780px;
        }

        .footer-chain {
          display: grid;
          gap: 7px;
          margin-top: 20px;
          color: var(--muted);
          font-size: 12px;
          line-height: 1.6;
        }

        .footer-chain strong {
          color: #dce8f5;
        }

        .footer-links {
          display: flex;
          flex-wrap: wrap;
          gap: 18px;
        }

        .footer-links a {
          color: var(--muted);
          text-decoration: none;
          font-size: 14px;
        }

        .footer-links a:hover {
          color: white;
        }

        @media (max-width: 1080px) {
          .canonical-layout {
            grid-template-columns: 1fr;
          }

          .chain-detail {
            position: relative;
            top: auto;
            min-height: 0;
          }

          .control-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 980px) {
          .hero,
          .decision-layout {
            grid-template-columns: 1fr;
          }

          .hero-visual {
            min-height: 440px;
          }

          .movement-grid {
            grid-template-columns: 1fr;
          }

          .movement-card {
            min-height: 0;
          }
        }

        @media (max-width: 800px) {
          .nav-links a:not(.nav-button) {
            display: none;
          }

          .hero {
            padding-top: 64px;
          }

          .hero h1 {
            font-size: 56px;
          }

          .hero-visual {
            min-height: 380px;
          }

          .orbit-one {
            width: 310px;
            height: 310px;
          }

          .orbit-two {
            width: 235px;
            height: 235px;
          }

          .architecture-core {
            width: 150px;
            height: 150px;
          }

          .movement-links {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .control-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .record-grid,
          .boundary-grid {
            grid-template-columns: 1fr;
          }

          .chain-detail,
          .decision-detail,
          .principle {
            padding: 29px;
          }

          .label-one,
          .label-two,
          .label-three,
          .label-four,
          .label-five,
          .label-six {
            display: none;
          }
        }

        @media (max-width: 560px) {
          .brand span:last-child {
            display: none;
          }

          .hero h1 {
            font-size: 47px;
          }

          .movement-links,
          .control-grid {
            grid-template-columns: 1fr;
          }

          .detail-topline,
          .movement-block-head {
            align-items: flex-start;
            flex-direction: column;
          }

          .detail-controls {
            flex-direction: column;
          }

          .link-step-button {
            width: 100%;
          }

          .principle {
            padding: 24px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="architecture-page">
        <header className="navigation">
          <div className="container navigation-inner">
            <Link className="brand" href="/">
              <span className="brand-mark">14</span>
              <span>TA-14 EXCHANGE PLATFORM</span>
            </Link>

            <nav className="nav-links" aria-label="Architecture navigation">
              <a href="#canonical-chain">24-Link Chain</a>
              <a href="#controls">Runtime Controls</a>
              <a href="#decisions">Decisions</a>
              <a href="#records">Records</a>
              <Link className="nav-button" href="/workspace">
                Run a Route
              </Link>
            </nav>
          </div>
        </header>

        <main>
          <section className="container hero">
            <div>
              <div className="eyebrow">
                TA-14 Full Admissible-Before-Execution Architecture
              </div>

              <h1>
                The whole route must survive
                <br />
                <span className="hero-gradient">contact with consequence.</span>
              </h1>

              <p className="hero-copy">
                TA-14 governs the complete route from reality to future-chain
                reliance. It does not assume that a valid endpoint, capable
                model, approved policy, signed receipt, or favorable outcome
                proves that the path into consequence was admissible.
              </p>

              <div className="hero-note">
                <strong>Architecture distinction:</strong> the familiar
                eight-stage sequence—Reality, Record, Continuity,
                Admissibility, Binding, Commit, Execution, Outcome—is the
                public shorthand. This page presents the full published
                24-link canonical chain.
              </div>

              <div className="hero-actions">
                <a className="primary-button" href="#canonical-chain">
                  Enter the 24-Link Chain
                </a>

                <Link className="secondary-button" href="/workspace">
                  Open Demonstration Library
                </Link>
              </div>
            </div>

            <div className="hero-visual" aria-label="TA-14 24-link route model">
              <div className="visual-count">24</div>
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="orbit orbit-three" />

              <span className="core-label label-one">Reality</span>
              <span className="core-label label-two">Truth</span>
              <span className="core-label label-three">Commit</span>
              <span className="core-label label-four">Execution</span>
              <span className="core-label label-five">Authority</span>
              <span className="core-label label-six">Future Chain</span>

              <div className="architecture-core">
                TA-14
                <br />
                FULL ROUTE
              </div>
            </div>
          </section>

          <section id="canonical-chain" className="container section">
            <div className="section-heading">
              <div className="eyebrow">The published canonical architecture</div>

              <h2>Twenty-four links. One admissible route.</h2>

              <p>
                The chain is organized into three movements: Reality to Truth,
                Reliance to Commit, and Execution to Future Chain. Select any
                link to inspect what it governs, what proof it requires, and
                how the route can fail.
              </p>
            </div>

            <div className="movement-grid" aria-label="Canonical chain movements">
              {chainMovements.map((movement) => (
                <button
                  className={`movement-card ${movement.id} ${
                    activeLink.movement === movement.id ? 'active' : ''
                  }`}
                  key={movement.id}
                  type="button"
                  aria-pressed={activeLink.movement === movement.id}
                  onClick={() => selectMovement(movement.id)}
                >
                  <span className="movement-range">LINKS {movement.range}</span>
                  <h3>{movement.title}</h3>
                  <strong>{movement.subtitle}</strong>
                  <p>{movement.description}</p>
                </button>
              ))}
            </div>

            <div className="canonical-layout">
              <div className="chain-map">
                {chainMovements.map((movement) => {
                  const links = canonicalChain.filter(
                    (link) => link.movement === movement.id,
                  );

                  return (
                    <section className="movement-block" key={movement.id}>
                      <div className="movement-block-head">
                        <strong>{movement.title}</strong>
                        <span>{movement.range}</span>
                      </div>

                      <div className="movement-links">
                        {links.map((link) => {
                          const index = canonicalChain.findIndex(
                            (candidate) => candidate.number === link.number,
                          );

                          return (
                            <button
                              className={`chain-button ${
                                activeChain === index ? 'active' : ''
                              }`}
                              key={link.number}
                              type="button"
                              aria-pressed={activeChain === index}
                              onClick={() => setActiveChain(index)}
                            >
                              <span className="chain-number">{link.number}</span>
                              <span className="chain-name">{link.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              </div>

              <article className="chain-detail" data-number={activeLink.number}>
                <div className="detail-topline">
                  <div className="detail-number">
                    CANONICAL LINK {activeLink.number} / 24
                  </div>
                  <span className="movement-pill">
                    {activeMovement.title}
                  </span>
                </div>

                <h3>{activeLink.name}</h3>

                <p className="detail-statement">{activeLink.statement}</p>
                <p className="detail-copy">{activeLink.detail}</p>

                <div className="detail-proof-grid">
                  <div className="detail-proof">
                    <strong>Required proof</strong>
                    <span>{activeLink.proof}</span>
                  </div>

                  <div className="detail-proof failure">
                    <strong>Route failure</strong>
                    <span>{activeLink.failure}</span>
                  </div>
                </div>

                <div className="detail-controls">
                  <button
                    className="link-step-button"
                    type="button"
                    onClick={selectPreviousLink}
                  >
                    ← Previous link
                  </button>

                  <button
                    className="link-step-button"
                    type="button"
                    onClick={selectNextLink}
                  >
                    Next link →
                  </button>
                </div>
              </article>
            </div>
          </section>

          <section id="controls" className="container section">
            <div className="section-heading">
              <div className="eyebrow">Operational runtime control matrix</div>

              <h2>The chain and the controls are not the same thing.</h2>

              <p>
                The canonical links define the architecture. The controls below
                are implementation-level checks that help a runtime test one or
                more links. They are deliberately labeled as controls—not as the
                TA-14 24-link chain.
              </p>
            </div>

            <div className="architecture-distinction">
              <strong>Canonical link versus runtime check:</strong> Authority is
              a canonical link. Authority source and authority validity are
              operational checks that help prove that link. Binding is a
              canonical link. Beneficiary, destination, object, tool, model,
              and environment binding are checks that help prove it.
            </div>

            <div className="control-grid">
              {runtimeControls.map((control, index) => {
                const expanded = expandedControl === index;

                return (
                  <button
                    className={`control-card ${expanded ? 'expanded' : ''}`}
                    key={control.name}
                    type="button"
                    aria-expanded={expanded}
                    onClick={() =>
                      setExpandedControl(expanded ? null : index)
                    }
                  >
                    <span className="control-state" />
                    <span className="control-index">
                      CHECK {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="control-title">{control.name}</span>

                    {expanded && (
                      <span className="control-expanded-copy">
                        <span>{control.detail}</span>
                        <span className="control-supports">
                          Supports: {control.supports}
                        </span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <section id="decisions" className="container section">
            <div className="section-heading">
              <div className="eyebrow">Decision states</div>

              <h2>A decision must explain what happens next.</h2>

              <p>
                TA-14 does not hide uncertainty inside a generic pass or fail.
                Each state creates a specific operational consequence and must
                preserve the reason for that state.
              </p>
            </div>

            <div className="decision-layout">
              <div className="decision-tabs">
                {decisions.map((decision, index) => (
                  <button
                    className={`decision-tab ${
                      activeDecision === index ? 'active' : ''
                    }`}
                    key={decision.state}
                    type="button"
                    aria-pressed={activeDecision === index}
                    onClick={() => setActiveDecision(index)}
                  >
                    <strong>{decision.state}</strong>
                    <span className={`decision-dot ${decision.color}`} />
                  </button>
                ))}
              </div>

              <article className="decision-detail">
                <div
                  className={`decision-name ${decisions[activeDecision].color}`}
                >
                  {decisions[activeDecision].state}
                </div>

                <h3>{decisions[activeDecision].headline}</h3>
                <p>{decisions[activeDecision].description}</p>
              </article>
            </div>
          </section>

          <section id="records" className="container section">
            <div className="section-heading">
              <div className="eyebrow">Preserved execution artifacts</div>

              <h2>A dashboard is not the record.</h2>

              <p>
                TA-14 creates durable artifacts that can be inspected after the
                interface, operator, vendor, model, organization, or system has
                changed.
              </p>
            </div>

            <div className="record-grid">
              {records.map((record) => (
                <article className="record-card" key={record.code}>
                  <span className="record-code">{record.code}</span>
                  <h3>{record.title}</h3>
                  <p>{record.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="container section">
            <article className="principle">
              <div className="eyebrow">The TA-14 constitutional boundary</div>

              <h2>No admissible chain. No admissible consequence.</h2>

              <p>
                TA-14 does not promise that every consequence will be good. It
                establishes whether the full route from reality, evidence, and
                truth through authority, binding, commit, execution, outcome,
                memory, and future-chain reliance was admissible—and preserves
                what actually happened afterward.
              </p>

              <div className="boundary-grid">
                <div className="boundary">
                  <strong>Not a favorable-outcome marketplace</strong>
                  <span>
                    Payment cannot purchase ALLOW, remove a finding, or weaken a
                    governing threshold.
                  </span>
                </div>

                <div className="boundary">
                  <strong>Not a valid-endpoint shortcut</strong>
                  <span>
                    A valid tool, credential, endpoint, model, or receipt does
                    not prove that the route into consequence was valid.
                  </span>
                </div>

                <div className="boundary">
                  <strong>Not execution without memory</strong>
                  <span>
                    The route, non-occurrence, prevented consequence, execution,
                    outcome, new reality, and future inheritance remain
                    attributable.
                  </span>
                </div>
              </div>

              <div className="hero-actions">
                <Link className="primary-button" href="/workspace">
                  Test a Demonstration Route
                </Link>

                <a
                  className="secondary-button"
                  href="mailto:ta14admissibleexecution@gmail.com"
                >
                  Request Architecture Review
                </a>
              </div>
            </article>
          </section>
        </main>

        <footer className="footer">
          <div className="container footer-inner">
            <div className="footer-copy">
              <Link className="brand" href="/">
                <span className="brand-mark">14</span>
                <span>TA-14 AUTHORITY GOVERNANCE INSTITUTION</span>
              </Link>

              <div className="footer-chain">
                <div>
                  <strong>Reality to Truth:</strong> Reality → Record → Continuity
                  → Evidence Governance → Admissible Evidence → Admissible Truth
                </div>
                <div>
                  <strong>Reliance to Commit:</strong> Reliance → Authority →
                  Legitimacy → Consequence Formation → Attachment / Assent →
                  Binding Reality → Binding → Commit Reality → Commit
                </div>
                <div>
                  <strong>Execution to Future Chain:</strong> Execution Reality →
                  Admissible Non-Occurrence → Prevented Consequence → Execution →
                  Outcome Reality → Outcome → New Reality → Memory → Future Chain
                </div>
              </div>
            </div>

            <div className="footer-links">
              <Link href="/">Exchange</Link>
              <a href="#canonical-chain">24-Link Chain</a>
              <a href="#controls">Runtime Controls</a>
              <a href="#records">Records</a>
              <Link href="/workspace">Workspace</Link>
              <a href="mailto:ta14admissibleexecution@gmail.com">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
