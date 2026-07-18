
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

function makeRid() {
  return `TA14-RID-${Date.now().toString(36).toUpperCase()}`;
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
          --bg-soft: #07101a;
          --panel: rgba(10, 19, 31, 0.72);
          --panel-strong: rgba(8, 15, 26, 0.92);
          --line: rgba(116, 166, 221, 0.16);
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

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background:
            radial-gradient(circle at 15% 10%, rgba(41, 167, 255, 0.15), transparent 30%),
            radial-gradient(circle at 80% 15%, rgba(57, 242, 161, 0.09), transparent 28%),
            radial-gradient(circle at 50% 85%, rgba(255, 69, 107, 0.08), transparent 34%),
            linear-gradient(180deg, #02050a 0%, #06101b 48%, #02050a 100%);
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
          pointer-events: none;
          opacity: 0.28;
          background-image:
            linear-gradient(rgba(255,255,255,0.024) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.024) 1px, transparent 1px);
          background-size: 34px 34px;
          mask-image: linear-gradient(to bottom, black, transparent 88%);
        }

        a {
          color: inherit;
        }

        button,
        input {
          font: inherit;
        }

        .site-shell {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }

        .ambient {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 0;
        }

        .ambient-orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(90px);
          opacity: 0.22;
          animation: drift 14s ease-in-out infinite alternate;
        }

        .ambient-orb.one {
          width: 430px;
          height: 430px;
          background: var(--blue);
          top: -180px;
          left: -120px;
        }

        .ambient-orb.two {
          width: 360px;
          height: 360px;
          background: var(--green);
          right: -120px;
          top: 250px;
          animation-delay: -5s;
        }

        .ambient-orb.three {
          width: 320px;
          height: 320px;
          background: var(--red);
          left: 38%;
          bottom: -160px;
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
          background: rgba(3, 7, 13, 0.72);
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
          letter-spacing: 0.08em;
          font-size: 14px;
        }

        .brand-mark {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          border: 1px solid rgba(84, 232, 255, 0.42);
          background:
            linear-gradient(145deg, rgba(41, 167, 255, 0.18), rgba(57, 242, 161, 0.08));
          box-shadow:
            0 0 26px rgba(84, 232, 255, 0.2),
            inset 0 0 18px rgba(255,255,255,0.05);
          color: var(--cyan);
          font-weight: 950;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .nav-links a {
          text-decoration: none;
          color: var(--muted);
          font-size: 14px;
          transition: color 180ms ease;
        }

        .nav-links a:hover {
          color: white;
        }

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
          transition:
            transform 180ms ease,
            box-shadow 180ms ease,
            border-color 180ms ease;
        }

        .button:hover {
          transform: translateY(-2px);
        }

        .button-primary {
          color: #04110d;
          background: linear-gradient(90deg, var(--cyan), var(--green));
          box-shadow:
            0 0 28px rgba(84, 232, 255, 0.23),
            0 0 46px rgba(57, 242, 161, 0.1);
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
          font-size: clamp(54px, 7.5vw, 94px);
          line-height: 0.94;
          letter-spacing: -0.055em;
          max-width: 850px;
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
          color: transparent;
          background-clip: text;
          -webkit-background-clip: text;
        }

        .hero-copy {
          font-size: 20px;
          line-height: 1.7;
          color: #b0c1d4;
          max-width: 720px;
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
          min-height: 470px;
          position: relative;
          display: grid;
          place-items: center;
          border-radius: 36px;
          border: 1px solid var(--line);
          background:
            linear-gradient(145deg, rgba(255,255,255,0.045), rgba(255,255,255,0.015));
          box-shadow:
            var(--shadow-blue),
            inset 0 0 90px rgba(41,167,255,0.035);
          overflow: hidden;
        }

        .execution-core::before {
          content: "";
          position: absolute;
          inset: 14px;
          border-radius: 28px;
          border: 1px solid rgba(255,255,255,0.035);
        }

        .ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(84,232,255,0.28);
        }

        .ring.one {
          width: 340px;
          height: 340px;
          animation: rotate 20s linear infinite;
        }

        .ring.two {
          width: 260px;
          height: 260px;
          border-color: rgba(57,242,161,0.26);
          animation: rotateReverse 14s linear infinite;
        }

        .ring.three {
          width: 400px;
          height: 160px;
          transform: rotate(24deg);
          border-color: rgba(255,69,107,0.18);
          animation: pulseRing 4s ease-in-out infinite alternate;
        }

        @keyframes rotate {
          to { transform: rotate(360deg); }
        }

        @keyframes rotateReverse {
          to { transform: rotate(-360deg); }
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
          background:
            radial-gradient(circle at 34% 27%, #ffffff 0 2%, var(--cyan) 4%, #0d4c80 34%, #061321 68%);
          box-shadow:
            0 0 65px rgba(41,167,255,0.5),
            0 0 110px rgba(57,242,161,0.13),
            inset 0 0 36px rgba(255,255,255,0.24);
        }

        .core-node {
          position: absolute;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          z-index: 5;
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
          bottom: 18%;
          right: 24%;
          background: var(--red);
          box-shadow: 0 0 24px var(--red);
        }

        .core-caption {
          position: absolute;
          bottom: 24px;
          font-size: 12px;
          color: var(--muted);
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .section {
          padding: 88px 0;
        }

        .section-heading {
          max-width: 780px;
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
          position: relative;
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
          overflow: hidden;
        }

        .chain-item::after {
          content: "";
          position: absolute;
          inset: auto 0 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--cyan), transparent);
          opacity: 0.45;
        }

        .product-grid {
          margin-top: 28px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .card {
          border-radius: 22px;
          padding: 26px;
          border: 1px solid var(--line);
          background:
            linear-gradient(145deg, rgba(255,255,255,0.045), rgba(255,255,255,0.017));
          box-shadow: 0 18px 50px rgba(0,0,0,0.22);
        }

        .card-icon {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          font-size: 22px;
          background: rgba(84,232,255,0.08);
          border: 1px solid rgba(84,232,255,0.18);
        }

        .card h3 {
          margin: 18px 0 9px;
          font-size: 21px;
        }

        .card p {
          margin: 0;
          color: var(--muted);
          line-height: 1.65;
        }

        .demo-grid {
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
          gap: 22px;
          align-items: stretch;
        }

        .route-panel,
        .decision-panel {
          border-radius: 24px;
          border: 1px solid var(--line);
          background: var(--panel);
          backdrop-filter: blur(16px);
          padding: 26px;
        }

        .route-title {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 22px;
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
          white-space: nowrap;
          padding: 8px 11px;
          border-radius: 999px;
          border: 1px solid rgba(84,232,255,0.24);
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
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding: 14px 16px;
          border-radius: 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
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
          text-shadow: 0 0 28px rgba(84,232,255,0.3);
        }

        .state-display.running {
          color: var(--blue);
          text-shadow: 0 0 28px rgba(41,167,255,0.38);
        }

        .state-display.hold {
          color: var(--red);
          text-shadow: 0 0 28px rgba(255,69,107,0.4);
        }

        .state-display.allow {
          color: var(--green);
          text-shadow: 0 0 28px rgba(57,242,161,0.38);
        }

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
          transition:
            background 220ms ease,
            box-shadow 220ms ease,
            transform 220ms ease;
        }

        .progress-step.active {
          background: var(--blue);
          box-shadow: 0 0 14px rgba(41,167,255,0.65);
          transform: scaleY(1.35);
        }

        .progress-step.complete {
          background: var(--green);
          box-shadow: 0 0 14px rgba(57,242,161,0.45);
        }

        .progress-step.failed {
          background: var(--red);
          box-shadow: 0 0 14px rgba(255,69,107,0.55);
        }

        .receipt {
          background: #040810;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 17px;
          font-family:
            "SFMono-Regular",
            Consolas,
            "Liberation Mono",
            monospace;
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
          background:
            linear-gradient(135deg, rgba(57,242,161,0.075), rgba(41,167,255,0.055));
          padding: 28px;
          box-shadow: var(--shadow-green);
        }

        .record-header {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: flex-start;
          margin-bottom: 22px;
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

        .record-cell strong {
          font-size: 13px;
          word-break: break-word;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .price-card {
          position: relative;
          border-radius: 26px;
          padding: 32px;
          border: 1px solid var(--line);
          background: linear-gradient(145deg, rgba(255,255,255,0.045), rgba(255,255,255,0.015));
          overflow: hidden;
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
          font-size: 68px;
          font-weight: 950;
          letter-spacing: -0.05em;
          margin: 18px 0 8px;
        }

        .price small {
          font-size: 15px;
          color: var(--muted);
          letter-spacing: 0;
        }

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
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease;
        }

        .use-case:hover {
          transform: translateY(-5px);
          border-color: rgba(84,232,255,0.26);
          background: rgba(84,232,255,0.035);
        }

        .use-case h3 {
          margin: 0 0 10px;
        }

        .use-case p {
          margin: 0;
          color: var(--muted);
          line-height: 1.65;
        }

        .manifesto {
          position: relative;
          overflow: hidden;
          border-radius: 30px;
          padding: 46px;
          border: 1px solid rgba(84,232,255,0.2);
          background:
            linear-gradient(135deg, rgba(41,167,255,0.08), rgba(57,242,161,0.05), rgba(255,69,107,0.04));
        }

        .manifesto::after {
          content: "TA-14";
          position: absolute;
          right: 22px;
          bottom: -28px;
          font-size: 150px;
          font-weight: 950;
          color: rgba(255,255,255,0.025);
          letter-spacing: -0.08em;
        }

        .manifesto h2 {
          max-width: 860px;
          margin: 0 0 18px;
          font-size: clamp(42px, 6vw, 72px);
          line-height: 1;
          letter-spacing: -0.05em;
        }

        .manifesto p {
          max-width: 790px;
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

        .footer h4 {
          margin: 0 0 13px;
        }

        .footer p,
        .footer a {
          color: var(--muted);
          line-height: 1.7;
          text-decoration: none;
          font-size: 14px;
        }

        .footer-links {
          display: grid;
          gap: 8px;
        }

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

        @media (max-width: 980px) {
          .hero,
          .demo-grid {
            grid-template-columns: 1fr;
          }

          .execution-core {
            min-height: 390px;
          }

          .chain-grid {
            grid-template-columns: repeat(4, 1fr);
          }

          .product-grid,
          .use-case-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 720px) {
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
            background: rgba(4,9,16,0.96);
          }

          .menu-button {
            display: inline-grid;
            place-items: center;
          }

          .hero {
            padding-top: 58px;
          }

          .hero h1 {
            font-size: 54px;
          }

          .chain-grid,
          .product-grid,
          .pricing-grid,
          .use-case-grid,
          .record-grid,
          .footer-grid {
            grid-template-columns: 1fr;
          }

          .progress-track {
            gap: 4px;
          }

          .manifesto {
            padding: 30px;
          }

          .record-header,
          .route-title {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="site-shell">
        <div className="ambient">
          <div className="ambient-orb one" />
          <div className="ambient-orb two" />
          <div className="ambient-orb three" />
        </div>

        <header className="nav">
          <div className="container nav-inner">
            <a className="brand" href="#top">
              <span className="brand-mark">14</span>
              <span>TA-14 EXCHANGE PLATFORM</span>
            </a>

            <nav className="nav-links">
              <a href="#architecture">Architecture</a>
              <a href="#platform">Platform</a>
              <a href="#demo">Runtime</a>
              <a href="#pricing">Pricing</a>
              <a href="#use-cases">Ecosystem</a>
              <a href="#contact">Contact</a>
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
              <div className="eyebrow">
                Governance Infrastructure for Builders
              </div>

              <h1>
                Build the governance system
                <br />
                that stands between
                <br />
                <span className="gradient-text">
                  intelligence and consequence.
                </span>
              </h1>

              <p className="hero-copy">
                TA-14 is the exchange platform where AI governance entities, enterprises, reviewers, researchers, and system builders design, test, connect, and verify governance systems before those systems authorize consequential execution.
              </p>

              <div className="hero-actions">
                <a className="button button-primary" href="/workspace">
                  Enter the Governance Workspace
                </a>

                <a className="button button-secondary" href="#architecture">
                  Explore the TA-14 Architecture
                </a>
              </div>

              <div className="signal-row">
                <span className="signal">
                  <span className="signal-dot blue" />
                  Evidence Bound
                </span>

                <span className="signal">
                  <span className="signal-dot green" />
                  Route Verifiable
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
                CORE
              </div>

              <div className="core-caption">
                Governance system construction layer
              </div>
            </div>
          </section>

          <section id="architecture" className="container section">
            <div className="section-heading">
              <div className="eyebrow">The governing chain</div>

              <h2>
                A place to build governance—not merely describe it.
              </h2>

              <p>
                Bring your own architecture, policy model, agent system, evidence framework, or review layer. TA-14 gives builders a common execution route for testing whether authority, evidence, continuity, binding, commit, execution, and outcome remain admissible together.
              </p>
            </div>

            <div className="chain-grid">
              {chain.map((item) => (
                <div className="chain-item" key={item}>
                  {item}
                </div>
              ))}
            </div>

            <div className="product-grid">
              <article className="card">
                <div className="card-icon">◇</div>
                <h3>Design</h3>
                <p>
                  Model your governance system, define its boundaries, identify its authority sources, and map every dependency required before execution.
                </p>
              </article>

              <article className="card">
                <div className="card-icon">⚡</div>
                <h3>Challenge</h3>
                <p>
                  Run route-level challenge tests across identity, evidence integrity, freshness, policy, authority, commit, bypass resistance, replay, and outcome correspondence.
                </p>
              </article>

              <article className="card">
                <div className="card-icon">✓</div>
                <h3>Connect</h3>
                <p>
                  Connect governance entities, review partners, APIs, registries, evidence systems, and execution environments through one preserved route identity.
                </p>
              </article>
            </div>
          </section>

          <section id="platform" className="container section">
            <div className="section-heading">
              <div className="eyebrow">The governance construction environment</div>

              <h2>
                Bring your architecture. Build the system around it.
              </h2>

              <p>
                The TA-14 Exchange Platform is designed for governance entities and
                system builders who need more than a public framework. It provides
                the workspace where governance models become testable routes,
                interoperable controls, preserved records, and independently
                reviewable execution infrastructure.
              </p>
            </div>

            <div className="product-grid">
              <article className="card">
                <div className="card-icon">⌘</div>
                <h3>Architecture Workspace</h3>
                <p>
                  Map your governance model to the TA-14 chain without surrendering
                  your identity, intellectual property, or independent boundaries.
                </p>
              </article>

              <article className="card">
                <div className="card-icon">↯</div>
                <h3>Runtime Sandbox</h3>
                <p>
                  Submit consequential routes, inject failures, test corrections,
                  inspect decision receipts, and prove how your system behaves before
                  production consequence.
                </p>
              </article>

              <article className="card">
                <div className="card-icon">◎</div>
                <h3>Governance Exchange</h3>
                <p>
                  Connect review entities, evidence layers, policy engines, agent
                  controls, registries, APIs, and execution systems through bounded,
                  attributable interfaces.
                </p>
              </article>

              <article className="card">
                <div className="card-icon">◇</div>
                <h3>Partner Review Network</h3>
                <p>
                  Preserve architectural independence while receiving scoped review,
                  second-layer challenge, referral continuity, and clearly documented
                  boundaries.
                </p>
              </article>

              <article className="card">
                <div className="card-icon">#</div>
                <h3>Public Registry</h3>
                <p>
                  Issue stable route identities, preserve manifests and decision
                  histories, and create a verification surface that does not depend on
                  trusting a private dashboard.
                </p>
              </article>

              <article className="card">
                <div className="card-icon">API</div>
                <h3>Integration Layer</h3>
                <p>
                  Bind external governance systems to route creation, evidence intake,
                  decision states, commits, execution receipts, outcomes, and replay
                  verification.
                </p>
              </article>
            </div>
          </section>

          <section id="demo" className="container section">
            <div className="section-heading">
              <div className="eyebrow">Live route demonstration</div>

              <h2>
                Experience the shared runtime beneath every governance system.
              </h2>

              <p>
                This demonstration shows how an external governance system can submit a consequential route into TA-14, receive an exact HOLD, correct the missing authority and beneficiary binding, and generate a preserved execution record after the route becomes admissible.
              </p>
            </div>

            <div className="demo-grid">
              <article className="route-panel">
                <div className="route-title">
                  <div>
                    <h3>Vendor Payment Route</h3>
                    <p>
                      Procurement Agent v4.2 · Production environment
                    </p>
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
                    <span>
                      {authorityCorrected ? 'Bound' : 'Unproven'}
                    </span>
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
                    `Evaluating ${chain[Math.max(activeStage, 0)] ?? 'route'}...`}

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
TA14-AUTH-PROC: CURRENT PROCUREMENT AUTHORITY MISSING
TA14-AUTH-FIN: CURRENT FINANCE AUTHORITY MISSING
TA14-BIND-BEN: BENEFICIARY NOT BOUND TO EXACT PAYMENT OBJECT
NEXT ACTION: CORRECT FREE AND RERUN`}

                  {routeState === 'ALLOW' &&
`RESULT: ALLOW
TA14-REQ-ALL: SATISFIED
AUTHORITY: CURRENT DUAL APPROVAL
BENEFICIARY: BOUND
COMMIT CORRESPONDENCE: SATISFIED
NEXT ACTION: GENERATE SELF-DECLARED AER`}
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
                        Open AER Preview
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
                      Self-declared AER preview generated
                    </div>

                    <h3>TA-14 Admissible Execution Record</h3>
                  </div>

                  <span className="route-badge">SIGNED PREVIEW</span>
                </div>

                <div className="record-grid">
                  <div className="record-cell">
                    <small>Route identity</small>
                    <strong>{rid}</strong>
                  </div>

                  <div className="record-cell">
                    <small>Current state</small>
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
                    <small>Boundary</small>
                    <strong>Self-declared demonstration</strong>
                  </div>

                  <div className="record-cell">
                    <small>Next action</small>
                    <strong>Preserve durable route record</strong>
                  </div>
                </div>
              </article>
            )}
          </section>

          <section id="pricing" className="container section">
            <div className="section-heading">
              <div className="eyebrow">Simple commercial ladder</div>

              <h2>
                Useful without payment. Durable for $9.
              </h2>

              <p>
                Payment purchases utility and continuity. It never purchases a
                favorable decision, lowers a threshold, removes a finding, or
                creates independently VERIFIED status.
              </p>
            </div>

            <div className="pricing-grid">
              <article className="price-card">
                <div className="price-label">Foundational route</div>

                <div className="price">
                  Free
                </div>

                <p>
                  Build, test, understand, correct, rerun, and preview a
                  self-declared record.
                </p>

                <ul>
                  <li>One bounded consequential route</li>
                  <li>Formal TA-14 test execution</li>
                  <li>Exact HOLD reasons</li>
                  <li>Free correction guidance</li>
                  <li>Protected correction rerun</li>
                  <li>Self-declared AER preview</li>
                </ul>

                <a className="button button-secondary" href="/workspace">
                  Test a Route
                </a>
              </article>

              <article className="price-card featured">
                <div className="price-label">Durable route record</div>

                <div className="price">
                  $9 <small>one time</small>
                </div>

                <p>
                  Preserve one official route identity and its essential
                  continuity.
                </p>

                <ul>
                  <li>TA14-RID route identity</li>
                  <li>Signed issuance timestamp</li>
                  <li>Essential manifest</li>
                  <li>Decision and correction history</li>
                  <li>Stable public lookup reference</li>
                  <li>Current limitations and boundary</li>
                </ul>

                <button
                  className="button button-primary"
                  type="button"
                  onClick={() => {
                    document
                      .getElementById('demo')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Build Before Preserving
                </button>
              </article>
            </div>
          </section>

          <section id="use-cases" className="container section">
            <div className="section-heading">
              <div className="eyebrow">One exchange, many governance systems</div>

              <h2>
                Every governance architecture needs somewhere to become operational.
              </h2>

              <p>
                TA-14 provides the construction, testing, exchange, review, registry, and verification environment for governance systems operating wherever identity, authority, evidence, execution, and outcome must remain reconstructable.
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

              <h2>
                Consequences should never outrun their evidence.
              </h2>

              <p>
                The software can be copied. The canonical identifiers, current
                specification, registry, signed history, verification network,
                institutional continuity, and public record cannot be recreated
                quickly. TA-14 is building the destination for admissible
                execution.
              </p>

              <div className="hero-actions">
                <a className="button button-primary" href="/workspace">
                  Experience the Route
                </a>

                <a
                  className="button button-secondary"
                  href="mailto:ta14admissibleexecution@gmail.com"
                >
                  Request Enterprise Access
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
                  <span className="brand-mark">14</span>
                  <span>TA-14 EXCHANGE PLATFORM</span>
                </a>

                <p>
                  Build governance systems. Connect review layers. Test execution routes. Preserve proof.
                </p>
              </div>

              <div>
                <h4>Platform</h4>

                <div className="footer-links">
                  <a href="#architecture">Architecture</a>
                  <a href="#demo">Runtime</a>
                  <a href="#pricing">Pricing</a>
                  <a href="#use-cases">Ecosystem</a>
                </div>
              </div>

              <div>
                <h4>Contact</h4>

                <div className="footer-links">
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
