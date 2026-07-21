"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type ReviewType =
  | "Organization"
  | "AI System"
  | "Governance Program"
  | "Architecture"
  | "Operational System"
  | "Partner or Reviewer"
  | "Consequential Route";

type IntakeState = {
  entityName: string;
  reviewType: ReviewType;
  owner: string;
  contact: string;
  objective: string;
  evidence: string;
  knownConcerns: string;
  requestedOutcome: string;
  requestedReviewer: string;
};

type EntityReviewRequest = {
  requestId: string;
  createdAt: string;
  updatedAt: string;
  status: "DRAFT" | "READY_FOR_REVIEW";
  intake: IntakeState;
  boundaryStatement: string;
};

const REQUESTS_STORAGE_KEY = "ta14-entity-review-requests-v1";

export default function EntityReviewRequestRecordPage() {
  const params = useParams<{ requestId: string }>();
  const requestId = decodeURIComponent(params.requestId);
  const [request, setRequest] = useState<EntityReviewRequest | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(REQUESTS_STORAGE_KEY);

    if (!saved) {
      setLoaded(true);
      return;
    }

    try {
      const parsed = JSON.parse(saved) as EntityReviewRequest[];
      const match = Array.isArray(parsed)
        ? parsed.find((item) => item.requestId === requestId)
        : undefined;

      setRequest(match ?? null);
    } catch {
      window.localStorage.removeItem(REQUESTS_STORAGE_KEY);
    } finally {
      setLoaded(true);
    }
  }, [requestId]);

  const recordJson = useMemo(
    () => (request ? JSON.stringify(request, null, 2) : ""),
    [request],
  );

  const exportRecord = () => {
    if (!request) {
      return;
    }

    const blob = new Blob([recordJson], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${request.requestId}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);

    setNotice("The preserved Entity Review Request record was exported.");
  };

  const copyRecord = async () => {
    if (!request) {
      return;
    }

    try {
      await navigator.clipboard.writeText(recordJson);
      setNotice("The request record JSON was copied to the clipboard.");
    } catch {
      setNotice(
        "Clipboard access was unavailable. Use Export JSON to preserve a copy.",
      );
    }
  };

  if (!loaded) {
    return (
      <main className="record-page loading-state">
        <p>Loading preserved Entity Review Request…</p>
      </main>
    );
  }

  if (!request) {
    return (
      <main className="record-page">
        <div className="ambient" aria-hidden="true">
          <span className="star star-one" />
          <span className="star star-two" />
          <span className="orbit orbit-one" />
        </div>

        <section className="missing-record shell">
          <p className="eyebrow">ENTITY REVIEW REQUEST</p>
          <h1>Request record not found.</h1>
          <p>
            No browser-local request with identifier <strong>{requestId}</strong>{" "}
            is available on this device. The request may exist in another browser,
            may have been removed, or may not have been preserved.
          </p>

          <div className="actions">
            <Link className="button primary" href="/workspace/entity-review">
              Return to Entity Review
            </Link>
            <Link className="button secondary" href="/marketplace/professionals">
              Open Reviewer Marketplace
            </Link>
          </div>
        </section>

        <style jsx>{styles}</style>
      </main>
    );
  }

  return (
    <main className="record-page">
      <div className="ambient" aria-hidden="true">
        <span className="star star-one" />
        <span className="star star-two" />
        <span className="star star-three" />
        <span className="line line-one" />
        <span className="line line-two" />
        <span className="orbit orbit-one" />
        <span className="orbit orbit-two" />
      </div>

      <header className="topbar">
        <Link className="brand" href="/">
          <span>TA-14</span>
          <div>
            <strong>Entity Review Request</strong>
            <small>TA-14 AI Governance Exchange</small>
          </div>
        </Link>

        <nav>
          <Link href="/workspace/entity-review">Entity Review</Link>
          <Link href="/marketplace/professionals">Reviewer Marketplace</Link>
          <Link className="nav-cta" href="/">
            Four Doors
          </Link>
        </nav>
      </header>

      <section className="hero shell">
        <div>
          <p className="eyebrow">PRESERVED REQUEST RECORD</p>
          <h1>{request.intake.entityName}</h1>
          <p className="request-id">{request.requestId}</p>

          <div className="status-row">
            <span className={`status ${request.status.toLowerCase()}`}>
              {request.status.replaceAll("_", " ")}
            </span>
            <span>
              Created {new Date(request.createdAt).toLocaleString()}
            </span>
            <span>
              Updated {new Date(request.updatedAt).toLocaleString()}
            </span>
          </div>

          <p className="lead">
            This page presents the browser-local record of a declared Entity
            Review request. It preserves the request as entered; it does not
            certify the entity, establish reviewer authority, or prove that a
            review occurred.
          </p>

          <div className="actions">
            <Link
              className="button primary"
              href={`/workspace/entity-review?request=${encodeURIComponent(
                request.requestId,
              )}`}
            >
              Reopen in Entity Review
            </Link>
            <button className="button secondary" type="button" onClick={exportRecord}>
              Export JSON
            </button>
            <button className="button ghost" type="button" onClick={copyRecord}>
              Copy Record
            </button>
          </div>

          {notice ? <p className="notice">{notice}</p> : null}
        </div>

        <aside className="record-seal" aria-label="Entity Review Request record seal">
          <span className="seal-ring ring-one" />
          <span className="seal-ring ring-two" />
          <span className="seal-ring ring-three" />
          <div className="seal-core">
            <span>TA-14</span>
            <strong>ENTITY REVIEW</strong>
            <small>REQUEST RECORD</small>
          </div>
          <span className="seal-dot dot-one" />
          <span className="seal-dot dot-two" />
          <span className="seal-dot dot-three" />
        </aside>
      </section>

      <section className="shell record-grid">
        <article className="record-panel primary-panel">
          <p className="panel-label">DECLARED REVIEW OBJECT</p>
          <h2>{request.intake.reviewType}</h2>

          <dl className="record-list">
            <div>
              <dt>Entity name</dt>
              <dd>{request.intake.entityName}</dd>
            </div>
            <div>
              <dt>Responsible party</dt>
              <dd>{request.intake.owner || "Not declared"}</dd>
            </div>
            <div>
              <dt>Contact</dt>
              <dd>{request.intake.contact || "Not declared"}</dd>
            </div>
            <div>
              <dt>Requested reviewer or route</dt>
              <dd>{request.intake.requestedReviewer || "Not declared"}</dd>
            </div>
          </dl>
        </article>

        <article className="record-panel">
          <p className="panel-label">REVIEW OBJECTIVE</p>
          <h2>What the requester wants examined</h2>
          <p className="record-copy">
            {request.intake.objective || "No review objective was declared."}
          </p>
        </article>

        <article className="record-panel">
          <p className="panel-label">AVAILABLE EVIDENCE</p>
          <h2>Evidence declared by the requester</h2>
          <p className="record-copy">
            {request.intake.evidence || "No available evidence was declared."}
          </p>
        </article>

        <article className="record-panel">
          <p className="panel-label">KNOWN CONCERNS</p>
          <h2>Concerns, limitations, or unresolved issues</h2>
          <p className="record-copy">
            {request.intake.knownConcerns ||
              "No known concerns or limitations were declared."}
          </p>
        </article>

        <article className="record-panel">
          <p className="panel-label">REQUESTED OUTCOME</p>
          <h2>What the requester is asking to receive</h2>
          <p className="record-copy">
            {request.intake.requestedOutcome ||
              "No requested outcome was declared."}
          </p>
        </article>

        <article className="record-panel boundary-panel">
          <p className="panel-label">BOUNDARY STATEMENT</p>
          <h2>What this record does not establish</h2>
          <p>{request.boundaryStatement}</p>

          <div className="boundary-tags">
            <span>No certification</span>
            <span>No reviewer acceptance</span>
            <span>No completed review</span>
            <span>No regulatory determination</span>
            <span>No truth validation</span>
          </div>
        </article>
      </section>

      <section className="shell chronology">
        <div className="section-heading">
          <p className="eyebrow">REQUEST CHRONOLOGY</p>
          <h2>Preserved timing without invented activity</h2>
          <p>
            Only events supported by this browser-local request record are shown.
            No review, transmission, acceptance, assignment, or decision is
            inferred.
          </p>
        </div>

        <div className="timeline">
          <article>
            <span className="timeline-marker">01</span>
            <div>
              <strong>Request created</strong>
              <time>{new Date(request.createdAt).toLocaleString()}</time>
              <p>
                The requester preserved the first identified version of this
                Entity Review Request.
              </p>
            </div>
          </article>

          <article>
            <span className="timeline-marker">02</span>
            <div>
              <strong>Request last updated</strong>
              <time>{new Date(request.updatedAt).toLocaleString()}</time>
              <p>
                The browser-local record was last updated. This does not indicate
                reviewer activity.
              </p>
            </div>
          </article>

          <article className="unproven">
            <span className="timeline-marker">—</span>
            <div>
              <strong>Reviewer activity</strong>
              <time>Not established</time>
              <p>
                This record contains no admissible evidence that a reviewer
                received, accepted, assessed, or completed the request.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="shell raw-record">
        <div className="section-heading">
          <p className="eyebrow">MACHINE-READABLE RECORD</p>
          <h2>Preserved request JSON</h2>
          <p>
            This representation can be exported and compared with later versions
            or future backend records.
          </p>
        </div>

        <pre>{recordJson}</pre>
      </section>

      <footer>
        <Link className="brand" href="/">
          <span>TA-14</span>
          <div>
            <strong>Entity Review Request</strong>
            <small>Preserved without certification</small>
          </div>
        </Link>

        <p>
          No admissible evidence. No admissible execution. This request record is
          bounded by its declared content, timestamps, storage location, and
          explicit non-claims.
        </p>
      </footer>

      <style jsx>{styles}</style>
    </main>
  );
}

const styles = `
  :global(*) {
    box-sizing: border-box;
  }

  :global(html) {
    scroll-behavior: smooth;
  }

  :global(body) {
    margin: 0;
    color: #fbf8ff;
    background: #05040a;
  }

  :global(a) {
    color: inherit;
    text-decoration: none;
  }

  :global(button) {
    font: inherit;
  }

  .record-page {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    isolation: isolate;
    background:
      radial-gradient(circle at 8% 4%, rgba(187, 121, 255, 0.13), transparent 27%),
      radial-gradient(circle at 92% 12%, rgba(255, 204, 95, 0.08), transparent 24%),
      linear-gradient(180deg, #07050d 0%, #0b0813 52%, #05040a 100%);
  }

  .record-page > :not(.ambient) {
    position: relative;
    z-index: 2;
  }

  .loading-state {
    display: grid;
    place-items: center;
    color: #cdb6df;
  }

  .ambient {
    position: fixed;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .star {
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #fff;
    box-shadow:
      0 0 10px #fff,
      0 0 28px rgba(187, 121, 255, 0.95);
    animation: starPulse 7s ease-in-out infinite;
  }

  .star-one {
    top: 14%;
    left: 86%;
  }

  .star-two {
    top: 63%;
    left: 8%;
    animation-delay: -2.4s;
  }

  .star-three {
    top: 84%;
    left: 71%;
    animation-delay: -4.8s;
  }

  .line {
    position: absolute;
    width: 48vw;
    height: 1px;
    opacity: 0.27;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(205, 160, 255, 0.8),
      transparent
    );
    animation: lineTravel 21s linear infinite;
  }

  .line-one {
    top: 34%;
    left: -52vw;
    transform: rotate(13deg);
  }

  .line-two {
    top: 76%;
    right: -52vw;
    transform: rotate(-15deg);
    animation-delay: -9s;
  }

  .orbit {
    position: absolute;
    width: 700px;
    height: 700px;
    border: 1px solid rgba(205, 160, 255, 0.06);
    border-radius: 50%;
    animation: rotate 58s linear infinite;
  }

  .orbit-one {
    top: -180px;
    left: -390px;
  }

  .orbit-two {
    top: 44%;
    right: -420px;
    width: 850px;
    height: 850px;
    animation-direction: reverse;
    animation-duration: 74s;
  }

  .shell {
    width: min(1380px, calc(100% - 34px));
    margin: 0 auto;
  }

  .topbar {
    position: sticky;
    top: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    min-height: 76px;
    padding: 13px clamp(18px, 4vw, 62px);
    border-bottom: 1px solid rgba(205, 160, 255, 0.13);
    background: rgba(6, 4, 11, 0.9);
    backdrop-filter: blur(18px);
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: 12px;
  }

  .brand > span {
    display: grid;
    place-items: center;
    min-width: 60px;
    height: 42px;
    padding: 0 9px;
    border: 1px solid rgba(205, 160, 255, 0.5);
    border-radius: 11px;
    color: #d9adff;
    background: rgba(187, 121, 255, 0.07);
    font-weight: 950;
  }

  .brand div {
    display: grid;
    gap: 2px;
  }

  .brand strong {
    font-size: 0.82rem;
    letter-spacing: 0.08em;
  }

  .brand small {
    color: #8e7d9b;
    font-size: 0.68rem;
    font-weight: 850;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  nav {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px;
    border: 1px solid rgba(205, 160, 255, 0.12);
    border-radius: 999px;
    background: rgba(11, 8, 18, 0.78);
  }

  nav a {
    display: inline-flex;
    align-items: center;
    min-height: 38px;
    padding: 0 13px;
    border-radius: 999px;
    color: #a896b5;
    font-size: 0.77rem;
    font-weight: 850;
  }

  nav a:hover {
    color: #fff;
    background: rgba(205, 160, 255, 0.08);
  }

  nav .nav-cta {
    color: #170b20;
    background: #d4a4ff;
  }

  .hero {
    display: grid;
    grid-template-columns: minmax(0, 1.12fr) minmax(390px, 0.88fr);
    gap: clamp(45px, 7vw, 100px);
    align-items: center;
    min-height: calc(100vh - 76px);
    padding: 88px 0;
  }

  .eyebrow,
  .panel-label {
    margin: 0 0 12px;
    color: #d4a4ff;
    font-size: 0.72rem;
    font-weight: 950;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  h1,
  h2,
  p {
    margin-top: 0;
  }

  h1 {
    margin-bottom: 13px;
    font-size: clamp(3.6rem, 7vw, 7rem);
    line-height: 0.93;
    letter-spacing: -0.07em;
  }

  h2 {
    margin-bottom: 17px;
    font-size: clamp(1.7rem, 3vw, 3.1rem);
    line-height: 1.03;
    letter-spacing: -0.045em;
  }

  p {
    color: #a99db2;
    line-height: 1.72;
  }

  .request-id {
    margin-bottom: 19px;
    color: #e1bcff;
    font-size: 0.92rem;
    font-weight: 950;
    letter-spacing: 0.08em;
  }

  .status-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 26px;
  }

  .status-row > span {
    display: inline-flex;
    align-items: center;
    min-height: 33px;
    padding: 0 10px;
    border: 1px solid rgba(205, 160, 255, 0.14);
    border-radius: 999px;
    color: #9b8ea5;
    background: rgba(10, 7, 16, 0.64);
    font-size: 0.72rem;
    font-weight: 800;
  }

  .status {
    color: #d9b2f6 !important;
    font-weight: 950 !important;
    letter-spacing: 0.07em;
  }

  .status.ready_for_review {
    color: #99ecc7 !important;
    border-color: rgba(140, 232, 189, 0.33) !important;
    background: rgba(140, 232, 189, 0.06) !important;
  }

  .lead {
    max-width: 830px;
    color: #d1c6d8;
    font-size: clamp(1.05rem, 1.6vw, 1.3rem);
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 27px;
  }

  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 48px;
    padding: 0 18px;
    border: 1px solid transparent;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 900;
    transition: 0.18s ease;
  }

  .button:hover {
    transform: translateY(-2px);
  }

  .primary {
    color: #170b20;
    border-color: #d4a4ff;
    background: #d4a4ff;
  }

  .secondary {
    color: #f7edff;
    border-color: rgba(205, 160, 255, 0.27);
    background: rgba(25, 15, 34, 0.84);
  }

  .ghost {
    color: #b5a5c0;
    border-color: rgba(205, 160, 255, 0.1);
    background: transparent;
  }

  .notice {
    margin-top: 14px;
    color: #cab6d8;
    font-size: 0.83rem;
  }

  .record-seal {
    position: relative;
    min-height: 530px;
    border: 1px solid rgba(205, 160, 255, 0.15);
    border-radius: 50%;
    background:
      radial-gradient(circle, rgba(187, 121, 255, 0.1), transparent 48%),
      rgba(10, 7, 16, 0.65);
    box-shadow:
      0 35px 105px rgba(0, 0, 0, 0.42),
      inset 0 0 90px rgba(187, 121, 255, 0.04);
  }

  .seal-core {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 3;
    display: grid;
    place-items: center;
    width: 175px;
    height: 175px;
    border: 1px solid rgba(223, 183, 255, 0.55);
    border-radius: 50%;
    color: #e1bdff;
    background: radial-gradient(
      circle,
      rgba(187, 121, 255, 0.17),
      rgba(10, 7, 16, 0.97) 70%
    );
    box-shadow: 0 0 60px rgba(187, 121, 255, 0.18);
    transform: translate(-50%, -50%);
    animation: sealPulse 4.6s ease-in-out infinite;
  }

  .seal-core span,
  .seal-core strong,
  .seal-core small {
    display: block;
  }

  .seal-core span {
    font-size: 1.3rem;
    font-weight: 950;
  }

  .seal-core strong {
    margin-top: -31px;
    font-size: 0.67rem;
    letter-spacing: 0.15em;
  }

  .seal-core small {
    margin-top: -44px;
    color: #9b86aa;
    font-size: 0.55rem;
    font-weight: 900;
    letter-spacing: 0.14em;
  }

  .seal-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    border: 1px solid rgba(205, 160, 255, 0.12);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: rotate 40s linear infinite;
  }

  .ring-one {
    width: 250px;
    height: 250px;
  }

  .ring-two {
    width: 365px;
    height: 365px;
    animation-direction: reverse;
    animation-duration: 54s;
  }

  .ring-three {
    width: 470px;
    height: 470px;
    animation-duration: 68s;
  }

  .seal-dot {
    position: absolute;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #d4a4ff;
    box-shadow: 0 0 24px rgba(212, 164, 255, 0.8);
  }

  .dot-one {
    top: 17%;
    left: 49%;
  }

  .dot-two {
    top: 63%;
    right: 8%;
  }

  .dot-three {
    bottom: 12%;
    left: 22%;
  }

  .record-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    padding: 105px 0;
  }

  .record-panel {
    min-height: 330px;
    padding: clamp(25px, 4vw, 44px);
    border: 1px solid rgba(205, 160, 255, 0.15);
    border-radius: 24px;
    background:
      radial-gradient(
        circle at 92% 5%,
        rgba(187, 121, 255, 0.07),
        transparent 31%
      ),
      rgba(12, 9, 20, 0.77);
    box-shadow: 0 26px 80px rgba(0, 0, 0, 0.26);
  }

  .primary-panel {
    grid-column: 1 / -1;
    min-height: auto;
  }

  .record-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin: 29px 0 0;
  }

  .record-list div {
    padding: 16px;
    border: 1px solid rgba(205, 160, 255, 0.11);
    border-radius: 14px;
    background: rgba(7, 5, 12, 0.5);
  }

  dt {
    margin-bottom: 7px;
    color: #887a92;
    font-size: 0.72rem;
    font-weight: 850;
  }

  dd {
    margin: 0;
    color: #d8cddd;
    line-height: 1.55;
  }

  .record-copy {
    margin-bottom: 0;
    white-space: pre-wrap;
  }

  .boundary-panel {
    border-color: rgba(255, 202, 91, 0.2);
    background:
      radial-gradient(
        circle at 92% 5%,
        rgba(255, 202, 91, 0.08),
        transparent 31%
      ),
      rgba(14, 11, 18, 0.8);
  }

  .boundary-panel .panel-label {
    color: #e5bd68;
  }

  .boundary-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 24px;
  }

  .boundary-tags span {
    padding: 7px 10px;
    border: 1px solid rgba(255, 202, 91, 0.18);
    border-radius: 999px;
    color: #c5a76a;
    font-size: 0.72rem;
    font-weight: 850;
  }

  .chronology,
  .raw-record {
    padding: 105px 0;
  }

  .section-heading {
    max-width: 900px;
    margin-bottom: 38px;
  }

  .section-heading > p:last-child {
    max-width: 780px;
  }

  .timeline {
    display: grid;
    gap: 13px;
  }

  .timeline article {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 18px;
    padding: 22px;
    border: 1px solid rgba(205, 160, 255, 0.14);
    border-radius: 18px;
    background: rgba(12, 9, 20, 0.73);
  }

  .timeline-marker {
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border: 1px solid rgba(205, 160, 255, 0.27);
    border-radius: 13px;
    color: #d5a8f7;
    font-weight: 950;
  }

  .timeline strong,
  .timeline time {
    display: block;
  }

  .timeline strong {
    color: #eee5f4;
  }

  .timeline time {
    margin: 4px 0 8px;
    color: #9a8aa6;
    font-size: 0.78rem;
  }

  .timeline p {
    margin-bottom: 0;
    font-size: 0.88rem;
  }

  .timeline .unproven {
    border-style: dashed;
  }

  .timeline .unproven .timeline-marker {
    color: #c8a95f;
    border-color: rgba(255, 202, 91, 0.25);
  }

  .raw-record pre {
    overflow: auto;
    max-height: 720px;
    margin: 0;
    padding: 24px;
    border: 1px solid rgba(205, 160, 255, 0.16);
    border-radius: 20px;
    color: #d9c8e3;
    background: rgba(5, 4, 9, 0.9);
    font-size: 0.78rem;
    line-height: 1.7;
  }

  .missing-record {
    display: grid;
    align-content: center;
    min-height: 100vh;
    max-width: 980px;
  }

  .missing-record h1 {
    max-width: 850px;
  }

  .missing-record p {
    max-width: 760px;
    font-size: 1.05rem;
  }

  footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 35px;
    width: min(1380px, calc(100% - 34px));
    margin: 0 auto;
    padding: 39px 0;
    border-top: 1px solid rgba(205, 160, 255, 0.12);
  }

  footer p {
    max-width: 760px;
    margin: 0;
    color: #74697d;
    font-size: 0.76rem;
    text-align: right;
  }

  @keyframes starPulse {
    0%,
    100% {
      opacity: 0.15;
      transform: scale(0.4);
    }
    50% {
      opacity: 1;
      transform: scale(1.35);
    }
  }

  @keyframes lineTravel {
    from {
      transform: translateX(0) rotate(13deg);
    }
    to {
      transform: translateX(175vw) rotate(13deg);
    }
  }

  @keyframes rotate {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes sealPulse {
    0%,
    100% {
      transform: translate(-50%, -50%) scale(0.96);
    }
    50% {
      transform: translate(-50%, -50%) scale(1.04);
    }
  }

  @media (max-width: 1050px) {
    .hero {
      grid-template-columns: 1fr;
    }

    .record-seal {
      width: min(580px, 100%);
    }
  }

  @media (max-width: 780px) {
    nav {
      display: none;
    }

    .record-grid,
    .record-list {
      grid-template-columns: 1fr;
    }

    .primary-panel {
      grid-column: auto;
    }

    footer {
      align-items: flex-start;
      flex-direction: column;
    }

    footer p {
      text-align: left;
    }
  }

  @media (max-width: 620px) {
    .shell {
      width: min(100% - 24px, 1380px);
    }

    .hero,
    .record-grid,
    .chronology,
    .raw-record {
      padding: 72px 0;
    }

    .record-seal {
      min-height: 460px;
      border-radius: 28px;
    }

    .ring-three {
      width: 400px;
      height: 400px;
    }

    .timeline article {
      grid-template-columns: 1fr;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(html) {
      scroll-behavior: auto;
    }

    .star,
    .line,
    .orbit,
    .seal-ring,
    .seal-core {
      animation: none;
    }
  }
`;

