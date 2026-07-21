import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Governance Exchange Marketplace',
  description:
    'Post governance needs, find qualified builders, request governed records, and explore proven routes inside the TA-14 AI Governance Exchange.',
};

type Doorway = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  action: string;
  status: string;
};

type Opportunity = {
  title: string;
  domain: string;
  deliverable: string;
  budget: string;
  timing: string;
  visibility: string;
  qualifications: string[];
  state: 'OPEN' | 'INVITATION ONLY' | 'PREVIEW';
};

type Professional = {
  name: string;
  role: string;
  organization: string;
  domains: string[];
  credentialStatus: string;
  availability: string;
};

const doorways: Doorway[] = [
  {
    eyebrow: 'FOR ORGANIZATIONS',
    title: 'Post a Governance Need',
    description:
      'Describe the real problem, the consequential action, the evidence already available, the authorities involved, and the governed deliverable you need.',
    href: '#post-a-need',
    action: 'Preview need intake',
    status: 'INTAKE COMING NEXT',
  },
  {
    eyebrow: 'FOR BUILDERS AND REVIEWERS',
    title: 'Find Governance Work',
    description:
      'Explore bounded opportunities calling for governance architects, record creators, reviewers, verifiers, and domain specialists.',
    href: '#opportunities',
    action: 'View opportunities',
    status: 'DEMONSTRATION DATA',
  },
  {
    eyebrow: 'FOR RECORD REQUESTERS',
    title: 'Request a Governed Record',
    description:
      'Invite qualified contributors to assemble a record with attributable evidence, continuity review, verification, and declared proof boundaries.',
    href: '#governed-records',
    action: 'Explore record requests',
    status: 'WORKFLOW PREVIEW',
  },
  {
    eyebrow: 'FOR BUYERS AND LICENSEES',
    title: 'Browse Proven Routes',
    description:
      'Explore governance routes tested against declared scenarios and available for delivery, transfer, or licensing within stated boundaries.',
    href: '#proven-routes',
    action: 'Browse route preview',
    status: 'LIBRARY PREVIEW',
  },
];

const processSteps = [
  {
    number: '01',
    title: 'Declare the Need',
    description:
      'State the problem, consequential action, affected parties, evidence, authority, exclusions, timing, budget, and intended deliverable.',
  },
  {
    number: '02',
    title: 'Select Qualified Contributors',
    description:
      'Review qualifications, credential standing, scope, conflicts, prior work, proposal terms, and availability.',
  },
  {
    number: '03',
    title: 'Build and Test Together',
    description:
      'Collaborate inside a bounded workspace where evidence, questions, changes, challenges, approvals, and tests remain attributable.',
  },
  {
    number: '04',
    title: 'Verify, Preserve, and Deliver',
    description:
      'Deliver a versioned artifact with verification results, exceptions, proof boundaries, authorship, rights, and preservation history.',
  },
];

const opportunities: Opportunity[] = [
  {
    title: 'High-Risk Vendor Payment Approval Route',
    domain: 'Financial Execution Governance',
    deliverable: 'Custom consequential execution route',
    budget: '$3,200 fixed scope',
    timing: 'Requested within 12 days',
    visibility: 'Public demonstration opportunity',
    qualifications: [
      'AI governance architecture',
      'Financial controls',
      'Route testing',
    ],
    state: 'OPEN',
  },
  {
    title: 'Hospital Environmental Record Framework',
    domain: 'Healthcare Environmental Governance',
    deliverable: 'Governed record template and continuity review',
    budget: '$12,000 proposed budget',
    timing: 'Four-week target',
    visibility: 'Invitation-only example',
    qualifications: [
      'Healthcare operations',
      'Environmental records',
      'Evidence continuity',
    ],
    state: 'INVITATION ONLY',
  },
  {
    title: 'HVAC Baseline and Post-Intervention Record',
    domain: 'HVAC Performance Governance',
    deliverable: 'Record workflow, evidence requirements, and verification',
    budget: '$2,100 fixed scope',
    timing: 'Two-week target',
    visibility: 'Public demonstration opportunity',
    qualifications: [
      'HVAC diagnostics',
      'Performance measurement',
      'Evidence-governed records',
    ],
    state: 'PREVIEW',
  },
];

const professionals: Professional[] = [
  {
    name: 'Demonstration Governance Architect',
    role: 'Consequential Route Builder',
    organization: 'Independent Marketplace Provider',
    domains: ['AI Governance', 'Execution Routes', 'Replay and Verification'],
    credentialStatus: 'Self-declared - not independently verified',
    availability: 'Accepting bounded proposals',
  },
  {
    name: 'Demonstration Environmental Specialist',
    role: 'Governed Record Contributor',
    organization: 'Independent Marketplace Provider',
    domains: ['Indoor Air Quality', 'Environmental Records', 'Continuity Review'],
    credentialStatus: 'Evidence submission preview',
    availability: 'Available for invited collaboration',
  },
  {
    name: 'Demonstration Independent Reviewer',
    role: 'Route and Record Reviewer',
    organization: 'Independent Marketplace Provider',
    domains: ['Challenge Review', 'Evidence Boundaries', 'Verification Scope'],
    credentialStatus: 'Review process not yet connected',
    availability: 'Available for independent review',
  },
];

const trustControls = [
  {
    title: 'Identity',
    description:
      'Every material action is tied to a known account and displayed participant identity.',
  },
  {
    title: 'Attribution',
    description:
      'Every contribution preserves author, timestamp, source, and workspace context.',
  },
  {
    title: 'Continuity',
    description:
      'Evidence lineage and custody remain visible from intake through delivery.',
  },
  {
    title: 'Authority',
    description:
      'Contribution, approval, execution, verification, and ownership remain separate powers.',
  },
  {
    title: 'Versioning',
    description:
      'Accepted content is not silently overwritten. Changes create traceable versions.',
  },
  {
    title: 'Proof Boundaries',
    description:
      'Every verification artifact states what was tested and what remains outside scope.',
  },
];

const routeChain = [
  'Reality',
  'Record',
  'Continuity',
  'Admissibility',
  'Binding',
  'Commit',
  'Execution',
  'Outcome',
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5L12 2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="m5 12.5 4 4L19 7"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function OrbitVisual() {
  return (
    <div className="orbitVisual" aria-hidden="true">
      <div className="orbitCore">
        <span>TA-14</span>
        <small>Governed Exchange</small>
      </div>
      <div className="orbit orbitOne">
        <div className="orbitNode nodeOne">Need</div>
      </div>
      <div className="orbit orbitTwo">
        <div className="orbitNode nodeTwo">Build</div>
      </div>
      <div className="orbit orbitThree">
        <div className="orbitNode nodeThree">Verify</div>
      </div>
      <div className="orbit orbitFour">
        <div className="orbitNode nodeFour">Deliver</div>
      </div>
      <div className="pulseRing pulseRingOne" />
      <div className="pulseRing pulseRingTwo" />
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <main className="marketplacePage">
      <div className="backgroundLayer" aria-hidden="true">
        <div className="star starOne" />
        <div className="star starTwo" />
        <div className="star starThree" />
        <div className="star starFour" />
        <div className="star starFive" />
        <div className="star starSix" />
        <div className="line lineOne" />
        <div className="line lineTwo" />
        <div className="line lineThree" />
        <div className="glow glowOne" />
        <div className="glow glowTwo" />
        <div className="glow glowThree" />
      </div>

      <section className="heroSection">
        <div className="pageShell heroGrid">
          <div className="heroCopy">
            <div className="eyebrow">
              <span className="eyebrowDot" />
              TA-14 AI GOVERNANCE EXCHANGE
            </div>

            <h1>
              Bring the problem.
              <br />
              Find the qualified people.
              <br />
              <span>Build it together. Prove what works.</span>
            </h1>

            <p className="heroLead">
              The Governance Exchange Marketplace is a governed meeting place
              where organizations can request consequential governance,
              qualified people can build or review it, and the completed route
              or governed record can be tested, verified, preserved, delivered,
              sold, or licensed.
            </p>

            <div className="heroActions">
              <Link className="primaryButton" href="#post-a-need">
                Post a Governance Need
                <ArrowIcon />
              </Link>
              <Link className="secondaryButton" href="#opportunities">
                Find Governance Work
              </Link>
            </div>

            <div className="heroBoundary">
              <SparkIcon />
              <span>
                Demonstration front door. Live marketplace data, payments,
                automated credential verification, and real-time collaboration
                are not yet connected.
              </span>
            </div>
          </div>

          <div className="heroVisualWrap">
            <OrbitVisual />

            <div className="floatingCard floatingCardOne">
              <span className="floatingLabel">REQUEST</span>
              <strong>Governance need declared</strong>
              <small>Identity - evidence - authority - scope</small>
            </div>

            <div className="floatingCard floatingCardTwo">
              <span className="floatingLabel">VERIFY</span>
              <strong>Bounded proof preserved</strong>
              <small>Method - version - exceptions - reviewer</small>
            </div>
          </div>
        </div>

        <div className="pageShell chainPanel" aria-label="TA-14 governance chain">
          {routeChain.map((item, index) => (
            <div className="chainItem" key={item}>
              <div className="chainNode">{index + 1}</div>
              <span>{item}</span>
              {index < routeChain.length - 1 ? (
                <div className="chainConnector" aria-hidden="true" />
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="sectionBlock" id="post-a-need">
        <div className="pageShell">
          <div className="sectionHeading">
            <div>
              <span className="sectionKicker">MARKETPLACE ENTRANCES</span>
              <h2>Four ways to enter the governed exchange</h2>
            </div>
            <p>
              Each path begins with a different need, but every path preserves
              attribution, authority, continuity, versioning, and declared proof
              boundaries.
            </p>
          </div>

          <div className="doorwayGrid">
            {doorways.map((card, index) => (
              <article className="doorwayCard" key={card.title}>
                <div className="cardNumber">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="cardTopline">
                  <span>{card.eyebrow}</span>
                  <span className="statusBadge">{card.status}</span>
                </div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <Link className="textLink" href={card.href}>
                  {card.action}
                  <ArrowIcon />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sectionBlock sectionTint">
        <div className="pageShell">
          <div className="sectionHeading compactHeading">
            <div>
              <span className="sectionKicker">HOW IT WORKS</span>
              <h2>From declared need to governed delivery</h2>
            </div>
            <p>
              The Exchange does not end at introduction. It preserves the work itself.
            </p>
          </div>

          <div className="processGrid">
            {processSteps.map((step, index) => (
              <article className="processCard" key={step.number}>
                <div className="processNumber">{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <div className="processLine">
                  <span className="processPulse" />
                  {index < processSteps.length - 1 ? (
                    <span className="processTrail" />
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sectionBlock" id="opportunities">
        <div className="pageShell">
          <div className="sectionHeading">
            <div>
              <span className="sectionKicker">OPEN OPPORTUNITIES</span>
              <h2>Problems waiting for governed work</h2>
            </div>
            <p>
              These are demonstration opportunities used to establish the
              information architecture. They are not live solicitations.
            </p>
          </div>

          <div className="opportunityGrid">
            {opportunities.map((opportunity) => (
              <article className="opportunityCard" key={opportunity.title}>
                <div className="opportunityHeader">
                  <span className="decisionBadge">{opportunity.state}</span>
                  <span className="demoLabel">DEMONSTRATION</span>
                </div>

                <span className="opportunityDomain">{opportunity.domain}</span>
                <h3>{opportunity.title}</h3>

                <div className="opportunityMeta">
                  <div>
                    <span>Deliverable</span>
                    <strong>{opportunity.deliverable}</strong>
                  </div>
                  <div>
                    <span>Budget</span>
                    <strong>{opportunity.budget}</strong>
                  </div>
                  <div>
                    <span>Timing</span>
                    <strong>{opportunity.timing}</strong>
                  </div>
                  <div>
                    <span>Visibility</span>
                    <strong>{opportunity.visibility}</strong>
                  </div>
                </div>

                <div className="qualificationList">
                  <span className="listLabel">Requested qualifications</span>
                  {opportunity.qualifications.map((qualification) => (
                    <span className="qualificationChip" key={qualification}>
                      {qualification}
                    </span>
                  ))}
                </div>

                <Link className="cardButton" href="#opportunities">
                  View opportunity preview
                  <ArrowIcon />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sectionBlock sectionTint" id="professionals">
        <div className="pageShell">
          <div className="sectionHeading">
            <div>
              <span className="sectionKicker">QUALIFIED PROFESSIONALS</span>
              <h2>Scope before reputation</h2>
            </div>
            <p>
              Ratings never substitute for qualifications or evidence.
              Credential status, review state, scope, restrictions, and standing
              must remain visible.
            </p>
          </div>

          <div className="professionalGrid">
            {professionals.map((professional, index) => (
              <article className="professionalCard" key={professional.name}>
                <div className="professionalTop">
                  <div className="avatar" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <span className="profileStatus">DEMONSTRATION PROFILE</span>
                </div>

                <h3>{professional.name}</h3>
                <p className="professionalRole">{professional.role}</p>
                <p className="professionalOrg">{professional.organization}</p>

                <div className="profileDetails">
                  <div>
                    <span>Credential standing</span>
                    <strong>{professional.credentialStatus}</strong>
                  </div>
                  <div>
                    <span>Availability</span>
                    <strong>{professional.availability}</strong>
                  </div>
                </div>

                <div className="qualificationList">
                  {professional.domains.map((domain) => (
                    <span className="qualificationChip" key={domain}>
                      {domain}
                    </span>
                  ))}
                </div>

                <Link className="textLink" href="#professionals">
                  View professional registry preview
                  <ArrowIcon />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sectionBlock" id="governed-records">
        <div className="pageShell recordFeature">
          <div className="recordFeatureCopy">
            <span className="sectionKicker">GOVERNED RECORDS</span>
            <h2>One record. Multiple bounded contributors.</h2>
            <p>
              A governed record may require a technician, physician, engineer,
              laboratory, owner, patient, reviewer, or verifier. Each person
              contributes only within assigned scope. Every material addition
              remains attributable.
            </p>

            <div className="recordSteps">
              <div className="recordStep">
                <CheckIcon />
                <span>Declare the record, purpose, subject, and timeframe.</span>
              </div>
              <div className="recordStep">
                <CheckIcon />
                <span>Assign an accountable Record Steward.</span>
              </div>
              <div className="recordStep">
                <CheckIcon />
                <span>Invite bounded contributors and authority holders.</span>
              </div>
              <div className="recordStep">
                <CheckIcon />
                <span>
                  Capture baseline, intervention, post-state, continuity, and
                  verification.
                </span>
              </div>
              <div className="recordStep">
                <CheckIcon />
                <span>
                  Preserve a bounded completion or certification status without
                  overstating technical certainty.
                </span>
              </div>
            </div>

            <Link className="primaryButton" href="#governed-records">
              Request a Governed Record
              <ArrowIcon />
            </Link>
          </div>

          <div className="recordFeatureVisual" aria-hidden="true">
            <div className="recordCenter">
              <span>GOVERNED</span>
              <strong>RECORD</strong>
              <small>Attributable - bounded - preserved</small>
            </div>

            <div className="contributor contributorOne">
              <span>01</span>
              <strong>Requester</strong>
            </div>
            <div className="contributor contributorTwo">
              <span>02</span>
              <strong>Specialist</strong>
            </div>
            <div className="contributor contributorThree">
              <span>03</span>
              <strong>Reviewer</strong>
            </div>
            <div className="contributor contributorFour">
              <span>04</span>
              <strong>Verifier</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="sectionBlock sectionTint" id="proven-routes">
        <div className="pageShell routeFeature">
          <div className="routeVisual" aria-hidden="true">
            <div className="routeRail">
              {routeChain.map((item, index) => (
                <div className="routeRailItem" key={item}>
                  <div className="routeRailNode">
                    <span>{index + 1}</span>
                  </div>
                  <div>
                    <strong>{item}</strong>
                    <small>
                      {index === 0
                        ? 'Declared source state'
                        : index === 1
                          ? 'Evidence-bearing record'
                          : index === 2
                            ? 'Lineage and custody'
                            : index === 3
                              ? 'Proof threshold'
                              : index === 4
                                ? 'Actor, object, authority'
                                : index === 5
                                  ? 'Consequential commitment'
                                  : index === 6
                                    ? 'Bounded action'
                                    : 'Observed result'}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="routeFeatureCopy">
            <span className="sectionKicker">PROVEN ROUTE LIBRARY</span>
            <h2>Routes can become governed products</h2>
            <p>
              A route can be created once, tested against declared scenarios,
              preserved as a versioned artifact, and later sold or licensed
              within clearly stated scope, maintenance terms, and proof boundaries.
            </p>

            <div className="routeProductCard">
              <div className="routeProductHeader">
                <span>DEMONSTRATION ROUTE PRODUCT</span>
                <span className="decisionBadge">VERIFICATION PREVIEW</span>
              </div>
              <h3>Consequential Vendor Payment Route</h3>
              <p>
                Intended to prevent execution when procurement authority,
                financial authority, beneficiary identity, or evidence
                continuity is unresolved.
              </p>
              <div className="routeProductMeta">
                <span>Declared cases: 12</span>
                <span>Decisions: ALLOW - HOLD - DENY - ESCALATE</span>
                <span>Commercial model: one-time delivery or license</span>
              </div>
            </div>

            <Link className="secondaryButton" href="#proven-routes">
              Browse route library preview
            </Link>
          </div>
        </div>
      </section>

      <section className="sectionBlock">
        <div className="pageShell">
          <div className="sectionHeading">
            <div>
              <span className="sectionKicker">MARKETPLACE TRUST ARCHITECTURE</span>
              <h2>The Exchange preserves more than a transaction</h2>
            </div>
            <p>
              A governed marketplace must preserve who contributed, under what
              authority, to which version, with what evidence, and within what
              boundaries.
            </p>
          </div>

          <div className="trustGrid">
            {trustControls.map((control, index) => (
              <article className="trustCard" key={control.title}>
                <div className="trustIndex">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <h3>{control.title}</h3>
                <p>{control.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sectionBlock missionSection">
        <div className="pageShell missionPanel">
          <div className="missionIcon">
            <SparkIcon />
          </div>

          <div className="missionCopy">
            <span className="sectionKicker">TA-14 GUIDED MISSION SYSTEM</span>
            <h2>Every difficult question should explain why it matters.</h2>
            <p>
              Marketplace intake should not assume that a requester already
              speaks governance language. Every field should include plain
              guidance, examples, and a deeper &quot;Why are we asking
              this?&quot; explanation.
            </p>
          </div>

          <div className="missionQuestions">
            <div className="missionQuestion">
              <span>What problem must be governed?</span>
              <small>
                Describe the actual situation, not merely the desired software feature.
              </small>
            </div>
            <div className="missionQuestion">
              <span>What consequential action may occur?</span>
              <small>
                Identify what can be approved, denied, paid, changed, released,
                executed, or preserved.
              </small>
            </div>
            <div className="missionQuestion">
              <span>How will success be proven?</span>
              <small>
                Define test cases, replay, comparison, performance evidence, or
                acceptance criteria.
              </small>
            </div>
          </div>
        </div>
      </section>

      <section className="finalCtaSection">
        <div className="pageShell finalCta">
          <div>
            <span className="sectionKicker">THE CATEGORY STATEMENT</span>
            <h2>
              Consequential governance can now be requested, built, tested,
              verified, preserved, delivered, sold, licensed, and improved
              inside one governed exchange.
            </h2>
            <p>
              Every material contribution remains tied to identity, authority,
              evidence, continuity, version, and declared proof boundaries.
            </p>
          </div>

          <div className="finalActions">
            <Link className="primaryButton" href="#post-a-need">
              Post a Governance Need
              <ArrowIcon />
            </Link>
            <Link className="secondaryButton" href="#professionals">
              Browse Professionals
            </Link>
          </div>

          <div className="maxim">
            No admissible evidence. No admissible execution.
          </div>
        </div>
      </section>

      <style>{`
        :root {
          --market-bg: #041019;
          --market-border: rgba(118, 213, 220, 0.2);
          --market-border-strong: rgba(118, 213, 220, 0.42);
          --market-text: #f2fbfc;
          --market-muted: #a9c1c8;
          --market-teal: #67e0df;
          --market-blue: #62a9ff;
          --market-gold: #ffd878;
          --market-violet: #bca4ff;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: var(--market-bg);
        }

        .marketplacePage {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: var(--market-text);
          background:
            radial-gradient(circle at 15% 10%, rgba(37, 185, 189, 0.14), transparent 30%),
            radial-gradient(circle at 82% 18%, rgba(98, 169, 255, 0.12), transparent 30%),
            linear-gradient(180deg, #031019 0%, #061620 55%, #031019 100%);
        }

        .marketplacePage::before {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.22;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: linear-gradient(to bottom, black, transparent 85%);
        }

        .backgroundLayer {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .star {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 999px;
          background: white;
          box-shadow: 0 0 12px rgba(255, 255, 255, 0.95);
          animation: twinkle 4.5s ease-in-out infinite;
        }

        .starOne { top: 4%; left: 12%; animation-delay: 0.4s; }
        .starTwo { top: 8%; right: 11%; animation-delay: 1.2s; }
        .starThree { top: 19%; left: 48%; animation-delay: 2.1s; }
        .starFour { top: 43%; right: 17%; animation-delay: 0.9s; }
        .starFive { top: 63%; left: 8%; animation-delay: 2.7s; }
        .starSix { top: 82%; right: 29%; animation-delay: 1.7s; }

        .line {
          position: absolute;
          height: 1px;
          transform-origin: left center;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(103, 224, 223, 0.6),
            transparent
          );
          filter: drop-shadow(0 0 8px rgba(103, 224, 223, 0.35));
          animation: lineDrift 14s linear infinite;
        }

        .lineOne { width: 44vw; top: 14%; left: -8%; transform: rotate(18deg); }
        .lineTwo { width: 38vw; top: 52%; right: -10%; transform: rotate(-22deg); animation-delay: -6s; }
        .lineThree { width: 34vw; bottom: 14%; left: 21%; transform: rotate(11deg); animation-delay: -10s; }

        .glow {
          position: absolute;
          width: 360px;
          height: 360px;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.13;
          animation: glowPulse 9s ease-in-out infinite;
        }

        .glowOne { top: 8%; left: -120px; background: var(--market-teal); }
        .glowTwo { top: 32%; right: -150px; background: var(--market-blue); animation-delay: 3s; }
        .glowThree { bottom: 4%; left: 36%; background: var(--market-violet); animation-delay: 6s; }

        .pageShell {
          position: relative;
          z-index: 2;
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
        }

        .heroSection {
          position: relative;
          min-height: 860px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 96px 0 48px;
        }

        .heroGrid {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(380px, 0.9fr);
          gap: 54px;
          align-items: center;
        }

        .heroCopy {
          max-width: 760px;
        }

        .eyebrow,
        .sectionKicker {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: var(--market-teal);
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .eyebrowDot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--market-teal);
          box-shadow: 0 0 18px rgba(103, 224, 223, 0.9);
        }

        h1,
        h2,
        h3,
        p {
          margin-top: 0;
        }

        h1 {
          margin-bottom: 28px;
          font-size: clamp(3rem, 6vw, 6.4rem);
          line-height: 0.98;
          letter-spacing: -0.055em;
          font-weight: 760;
          text-wrap: balance;
        }

        h1 span {
          color: transparent;
          background: linear-gradient(
            90deg,
            var(--market-teal),
            var(--market-blue),
            var(--market-violet)
          );
          background-clip: text;
          -webkit-background-clip: text;
        }

        .heroLead {
          max-width: 720px;
          color: var(--market-muted);
          font-size: clamp(1.05rem, 1.5vw, 1.28rem);
          line-height: 1.75;
        }

        .heroActions,
        .finalActions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          align-items: center;
        }

        .heroActions {
          margin-top: 32px;
        }

        .primaryButton,
        .secondaryButton,
        .cardButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 48px;
          padding: 0 20px;
          border-radius: 999px;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 750;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease,
            box-shadow 180ms ease;
        }

        .primaryButton {
          color: #031114;
          background: linear-gradient(135deg, var(--market-teal), #aef7f0);
          box-shadow: 0 12px 34px rgba(37, 185, 189, 0.24);
        }

        .secondaryButton {
          color: var(--market-text);
          border: 1px solid var(--market-border-strong);
          background: rgba(10, 30, 42, 0.62);
          backdrop-filter: blur(12px);
        }

        .primaryButton:hover,
        .secondaryButton:hover,
        .cardButton:hover,
        .textLink:hover {
          transform: translateY(-2px);
        }

        .primaryButton:hover {
          box-shadow: 0 16px 42px rgba(37, 185, 189, 0.36);
        }

        .secondaryButton:hover {
          border-color: var(--market-teal);
          background: rgba(14, 42, 54, 0.88);
        }

        .heroBoundary {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          max-width: 740px;
          margin-top: 28px;
          padding: 14px 16px;
          border: 1px solid rgba(255, 216, 120, 0.22);
          border-radius: 14px;
          color: #eadfbf;
          background: rgba(255, 216, 120, 0.06);
          font-size: 0.86rem;
          line-height: 1.6;
        }

        .heroBoundary svg {
          flex: 0 0 auto;
          margin-top: 2px;
          color: var(--market-gold);
        }

        .heroVisualWrap {
          position: relative;
          min-height: 520px;
          display: grid;
          place-items: center;
        }

        .orbitVisual {
          position: relative;
          width: min(500px, 86vw);
          aspect-ratio: 1;
          display: grid;
          place-items: center;
          border-radius: 50%;
        }

        .orbitVisual::before {
          content: '';
          position: absolute;
          inset: 12%;
          border-radius: 50%;
          background:
            radial-gradient(circle at 45% 42%, rgba(103, 224, 223, 0.2), transparent 36%),
            radial-gradient(circle at 60% 65%, rgba(98, 169, 255, 0.12), transparent 38%);
          filter: blur(6px);
        }

        .orbitCore {
          position: relative;
          z-index: 5;
          width: 178px;
          height: 178px;
          display: grid;
          place-content: center;
          text-align: center;
          border: 1px solid rgba(103, 224, 223, 0.48);
          border-radius: 50%;
          background:
            radial-gradient(circle at 32% 25%, rgba(255, 255, 255, 0.16), transparent 28%),
            linear-gradient(145deg, rgba(9, 40, 50, 0.95), rgba(5, 18, 29, 0.96));
          box-shadow:
            0 0 0 14px rgba(103, 224, 223, 0.035),
            0 0 70px rgba(37, 185, 189, 0.2),
            inset 0 0 40px rgba(103, 224, 223, 0.08);
        }

        .orbitCore span {
          color: var(--market-teal);
          font-size: 2.2rem;
          font-weight: 850;
          letter-spacing: -0.04em;
        }

        .orbitCore small {
          margin-top: 6px;
          color: var(--market-muted);
          font-size: 0.74rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .orbit {
          position: absolute;
          border: 1px solid rgba(103, 224, 223, 0.18);
          border-radius: 50%;
          animation: orbitSpin 18s linear infinite;
        }

        .orbitOne { inset: 9%; }
        .orbitTwo { inset: 19%; animation-duration: 14s; animation-direction: reverse; }
        .orbitThree { inset: 29%; animation-duration: 11s; }
        .orbitFour { inset: 39%; animation-duration: 9s; animation-direction: reverse; }

        .orbitNode {
          position: absolute;
          min-width: 68px;
          height: 34px;
          display: grid;
          place-items: center;
          padding: 0 12px;
          border: 1px solid rgba(103, 224, 223, 0.42);
          border-radius: 999px;
          color: var(--market-text);
          background: rgba(7, 24, 35, 0.94);
          box-shadow: 0 0 20px rgba(37, 185, 189, 0.16);
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .nodeOne { top: -18px; left: 50%; transform: translateX(-50%); }
        .nodeTwo { top: 50%; right: -38px; transform: translateY(-50%); }
        .nodeThree { bottom: -18px; left: 50%; transform: translateX(-50%); }
        .nodeFour { top: 50%; left: -36px; transform: translateY(-50%); }

        .pulseRing {
          position: absolute;
          inset: 37%;
          border: 1px solid rgba(98, 169, 255, 0.4);
          border-radius: 50%;
          animation: pulseRing 4.5s ease-out infinite;
        }

        .pulseRingTwo {
          animation-delay: 2.2s;
        }

        .floatingCard {
          position: absolute;
          z-index: 6;
          min-width: 210px;
          padding: 14px 16px;
          border: 1px solid var(--market-border);
          border-radius: 16px;
          background: rgba(7, 24, 35, 0.82);
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.22);
          backdrop-filter: blur(14px);
          animation: floatCard 6s ease-in-out infinite;
        }

        .floatingCardOne { top: 90px; left: -12px; }
        .floatingCardTwo { right: -6px; bottom: 84px; animation-delay: 2.7s; }

        .floatingCard strong,
        .floatingCard small {
          display: block;
        }

        .floatingCard strong {
          margin-top: 5px;
          font-size: 0.92rem;
        }

        .floatingCard small {
          margin-top: 5px;
          color: var(--market-muted);
          font-size: 0.72rem;
          line-height: 1.5;
        }

        .floatingLabel {
          color: var(--market-teal);
          font-size: 0.65rem;
          font-weight: 850;
          letter-spacing: 0.16em;
        }

        .chainPanel {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 8px;
          margin-top: 72px;
          padding: 18px;
          border: 1px solid var(--market-border);
          border-radius: 20px;
          background: rgba(5, 20, 29, 0.72);
          backdrop-filter: blur(12px);
        }

        .chainItem {
          position: relative;
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .chainNode {
          position: relative;
          z-index: 2;
          width: 28px;
          height: 28px;
          flex: 0 0 28px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #031114;
          background: var(--market-teal);
          box-shadow: 0 0 18px rgba(103, 224, 223, 0.35);
          font-size: 0.72rem;
          font-weight: 900;
        }

        .chainItem span {
          position: relative;
          z-index: 2;
          min-width: 0;
          color: #d7eaed;
          font-size: 0.76rem;
          font-weight: 750;
        }

        .chainConnector {
          position: absolute;
          z-index: 1;
          left: calc(100% - 10px);
          width: 24px;
          height: 1px;
          background: linear-gradient(90deg, var(--market-teal), transparent);
        }

        .sectionBlock {
          position: relative;
          padding: 110px 0;
          scroll-margin-top: 80px;
        }

        .sectionTint {
          border-top: 1px solid rgba(118, 213, 220, 0.08);
          border-bottom: 1px solid rgba(118, 213, 220, 0.08);
          background: linear-gradient(
            180deg,
            rgba(9, 28, 39, 0.64),
            rgba(5, 18, 26, 0.42)
          );
        }

        .sectionHeading {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(280px, 460px);
          gap: 36px;
          align-items: end;
          margin-bottom: 48px;
        }

        .sectionHeading h2,
        .recordFeatureCopy h2,
        .routeFeatureCopy h2,
        .missionCopy h2,
        .finalCta h2 {
          margin: 10px 0 0;
          font-size: clamp(2.15rem, 4vw, 4.25rem);
          line-height: 1.06;
          letter-spacing: -0.045em;
          text-wrap: balance;
        }

        .sectionHeading p,
        .recordFeatureCopy > p,
        .routeFeatureCopy > p,
        .missionCopy p,
        .finalCta p {
          margin: 0;
          color: var(--market-muted);
          font-size: 1.04rem;
          line-height: 1.75;
        }

        .compactHeading {
          margin-bottom: 44px;
        }

        .doorwayGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        .doorwayCard,
        .processCard,
        .opportunityCard,
        .professionalCard,
        .trustCard {
          position: relative;
          overflow: hidden;
          border: 1px solid var(--market-border);
          background: linear-gradient(
            145deg,
            rgba(10, 31, 43, 0.84),
            rgba(4, 18, 27, 0.94)
          );
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.16);
        }

        .doorwayCard::before,
        .opportunityCard::before,
        .professionalCard::before,
        .trustCard::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(
            circle at 0 0,
            rgba(103, 224, 223, 0.12),
            transparent 34%
          );
        }

        .doorwayCard {
          min-height: 330px;
          padding: 30px;
          border-radius: 24px;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            box-shadow 180ms ease;
        }

        .doorwayCard:hover {
          transform: translateY(-4px);
          border-color: var(--market-border-strong);
          box-shadow: 0 26px 60px rgba(0, 0, 0, 0.24);
        }

        .cardNumber {
          position: absolute;
          top: 20px;
          right: 24px;
          color: rgba(103, 224, 223, 0.12);
          font-size: 4rem;
          font-weight: 900;
          line-height: 1;
        }

        .cardTopline {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: center;
          margin-bottom: 34px;
        }

        .cardTopline > span:first-child,
        .opportunityDomain,
        .listLabel {
          color: var(--market-teal);
          font-size: 0.7rem;
          font-weight: 850;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .statusBadge,
        .decisionBadge,
        .demoLabel,
        .profileStatus {
          display: inline-flex;
          align-items: center;
          min-height: 28px;
          padding: 0 10px;
          border-radius: 999px;
          font-size: 0.62rem;
          font-weight: 850;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .statusBadge,
        .profileStatus {
          color: #d7e4e8;
          border: 1px solid rgba(169, 193, 200, 0.22);
          background: rgba(169, 193, 200, 0.06);
        }

        .doorwayCard h3,
        .opportunityCard h3,
        .professionalCard h3,
        .routeProductCard h3 {
          position: relative;
          z-index: 2;
          margin-bottom: 14px;
          font-size: 1.55rem;
          line-height: 1.2;
          letter-spacing: -0.025em;
        }

        .doorwayCard p,
        .opportunityCard p,
        .professionalCard p,
        .trustCard p,
        .routeProductCard p {
          position: relative;
          z-index: 2;
          color: var(--market-muted);
          line-height: 1.7;
        }

        .textLink {
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 22px;
          color: var(--market-teal);
          text-decoration: none;
          font-weight: 800;
          transition: transform 180ms ease;
        }

        .processGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
        }

        .processCard {
          min-height: 270px;
          padding: 26px;
          border-radius: 20px;
        }

        .processNumber {
          color: var(--market-teal);
          font-size: 2.4rem;
          font-weight: 900;
          letter-spacing: -0.04em;
        }

        .processCard h3 {
          margin: 28px 0 12px;
          font-size: 1.25rem;
        }

        .processCard p {
          color: var(--market-muted);
          line-height: 1.65;
        }

        .processLine {
          position: absolute;
          right: 0;
          bottom: 22px;
          left: 26px;
          display: flex;
          align-items: center;
        }

        .processPulse {
          width: 10px;
          height: 10px;
          flex: 0 0 10px;
          border-radius: 50%;
          background: var(--market-teal);
          box-shadow: 0 0 16px rgba(103, 224, 223, 0.75);
          animation: nodePulse 2.5s ease-in-out infinite;
        }

        .processTrail {
          flex: 1;
          height: 1px;
          margin-left: 8px;
          background: linear-gradient(90deg, var(--market-teal), transparent);
        }

        .opportunityGrid,
        .professionalGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .opportunityCard,
        .professionalCard {
          padding: 26px;
          border-radius: 22px;
        }

        .opportunityHeader,
        .professionalTop,
        .routeProductHeader {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          margin-bottom: 26px;
        }

        .decisionBadge {
          color: #042125;
          background: var(--market-gold);
        }

        .demoLabel {
          color: var(--market-muted);
          border: 1px solid rgba(169, 193, 200, 0.16);
        }

        .opportunityDomain {
          position: relative;
          z-index: 2;
          display: block;
          margin-bottom: 12px;
        }

        .opportunityMeta,
        .profileDetails {
          position: relative;
          z-index: 2;
          display: grid;
          gap: 10px;
          margin: 24px 0;
        }

        .opportunityMeta > div,
        .profileDetails > div {
          display: grid;
          gap: 4px;
          padding: 12px 14px;
          border: 1px solid rgba(118, 213, 220, 0.12);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.018);
        }

        .opportunityMeta span,
        .profileDetails span {
          color: #77939b;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .opportunityMeta strong,
        .profileDetails strong {
          color: #e2f0f2;
          font-size: 0.83rem;
          line-height: 1.5;
        }

        .qualificationList {
          position: relative;
          z-index: 2;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 18px;
        }

        .listLabel {
          width: 100%;
          margin-bottom: 4px;
        }

        .qualificationChip {
          display: inline-flex;
          align-items: center;
          min-height: 30px;
          padding: 0 10px;
          border: 1px solid rgba(103, 224, 223, 0.15);
          border-radius: 999px;
          color: #d8ecef;
          background: rgba(103, 224, 223, 0.07);
          font-size: 0.72rem;
          line-height: 1.4;
        }

        .cardButton {
          position: relative;
          z-index: 2;
          width: 100%;
          margin-top: 24px;
          color: var(--market-text);
          border: 1px solid var(--market-border-strong);
          background: rgba(103, 224, 223, 0.06);
        }

        .avatar {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          color: #031114;
          background: linear-gradient(145deg, var(--market-teal), var(--market-blue));
          box-shadow: 0 10px 26px rgba(37, 185, 189, 0.2);
          font-weight: 900;
        }

        .professionalRole {
          margin-bottom: 4px;
          color: var(--market-teal) !important;
          font-weight: 750;
        }

        .professionalOrg {
          margin-bottom: 0;
          font-size: 0.86rem;
        }

        .recordFeature,
        .routeFeature {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(420px, 0.9fr);
          gap: 68px;
          align-items: center;
        }

        .recordFeatureCopy > p,
        .routeFeatureCopy > p {
          margin-top: 22px;
        }

        .recordSteps {
          display: grid;
          gap: 12px;
          margin: 30px 0 32px;
        }

        .recordStep {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          color: #d9e9ec;
          line-height: 1.6;
        }

        .recordStep svg {
          flex: 0 0 auto;
          margin-top: 3px;
          color: var(--market-teal);
        }

        .recordFeatureVisual {
          position: relative;
          min-height: 520px;
          display: grid;
          place-items: center;
          overflow: hidden;
          border: 1px solid var(--market-border);
          border-radius: 28px;
          background:
            radial-gradient(circle at center, rgba(103, 224, 223, 0.1), transparent 42%),
            linear-gradient(145deg, rgba(9, 31, 43, 0.9), rgba(4, 17, 25, 0.96));
        }

        .recordFeatureVisual::before {
          content: '';
          position: absolute;
          inset: 12%;
          border: 1px dashed rgba(103, 224, 223, 0.16);
          border-radius: 50%;
          animation: orbitSpin 28s linear infinite;
        }

        .recordCenter {
          position: relative;
          z-index: 4;
          width: 190px;
          height: 190px;
          display: grid;
          place-content: center;
          text-align: center;
          border: 1px solid var(--market-border-strong);
          border-radius: 28px;
          background: rgba(4, 18, 27, 0.92);
          box-shadow: 0 0 60px rgba(37, 185, 189, 0.16);
          transform: rotate(45deg);
        }

        .recordCenter > * {
          transform: rotate(-45deg);
        }

        .recordCenter span {
          color: var(--market-teal);
          font-size: 0.72rem;
          font-weight: 850;
          letter-spacing: 0.16em;
        }

        .recordCenter strong {
          margin: 8px 0;
          font-size: 1.7rem;
          letter-spacing: -0.04em;
        }

        .recordCenter small {
          color: var(--market-muted);
          font-size: 0.65rem;
        }

        .contributor {
          position: absolute;
          z-index: 3;
          display: grid;
          gap: 2px;
          min-width: 118px;
          padding: 12px 14px;
          border: 1px solid rgba(103, 224, 223, 0.25);
          border-radius: 14px;
          background: rgba(7, 24, 35, 0.9);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
        }

        .contributor span {
          color: var(--market-teal);
          font-size: 0.62rem;
          font-weight: 850;
          letter-spacing: 0.1em;
        }

        .contributor strong {
          font-size: 0.82rem;
        }

        .contributorOne { top: 54px; left: 38px; }
        .contributorTwo { top: 64px; right: 34px; }
        .contributorThree { right: 42px; bottom: 54px; }
        .contributorFour { bottom: 62px; left: 34px; }

        .routeFeature {
          grid-template-columns: minmax(420px, 0.9fr) minmax(0, 1fr);
        }

        .routeVisual {
          padding: 28px;
          border: 1px solid var(--market-border);
          border-radius: 26px;
          background: linear-gradient(
            145deg,
            rgba(9, 31, 43, 0.88),
            rgba(4, 17, 25, 0.96)
          );
        }

        .routeRail {
          display: grid;
          gap: 8px;
        }

        .routeRailItem {
          display: grid;
          grid-template-columns: 48px 1fr;
          gap: 14px;
          align-items: center;
          min-height: 64px;
          padding: 10px 12px;
          border: 1px solid rgba(118, 213, 220, 0.11);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.018);
        }

        .routeRailNode {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border: 1px solid var(--market-border-strong);
          border-radius: 50%;
          color: #031114;
          background: var(--market-teal);
          box-shadow: 0 0 18px rgba(103, 224, 223, 0.24);
          font-weight: 900;
        }

        .routeRailItem strong,
        .routeRailItem small {
          display: block;
        }

        .routeRailItem strong {
          font-size: 0.92rem;
        }

        .routeRailItem small {
          margin-top: 3px;
          color: var(--market-muted);
          font-size: 0.72rem;
        }

        .routeProductCard {
          margin: 28px 0;
          padding: 22px;
          border: 1px solid var(--market-border);
          border-radius: 20px;
          background: rgba(8, 28, 40, 0.72);
        }

        .routeProductHeader > span:first-child {
          color: var(--market-teal);
          font-size: 0.68rem;
          font-weight: 850;
          letter-spacing: 0.13em;
        }

        .routeProductMeta {
          display: grid;
          gap: 8px;
          margin-top: 18px;
        }

        .routeProductMeta span {
          padding: 9px 11px;
          border: 1px solid rgba(118, 213, 220, 0.1);
          border-radius: 10px;
          color: #dcebed;
          font-size: 0.76rem;
        }

        .trustGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .trustCard {
          min-height: 210px;
          padding: 24px;
          border-radius: 20px;
        }

        .trustIndex {
          color: rgba(103, 224, 223, 0.4);
          font-size: 2rem;
          font-weight: 900;
        }

        .trustCard h3 {
          margin: 24px 0 10px;
          font-size: 1.2rem;
        }

        .missionSection {
          padding-top: 70px;
        }

        .missionPanel {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) minmax(360px, 0.8fr);
          gap: 28px;
          align-items: start;
          padding: 34px;
          border: 1px solid var(--market-border-strong);
          border-radius: 28px;
          background:
            radial-gradient(circle at 0 0, rgba(103, 224, 223, 0.12), transparent 26%),
            linear-gradient(145deg, rgba(9, 32, 44, 0.9), rgba(4, 17, 25, 0.96));
        }

        .missionIcon {
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
          border: 1px solid var(--market-border-strong);
          border-radius: 16px;
          color: var(--market-teal);
          background: rgba(103, 224, 223, 0.08);
        }

        .missionCopy p {
          margin-top: 18px;
        }

        .missionQuestions {
          display: grid;
          gap: 12px;
        }

        .missionQuestion {
          padding: 16px;
          border: 1px solid rgba(118, 213, 220, 0.12);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.02);
        }

        .missionQuestion span,
        .missionQuestion small {
          display: block;
        }

        .missionQuestion span {
          color: var(--market-text);
          font-weight: 800;
        }

        .missionQuestion small {
          margin-top: 6px;
          color: var(--market-muted);
          line-height: 1.55;
        }

        .finalCtaSection {
          position: relative;
          padding: 120px 0 80px;
        }

        .finalCta {
          display: grid;
          gap: 32px;
          padding: 44px;
          border: 1px solid var(--market-border-strong);
          border-radius: 30px;
          background:
            radial-gradient(circle at 82% 18%, rgba(98, 169, 255, 0.14), transparent 34%),
            radial-gradient(circle at 12% 84%, rgba(103, 224, 223, 0.12), transparent 34%),
            linear-gradient(145deg, rgba(8, 30, 42, 0.95), rgba(3, 15, 23, 0.98));
        }

        .finalCta p {
          max-width: 820px;
          margin-top: 20px;
        }

        .maxim {
          padding-top: 26px;
          border-top: 1px solid rgba(118, 213, 220, 0.14);
          color: var(--market-teal);
          font-size: 0.86rem;
          font-weight: 850;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.25;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.35);
          }
        }

        @keyframes lineDrift {
          0% {
            opacity: 0;
            transform: translateX(-10%) rotate(var(--line-angle, 0deg));
          }
          20%,
          80% {
            opacity: 0.75;
          }
          100% {
            opacity: 0;
            transform: translateX(40%) rotate(var(--line-angle, 0deg));
          }
        }

        @keyframes glowPulse {
          0%,
          100% {
            opacity: 0.09;
            transform: scale(0.92);
          }
          50% {
            opacity: 0.17;
            transform: scale(1.08);
          }
        }

        @keyframes orbitSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulseRing {
          0% {
            opacity: 0.7;
            transform: scale(0.72);
          }
          100% {
            opacity: 0;
            transform: scale(2.3);
          }
        }

        @keyframes floatCard {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes nodePulse {
          0%,
          100% {
            transform: scale(0.9);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        @media (max-width: 1050px) {
          .heroGrid,
          .recordFeature,
          .routeFeature,
          .missionPanel {
            grid-template-columns: 1fr;
          }

          .heroVisualWrap {
            min-height: 470px;
          }

          .processGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .opportunityGrid,
          .professionalGrid,
          .trustGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .chainPanel {
            grid-template-columns: repeat(4, 1fr);
          }

          .chainConnector {
            display: none;
          }
        }

        @media (max-width: 760px) {
          .pageShell {
            width: min(100% - 24px, 1180px);
          }

          .heroSection {
            min-height: auto;
            padding-top: 72px;
          }

          .heroGrid {
            gap: 24px;
          }

          .heroVisualWrap {
            min-height: 390px;
          }

          .floatingCard {
            display: none;
          }

          .chainPanel {
            grid-template-columns: repeat(2, 1fr);
            margin-top: 32px;
          }

          .sectionBlock {
            padding: 80px 0;
          }

          .sectionHeading {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .doorwayGrid,
          .processGrid,
          .opportunityGrid,
          .professionalGrid,
          .trustGrid {
            grid-template-columns: 1fr;
          }

          .recordFeatureVisual {
            min-height: 430px;
          }

          .contributorOne { top: 28px; left: 20px; }
          .contributorTwo { top: 38px; right: 18px; }
          .contributorThree { right: 24px; bottom: 34px; }
          .contributorFour { bottom: 44px; left: 18px; }

          .finalCta {
            padding: 28px 22px;
          }
        }

        @media (max-width: 480px) {
          h1 {
            font-size: clamp(2.55rem, 15vw, 4rem);
          }

          .heroActions,
          .finalActions {
            align-items: stretch;
            flex-direction: column;
          }

          .primaryButton,
          .secondaryButton {
            width: 100%;
          }

          .orbitVisual {
            width: 340px;
            max-width: 92vw;
          }

          .orbitCore {
            width: 142px;
            height: 142px;
          }

          .orbitCore span {
            font-size: 1.75rem;
          }

          .orbitNode {
            min-width: 56px;
            padding: 0 8px;
            font-size: 0.62rem;
          }

          .recordCenter {
            width: 148px;
            height: 148px;
          }

          .contributor {
            min-width: 98px;
            padding: 10px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>
    </main>
  );
}
