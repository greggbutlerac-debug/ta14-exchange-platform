"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

import {
  ACADEMY_LABS,
  getAcademyLab,
  type AcademyLabRepairOption,
} from "../../../../lib/academy-labs";
import AcademyLabTransferButton from "../academy-lab-transfer-button";

export default function AcademyLabDetailPage() {
  const params = useParams<{ labId: string }>();
  const labId = Array.isArray(params?.labId) ? params.labId[0] : params?.labId;
  const lab = useMemo(() => getAcademyLab(labId ?? ""), [labId]);

  const [selectedRepairId, setSelectedRepairId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!lab) {
    return (
      <main className="page">
        <section className="missing">
          <p className="eyebrow">TA-14 Academy Lab</p>
          <h1>Lab not found</h1>
          <p>
            The requested Academy Lab does not exist or is no longer available.
          </p>
          <Link className="primaryButton" href="/workspace/lab">
            Return to Academy Labs
          </Link>
        </section>

        <style jsx>{`
          .page {
            min-height: 100vh;
            display: grid;
            place-items: center;
            padding: 24px;
            background: #071019;
            color: #f5f9ff;
            font-family:
              Inter,
              ui-sans-serif,
              system-ui,
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              sans-serif;
          }

          .missing {
            width: min(680px, 100%);
            padding: 36px;
            border: 1px solid rgba(129, 176, 220, 0.18);
            border-radius: 24px;
            background: rgba(9, 20, 32, 0.92);
          }

          .eyebrow {
            color: #53e8ff;
            font-size: 12px;
            font-weight: 900;
            letter-spacing: 0.14em;
            text-transform: uppercase;
          }

          h1 {
            margin: 10px 0 12px;
            font-size: 44px;
          }

          p {
            color: #a6b8ca;
            line-height: 1.7;
          }

          .primaryButton {
            display: inline-flex;
            margin-top: 14px;
            padding: 13px 18px;
            border-radius: 12px;
            background: linear-gradient(90deg, #53e8ff, #39f2a1);
            color: #06110d;
            font-weight: 900;
            text-decoration: none;
          }
        `}</style>
      </main>
    );
  }

  const selectedRepair = lab.repairOptions.find(
    (option) => option.id === selectedRepairId,
  );

  const passedStages = lab.route.filter((stage) => stage.status === "PASS").length;
  const failedStages = lab.route.filter((stage) => stage.status === "FAIL").length;
  const unresolvedStages = lab.route.filter(
    (stage) => stage.status === "UNRESOLVED",
  ).length;

  function chooseRepair(option: AcademyLabRepairOption) {
    setSelectedRepairId(option.id);
    setSubmitted(false);
  }

  function submitRepair() {
    if (!selectedRepairId) {
      return;
    }

    setSubmitted(true);
  }

  return (
    <main className="page">
      <header className="topbar">
        <div className="topbarInner">
          <Link className="brand" href="/workspace/lab">
            <span className="brandMark">14</span>
            <span>TA-14 ACADEMY LABS</span>
          </Link>

          <nav className="nav">
            <Link href="/workspace">Workspace</Link>
            <Link href="/workspace/lab">All Labs</Link>
            <Link href="/workspace/build">Route Builder</Link>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="heroCopy">
          <div className="metaRow">
            <span>LAB {lab.number}</span>
            <span>{lab.difficulty}</span>
            <span>{lab.estimatedMinutes} MINUTES</span>
          </div>

          <p className="eyebrow">Consequence-bearing governance exercise</p>
          <h1>{lab.title}</h1>
          <p className="summary">{lab.summary}</p>

          <div className="focusRow">
            {lab.focus.map((stage) => (
              <span key={stage}>{stage}</span>
            ))}
          </div>
        </div>

        <aside className={`classification ${lab.classification.toLowerCase()}`}>
          <span>Expected classification</span>
          <strong>{lab.classification}</strong>
          <p>{lab.completionMessage}</p>
        </aside>
      </section>

      <section className="principle">
        <span>Governing principle</span>
        <strong>No admissible evidence. No admissible execution.</strong>
      </section>

      <section className="workspaceGrid">
        <div className="mainColumn">
          <article className="panel">
            <p className="eyebrow">Scenario</p>
            <h2>Review the governing reality</h2>
            <p className="bodyCopy">{lab.scenario}</p>

            <div className="questionCard">
              <span>Governing question</span>
              <strong>{lab.governingQuestion}</strong>
            </div>
          </article>

          <article className="panel">
            <div className="sectionHeader">
              <div>
                <p className="eyebrow">Route inspection</p>
                <h2>Reality → Outcome</h2>
              </div>

              <div className="routeCounts">
                <span className="pass">{passedStages} pass</span>
                <span className="fail">{failedStages} fail</span>
                <span className="unresolved">{unresolvedStages} unresolved</span>
              </div>
            </div>

            <div className="routeList">
              {lab.route.map((stage, index) => (
                <article className="stageCard" key={stage.stage}>
                  <div className="stageNumber">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="stageContent">
                    <div className="stageTopline">
                      <h3>{stage.stage}</h3>
                      <span className={`status ${stage.status.toLowerCase()}`}>
                        {stage.status}
                      </span>
                    </div>

                    <p>{stage.evidence}</p>

                    <div className="stageQuestion">
                      <span>Ask</span>
                      <strong>{stage.question}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <article className="panel">
            <p className="eyebrow">Repair decision</p>
            <h2>Select the defensible response</h2>
            <p className="bodyCopy">
              Choose the action that preserves the route, the evidence, and the
              legitimacy of any later consequence.
            </p>

            <div className="repairList">
              {lab.repairOptions.map((option) => {
                const selected = selectedRepairId === option.id;

                return (
                  <button
                    className={`repairOption ${selected ? "selected" : ""}`}
                    key={option.id}
                    onClick={() => chooseRepair(option)}
                    type="button"
                  >
                    <span className="radio" aria-hidden="true">
                      {selected ? "●" : "○"}
                    </span>

                    <span>
                      <strong>{option.label}</strong>
                      <small>{option.description}</small>
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              className="primaryButton"
              disabled={!selectedRepairId}
              onClick={submitRepair}
              type="button"
            >
              Evaluate selected repair
            </button>

            {submitted && selectedRepair ? (
              <div
                className={`resultCard ${
                  selectedRepair.correct ? "correct" : "incorrect"
                }`}
              >
                <span>
                  {selectedRepair.correct
                    ? "Defensible repair"
                    : "Repair rejected"}
                </span>
                <strong>{selectedRepair.label}</strong>
                <p>{selectedRepair.explanation}</p>
              </div>
            ) : null}
          </article>
        </div>

        <aside className="sideColumn">
          <article className="sidePanel">
            <p className="eyebrow">Lab objective</p>
            <h3>{lab.objective}</h3>
          </article>

          <article className="sidePanel">
            <p className="eyebrow">Transfer to live construction</p>
            <h3>Continue this route in the Route Builder</h3>
            <p>
              Transfer the complete Academy Lab route into the live builder,
              preserve the scenario, and continue the route toward evaluation.
            </p>

            <AcademyLabTransferButton lab={lab} />
          </article>

          <article className="sidePanel">
            <p className="eyebrow">Other Academy Labs</p>

            <div className="otherLabs">
              {ACADEMY_LABS.filter((item) => item.id !== lab.id).map((item) => (
                <Link href={`/workspace/lab/${item.id}`} key={item.id}>
                  <span>LAB {item.number}</span>
                  <strong>{item.title}</strong>
                </Link>
              ))}
            </div>
          </article>
        </aside>
      </section>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(body) {
          margin: 0;
          background:
            radial-gradient(
              circle at 12% 5%,
              rgba(41, 167, 255, 0.12),
              transparent 28%
            ),
            radial-gradient(
              circle at 88% 18%,
              rgba(57, 242, 161, 0.08),
              transparent 24%
            ),
            #040a11;
        }

        .page {
          min-height: 100vh;
          color: #f5f9ff;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .topbar {
          position: sticky;
          top: 0;
          z-index: 40;
          border-bottom: 1px solid rgba(127, 170, 212, 0.14);
          background: rgba(4, 10, 17, 0.82);
          backdrop-filter: blur(18px);
        }

        .topbarInner {
          width: min(1440px, 92vw);
          min-height: 72px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 11px;
          color: #f5f9ff;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-decoration: none;
        }

        .brandMark {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(83, 232, 255, 0.32);
          border-radius: 13px;
          background: rgba(83, 232, 255, 0.08);
          color: #53e8ff;
        }

        .nav {
          display: flex;
          gap: 22px;
        }

        .nav a {
          color: #9db0c2;
          font-size: 13px;
          font-weight: 750;
          text-decoration: none;
        }

        .hero,
        .principle,
        .workspaceGrid {
          width: min(1440px, 92vw);
          margin-inline: auto;
        }

        .hero {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 330px;
          gap: 28px;
          align-items: end;
          padding: 70px 0 28px;
        }

        .metaRow,
        .focusRow,
        .routeCounts {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .metaRow span,
        .focusRow span,
        .routeCounts span {
          padding: 7px 10px;
          border: 1px solid rgba(127, 170, 212, 0.14);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.035);
          color: #a8bbcd;
          font-size: 11px;
          font-weight: 850;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .eyebrow {
          margin: 0 0 9px;
          color: #53e8ff;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        h1,
        h2,
        h3,
        p {
          margin-top: 0;
        }

        h1 {
          margin: 14px 0 14px;
          font-size: clamp(48px, 7vw, 88px);
          line-height: 0.95;
          letter-spacing: -0.055em;
        }

        .summary {
          max-width: 860px;
          margin-bottom: 22px;
          color: #afc0d1;
          font-size: 18px;
          line-height: 1.7;
        }

        .classification {
          padding: 24px;
          border: 1px solid rgba(127, 170, 212, 0.16);
          border-radius: 22px;
          background: rgba(9, 18, 29, 0.78);
        }

        .classification > span {
          display: block;
          color: #8195a8;
          font-size: 11px;
          font-weight: 850;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .classification > strong {
          display: block;
          margin: 10px 0;
          font-size: 44px;
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .classification p {
          margin-bottom: 0;
          color: #9fb1c3;
          font-size: 13px;
          line-height: 1.6;
        }

        .classification.allow > strong {
          color: #39f2a1;
        }

        .classification.hold > strong {
          color: #ffd46a;
        }

        .classification.deny > strong {
          color: #ff5d76;
        }

        .classification.escalate > strong {
          color: #53e8ff;
        }

        .principle {
          padding: 17px 20px;
          border: 1px solid rgba(83, 232, 255, 0.2);
          border-radius: 16px;
          background: rgba(83, 232, 255, 0.055);
        }

        .principle span {
          display: block;
          margin-bottom: 5px;
          color: #7f95a8;
          font-size: 10px;
          font-weight: 850;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .workspaceGrid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 340px;
          gap: 20px;
          padding: 20px 0 70px;
        }

        .mainColumn,
        .sideColumn {
          display: grid;
          align-content: start;
          gap: 20px;
        }

        .sideColumn {
          position: sticky;
          top: 92px;
        }

        .panel,
        .sidePanel {
          border: 1px solid rgba(127, 170, 212, 0.14);
          border-radius: 22px;
          background: rgba(9, 18, 29, 0.82);
          box-shadow: 0 22px 70px rgba(0, 0, 0, 0.18);
        }

        .panel {
          padding: 28px;
        }

        .sidePanel {
          padding: 22px;
        }

        .panel h2 {
          margin-bottom: 13px;
          font-size: 30px;
          letter-spacing: -0.035em;
        }

        .sidePanel h3 {
          margin-bottom: 12px;
          font-size: 20px;
          line-height: 1.35;
        }

        .bodyCopy,
        .sidePanel p {
          color: #9fb1c3;
          line-height: 1.7;
        }

        .questionCard {
          margin-top: 22px;
          padding: 18px;
          border-left: 3px solid #53e8ff;
          border-radius: 0 14px 14px 0;
          background: rgba(83, 232, 255, 0.055);
        }

        .questionCard span,
        .stageQuestion span {
          display: block;
          margin-bottom: 6px;
          color: #7f95a8;
          font-size: 10px;
          font-weight: 850;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .questionCard strong {
          font-size: 17px;
          line-height: 1.55;
        }

        .sectionHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 18px;
        }

        .sectionHeader h2 {
          margin-bottom: 0;
        }

        .routeCounts .pass {
          color: #39f2a1;
        }

        .routeCounts .fail {
          color: #ff6b82;
        }

        .routeCounts .unresolved {
          color: #ffd46a;
        }

        .routeList {
          display: grid;
          gap: 10px;
        }

        .stageCard {
          display: grid;
          grid-template-columns: 54px minmax(0, 1fr);
          gap: 14px;
          padding: 17px;
          border: 1px solid rgba(127, 170, 212, 0.11);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.025);
        }

        .stageNumber {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(83, 232, 255, 0.18);
          border-radius: 12px;
          color: #53e8ff;
          font-size: 12px;
          font-weight: 900;
        }

        .stageTopline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }

        .stageTopline h3 {
          margin-bottom: 6px;
          font-size: 19px;
        }

        .status {
          padding: 6px 8px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .status.pass {
          background: rgba(57, 242, 161, 0.1);
          color: #39f2a1;
        }

        .status.fail {
          background: rgba(255, 93, 118, 0.1);
          color: #ff6b82;
        }

        .status.unresolved {
          background: rgba(255, 212, 106, 0.1);
          color: #ffd46a;
        }

        .stageContent > p {
          margin-bottom: 12px;
          color: #a8b9ca;
          line-height: 1.6;
        }

        .stageQuestion {
          padding-top: 12px;
          border-top: 1px solid rgba(127, 170, 212, 0.09);
        }

        .stageQuestion strong {
          color: #d8e4ef;
          font-size: 13px;
          line-height: 1.55;
        }

        .repairList {
          display: grid;
          gap: 11px;
          margin: 20px 0;
        }

        .repairOption {
          width: 100%;
          display: grid;
          grid-template-columns: 24px minmax(0, 1fr);
          gap: 12px;
          padding: 17px;
          border: 1px solid rgba(127, 170, 212, 0.13);
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.025);
          color: inherit;
          text-align: left;
          cursor: pointer;
        }

        .repairOption.selected {
          border-color: rgba(83, 232, 255, 0.5);
          background: rgba(83, 232, 255, 0.07);
        }

        .radio {
          color: #53e8ff;
          font-size: 18px;
        }

        .repairOption strong,
        .repairOption small {
          display: block;
        }

        .repairOption strong {
          margin-bottom: 6px;
          font-size: 15px;
        }

        .repairOption small {
          color: #95a9bb;
          font-size: 13px;
          line-height: 1.55;
        }

        .primaryButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 13px 18px;
          border: 0;
          border-radius: 12px;
          background: linear-gradient(90deg, #53e8ff, #39f2a1);
          color: #04110d;
          font-weight: 900;
          text-decoration: none;
          cursor: pointer;
        }

        .primaryButton:disabled {
          cursor: not-allowed;
          opacity: 0.4;
        }

        .resultCard {
          margin-top: 18px;
          padding: 18px;
          border-radius: 15px;
        }

        .resultCard.correct {
          border: 1px solid rgba(57, 242, 161, 0.28);
          background: rgba(57, 242, 161, 0.075);
        }

        .resultCard.incorrect {
          border: 1px solid rgba(255, 93, 118, 0.28);
          background: rgba(255, 93, 118, 0.075);
        }

        .resultCard span,
        .resultCard strong {
          display: block;
        }

        .resultCard span {
          margin-bottom: 6px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .resultCard strong {
          margin-bottom: 7px;
        }

        .resultCard p {
          margin-bottom: 0;
          color: #b3c2d1;
          line-height: 1.6;
        }

        .otherLabs {
          display: grid;
          gap: 8px;
        }

        .otherLabs a {
          display: block;
          padding: 12px;
          border: 1px solid rgba(127, 170, 212, 0.11);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.025);
          color: #eef5fb;
          text-decoration: none;
        }

        .otherLabs span,
        .otherLabs strong {
          display: block;
        }

        .otherLabs span {
          margin-bottom: 4px;
          color: #53e8ff;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .otherLabs strong {
          font-size: 13px;
        }

        @media (max-width: 1000px) {
          .hero,
          .workspaceGrid {
            grid-template-columns: 1fr;
          }

          .sideColumn {
            position: static;
          }
        }

        @media (max-width: 720px) {
          .topbarInner,
          .sectionHeader {
            align-items: flex-start;
            flex-direction: column;
          }

          .topbarInner {
            padding: 14px 0;
          }

          .nav {
            width: 100%;
            justify-content: space-between;
            gap: 10px;
          }

          .hero {
            padding-top: 44px;
          }

          h1 {
            font-size: 48px;
          }

          .panel {
            padding: 20px;
          }

          .stageCard {
            grid-template-columns: 1fr;
          }

          .stageTopline {
            align-items: flex-start;
          }
        }
      `}</style>
    </main>
  );
}
