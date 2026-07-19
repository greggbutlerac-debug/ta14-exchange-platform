'use client';

import { useEffect, useMemo, useState } from 'react';

type RouteState = 'IDLE' | 'RUNNING' | 'HOLD' | 'ALLOW';

const chain = [
  'Reality',
  'Record',
  'Continuity',
  'Admissibility',
  'Binding',
  'Commit',
  'Execution',
  'Outcome',
];

const lifecycle = [
  {
    number: '01',
    title: 'Build',
    text: 'Construct the complete route from present reality through intended outcome.',
  },
  {
    number: '02',
    title: 'Test',
    text: 'Challenge evidence, identity, continuity, authority, binding, and execution readiness.',
  },
  {
    number: '03',
    title: 'Correct',
    text: 'Receive exact HOLD, DENY, or ESCALATE reasons and repair the route before consequence.',
  },
  {
    number: '04',
    title: 'Preserve',
    text: 'Create a governed record containing the route, decision, evidence, receipts, and outcome.',
  },
  {
    number: '05',
    title: 'Verify',
    text: 'Check signatures, hashes, dependencies, continuity, and correspondence independently.',
  },
  {
    number: '06',
    title: 'Replay',
    text: 'Reconstruct what occurred without depending on trust in a private dashboard.',
  },
];

const governedRecordContents = [
  'Exact route identity and version',
  'Evidence and provenance references',
  'Authority and actor bindings',
  'Applicable rules and thresholds',
  'Decision state and reason codes',
  'Correction and rerun history',
  'Commit and execution receipts',
  'Cryptographic integrity values',
  'Outcome correspondence',
  'Independent replay package',
];

const platformCapabilities = [
  {
    icon: '◇',
    title: 'Route Construction',
    text: 'Build a complete Reality-to-Outcome route with declared actors, evidence, rules, authority, intended execution, and outcome.',
    href: '/workspace/routes/new',
    action: 'Build a Route',
  },
  {
    icon: '▣',
    title: 'Governed Record Creation',
    text: 'Turn an evaluated route into a structured, integrity-bound record that preserves what was known, decided, corrected, executed, and observed.',
    href: '/workspace/records',
    action: 'Create a Governed Record',
  },
  {
    icon: '✓',
    title: 'Independent Verification',
    text: 'Inspect route identity, evidence integrity, decision receipts, signatures, continuity, commit correspondence, and outcome correspondence.',
    href: '/workspace/verification',
    action: 'Open Verification',
  },
  {
    icon: '↻',
    title: 'Replay and Comparison',
    text: 'Import, reconstruct, and compare governed route packages so verification does not depend on the originating system.',
    href: '/workspace',
    action: 'Enter Workspace',
  },
  {
    icon: '◎',
    title: 'Governance Exchange',
    text: 'Prepare governance routes, records, templates, review layers, and verification packages for bounded sharing and future exchange publication.',
    href: '/workspace',
    action: 'Explore the Exchange',
  },
  {
    icon: 'API',
    title: 'Runtime Integration',
    text: 'Connect external agents, policy engines, registries, evidence systems, and execution environments to a common governed route.',
    href: 'mailto:ta14admissibleexecution@gmail.com',
    action: 'Request Integration Access',
  },
];

const useCases = [
  {
    title: 'AI Agents',
    text: 'Bind identity, delegated authority, tools, payloads, destinations, commitments, and outcomes before autonomous action.',
  },
  {
    title: 'Finance',
    text: 'Prove who authorized a transaction, what evidence supported it, what object was committed, and what actually executed.',
  },
  {
    title: 'Healthcare',
    text: 'Preserve accountable human authority, evidence freshness, model version, intervention boundaries, overrides, and outcomes.',
  },
  {
    title: 'Infrastructure',
    text: 'Govern consequential execution across buildings, energy, environmental systems, industrial operations, and critical controls.',
  },
  {
    title: 'Government',
    text: 'Create reconstructable records for public authority, administrative action, evidence, correction, execution, and consequence.',
  },
  {
    title: 'Enterprise',
    text: 'Convert policies and approvals into route-level controls, receipts, correction paths, durable records, and replayable proof.',
  },
];

function makeRid() {
  return `TA-14-RID-${Date.now().toString(36).toUpperCase()}`;
}

function makeHash(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(16).padStart(8, '0').toUpperCase();
}

export default function HomePage() {
  const [routeState, setRouteState] = useState<RouteState>('IDLE');
  const [activeStage, setActiveStage] = useState(-1);
  const [authorityCorrected, setAuthorityCorrected] = useState(false);
  const [recordOpen, setRecordOpen] = useState(false);
  const [rid, setRid] = useState('');
  const [manifestHash, setManifestHash] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const stateLabel = useMemo(() => {
    if (routeState === 'IDLE') {
      return 'READY';
    }

    return routeState;
  }, [routeState]);

  useEffect(() => {
    if (routeState !== 'RUNNING') {
      return;
    }

    if (activeStage >= chain.length - 1) {
      const timer = window.setTimeout(() => {
        if (authorityCorrected) {
          const newRid = makeRid();

          setRouteState('ALLOW');
          setRecordOpen(true);
          setRid(newRid);
          setManifestHash(
            makeHash(
              `${newRid}|vendor-payment|dual-authority|beneficiary-binding|allow`,
            ),
          );
        } else {
          setRouteState('HOLD');
        }
      }, 650);

      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      setActiveStage((current) => current + 1);
    }, 420);

    return () => window.clearTimeout(timer);
  }, [routeState, activeStage, authorityCorrected]);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  function runRoute() {
    setRecordOpen(false);
    setRid('');
    setManifestHash('');
    setActiveStage(0);
    setRouteState('RUNNING');
  }

  function correctAndRerun() {
    setAuthorityCorrected(true);
    setRecordOpen(false);
    setRid('');
    setManifestHash('');
    setActiveStage(0);
    setRouteState('RUNNING');
  }

  function resetRoute() {
    setRouteState('IDLE');
    setActiveStage(-1);
    setAuthorityCorrected(false);
    setRecordOpen(false);
    setRid('');
    setManifestHash('');
  }

  return (
    <>
      <style>{`
        :root {
          color-scheme: dark;
          --bg: #02050a;
          --bg-soft: #07101a;
          --panel: rgba(9, 18, 30, 0.76);
          --panel-strong: rgba(6, 13, 23, 0.94);
          --line: rgba(123, 174, 229, 0.17);
          --line-strong: rgba(84, 232, 255, 0.3);
          --text: #f4f8ff;
          --muted: #98abc0;
          --muted-light: #bed0e3;
          --blue: #29a7ff;
          --cyan: #54e8ff;
          --green: #39f2a1;
          --red: #ff456b;
          --gold: #ffd46a;
          --shadow-blue: 0 0 60px rgba(41, 167, 255, 0.17);
          --shadow-green: 0 0 60px rgba(57, 242, 161, 0.13);
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background:
            radial-gradient(
              circle at 12% 8%,
              rgba(41, 167, 255, 0.15),
              transparent 28%
            ),
            radial-gradient(
              circle at 88% 18%,
              rgba(57, 242, 161, 0.085),
              transparent 26%
            ),
            radial-gradient(
              circle at 50% 88%,
              rgba(255, 69, 107, 0.07),
              transparent 34%
            ),
            linear-gradient(180deg, #02050a 0%, #07111d 48%, #02050a 100%);
          color: var(--text);
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          overflow-x: hidden;
        }

        body::before {
          content: "";
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.24;
          background-image:
            linear-gradient(
              rgba(255, 255, 255, 0.024) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.024) 1px,
              transparent 1px
            );
          background-size: 34px 34px;
          mask-image: linear-gradient(to bottom, black, transparent 90%);
        }

        a {
          color: inherit;
        }

        button,
        input {
          font: inherit;
        }

        button:disabled {
          cursor: wait;
          opacity: 0.72;
        }

        .site-shell {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
        }

        .ambient {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .ambient-orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(90px);
          opacity: 0.2;
          animation: drift 14s ease-in-out infinite alternate;
        }

        .ambient-orb.one {
          width: 430px;
          height: 430px;
          top: -180px;
          left: -120px;
          background: var(--blue);
        }

        .ambient-orb.two {
          width: 360px;
          height: 360px;
          top: 250px;
          right: -120px;
          background: var(--green);
          animation-delay: -5s;
        }

        .ambient-orb.three {
          width: 320px;
          height: 320px;
          bottom: -160px;
          left: 38%;
          background: var(--red);
          animation-delay: -8s;
        }

        @keyframes drift {
          from {
            transform: translate3d(-24px, -20px, 0) scale(1);
          }

          to {
            transform: translate3d(30px, 26px, 0) scale(1.12);
          }
        }

        .container {
          position: relative;
          z-index: 2;
          width: min(1200px, 92vw);
          margin: 0 auto;
        }

        .nav {
          position: sticky;
          top: 0;
          z-index: 50;
          border-bottom: 1px solid var(--line);
          background: rgba(3, 7, 13, 0.78);
          backdrop-filter: blur(20px);
        }

        .nav-inner {
          min-height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: var(--text);
          text-decoration: none;
          font-size: 13px;
          font-weight: 850;
          letter-spacing: 0.08em;
        }

        .brand-mark {
          min-width: 64px;
          height: 42px;
          padding: 0 11px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(84, 232, 255, 0.42);
          border-radius: 13px;
          background:
            linear-gradient(
              145deg,
              rgba(41, 167, 255, 0.2),
              rgba(57, 242, 161, 0.08)
            );
          box-shadow:
            0 0 26px rgba(84, 232, 255, 0.18),
            inset 0 0 18px rgba(255, 255, 255, 0.05);
          color: var(--cyan);
          font-size: 13px;
          font-weight: 950;
          letter-spacing: -0.02em;
        }

        .brand-copy {
          display: grid;
          gap: 2px;
        }

        .brand-copy strong {
          font-size: 13px;
          line-height: 1;
        }

        .brand-copy small {
          color: var(--muted);
          font-size: 9px;
          letter-spacing: 0.16em;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 21px;
        }

        .nav-links a {
          color: var(--muted);
          text-decoration: none;
          font-size: 13px;
          transition: color 180ms ease;
        }

        .nav-links a:hover {
          color: white;
        }

        .menu-button {
          width: 44px;
          height: 44px;
          display: none;
          place-items: center;
          border: 1px solid var(--line);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.04);
          color: white;
          cursor: pointer;
        }

        .button {
          min-height: 47px;
          padding: 13px 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border: 0;
          border-radius: 14px;
          text-decoration: none;
          font-weight: 850;
          cursor: pointer;
          transition:
            transform 180ms ease,
            box-shadow 180ms ease,
            border-color 180ms ease,
            background 180ms ease;
        }

        .button:hover {
          transform: translateY(-2px);
        }

        .button-primary {
          color: #04110d !important;
          background: linear-gradient(90deg, var(--cyan), var(--green));
          box-shadow:
            0 0 28px rgba(84, 232, 255, 0.22),
            0 0 46px rgba(57, 242, 161, 0.1);
        }

        .button-secondary {
          border: 1px solid var(--line);
          background: rgba(255, 255, 255, 0.045);
          color: var(--text) !important;
        }

        .button-secondary:hover {
          border-color: var(--line-strong);
          background: rgba(84, 232, 255, 0.06);
        }

        .button-danger {
          color: white;
          background: linear-gradient(90deg, #ff456b, #ff7658);
          box-shadow: 0 0 30px rgba(255, 69, 107, 0.2);
        }

        .hero {
          min-height: calc(100vh - 76px);
          padding: 86px 0 76px;
          display: grid;
          grid-template-columns: 1.08fr 0.92fr;
          gap: 58px;
          align-items: center;
        }

        .eyebrow {
          color: var(--cyan);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .hero h1 {
          max-width: 850px;
          margin: 18px 0 24px;
          font-size: clamp(54px, 7.2vw, 92px);
          line-height: 0.95;
          letter-spacing: -0.058em;
        }

        .gradient-text {
          background:
            linear-gradient(
              90deg,
              #ffffff 0%,
              var(--cyan) 38%,
              var(--green) 72%,
              #ffffff 100%
            );
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }

        .hero-copy {
          max-width: 730px;
          margin: 0;
          color: #b2c4d7;
          font-size: 20px;
          line-height: 1.72;
        }

        .hero-actions {
          margin-top: 30px;
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
        }

        .signal-row {
          margin-top: 34px;
          display: flex;
          flex-wrap: wrap;
          gap: 18px;
        }

        .signal {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: var(--muted);
          font-size: 13px;
        }

        .signal-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
        }

        .signal-dot.blue {
          background: var(--blue);
          box-shadow: 0 0 16px var(--blue);
        }

        .signal-dot.green {
          background: var(--green);
          box-shadow: 0 0 16px var(--green);
        }

        .signal-dot.red {
          background: var(--red);
          box-shadow: 0 0 16px var(--red);
        }

        .execution-core {
          position: relative;
          min-height: 500px;
          display: grid;
          place-items: center;
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 36px;
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.046),
              rgba(255, 255, 255, 0.014)
            );
          box-shadow:
            var(--shadow-blue),
            inset 0 0 90px rgba(41, 167, 255, 0.035);
        }

        .execution-core::before {
          content: "";
          position: absolute;
          inset: 14px;
          border: 1px solid rgba(255, 255, 255, 0.035);
          border-radius: 28px;
        }

        .ring {
          position: absolute;
          border: 1px solid rgba(84, 232, 255, 0.28);
          border-radius: 50%;
        }

        .ring.one {
          width: 340px;
          height: 340px;
          animation: rotate 20s linear infinite;
        }

        .ring.two {
          width: 260px;
          height: 260px;
          border-color: rgba(57, 242, 161, 0.26);
          animation: rotateReverse 14s linear infinite;
        }

        .ring.three {
          width: 400px;
          height: 160px;
          border-color: rgba(255, 69, 107, 0.18);
          transform: rotate(24deg);
          animation: pulseRing 4s ease-in-out infinite alternate;
        }

        @keyframes rotate {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes rotateReverse {
          to {
            transform: rotate(-360deg);
          }
        }

        @keyframes pulseRing {
          from {
            opacity: 0.35;
            transform: rotate(24deg) scale(0.98);
          }

          to {
            opacity: 0.8;
            transform: rotate(24deg) scale(1.04);
          }
        }

        .core-orb {
          position: relative;
          z-index: 4;
          width: 178px;
          height: 178px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background:
            radial-gradient(
              circle at 34% 27%,
              #ffffff 0 2%,
              var(--cyan) 4%,
              #0d4c80 34%,
              #061321 68%
            );
          box-shadow:
            0 0 65px rgba(41, 167, 255, 0.5),
            0 0 110px rgba(57, 242, 161, 0.13),
            inset 0 0 36px rgba(255, 255, 255, 0.24);
          text-align: center;
          font-size: 18px;
          font-weight: 950;
          letter-spacing: 0.08em;
        }

        .core-node {
          position: absolute;
          z-index: 5;
          width: 16px;
          height: 16px;
          border-radius: 50%;
        }

        .core-node.a {
          top: 19%;
          left: 16%;
          background: var(--green);
          box-shadow: 0 0 24px var(--green);
        }

        .core-node.b {
          top: 28%;
          right: 13%;
          background: var(--blue);
          box-shadow: 0 0 24px var(--blue);
        }

        .core-node.c {
          right: 24%;
          bottom: 18%;
          background: var(--red);
          box-shadow: 0 0 24px var(--red);
        }

        .core-caption {
          position: absolute;
          bottom: 26px;
          color: var(--muted);
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .section {
          padding: 94px 0;
          scroll-margin-top: 86px;
        }

        .section-heading {
          max-width: 820px;
          margin-bottom: 38px;
        }

        .section-heading h2 {
          margin: 11px 0 15px;
          font-size: clamp(38px, 5vw, 60px);
          line-height: 1.03;
          letter-spacing: -0.043em;
        }

        .section-heading p {
          margin: 0;
          color: var(--muted);
          font-size: 18px;
          line-height: 1.72;
        }

        .center-heading {
          margin-right: auto;
          margin-left: auto;
          text-align: center;
        }

        .chain-grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 10px;
        }

        .chain-item {
          position: relative;
          min-height: 96px;
          padding: 16px 10px;
          display: grid;
          place-items: center;
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.035);
          text-align: center;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.065em;
          text-transform: uppercase;
        }

        .chain-item::after {
          content: "";
          position: absolute;
          right: 0;
          bottom: 0;
          left: 0;
          height: 2px;
          background:
            linear-gradient(
              90deg,
              transparent,
              var(--cyan),
              transparent
            );
          opacity: 0.46;
        }

        .principle-strip {
          margin-top: 22px;
          padding: 22px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          border: 1px solid rgba(84, 232, 255, 0.2);
          border-radius: 20px;
          background:
            linear-gradient(
              90deg,
              rgba(41, 167, 255, 0.07),
              rgba(57, 242, 161, 0.045)
            );
        }

        .principle-strip strong {
          font-size: 18px;
        }

        .principle-strip span {
          color: var(--muted);
          line-height: 1.6;
          text-align: right;
        }

        .lifecycle-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .lifecycle-card {
          position: relative;
          min-height: 218px;
          padding: 27px;
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 22px;
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.043),
              rgba(255, 255, 255, 0.014)
            );
        }

        .lifecycle-number {
          color: var(--cyan);
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.15em;
        }

        .lifecycle-card h3 {
          margin: 38px 0 10px;
          font-size: 24px;
        }

        .lifecycle-card p {
          margin: 0;
          color: var(--muted);
          line-height: 1.68;
        }

        .lifecycle-card::after {
          content: attr(data-number);
          position: absolute;
          right: 14px;
          bottom: -24px;
          color: rgba(255, 255, 255, 0.025);
          font-size: 110px;
          font-weight: 950;
          letter-spacing: -0.08em;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .card {
          padding: 27px;
          display: flex;
          flex-direction: column;
          border: 1px solid var(--line);
          border-radius: 22px;
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.046),
              rgba(255, 255, 255, 0.016)
            );
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.21);
        }

        .card-icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(84, 232, 255, 0.18);
          border-radius: 14px;
          background: rgba(84, 232, 255, 0.08);
          font-size: 19px;
          font-weight: 900;
        }

        .card h3 {
          margin: 19px 0 9px;
          font-size: 21px;
        }

        .card p {
          margin: 0 0 22px;
          color: var(--muted);
          line-height: 1.67;
        }

        .card-link {
          margin-top: auto;
          color: var(--cyan);
          text-decoration: none;
          font-size: 13px;
          font-weight: 850;
        }

        .card-link:hover {
          color: var(--green);
        }

        .records-hero {
          padding: 38px;
          display: grid;
          grid-template-columns: 1fr 0.92fr;
          gap: 30px;
          align-items: stretch;
          border: 1px solid rgba(84, 232, 255, 0.2);
          border-radius: 30px;
          background:
            linear-gradient(
              135deg,
              rgba(41, 167, 255, 0.09),
              rgba(57, 242, 161, 0.052),
              rgba(255, 255, 255, 0.018)
            );
          box-shadow: var(--shadow-blue);
        }

        .records-copy h2 {
          margin: 12px 0 18px;
          font-size: clamp(40px, 5vw, 62px);
          line-height: 1.02;
          letter-spacing: -0.05em;
        }

        .records-copy > p {
          margin: 0;
          color: var(--muted-light);
          font-size: 18px;
          line-height: 1.75;
        }

        .records-list {
          margin: 26px 0 0;
          padding: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 11px 18px;
          list-style: none;
        }

        .records-list li {
          color: #b9cadd;
          font-size: 14px;
          line-height: 1.5;
        }

        .records-list li::before {
          content: "✓";
          margin-right: 9px;
          color: var(--green);
          font-weight: 950;
        }

        .record-comparison {
          padding: 25px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 22px;
          background: rgba(3, 8, 14, 0.54);
        }

        .comparison-title {
          margin-bottom: 16px;
          color: var(--cyan);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .comparison-header,
        .comparison-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .comparison-header {
          margin-bottom: 8px;
        }

        .comparison-header div {
          padding: 12px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.04);
          font-size: 13px;
          font-weight: 900;
        }

        .comparison-header div:last-child {
          color: var(--green);
          background: rgba(57, 242, 161, 0.07);
        }

        .comparison-row {
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .comparison-row:last-child {
          border-bottom: 0;
        }

        .comparison-row div {
          padding: 12px;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.5;
        }

        .comparison-row div:last-child {
          color: #c8d8e8;
        }

        .demo-grid {
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
          gap: 22px;
          align-items: stretch;
        }

        .route-panel,
        .decision-panel {
          padding: 27px;
          border: 1px solid var(--line);
          border-radius: 24px;
          background: var(--panel);
          backdrop-filter: blur(16px);
        }

        .route-title {
          margin-bottom: 22px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
        }

        .route-title h3 {
          margin: 0 0 8px;
          font-size: 24px;
        }

        .route-title p {
          margin: 0;
          color: var(--muted);
          line-height: 1.6;
        }

        .route-badge {
          padding: 8px 11px;
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          border: 1px solid rgba(84, 232, 255, 0.24);
          border-radius: 999px;
          color: var(--cyan);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .route-fields {
          display: grid;
          gap: 12px;
        }

        .route-field {
          padding: 14px 16px;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.03);
        }

        .route-field span:first-child {
          color: var(--muted);
        }

        .route-field span:last-child {
          font-weight: 750;
          text-align: right;
        }

        .decision-panel {
          min-height: 100%;
          display: flex;
          flex-direction: column;
        }

        .decision-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        .state-display {
          margin: 18px 0 14px;
          font-size: clamp(46px, 7vw, 82px);
          font-weight: 950;
          letter-spacing: 0.02em;
          line-height: 1;
        }

        .state-display.idle {
          color: var(--cyan);
          text-shadow: 0 0 28px rgba(84, 232, 255, 0.3);
        }

        .state-display.running {
          color: var(--blue);
          text-shadow: 0 0 28px rgba(41, 167, 255, 0.38);
        }

        .state-display.hold {
          color: var(--red);
          text-shadow: 0 0 28px rgba(255, 69, 107, 0.4);
        }

        .state-display.allow {
          color: var(--green);
          text-shadow: 0 0 28px rgba(57, 242, 161, 0.38);
        }

        .decision-copy {
          min-height: 56px;
          color: var(--muted);
          line-height: 1.7;
        }

        .progress-track {
          margin: 24px 0;
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 7px;
        }

        .progress-step {
          height: 7px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.07);
          transition:
            background 220ms ease,
            box-shadow 220ms ease,
            transform 220ms ease;
        }

        .progress-step.active {
          background: var(--blue);
          box-shadow: 0 0 14px rgba(41, 167, 255, 0.65);
          transform: scaleY(1.35);
        }

        .progress-step.complete {
          background: var(--green);
          box-shadow: 0 0 14px rgba(57, 242, 161, 0.45);
        }

        .progress-step.failed {
          background: var(--red);
          box-shadow: 0 0 14px rgba(255, 69, 107, 0.55);
        }

        .receipt {
          margin-bottom: 20px;
          padding: 17px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          background: #040810;
          color: #9bb0c5;
          font-family:
            "SFMono-Regular",
            Consolas,
            "Liberation Mono",
            monospace;
          font-size: 12px;
          line-height: 1.72;
          white-space: pre-wrap;
        }

        .decision-actions {
          margin-top: auto;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .record-panel {
          margin-top: 22px;
          padding: 29px;
          border: 1px solid rgba(57, 242, 161, 0.25);
          border-radius: 24px;
          background:
            linear-gradient(
              135deg,
              rgba(57, 242, 161, 0.075),
              rgba(41, 167, 255, 0.055)
            );
          box-shadow: var(--shadow-green);
        }

        .record-header {
          margin-bottom: 22px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 18px;
        }

        .record-header h3 {
          margin: 8px 0 0;
          font-size: 25px;
        }

        .record-status {
          color: var(--green);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .record-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .record-cell {
          padding: 15px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 14px;
          background: rgba(3, 8, 14, 0.52);
        }

        .record-cell small {
          margin-bottom: 7px;
          display: block;
          color: var(--muted);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .record-cell strong {
          font-size: 13px;
          word-break: break-word;
        }

        .record-actions {
          margin-top: 18px;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .price-card {
          position: relative;
          padding: 30px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 26px;
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.045),
              rgba(255, 255, 255, 0.015)
            );
        }

        .price-card.featured {
          border-color: rgba(57, 242, 161, 0.3);
          box-shadow: var(--shadow-green);
        }

        .price-card.organization {
          border-color: rgba(84, 232, 255, 0.27);
          box-shadow: var(--shadow-blue);
        }

        .price-label {
          color: var(--cyan);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .price {
          margin: 18px 0 8px;
          font-size: 56px;
          font-weight: 950;
          letter-spacing: -0.05em;
        }

        .price small {
          color: var(--muted);
          font-size: 14px;
          letter-spacing: 0;
        }

        .price-card > p {
          min-height: 72px;
          color: var(--muted);
          line-height: 1.65;
        }

        .price-card ul {
          margin: 22px 0 26px;
          padding: 0;
          display: grid;
          gap: 12px;
          list-style: none;
          color: #b4c3d3;
        }

        .price-card li {
          line-height: 1.5;
        }

        .price-card li::before {
          content: "✓";
          margin-right: 10px;
          color: var(--green);
          font-weight: 900;
        }

        .price-card .button {
          margin-top: auto;
        }

        .billing-note {
          margin-top: 18px;
          padding: 17px 20px;
          border: 1px solid rgba(255, 212, 106, 0.17);
          border-radius: 16px;
          background: rgba(255, 212, 106, 0.045);
          color: #c6b98f;
          font-size: 13px;
          line-height: 1.65;
        }

        .use-case-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .use-case {
          min-height: 195px;
          padding: 25px;
          border: 1px solid var(--line);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.026);
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease;
        }

        .use-case:hover {
          transform: translateY(-5px);
          border-color: rgba(84, 232, 255, 0.26);
          background: rgba(84, 232, 255, 0.035);
        }

        .use-case h3 {
          margin: 0 0 10px;
        }

        .use-case p {
          margin: 0;
          color: var(--muted);
          line-height: 1.66;
        }

        .manifesto {
          position: relative;
          padding: 48px;
          overflow: hidden;
          border: 1px solid rgba(84, 232, 255, 0.2);
          border-radius: 30px;
          background:
            linear-gradient(
              135deg,
              rgba(41, 167, 255, 0.08),
              rgba(57, 242, 161, 0.05),
              rgba(255, 69, 107, 0.04)
            );
        }

        .manifesto::after {
          content: "TA-14";
          position: absolute;
          right: 22px;
          bottom: -30px;
          color: rgba(255, 255, 255, 0.025);
          font-size: 148px;
          font-weight: 950;
          letter-spacing: -0.08em;
        }

        .manifesto h2 {
          max-width: 900px;
          margin: 12px 0 18px;
          font-size: clamp(42px, 6vw, 72px);
          line-height: 1;
          letter-spacing: -0.05em;
        }

        .manifesto p {
          max-width: 810px;
          margin: 0;
          color: #b3c4d6;
          font-size: 19px;
          line-height: 1.72;
        }

        .footer {
          margin-top: 40px;
          padding: 54px 0;
          border-top: 1px solid var(--line);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 30px;
        }

        .footer h4 {
          margin: 0 0 13px;
        }

        .footer p,
        .footer a {
          color: var(--muted);
          font-size: 14px;
          line-height: 1.7;
          text-decoration: none;
        }

        .footer-links {
          display: grid;
          gap: 8px;
        }

        .footer-bottom {
          margin-top: 34px;
          padding-top: 24px;
          display: flex;
          justify-content: space-between;
          gap: 18px;
          flex-wrap: wrap;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          color: #74889d;
          font-size: 12px;
        }

        @media (max-width: 1040px) {
          .hero,
          .demo-grid,
          .records-hero {
            grid-template-columns: 1fr;
          }

          .execution-core {
            min-height: 410px;
          }

          .chain-grid {
            grid-template-columns: repeat(4, 1fr);
          }

          .product-grid,
          .lifecycle-grid,
          .use-case-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .pricing-grid {
            grid-template-columns: 1fr 1fr;
          }

          .price-card.organization {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 780px) {
          .nav-links {
            position: absolute;
            top: 82px;
            right: 4vw;
            left: 4vw;
            padding: 18px;
            display: ${mobileMenuOpen ? 'grid' : 'none'};
            gap: 14px;
            border: 1px solid var(--line);
            border-radius: 18px;
            background: rgba(4, 9, 16, 0.97);
            box-shadow: 0 24px 60px rgba(0, 0, 0, 0.42);
          }

          .nav-links .button {
            width: 100%;
          }

          .menu-button {
            display: grid;
          }

          .hero {
            padding-top: 58px;
          }

          .hero h1 {
            font-size: 52px;
          }

          .chain-grid,
          .product-grid,
          .lifecycle-grid,
          .pricing-grid,
          .use-case-grid,
          .record-grid,
          .footer-grid,
          .records-list {
            grid-template-columns: 1fr;
          }

          .price-card.organization {
            grid-column: auto;
          }

          .principle-strip {
            align-items: flex-start;
            flex-direction: column;
          }

          .principle-strip span {
            text-align: left;
          }

          .progress-track {
            gap: 4px;
          }

          .manifesto,
          .records-hero {
            padding: 30px;
          }

          .record-header,
          .route-title {
            flex-direction: column;
          }

          .comparison-header,
          .comparison-row {
            grid-template-columns: 0.8fr 1.2fr;
          }
        }

        @media (max-width: 520px) {
          .brand-copy {
            display: none;
          }

          .brand-mark {
            min-width: 62px;
          }

          .hero h1 {
            font-size: 44px;
          }

          .hero-copy {
            font-size: 17px;
          }

          .button {
            width: 100%;
          }

          .signal-row {
            display: grid;
          }

          .chain-grid {
            grid-template-columns: 1fr 1fr;
          }

          .execution-core {
            min-height: 350px;
          }

          .ring.one {
            width: 280px;
            height: 280px;
          }

          .ring.two {
            width: 210px;
            height: 210px;
          }

          .core-orb {
            width: 150px;
            height: 150px;
          }

          .route-field {
            align-items: flex-start;
            flex-direction: column;
            gap: 7px;
          }

          .route-field span:last-child {
            text-align: left;
          }

          .state-display {
            font-size: 50px;
          }

          .comparison-header,
          .comparison-row {
            grid-template-columns: 1fr;
          }

          .comparison-row {
            padding: 6px 0;
          }
        }
      `}</style>

      <div className="site-shell">
        <div className="ambient" aria-hidden="true">
          <div className="ambient-orb one" />
          <div className="ambient-orb two" />
          <div className="ambient-orb three" />
        </div>

        <header className="nav">
          <div className="container nav-inner">
            <a className="brand" href="#top" onClick={closeMobileMenu}>
              <span className="brand-mark">TA-14</span>

              <span className="brand-copy">
                <strong>EXCHANGE PLATFORM</strong>
                <small>ADMISSIBLE EXECUTION INFRASTRUCTURE</small>
              </span>
            </a>

            <nav className="nav-links" aria-label="Primary navigation">
              <a href="#architecture" onClick={closeMobileMenu}>
                Architecture
              </a>

              <a href="#platform" onClick={closeMobileMenu}>
                Platform
              </a>

              <a href="#records" onClick={closeMobileMenu}>
                Governed Records
              </a>

              <a href="#demo" onClick={closeMobileMenu}>
                Live Demo
              </a>

              <a href="#pricing" onClick={closeMobileMenu}>
                Pricing
              </a>

              <a href="#ecosystem" onClick={closeMobileMenu}>
                Ecosystem
              </a>

              <a
                className="button button-primary"
                href="/workspace"
                onClick={closeMobileMenu}
              >
                Open Workspace
              </a>
            </nav>

            <button
              className="menu-button"
              type="button"
              aria-label="Toggle navigation"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              ☰
            </button>
          </div>
        </header>

        <main id="top">
          <section className="container hero">
            <div>
              <div className="eyebrow">
                Build · Test · Correct · Preserve · Verify · Replay
              </div>

              <h1>
                Governance must stand
                <br />
                between intelligence
                <br />
                <span className="gradient-text">and consequence.</span>
              </h1>

              <p className="hero-copy">
                The TA-14 Exchange is a free school, playground, and operating
                environment where builders turn governance ideas into testable
                routes, governed records, preserved evidence, and independently
                replayable proof.
              </p>

              <div className="hero-actions">
                <a className="button button-primary" href="/workspace/routes/new">
                  Build a Governance Route
                </a>

                <a className="button button-secondary" href="#records">
                  Understand Governed Records
                </a>
              </div>

              <div className="signal-row">
                <span className="signal">
                  <span className="signal-dot blue" />
                  Evidence Bound
                </span>

                <span className="signal">
                  <span className="signal-dot green" />
                  Independently Verifiable
                </span>

                <span className="signal">
                  <span className="signal-dot red" />
                  Adverse Results Preserved
                </span>
              </div>
            </div>

            <div className="execution-core" aria-label="TA-14 execution core">
              <div className="ring one" />
              <div className="ring two" />
              <div className="ring three" />

              <span className="core-node a" />
              <span className="core-node b" />
              <span className="core-node c" />

              <div className="core-orb">
                TA-14
                <br />
                EXCHANGE
              </div>

              <div className="core-caption">
                No admissible evidence. No admissible execution.
              </div>
            </div>
          </section>

          <section id="architecture" className="container section">
            <div className="section-heading">
              <div className="eyebrow">The parent architecture</div>

              <h2>
                Governance is not a statement. It is a preserved route.
              </h2>

              <p>
                TA-14 tests whether reality, evidence, continuity, authority,
                binding, commitment, execution, and outcome remain connected
                before and after consequence occurs.
              </p>
            </div>

            <div className="chain-grid">
              {chain.map((item) => (
                <div className="chain-item" key={item}>
                  {item}
                </div>
              ))}
            </div>

            <div className="principle-strip">
              <strong>No admissible evidence. No admissible execution.</strong>

              <span>
                Routes are classified as ALLOW, HOLD, DENY, or ESCALATE.
              </span>
            </div>
          </section>

          <section className="container section">
            <div className="section-heading center-heading">
              <div className="eyebrow">The governed execution lifecycle</div>

              <h2>
                From an idea to an independently replayable record.
              </h2>

              <p>
                The Exchange brings the full lifecycle into one place instead
                of separating policy design, runtime decisions, evidence,
                records, and verification across disconnected systems.
              </p>
            </div>

            <div className="lifecycle-grid">
              {lifecycle.map((item) => (
                <article
                  className="lifecycle-card"
                  data-number={item.number}
                  key={item.number}
                >
                  <div className="lifecycle-number">{item.number}</div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="platform" className="container section">
            <div className="section-heading">
              <div className="eyebrow">
                The governance construction environment
              </div>

              <h2>
                Bring your architecture. Build the governed system around it.
              </h2>

              <p>
                TA-14 does not require independent governance entities to
                surrender their identities or intellectual property. It
                provides a common route where their evidence, controls,
                authority, review layers, decisions, execution, and outcomes
                can be tested together.
              </p>
            </div>

            <div className="product-grid">
              {platformCapabilities.map((item) => (
                <article className="card" key={item.title}>
                  <div className="card-icon">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>

                  <a className="card-link" href={item.href}>
                    {item.action} →
                  </a>
                </article>
              ))}
            </div>
          </section>

          <section id="records" className="container section">
            <article className="records-hero">
              <div className="records-copy">
                <div className="eyebrow">Governed records</div>

                <h2>
                  A record says something happened. A governed record shows why
                  it was allowed to happen.
                </h2>

                <p>
                  An ordinary record may preserve a timestamp, event, or system
                  log. A TA-14 governed record preserves the route from reality
                  to outcome: what was known, where the evidence came from, who
                  possessed authority, what rules applied, what decision was
                  reached, what was corrected, what was committed, what
                  executed, and whether the final outcome corresponded.
                </p>

                <ul className="records-list">
                  {governedRecordContents.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <div className="hero-actions">
                  <a
                    className="button button-primary"
                    href="/workspace/records"
                  >
                    Create a Governed Record
                  </a>

                  <a
                    className="button button-secondary"
                    href="/workspace/routes/new"
                  >
                    Start With a Route
                  </a>
                </div>
              </div>

              <div className="record-comparison">
                <div className="comparison-title">
                  Record versus governed record
                </div>

                <div className="comparison-header">
                  <div>Ordinary Record</div>
                  <div>TA-14 Governed Record</div>
                </div>

                <div className="comparison-row">
                  <div>Stores an event</div>
                  <div>Preserves the complete governed route</div>
                </div>

                <div className="comparison-row">
                  <div>Shows a timestamp</div>
                  <div>Preserves temporal validity and continuity</div>
                </div>

                <div className="comparison-row">
                  <div>Names a user</div>
                  <div>Binds identity, role, authority, and action</div>
                </div>

                <div className="comparison-row">
                  <div>Contains a log entry</div>
                  <div>Contains evidence, rules, decisions, and receipts</div>
                </div>

                <div className="comparison-row">
                  <div>May show what the system reported</div>
                  <div>Shows what was proposed, committed, and executed</div>
                </div>

                <div className="comparison-row">
                  <div>Requires trust in the source system</div>
                  <div>Supports independent integrity verification</div>
                </div>

                <div className="comparison-row">
                  <div>May preserve only success</div>
                  <div>Preserves HOLD, DENY, ESCALATE, and correction history</div>
                </div>

                <div className="comparison-row">
                  <div>Difficult to reconstruct</div>
                  <div>Designed for export, verification, and replay</div>
                </div>
              </div>
            </article>
          </section>

          <section id="demo" className="container section">
            <div className="section-heading">
              <div className="eyebrow">Live route demonstration</div>

              <h2>
                Watch a consequential route fail safely before execution.
              </h2>

              <p>
                Run the route to receive an exact HOLD. Correct the missing
                authority and beneficiary binding, rerun it, and watch the
                Exchange produce a governed-record preview only after the route
                satisfies the stated requirements.
              </p>
            </div>

            <div className="demo-grid">
              <article className="route-panel">
                <div className="route-title">
                  <div>
                    <h3>Vendor Payment Route</h3>
                    <p>Procurement Agent v4.2 · Production environment</p>
                  </div>

                  <span className="route-badge">USD 32,500</span>
                </div>

                <div className="route-fields">
                  <div className="route-field">
                    <span>Organization</span>
                    <span>Northstar Procurement Group</span>
                  </div>

                  <div className="route-field">
                    <span>Supplier</span>
                    <span>Apex Industrial Supply</span>
                  </div>

                  <div className="route-field">
                    <span>Invoice</span>
                    <span>INV-2026-0716</span>
                  </div>

                  <div className="route-field">
                    <span>Procurement authority</span>
                    <span>
                      {authorityCorrected ? 'Current' : 'Missing'}
                    </span>
                  </div>

                  <div className="route-field">
                    <span>Finance authority</span>
                    <span>
                      {authorityCorrected ? 'Current' : 'Missing'}
                    </span>
                  </div>

                  <div className="route-field">
                    <span>Beneficiary binding</span>
                    <span>{authorityCorrected ? 'Bound' : 'Unproven'}</span>
                  </div>
                </div>
              </article>

              <article className="decision-panel">
                <div className="decision-top">
                  <div className="eyebrow">TA-14 decision receipt</div>

                  <span className="route-badge">
                    {authorityCorrected ? 'CORRECTED VERSION' : 'VERSION 1'}
                  </span>
                </div>

                <div
                  className={`state-display ${routeState.toLowerCase()}`}
                >
                  {stateLabel}
                </div>

                <div className="decision-copy">
                  {routeState === 'IDLE' &&
                    'The route is ready for deterministic evaluation.'}

                  {routeState === 'RUNNING' &&
                    `Evaluating ${
                      chain[Math.max(activeStage, 0)] ?? 'route'
                    }...`}

                  {routeState === 'HOLD' &&
                    'Required proof is incomplete but correctable. Current dual authority and beneficiary binding are missing.'}

                  {routeState === 'ALLOW' &&
                    'All mandatory deterministic requirements are satisfied within the stated route scope.'}
                </div>

                <div className="progress-track">
                  {chain.map((item, index) => {
                    const complete =
                      routeState === 'ALLOW' ||
                      (routeState === 'RUNNING' && index < activeStage);

                    const active =
                      routeState === 'RUNNING' && index === activeStage;

                    const failed =
                      routeState === 'HOLD' && index >= 3 && index <= 4;

                    return (
                      <div
                        aria-label={item}
                        className={[
                          'progress-step',
                          complete ? 'complete' : '',
                          active ? 'active' : '',
                          failed ? 'failed' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        key={item}
                      />
                    );
                  })}
                </div>

                <div className="receipt">
                  {routeState === 'IDLE' &&
`ROUTE: Vendor payment above USD 25,000
STATUS: TESTABLE
NEXT ACTION: RUN TA-14 ENGINE`}

                  {routeState === 'RUNNING' &&
`ROUTE: Vendor payment above USD 25,000
TESTING: ${chain[Math.max(activeStage, 0)] ?? 'Reality'}
STATE: EVALUATING
DECISION PRECEDENCE: ACTIVE`}

                  {routeState === 'HOLD' &&
`RESULT: HOLD
TA-14-AUTH-PROC: CURRENT PROCUREMENT AUTHORITY MISSING
TA-14-AUTH-FIN: CURRENT FINANCE AUTHORITY MISSING
TA-14-BIND-BEN: BENEFICIARY NOT BOUND TO EXACT PAYMENT OBJECT
NEXT ACTION: CORRECT AND RERUN`}

                  {routeState === 'ALLOW' &&
`RESULT: ALLOW
TA-14-REQ-ALL: SATISFIED
AUTHORITY: CURRENT DUAL APPROVAL
BENEFICIARY: BOUND
COMMIT CORRESPONDENCE: SATISFIED
NEXT ACTION: GENERATE GOVERNED-RECORD PREVIEW`}
                </div>

                <div className="decision-actions">
                  {routeState === 'IDLE' && (
                    <button
                      className="button button-primary"
                      type="button"
                      onClick={runRoute}
                    >
                      Run Route
                    </button>
                  )}

                  {routeState === 'RUNNING' && (
                    <button
                      className="button button-secondary"
                      type="button"
                      disabled
                    >
                      Testing Route…
                    </button>
                  )}

                  {routeState === 'HOLD' && (
                    <>
                      <button
                        className="button button-danger"
                        type="button"
                        onClick={correctAndRerun}
                      >
                        Correct Route and Rerun
                      </button>

                      <button
                        className="button button-secondary"
                        type="button"
                        onClick={resetRoute}
                      >
                        Reset
                      </button>
                    </>
                  )}

                  {routeState === 'ALLOW' && (
                    <>
                      <button
                        className="button button-primary"
                        type="button"
                        onClick={() => setRecordOpen(true)}
                      >
                        Open Governed-Record Preview
                      </button>

                      <button
                        className="button button-secondary"
                        type="button"
                        onClick={resetRoute}
                      >
                        Run Again
                      </button>
                    </>
                  )}
                </div>
              </article>
            </div>

            {recordOpen && rid && (
              <article className="record-panel">
                <div className="record-header">
                  <div>
                    <div className="record-status">
                      Governed-record preview generated
                    </div>

                    <h3>TA-14 Admissible Execution Record</h3>
                  </div>

                  <span className="route-badge">
                    SELF-DECLARED DEMONSTRATION
                  </span>
                </div>

                <div className="record-grid">
                  <div className="record-cell">
                    <small>Route identity</small>
                    <strong>{rid}</strong>
                  </div>

                  <div className="record-cell">
                    <small>Decision state</small>
                    <strong>ALLOW</strong>
                  </div>

                  <div className="record-cell">
                    <small>Manifest hash</small>
                    <strong>{manifestHash}</strong>
                  </div>

                  <div className="record-cell">
                    <small>Authority basis</small>
                    <strong>Current dual authority</strong>
                  </div>

                  <div className="record-cell">
                    <small>Beneficiary binding</small>
                    <strong>Exact payment object bound</strong>
                  </div>

                  <div className="record-cell">
                    <small>Current boundary</small>
                    <strong>Interactive front-door demonstration</strong>
                  </div>
                </div>

                <div className="record-actions">
                  <a
                    className="button button-primary"
                    href="/workspace/records"
                  >
                    Create a Governed Record
                  </a>

                  <a
                    className="button button-secondary"
                    href="/workspace/verification"
                  >
                    Open Verification Workspace
                  </a>
                </div>
              </article>
            )}
          </section>

          <section id="pricing" className="container section">
            <div className="section-heading">
              <div className="eyebrow">Simple commercial ladder</div>

              <h2>
                Free to learn and build. Paid when professional continuity is
                needed.
              </h2>

              <p>
                Payment purchases workspace capacity, preservation, team
                operations, and professional utility. It never purchases a
                favorable decision, lowers a threshold, removes a finding, or
                creates independently verified status.
              </p>
            </div>

            <div className="pricing-grid">
              <article className="price-card">
                <div className="price-label">Free workspace</div>

                <div className="price">Free</div>

                <p>
                  Learn the architecture, build routes, run tests, correct
                  failures, and preview governed records.
                </p>

                <ul>
                  <li>Route construction workspace</li>
                  <li>Deterministic test execution</li>
                  <li>ALLOW, HOLD, DENY, and ESCALATE states</li>
                  <li>Correction guidance and reruns</li>
                  <li>Governed-record previews</li>
                  <li>Five active private drafts</li>
                </ul>

                <a className="button button-secondary" href="/workspace">
                  Open Free Workspace
                </a>
              </article>

              <article className="price-card featured">
                <div className="price-label">TA-14 Exchange Pro</div>

                <div className="price">
                  $99 <small>per month</small>
                </div>

                <p>
                  Operate a professional governance workspace with private
                  records, team access, and included preserved runs.
                </p>

                <ul>
                  <li>Unlimited private route drafts</li>
                  <li>Private governed-record workspace</li>
                  <li>Up to five organization members</li>
                  <li>Five preserved runs included monthly</li>
                  <li>Version and private replay history</li>
                  <li>Professional templates and reports</li>
                </ul>

                <a
                  className="button button-primary"
                  href="mailto:ta14admissibleexecution@gmail.com?subject=TA-14%20Exchange%20Pro%20Interest"
                >
                  Request Pro Access
                </a>
              </article>

              <article className="price-card organization">
                <div className="price-label">Organization</div>

                <div className="price">
                  $299 <small>per month</small>
                </div>

                <p>
                  Coordinate larger governance teams with expanded capacity,
                  administrative controls, and integration readiness.
                </p>

                <ul>
                  <li>Up to 25 organization members</li>
                  <li>Twenty preserved runs included monthly</li>
                  <li>Advanced role administration</li>
                  <li>Organization-owned governed records</li>
                  <li>API and integration pathway</li>
                  <li>Priority implementation support</li>
                </ul>

                <a
                  className="button button-secondary"
                  href="mailto:ta14admissibleexecution@gmail.com?subject=TA-14%20Organization%20Access"
                >
                  Request Organization Access
                </a>
              </article>
            </div>

            <div className="billing-note">
              Plan architecture and product entitlements are being built into
              the Exchange. Live subscription billing, automated paid access,
              and production entitlement enforcement should not be assumed
              until those systems are completed and verified.
            </div>
          </section>

          <section id="ecosystem" className="container section">
            <div className="section-heading">
              <div className="eyebrow">
                One exchange, many consequential systems
              </div>

              <h2>
                Every governance architecture needs somewhere to become
                operational.
              </h2>

              <p>
                TA-14 provides a shared construction, testing, record,
                verification, and replay environment wherever identity,
                evidence, authority, execution, and outcome must remain
                reconstructable.
              </p>
            </div>

            <div className="use-case-grid">
              {useCases.map((item) => (
                <article className="use-case" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="container section">
            <article className="manifesto">
              <div className="eyebrow">
                TA-14 Authority Governance Institution
              </div>

              <h2>Consequences should never outrun their evidence.</h2>

              <p>
                The Exchange is not another policy library, checklist, private
                risk score, or dashboard asking the world to trust what
                happened behind the screen. It is a place to build the route,
                preserve the governed record, verify the integrity, and replay
                what occurred.
              </p>

              <div className="hero-actions">
                <a className="button button-primary" href="/workspace">
                  Enter the TA-14 Exchange
                </a>

                <a
                  className="button button-secondary"
                  href="mailto:ta14admissibleexecution@gmail.com"
                >
                  Contact TA-14
                </a>
              </div>
            </article>
          </section>
        </main>

        <footer id="contact" className="footer">
          <div className="container">
            <div className="footer-grid">
              <div>
                <a className="brand" href="#top">
                  <span className="brand-mark">TA-14</span>

                  <span className="brand-copy">
                    <strong>EXCHANGE PLATFORM</strong>
                    <small>ADMISSIBLE EXECUTION INFRASTRUCTURE</small>
                  </span>
                </a>

                <p>
                  Build governance routes. Create governed records. Test
                  execution. Preserve evidence. Verify integrity. Replay what
                  occurred.
                </p>
              </div>

              <div>
                <h4>Platform</h4>

                <div className="footer-links">
                  <a href="#architecture">Architecture</a>
                  <a href="#platform">Platform</a>
                  <a href="#records">Governed Records</a>
                  <a href="#demo">Live Demonstration</a>
                  <a href="#pricing">Pricing</a>
                  <a href="#ecosystem">Ecosystem</a>
                </div>
              </div>

              <div>
                <h4>Access</h4>

                <div className="footer-links">
                  <a href="/workspace">Open Workspace</a>
                  <a href="/workspace/routes/new">Build a Route</a>
                  <a href="/workspace/records">Governed Records</a>
                  <a href="/workspace/verification">Verification</a>

                  <a href="mailto:ta14admissibleexecution@gmail.com">
                    ta14admissibleexecution@gmail.com
                  </a>

                  <a
                    href="https://github.com/greggbutlerac-debug"
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub
                  </a>

                  <a
                    href="https://ta14-architecture.netlify.app/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Public Architecture
                  </a>
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <span>
                Reality → Record → Continuity → Admissibility → Binding →
                Commit → Execution → Outcome
              </span>

              <span>
                No admissible evidence. No admissible execution.
              </span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
