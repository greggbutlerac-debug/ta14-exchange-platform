"use client";

import { useEffect, useMemo, useState } from "react";

type RouteState = "IDLE" | "RUNNING" | "HOLD" | "ALLOW";

const chain = [
  "Reality",
  "Record",
  "Continuity",
  "Admissibility",
  "Binding",
  "Commit",
  "Execution",
  "Outcome",
];

const useCases = [
  {
    title: "AI Agents and Autonomous Systems",
    text: "Bind identity, delegated authority, tools, payloads, destinations, commands, and outcomes before autonomous action.",
  },
  {
    title: "Finance and Enterprise",
    text: "Govern vendor payments, procurement, approvals, identity, beneficiary binding, and execution correspondence.",
  },
  {
    title: "Healthcare and Critical Operations",
    text: "Preserve accountable human authority, evidence freshness, model version, escalation, intervention, and outcome.",
  },
  {
    title: "Built Environment",
    text: "Govern BAS overrides, AI optimization, critical-space validity, commissioning, alarm resolution, energy, and emergency operation.",
  },
  {
    title: "Environmental Systems",
    text: "Govern atmospheric integrity, refrigerant intervention, moisture, pressure, air, remediation, and verified restoration.",
  },
  {
    title: "Manufacturing and Infrastructure",
    text: "Govern process release, restart, robotics, utilities, quality, critical execution, and recovery.",
  },
  {
    title: "Government and Public Authority",
    text: "Create reconstructable records for public authority, administrative action, evidence, boundaries, and consequence.",
  },
  {
    title: "Governance Research and Education",
    text: "Build route libraries, break dependencies, repair HOLD conditions, study decisions, and teach governance through use.",
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

  return (hash >>> 0).toString(16).padStart(8, "0").toUpperCase();
}

export default function HomePage() {
  const [routeState, setRouteState] = useState<RouteState>("IDLE");
  const [activeStage, setActiveStage] = useState(-1);
  const [authorityCorrected, setAuthorityCorrected] = useState(false);
  const [recordOpen, setRecordOpen] = useState(false);
  const [rid, setRid] = useState("");
  const [manifestHash, setManifestHash] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const stateLabel = useMemo(() => {
    if (routeState === "IDLE") return "READY";
    return routeState;
  }, [routeState]);

  useEffect(() => {
    if (routeState !== "RUNNING") return;

    if (activeStage >= chain.length - 1) {
      const timer = window.setTimeout(() => {
        if (authorityCorrected) {
          setRouteState("ALLOW");
          setRecordOpen(true);

          const newRid = makeRid();
          setRid(newRid);
          setManifestHash(
            makeHash(
              `${newRid}|vendor-payment|dual-authority|beneficiary-binding|allow`,
            ),
          );
        } else {
          setRouteState("HOLD");
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
    setRid("");
    setManifestHash("");
    setActiveStage(0);
    setRouteState("RUNNING");
  }

  function correctAndRerun() {
    setAuthorityCorrected(true);
    setRecordOpen(false);
    setRid("");
    setManifestHash("");
    setActiveStage(0);
    setRouteState("RUNNING");
  }

  function resetRoute() {
    setRouteState("IDLE");
    setActiveStage(-1);
    setAuthorityCorrected(false);
    setRecordOpen(false);
    setRid("");
    setManifestHash("");
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
          .ring,
          .air-sensor {
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


        .path-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
          margin-top: 30px;
        }

        .path-card {
          position: relative;
          min-height: 310px;
          padding: 30px;
          border-radius: 26px;
          border: 1px solid var(--line);
          background: linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.017));
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 18px 50px rgba(0,0,0,0.22);
        }

        .path-card::before {
          content: "";
          position: absolute;
          width: 180px;
          height: 180px;
          right: -70px;
          top: -75px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(84,232,255,0.18), transparent 70%);
          pointer-events: none;
        }

        .path-card.review::before { background: radial-gradient(circle, rgba(57,242,161,0.15), transparent 70%); }
        .path-card.partner::before { background: radial-gradient(circle, rgba(255,212,106,0.16), transparent 70%); }
        .path-card h3 { margin: 20px 0 10px; font-size: 28px; letter-spacing: -0.035em; }
        .path-card p { color: var(--muted); line-height: 1.7; margin: 0 0 24px; }
        .path-card .button { margin-top: auto; align-self: flex-start; }

        .object-strip {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 28px;
        }

        .object-chip {
          padding: 10px 13px;
          border-radius: 999px;
          border: 1px solid rgba(84,232,255,0.16);
          background: rgba(84,232,255,0.045);
          color: #bfd2e6;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.04em;
        }

        .constitutional-shell {
          border-radius: 30px;
          border: 1px solid rgba(84,232,255,0.2);
          background: linear-gradient(145deg, rgba(41,167,255,0.065), rgba(57,242,161,0.03));
          padding: 38px;
          box-shadow: var(--shadow-blue);
        }

        .constitutional-grid {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 28px;
          align-items: start;
        }

        .principle-stack {
          display: grid;
          gap: 12px;
        }

        .principle-row {
          padding: 16px 18px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.065);
          background: rgba(3,8,14,0.45);
          color: #b8c9da;
          line-height: 1.55;
        }

        .principle-row strong { color: white; }

        .built-spotlight {
          position: relative;
          overflow: hidden;
          border-radius: 32px;
          padding: 40px;
          border: 1px solid rgba(57,242,161,0.22);
          background:
            radial-gradient(circle at 82% 18%, rgba(57,242,161,0.12), transparent 32%),
            linear-gradient(145deg, rgba(8,18,29,0.94), rgba(4,9,16,0.86));
          box-shadow: var(--shadow-green);
        }

        .built-lanes {
          display: grid;
          grid-template-columns: 0.92fr 1.08fr;
          gap: 20px;
          margin-top: 30px;
        }

        .built-lane {
          position: relative;
          overflow: hidden;
          border-radius: 24px;
          padding: 26px;
          border: 1px solid rgba(255,255,255,0.075);
          background: rgba(255,255,255,0.026);
        }

        .built-lane.atmospheric {
          border-color: rgba(84,232,255,0.22);
          background:
            radial-gradient(circle at 72% 24%, rgba(84,232,255,0.1), transparent 34%),
            linear-gradient(145deg, rgba(41,167,255,0.065), rgba(3,8,14,0.42));
        }

        .built-lane h3 {
          margin: 10px 0 10px;
          font-size: clamp(25px, 3vw, 34px);
          letter-spacing: -0.035em;
        }

        .built-lane > p {
          margin: 0;
          color: var(--muted);
          line-height: 1.65;
        }

        .building-flow {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 22px;
        }

        .building-step {
          min-height: 104px;
          padding: 15px 12px;
          display: grid;
          place-items: center;
          text-align: center;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          color: #c2d1df;
          font-size: 12px;
          font-weight: 850;
          line-height: 1.45;
        }

        .building-step.hold { border-color: rgba(255,212,106,0.3); color: var(--gold); }
        .building-step.allow { border-color: rgba(57,242,161,0.3); color: var(--green); }


        .air-core {
          position: relative;
          min-height: 390px;
          margin-top: 22px;
          display: grid;
          place-items: center;
          border-radius: 22px;
          border: 1px solid rgba(84,232,255,0.13);
          background:
            linear-gradient(rgba(84,232,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(84,232,255,0.025) 1px, transparent 1px),
            radial-gradient(circle, rgba(41,167,255,0.08), transparent 62%);
          background-size: 28px 28px, 28px 28px, auto;
          overflow: hidden;
        }

        .air-core::before,
        .air-core::after {
          content: "";
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(84,232,255,0.15);
        }

        .air-core::before { width: 290px; height: 290px; }
        .air-core::after { width: 205px; height: 205px; border-color: rgba(57,242,161,0.13); }

        .air-record-orb {
          position: relative;
          z-index: 3;
          width: 126px;
          height: 126px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          text-align: center;
          font-weight: 950;
          letter-spacing: 0.06em;
          line-height: 1.15;
          color: white;
          background: radial-gradient(circle at 35% 28%, #fff 0 2%, var(--cyan) 4%, #0c507f 36%, #06121f 72%);
          box-shadow: 0 0 54px rgba(84,232,255,0.4), 0 0 94px rgba(57,242,161,0.12);
        }

        .air-sensor {
          position: absolute;
          z-index: 4;
          padding: 8px 10px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(3,8,14,0.88);
          color: #c9d9e8;
          font-size: 10px;
          font-weight: 850;
          white-space: nowrap;
          box-shadow: 0 8px 24px rgba(0,0,0,0.28);
          animation: airSensorFloat 6s ease-in-out infinite alternate;
        }

        .air-sensor:nth-of-type(2) { left: 6%; top: 10%; }
        .air-sensor:nth-of-type(3) { left: 38%; top: 4%; animation-delay: -1s; }
        .air-sensor:nth-of-type(4) { right: 5%; top: 13%; animation-delay: -2s; }
        .air-sensor:nth-of-type(5) { left: 2%; top: 38%; animation-delay: -3s; }
        .air-sensor:nth-of-type(6) { right: 2%; top: 38%; animation-delay: -4s; }
        .air-sensor:nth-of-type(7) { left: 5%; bottom: 20%; animation-delay: -5s; }
        .air-sensor:nth-of-type(8) { left: 35%; bottom: 8%; animation-delay: -1.8s; }
        .air-sensor:nth-of-type(9) { right: 5%; bottom: 20%; animation-delay: -2.8s; }
        .air-sensor:nth-of-type(10) { left: 18%; top: 25%; animation-delay: -3.8s; }
        .air-sensor:nth-of-type(11) { right: 18%; top: 25%; animation-delay: -4.8s; }
        .air-sensor:nth-of-type(12) { left: 17%; bottom: 38%; animation-delay: -0.8s; }
        .air-sensor:nth-of-type(13) { right: 17%; bottom: 38%; animation-delay: -2.4s; }
        .air-sensor:nth-of-type(14) { left: 42%; top: 22%; animation-delay: -3.4s; }

        @keyframes airSensorFloat {
          from { transform: translate3d(0, -3px, 0); }
          to { transform: translate3d(5px, 7px, 0); }
        }

        .air-record-footer {
          margin-top: 16px;
          padding: 14px 16px;
          border-radius: 15px;
          border: 1px solid rgba(57,242,161,0.13);
          background: rgba(57,242,161,0.035);
          color: #aec2d2;
          font-size: 13px;
          line-height: 1.6;
        }

        .boundary-note {
          margin-top: 24px;
          padding: 18px 20px;
          border-radius: 16px;
          border: 1px solid rgba(84,232,255,0.13);
          background: rgba(84,232,255,0.04);
          color: #aebfd0;
          line-height: 1.65;
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
        .state-display.hold { color: var(--gold); }
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
            display: ${mobileMenuOpen ? "grid" : "none"};
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
          .path-grid,
          .constitutional-grid,
          .built-lanes,
          .building-flow,
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
              <a href="#paths">Playgrounds</a>
              <a href="#architecture">Architecture</a>
              <a href="#records">Governed Records</a>
              <a href="#domains">Domains</a>
              <a href="#entity-review-center">Entity Reviews</a>
              <a href="#built-environment">Environmental Integrity</a>
              <a href="/sign-in">Sign In</a>
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
                Free AI Governance Playground and Workspace
              </div>

              <h1>
                Build governance.
                <br />
                Test it free.
                <br />
                <span className="gradient-text">Prove the consequence.</span>
              </h1>

              <p className="hero-copy">
                Enter the TA-14 AI Governance Exchange free—no credit card
                required. Explore four connected playgrounds for AI governance,
                governed records, environmental records, and full-chain entity
                review. Learn what TA-14 is, test consequential routes, expose
                broken links, preserve uncertainty, and see why execution was
                allowed, held, denied, or escalated.
              </p>

              <div className="hero-actions">
                <a className="button button-primary" href="/workspace">
                  Open the Free Workspace
                </a>
                <a className="button button-secondary" href="#paths">
                  Choose a Playground
                </a>
                <a className="button button-secondary" href="/sign-in">
                  Sign In
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
              <div className="core-orb">
                TA-14
                <br />
                CORE
              </div>
              <div className="core-caption">
                Full-chain admissible execution
              </div>
            </div>
          </section>

          <section
            className="container exchange-preview"
            aria-label="Living governance exchange preview"
          >
            <div className="exchange-dashboard">
              <div className="exchange-dashboard-head">
                <div>
                  <div className="eyebrow">The Exchange is active</div>
                  <h2
                    style={{
                      margin: "8px 0 0",
                      fontSize: "clamp(28px, 4vw, 44px)",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    Governance moving through the chain.
                  </h2>
                </div>
                <div className="live-indicator">
                  <span className="live-pulse" />
                  Living Exchange Preview
                </div>
              </div>

              <div className="exchange-dashboard-body">
                <div className="exchange-metrics">
                  <div className="metric-card">
                    <small>Build access</small>
                    <strong>Free and unlimited</strong>
                  </div>
                  <div className="metric-card">
                    <small>Decision lanes</small>
                    <strong>ALLOW · HOLD · DENY · ESCALATE</strong>
                  </div>
                  <div className="metric-card">
                    <small>Governance depth</small>
                    <strong>Eight linked stages</strong>
                  </div>
                  <div className="metric-card">
                    <small>Verification</small>
                    <strong>Independent replay surface</strong>
                  </div>
                </div>

                <div className="route-stream">
                  <div className="route-stream-label">
                    Consequential routes in motion
                  </div>
                  <div className="route-orbit" />
                  <div className="chain-live" />

                  <article className="floating-route one">
                    <div className="floating-route-top">
                      <span>Vendor Payment</span>
                      <span className="route-decision hold">HOLD</span>
                    </div>
                    <p>
                      Current authority evidence required before commitment.
                    </p>
                  </article>

                  <article className="floating-route two">
                    <div className="floating-route-top">
                      <span>Medical AI</span>
                      <span className="route-decision escalate">ESCALATE</span>
                    </div>
                    <p>
                      Human authority requested for consequence-bearing action.
                    </p>
                  </article>

                  <article className="floating-route three">
                    <div className="floating-route-top">
                      <span>Autonomous Agent</span>
                      <span className="route-decision deny">DENY</span>
                    </div>
                    <p>
                      Destination binding does not match the approved route.
                    </p>
                  </article>

                  <article className="floating-route four">
                    <div className="floating-route-top">
                      <span>Building Override</span>
                      <span className="route-decision allow">ALLOW</span>
                    </div>
                    <p>
                      Duration, release condition, command binding, and outcome
                      verified.
                    </p>
                  </article>
                </div>
              </div>

              <div className="preview-note">
                Visual exchange preview. Route decisions shown here are
                illustrative; production activity and preserved records remain
                governed by their actual route evidence and execution state.
              </div>
            </div>
          </section>

          <section id="paths" className="container section">
            <div className="section-heading">
              <div className="eyebrow">Four connected playgrounds</div>
              <h2>Choose where your work begins.</h2>
              <p>
                The public homepage explains the institution. The workspace is
                where you use it. Each playground is free to enter, requires no
                credit card, and applies the same TA-14 discipline to a
                different class of consequential evidence and execution.
              </p>
            </div>

            <div className="path-grid">
              <article className="path-card">
                <div className="card-icon">AI</div>
                <h3>AI Governance</h3>
                <p>
                  Build, test, correct, and verify consequential AI routes.
                  Govern identity, delegated authority, evidence, tools,
                  payloads, commitments, execution, and measured outcomes.
                </p>
                <a
                  className="button button-primary"
                  href="/workspace/ai-governance"
                >
                  Enter AI Governance
                </a>
              </article>

              <article className="path-card review">
                <div className="card-icon">GR</div>
                <h3>Governed Records</h3>
                <p>
                  Bring an existing record and receive a bounded interpretation
                  that preserves what the evidence proves, what it does not
                  prove, and which conclusions remain inadmissible.
                </p>
                <a
                  className="button button-secondary"
                  href="/workspace/governed-records"
                >
                  Enter Governed Records
                </a>
              </article>

              <article className="path-card">
                <div className="card-icon">ER</div>
                <h3>Environmental Records</h3>
                <p>
                  Interpret land, water, air, atmospheric, building, hospital,
                  laboratory, HVAC, sensor, and environmental evidence without
                  reducing reality to an unsupported score.
                </p>
                <a
                  className="button button-secondary"
                  href="/workspace/environmental-records"
                >
                  Enter Environmental Records
                </a>
              </article>

              <article className="path-card partner">
                <div className="card-icon">◎</div>
                <h3>Entity Review Center</h3>
                <p>
                  Submit an organization, governance program, AI system,
                  operational architecture, or consequential route for bounded
                  full-chain review and certification-status determination.
                </p>
                <a
                  className="button button-secondary"
                  href="/workspace/entity-reviews"
                >
                  Enter Entity Review Center
                </a>
              </article>
            </div>

            <div className="boundary-note">
              <strong>Public access principle:</strong> the four playgrounds are
              open for education, experimentation, and route development. A
              favorable result cannot be purchased. Pricing, preservation,
              professional operations, and enterprise review options appear only
              inside the relevant workspace after the user chooses a lane.
            </div>
          </section>

          <section id="architecture" className="container section">
            <div className="section-heading">
              <div className="eyebrow">The governing chain</div>
              <h2>Governance must remain visible from Reality to Outcome.</h2>
              <p>
                Policies, approvals, and models can be valuable while an
                execution route still breaks. TA-14 evaluates whether evidence,
                continuity, authority, binding, commitment, execution, and
                measured outcome remain admissible together.
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
                <h3>Build</h3>
                <p>
                  Model boundaries, actors, authority, evidence, dependencies,
                  rules, commit conditions, execution, and expected outcomes.
                </p>
              </article>
              <article className="card">
                <div className="card-icon">⚡</div>
                <h3>Challenge</h3>
                <p>
                  Inject missing evidence, stale authority, continuity breaks,
                  beneficiary mismatches, bypass attempts, and outcome failures.
                </p>
              </article>
              <article className="card">
                <div className="card-icon">✓</div>
                <h3>Verify</h3>
                <p>
                  Preserve route identity, decision history, correction,
                  receipts, execution correspondence, and replayable proof.
                </p>
              </article>
            </div>
          </section>

          <section id="platform" className="container section">
            <div className="section-heading">
              <div className="eyebrow">
                One exchange, complete operating surface
              </div>
              <h2>From governance idea to governed execution record.</h2>
              <p>
                The Exchange turns governance from a document into a testable,
                correctable, preservable, independently reviewable execution
                system.
              </p>
            </div>

            <div className="product-grid">
              <article className="card">
                <div className="card-icon">⌘</div>
                <h3>Route Construction</h3>
                <p>
                  Build bounded consequential routes and map the complete
                  Reality-to-Outcome chain.
                </p>
              </article>
              <article className="card">
                <div className="card-icon">↯</div>
                <h3>Runtime Testing</h3>
                <p>
                  Run routes, expose exact HOLD and DENY reasons, correct
                  defects, and rerun without hiding adverse results.
                </p>
              </article>
              <article className="card">
                <div className="card-icon">◎</div>
                <h3>Governed Records</h3>
                <p>
                  Create Admissible Execution Records, Atmospheric Integrity
                  Records, decision records, review packages, replay packages,
                  and verification records that preserve identity, evidence,
                  authority, execution, boundaries, and outcome.
                </p>
              </article>
              <article className="card">
                <div className="card-icon">◇</div>
                <h3>Independent Review</h3>
                <p>
                  Submit routes, systems, architectures, and enterprise
                  processes for bounded full-chain review.
                </p>
              </article>
              <article className="card">
                <div className="card-icon">#</div>
                <h3>Verification and Replay</h3>
                <p>
                  Verify signatures, hashes, dependencies, continuity, commit
                  integrity, and execution-to-outcome correspondence.
                </p>
              </article>
              <article className="card">
                <div className="card-icon">API</div>
                <h3>Integration Layer</h3>
                <p>
                  Connect governance systems, evidence sources, registries,
                  reviewers, policies, agents, and execution environments.
                </p>
              </article>
            </div>
          </section>

          <section id="constitutional-execution" className="container section">
            <div className="constitutional-shell">
              <div className="constitutional-grid">
                <div>
                  <div className="eyebrow">Constitutional execution</div>
                  <h2
                    style={{
                      margin: "12px 0 16px",
                      fontSize: "clamp(36px, 5vw, 58px)",
                      letterSpacing: "-0.045em",
                      lineHeight: 1.02,
                    }}
                  >
                    Governance should remain intact until outcome.
                  </h2>
                  <p
                    style={{
                      color: "var(--muted)",
                      fontSize: 18,
                      lineHeight: 1.72,
                    }}
                  >
                    TA-14 governs consequential execution—not merely the policy,
                    model, recommendation, or approval that preceded it.
                    Operational systems retain control while the Exchange
                    preserves and evaluates the route by which evidence becomes
                    action and action becomes outcome.
                  </p>

                  <div className="object-strip" aria-label="Execution objects">
                    {[
                      "Observation",
                      "Evidence",
                      "Identity",
                      "Authority",
                      "Rule",
                      "Dependency",
                      "Decision",
                      "Command",
                      "Execution",
                      "Outcome",
                      "Exception",
                      "Recovery",
                      "Verification",
                    ].map((item) => (
                      <span className="object-chip" key={item}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="principle-stack">
                  <div className="principle-row">
                    <strong>Evidence before consequence.</strong>
                    <br />
                    Required proof must be relevant, attributable, timely, and
                    bound to the route.
                  </div>
                  <div className="principle-row">
                    <strong>Authority must be explicit.</strong>
                    <br />
                    The right to recommend, approve, command, override, release,
                    or escalate must remain visible.
                  </div>
                  <div className="principle-row">
                    <strong>Boundaries stay declared.</strong>
                    <br />
                    Every record states what was evaluated, assumed, unknown,
                    private, and outside scope.
                  </div>
                  <div className="principle-row">
                    <strong>Uncertainty remains visible.</strong>
                    <br />A strong record preserves exactly what was proven and
                    leaves the unproven inspectable.
                  </div>
                </div>
              </div>
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
                  <li>
                    Decision, correction, commit, execution, and outcome history
                  </li>
                  <li>Independent verification and replay surface</li>
                  <li>Preserved HOLD, DENY, ALLOW, or ESCALATE result</li>
                </ul>
              </article>
            </div>
          </section>

          <section id="entity-review-center" className="container section">
            <div className="review-shell">
              <div className="section-heading">
                <div className="eyebrow">Entity Review Center</div>
                <h2>Others review slivers. TA-14 reviews the route.</h2>
                <p>
                  The Entity Review Center is the bounded review entrance for
                  organizations, AI systems, governance programs, operational
                  architectures, environmental systems, and other
                  consequence-bearing entities. It examines whether the full
                  Reality-to-Outcome chain remains visible, supported, and
                  admissible together.
                </p>
              </div>

              <div className="two-sided">
                <article className="lane-card">
                  <div className="eyebrow">What can be reviewed</div>
                  <h3>Bring the system that carries the consequence.</h3>
                  <p>
                    Review may begin with an AI agent, policy framework,
                    enterprise workflow, evidence architecture, payment route,
                    BAS sequence, environmental program, healthcare process, or
                    complete organizational governance system.
                  </p>
                  <ul className="check-list">
                    <li>Full-chain first-pass review</li>
                    <li>Broken-link and boundary identification</li>
                    <li>Authority, evidence, and binding analysis</li>
                    <li>Declared limitations and correction requirements</li>
                    <li>Preserved findings and retesting continuity</li>
                  </ul>
                  <a
                    className="button button-primary"
                    href="/workspace/entity-reviews"
                  >
                    Open the Entity Review Center
                  </a>
                </article>

                <article className="lane-card partner" id="partners">
                  <div className="eyebrow">TA-14 Partner Review Network</div>
                  <h3>Qualified specialists can review within declared boundaries.</h3>
                  <p>
                    Governance entities, evidence specialists, cybersecurity
                    teams, controls professionals, runtime systems, and domain
                    experts may apply for paid, bounded review work through the
                    TA-14 AI Governance Exchange.
                  </p>
                  <ul className="check-list">
                    <li>Defined reviewer scope and authority</li>
                    <li>Independent specialist review lanes</li>
                    <li>Preserved review boundaries</li>
                    <li>Second-layer TA-14 review</li>
                    <li>Strategic ecosystem participation</li>
                  </ul>
                  <a
                    className="button button-secondary"
                    href="mailto:ta14admissibleexecution@gmail.com?subject=TA-14%20Partner%20Review%20Network%20Application"
                  >
                    Apply to the Partner Review Network
                  </a>
                </article>
              </div>

              <div className="boundary-note">
                <strong>Certification is not a purchased outcome.</strong> Review
                pricing and engagement options are available inside the Entity
                Review Center, but payment never creates evidence, removes a
                finding, changes a threshold, or guarantees TA-14 Certified
                status.
              </div>
            </div>
          </section>

          <section id="demo" className="container section">
            <div className="section-heading">
              <div className="eyebrow">Live route demonstration</div>
              <h2>Watch a route fail, correct, and become admissible.</h2>
              <p>
                This demonstration submits a consequential vendor payment,
                exposes missing authority and beneficiary binding, preserves the
                HOLD, and reruns the corrected route to generate an admissible
                execution record.
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
                    <span>{authorityCorrected ? "Current" : "Missing"}</span>
                  </div>
                  <div className="route-field">
                    <span>Finance authority</span>
                    <span>{authorityCorrected ? "Current" : "Missing"}</span>
                  </div>
                  <div className="route-field">
                    <span>Beneficiary binding</span>
                    <span>{authorityCorrected ? "Bound" : "Unproven"}</span>
                  </div>
                </div>
              </article>

              <article className="decision-panel">
                <div className="decision-top">
                  <div className="eyebrow">TA-14 decision receipt</div>
                  <span className="route-badge">
                    {authorityCorrected ? "CORRECTED VERSION" : "VERSION 1"}
                  </span>
                </div>

                <div className={`state-display ${routeState.toLowerCase()}`}>
                  {stateLabel}
                </div>

                <div className="decision-copy">
                  {routeState === "IDLE" &&
                    "The route is ready for deterministic evaluation."}
                  {routeState === "RUNNING" &&
                    `Evaluating ${chain[Math.max(activeStage, 0)] ?? "route"}...`}
                  {routeState === "HOLD" &&
                    "Required proof is incomplete but correctable. Current dual authority and beneficiary binding are missing."}
                  {routeState === "ALLOW" &&
                    "All mandatory deterministic requirements are satisfied within the stated route scope."}
                </div>

                <div className="progress-track">
                  {chain.map((item, index) => {
                    const complete =
                      routeState === "ALLOW" ||
                      (routeState === "RUNNING" && index < activeStage);
                    const active =
                      routeState === "RUNNING" && index === activeStage;
                    const failed =
                      routeState === "HOLD" && index >= 3 && index <= 4;

                    return (
                      <div
                        aria-label={item}
                        className={[
                          "progress-step",
                          complete ? "complete" : "",
                          active ? "active" : "",
                          failed ? "failed" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        key={item}
                      />
                    );
                  })}
                </div>

                <div className="receipt">
                  {routeState === "IDLE" &&
                    `ROUTE: Vendor payment above USD 25,000
STATUS: TESTABLE
NEXT ACTION: RUN TA-14 ENGINE`}

                  {routeState === "RUNNING" &&
                    `ROUTE: Vendor payment above USD 25,000
TESTING: ${chain[Math.max(activeStage, 0)] ?? "Reality"}
STATE: EVALUATING
DECISION PRECEDENCE: ACTIVE`}

                  {routeState === "HOLD" &&
                    `RESULT: HOLD
TA-14-AUTH-PROC: CURRENT PROCUREMENT AUTHORITY MISSING
TA-14-AUTH-FIN: CURRENT FINANCE AUTHORITY MISSING
TA-14-BIND-BEN: BENEFICIARY NOT BOUND TO EXACT PAYMENT OBJECT
NEXT ACTION: CORRECT FREE AND RERUN`}

                  {routeState === "ALLOW" &&
                    `RESULT: ALLOW
TA-14-REQ-ALL: SATISFIED
AUTHORITY: CURRENT DUAL APPROVAL
BENEFICIARY: BOUND
COMMIT CORRESPONDENCE: SATISFIED
NEXT ACTION: GENERATE SELF-DECLARED AER`}
                </div>

                <div className="decision-actions">
                  {routeState === "IDLE" && (
                    <button
                      className="button button-primary"
                      type="button"
                      onClick={runRoute}
                    >
                      Run Route
                    </button>
                  )}
                  {routeState === "RUNNING" && (
                    <button
                      className="button button-secondary"
                      type="button"
                      disabled
                    >
                      Testing Route…
                    </button>
                  )}
                  {routeState === "HOLD" && (
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
                  {routeState === "ALLOW" && (
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

          <section id="domains" className="container section">
            <div className="section-heading">
              <div className="eyebrow">Applied governance domains</div>
              <h2>AI governance is the entrance—not the limit.</h2>
              <p>
                The TA-14 AI Governance Exchange begins with AI governance while
                supporting every domain where authority, evidence, execution,
                and outcome must remain reconstructable.
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

          <section id="built-environment" className="container section">
            <article className="built-spotlight">
              <div className="section-heading" style={{ marginBottom: 0 }}>
                <div className="eyebrow">Built environment spotlight</div>
                <h2>
                  Govern what the building does—and preserve what the atmosphere
                  actually was.
                </h2>
                <p>
                  BAS, analytics, digital twins, commissioning, TAB,
                  cybersecurity, sensors, equipment platforms, and operators
                  each hold part of the operational truth. TA-14 binds those
                  contributions into two connected surfaces: governed building
                  execution and Atmospheric Integrity Records.
                </p>
              </div>

              <div className="built-lanes">
                <section className="built-lane">
                  <div className="eyebrow">Governed building execution</div>
                  <h3>From command to verified restoration.</h3>
                  <p>
                    Preserve why an override, optimization, alarm response,
                    equipment restart, or operator intervention was permitted,
                    what actually executed, and whether normal operation was
                    restored.
                  </p>

                  <div
                    className="building-flow"
                    aria-label="Building override governance example"
                  >
                    <div className="building-step">
                      Room warming
                      <br />
                      condition observed
                    </div>
                    <div className="building-step">
                      Evidence and operator identity captured
                    </div>
                    <div className="building-step hold">
                      HOLD
                      <br />
                      duration and release missing
                    </div>
                    <div className="building-step">
                      Route corrected and command bound
                    </div>
                    <div className="building-step allow">
                      ALLOW
                      <br />
                      committed before action
                    </div>
                    <div className="building-step">
                      Automatic control restored and outcome verified
                    </div>
                  </div>
                </section>

                <section className="built-lane atmospheric">
                  <div className="eyebrow">Atmospheric Integrity Record</div>
                  <h3>
                    Thirteen atmospheric evidence channels. One governed record.
                  </h3>
                  <p>
                    An AIR preserves whether environmental reality supported the
                    intended activity, which instruments and thresholds were
                    relied upon, what intervention occurred, and whether the
                    atmosphere returned to a valid and persistent condition.
                  </p>

                  <div
                    className="air-core"
                    aria-label="Atmospheric Integrity Record evidence channels"
                  >
                    <div className="air-record-orb">
                      TA-14
                      <br />
                      AIR
                    </div>
                    <span className="air-sensor">Dry-bulb</span>
                    <span className="air-sensor">Wet-bulb</span>
                    <span className="air-sensor">Relative humidity</span>
                    <span className="air-sensor">Dew point</span>
                    <span className="air-sensor">Enthalpy</span>
                    <span className="air-sensor">Humidity ratio</span>
                    <span className="air-sensor">Specific volume</span>
                    <span className="air-sensor">Pressure</span>
                    <span className="air-sensor">VOCs</span>
                    <span className="air-sensor">Radon</span>
                    <span className="air-sensor">Sound dB</span>
                    <span className="air-sensor">Particulate matter</span>
                    <span className="air-sensor">CO₂</span>
                  </div>

                  <div className="air-record-footer">
                    <strong>Seven psychrometrics:</strong> dry-bulb, wet-bulb,
                    relative humidity, dew point, enthalpy, humidity ratio, and
                    specific volume—joined by pressure, VOCs, radon, sound
                    level, particulate matter, and CO₂. Additional bounded
                    atmospheric evidence can be attached when the route requires
                    it.
                  </div>
                </section>
              </div>

              <div className="boundary-note">
                <strong>Connected but distinct:</strong> the BAS explains what
                the building system sensed, commanded, and executed. The
                Atmospheric Integrity Record preserves whether the atmospheric
                reality was valid for the intended activity and whether the
                intervention produced a verified environmental outcome. TA-14
                does not replace the BAS, instruments, commissioning, TAB, or
                qualified professionals; it governs and preserves the
                inspectable route around consequence.
              </div>
            </article>
          </section>

          <section className="container section">
            <article className="manifesto">
              <div className="eyebrow">
                TA-14 Authority Governance Institution
              </div>
              <h2>No admissible evidence. No admissible execution.</h2>
              <p>
                The Exchange is where governance systems become testable,
                governed records become verifiable, qualified reviewers earn
                through bounded work, and organizations obtain full-chain
                scrutiny without conventional consulting overhead.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="/workspace">
                  Open the Free Workspace
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
                  <span>TA-14 AI GOVERNANCE EXCHANGE</span>
                </a>
                <p>
                  Build governance routes. Create governed records. Verify
                  consequential execution.
                </p>
              </div>

              <div>
                <h4>Exchange</h4>
                <div className="footer-links">
                  <a href="#architecture">Architecture</a>
                  <a href="#records">Governed Records</a>
                  <a href="#entity-review-center">Entity Review Center</a>
                  <a href="#partners">Partner Review Network</a>
                  <a href="/workspace">Open Workspace</a>
                  <a href="/sign-in">Sign In</a>
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
                Reality → Record → Continuity → Admissibility → Binding → Commit
                → Execution → Outcome
              </span>
              <span>No admissible evidence. No admissible execution.</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
