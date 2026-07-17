'use client';

import { useState } from 'react';
import Link from 'next/link';

const executionChain = [
  {
    number: '01',
    name: 'Reality',
    statement: 'What actually exists before anyone describes it.',
    detail:
      'The observable condition, event, object, environment, transaction, system state, or human circumstance that creates the factual basis for action.',
  },
  {
    number: '02',
    name: 'Record',
    statement: 'Reality must become evidence without losing its meaning.',
    detail:
      'Measurements, documents, video, sensor data, testimony, identity records, timestamps, system outputs, and other evidence are captured into a bounded record.',
  },
  {
    number: '03',
    name: 'Continuity',
    statement: 'The record must remain connected to its origin.',
    detail:
      'TA-14 examines provenance, custody, timestamps, version history, evidence freshness, alteration risk, and whether the record still represents the reality it claims to describe.',
  },
  {
    number: '04',
    name: 'Admissibility',
    statement: 'Evidence must be fit for the consequence being considered.',
    detail:
      'Completeness, relevance, authority, freshness, sufficiency, contradiction, unresolved uncertainty, and required thresholds are evaluated before execution proceeds.',
  },
  {
    number: '05',
    name: 'Binding',
    statement: 'The evidence must bind to the exact route.',
    detail:
      'The actor, authority, policy, payload, destination, beneficiary, tool, model, environment, and intended consequence are bound to one specific execution object.',
  },
  {
    number: '06',
    name: 'Commit',
    statement: 'The approved route must match the route prepared for execution.',
    detail:
      'TA-14 preserves the final execution manifest so that the authorized object cannot be silently replaced, expanded, redirected, or materially changed after approval.',
  },
  {
    number: '07',
    name: 'Execution',
    statement: 'Only the committed route may create consequence.',
    detail:
      'The execution event is evaluated against the admissible route, required receipts, state restrictions, bypass controls, timing requirements, and approved authority.',
  },
  {
    number: '08',
    name: 'Outcome',
    statement: 'The consequence must correspond to what was authorized.',
    detail:
      'TA-14 preserves the resulting state, compares intended and actual outcomes, records deviations, and maintains a reconstructable route after consequence occurs.',
  },
];

const gateLinks = [
  'Route identity',
  'Actor identity',
  'Organization identity',
  'Authority source',
  'Authority validity',
  'Policy applicability',
  'Evidence existence',
  'Evidence freshness',
  'Evidence provenance',
  'Evidence integrity',
  'Required completeness',
  'Contradiction review',
  'Scope boundary',
  'Object binding',
  'Beneficiary binding',
  'Destination binding',
  'Tool and model binding',
  'Environment binding',
  'Commit correspondence',
  'Temporal validity',
  'Required receipts',
  'Bypass resistance',
  'Execution correspondence',
  'Outcome correspondence',
];

const decisions = [
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
  const [expandedGate, setExpandedGate] = useState<number | null>(null);

  return (
    <>
      <style>{`
        :root {
          --background: #02050a;
          --background-soft: #07101a;
          --panel: rgba(9, 18, 30, 0.72);
          --panel-strong: rgba(7, 14, 24, 0.94);
          --line: rgba(129, 178, 230, 0.15);
          --line-bright: rgba(84, 232, 255, 0.34);
          --text: #f4f8ff;
          --muted: #91a5ba;
          --blue: #29a7ff;
          --cyan: #54e8ff;
          --green: #39f2a1;
          --red: #ff456b;
          --gold: #ffd46a;
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
            radial-gradient(circle at 50% 100%, rgba(255, 69, 107, 0.08), transparent 32%),
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
          min-height: 100vh;
          overflow: hidden;
          position: relative;
        }

        .architecture-page::before {
          content: "";
          position: fixed;
          inset: 0;
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
          width: min(1180px, 92vw);
          margin: 0 auto;
        }

        .navigation {
          position: sticky;
          top: 0;
          z-index: 100;
          border-bottom: 1px solid var(--line);
          background: rgba(3, 7, 13, 0.78);
          backdrop-filter: blur(20px);
        }

        .navigation-inner {
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
          color: white;
          text-decoration: none;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .brand-mark {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          color: var(--cyan);
          border: 1px solid rgba(84, 232, 255, 0.4);
          background:
            linear-gradient(145deg, rgba(41, 167, 255, 0.18), rgba(57, 242, 161, 0.07));
          box-shadow:
            0 0 26px rgba(84, 232, 255, 0.17),
            inset 0 0 18px rgba(255,255,255,0.05);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 23px;
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
        .secondary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border-radius: 14px;
          padding: 13px 20px;
          text-decoration: none;
          border: 0;
          cursor: pointer;
          font-weight: 850;
          transition:
            transform 180ms ease,
            box-shadow 180ms ease,
            border-color 180ms ease;
        }

        .nav-button:hover,
        .primary-button:hover,
        .secondary-button:hover {
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

        .secondary-button {
          color: white;
          border: 1px solid var(--line);
          background: rgba(255,255,255,0.04);
        }

        .hero {
          min-height: 82vh;
          padding: 100px 0 78px;
          display: grid;
          grid-template-columns: 1.08fr 0.92fr;
          align-items: center;
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
          margin: 17px 0 24px;
          max-width: 820px;
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
          max-width: 740px;
          color: #b1c1d3;
          font-size: 20px;
          line-height: 1.7;
        }

        .hero-actions {
          margin-top: 30px;
          display: flex;
          flex-wrap: wrap;
          gap: 13px;
        }

        .hero-visual {
          min-height: 520px;
          position: relative;
          display: grid;
          place-items: center;
          border-radius: 38px;
          overflow: hidden;
          border: 1px solid var(--line);
          background:
            radial-gradient(circle at center, rgba(41,167,255,0.14), transparent 35%),
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
          border-radius: 50%;
          border: 1px solid rgba(84,232,255,0.22);
          animation: orbitSpin 20s linear infinite;
        }

        .orbit-one {
          width: 390px;
          height: 390px;
        }

        .orbit-two {
          width: 305px;
          height: 305px;
          border-color: rgba(57,242,161,0.24);
          animation-direction: reverse;
          animation-duration: 14s;
        }

        .orbit-three {
          width: 420px;
          height: 150px;
          transform: rotate(28deg);
          border-color: rgba(255,69,107,0.18);
          animation: orbitPulse 4s ease-in-out infinite alternate;
        }

        .architecture-core {
          width: 185px;
          height: 185px;
          z-index: 4;
          position: relative;
          display: grid;
          place-items: center;
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
          border-radius: 999px;
          border: 1px solid var(--line);
          background: rgba(3,8,14,0.82);
          color: #a9bbcd;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .label-one {
          left: 10%;
          top: 23%;
        }

        .label-two {
          right: 8%;
          top: 29%;
        }

        .label-three {
          right: 15%;
          bottom: 22%;
        }

        .label-four {
          left: 12%;
          bottom: 18%;
        }

        @keyframes orbitSpin {
          to {
            transform: rotate(360deg);
          }
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
          padding: 94px 0;
        }

        .section-heading {
          max-width: 820px;
          margin-bottom: 36px;
        }

        .section-heading h2 {
          margin: 11px 0 15px;
          font-size: clamp(40px, 5.6vw, 66px);
          line-height: 1;
          letter-spacing: -0.048em;
        }

        .section-heading p {
          margin: 0;
          color: var(--muted);
          font-size: 18px;
          line-height: 1.72;
        }

        .chain-layout {
          display: grid;
          grid-template-columns: 0.72fr 1.28fr;
          gap: 20px;
        }

        .chain-navigation,
        .chain-detail {
          border-radius: 26px;
          border: 1px solid var(--line);
          background: var(--panel);
          backdrop-filter: blur(16px);
        }

        .chain-navigation {
          padding: 14px;
          display: grid;
          gap: 7px;
        }

        .chain-button {
          width: 100%;
          display: grid;
          grid-template-columns: 42px 1fr auto;
          align-items: center;
          gap: 12px;
          padding: 15px;
          color: var(--muted);
          text-align: left;
          border-radius: 15px;
          border: 1px solid transparent;
          background: transparent;
          cursor: pointer;
          transition:
            color 180ms ease,
            background 180ms ease,
            border-color 180ms ease,
            transform 180ms ease;
        }

        .chain-button:hover {
          color: white;
          background: rgba(255,255,255,0.03);
        }

        .chain-button.active {
          color: white;
          border-color: rgba(84,232,255,0.22);
          background:
            linear-gradient(90deg, rgba(41,167,255,0.1), rgba(57,242,161,0.035));
          transform: translateX(4px);
        }

        .chain-number {
          color: var(--cyan);
          font-family: monospace;
          font-size: 12px;
          font-weight: 900;
        }

        .chain-name {
          font-weight: 850;
          letter-spacing: 0.02em;
        }

        .chain-arrow {
          color: #5f758a;
        }

        .chain-detail {
          min-height: 510px;
          position: relative;
          overflow: hidden;
          padding: 42px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .chain-detail::after {
          content: attr(data-number);
          position: absolute;
          right: -10px;
          bottom: -60px;
          color: rgba(255,255,255,0.028);
          font-size: 260px;
          line-height: 1;
          font-weight: 950;
          letter-spacing: -0.09em;
        }

        .detail-number {
          color: var(--cyan);
          font-family: monospace;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.16em;
        }

        .chain-detail h3 {
          margin: 16px 0 14px;
          font-size: clamp(48px, 6vw, 78px);
          line-height: 0.95;
          letter-spacing: -0.05em;
        }

        .detail-statement {
          max-width: 650px;
          margin: 0 0 20px;
          color: white;
          font-size: 22px;
          line-height: 1.45;
        }

        .detail-copy {
          max-width: 700px;
          margin: 0;
          color: var(--muted);
          font-size: 17px;
          line-height: 1.75;
        }

        .gate-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .gate-card {
          min-height: 138px;
          position: relative;
          overflow: hidden;
          padding: 18px;
          text-align: left;
          color: white;
          border-radius: 18px;
          border: 1px solid var(--line);
          background: rgba(255,255,255,0.025);
          cursor: pointer;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease,
            box-shadow 180ms ease;
        }

        .gate-card:hover,
        .gate-card.expanded {
          transform: translateY(-4px);
          border-color: rgba(84,232,255,0.3);
          background: rgba(84,232,255,0.045);
          box-shadow: 0 18px 46px rgba(0,0,0,0.2);
        }

        .gate-index {
          color: var(--cyan);
          font-family: monospace;
          font-size: 11px;
          font-weight: 900;
        }

        .gate-title {
          margin-top: 19px;
          display: block;
          font-weight: 850;
          line-height: 1.35;
        }

        .gate-state {
          position: absolute;
          right: 14px;
          top: 14px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--green);
          box-shadow: 0 0 13px var(--green);
        }

        .gate-expanded-copy {
          margin-top: 11px;
          color: var(--muted);
          font-size: 12px;
          line-height: 1.55;
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
          width: 100%;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          color: white;
          text-align: left;
          border-radius: 18px;
          border: 1px solid var(--line);
          background: rgba(255,255,255,0.025);
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

        .decision-dot.green {
          background: var(--green);
          box-shadow: 0 0 18px var(--green);
        }

        .decision-dot.gold {
          background: var(--gold);
          box-shadow: 0 0 18px var(--gold);
        }

        .decision-dot.red {
          background: var(--red);
          box-shadow: 0 0 18px var(--red);
        }

        .decision-dot.blue {
          background: var(--blue);
          box-shadow: 0 0 18px var(--blue);
        }

        .decision-detail {
          min-height: 390px;
          padding: 42px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-radius: 26px;
          border: 1px solid var(--line);
          background:
            linear-gradient(145deg, rgba(255,255,255,0.045), rgba(255,255,255,0.012));
        }

        .decision-name {
          font-size: clamp(62px, 9vw, 116px);
          line-height: 0.9;
          font-weight: 950;
          letter-spacing: -0.05em;
        }

        .decision-name.green {
          color: var(--green);
          text-shadow: 0 0 40px rgba(57,242,161,0.26);
        }

        .decision-name.gold {
          color: var(--gold);
          text-shadow: 0 0 40px rgba(255,212,106,0.24);
        }

        .decision-name.red {
          color: var(--red);
          text-shadow: 0 0 40px rgba(255,69,107,0.28);
        }

        .decision-name.blue {
          color: var(--blue);
          text-shadow: 0 0 40px rgba(41,167,255,0.3);
        }

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
          padding: 28px;
          position: relative;
          overflow: hidden;
          border-radius: 22px;
          border: 1px solid var(--line);
          background:
            linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.014));
        }

        .record-code {
          display: inline-flex;
          padding: 7px 10px;
          border-radius: 999px;
          color: var(--cyan);
          border: 1px solid rgba(84,232,255,0.22);
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
          width: 120px;
          height: 120px;
          right: -50px;
          bottom: -50px;
          border-radius: 50%;
          background: var(--blue);
          filter: blur(60px);
          opacity: 0.12;
        }

        .principle {
          padding: 56px;
          position: relative;
          overflow: hidden;
          border-radius: 34px;
          border: 1px solid rgba(84,232,255,0.22);
          background:
            linear-gradient(
              135deg,
              rgba(41,167,255,0.09),
              rgba(57,242,161,0.055),
              rgba(255,69,107,0.045)
            );
        }

        .principle::after {
          content: "14";
          position: absolute;
          right: 20px;
          bottom: -88px;
          color: rgba(255,255,255,0.03);
          font-size: 320px;
          line-height: 1;
          font-weight: 950;
          letter-spacing: -0.1em;
        }

        .principle h2 {
          max-width: 920px;
          margin: 13px 0 21px;
          font-size: clamp(46px, 6.3vw, 82px);
          line-height: 0.98;
          letter-spacing: -0.056em;
        }

        .principle p {
          max-width: 850px;
          margin: 0;
          color: #b4c5d7;
          font-size: 19px;
          line-height: 1.75;
        }

        .boundary-grid {
          margin-top: 28px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .boundary {
          padding: 20px;
          border-radius: 17px;
          border: 1px solid rgba(255,255,255,0.06);
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
          justify-content: space-between;
          align-items: flex-start;
          gap: 28px;
          flex-wrap: wrap;
        }

        .footer p {
          max-width: 580px;
          color: var(--muted);
          line-height: 1.7;
        }

        .footer-links {
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
        }

        .footer-links a {
          color: var(--muted);
          text-decoration: none;
          font-size: 14px;
        }

        .footer-links a:hover {
          color: white;
        }

        @media (max-width: 980px) {
          .hero,
          .chain-layout,
          .decision-layout {
            grid-template-columns: 1fr;
          }

          .hero-visual {
            min-height: 430px;
          }

          .gate-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 760px) {
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
            min-height: 370px;
          }

          .orbit-one {
            width: 300px;
            height: 300px;
          }

          .orbit-two {
            width: 230px;
            height: 230px;
          }

          .architecture-core {
            width: 145px;
            height: 145px;
          }

          .gate-grid,
          .record-grid,
          .boundary-grid {
            grid-template-columns: 1fr;
          }

          .chain-detail,
          .decision-detail,
          .principle {
            padding: 29px;
          }

          .chain-detail {
            min-height: 430px;
          }

          .label-one,
          .label-two,
          .label-three,
          .label-four {
            display: none;
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

            <nav className="nav-links">
              <a href="#chain">The Chain</a>
              <a href="#gate">24-Link Gate</a>
              <a href="#decisions">Decisions</a>
              <a href="#records">Records</a>
              <Link className="nav-button" href="/#demo">
                Run a Route
              </Link>
            </nav>
          </div>
        </header>

        <main>
          <section className="container hero">
            <div>
              <div className="eyebrow">
                TA-14 Admissible Execution Architecture
              </div>

              <h1>
                Governance must survive
                <br />
                <span className="hero-gradient">contact with consequence.</span>
              </h1>

              <p className="hero-copy">
                TA-14 governs the entire execution route—not merely policy,
                approval, model behavior, or a dashboard. It preserves the
                connection from reality and evidence to authority, binding,
                execution, outcome, and independent replay.
              </p>

              <div className="hero-actions">
                <a className="primary-button" href="#chain">
                  Enter the Architecture
                </a>

                <Link className="secondary-button" href="/">
                  Return to Exchange
                </Link>
              </div>
            </div>

            <div className="hero-visual">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="orbit orbit-three" />

              <span className="core-label label-one">Evidence</span>
              <span className="core-label label-two">Authority</span>
              <span className="core-label label-three">Execution</span>
              <span className="core-label label-four">Outcome</span>

              <div className="architecture-core">
                TA-14
                <br />
                ROUTE
              </div>
            </div>
          </section>

          <section id="chain" className="container section">
            <div className="section-heading">
              <div className="eyebrow">The canonical governing chain</div>

              <h2>
                Reality must remain connected to consequence.
              </h2>

              <p>
                Select each stage to examine the continuity TA-14 requires
                before an execution can become admissible.
              </p>
            </div>

            <div className="chain-layout">
              <div className="chain-navigation">
                {executionChain.map((stage, index) => (
                  <button
                    className={`chain-button ${
                      activeChain === index ? 'active' : ''
                    }`}
                    key={stage.name}
                    type="button"
                    onClick={() => setActiveChain(index)}
                  >
                    <span className="chain-number">{stage.number}</span>
                    <span className="chain-name">{stage.name}</span>
                    <span className="chain-arrow">→</span>
                  </button>
                ))}
              </div>

              <article
                className="chain-detail"
                data-number={executionChain[activeChain].number}
              >
                <div className="detail-number">
                  STAGE {executionChain[activeChain].number}
                </div>

                <h3>{executionChain[activeChain].name}</h3>

                <p className="detail-statement">
                  {executionChain[activeChain].statement}
                </p>

                <p className="detail-copy">
                  {executionChain[activeChain].detail}
                </p>
              </article>
            </div>
          </section>

          <section id="gate" className="container section">
            <div className="section-heading">
              <div className="eyebrow">The 24-link runtime gate</div>

              <h2>
                One broken link can invalidate the route.
              </h2>

              <p>
                TA-14 evaluates the route as a connected execution object. The
                links below represent the minimum continuity questions that may
                govern a consequential action.
              </p>
            </div>

            <div className="gate-grid">
              {gateLinks.map((link, index) => {
                const expanded = expandedGate === index;

                return (
                  <button
                    className={`gate-card ${expanded ? 'expanded' : ''}`}
                    key={link}
                    type="button"
                    onClick={() =>
                      setExpandedGate(expanded ? null : index)
                    }
                  >
                    <span className="gate-state" />
                    <span className="gate-index">
                      LINK {String(index + 1).padStart(2, '0')}
                    </span>

                    <span className="gate-title">{link}</span>

                    {expanded && (
                      <span className="gate-expanded-copy">
                        This link must remain provable, current, bounded, and
                        connected to the exact route before consequence is
                        created.
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

              <h2>
                A decision must explain what happens next.
              </h2>

              <p>
                TA-14 does not hide uncertainty inside a generic pass or fail.
                Each state creates a specific operational consequence.
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
                    onClick={() => setActiveDecision(index)}
                  >
                    <strong>{decision.state}</strong>

                    <span
                      className={`decision-dot ${decision.color}`}
                    />
                  </button>
                ))}
              </div>

              <article className="decision-detail">
                <div
                  className={`decision-name ${
                    decisions[activeDecision].color
                  }`}
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

              <h2>
                A dashboard is not the record.
              </h2>

              <p>
                TA-14 creates durable artifacts that can be inspected after the
                interface, operator, vendor, model, or organization has changed.
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

              <h2>
                No admissible evidence. No admissible execution.
              </h2>

              <p>
                TA-14 does not promise that every consequence will be good. It
                establishes whether the route had legitimate evidence,
                authority, continuity, binding, and correspondence before the
                consequence was allowed to exist—and preserves what happened
                afterward.
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
                  <strong>Not a dashboard trust exercise</strong>
                  <span>
                    The preserved route, receipts, manifests, signatures, and
                    replay evidence govern the record.
                  </span>
                </div>

                <div className="boundary">
                  <strong>Not execution without accountability</strong>
                  <span>
                    Identity, authority, scope, evidence, destination, and
                    outcome must remain attributable.
                  </span>
                </div>
              </div>

              <div className="hero-actions">
                <Link className="primary-button" href="/#demo">
                  Test the Demonstration Route
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
            <div>
              <Link className="brand" href="/">
                <span className="brand-mark">14</span>
                <span>TA-14 AUTHORITY GOVERNANCE INSTITUTION</span>
              </Link>

              <p>
                Reality → Record → Continuity → Admissibility → Binding →
                Commit → Execution → Outcome
              </p>
            </div>

            <div className="footer-links">
              <Link href="/">Exchange</Link>
              <a href="#chain">Architecture</a>
              <a href="#gate">Runtime Gate</a>
              <a href="#records">Records</a>
              <a href="mailto:ta14admissibleexecution@gmail.com">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
