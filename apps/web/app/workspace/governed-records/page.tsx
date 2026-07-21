"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type RecordType =
  | "Atmospheric Integrity Record"
  | "Building Environmental Record"
  | "Hospital Environmental Record"
  | "Laboratory Report"
  | "HVAC Diagnostic Record"
  | "Operational Record";

type ReviewState = "UNREVIEWED" | "RECORD" | "HOLD" | "ADMISSIBLE";

type EvidenceItem = {
  label: string;
  present: boolean;
  detail: string;
};

const RECORD_TYPES: RecordType[] = [
  "Atmospheric Integrity Record",
  "Building Environmental Record",
  "Hospital Environmental Record",
  "Laboratory Report",
  "HVAC Diagnostic Record",
  "Operational Record",
];

const NAVIGATION = [
  { label: "Playground", href: "/workspace/governed-records", active: true },
  {
    label: "Upload a Record",
    href: "/workspace/governed-records/upload",
    active: false,
  },
  {
    label: "Paste a Record",
    href: "/workspace/governed-records/paste",
    active: false,
  },
  {
    label: "Record Interpreter",
    href: "/workspace/governed-records/interpreter",
    active: false,
  },
  {
    label: "My Records",
    href: "/workspace/governed-records/my-records",
    active: false,
  },
  {
    label: "Continuity Review",
    href: "/workspace/governed-records/continuity",
    active: false,
  },
  {
    label: "Record Comparison",
    href: "/workspace/governed-records/compare",
    active: false,
  },
  {
    label: "Preserved Records",
    href: "/workspace/governed-records/preserved",
    active: false,
  },
  {
    label: "Verification",
    href: "/workspace/governed-records/verification",
    active: false,
  },
  {
    label: "Pricing",
    href: "/workspace/governed-records/pricing",
    active: false,
  },
] as const;

const SAMPLE_RECORD = `Record ID: AIR-2026-07-20-001
Source: Building environmental sensor package
Declared period: 2026-07-19 00:00–23:59 ET
Location: Critical indoor environment
Measurements: temperature, relative humidity, dew point, CO₂, PM2.5, VOC
Continuity: 23h 47m captured
Calibration record: not attached
Authority: facility operator declared
Requested conclusion: "The building was safe for all occupants."`;

const INITIAL_EVIDENCE: EvidenceItem[] = [
  {
    label: "Original record preserved",
    present: true,
    detail: "The submitted record remains unchanged and reviewable.",
  },
  {
    label: "Source identified",
    present: true,
    detail: "The originating sensor package and facility are declared.",
  },
  {
    label: "Time boundary declared",
    present: true,
    detail: "The requested interpretation is limited to a defined period.",
  },
  {
    label: "Continuity complete",
    present: false,
    detail: "Thirteen minutes are missing from the declared 24-hour period.",
  },
  {
    label: "Calibration provenance",
    present: false,
    detail: "No calibration record is attached to the submitted evidence.",
  },
  {
    label: "Requested conclusion supported",
    present: false,
    detail:
      "The record cannot prove universal occupant safety from the submitted measurements alone.",
  },
];

const STAR_POSITIONS = [
  [6, 12, 2],
  [14, 28, 1],
  [22, 9, 2],
  [31, 21, 1],
  [41, 7, 1],
  [52, 18, 2],
  [63, 11, 1],
  [74, 25, 2],
  [84, 8, 1],
  [93, 19, 2],
  [9, 56, 1],
  [18, 73, 2],
  [29, 47, 1],
  [39, 67, 2],
  [48, 43, 1],
  [58, 77, 1],
  [69, 52, 2],
  [78, 69, 1],
  [89, 48, 2],
  [96, 82, 1],
] as const;

export default function GovernedRecordsPlaygroundPage() {
  const [recordType, setRecordType] = useState<RecordType>(
    "Atmospheric Integrity Record",
  );
  const [recordText, setRecordText] = useState(SAMPLE_RECORD);
  const [reviewState, setReviewState] =
    useState<ReviewState>("UNREVIEWED");
  const [evidence, setEvidence] =
    useState<EvidenceItem[]>(INITIAL_EVIDENCE);
  const [showInterpretation, setShowInterpretation] = useState(false);

  const presentCount = useMemo(
    () => evidence.filter((item) => item.present).length,
    [evidence],
  );

  const completeness = Math.round((presentCount / evidence.length) * 100);

  function loadSample() {
    setRecordType("Atmospheric Integrity Record");
    setRecordText(SAMPLE_RECORD);
    setEvidence(INITIAL_EVIDENCE);
    setReviewState("UNREVIEWED");
    setShowInterpretation(false);
  }

  function clearRecord() {
    setRecordText("");
    setEvidence(
      INITIAL_EVIDENCE.map((item) => ({
        ...item,
        present: false,
      })),
    );
    setReviewState("UNREVIEWED");
    setShowInterpretation(false);
  }

  function reviewRecord() {
    if (!recordText.trim()) {
      setReviewState("UNREVIEWED");
      return;
    }

    setReviewState("HOLD");
    setShowInterpretation(true);
  }

  return (
    <>
      <style>{`
        :root {
          --gr-bg: #02080a;
          --gr-panel: rgba(5, 20, 22, 0.83);
          --gr-panel-strong: rgba(4, 15, 18, 0.94);
          --gr-border: rgba(118, 237, 201, 0.14);
          --gr-border-strong: rgba(118, 237, 201, 0.3);
          --gr-text: #f4fbf9;
          --gr-muted: #8ca8a2;
          --gr-teal: #72f0bd;
          --gr-cyan: #66e4ff;
          --gr-violet: #b69dff;
          --gr-gold: #ffd27a;
          --gr-red: #ff9696;
        }

        .gr-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: var(--gr-text);
          background:
            radial-gradient(circle at 12% 10%, rgba(102, 228, 255, 0.12), transparent 27%),
            radial-gradient(circle at 85% 13%, rgba(114, 240, 189, 0.12), transparent 29%),
            radial-gradient(circle at 56% 78%, rgba(182, 157, 255, 0.09), transparent 30%),
            linear-gradient(180deg, #02090b 0%, #031214 48%, #020709 100%);
        }

        .gr-page *,
        .gr-page *::before,
        .gr-page *::after {
          box-sizing: border-box;
        }

        .gr-cosmos {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .gr-grid {
          position: absolute;
          inset: -20%;
          opacity: 0.16;
          background-image:
            linear-gradient(rgba(102, 228, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(102, 228, 255, 0.05) 1px, transparent 1px);
          background-size: 72px 72px;
          transform: perspective(900px) rotateX(62deg) translateY(24%);
          transform-origin: center bottom;
          animation: gridDrift 18s linear infinite;
          mask-image: linear-gradient(to top, black, transparent 86%);
        }

        .gr-nebula {
          position: absolute;
          border-radius: 999px;
          filter: blur(90px);
          opacity: 0.16;
          animation: nebulaPulse 8s ease-in-out infinite;
        }

        .gr-nebula.one {
          top: 5%;
          left: 8%;
          width: 360px;
          height: 360px;
          background: var(--gr-cyan);
        }

        .gr-nebula.two {
          top: 28%;
          right: -100px;
          width: 430px;
          height: 430px;
          background: var(--gr-violet);
          animation-delay: -3s;
        }

        .gr-nebula.three {
          bottom: -120px;
          left: 34%;
          width: 480px;
          height: 360px;
          background: var(--gr-teal);
          animation-delay: -5s;
        }

        .gr-star {
          position: absolute;
          width: var(--size);
          height: var(--size);
          border-radius: 50%;
          background: white;
          box-shadow:
            0 0 6px white,
            0 0 16px rgba(102, 228, 255, 0.8);
          animation: twinkle var(--speed) ease-in-out infinite;
          animation-delay: var(--delay);
        }

        .gr-shooting-star {
          position: absolute;
          top: var(--top);
          left: -18%;
          width: 150px;
          height: 2px;
          border-radius: 999px;
          opacity: 0;
          background: linear-gradient(90deg, transparent, white, var(--gr-cyan));
          filter: drop-shadow(0 0 8px rgba(102, 228, 255, 0.9));
          transform: rotate(-18deg);
          animation: shootingStar var(--duration) linear infinite;
          animation-delay: var(--delay);
        }

        .gr-orbit-system {
          position: absolute;
          top: 7%;
          right: 4%;
          width: 420px;
          height: 420px;
          opacity: 0.54;
          animation: floatSystem 9s ease-in-out infinite;
        }

        .gr-orbit {
          position: absolute;
          inset: var(--inset);
          border: 1px solid rgba(114, 240, 189, 0.18);
          border-radius: 50%;
          animation: orbitSpin var(--duration) linear infinite;
        }

        .gr-orbit::after {
          content: "";
          position: absolute;
          top: 50%;
          left: -5px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--node-color);
          box-shadow: 0 0 18px var(--node-color);
        }

        .gr-orbit-core {
          position: absolute;
          inset: 44%;
          border-radius: 50%;
          background: white;
          box-shadow:
            0 0 20px white,
            0 0 60px var(--gr-cyan),
            0 0 110px rgba(182, 157, 255, 0.55);
          animation: coreBurst 3.4s ease-in-out infinite;
        }

        .gr-burst {
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          box-shadow:
            0 0 12px white,
            0 0 30px var(--gr-cyan);
          animation: burst 5.8s ease-out infinite;
          animation-delay: var(--delay);
        }

        .gr-burst::before,
        .gr-burst::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 90px;
          height: 1px;
          background: linear-gradient(90deg, transparent, white, transparent);
          transform: translate(-50%, -50%) rotate(var(--rotation));
          opacity: 0.8;
        }

        .gr-burst::after {
          transform: translate(-50%, -50%) rotate(calc(var(--rotation) + 90deg));
        }

        .gr-path {
          position: absolute;
          width: 460px;
          height: 240px;
          border: 1px solid transparent;
          border-top-color: rgba(102, 228, 255, 0.2);
          border-radius: 50%;
          filter: drop-shadow(0 0 10px rgba(102, 228, 255, 0.2));
          animation: pathPulse 4s ease-in-out infinite;
        }

        .gr-shell {
          position: relative;
          z-index: 1;
          width: min(1500px, calc(100% - 28px));
          margin: 0 auto;
          padding: 18px 0 48px;
        }

        .gr-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          min-height: 64px;
          padding: 0 8px;
          border-bottom: 1px solid rgba(118, 237, 201, 0.1);
        }

        .gr-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          color: inherit;
          text-decoration: none;
        }

        .gr-mark {
          display: grid;
          width: 44px;
          height: 44px;
          place-items: center;
          border: 1px solid rgba(114, 240, 189, 0.28);
          border-radius: 14px;
          color: var(--gr-teal);
          background: rgba(114, 240, 189, 0.07);
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.08em;
          box-shadow: inset 0 0 22px rgba(114, 240, 189, 0.04);
        }

        .gr-brand strong,
        .gr-brand small {
          display: block;
        }

        .gr-brand strong {
          font-size: 12px;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .gr-brand small {
          margin-top: 3px;
          color: #718d87;
          font-size: 10px;
        }

        .gr-top-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .gr-top-link {
          color: #a0b5b1;
          font-size: 12px;
          font-weight: 800;
          text-decoration: none;
        }

        .gr-layout {
          display: grid;
          grid-template-columns: 250px minmax(0, 1fr);
          gap: 18px;
          margin-top: 18px;
        }

        .gr-sidebar {
          align-self: start;
          position: sticky;
          top: 18px;
          padding: 18px;
          border: 1px solid var(--gr-border);
          border-radius: 24px;
          background: rgba(4, 17, 19, 0.82);
          backdrop-filter: blur(22px);
          box-shadow: 0 24px 70px rgba(0,0,0,0.28);
        }

        .gr-sidebar-title {
          margin-bottom: 14px;
          color: var(--gr-teal);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .gr-nav {
          display: grid;
          gap: 7px;
        }

        .gr-nav-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 42px;
          padding: 0 12px;
          border: 1px solid transparent;
          border-radius: 12px;
          color: #91a7a2;
          text-decoration: none;
          font-size: 12px;
          font-weight: 800;
          transition:
            color 160ms ease,
            background 160ms ease,
            border-color 160ms ease,
            transform 160ms ease;
        }

        .gr-nav-link:hover {
          color: white;
          border-color: rgba(114, 240, 189, 0.15);
          background: rgba(114, 240, 189, 0.05);
          transform: translateX(3px);
        }

        .gr-nav-link.active {
          color: #03110d;
          border-color: transparent;
          background: linear-gradient(135deg, var(--gr-teal), var(--gr-cyan));
        }

        .gr-nav-link span:last-child {
          opacity: 0.7;
        }

        .gr-sidebar-rule {
          height: 1px;
          margin: 18px 0;
          background: linear-gradient(90deg, rgba(114,240,189,0.35), transparent);
        }

        .gr-sidebar-card {
          padding: 14px;
          border: 1px solid rgba(182, 157, 255, 0.18);
          border-radius: 15px;
          background: rgba(182, 157, 255, 0.05);
        }

        .gr-sidebar-card strong {
          display: block;
          color: #e8e2ff;
          font-size: 12px;
        }

        .gr-sidebar-card p {
          margin: 8px 0 0;
          color: #8f89aa;
          font-size: 11px;
          line-height: 1.6;
        }

        .gr-main {
          min-width: 0;
        }

        .gr-hero {
          position: relative;
          overflow: hidden;
          padding: clamp(28px, 5vw, 58px);
          border: 1px solid var(--gr-border);
          border-radius: 28px;
          background:
            linear-gradient(135deg, rgba(7, 31, 30, 0.9), rgba(4, 14, 18, 0.93));
          backdrop-filter: blur(22px);
          box-shadow: 0 30px 90px rgba(0,0,0,0.3);
        }

        .gr-hero::after {
          content: "";
          position: absolute;
          top: -80px;
          right: -50px;
          width: 280px;
          height: 280px;
          border: 1px solid rgba(102, 228, 255, 0.14);
          border-radius: 50%;
          box-shadow:
            0 0 0 34px rgba(114, 240, 189, 0.025),
            0 0 0 74px rgba(182, 157, 255, 0.018);
          animation: orbitSpin 20s linear infinite;
        }

        .gr-kicker {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 8px 12px;
          border: 1px solid rgba(114, 240, 189, 0.22);
          border-radius: 999px;
          color: #c8ffe9;
          background: rgba(114, 240, 189, 0.055);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .gr-kicker::before {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--gr-teal);
          box-shadow: 0 0 14px var(--gr-teal);
        }

        .gr-hero h1 {
          position: relative;
          z-index: 1;
          max-width: 960px;
          margin: 21px 0 18px;
          font-size: clamp(3rem, 6.8vw, 7rem);
          line-height: 0.92;
          letter-spacing: -0.068em;
        }

        .gr-hero h1 span {
          display: block;
          color: transparent;
          background: linear-gradient(90deg, white, var(--gr-teal), var(--gr-cyan));
          background-clip: text;
          -webkit-background-clip: text;
        }

        .gr-hero-copy {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0;
          color: #9eb3ae;
          font-size: 16px;
          line-height: 1.78;
        }

        .gr-principles {
          position: relative;
          z-index: 1;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 25px;
        }

        .gr-principle {
          padding: 9px 12px;
          border: 1px solid rgba(118, 237, 201, 0.13);
          border-radius: 999px;
          color: #b9cbc7;
          background: rgba(255,255,255,0.025);
          font-size: 11px;
          font-weight: 750;
        }

        .gr-workspace {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
          gap: 18px;
          margin-top: 18px;
        }

        .gr-panel {
          border: 1px solid var(--gr-border);
          border-radius: 24px;
          background: var(--gr-panel);
          backdrop-filter: blur(22px);
          box-shadow: 0 24px 70px rgba(0,0,0,0.24);
        }

        .gr-panel-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          padding: 22px 22px 0;
        }

        .gr-eyebrow {
          margin: 0 0 8px;
          color: var(--gr-teal);
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .gr-panel h2 {
          margin: 0;
          font-size: 1.65rem;
          letter-spacing: -0.04em;
        }

        .gr-panel-sub {
          margin: 9px 0 0;
          color: var(--gr-muted);
          font-size: 12px;
          line-height: 1.62;
        }

        .gr-status {
          flex: 0 0 auto;
          padding: 7px 10px;
          border: 1px solid var(--gr-border);
          border-radius: 999px;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.1em;
        }

        .gr-status.unreviewed {
          color: #b2c4c0;
          background: rgba(255,255,255,0.035);
        }

        .gr-status.hold {
          color: #ffe6ab;
          background: rgba(255,210,122,0.07);
        }

        .gr-record-form {
          padding: 20px 22px 22px;
        }

        .gr-label {
          display: block;
          margin-bottom: 7px;
          color: #a9bcb7;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .gr-select,
        .gr-textarea {
          width: 100%;
          border: 1px solid rgba(118, 237, 201, 0.14);
          border-radius: 13px;
          color: #eaf7f3;
          background: rgba(2, 10, 12, 0.76);
          outline: none;
        }

        .gr-select {
          height: 48px;
          padding: 0 13px;
        }

        .gr-textarea {
          min-height: 310px;
          margin-top: 14px;
          padding: 16px;
          resize: vertical;
          font: 12px/1.7 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }

        .gr-select:focus,
        .gr-textarea:focus {
          border-color: rgba(102, 228, 255, 0.42);
          box-shadow: 0 0 0 3px rgba(102, 228, 255, 0.06);
        }

        .gr-form-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 14px;
        }

        .gr-button {
          display: inline-flex;
          min-height: 44px;
          align-items: center;
          justify-content: center;
          padding: 0 16px;
          border: 1px solid var(--gr-border);
          border-radius: 12px;
          color: white;
          background: rgba(255,255,255,0.04);
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
          transition:
            transform 160ms ease,
            background 160ms ease;
        }

        .gr-button:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,0.07);
        }

        .gr-button.primary {
          color: #03110d;
          border-color: transparent;
          background: linear-gradient(135deg, var(--gr-teal), var(--gr-cyan));
        }

        .gr-score {
          display: grid;
          grid-template-columns: 96px 1fr;
          gap: 18px;
          align-items: center;
          padding: 22px;
        }

        .gr-score-ring {
          display: grid;
          width: 96px;
          height: 96px;
          place-items: center;
          border-radius: 50%;
          background:
            radial-gradient(circle at center, #061416 53%, transparent 55%),
            conic-gradient(var(--gr-teal) ${completeness}%, rgba(255,255,255,0.07) 0);
          box-shadow: 0 0 38px rgba(114,240,189,0.08);
        }

        .gr-score-ring strong {
          font-size: 20px;
        }

        .gr-score-copy strong {
          display: block;
          font-size: 13px;
        }

        .gr-score-copy span {
          display: block;
          margin-top: 7px;
          color: var(--gr-muted);
          font-size: 11px;
          line-height: 1.55;
        }

        .gr-evidence-list {
          display: grid;
          gap: 9px;
          padding: 0 22px 22px;
        }

        .gr-evidence-item {
          display: grid;
          grid-template-columns: 34px 1fr;
          gap: 11px;
          align-items: start;
          padding: 12px;
          border: 1px solid rgba(118, 237, 201, 0.11);
          border-radius: 13px;
          background: rgba(255,255,255,0.02);
        }

        .gr-evidence-icon {
          display: grid;
          width: 34px;
          height: 34px;
          place-items: center;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 950;
        }

        .gr-evidence-item.present .gr-evidence-icon {
          color: #03110d;
          background: var(--gr-teal);
        }

        .gr-evidence-item.missing .gr-evidence-icon {
          color: #ffe7ad;
          background: rgba(255,210,122,0.09);
          border: 1px solid rgba(255,210,122,0.2);
        }

        .gr-evidence-item strong {
          display: block;
          font-size: 11px;
        }

        .gr-evidence-item p {
          margin: 5px 0 0;
          color: #829b95;
          font-size: 10px;
          line-height: 1.55;
        }

        .gr-interpretation {
          margin-top: 18px;
          padding: 24px;
          border: 1px solid rgba(255, 210, 122, 0.2);
          border-radius: 24px;
          background:
            linear-gradient(135deg, rgba(42, 31, 13, 0.58), rgba(5, 18, 19, 0.88));
          backdrop-filter: blur(22px);
        }

        .gr-interpretation-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0,1fr));
          gap: 12px;
          margin-top: 18px;
        }

        .gr-interpretation-card {
          padding: 16px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 15px;
          background: rgba(255,255,255,0.025);
        }

        .gr-interpretation-card span {
          display: block;
          color: var(--gr-gold);
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .gr-interpretation-card strong {
          display: block;
          margin-top: 9px;
          font-size: 13px;
          line-height: 1.5;
        }

        .gr-interpretation-card p {
          margin: 8px 0 0;
          color: #9d988a;
          font-size: 11px;
          line-height: 1.62;
        }

        .gr-footer-note {
          margin-top: 18px;
          padding: 17px 20px;
          border: 1px solid rgba(182,157,255,0.14);
          border-radius: 18px;
          color: #a79fc4;
          background: rgba(182,157,255,0.045);
          font-size: 11px;
          font-weight: 750;
          line-height: 1.65;
          text-align: center;
        }

        @keyframes gridDrift {
          from { transform: perspective(900px) rotateX(62deg) translateY(24%) translateX(0); }
          to { transform: perspective(900px) rotateX(62deg) translateY(24%) translateX(72px); }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.25; transform: scale(0.7); }
          50% { opacity: 1; transform: scale(1.35); }
        }

        @keyframes shootingStar {
          0%, 8% { opacity: 0; transform: translateX(0) translateY(0) rotate(-18deg); }
          10% { opacity: 1; }
          38% { opacity: 0; transform: translateX(135vw) translateY(38vh) rotate(-18deg); }
          100% { opacity: 0; transform: translateX(135vw) translateY(38vh) rotate(-18deg); }
        }

        @keyframes orbitSpin {
          to { transform: rotate(360deg); }
        }

        @keyframes floatSystem {
          0%, 100% { transform: translateY(0) rotate(-4deg); }
          50% { transform: translateY(18px) rotate(4deg); }
        }

        @keyframes coreBurst {
          0%, 100% { transform: scale(0.82); opacity: 0.72; }
          50% { transform: scale(1.22); opacity: 1; }
        }

        @keyframes burst {
          0%, 72% { transform: scale(0.2) rotate(0deg); opacity: 0; }
          78% { opacity: 1; }
          100% { transform: scale(2.6) rotate(80deg); opacity: 0; }
        }

        @keyframes nebulaPulse {
          0%, 100% { transform: scale(0.92); opacity: 0.11; }
          50% { transform: scale(1.08); opacity: 0.2; }
        }

        @keyframes pathPulse {
          0%, 100% { opacity: 0.2; transform: rotate(-9deg) scale(0.96); }
          50% { opacity: 0.58; transform: rotate(-4deg) scale(1.04); }
        }

        @media (max-width: 1080px) {
          .gr-layout {
            grid-template-columns: 1fr;
          }

          .gr-sidebar {
            position: relative;
            top: auto;
          }

          .gr-nav {
            grid-template-columns: repeat(2, minmax(0,1fr));
          }

          .gr-workspace {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .gr-shell {
            width: min(100% - 18px, 1500px);
          }

          .gr-topbar {
            align-items: flex-start;
            flex-direction: column;
            padding-bottom: 14px;
          }

          .gr-top-actions {
            width: 100%;
            justify-content: space-between;
          }

          .gr-nav {
            grid-template-columns: 1fr;
          }

          .gr-hero {
            padding: 28px 22px;
            border-radius: 22px;
          }

          .gr-hero h1 {
            font-size: clamp(3.2rem, 15vw, 5rem);
          }

          .gr-panel-head {
            align-items: stretch;
            flex-direction: column;
          }

          .gr-status {
            align-self: flex-start;
          }

          .gr-score {
            grid-template-columns: 1fr;
          }

          .gr-interpretation-grid {
            grid-template-columns: 1fr;
          }

          .gr-button {
            width: 100%;
          }

          .gr-orbit-system {
            right: -180px;
            opacity: 0.28;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .gr-page *,
          .gr-page *::before,
          .gr-page *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      <div className="gr-page">
        <div className="gr-cosmos" aria-hidden="true">
          <div className="gr-grid" />
          <div className="gr-nebula one" />
          <div className="gr-nebula two" />
          <div className="gr-nebula three" />

          {STAR_POSITIONS.map(([left, top, size], index) => (
            <span
              className="gr-star"
              key={`${left}-${top}`}
              style={
                {
                  left: `${left}%`,
                  top: `${top}%`,
                  "--size": `${size + 1}px`,
                  "--speed": `${2.2 + (index % 5) * 0.7}s`,
                  "--delay": `${-(index % 7) * 0.6}s`,
                } as React.CSSProperties
              }
            />
          ))}

          <span
            className="gr-shooting-star"
            style={
              {
                "--top": "12%",
                "--duration": "9s",
                "--delay": "-2s",
              } as React.CSSProperties
            }
          />
          <span
            className="gr-shooting-star"
            style={
              {
                "--top": "38%",
                "--duration": "12s",
                "--delay": "-7s",
              } as React.CSSProperties
            }
          />
          <span
            className="gr-shooting-star"
            style={
              {
                "--top": "67%",
                "--duration": "15s",
                "--delay": "-11s",
              } as React.CSSProperties
            }
          />

          <div className="gr-orbit-system">
            <div
              className="gr-orbit"
              style={
                {
                  "--inset": "4%",
                  "--duration": "22s",
                  "--node-color": "var(--gr-cyan)",
                } as React.CSSProperties
              }
            />
            <div
              className="gr-orbit"
              style={
                {
                  "--inset": "18%",
                  "--duration": "14s",
                  "--node-color": "var(--gr-teal)",
                } as React.CSSProperties
              }
            />
            <div
              className="gr-orbit"
              style={
                {
                  "--inset": "31%",
                  "--duration": "9s",
                  "--node-color": "var(--gr-violet)",
                } as React.CSSProperties
              }
            />
            <div className="gr-orbit-core" />
          </div>

          <span
            className="gr-burst"
            style={
              {
                top: "24%",
                left: "18%",
                "--delay": "-1s",
                "--rotation": "22deg",
              } as React.CSSProperties
            }
          />
          <span
            className="gr-burst"
            style={
              {
                top: "72%",
                left: "81%",
                "--delay": "-4s",
                "--rotation": "54deg",
              } as React.CSSProperties
            }
          />
          <span
            className="gr-burst"
            style={
              {
                top: "49%",
                left: "61%",
                "--delay": "-7s",
                "--rotation": "10deg",
              } as React.CSSProperties
            }
          />

          <div
            className="gr-path"
            style={{ top: "46%", left: "-7%" }}
          />
          <div
            className="gr-path"
            style={{
              bottom: "2%",
              right: "-7%",
              transform: "rotate(160deg)",
            }}
          />
        </div>

        <main className="gr-shell">
          <header className="gr-topbar">
            <Link className="gr-brand" href="/">
              <span className="gr-mark">TA-14</span>
              <span>
                <strong>TA-14 AI Governance Exchange</strong>
                <small>Governed Records Playground</small>
              </span>
            </Link>

            <div className="gr-top-actions">
              <Link className="gr-top-link" href="/workspace">
                Return to Exchange
              </Link>
              <Link className="gr-top-link" href="/">
                Public Homepage
              </Link>
            </div>
          </header>

          <div className="gr-layout">
            <aside className="gr-sidebar">
              <div className="gr-sidebar-title">Governed Records</div>

              <nav className="gr-nav">
                {NAVIGATION.map((item) => (
                  <Link
                    className={`gr-nav-link ${item.active ? "active" : ""}`}
                    href={item.href}
                    key={item.label}
                  >
                    <span>{item.label}</span>
                    <span>→</span>
                  </Link>
                ))}
              </nav>

              <div className="gr-sidebar-rule" />

              <div className="gr-sidebar-card">
                <strong>Record before interpretation.</strong>
                <p>
                  The original evidence remains separate from every finding,
                  limitation, correction, and generated report.
                </p>
              </div>
            </aside>

            <section className="gr-main">
              <section className="gr-hero">
                <div className="gr-kicker">Governed Records Playground</div>
                <h1>
                  Bring the record.
                  <span>Test what it can actually prove.</span>
                </h1>
                <p className="gr-hero-copy">
                  Explore how TA-14 separates the original record from
                  interpretation, diagnosis, optimization, and execution.
                  Preserve supported facts, expose missing continuity, and
                  generate a bounded interpretation without manufacturing
                  certainty.
                </p>

                <div className="gr-principles">
                  <span className="gr-principle">Original record preserved</span>
                  <span className="gr-principle">Evidence boundary declared</span>
                  <span className="gr-principle">Continuity tested</span>
                  <span className="gr-principle">Unsupported claims refused</span>
                  <span className="gr-principle">Interpretation replayable</span>
                </div>
              </section>

              <section className="gr-workspace">
                <article className="gr-panel">
                  <div className="gr-panel-head">
                    <div>
                      <p className="gr-eyebrow">Playground input</p>
                      <h2>Bring a record into review.</h2>
                      <p className="gr-panel-sub">
                        Paste evidence, select its class, and run a bounded
                        review. This demonstration does not modify the original
                        record.
                      </p>
                    </div>

                    <span
                      className={`gr-status ${reviewState.toLowerCase()}`}
                    >
                      {reviewState}
                    </span>
                  </div>

                  <div className="gr-record-form">
                    <label className="gr-label" htmlFor="record-type">
                      Record type
                    </label>
                    <select
                      className="gr-select"
                      id="record-type"
                      value={recordType}
                      onChange={(event) =>
                        setRecordType(event.target.value as RecordType)
                      }
                    >
                      {RECORD_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>

                    <textarea
                      aria-label="Record contents"
                      className="gr-textarea"
                      value={recordText}
                      onChange={(event) => {
                        setRecordText(event.target.value);
                        setReviewState("UNREVIEWED");
                        setShowInterpretation(false);
                      }}
                      placeholder="Paste a record, report, sensor package, diagnostic record, or other consequential evidence here."
                    />

                    <div className="gr-form-actions">
                      <button
                        className="gr-button primary"
                        type="button"
                        onClick={reviewRecord}
                      >
                        Review This Record
                      </button>
                      <button
                        className="gr-button"
                        type="button"
                        onClick={loadSample}
                      >
                        Load Sample
                      </button>
                      <button
                        className="gr-button"
                        type="button"
                        onClick={clearRecord}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </article>

                <aside className="gr-panel">
                  <div className="gr-panel-head">
                    <div>
                      <p className="gr-eyebrow">Evidence boundary</p>
                      <h2>What is present?</h2>
                      <p className="gr-panel-sub">
                        The score reflects submitted support—not truth,
                        diagnosis, optimization, or safety.
                      </p>
                    </div>
                  </div>

                  <div className="gr-score">
                    <div className="gr-score-ring">
                      <strong>{completeness}%</strong>
                    </div>
                    <div className="gr-score-copy">
                      <strong>{presentCount} of {evidence.length} checks supported</strong>
                      <span>
                        Missing evidence remains missing. The playground does
                        not infer support merely because a conclusion was
                        requested.
                      </span>
                    </div>
                  </div>

                  <div className="gr-evidence-list">
                    {evidence.map((item) => (
                      <div
                        className={`gr-evidence-item ${
                          item.present ? "present" : "missing"
                        }`}
                        key={item.label}
                      >
                        <span className="gr-evidence-icon">
                          {item.present ? "✓" : "!"}
                        </span>
                        <div>
                          <strong>{item.label}</strong>
                          <p>{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </aside>
              </section>

              {showInterpretation ? (
                <section className="gr-interpretation">
                  <p className="gr-eyebrow">Generated bounded interpretation</p>
                  <h2>HOLD — the requested conclusion exceeds the record.</h2>

                  <div className="gr-interpretation-grid">
                    <article className="gr-interpretation-card">
                      <span>What the record supports</span>
                      <strong>
                        A defined set of environmental measurements was captured
                        during most of the declared period.
                      </strong>
                      <p>
                        The submitted record supports review of the measurements
                        that are actually present.
                      </p>
                    </article>

                    <article className="gr-interpretation-card">
                      <span>What it does not support</span>
                      <strong>
                        Universal safety for every occupant cannot be
                        established.
                      </strong>
                      <p>
                        The record lacks complete continuity, calibration
                        provenance, individual exposure data, and a declared
                        safety authority.
                      </p>
                    </article>

                    <article className="gr-interpretation-card">
                      <span>What must happen next</span>
                      <strong>
                        Attach provenance, resolve the missing interval, and
                        narrow the requested conclusion.
                      </strong>
                      <p>
                        A new interpretation may be generated after the evidence
                        changes. The original HOLD remains preserved.
                      </p>
                    </article>
                  </div>
                </section>
              ) : null}

              <div className="gr-footer-note">
                TA-14 governing discipline: the record is not the diagnosis, the
                diagnosis is not the optimization, and none of them becomes
                execution without a separately admissible route.
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
