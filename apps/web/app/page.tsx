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

const useCases = [
  {
    title: 'AI Agents',
    text: 'Bind identity, authority, tools, payloads, destinations, and outcomes before autonomous action.',
  },
  {
    title: 'Finance',
    text: 'Prove who authorized a transaction, what evidence supported it, and what actually executed.',
  },
  {
    title: 'Healthcare',
    text: 'Preserve accountable human authority, evidence freshness, model version, override, and outcome.',
  },
  {
    title: 'Infrastructure',
    text: 'Govern consequential execution across buildings, energy, environmental systems, and operations.',
  },
  {
    title: 'Government',
    text: 'Create reconstructable records for public authority, administrative action, evidence, and consequence.',
  },
  {
    title: 'Enterprise',
    text: 'Turn governance policies into route-level execution controls, receipts, correction, and durable proof.',
  },
];

const reviewRows = [
  {
    review: 'Readiness or gap assessment',
    market: '$15,000–$50,000',
    marketScope: 'Policies, inventories, maturity, roles, and compliance gaps',
    ta14: '$3,750',
    ta14Scope: 'Full-chain first-pass review across Reality through Outcome',
  },
  {
    review: 'Governance architecture review',
    market: '$25,000–$75,000',
    marketScope: 'Framework, controls, documentation, and organizational design',
    ta14: '$6,250',
    ta14Scope: 'Architecture, evidence, continuity, authority, binding, commit, execution, and outcome',
  },
  {
    review: 'Framework implementation review',
    market: '$40,000–$150,000',
    marketScope: 'Policies, control implementation, operating model, and regulatory mapping',
    ta14: 'from $10,000',
    ta14Scope: 'Multi-route admissibility mapping, broken-link analysis, and governed correction plan',
  },
  {
    review: 'Enterprise governance program',
    market: '$150,000–$500,000+',
    marketScope: 'Enterprise program design, advisory, documentation, and implementation support',
    ta14: 'from $37,500',
    ta14Scope: 'Organization-wide full-chain review, route mapping, boundaries, priorities, and preserved findings',
  },
  {
    review: 'Ongoing governance oversight',
    market: '$8,000–$25,000/mo',
    marketScope: 'Advisory, policy support, meetings, and program management',
    ta14: 'from $2,000/mo',
    ta14Scope: 'Continuous route review, governed-record analysis, correction verification, and escalation support',
  },
];

function makeRid() {
  return `TA-14-RID-${Date.now().toString(36).toUpperCase()}`;
}

function makeHash(value: string) {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
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
    if (routeState === 'IDLE') return 'READY';
    return routeState;
  }, [routeState]);

  useEffect(() => {
    if (routeState !== 'RUNNING') return;

    if (activeStage >= chain.length - 1) {
      const timer = window.setTimeout(() => {
        if (authorityCorrected) {
          setRouteState('ALLOW');
          setRecordOpen(true);

          const newRid = makeRid();
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
          --bg: #03060b;
          --panel: rgba(10, 19, 31, 0.76);
          --line: rgba(116, 166, 221, 0.18);
          --text: #f4f8ff;
          --muted: #95a8bd;
          --blue: #29a7ff;
          --cyan: #54e8ff;
          --green: #39f2a1;
          --red: #ff456b;
          --gold: #ffd46a;
          --shadow-blue: 0 0 60px rgba(41, 167, 255, 0.18);
          --shadow-green: 0 0 60px rgba(57, 242, 161, 0.14);
        }

        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }

        body {
          margin: 0;
          background:
            radial-gradient(circle at 15% 10%, rgba(41, 167, 255, 0.15), transparent 30%),
            radial-gradient(circle at 80% 15%, rgba(57, 242, 161, 0.09), transparent 28%),
            radial-gradient(circle at 50% 85%, rgba(255, 69, 107, 0.08), transparent 34%),
            linear-gradient(180deg, #02050a 0%, #06101b 48%, #02050a 100%);
          color: var(--text);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          overflow-x: hidden;
        }

        body::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.28;
          background-image:
            linear-gradient(rgba(255,255,255,0.024) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.024) 1px, transparent 1px);
          background-size: 34px 34px;
          mask-image: linear-gradient(to bottom, black, transparent 88%);
        }

        a { color: inherit; }
        button, input { font: inherit; }

        .site-shell {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        .ambient-scene {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .ambient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(24px);
          opacity: 0.34;
          will-change: transform;
        }

        .ambient-orb-one {
          width: 34vw;
          height: 34vw;
          min-width: 360px;
          min-height: 360px;
          left: -12vw;
          top: 6vh;
          background: radial-gradient(circle, rgba(41, 167, 255, 0.44), rgba(41, 167, 255, 0.02) 68%, transparent 74%);
          animation: ambientDriftOne 18s ease-in-out infinite alternate;
        }

        .ambient-orb-two {
          width: 30vw;
          height: 30vw;
          min-width: 320px;
          min-height: 320px;
          right: -9vw;
          top: 24vh;
          background: radial-gradient(circle, rgba(57, 242, 161, 0.3), rgba(57, 242, 161, 0.015) 66%, transparent 74%);
          animation: ambientDriftTwo 22s ease-in-out infinite alternate;
        }

        .ambient-orb-three {
          width: 28vw;
          height: 28vw;
          min-width: 300px;
          min-height: 300px;
          left: 34vw;
          bottom: -12vh;
          background: radial-gradient(circle, rgba(255, 69, 107, 0.22), rgba(255, 69, 107, 0.01) 64%, transparent 74%);
          animation: ambientDriftThree 24s ease-in-out infinite alternate;
        }

        .ambient-beam {
          position: absolute;
          width: 64vw;
          height: 2px;
          opacity: 0.25;
          background: linear-gradient(90deg, transparent, rgba(84, 232, 255, 0.85), transparent);
          box-shadow: 0 0 22px rgba(84, 232, 255, 0.32);
          transform-origin: center;
        }

        .ambient-beam-one {
          left: -12vw;
          top: 33vh;
          transform: rotate(-14deg);
          animation: beamSweepOne 16s ease-in-out infinite alternate;
        }

        .ambient-beam-two {
          right: -16vw;
          bottom: 26vh;
          transform: rotate(16deg);
          background: linear-gradient(90deg, transparent, rgba(57, 242, 161, 0.75), transparent);
          box-shadow: 0 0 22px rgba(57, 242, 161, 0.26);
          animation: beamSweepTwo 19s ease-in-out infinite alternate;
        }

        .ambient-stars {
          position: absolute;
          inset: 0;
          opacity: 0.34;
          background-image:
            radial-gradient(circle at 12% 18%, rgba(255,255,255,0.9) 0 1px, transparent 1.5px),
            radial-gradient(circle at 68% 22%, rgba(84,232,255,0.9) 0 1px, transparent 1.5px),
            radial-gradient(circle at 84% 64%, rgba(57,242,161,0.8) 0 1px, transparent 1.5px),
            radial-gradient(circle at 28% 78%, rgba(255,255,255,0.75) 0 1px, transparent 1.5px),
            radial-gradient(circle at 48% 48%, rgba(41,167,255,0.75) 0 1px, transparent 1.5px);
          background-size: 310px 310px, 420px 420px, 360px 360px, 500px 500px, 580px 580px;
          animation: starDrift 42s linear infinite;
        }

        @keyframes ambientDriftOne {
          from { transform: translate3d(0, 0, 0) scale(1); }
          to { transform: translate3d(18vw, 10vh, 0) scale(1.12); }
        }

        @keyframes ambientDriftTwo {
          from { transform: translate3d(0, 0, 0) scale(1); }
          to { transform: translate3d(-16vw, 14vh, 0) scale(1.08); }
        }

        @keyframes ambientDriftThree {
          from { transform: translate3d(0, 0, 0) scale(0.96); }
          to { transform: translate3d(10vw, -18vh, 0) scale(1.14); }
        }

        @keyframes beamSweepOne {
          from { transform: translate3d(-8vw, 0, 0) rotate(-14deg); opacity: 0.12; }
          to { transform: translate3d(26vw, 12vh, 0) rotate(-8deg); opacity: 0.34; }
        }

        @keyframes beamSweepTwo {
          from { transform: translate3d(8vw, 0, 0) rotate(16deg); opacity: 0.1; }
          to { transform: translate3d(-24vw, -10vh, 0) rotate(9deg); opacity: 0.28; }
        }

        @keyframes starDrift {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-120px, 90px, 0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .ambient-orb,
          .ambient-beam,
          .ambient-stars,
          .ring {
            animation: none !important;
          }
        }

        .container {
          width: min(1180px, 92vw);
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .nav {
          position: sticky;
          top: 0;
          z-index: 50;
          border-bottom: 1px solid var(--line);
          background: rgba(3, 7, 13, 0.8);
          backdrop-filter: blur(18px);
        }

        .nav-inner {
          min-height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          font-weight: 850;
          letter-spacing: 0.06em;
          font-size: 13px;
        }

        .brand-mark {
          min-width: 48px;
          height: 42px;
          padding: 0 8px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          border: 1px solid rgba(84, 232, 255, 0.42);
          background: linear-gradient(145deg, rgba(41, 167, 255, 0.18), rgba(57, 242, 161, 0.08));
          box-shadow: 0 0 26px rgba(84, 232, 255, 0.2);
          color: var(--cyan);
          font-weight: 950;
          letter-spacing: -0.03em;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .nav-links a {
          text-decoration: none;
          color: var(--muted);
          font-size: 13px;
        }

        .nav-links a:hover { color: white; }

        .menu-button {
          display: none;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          border: 1px solid var(--line);
          color: white;
          background: rgba(255,255,255,0.04);
        }

        .button {
          border: 0;
          border-radius: 14px;
          padding: 13px 20px;
          font-weight: 850;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        .button:hover { transform: translateY(-2px); }

        .button-primary {
          color: #04110d;
          background: linear-gradient(90deg, var(--cyan), var(--green));
          box-shadow: 0 0 28px rgba(84, 232, 255, 0.23);
        }

        .button-secondary {
          color: var(--text);
          border: 1px solid var(--line);
          background: rgba(255,255,255,0.045);
        }

        .button-danger {
          color: white;
          background: linear-gradient(90deg, #ff456b, #ff7658);
          box-shadow: 0 0 30px rgba(255, 69, 107, 0.2);
        }

        .hero {
          min-height: calc(100vh - 72px);
          display: grid;
          grid-template-columns: 1.08fr 0.92fr;
          gap: 54px;
          align-items: center;
          padding: 86px 0 72px;
        }

        .eyebrow {
          color: var(--cyan);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .hero h1 {
          margin: 18px 0 22px;
          font-size: clamp(54px, 7.2vw, 92px);
          line-height: 0.95;
          letter-spacing: -0.055em;
        }

        .gradient-text {
          background: linear-gradient(90deg, #fff 0%, var(--cyan) 38%, var(--green) 72%, #fff 100%);
          color: transparent;
          background-clip: text;
          -webkit-background-clip: text;
        }

        .hero-copy {
          font-size: 20px;
          line-height: 1.7;
          color: #b0c1d4;
          max-width: 730px;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 30px;
        }

        .signal-row {
          display: flex;
          flex-wrap: wrap;
          gap: 18px;
          margin-top: 34px;
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

        .signal-dot.blue { background: var(--blue); box-shadow: 0 0 16px var(--blue); }
        .signal-dot.green { background: var(--green); box-shadow: 0 0 16px var(--green); }
        .signal-dot.red { background: var(--red); box-shadow: 0 0 16px var(--red); }

        .execution-core {
          min-height: 470px;
          position: relative;
          display: grid;
          place-items: center;
          border-radius: 36px;
          border: 1px solid var(--line);
          background: linear-gradient(145deg, rgba(255,255,255,0.045), rgba(255,255,255,0.015));
          box-shadow: var(--shadow-blue), inset 0 0 90px rgba(41,167,255,0.035);
          overflow: hidden;
        }

        .ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(84,232,255,0.28);
        }

        .ring.one { width: 340px; height: 340px; animation: rotate 20s linear infinite; }
        .ring.two { width: 260px; height: 260px; border-color: rgba(57,242,161,0.26); animation: reverse 14s linear infinite; }
        .ring.three { width: 400px; height: 160px; transform: rotate(24deg); border-color: rgba(255,69,107,0.18); }

        @keyframes rotate { to { transform: rotate(360deg); } }
        @keyframes reverse { to { transform: rotate(-360deg); } }

        .core-orb {
          width: 168px;
          height: 168px;
          border-radius: 50%;
          position: relative;
          z-index: 4;
          display: grid;
          place-items: center;
          text-align: center;
          font-weight: 950;
          letter-spacing: 0.1em;
          background: radial-gradient(circle at 34% 27%, #fff 0 2%, var(--cyan) 4%, #0d4c80 34%, #061321 68%);
          box-shadow: 0 0 65px rgba(41,167,255,0.5), 0 0 110px rgba(57,242,161,0.13);
        }

        .core-caption {
          position: absolute;
          bottom: 24px;
          font-size: 12px;
          color: var(--muted);
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }


        .exchange-preview {
          position: relative;
          padding: 24px 0 92px;
        }

        .exchange-dashboard {
          position: relative;
          overflow: hidden;
          border-radius: 32px;
          border: 1px solid rgba(84, 232, 255, 0.24);
          background:
            linear-gradient(145deg, rgba(10, 19, 31, 0.9), rgba(4, 9, 16, 0.78)),
            radial-gradient(circle at 50% 0%, rgba(41, 167, 255, 0.12), transparent 55%);
          box-shadow: 0 28px 90px rgba(0,0,0,0.38), 0 0 70px rgba(41,167,255,0.1);
        }

        .exchange-dashboard::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.035) 45%, transparent 70%);
          transform: translateX(-100%);
          animation: dashboardSheen 9s ease-in-out infinite;
        }

        @keyframes dashboardSheen {
          0%, 55% { transform: translateX(-100%); }
          85%, 100% { transform: translateX(100%); }
        }

        .exchange-dashboard-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 22px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        .live-indicator {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: var(--green);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .live-pulse {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: var(--green);
          box-shadow: 0 0 16px var(--green);
          animation: livePulse 1.7s ease-in-out infinite;
        }

        @keyframes livePulse {
          0%, 100% { transform: scale(0.82); opacity: 0.6; }
          50% { transform: scale(1.18); opacity: 1; }
        }

        .exchange-dashboard-body {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          min-height: 460px;
        }

        .exchange-metrics {
          padding: 28px;
          border-right: 1px solid rgba(255,255,255,0.07);
          display: grid;
          align-content: center;
          gap: 14px;
        }

        .metric-card {
          position: relative;
          overflow: hidden;
          min-height: 94px;
          padding: 18px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.032);
        }

        .metric-card::before {
          content: "";
          position: absolute;
          inset: auto 0 0;
          height: 2px;
          background: linear-gradient(90deg, var(--cyan), var(--green), transparent);
          transform-origin: left;
          animation: metricScan 5s ease-in-out infinite;
        }

        .metric-card:nth-child(2)::before { animation-delay: 0.8s; }
        .metric-card:nth-child(3)::before { animation-delay: 1.6s; }
        .metric-card:nth-child(4)::before { animation-delay: 2.4s; }

        @keyframes metricScan {
          0%, 20% { transform: scaleX(0); opacity: 0; }
          48% { transform: scaleX(1); opacity: 1; }
          75%, 100% { transform: scaleX(1); opacity: 0.18; }
        }

        .metric-card small {
          display: block;
          color: var(--muted);
          font-size: 11px;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .metric-card strong {
          display: block;
          margin-top: 9px;
          font-size: 23px;
          letter-spacing: -0.03em;
        }

        .route-stream {
          position: relative;
          overflow: hidden;
          padding: 34px 30px;
          background:
            linear-gradient(rgba(84,232,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(84,232,255,0.025) 1px, transparent 1px);
          background-size: 34px 34px;
        }

        .route-stream-label {
          position: relative;
          z-index: 4;
          color: var(--muted);
          font-size: 12px;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .route-orbit {
          position: absolute;
          inset: 66px 34px 34px;
          border-radius: 26px;
          border: 1px solid rgba(84,232,255,0.12);
        }

        .route-orbit::before,
        .route-orbit::after {
          content: "";
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(57,242,161,0.12);
        }

        .route-orbit::before { width: 62%; height: 62%; left: 19%; top: 19%; }
        .route-orbit::after { width: 34%; height: 34%; left: 33%; top: 33%; border-color: rgba(255,69,107,0.13); }

        .floating-route {
          position: absolute;
          z-index: 3;
          width: min(260px, 42%);
          padding: 16px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(5, 12, 21, 0.88);
          box-shadow: 0 14px 38px rgba(0,0,0,0.34);
          backdrop-filter: blur(12px);
          animation: floatRoute 7s ease-in-out infinite alternate;
        }

        .floating-route.one { left: 7%; top: 22%; }
        .floating-route.two { right: 7%; top: 34%; animation-delay: -2.2s; }
        .floating-route.three { left: 25%; bottom: 8%; animation-delay: -4.1s; }
        .floating-route.four { right: 22%; top: 8%; animation-delay: -5.2s; }

        @keyframes floatRoute {
          from { transform: translate3d(0, -5px, 0); }
          to { transform: translate3d(10px, 12px, 0); }
        }

        .floating-route-top {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          color: white;
          font-size: 12px;
          font-weight: 850;
        }

        .route-decision {
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.12em;
        }

        .route-decision.allow { color: var(--green); }
        .route-decision.hold { color: var(--gold); }
        .route-decision.deny { color: var(--red); }
        .route-decision.escalate { color: var(--cyan); }

        .floating-route p {
          margin: 10px 0 0;
          color: var(--muted);
          font-size: 11px;
          line-height: 1.5;
        }

        .chain-live {
          position: absolute;
          left: 8%;
          right: 8%;
          top: 50%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(84,232,255,0.3), rgba(57,242,161,0.8), rgba(84,232,255,0.3), transparent);
          box-shadow: 0 0 16px rgba(84,232,255,0.24);
          animation: chainFlow 3.8s linear infinite;
        }

        @keyframes chainFlow {
          0% { transform: scaleX(0.25); opacity: 0.25; }
          50% { transform: scaleX(1); opacity: 1; }
          100% { transform: scaleX(0.25); opacity: 0.25; }
        }

        .preview-note {
          padding: 14px 24px 20px;
          color: #71859a;
          font-size: 11px;
          line-height: 1.55;
          border-top: 1px solid rgba(255,255,255,0.055);
        }

        @media (max-width: 900px) {
          .exchange-dashboard-body { grid-template-columns: 1fr; }
          .exchange-metrics { border-right: 0; border-bottom: 1px solid rgba(255,255,255,0.07); grid-template-columns: 1fr 1fr; }
          .route-stream { min-height: 430px; }
        }

        @media (max-width: 620px) {
          .exchange-metrics { grid-template-columns: 1fr; }
          .exchange-dashboard-head { align-items: flex-start; flex-direction: column; }
          .floating-route { width: 54%; }
          .floating-route.one { left: 3%; }
          .floating-route.two { right: 3%; }
          .floating-route.three { left: 12%; }
          .floating-route.four { right: 8%; }
        }

        .section { padding: 88px 0; }

        .section-heading {
          max-width: 830px;
          margin-bottom: 34px;
        }

        .section-heading h2 {
          margin: 10px 0 14px;
          font-size: clamp(38px, 5vw, 58px);
          line-height: 1.03;
          letter-spacing: -0.04em;
        }

        .section-heading p {
          color: var(--muted);
          font-size: 18px;
          line-height: 1.7;
        }

        .chain-grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 10px;
        }

        .chain-item {
          min-height: 92px;
          padding: 16px 10px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          text-align: center;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          border: 1px solid var(--line);
          background: rgba(255,255,255,0.035);
        }

        .product-grid, .records-grid, .partner-grid {
          margin-top: 28px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .card {
          border-radius: 22px;
          padding: 26px;
          border: 1px solid var(--line);
          background: linear-gradient(145deg, rgba(255,255,255,0.045), rgba(255,255,255,0.017));
          box-shadow: 0 18px 50px rgba(0,0,0,0.22);
        }

        .card.featured {
          border-color: rgba(57,242,161,0.3);
          box-shadow: var(--shadow-green);
        }

        .card-icon {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          font-size: 20px;
          background: rgba(84,232,255,0.08);
          border: 1px solid rgba(84,232,255,0.18);
        }

        .card h3 { margin: 18px 0 9px; font-size: 21px; }
        .card p { margin: 0; color: var(--muted); line-height: 1.65; }

        .record-compare {
          margin-top: 28px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .record-side {
          border-radius: 24px;
          padding: 28px;
          border: 1px solid var(--line);
          background: rgba(255,255,255,0.028);
        }

        .record-side.ta14 {
          border-color: rgba(57,242,161,0.28);
          background: linear-gradient(135deg, rgba(57,242,161,0.07), rgba(41,167,255,0.05));
        }

        .check-list {
          list-style: none;
          padding: 0;
          margin: 22px 0 0;
          display: grid;
          gap: 12px;
          color: #b8c7d7;
        }

        .check-list li::before {
          content: "✓";
          color: var(--green);
          font-weight: 900;
          margin-right: 10px;
        }

        .review-shell {
          border-radius: 30px;
          padding: 34px;
          border: 1px solid rgba(84,232,255,0.22);
          background: linear-gradient(145deg, rgba(41,167,255,0.07), rgba(57,242,161,0.035));
          overflow: hidden;
        }

        .review-promise {
          display: flex;
          justify-content: space-between;
          gap: 22px;
          align-items: flex-end;
          margin-bottom: 26px;
        }

        .review-promise strong {
          display: block;
          font-size: clamp(38px, 6vw, 72px);
          line-height: 0.95;
          letter-spacing: -0.055em;
          color: var(--green);
        }

        .comparison-wrap {
          overflow-x: auto;
          border-radius: 20px;
          border: 1px solid var(--line);
        }

        .comparison-table {
          width: 100%;
          min-width: 980px;
          border-collapse: collapse;
          background: rgba(2,7,12,0.68);
        }

        .comparison-table th,
        .comparison-table td {
          padding: 18px;
          text-align: left;
          vertical-align: top;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        .comparison-table th {
          color: var(--cyan);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          background: rgba(84,232,255,0.045);
        }

        .comparison-table td {
          color: #b8c7d7;
          line-height: 1.55;
          font-size: 14px;
        }

        .comparison-table td strong {
          color: white;
          font-size: 16px;
        }

        .ta14-price {
          color: var(--green) !important;
          font-weight: 950;
          font-size: 18px !important;
        }

        .market-note {
          color: #71859a;
          font-size: 12px;
          line-height: 1.6;
          margin-top: 14px;
        }

        .two-sided {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 26px;
        }

        .lane-card {
          border-radius: 24px;
          padding: 30px;
          border: 1px solid var(--line);
          background: rgba(255,255,255,0.03);
        }

        .lane-card.partner {
          border-color: rgba(255,212,106,0.3);
          background: linear-gradient(145deg, rgba(255,212,106,0.07), rgba(255,255,255,0.02));
        }

        .lane-card h3 {
          margin: 12px 0;
          font-size: 30px;
          letter-spacing: -0.03em;
        }

        .lane-card p { color: var(--muted); line-height: 1.7; }

        .demo-grid {
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
          gap: 22px;
        }

        .route-panel, .decision-panel {
          border-radius: 24px;
          border: 1px solid var(--line);
          background: var(--panel);
          backdrop-filter: blur(16px);
          padding: 26px;
        }

        .route-title, .decision-top, .record-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
        }

        .route-title h3 { margin: 0 0 8px; font-size: 24px; }
        .route-title p { margin: 0; color: var(--muted); }

        .route-badge {
          white-space: nowrap;
          padding: 8px 11px;
          border-radius: 999px;
          border: 1px solid rgba(84,232,255,0.24);
          color: var(--cyan);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .route-fields { display: grid; gap: 12px; margin-top: 22px; }

        .route-field {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding: 14px 16px;
          border-radius: 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
        }

        .route-field span:first-child { color: var(--muted); }
        .route-field span:last-child { font-weight: 750; text-align: right; }

        .decision-panel {
          display: flex;
          flex-direction: column;
        }

        .state-display {
          margin: 18px 0 14px;
          font-size: clamp(46px, 7vw, 82px);
          font-weight: 950;
          line-height: 1;
        }

        .state-display.idle { color: var(--cyan); }
        .state-display.running { color: var(--blue); }
        .state-display.hold { color: var(--red); }
        .state-display.allow { color: var(--green); }

        .decision-copy {
          color: var(--muted);
          line-height: 1.7;
          min-height: 56px;
        }

        .progress-track {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 7px;
          margin: 24px 0;
        }

        .progress-step {
          height: 7px;
          border-radius: 999px;
          background: rgba(255,255,255,0.07);
        }

        .progress-step.active { background: var(--blue); box-shadow: 0 0 14px rgba(41,167,255,0.65); }
        .progress-step.complete { background: var(--green); }
        .progress-step.failed { background: var(--red); }

        .receipt {
          background: #040810;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 17px;
          font-family: "SFMono-Regular", Consolas, monospace;
          font-size: 12px;
          line-height: 1.72;
          color: #9bb0c5;
          white-space: pre-wrap;
          margin-bottom: 20px;
        }

        .decision-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: auto;
        }

        .record-panel {
          margin-top: 22px;
          border-radius: 24px;
          border: 1px solid rgba(57,242,161,0.25);
          background: linear-gradient(135deg, rgba(57,242,161,0.075), rgba(41,167,255,0.055));
          padding: 28px;
          box-shadow: var(--shadow-green);
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
          margin-top: 22px;
        }

        .record-cell {
          border-radius: 14px;
          padding: 15px;
          background: rgba(3,8,14,0.52);
          border: 1px solid rgba(255,255,255,0.05);
        }

        .record-cell small {
          display: block;
          color: var(--muted);
          margin-bottom: 7px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .record-cell strong { font-size: 13px; word-break: break-word; }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .price-card {
          border-radius: 26px;
          padding: 30px;
          border: 1px solid var(--line);
          background: linear-gradient(145deg, rgba(255,255,255,0.045), rgba(255,255,255,0.015));
        }

        .price-card.featured {
          border-color: rgba(57,242,161,0.28);
          box-shadow: var(--shadow-green);
        }

        .price-label {
          color: var(--cyan);
          font-weight: 900;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-size: 12px;
        }

        .price {
          font-size: 58px;
          font-weight: 950;
          letter-spacing: -0.05em;
          margin: 18px 0 8px;
        }

        .price small { font-size: 15px; color: var(--muted); letter-spacing: 0; }

        .price-card ul {
          list-style: none;
          padding: 0;
          margin: 24px 0;
          display: grid;
          gap: 12px;
          color: #b4c3d3;
        }

        .price-card li::before {
          content: "✓";
          color: var(--green);
          margin-right: 10px;
          font-weight: 900;
        }

        .use-case-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .use-case {
          min-height: 190px;
          padding: 24px;
          border-radius: 20px;
          border: 1px solid var(--line);
          background: rgba(255,255,255,0.026);
        }

        .use-case h3 { margin: 0 0 10px; }
        .use-case p { margin: 0; color: var(--muted); line-height: 1.65; }

        .manifesto {
          border-radius: 30px;
          padding: 46px;
          border: 1px solid rgba(84,232,255,0.2);
          background: linear-gradient(135deg, rgba(41,167,255,0.08), rgba(57,242,161,0.05), rgba(255,69,107,0.04));
        }

        .manifesto h2 {
          max-width: 900px;
          margin: 0 0 18px;
          font-size: clamp(42px, 6vw, 72px);
          line-height: 1;
          letter-spacing: -0.05em;
        }

        .manifesto p {
          max-width: 820px;
          color: #b3c4d6;
          font-size: 19px;
          line-height: 1.72;
        }

        .footer {
          border-top: 1px solid var(--line);
          padding: 52px 0;
          margin-top: 40px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 30px;
        }

        .footer p, .footer a {
          color: var(--muted);
          line-height: 1.7;
          text-decoration: none;
          font-size: 14px;
        }

        .footer-links { display: grid; gap: 8px; }

        .footer-bottom {
          margin-top: 34px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.06);
          color: #74889d;
          font-size: 12px;
          display: flex;
          justify-content: space-between;
          gap: 18px;
          flex-wrap: wrap;
        }

        @media (max-width: 1050px) {
          .nav-links { gap: 12px; }
          .hero, .demo-grid { grid-template-columns: 1fr; }
          .chain-grid { grid-template-columns: repeat(4, 1fr); }
          .product-grid, .records-grid, .partner-grid, .use-case-grid { grid-template-columns: 1fr 1fr; }
          .pricing-grid { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 760px) {
          .nav-links {
            position: absolute;
            left: 4vw;
            right: 4vw;
            top: 78px;
            padding: 18px;
            display: ${mobileMenuOpen ? 'grid' : 'none'};
            gap: 14px;
            border-radius: 18px;
            border: 1px solid var(--line);
            background: rgba(4,9,16,0.97);
          }

          .menu-button { display: inline-grid; place-items: center; }
          .brand span:last-child { display: none; }
          .hero { padding-top: 58px; }
          .hero h1 { font-size: 50px; }

          .chain-grid,
          .product-grid,
          .records-grid,
          .partner-grid,
          .pricing-grid,
          .use-case-grid,
          .record-grid,
          .record-compare,
          .two-sided,
          .footer-grid {
            grid-template-columns: 1fr;
          }

          .review-shell { padding: 24px; }
          .review-promise { align-items: flex-start; flex-direction: column; }
          .manifesto { padding: 30px; }
          .record-header, .route-title { flex-direction: column; }
        }
      `}</style>

      <div className="site-shell">
        <div className="ambient-scene" aria-hidden="true">
          <div className="ambient-orb ambient-orb-one" />
          <div className="ambient-orb ambient-orb-two" />
          <div className="ambient-orb ambient-orb-three" />
          <div className="ambient-beam ambient-beam-one" />
          <div className="ambient-beam ambient-beam-two" />
          <div className="ambient-stars" />
        </div>

        <header className="nav">
          <div className="container nav-inner">
            <a className="brand" href="#top">
              <span className="brand-mark">TA-14</span>
              <span>TA-14 AI GOVERNANCE EXCHANGE</span>
            </a>

            <nav className="nav-links">
              <a href="#architecture">Architecture</a>
              <a href="#records">Records</a>
              <a href="#reviews">Reviews</a>
              <a href="#partners">Partners</a>
              <a href="#demo">Runtime</a>
              <a href="#pricing">Pricing</a>
              <a className="button button-primary" href="/workspace">
                Open Workspace
              </a>
            </nav>

            <button
              className="menu-button"
              type="button"
              aria-label="Toggle navigation"
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              ☰
            </button>
          </div>
        </header>

        <main id="top">
          <section className="container hero">
            <div>
              <div className="eyebrow">Free AI Governance Playground and Workspace</div>

              <h1>
                Build governance.
                <br />
                Test it free.
                <br />
                <span className="gradient-text">Prove the consequence.</span>
              </h1>

              <p className="hero-copy">
                Enter the TA-14 AI Governance Exchange free—no credit card
                required. Build AI governance routes, test runtime decisions,
                expose broken links, correct the route, and preview governed
                records without paying. Pay only when you choose to preserve a
                formal run, operate professionally, or request a full-chain review.
              </p>

              <div className="hero-actions">
                <a className="button button-primary" href="/workspace">
                  Start Building Free
                </a>
                <a className="button button-secondary" href="#demo">
                  See How It Works
                </a>
              </div>

              <div className="signal-row">
                <span className="signal"><span className="signal-dot blue" />Evidence Bound</span>
                <span className="signal"><span className="signal-dot green" />Route Verifiable</span>
                <span className="signal"><span className="signal-dot red" />Adverse Results Preserved</span>
              </div>
            </div>

            <div className="execution-core" aria-label="TA-14 execution core">
              <div className="ring one" />
              <div className="ring two" />
              <div className="ring three" />
              <div className="core-orb">TA-14<br />CORE</div>
              <div className="core-caption">Full-chain admissible execution</div>
            </div>
          </section>

          <section className="container exchange-preview" aria-label="Living governance exchange preview">
            <div className="exchange-dashboard">
              <div className="exchange-dashboard-head">
                <div>
                  <div className="eyebrow">The Exchange is active</div>
                  <h2 style={{ margin: '8px 0 0', fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.04em' }}>
                    Governance moving through the chain.
                  </h2>
                </div>
                <div className="live-indicator"><span className="live-pulse" />Living Exchange Preview</div>
              </div>

              <div className="exchange-dashboard-body">
                <div className="exchange-metrics">
                  <div className="metric-card"><small>Build access</small><strong>Free and unlimited</strong></div>
                  <div className="metric-card"><small>Decision lanes</small><strong>ALLOW · HOLD · DENY · ESCALATE</strong></div>
                  <div className="metric-card"><small>Governance depth</small><strong>Eight linked stages</strong></div>
                  <div className="metric-card"><small>Verification</small><strong>Independent replay surface</strong></div>
                </div>

                <div className="route-stream">
                  <div className="route-stream-label">Consequential routes in motion</div>
                  <div className="route-orbit" />
                  <div className="chain-live" />

                  <article className="floating-route one">
                    <div className="floating-route-top"><span>Vendor Payment</span><span className="route-decision hold">HOLD</span></div>
                    <p>Current authority evidence required before commitment.</p>
                  </article>

                  <article className="floating-route two">
                    <div className="floating-route-top"><span>Medical AI</span><span className="route-decision escalate">ESCALATE</span></div>
                    <p>Human authority requested for consequence-bearing action.</p>
                  </article>

                  <article className="floating-route three">
                    <div className="floating-route-top"><span>Autonomous Agent</span><span className="route-decision deny">DENY</span></div>
                    <p>Destination binding does not match the approved route.</p>
                  </article>

                  <article className="floating-route four">
                    <div className="floating-route-top"><span>Environmental System</span><span className="route-decision allow">ALLOW</span></div>
                    <p>Evidence, continuity, authority, and outcome bound.</p>
                  </article>
                </div>
              </div>

              <div className="preview-note">
                Visual exchange preview. Route decisions shown here are illustrative; production activity and preserved records remain governed by their actual route evidence and execution state.
              </div>
            </div>
          </section>

          <section id="architecture" className="container section">
            <div className="section-heading">
              <div className="eyebrow">The governing chain</div>
              <h2>Others review slivers. TA-14 reviews the route.</h2>
              <p>
                A policy can be correct while an execution is still wrong. TA-14
                evaluates whether reality, evidence, continuity, authority,
                commitment, execution, and outcome remain admissible together.
              </p>
            </div>

            <div className="chain-grid">
              {chain.map((item) => (
                <div className="chain-item" key={item}>{item}</div>
              ))}
            </div>

            <div className="product-grid">
              <article className="card">
                <div className="card-icon">◇</div>
                <h3>Build</h3>
                <p>Model boundaries, actors, authority, evidence, dependencies, rules, commit conditions, execution, and expected outcomes.</p>
              </article>
              <article className="card">
                <div className="card-icon">⚡</div>
                <h3>Challenge</h3>
                <p>Inject missing evidence, stale authority, continuity breaks, beneficiary mismatches, bypass attempts, and outcome failures.</p>
              </article>
              <article className="card">
                <div className="card-icon">✓</div>
                <h3>Verify</h3>
                <p>Preserve route identity, decision history, correction, receipts, execution correspondence, and replayable proof.</p>
              </article>
            </div>
          </section>

          <section id="platform" className="container section">
            <div className="section-heading">
              <div className="eyebrow">One exchange, complete operating surface</div>
              <h2>From governance idea to governed execution record.</h2>
              <p>
                The Exchange turns governance from a document into a testable,
                correctable, preservable, independently reviewable execution system.
              </p>
            </div>

            <div className="product-grid">
              <article className="card"><div className="card-icon">⌘</div><h3>Route Construction</h3><p>Build bounded consequential routes and map the complete Reality-to-Outcome chain.</p></article>
              <article className="card"><div className="card-icon">↯</div><h3>Runtime Testing</h3><p>Run routes, expose exact HOLD and DENY reasons, correct defects, and rerun without hiding adverse results.</p></article>
              <article className="card"><div className="card-icon">◎</div><h3>Governed Records</h3><p>Create durable records that preserve identity, evidence, authority, decisions, corrections, execution, and outcome.</p></article>
              <article className="card"><div className="card-icon">◇</div><h3>Independent Review</h3><p>Submit routes, systems, architectures, and enterprise processes for bounded full-chain review.</p></article>
              <article className="card"><div className="card-icon">#</div><h3>Verification and Replay</h3><p>Verify signatures, hashes, dependencies, continuity, commit integrity, and execution-to-outcome correspondence.</p></article>
              <article className="card"><div className="card-icon">API</div><h3>Integration Layer</h3><p>Connect governance systems, evidence sources, registries, reviewers, policies, agents, and execution environments.</p></article>
            </div>
          </section>

          <section id="records" className="container section">
            <div className="section-heading">
              <div className="eyebrow">Governed records</div>
              <h2>A record should prove more than what someone typed.</h2>
              <p>
                A conventional record may capture an event. A governed record
                preserves the route that made the event admissible—or the exact
                reasons it was held, denied, or escalated.
              </p>
            </div>

            <div className="record-compare">
              <article className="record-side">
                <div className="eyebrow">Ordinary record</div>
                <h3>What happened was recorded.</h3>
                <ul className="check-list">
                  <li>Timestamp and event data</li>
                  <li>Submitted documents</li>
                  <li>Declared approval state</li>
                  <li>Limited reconstruction</li>
                </ul>
              </article>

              <article className="record-side ta14">
                <div className="eyebrow">TA-14 governed record</div>
                <h3>Why the consequence was—or was not—admissible.</h3>
                <ul className="check-list">
                  <li>Stable route identity and manifest</li>
                  <li>Evidence provenance and continuity</li>
                  <li>Authority and exact-object binding</li>
                  <li>Decision, correction, commit, execution, and outcome history</li>
                  <li>Independent verification and replay surface</li>
                  <li>Preserved HOLD, DENY, ALLOW, or ESCALATE result</li>
                </ul>
              </article>
            </div>
          </section>

          <section id="reviews" className="container section">
            <div className="review-shell">
              <div className="review-promise">
                <div className="section-heading" style={{ marginBottom: 0 }}>
                  <div className="eyebrow">TA-14 full-chain reviews</div>
                  <h2>75% less cost. More of the chain.</h2>
                  <p>
                    Traditional governance engagements often price selected layers
                    as custom consulting. TA-14 uses structured intake, bounded
                    review lanes, governed records, reusable evidence requirements,
                    and the Exchange to reduce overhead without reducing scrutiny.
                  </p>
                </div>

                <div>
                  <strong>25%</strong>
                  <span className="market-note">of conventional reference pricing</span>
                </div>
              </div>

              <div className="comparison-wrap">
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>Engagement</th>
                      <th>Conventional reference</th>
                      <th>What is commonly included</th>
                      <th>TA-14 price</th>
                      <th>What TA-14 includes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviewRows.map((row) => (
                      <tr key={row.review}>
                        <td><strong>{row.review}</strong></td>
                        <td>{row.market}</td>
                        <td>{row.marketScope}</td>
                        <td className="ta14-price">{row.ta14}</td>
                        <td>{row.ta14Scope}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="market-note">
                Indicative 2026 market reference ranges. Actual proposals vary by
                scope, organization size, evidence volume, jurisdiction, technical
                testing, interviews, implementation requirements, and regulated
                industry exposure. TA-14 pricing applies to explicitly bounded scopes.
              </p>

              <div className="two-sided">
                <article className="lane-card">
                  <div className="eyebrow">Need your system reviewed?</div>
                  <h3>Put the entire route under review.</h3>
                  <p>
                    Submit an AI governance architecture, agent system, enterprise
                    workflow, evidence framework, payment route, environmental
                    system, healthcare process, or other consequential execution
                    system.
                  </p>
                  <ul className="check-list">
                    <li>Full-chain findings</li>
                    <li>Broken-link identification</li>
                    <li>Bounded correction requirements</li>
                    <li>Preserved review record</li>
                    <li>Retesting after correction</li>
                  </ul>
                  <a
                    className="button button-primary"
                    href="mailto:ta14admissibleexecution@gmail.com?subject=TA-14%20Full-Chain%20Review%20Request"
                  >
                    Submit for Review
                  </a>
                </article>

                <article className="lane-card partner" id="partners">
                  <div className="eyebrow">TA-14 Partner Review Network</div>
                  <h3>Is your governance strong enough to review others?</h3>
                  <p>
                    Qualified governance entities, evidence specialists, runtime
                    systems, reviewers, and domain experts may apply to perform paid,
                    bounded review work through the TA-14 AI Governance Exchange.
                  </p>
                  <ul className="check-list">
                    <li>Paid scoped review opportunities</li>
                    <li>Partner-originated engagement participation</li>
                    <li>Defined review boundaries</li>
                    <li>Public partner recognition</li>
                    <li>Strategic ecosystem work</li>
                  </ul>
                  <a
                    className="button button-secondary"
                    href="mailto:ta14admissibleexecution@gmail.com?subject=TA-14%20Partner%20Review%20Network%20Application"
                  >
                    Apply to the Partner Review Network
                  </a>
                </article>
              </div>
            </div>
          </section>

          <section id="demo" className="container section">
            <div className="section-heading">
              <div className="eyebrow">Live route demonstration</div>
              <h2>Watch a route fail, correct, and become admissible.</h2>
              <p>
                This demonstration submits a consequential vendor payment, exposes
                missing authority and beneficiary binding, preserves the HOLD, and
                reruns the corrected route to generate an admissible execution record.
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
                  <div className="route-field"><span>Organization</span><span>Northstar Procurement Group</span></div>
                  <div className="route-field"><span>Supplier</span><span>Apex Industrial Supply</span></div>
                  <div className="route-field"><span>Invoice</span><span>INV-2026-0716</span></div>
                  <div className="route-field"><span>Procurement authority</span><span>{authorityCorrected ? 'Current' : 'Missing'}</span></div>
                  <div className="route-field"><span>Finance authority</span><span>{authorityCorrected ? 'Current' : 'Missing'}</span></div>
                  <div className="route-field"><span>Beneficiary binding</span><span>{authorityCorrected ? 'Bound' : 'Unproven'}</span></div>
                </div>
              </article>

              <article className="decision-panel">
                <div className="decision-top">
                  <div className="eyebrow">TA-14 decision receipt</div>
                  <span className="route-badge">{authorityCorrected ? 'CORRECTED VERSION' : 'VERSION 1'}</span>
                </div>

                <div className={`state-display ${routeState.toLowerCase()}`}>{stateLabel}</div>

                <div className="decision-copy">
                  {routeState === 'IDLE' && 'The route is ready for deterministic evaluation.'}
                  {routeState === 'RUNNING' && `Evaluating ${chain[Math.max(activeStage, 0)] ?? 'route'}...`}
                  {routeState === 'HOLD' && 'Required proof is incomplete but correctable. Current dual authority and beneficiary binding are missing.'}
                  {routeState === 'ALLOW' && 'All mandatory deterministic requirements are satisfied within the stated route scope.'}
                </div>

                <div className="progress-track">
                  {chain.map((item, index) => {
                    const complete =
                      routeState === 'ALLOW' ||
                      (routeState === 'RUNNING' && index < activeStage);
                    const active = routeState === 'RUNNING' && index === activeStage;
                    const failed = routeState === 'HOLD' && index >= 3 && index <= 4;

                    return (
                      <div
                        aria-label={item}
                        className={[
                          'progress-step',
                          complete ? 'complete' : '',
                          active ? 'active' : '',
                          failed ? 'failed' : '',
                        ].filter(Boolean).join(' ')}
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
NEXT ACTION: CORRECT FREE AND RERUN`}

                  {routeState === 'ALLOW' &&
`RESULT: ALLOW
TA-14-REQ-ALL: SATISFIED
AUTHORITY: CURRENT DUAL APPROVAL
BENEFICIARY: BOUND
COMMIT CORRESPONDENCE: SATISFIED
NEXT ACTION: GENERATE SELF-DECLARED AER`}
                </div>

                <div className="decision-actions">
                  {routeState === 'IDLE' && <button className="button button-primary" type="button" onClick={runRoute}>Run Route</button>}
                  {routeState === 'RUNNING' && <button className="button button-secondary" type="button" disabled>Testing Route…</button>}
                  {routeState === 'HOLD' && (
                    <>
                      <button className="button button-danger" type="button" onClick={correctAndRerun}>Correct Route and Rerun</button>
                      <button className="button button-secondary" type="button" onClick={resetRoute}>Reset</button>
                    </>
                  )}
                  {routeState === 'ALLOW' && (
                    <>
                      <button className="button button-primary" type="button" onClick={() => setRecordOpen(true)}>Open AER Preview</button>
                      <button className="button button-secondary" type="button" onClick={resetRoute}>Run Again</button>
                    </>
                  )}
                </div>
              </article>
            </div>

            {recordOpen && rid && (
              <article className="record-panel">
                <div className="record-header">
                  <div>
                    <div className="record-status">Self-declared AER preview generated</div>
                    <h3>TA-14 Admissible Execution Record</h3>
                  </div>
                  <span className="route-badge">SIGNED PREVIEW</span>
                </div>

                <div className="record-grid">
                  <div className="record-cell"><small>Route identity</small><strong>{rid}</strong></div>
                  <div className="record-cell"><small>Current state</small><strong>ALLOW</strong></div>
                  <div className="record-cell"><small>Manifest hash</small><strong>{manifestHash}</strong></div>
                  <div className="record-cell"><small>Authority basis</small><strong>Current dual authority</strong></div>
                  <div className="record-cell"><small>Boundary</small><strong>Self-declared demonstration</strong></div>
                  <div className="record-cell"><small>Next action</small><strong>Preserve durable route record</strong></div>
                </div>
              </article>
            )}
          </section>

          <section id="pricing" className="container section">
            <div className="section-heading">
              <div className="eyebrow">Accessible by design</div>
              <h2>Learn free. Preserve for $9. Operate professionally for $99.</h2>
              <p>
                Payment purchases utility, continuity, storage, collaboration, and
                professional workflow. It never purchases a favorable decision,
                lowers a threshold, removes a finding, or creates VERIFIED status.
              </p>
            </div>

            <div className="pricing-grid">
              <article className="price-card">
                <div className="price-label">Sandbox</div>
                <div className="price">Free</div>
                <p>Build, test, understand, correct, rerun, and preview governed routes.</p>
                <ul>
                  <li>Route construction</li>
                  <li>Formal TA-14 test execution</li>
                  <li>Exact HOLD and DENY reasons</li>
                  <li>Correction guidance</li>
                  <li>Self-declared record preview</li>
                </ul>
                <a className="button button-secondary" href="/workspace">Open the Sandbox</a>
              </article>

              <article className="price-card">
                <div className="price-label">Preserved run</div>
                <div className="price">$9 <small>one time</small></div>
                <p>Preserve one formal route identity and its essential decision continuity.</p>
                <ul>
                  <li>TA-14-RID route identity</li>
                  <li>Issuance timestamp</li>
                  <li>Essential manifest</li>
                  <li>Decision and correction history</li>
                  <li>Stable verification reference</li>
                </ul>
                <a className="button button-secondary" href="/workspace">Build Before Preserving</a>
              </article>

              <article className="price-card featured">
                <div className="price-label">TA-14 Exchange Pro</div>
                <div className="price">$99 <small>/ month</small></div>
                <p>Professional governance operations for builders, reviewers, and small teams.</p>
                <ul>
                  <li>Private route and record library</li>
                  <li>Organization workspace for up to five members</li>
                  <li>Five preserved runs monthly</li>
                  <li>Version comparison and replay history</li>
                  <li>Professional templates and priority support</li>
                </ul>
                <a className="button button-primary" href="/pricing">Explore Exchange Pro</a>
              </article>
            </div>
          </section>

          <section id="use-cases" className="container section">
            <div className="section-heading">
              <div className="eyebrow">One exchange, many consequential systems</div>
              <h2>AI governance is the entrance—not the limit.</h2>
              <p>
                The TA-14 AI Governance Exchange begins with AI governance while
                supporting every domain where authority, evidence, execution, and
                outcome must remain reconstructable.
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
              <div className="eyebrow">TA-14 Authority Governance Institution</div>
              <h2>No admissible evidence. No admissible execution.</h2>
              <p>
                The Exchange is where governance systems become testable, governed
                records become verifiable, qualified reviewers earn through bounded
                work, and organizations obtain full-chain scrutiny without
                conventional consulting overhead.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="/workspace">Experience the Exchange</a>
                <a className="button button-secondary" href="mailto:ta14admissibleexecution@gmail.com">Contact TA-14</a>
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
                  <span>TA-14 AI GOVERNANCE EXCHANGE</span>
                </a>
                <p>Build governance routes. Create governed records. Verify consequential execution.</p>
              </div>

              <div>
                <h4>Exchange</h4>
                <div className="footer-links">
                  <a href="#architecture">Architecture</a>
                  <a href="#records">Governed Records</a>
                  <a href="#reviews">Reviews</a>
                  <a href="#partners">Partner Review Network</a>
                  <a href="#pricing">Pricing</a>
                </div>
              </div>

              <div>
                <h4>Contact</h4>
                <div className="footer-links">
                  <a href="mailto:ta14admissibleexecution@gmail.com">ta14admissibleexecution@gmail.com</a>
                  <a href="https://github.com/greggbutlerac-debug" target="_blank" rel="noreferrer">GitHub</a>
                  <a href="https://ta14-architecture.netlify.app/" target="_blank" rel="noreferrer">Public Architecture</a>
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <span>Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome</span>
              <span>No admissible evidence. No admissible execution.</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
