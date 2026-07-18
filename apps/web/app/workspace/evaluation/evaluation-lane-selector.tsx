"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  EVALUATION_LANES,
  stageEvaluationLane,
  type EvaluationLaneId,
} from "../../../lib/evaluation-lanes";

type EvaluationLaneSelectorProps = {
  routeLibraryId?: string;
  routeName?: string;
  freeEvaluationHref?: string;
  verifiedTestHref?: string;
};

export default function EvaluationLaneSelector({
  routeLibraryId,
  routeName,
  freeEvaluationHref = "/workspace/evaluation",
  verifiedTestHref = "/workspace/evaluation/verified",
}: EvaluationLaneSelectorProps) {
  const router = useRouter();
  const [selectedLane, setSelectedLane] =
    useState<EvaluationLaneId>("FREE_SIMULATION");
  const [error, setError] = useState<string | null>(null);

  function continueToLane() {
    setError(null);

    try {
      stageEvaluationLane({
        laneId: selectedLane,
        ...(routeLibraryId ? { routeLibraryId } : {}),
        ...(routeName ? { routeName } : {}),
      });

      router.push(
        selectedLane === "VERIFIED_TEST"
          ? verifiedTestHref
          : freeEvaluationHref,
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The evaluation lane could not be opened.",
      );
    }
  }

  return (
    <section className="laneSelector">
      <div className="heading">
        <div>
          <p className="eyebrow">Choose an evaluation lane</p>
          <h2>How should this route be tested?</h2>
          <p>
            Both lanes use the same route and admissibility logic.
            The difference is whether the result remains a workspace
            simulation or enters the paid preserved-verification
            process.
          </p>
        </div>

        <div className="routeIdentity">
          <span>Route under review</span>
          <strong>{routeName || "Current route"}</strong>
        </div>
      </div>

      <div className="laneGrid">
        {EVALUATION_LANES.map((lane) => {
          const selected = selectedLane === lane.id;

          return (
            <button
              key={lane.id}
              type="button"
              className="laneCard"
              data-selected={selected}
              onClick={() => setSelectedLane(lane.id)}
              aria-pressed={selected}
            >
              <div className="cardTop">
                <div>
                  <span className="badge">{lane.badge}</span>
                  <h3>{lane.name}</h3>
                </div>

                <strong className="price">
                  {lane.priceLabel}
                </strong>
              </div>

              <p className="summary">{lane.summary}</p>

              <ul>
                {lane.features.map((feature) => (
                  <li key={feature}>
                    <span aria-hidden="true">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <div
                className="recordStatus"
                data-authoritative={
                  lane.producesAuthoritativeRecord
                }
              >
                {lane.producesAuthoritativeRecord
                  ? "Preserved verification pathway"
                  : "Workspace simulation only"}
              </div>

              <p className="boundary">{lane.boundary}</p>

              <span className="selectionMark">
                {selected ? "Selected" : "Select lane"}
              </span>
            </button>
          );
        })}
      </div>

      <div className="continueRow">
        <div>
          <strong>
            {selectedLane === "VERIFIED_TEST"
              ? "Verified route test selected"
              : "Free evaluation selected"}
          </strong>
          <p>
            {selectedLane === "VERIFIED_TEST"
              ? "The next screen will prepare the paid verification lane. No charge occurs from this selection alone."
              : "The next screen will run the route as a non-authoritative workspace evaluation."}
          </p>
        </div>

        <button
          type="button"
          className="continueButton"
          onClick={continueToLane}
        >
          Continue to evaluation →
        </button>
      </div>

      {error ? (
        <div className="errorNotice">{error}</div>
      ) : null}

      <style jsx>{`
        .laneSelector {
          padding: 28px;
          border: 1px solid #dce4df;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.97);
          box-shadow: 0 24px 70px rgba(20, 47, 36, 0.07);
        }

        .heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
        }

        .eyebrow {
          margin: 0 0 9px;
          color: #0f7c5c;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        h2,
        h3,
        p {
          margin-top: 0;
        }

        h2 {
          margin-bottom: 10px;
          font-size: 30px;
          letter-spacing: -0.045em;
        }

        .heading > div:first-child > p:last-child {
          max-width: 760px;
          margin-bottom: 0;
          color: #68766f;
          line-height: 1.65;
        }

        .routeIdentity {
          min-width: 220px;
          padding: 13px 15px;
          border: 1px solid #dfe7e2;
          border-radius: 13px;
          background: #f8faf9;
        }

        .routeIdentity span {
          display: block;
          margin-bottom: 5px;
          color: #7a8781;
          font-size: 10px;
          font-weight: 850;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .routeIdentity strong {
          display: block;
          overflow: hidden;
          color: #173128;
          font-size: 13px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .laneGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          margin-top: 24px;
        }

        .laneCard {
          position: relative;
          padding: 22px;
          border: 1px solid #dce5e0;
          border-radius: 18px;
          background: #fbfcfb;
          color: inherit;
          font: inherit;
          text-align: left;
          cursor: pointer;
          transition:
            transform 160ms ease,
            border-color 160ms ease,
            box-shadow 160ms ease,
            background 160ms ease;
        }

        .laneCard:hover {
          transform: translateY(-2px);
          border-color: #a9cbbb;
          box-shadow: 0 18px 40px rgba(19, 72, 52, 0.08);
        }

        .laneCard[data-selected="true"] {
          border-color: #198260;
          background: #f1faf6;
          box-shadow:
            0 0 0 2px rgba(25, 130, 96, 0.12),
            0 20px 44px rgba(19, 72, 52, 0.09);
        }

        .cardTop {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
        }

        .badge {
          display: inline-flex;
          margin-bottom: 12px;
          padding: 6px 9px;
          border-radius: 999px;
          background: #eaf5f0;
          color: #0f7254;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        h3 {
          margin-bottom: 0;
          color: #173128;
          font-size: 22px;
          letter-spacing: -0.03em;
        }

        .price {
          color: #123c2e;
          font-size: 28px;
          letter-spacing: -0.05em;
        }

        .summary {
          min-height: 74px;
          margin: 16px 0;
          color: #64736c;
          font-size: 14px;
          line-height: 1.6;
        }

        ul {
          display: grid;
          gap: 9px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        li {
          display: grid;
          grid-template-columns: 18px 1fr;
          gap: 7px;
          color: #334a40;
          font-size: 13px;
          line-height: 1.45;
        }

        li span {
          color: #0f7c5c;
          font-weight: 900;
        }

        .recordStatus {
          margin-top: 18px;
          padding: 10px 12px;
          border: 1px solid #d8e3dd;
          border-radius: 11px;
          background: #f4f7f5;
          color: #617169;
          font-size: 11px;
          font-weight: 850;
          text-align: center;
          text-transform: uppercase;
        }

        .recordStatus[data-authoritative="true"] {
          border-color: #b7dfcf;
          background: #e8f8f1;
          color: #08724f;
        }

        .boundary {
          margin: 14px 0 0;
          color: #7b8781;
          font-size: 11px;
          line-height: 1.55;
        }

        .selectionMark {
          display: inline-flex;
          margin-top: 17px;
          color: #0f7254;
          font-size: 12px;
          font-weight: 900;
        }

        .continueRow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          margin-top: 18px;
          padding: 18px;
          border: 1px solid #dfe7e2;
          border-radius: 15px;
          background: #f8faf9;
        }

        .continueRow strong {
          color: #173128;
          font-size: 14px;
        }

        .continueRow p {
          margin: 5px 0 0;
          color: #718078;
          font-size: 12px;
          line-height: 1.5;
        }

        .continueButton {
          flex: 0 0 auto;
          padding: 13px 17px;
          border: 1px solid #123c2e;
          border-radius: 11px;
          background: #123c2e;
          color: white;
          font: inherit;
          font-weight: 900;
          cursor: pointer;
        }

        .errorNotice {
          margin-top: 14px;
          padding: 12px 14px;
          border: 1px solid #efc6c6;
          border-radius: 11px;
          background: #fff0f0;
          color: #9b3131;
          font-size: 13px;
          font-weight: 750;
        }

        @media (max-width: 780px) {
          .heading,
          .continueRow {
            align-items: stretch;
            flex-direction: column;
          }

          .routeIdentity {
            min-width: 0;
          }

          .laneGrid {
            grid-template-columns: 1fr;
          }

          .summary {
            min-height: 0;
          }

          .continueButton {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
