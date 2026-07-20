import Link from 'next/link';

export const metadata = {
  title: 'TA-14 AI Governance Playground',
  description:
    'Explore AI governance, governed records, building systems, and HVAC operations through guided TA-14 demonstrations.',
};

type Playground = {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  examples: string[];
  href?: string;
  action: string;
  status: 'LIVE' | 'DEVELOPING';
  accent: string;
  accentSoft: string;
  accentBorder: string;
};

const playgrounds: Playground[] = [
  {
    number: '01',
    eyebrow: 'Consequential AI',
    title: 'AI Governance Playground',
    description:
      'Test whether a consequential AI action should be allowed to proceed. Watch TA-14 examine evidence, authority, policy, identity, destination, and expected consequence before execution.',
    examples: [
      'Run a guided governance demonstration',
      'Build and test your own route',
      'Experience ALLOW, HOLD, DENY, and ESCALATE',
      'Correct missing evidence without erasing history',
    ],
    href: '/workspace/demo',
    action: 'Enter AI Governance',
    status: 'LIVE',
    accent: '#5eead4',
    accentSoft: 'rgba(45, 212, 191, 0.10)',
    accentBorder: 'rgba(94, 234, 212, 0.28)',
  },
  {
    number: '02',
    eyebrow: 'Evidence Interpretation',
    title: 'Governed Records Playground',
    description:
      'Bring a governed record and discover what it proves, what it may indicate, what it cannot prove, what evidence is missing, and what governed step should come next.',
    examples: [
      'Explore GRI™ and ERI™',
      'Interpret environmental records',
      'Preview a GIR™',
      'Preserve evidence boundaries and replayability',
    ],
    href: '/governed-record-interpreter',
    action: 'Enter Governed Records',
    status: 'LIVE',
    accent: '#7dd3fc',
    accentSoft: 'rgba(56, 189, 248, 0.10)',
    accentBorder: 'rgba(125, 211, 252, 0.28)',
  },
  {
    number: '03',
    eyebrow: 'BAS and BMS',
    title: 'Building Systems Playground',
    description:
      'Explore how building automation, environmental conditions, operational authority, and outcome evidence can become visible, bounded, and governable.',
    examples: [
      'Explore BAS and BMS routes',
      'Interpret building environmental records',
      'Test room and facility conditions',
      'Compare commands with verified outcomes',
    ],
    action: 'Building Playground Developing',
    status: 'DEVELOPING',
    accent: '#c4b5fd',
    accentSoft: 'rgba(167, 139, 250, 0.10)',
    accentBorder: 'rgba(196, 181, 253, 0.28)',
  },
  {
    number: '04',
    eyebrow: 'Field Operations',
    title: 'HVAC Operations Playground',
    description:
      'Follow the evidence chain from system sequence and baseline through diagnostic determination, intervention, and post-intervention performance.',
    examples: [
      'Establish sequence and baseline',
      'Apply non-invasive refrigerant entry thresholds',
      'Preserve diagnostic determinations',
      'Compare outcomes against the original state',
    ],
    action: 'HVAC Playground Developing',
    status: 'DEVELOPING',
    accent: '#fdba74',
    accentSoft: 'rgba(251, 146, 60, 0.10)',
    accentBorder: 'rgba(253, 186, 116, 0.28)',
  },
];

const quickStarts = [
  {
    number: '01',
    title: 'Show me how it works',
    description:
      'Run a prepared demonstration and watch TA-14 stop an inadmissible action before consequence.',
    href: '/workspace/demo',
    action: 'Run guided demo',
  },
  {
    number: '02',
    title: 'Let me build something',
    description:
      'Create a consequential route using your own actor, purpose, evidence, authority, target, and expected outcome.',
    href: '/workspace/routes/new',
    action: 'Build my route',
  },
  {
    number: '03',
    title: 'Let me examine a record',
    description:
      'Open the Governed Record Interpreter and explore bounded interpretation without evidentiary overreach.',
    href: '/governed-record-interpreter',
    action: 'Open GRI™',
  },
];

const learningSteps = [
  {
    step: 'Choose',
    description:
      'Select a playground based on what you want to understand.',
  },
  {
    step: 'Experience',
    description:
      'Run a prepared demonstration without needing governance expertise.',
  },
  {
    step: 'Challenge',
    description:
      'See what happens when evidence, authority, or continuity is missing.',
  },
  {
    step: 'Correct',
    description:
      'Supply missing information while preserving the original result.',
  },
  {
    step: 'Verify',
    description:
      'Inspect the decision, evidence bindings, receipt, replay, and outcome.',
  },
];

export default function WorkspacePage() {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroGlowOne} />
        <div style={styles.heroGlowTwo} />

        <div style={styles.heroContent}>
          <div style={styles.heroStatus}>
            <span style={styles.liveDot} />
            <span>Free governed-execution learning environment</span>
          </div>

          <p style={styles.eyebrow}>
            TA-14 AI GOVERNANCE PLAYGROUND
          </p>

          <h1 style={styles.heroTitle}>
            Learn governance
            <br />
            by experiencing it.
          </h1>

          <p style={styles.heroText}>
            Choose a playground, run a guided demonstration, or bring
            your own information. See how evidence, authority,
            continuity, admissibility, execution, and outcomes work
            together before real-world consequence.
          </p>

          <div style={styles.heroActions}>
            <Link
              href="/workspace/demo"
              style={styles.primaryButton}
            >
              Start the guided experience
              <span aria-hidden="true"> →</span>
            </Link>

            <Link
              href="/workspace/routes/new"
              style={styles.secondaryButton}
            >
              Build my own route
            </Link>
          </div>

          <div style={styles.heroTrust}>
            <span style={styles.trustItem}>
              No expertise required
            </span>
            <span style={styles.trustItem}>
              No credit card required
            </span>
            <span style={styles.trustItem}>
              Adverse results preserved
            </span>
          </div>
        </div>

        <aside style={styles.heroPanel}>
          <div style={styles.heroPanelTop}>
            <div>
              <p style={styles.panelEyebrow}>
                CURRENT EXPERIENCE
              </p>
              <h2 style={styles.panelTitle}>
                Consequential AI action
              </h2>
            </div>

            <span style={styles.liveBadge}>LIVE</span>
          </div>

          <p style={styles.panelDescription}>
            A proposed vendor payment is submitted without complete
            procurement authority and beneficiary evidence.
          </p>

          <div style={styles.routeLine}>
            <span style={styles.routeNode}>Reality</span>
            <span style={styles.routeArrow}>→</span>
            <span style={styles.routeNode}>Evidence</span>
            <span style={styles.routeArrow}>→</span>
            <span style={styles.holdNode}>HOLD</span>
          </div>

          <div style={styles.panelResult}>
            <span style={styles.resultLabel}>
              TA-14 determination
            </span>
            <strong style={styles.resultValue}>
              Execution stopped
            </strong>
            <p style={styles.resultText}>
              Missing authority and beneficiary evidence remain
              visible until corrected.
            </p>
          </div>

          <Link href="/workspace/demo" style={styles.panelButton}>
            Experience this demonstration
          </Link>
        </aside>
      </section>

      <section style={styles.introSection}>
        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.eyebrow}>CHOOSE YOUR EXPERIENCE</p>
            <h2 style={styles.sectionTitle}>
              Four understandable doors.
            </h2>
          </div>

          <p style={styles.sectionDescription}>
            The internal machinery remains powerful, but you do not
            need to understand the entire architecture before you
            begin. Enter through the subject that interests you.
          </p>
        </div>

        <div style={styles.playgroundGrid}>
          {playgrounds.map((playground) => (
            <article
              key={playground.title}
              style={{
                ...styles.playgroundCard,
                borderColor: playground.accentBorder,
                background: `linear-gradient(145deg, ${playground.accentSoft}, rgba(255,255,255,0.02))`,
              }}
            >
              <div style={styles.playgroundCardTop}>
                <span
                  style={{
                    ...styles.playgroundNumber,
                    color: playground.accent,
                  }}
                >
                  {playground.number}
                </span>

                <span
                  style={{
                    ...styles.statusBadge,
                    borderColor: playground.accentBorder,
                    color: playground.accent,
                  }}
                >
                  {playground.status}
                </span>
              </div>

              <p
                style={{
                  ...styles.cardEyebrow,
                  color: playground.accent,
                }}
              >
                {playground.eyebrow}
              </p>

              <h3 style={styles.playgroundTitle}>
                {playground.title}
              </h3>

              <p style={styles.playgroundDescription}>
                {playground.description}
              </p>

              <ul style={styles.featureList}>
                {playground.examples.map((example) => (
                  <li key={example} style={styles.featureItem}>
                    <span
                      style={{
                        ...styles.featureMarker,
                        background: playground.accent,
                      }}
                    />
                    <span>{example}</span>
                  </li>
                ))}
              </ul>

              {playground.href ? (
                <Link
                  href={playground.href}
                  style={{
                    ...styles.playgroundButton,
                    background: playground.accent,
                  }}
                >
                  {playground.action}
                  <span aria-hidden="true"> →</span>
                </Link>
              ) : (
                <div
                  style={{
                    ...styles.developingButton,
                    borderColor: playground.accentBorder,
                    color: playground.accent,
                  }}
                >
                  {playground.action}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section style={styles.quickStartSection}>
        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.lightEyebrow}>
              I ALREADY KNOW WHAT I WANT
            </p>

            <h2 style={styles.lightSectionTitle}>
              Start immediately.
            </h2>
          </div>

          <p style={styles.lightSectionDescription}>
            Skip the explanation and enter the experience that matches
            what you came here to do.
          </p>
        </div>

        <div style={styles.quickStartGrid}>
          {quickStarts.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              style={styles.quickStartCard}
            >
              <span style={styles.quickStartNumber}>
                {item.number}
              </span>

              <h3 style={styles.quickStartTitle}>
                {item.title}
              </h3>

              <p style={styles.quickStartDescription}>
                {item.description}
              </p>

              <span style={styles.quickStartAction}>
                {item.action}
                <span aria-hidden="true"> →</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section style={styles.howItWorksSection}>
        <div style={styles.howItWorksIntro}>
          <p style={styles.eyebrow}>HOW THE PLAYGROUND WORKS</p>

          <h2 style={styles.sectionTitle}>
            Governance becomes understandable when you can see it.
          </h2>

          <p style={styles.sectionDescriptionLeft}>
            The TA-14 AI Governance Playground does not hide the
            governing chain behind a score or dashboard. It lets you
            experience each material transition.
          </p>
        </div>

        <div style={styles.learningSteps}>
          {learningSteps.map((item, index) => (
            <article key={item.step} style={styles.learningStep}>
              <div style={styles.learningStepTop}>
                <span style={styles.learningNumber}>
                  {String(index + 1).padStart(2, '0')}
                </span>

                {index < learningSteps.length - 1 && (
                  <span style={styles.learningConnector} />
                )}
              </div>

              <h3 style={styles.learningTitle}>{item.step}</h3>

              <p style={styles.learningDescription}>
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section style={styles.governanceSection}>
        <div style={styles.governanceCopy}>
          <p style={styles.lightEyebrow}>
            THE GOVERNING CHAIN
          </p>

          <h2 style={styles.lightSectionTitle}>
            No admissible evidence.
            <br />
            No admissible execution.
          </h2>

          <p style={styles.governanceDescription}>
            The playground makes the complete TA-14 chain visible
            without forcing a first-time visitor to navigate every
            technical component individually.
          </p>
        </div>

        <div style={styles.chain}>
          {[
            'Reality',
            'Record',
            'Continuity',
            'Admissibility',
            'Binding',
            'Commit',
            'Execution',
            'Outcome',
          ].map((item, index, array) => (
            <div key={item} style={styles.chainItemGroup}>
              <span style={styles.chainItem}>{item}</span>

              {index < array.length - 1 && (
                <span style={styles.chainArrow}>→</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section style={styles.myWorkSection}>
        <div>
          <p style={styles.eyebrow}>RETURNING VISITORS</p>

          <h2 style={styles.sectionTitle}>
            Continue where you left off.
          </h2>

          <p style={styles.sectionDescriptionLeft}>
            Your routes, records, receipts, and verification history
            remain available without crowding the main playground
            experience.
          </p>
        </div>

        <div style={styles.myWorkActions}>
          <Link
            href="/workspace/routes"
            style={styles.myWorkPrimary}
          >
            Open My Routes
          </Link>

          <Link href="/verify" style={styles.myWorkSecondary}>
            Verify a Record
          </Link>

          <Link href="/registry" style={styles.myWorkSecondary}>
            Search the Registry
          </Link>
        </div>
      </section>

      <section style={styles.finalCta}>
        <div>
          <p style={styles.finalCtaEyebrow}>
            FREE TO EXPLORE
          </p>

          <h2 style={styles.finalCtaTitle}>
            Experience governance before consequence.
          </h2>

          <p style={styles.finalCtaText}>
            Begin with a guided demonstration, then build and test a
            route using your own information.
          </p>
        </div>

        <div style={styles.finalCtaActions}>
          <Link
            href="/workspace/demo"
            style={styles.finalPrimaryButton}
          >
            Enter the Playground
          </Link>

          <Link
            href="/workspace/routes/new"
            style={styles.finalSecondaryButton}
          >
            Build My Own Route
          </Link>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    overflow: 'hidden',
    background: '#06131d',
    color: '#f8fafc',
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },

  hero: {
    position: 'relative',
    display: 'grid',
    gridTemplateColumns:
      'minmax(0, 1.25fr) minmax(320px, 0.75fr)',
    alignItems: 'center',
    gap: 56,
    minHeight: 'calc(100vh - 72px)',
    padding:
      'clamp(76px, 9vw, 140px) clamp(24px, 6vw, 96px)',
    overflow: 'hidden',
    background:
      'linear-gradient(135deg, #071724 0%, #071d28 52%, #071b1b 100%)',
  },

  heroGlowOne: {
    position: 'absolute',
    top: '-25%',
    right: '-10%',
    width: 720,
    height: 720,
    borderRadius: '50%',
    background:
      'radial-gradient(circle, rgba(45, 212, 191, 0.16), transparent 68%)',
    pointerEvents: 'none',
  },

  heroGlowTwo: {
    position: 'absolute',
    bottom: '-42%',
    left: '14%',
    width: 620,
    height: 620,
    borderRadius: '50%',
    background:
      'radial-gradient(circle, rgba(56, 189, 248, 0.13), transparent 68%)',
    pointerEvents: 'none',
  },

  heroContent: {
    position: 'relative',
    zIndex: 1,
    maxWidth: 930,
  },

  heroStatus: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 30,
    padding: '9px 14px',
    border: '1px solid rgba(94, 234, 212, 0.22)',
    borderRadius: 999,
    background: 'rgba(45, 212, 191, 0.06)',
    color: '#b9f8ed',
    fontSize: 12,
    fontWeight: 750,
    letterSpacing: '0.04em',
  },

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#5eead4',
    boxShadow: '0 0 14px rgba(94, 234, 212, 0.8)',
  },

  eyebrow: {
    margin: 0,
    color: '#5eead4',
    fontSize: 12,
    fontWeight: 850,
    letterSpacing: '0.2em',
  },

  heroTitle: {
    margin: '22px 0 28px',
    maxWidth: 900,
    color: '#f8fafc',
    fontSize: 'clamp(60px, 8.2vw, 118px)',
    lineHeight: 0.91,
    letterSpacing: '-0.07em',
  },

  heroText: {
    maxWidth: 820,
    margin: 0,
    color: '#a9bbca',
    fontSize: 'clamp(18px, 2vw, 23px)',
    lineHeight: 1.65,
  },

  heroActions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 38,
  },

  primaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    minHeight: 56,
    padding: '0 25px',
    borderRadius: 999,
    background:
      'linear-gradient(90deg, #67e8f9 0%, #34d399 100%)',
    color: '#04131a',
    fontSize: 15,
    fontWeight: 850,
    textDecoration: 'none',
    boxShadow: '0 16px 40px rgba(52, 211, 153, 0.18)',
  },

  secondaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    padding: '0 25px',
    border: '1px solid rgba(148, 163, 184, 0.28)',
    borderRadius: 999,
    background: 'rgba(15, 23, 42, 0.36)',
    color: '#e2e8f0',
    fontSize: 15,
    fontWeight: 800,
    textDecoration: 'none',
  },

  heroTrust: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 28,
  },

  trustItem: {
    padding: '8px 11px',
    border: '1px solid rgba(148, 163, 184, 0.16)',
    borderRadius: 999,
    color: '#8fa5b6',
    fontSize: 11,
    fontWeight: 750,
  },

  heroPanel: {
    position: 'relative',
    zIndex: 1,
    padding: 28,
    border: '1px solid rgba(125, 211, 252, 0.18)',
    borderRadius: 26,
    background:
      'linear-gradient(145deg, rgba(15, 38, 51, 0.9), rgba(8, 25, 34, 0.86))',
    boxShadow: '0 30px 90px rgba(0, 0, 0, 0.28)',
    backdropFilter: 'blur(20px)',
  },

  heroPanelTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 20,
  },

  panelEyebrow: {
    margin: 0,
    color: '#7dd3fc',
    fontSize: 10,
    fontWeight: 850,
    letterSpacing: '0.18em',
  },

  panelTitle: {
    margin: '9px 0 0',
    fontSize: 25,
    letterSpacing: '-0.035em',
  },

  liveBadge: {
    padding: '6px 9px',
    border: '1px solid rgba(94, 234, 212, 0.28)',
    borderRadius: 999,
    background: 'rgba(45, 212, 191, 0.08)',
    color: '#5eead4',
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: '0.08em',
  },

  panelDescription: {
    margin: '22px 0',
    color: '#9db0be',
    fontSize: 14,
    lineHeight: 1.7,
  },

  routeLine: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    padding: '18px 0',
    borderTop: '1px solid rgba(148, 163, 184, 0.12)',
    borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
  },

  routeNode: {
    padding: '7px 10px',
    borderRadius: 8,
    background: 'rgba(125, 211, 252, 0.08)',
    color: '#bae6fd',
    fontSize: 11,
    fontWeight: 800,
  },

  holdNode: {
    padding: '7px 10px',
    borderRadius: 8,
    background: 'rgba(251, 191, 36, 0.12)',
    color: '#fcd34d',
    fontSize: 11,
    fontWeight: 900,
  },

  routeArrow: {
    color: '#516779',
    fontSize: 12,
  },

  panelResult: {
    marginTop: 22,
    padding: 20,
    border: '1px solid rgba(251, 191, 36, 0.18)',
    borderRadius: 18,
    background: 'rgba(251, 191, 36, 0.06)',
  },

  resultLabel: {
    display: 'block',
    color: '#fcd34d',
    fontSize: 10,
    fontWeight: 850,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
  },

  resultValue: {
    display: 'block',
    marginTop: 8,
    color: '#f8fafc',
    fontSize: 18,
  },

  resultText: {
    margin: '8px 0 0',
    color: '#a8b8c4',
    fontSize: 13,
    lineHeight: 1.6,
  },

  panelButton: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 18,
    padding: '13px 16px',
    borderRadius: 12,
    background: '#e2fefa',
    color: '#07322f',
    fontSize: 13,
    fontWeight: 850,
    textDecoration: 'none',
  },

  introSection: {
    padding:
      'clamp(78px, 9vw, 132px) clamp(24px, 6vw, 96px)',
    background: '#081923',
  },

  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 42,
    marginBottom: 46,
  },

  sectionTitle: {
    maxWidth: 760,
    margin: '12px 0 0',
    color: '#f8fafc',
    fontSize: 'clamp(39px, 5vw, 68px)',
    lineHeight: 1.02,
    letterSpacing: '-0.055em',
  },

  sectionDescription: {
    maxWidth: 570,
    margin: 0,
    color: '#8fa4b4',
    fontSize: 17,
    lineHeight: 1.7,
  },

  sectionDescriptionLeft: {
    maxWidth: 680,
    margin: '24px 0 0',
    color: '#8fa4b4',
    fontSize: 17,
    lineHeight: 1.7,
  },

  playgroundGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(290px, 1fr))',
    gap: 20,
  },

  playgroundCard: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 560,
    padding: 28,
    border: '1px solid',
    borderRadius: 24,
    boxShadow: '0 24px 70px rgba(0, 0, 0, 0.14)',
  },

  playgroundCardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 18,
  },

  playgroundNumber: {
    fontSize: 13,
    fontWeight: 900,
    letterSpacing: '0.14em',
  },

  statusBadge: {
    padding: '6px 9px',
    border: '1px solid',
    borderRadius: 999,
    fontSize: 9,
    fontWeight: 900,
    letterSpacing: '0.12em',
  },

  cardEyebrow: {
    margin: '34px 0 0',
    fontSize: 10,
    fontWeight: 850,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
  },

  playgroundTitle: {
    margin: '12px 0 0',
    color: '#f8fafc',
    fontSize: 29,
    lineHeight: 1.08,
    letterSpacing: '-0.04em',
  },

  playgroundDescription: {
    margin: '18px 0 0',
    color: '#9eb0bd',
    fontSize: 14,
    lineHeight: 1.7,
  },

  featureList: {
    display: 'grid',
    gap: 11,
    margin: '26px 0 30px',
    padding: 0,
    listStyle: 'none',
  },

  featureItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 11,
    color: '#c3d0da',
    fontSize: 13,
    lineHeight: 1.55,
  },

  featureMarker: {
    flex: '0 0 auto',
    width: 6,
    height: 6,
    marginTop: 7,
    borderRadius: '50%',
  },

  playgroundButton: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginTop: 'auto',
    padding: '14px 16px',
    borderRadius: 12,
    color: '#06151c',
    fontSize: 13,
    fontWeight: 900,
    textDecoration: 'none',
  },

  developingButton: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 'auto',
    padding: '13px 16px',
    border: '1px solid',
    borderRadius: 12,
    background: 'rgba(15, 23, 42, 0.22)',
    fontSize: 12,
    fontWeight: 850,
  },

  quickStartSection: {
    padding:
      'clamp(78px, 9vw, 132px) clamp(24px, 6vw, 96px)',
    background: '#e9f4f5',
    color: '#07141c',
  },

  lightEyebrow: {
    margin: 0,
    color: '#087c72',
    fontSize: 12,
    fontWeight: 850,
    letterSpacing: '0.2em',
  },

  lightSectionTitle: {
    maxWidth: 800,
    margin: '12px 0 0',
    color: '#07141c',
    fontSize: 'clamp(39px, 5vw, 68px)',
    lineHeight: 1.02,
    letterSpacing: '-0.055em',
  },

  lightSectionDescription: {
    maxWidth: 560,
    margin: 0,
    color: '#536774',
    fontSize: 17,
    lineHeight: 1.7,
  },

  quickStartGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(270px, 1fr))',
    gap: 18,
  },

  quickStartCard: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 280,
    padding: 26,
    border: '1px solid rgba(7, 20, 28, 0.11)',
    borderRadius: 20,
    background: '#ffffff',
    color: '#07141c',
    textDecoration: 'none',
    boxShadow: '0 20px 55px rgba(8, 36, 45, 0.07)',
  },

  quickStartNumber: {
    color: '#0b8e7d',
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: '0.14em',
  },

  quickStartTitle: {
    margin: '30px 0 0',
    fontSize: 25,
    letterSpacing: '-0.035em',
  },

  quickStartDescription: {
    margin: '15px 0 25px',
    color: '#60727e',
    fontSize: 14,
    lineHeight: 1.7,
  },

  quickStartAction: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 'auto',
    color: '#087c72',
    fontSize: 13,
    fontWeight: 900,
  },

  howItWorksSection: {
    display: 'grid',
    gridTemplateColumns:
      'minmax(290px, 0.65fr) minmax(0, 1.35fr)',
    gap: 72,
    padding:
      'clamp(78px, 9vw, 132px) clamp(24px, 6vw, 96px)',
    background: '#081923',
  },

  howItWorksIntro: {
    alignSelf: 'start',
  },

  learningSteps: {
    display: 'grid',
    gap: 0,
  },

  learningStep: {
    display: 'grid',
    gridTemplateColumns: '65px minmax(0, 1fr)',
    columnGap: 20,
    padding: '0 0 28px',
  },

  learningStepTop: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
  },

  learningNumber: {
    position: 'relative',
    zIndex: 1,
    display: 'grid',
    placeItems: 'center',
    width: 46,
    height: 46,
    border: '1px solid rgba(94, 234, 212, 0.24)',
    borderRadius: '50%',
    background: '#0c2731',
    color: '#5eead4',
    fontSize: 11,
    fontWeight: 900,
  },

  learningConnector: {
    position: 'absolute',
    top: 46,
    bottom: -28,
    width: 1,
    background:
      'linear-gradient(#2b6b70, rgba(43, 107, 112, 0.12))',
  },

  learningTitle: {
    gridColumn: 2,
    margin: '-44px 0 0',
    paddingTop: 6,
    color: '#f8fafc',
    fontSize: 22,
    letterSpacing: '-0.025em',
  },

  learningDescription: {
    gridColumn: 2,
    margin: '8px 0 0',
    color: '#8fa4b4',
    fontSize: 14,
    lineHeight: 1.65,
  },

  governanceSection: {
    padding:
      'clamp(78px, 9vw, 132px) clamp(24px, 6vw, 96px)',
    background:
      'linear-gradient(135deg, #dff9f4 0%, #dceff5 100%)',
    color: '#07141c',
  },

  governanceCopy: {
    maxWidth: 950,
  },

  governanceDescription: {
    maxWidth: 760,
    margin: '25px 0 0',
    color: '#506671',
    fontSize: 17,
    lineHeight: 1.7,
  },

  chain: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
    marginTop: 46,
  },

  chainItemGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },

  chainItem: {
    padding: '11px 14px',
    border: '1px solid rgba(7, 20, 28, 0.11)',
    borderRadius: 999,
    background: 'rgba(255, 255, 255, 0.66)',
    color: '#0b413f',
    fontSize: 12,
    fontWeight: 850,
  },

  chainArrow: {
    color: '#5a8785',
    fontSize: 14,
  },

  myWorkSection: {
    display: 'grid',
    gridTemplateColumns:
      'minmax(280px, 1fr) minmax(320px, 0.75fr)',
    gap: 60,
    alignItems: 'center',
    padding:
      'clamp(78px, 9vw, 132px) clamp(24px, 6vw, 96px)',
    background: '#07151e',
  },

  myWorkActions: {
    display: 'grid',
    gap: 12,
  },

  myWorkPrimary: {
    display: 'flex',
    justifyContent: 'center',
    padding: '15px 18px',
    borderRadius: 12,
    background:
      'linear-gradient(90deg, #67e8f9 0%, #34d399 100%)',
    color: '#06151c',
    fontSize: 14,
    fontWeight: 900,
    textDecoration: 'none',
  },

  myWorkSecondary: {
    display: 'flex',
    justifyContent: 'center',
    padding: '14px 18px',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: 12,
    color: '#d4e0e8',
    fontSize: 13,
    fontWeight: 800,
    textDecoration: 'none',
  },

  finalCta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 40,
    padding:
      'clamp(58px, 8vw, 96px) clamp(24px, 6vw, 96px)',
    background: '#0b8b78',
    color: '#ffffff',
  },

  finalCtaEyebrow: {
    margin: 0,
    color: '#c9fff4',
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: '0.18em',
  },

  finalCtaTitle: {
    maxWidth: 820,
    margin: '12px 0',
    fontSize: 'clamp(36px, 4.5vw, 62px)',
    lineHeight: 1.02,
    letterSpacing: '-0.05em',
  },

  finalCtaText: {
    maxWidth: 720,
    margin: 0,
    color: '#d5fff7',
    fontSize: 16,
    lineHeight: 1.65,
  },

  finalCtaActions: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 12,
    minWidth: 290,
  },

  finalPrimaryButton: {
    display: 'inline-flex',
    justifyContent: 'center',
    padding: '14px 20px',
    borderRadius: 999,
    background: '#ffffff',
    color: '#07584f',
    fontSize: 14,
    fontWeight: 900,
    textDecoration: 'none',
  },

  finalSecondaryButton: {
    display: 'inline-flex',
    justifyContent: 'center',
    padding: '13px 20px',
    border: '1px solid rgba(255, 255, 255, 0.42)',
    borderRadius: 999,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 850,
    textDecoration: 'none',
  },
};
