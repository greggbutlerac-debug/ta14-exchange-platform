"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

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

const STORAGE_KEY = "ta14-entity-review-intake-v1";
const REQUESTS_STORAGE_KEY = "ta14-entity-review-requests-v1";

const reviewTypes: Array<{
  title: ReviewType;
  description: string;
  examples: string[];
}> = [
  {
    title: "Organization",
    description:
      "Review whether an organization can support the authority, evidence, continuity, accountability, and review obligations it declares.",
    examples: [
      "Enterprise governance readiness",
      "Institutional authority structure",
      "Evidence custody and accountability",
    ],
  },
  {
    title: "AI System",
    description:
      "Examine the system, its consequential routes, declared controls, evidence boundaries, and preserved outcomes.",
    examples: [
      "Agentic systems",
      "Decision-support systems",
      "Automated consequential execution",
    ],
  },
  {
    title: "Governance Program",
    description:
      "Review whether a governance program governs the full route or only isolated documents, policies, scores, or approvals.",
    examples: [
      "AI governance programs",
      "Risk and compliance programs",
      "Internal control frameworks",
    ],
  },
  {
    title: "Architecture",
    description:
      "Evaluate the structure that binds evidence, authority, review, execution, and outcomes without silently merging them.",
    examples: [
      "Governance architecture",
      "Evidence architecture",
      "Runtime authorization architecture",
    ],
  },
  {
    title: "Operational System",
    description:
      "Review a real-world operational environment where software, people, machines, records, and consequences interact.",
    examples: [
      "Buildings and infrastructure",
      "Healthcare environments",
      "Industrial or environmental systems",
    ],
  },
  {
    title: "Partner or Reviewer",
    description:
      "Assess a proposed reviewer, specialist, or partner without treating participation as automatic certification.",
    examples: [
      "Partner Review Network candidate",
      "Independent specialist",
      "Review-lane qualification",
    ],
  },
  {
    title: "Consequential Route",
    description:
      "Review one specific route from reality and evidence through authority, execution, and preserved outcome.",
    examples: [
      "Payment authorization",
      "High-risk AI action",
      "Operational intervention",
    ],
  },
];

const initialState: IntakeState = {
  entityName: "",
  reviewType: "Organization",
  owner: "",
  contact: "",
  objective: "",
  evidence: "",
  knownConcerns: "",
  requestedOutcome: "",
  requestedReviewer: "",
};

export default function EntityReviewPage() {
  const searchParams = useSearchParams();
  const [intake, setIntake] = useState<IntakeState>(initialState);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [showIntake, setShowIntake] = useState(false);
  const [notice, setNotice] = useState("");
  const [requests, setRequests] = useState<EntityReviewRequest[]>([]);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return;
    }

    try {
      const parsed = JSON.parse(saved) as {
        intake?: IntakeState;
        savedAt?: string;
      };

      if (parsed.intake) {
        setIntake(parsed.intake);
        setSavedAt(parsed.savedAt ?? null);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const reviewer = searchParams.get("reviewer");

    if (!reviewer) {
      return;
    }

    setIntake((current) => ({
      ...current,
      requestedReviewer: reviewer,
    }));
    setShowIntake(true);
    setNotice(
      `${reviewer} has been carried into this intake as the requested reviewer or review route. Selection does not establish qualification, availability, acceptance, or certification.`,
    );
  }, [searchParams]);

  useEffect(() => {
    const requestedId = searchParams.get("request");

    if (!requestedId || requests.length === 0) {
      return;
    }

    const matchingRequest = requests.find(
      (request) => request.requestId === requestedId,
    );

    if (!matchingRequest) {
      setNotice(
        `${requestedId} was not found in this browser's local Entity Review request history.`,
      );
      return;
    }

    setIntake(matchingRequest.intake);
    setActiveRequestId(matchingRequest.requestId);
    setSavedAt(matchingRequest.updatedAt);
    setShowIntake(true);
    setNotice(
      `${matchingRequest.requestId} has been reopened for editing. Changes remain local until the request is preserved again.`,
    );

    window.setTimeout(() => {
      document.getElementById("intake")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }, [requests, searchParams]);

  useEffect(() => {
    const savedRequests = window.localStorage.getItem(REQUESTS_STORAGE_KEY);

    if (!savedRequests) {
      return;
    }

    try {
      const parsed = JSON.parse(savedRequests) as EntityReviewRequest[];
      setRequests(Array.isArray(parsed) ? parsed : []);
    } catch {
      window.localStorage.removeItem(REQUESTS_STORAGE_KEY);
    }
  }, []);

  const selectedType = useMemo(
    () => reviewTypes.find((item) => item.title === intake.reviewType),
    [intake.reviewType],
  );

  const updateField = <K extends keyof IntakeState>(
    key: K,
    value: IntakeState[K],
  ) => {
    setIntake((current) => ({
      ...current,
      [key]: value,
    }));
    setNotice("");
  };

  const createRequestId = () => {
    const date = new Date();
    const datePart = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("");

    const timePart = [
      String(date.getHours()).padStart(2, "0"),
      String(date.getMinutes()).padStart(2, "0"),
      String(date.getSeconds()).padStart(2, "0"),
    ].join("");

    const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase();

    return `TA-14-ER-${datePart}-${timePart}-${randomPart}`;
  };

  const persistRequests = (nextRequests: EntityReviewRequest[]) => {
    setRequests(nextRequests);
    window.localStorage.setItem(
      REQUESTS_STORAGE_KEY,
      JSON.stringify(nextRequests),
    );
  };

  const preserveAsRequest = (status: EntityReviewRequest["status"]) => {
    if (!intake.entityName.trim() || !intake.objective.trim()) {
      setNotice(
        "Entity name and review objective are required before a review request record can be preserved.",
      );
      setShowIntake(true);
      return;
    }

    const timestamp = new Date().toISOString();
    const existing = activeRequestId
      ? requests.find((request) => request.requestId === activeRequestId)
      : undefined;

    const request: EntityReviewRequest = {
      requestId: existing?.requestId ?? createRequestId(),
      createdAt: existing?.createdAt ?? timestamp,
      updatedAt: timestamp,
      status,
      intake,
      boundaryStatement:
        "This record preserves a declared Entity Review request. It does not prove reviewer qualification, reviewer acceptance, review completion, certification, regulatory compliance, or the truth of the underlying claims.",
    };

    const nextRequests = existing
      ? requests.map((item) =>
          item.requestId === request.requestId ? request : item,
        )
      : [request, ...requests];

    persistRequests(nextRequests);
    setActiveRequestId(request.requestId);
    setSavedAt(timestamp);

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        intake,
        savedAt: timestamp,
      }),
    );

    setNotice(
      `${request.requestId} has been preserved locally with status ${status}. It has not been transmitted or accepted by a reviewer.`,
    );
  };

  const loadRequest = (request: EntityReviewRequest) => {
    setIntake(request.intake);
    setActiveRequestId(request.requestId);
    setSavedAt(request.updatedAt);
    setShowIntake(true);
    setNotice(
      `${request.requestId} has been loaded from this browser's local Entity Review request history.`,
    );
    document.getElementById("intake")?.scrollIntoView({ behavior: "smooth" });
  };

  const deleteRequest = (requestId: string) => {
    const nextRequests = requests.filter(
      (request) => request.requestId !== requestId,
    );
    persistRequests(nextRequests);

    if (activeRequestId === requestId) {
      setActiveRequestId(null);
    }

    setNotice(`${requestId} has been removed from this browser.`);
  };

  const exportRequest = (request: EntityReviewRequest) => {
    const blob = new Blob([JSON.stringify(request, null, 2)], {
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
  };

  const saveIntake = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const timestamp = new Date().toISOString();

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        intake,
        savedAt: timestamp,
      }),
    );

    setSavedAt(timestamp);
    setNotice(
      "Your working intake has been preserved in this browser. Use Preserve Review Request when you are ready to create an identified request record.",
    );
  };

  const clearIntake = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setIntake(initialState);
    setSavedAt(null);
    setActiveRequestId(null);
    setNotice(
      "The working intake has been cleared. Preserved request records remain in the local request history.",
    );
  };

  return (
    <main className="entity-page">
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
            <strong>Entity Review</strong>
            <small>TA-14 AI Governance Exchange</small>
          </div>
        </Link>

        <nav>
          <a href="#review-types">Review Types</a>
          <a href="#review-process">Process</a>
          <a href="#intake">Intake</a>
          <a href="#request-history">Requests</a>
          <Link href="/marketplace/professionals">Find a Reviewer</Link>
          <Link className="top-cta" href="/">Return Home</Link>
        </nav>
      </header>

      <section className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow">ENTITY REVIEW WORKSPACE</p>
          <h1>
            Review the entity,
            <span>not merely its claims.</span>
          </h1>
          <p className="lead">
            Bring an organization, AI system, governance program, architecture,
            operational system, proposed partner, reviewer, or consequential
            route into a bounded review environment.
          </p>
          <p>
            Entity Review examines what the entity declares, what evidence it can
            preserve, what authority it actually holds, where continuity breaks,
            what remains unproven, and which outcomes can be responsibly stated.
          </p>

          <div className="hero-actions">
            <button
              className="button primary"
              type="button"
              onClick={() => {
                setShowIntake(true);
                window.setTimeout(() => {
                  document
                    .getElementById("intake")
                    ?.scrollIntoView({ behavior: "smooth" });
                }, 20);
              }}
            >
              Begin Entity Review Intake
            </button>
            <Link className="button secondary" href="/marketplace/professionals">
              Find an Independent Reviewer
            </Link>
            <Link
              className="button ghost"
              href="/workspace/entity-review/partner-review-network/pricing"
            >
              Partner Review Network
            </Link>
          </div>

          <div className="boundary-row">
            <span>Bounded findings</span>
            <span>Visible review scope</span>
            <span>No automatic certification</span>
            <span>No silent authority transfer</span>
          </div>
        </div>

        <aside className="review-map" aria-label="Entity review map">
          <div className="map-core">
            <span>ENTITY</span>
            <strong>UNDER REVIEW</strong>
          </div>

          {[
            ["Evidence", "What exists?"],
            ["Authority", "Who may act?"],
            ["Continuity", "What remains connected?"],
            ["Boundaries", "What is not proven?"],
            ["Review", "Who examined it?"],
            ["Outcome", "What may be stated?"],
          ].map(([title, question], index) => (
            <div className={`map-node node-${index + 1}`} key={title}>
              <strong>{title}</strong>
              <small>{question}</small>
            </div>
          ))}

          <span className="map-ring ring-one" />
          <span className="map-ring ring-two" />
          <span className="map-ring ring-three" />
        </aside>
      </section>

      <section className="shell section" id="review-types">
        <div className="section-heading">
          <p className="eyebrow">WHAT CAN BE REVIEWED</p>
          <h2>Choose the entity that actually carries the risk.</h2>
          <p>
            The review object must be declared before evidence is interpreted.
            A document review is not automatically an organization review, and a
            policy review is not automatically a system review.
          </p>
        </div>

        <div className="type-grid">
          {reviewTypes.map((item) => (
            <button
              className={
                intake.reviewType === item.title
                  ? "type-card selected"
                  : "type-card"
              }
              type="button"
              key={item.title}
              onClick={() => {
                updateField("reviewType", item.title);
                setShowIntake(true);
              }}
            >
              <span className="selection-mark">
                {intake.reviewType === item.title ? "✓" : "○"}
              </span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <ul>
                {item.examples.map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
              <strong>Select review type →</strong>
            </button>
          ))}
        </div>
      </section>

      <section className="shell section" id="review-process">
        <div className="section-heading centered">
          <p className="eyebrow">BOUNDED REVIEW PROCESS</p>
          <h2>The review must preserve what it knows and what it does not know.</h2>
        </div>

        <div className="process-grid">
          {[
            [
              "01",
              "Declare the entity",
              "Identify exactly what is being reviewed, who owns it, and what remains outside the review boundary.",
            ],
            [
              "02",
              "Define the review question",
              "State the decision, concern, readiness question, architecture question, or consequential route under examination.",
            ],
            [
              "03",
              "Assemble evidence",
              "Bring policies, records, architecture, runtime evidence, authorities, outcomes, and declared limitations.",
            ],
            [
              "04",
              "Test continuity",
              "Examine whether the evidence remains connected to identity, time, authority, execution, and outcome.",
            ],
            [
              "05",
              "Preserve findings",
              "Record supported findings, unresolved gaps, dissent, uncertainty, and the exact scope of the review.",
            ],
            [
              "06",
              "Issue the bounded outcome",
              "State what the review supports without silently converting review participation into certification.",
            ],
          ].map(([number, title, description]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="shell section intake-section" id="intake">
        <div className="intake-heading">
          <div>
            <p className="eyebrow">ENTITY REVIEW INTAKE</p>
            <h2>Start with a declaration, not a conclusion.</h2>
            <p>
              This first intake is browser-local. Saving it preserves a working
              draft on this device only. It does not submit the entity for review.
            </p>
          </div>

          <button
            className="button secondary"
            type="button"
            onClick={() => setShowIntake((current) => !current)}
          >
            {showIntake ? "Hide Intake" : "Open Intake"}
          </button>
        </div>

        {showIntake ? (
          <form className="intake-form" onSubmit={saveIntake}>
            {activeRequestId ? (
              <div className="active-request-banner">
                <span>ACTIVE ENTITY REVIEW REQUEST</span>
                <strong>{activeRequestId}</strong>
                <p>
                  Saving or preserving now updates this request record rather
                  than creating a duplicate.
                </p>
                <Link
                  className="active-record-link"
                  href={`/workspace/entity-review/requests/${encodeURIComponent(
                    activeRequestId,
                  )}`}
                >
                  View preserved record
                </Link>
              </div>
            ) : null}

            <div className="selected-review">
              <span>Selected review object</span>
              <strong>{intake.reviewType}</strong>
              <p>{selectedType?.description}</p>

              {intake.requestedReviewer ? (
                <div className="requested-reviewer">
                  <span>Requested reviewer or review route</span>
                  <strong>{intake.requestedReviewer}</strong>
                  <p>
                    This is a requested match only. Qualification, independence,
                    availability, conflicts, authority, and acceptance remain to
                    be established.
                  </p>
                </div>
              ) : null}
            </div>

            <div className="form-grid">
              <label>
                <span>Entity name</span>
                <input
                  value={intake.entityName}
                  onChange={(event) =>
                    updateField("entityName", event.target.value)
                  }
                  placeholder="Name the organization, system, architecture, or route"
                  required
                />
              </label>

              <label>
                <span>Review type</span>
                <select
                  value={intake.reviewType}
                  onChange={(event) =>
                    updateField(
                      "reviewType",
                      event.target.value as ReviewType,
                    )
                  }
                >
                  {reviewTypes.map((item) => (
                    <option key={item.title} value={item.title}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Owner or responsible party</span>
                <input
                  value={intake.owner}
                  onChange={(event) =>
                    updateField("owner", event.target.value)
                  }
                  placeholder="Who is responsible for the entity?"
                />
              </label>

              <label>
                <span>Contact</span>
                <input
                  value={intake.contact}
                  onChange={(event) =>
                    updateField("contact", event.target.value)
                  }
                  placeholder="Name or email for the proposed review"
                />
              </label>

              <label className="wide">
                <span>Requested reviewer or review route</span>
                <input
                  value={intake.requestedReviewer}
                  onChange={(event) =>
                    updateField("requestedReviewer", event.target.value)
                  }
                  placeholder="Optional: reviewer, specialist, laboratory, or network route"
                />
              </label>

              <label className="wide">
                <span>Review objective</span>
                <textarea
                  value={intake.objective}
                  onChange={(event) =>
                    updateField("objective", event.target.value)
                  }
                  placeholder="What question must the review answer?"
                  rows={4}
                  required
                />
              </label>

              <label className="wide">
                <span>Evidence currently available</span>
                <textarea
                  value={intake.evidence}
                  onChange={(event) =>
                    updateField("evidence", event.target.value)
                  }
                  placeholder="Describe the records, policies, system evidence, authorities, architecture, runtime evidence, or outcomes available."
                  rows={5}
                />
              </label>

              <label className="wide">
                <span>Known concerns or suspected gaps</span>
                <textarea
                  value={intake.knownConcerns}
                  onChange={(event) =>
                    updateField("knownConcerns", event.target.value)
                  }
                  placeholder="What is already disputed, uncertain, missing, stale, or unverified?"
                  rows={4}
                />
              </label>

              <label className="wide">
                <span>Requested outcome</span>
                <textarea
                  value={intake.requestedOutcome}
                  onChange={(event) =>
                    updateField("requestedOutcome", event.target.value)
                  }
                  placeholder="What bounded output, finding, readiness review, or route review is being requested?"
                  rows={4}
                />
              </label>
            </div>

            <div className="form-actions">
              <button className="button secondary" type="submit">
                Save Working Intake
              </button>
              <button
                className="button primary"
                type="button"
                onClick={() => preserveAsRequest("DRAFT")}
              >
                Preserve Review Request
              </button>
              <button
                className="button ready-button"
                type="button"
                onClick={() => preserveAsRequest("READY_FOR_REVIEW")}
              >
                Mark Ready for Review
              </button>
              <button
                className="button ghost danger"
                type="button"
                onClick={clearIntake}
              >
                Clear Working Intake
              </button>
              <Link className="button ghost" href="/marketplace/professionals">
                Find a Reviewer
              </Link>
            </div>

            {savedAt ? (
              <p className="saved-time">
                Last preserved locally:{" "}
                {new Date(savedAt).toLocaleString()}
              </p>
            ) : null}

            {notice ? <p className="notice">{notice}</p> : null}
          </form>
        ) : (
          <button
            className="closed-intake"
            type="button"
            onClick={() => setShowIntake(true)}
          >
            <span>+</span>
            <div>
              <strong>Open the Entity Review intake</strong>
              <p>
                Declare the entity, review objective, evidence, concerns, and
                requested bounded outcome.
              </p>
            </div>
          </button>
        )}
      </section>

      <section className="shell section request-library" id="request-history">
        <div className="section-heading">
          <p className="eyebrow">LOCAL REQUEST HISTORY</p>
          <h2>Preserved Entity Review Requests</h2>
          <p>
            These records exist only in this browser. They are working governance
            artifacts, not proof that a reviewer has received, accepted, or
            completed the requested review.
          </p>
        </div>

        {requests.length ? (
          <div className="request-grid">
            {requests.map((request) => (
              <article className="request-card" key={request.requestId}>
                <div className="request-card-top">
                  <span className={`request-status ${request.status.toLowerCase()}`}>
                    {request.status.replaceAll("_", " ")}
                  </span>
                  <span>
                    Updated {new Date(request.updatedAt).toLocaleString()}
                  </span>
                </div>

                <p className="request-id">{request.requestId}</p>
                <h3>{request.intake.entityName}</h3>
                <strong>{request.intake.reviewType}</strong>
                <p>{request.intake.objective}</p>

                <dl>
                  <div>
                    <dt>Requested reviewer</dt>
                    <dd>
                      {request.intake.requestedReviewer || "Not yet declared"}
                    </dd>
                  </div>
                  <div>
                    <dt>Responsible party</dt>
                    <dd>{request.intake.owner || "Not yet declared"}</dd>
                  </div>
                  <div>
                    <dt>Created</dt>
                    <dd>{new Date(request.createdAt).toLocaleString()}</dd>
                  </div>
                </dl>

                <p className="request-boundary">
                  {request.boundaryStatement}
                </p>

                <div className="request-actions">
                  <Link
                    className="button primary"
                    href={`/workspace/entity-review/requests/${encodeURIComponent(
                      request.requestId,
                    )}`}
                  >
                    View Record
                  </Link>
                  <button
                    className="button secondary"
                    type="button"
                    onClick={() => loadRequest(request)}
                  >
                    Edit Request
                  </button>
                  <button
                    className="button secondary"
                    type="button"
                    onClick={() => exportRequest(request)}
                  >
                    Export JSON
                  </button>
                  <button
                    className="button ghost danger"
                    type="button"
                    onClick={() => deleteRequest(request.requestId)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-request-library">
            <span>NO PRESERVED REQUESTS YET</span>
            <h3>Your first identified request will appear here.</h3>
            <p>
              Complete the intake, preserve the request, and the Exchange will
              create a browser-local identifier, timestamp, status, and
              exportable record.
            </p>
            <button
              className="button primary"
              type="button"
              onClick={() => {
                setShowIntake(true);
                document
                  .getElementById("intake")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Create First Review Request
            </button>
          </div>
        )}
      </section>

      <section className="shell section connected-section">
        <div className="section-heading centered">
          <p className="eyebrow">CONNECTED ENTITY REVIEW ROUTES</p>
          <h2>Review may require more than one independent lane.</h2>
          <p>
            Entity Review can connect a declared need to the appropriate
            specialist, marketplace opportunity, governance laboratory, or
            Partner Review Network path.
          </p>
        </div>

        <div className="connected-grid">
          <Link href="/marketplace/professionals">
            <span>01</span>
            <h3>Find a Reviewer</h3>
            <p>Locate independent professionals and specialized review capacity.</p>
            <strong>Open reviewer marketplace →</strong>
          </Link>

          <Link href="/marketplace">
            <span>02</span>
            <h3>Post a Review Need</h3>
            <p>Bring the entity-review requirement into the shared Marketplace.</p>
            <strong>Open marketplace →</strong>
          </Link>

          <Link href="/workspace/entity-review/partner-review-network/pricing">
            <span>03</span>
            <h3>Partner Review Network</h3>
            <p>Explore independent review lanes, participation, and review scope.</p>
            <strong>Explore the network →</strong>
          </Link>

          <Link href="/eu-ai-act">
            <span>04</span>
            <h3>EU AI Act Entity Review</h3>
            <p>
              Enter the specialized laboratory when the review question is
              directly connected to EU AI Act roles, duties, or evidence.
            </p>
            <strong>Open specialized route →</strong>
          </Link>
        </div>
      </section>

      <section className="shell final-section">
        <p className="eyebrow">ENTITY REVIEW BOUNDARY</p>
        <h2>Review is not the same as certification.</h2>
        <p>
          The Exchange can preserve declarations, scope, evidence, reviewers,
          findings, disagreement, uncertainty, and outcomes. It does not silently
          create authority that the entity or reviewer does not possess.
        </p>
        <div className="hero-actions final-actions">
          <button
            className="button primary"
            type="button"
            onClick={() => {
              setShowIntake(true);
              document
                .getElementById("intake")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Begin Entity Review
          </button>
          <Link className="button secondary" href="/marketplace/professionals">
            Find a Reviewer
          </Link>
          <Link className="button ghost" href="/">
            Return to Four Doors
          </Link>
        </div>
      </section>

      <footer>
        <Link className="brand" href="/">
          <span>TA-14</span>
          <div>
            <strong>Entity Review</strong>
            <small>TA-14 AI Governance Exchange</small>
          </div>
        </Link>
        <p>
          Reality → Record → Continuity → Admissibility → Binding → Commit →
          Execution → Outcome
        </p>
      </footer>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          scroll-behavior: smooth;
        }

        :global(body) {
          margin: 0;
          color: #f8f6ff;
          background: #06050b;
        }

        :global(a) {
          color: inherit;
          text-decoration: none;
        }

        :global(button),
        :global(input),
        :global(select),
        :global(textarea) {
          font: inherit;
        }

        .entity-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          isolation: isolate;
          background:
            radial-gradient(circle at 8% 5%, rgba(178, 107, 255, 0.15), transparent 28%),
            radial-gradient(circle at 90% 12%, rgba(255, 193, 73, 0.08), transparent 24%),
            linear-gradient(180deg, #080711 0%, #0d0a17 48%, #06050b 100%);
        }

        .entity-page > :not(.ambient) {
          position: relative;
          z-index: 2;
        }

        .ambient {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .star {
          position: absolute;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #fff;
          box-shadow:
            0 0 12px #fff,
            0 0 31px rgba(207, 157, 255, 0.95);
          animation: explode 9s ease-in-out infinite;
        }

        .star-one {
          top: 14%;
          left: 82%;
        }

        .star-two {
          top: 62%;
          left: 9%;
          animation-delay: -3s;
        }

        .star-three {
          top: 80%;
          left: 71%;
          animation-delay: -6s;
        }

        .line {
          position: absolute;
          width: 42vw;
          height: 1px;
          opacity: 0.28;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(205, 160, 255, 0.8),
            transparent
          );
          animation: travel 18s linear infinite;
        }

        .line-one {
          top: 31%;
          left: -50vw;
          transform: rotate(12deg);
        }

        .line-two {
          top: 73%;
          right: -50vw;
          transform: rotate(-15deg);
          animation-delay: -9s;
        }

        .orbit {
          position: absolute;
          width: 620px;
          height: 620px;
          border: 1px solid rgba(207, 157, 255, 0.08);
          border-radius: 50%;
          animation: rotate 49s linear infinite;
        }

        .orbit-one {
          top: 7%;
          left: -300px;
        }

        .orbit-two {
          right: -340px;
          top: 43%;
          width: 760px;
          height: 760px;
          animation-direction: reverse;
          animation-duration: 65s;
        }

        .shell {
          width: min(1420px, calc(100% - 34px));
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
          border-bottom: 1px solid rgba(205, 160, 255, 0.14);
          background: rgba(6, 5, 11, 0.88);
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
          border: 1px solid rgba(224, 188, 255, 0.5);
          border-radius: 11px;
          color: #e2bcff;
          background: rgba(191, 119, 255, 0.08);
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
          color: #8e829b;
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
          border: 1px solid rgba(205, 160, 255, 0.13);
          border-radius: 999px;
          background: rgba(13, 10, 23, 0.72);
        }

        nav a {
          display: inline-flex;
          align-items: center;
          min-height: 38px;
          padding: 0 13px;
          border-radius: 999px;
          color: #b8afc3;
          font-size: 0.78rem;
          font-weight: 850;
        }

        nav a:hover {
          color: #fff;
          background: rgba(205, 160, 255, 0.08);
        }

        nav .top-cta {
          color: #170a20;
          background: #d7a5ff;
        }

        .hero {
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(430px, 0.92fr);
          gap: clamp(45px, 7vw, 100px);
          align-items: center;
          min-height: calc(100vh - 76px);
          padding: 90px 0;
        }

        .eyebrow {
          margin: 0 0 12px;
          color: #d7a5ff;
          font-size: 0.73rem;
          font-weight: 950;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        h1,
        h2,
        h3,
        p {
          margin-top: 0;
        }

        h1 {
          max-width: 920px;
          margin-bottom: 25px;
          font-size: clamp(3.6rem, 7vw, 7.2rem);
          line-height: 0.92;
          letter-spacing: -0.07em;
        }

        h1 span {
          display: block;
          color: #d7a5ff;
        }

        h2 {
          margin-bottom: 18px;
          font-size: clamp(2.25rem, 4.7vw, 4.9rem);
          line-height: 1;
          letter-spacing: -0.054em;
        }

        p {
          color: #aaa1b4;
          line-height: 1.72;
        }

        .lead {
          max-width: 820px;
          font-size: clamp(1.08rem, 1.65vw, 1.34rem);
          color: #d0c6d9;
        }

        .hero-copy > p:not(.eyebrow) {
          max-width: 830px;
        }

        .hero-actions,
        .form-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 11px;
          margin-top: 28px;
        }

        .button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 0 19px;
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
          color: #16091f;
          border-color: #d7a5ff;
          background: #d7a5ff;
        }

        .secondary {
          color: #f5edff;
          border-color: rgba(205, 160, 255, 0.28);
          background: rgba(31, 20, 43, 0.84);
        }

        .ghost {
          color: #bcaec8;
          background: transparent;
        }

        .danger {
          color: #f4a7ac;
        }

        .boundary-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 28px;
        }

        .boundary-row span {
          padding: 7px 10px;
          border: 1px solid rgba(205, 160, 255, 0.16);
          border-radius: 999px;
          color: #a79caf;
          background: rgba(13, 10, 23, 0.64);
          font-size: 0.74rem;
          font-weight: 800;
        }

        .review-map {
          position: relative;
          min-height: 570px;
          border: 1px solid rgba(205, 160, 255, 0.17);
          border-radius: 50%;
          background:
            radial-gradient(circle, rgba(191, 119, 255, 0.11), transparent 48%),
            rgba(11, 8, 19, 0.68);
          box-shadow:
            0 35px 110px rgba(0, 0, 0, 0.42),
            inset 0 0 90px rgba(191, 119, 255, 0.05);
        }

        .map-core {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 3;
          display: grid;
          place-items: center;
          width: 155px;
          height: 155px;
          border: 1px solid rgba(224, 188, 255, 0.55);
          border-radius: 50%;
          color: #e8c9ff;
          background: radial-gradient(
            circle,
            rgba(191, 119, 255, 0.2),
            rgba(11, 8, 19, 0.96) 70%
          );
          box-shadow: 0 0 60px rgba(191, 119, 255, 0.2);
          transform: translate(-50%, -50%);
          animation: corePulse 4.5s ease-in-out infinite;
        }

        .map-core span,
        .map-core strong {
          display: block;
        }

        .map-core span {
          font-size: 1.2rem;
          font-weight: 950;
        }

        .map-core strong {
          margin-top: -34px;
          font-size: 0.65rem;
          letter-spacing: 0.16em;
        }

        .map-node {
          position: absolute;
          z-index: 4;
          width: 150px;
          padding: 12px;
          border: 1px solid rgba(205, 160, 255, 0.22);
          border-radius: 14px;
          background: rgba(13, 10, 23, 0.88);
          box-shadow: 0 14px 40px rgba(0, 0, 0, 0.28);
        }

        .map-node strong,
        .map-node small {
          display: block;
        }

        .map-node strong {
          color: #e4c7fb;
        }

        .map-node small {
          margin-top: 4px;
          color: #84778f;
        }

        .node-1 {
          top: 7%;
          left: 50%;
          transform: translateX(-50%);
        }

        .node-2 {
          top: 23%;
          right: 3%;
        }

        .node-3 {
          right: 5%;
          bottom: 19%;
        }

        .node-4 {
          bottom: 5%;
          left: 50%;
          transform: translateX(-50%);
        }

        .node-5 {
          bottom: 19%;
          left: 5%;
        }

        .node-6 {
          top: 23%;
          left: 3%;
        }

        .map-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          border: 1px solid rgba(205, 160, 255, 0.13);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: rotate 35s linear infinite;
        }

        .ring-one {
          width: 240px;
          height: 240px;
        }

        .ring-two {
          width: 370px;
          height: 370px;
          animation-direction: reverse;
          animation-duration: 48s;
        }

        .ring-three {
          width: 495px;
          height: 495px;
          animation-duration: 62s;
        }

        .section {
          padding: 110px 0;
        }

        .section-heading {
          max-width: 970px;
          margin-bottom: 38px;
        }

        .section-heading > p:last-child {
          max-width: 850px;
          font-size: 1.03rem;
        }

        .centered {
          margin-left: auto;
          margin-right: auto;
          text-align: center;
        }

        .centered > p:last-child {
          margin-left: auto;
          margin-right: auto;
        }

        .type-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 15px;
        }

        .type-card {
          position: relative;
          min-height: 355px;
          padding: 24px;
          border: 1px solid rgba(205, 160, 255, 0.15);
          border-radius: 22px;
          color: inherit;
          text-align: left;
          cursor: pointer;
          background: rgba(13, 10, 23, 0.76);
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.25);
          transition: 0.2s ease;
        }

        .type-card:hover,
        .type-card.selected {
          border-color: rgba(224, 188, 255, 0.52);
          transform: translateY(-4px);
          background:
            radial-gradient(
              circle at 90% 8%,
              rgba(191, 119, 255, 0.12),
              transparent 35%
            ),
            rgba(17, 12, 28, 0.88);
        }

        .selection-mark {
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          margin-bottom: 25px;
          border: 1px solid rgba(205, 160, 255, 0.3);
          border-radius: 50%;
          color: #d7a5ff;
        }

        .type-card h3 {
          font-size: 1.35rem;
        }

        .type-card p {
          font-size: 0.9rem;
        }

        .type-card ul {
          display: grid;
          gap: 7px;
          margin: 20px 0 26px;
          padding: 0;
          list-style: none;
        }

        .type-card li {
          color: #b8adbf;
          font-size: 0.83rem;
        }

        .type-card li::before {
          content: "✓";
          margin-right: 8px;
          color: #d7a5ff;
        }

        .type-card > strong:last-child {
          color: #dec0f4;
          font-size: 0.8rem;
        }

        .process-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .process-grid article,
        .connected-grid a {
          padding: 25px;
          border: 1px solid rgba(205, 160, 255, 0.15);
          border-radius: 21px;
          background: rgba(13, 10, 23, 0.75);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.23);
        }

        .process-grid article {
          min-height: 245px;
        }

        .process-grid article > span,
        .connected-grid a > span {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          margin-bottom: 29px;
          border: 1px solid rgba(205, 160, 255, 0.33);
          border-radius: 11px;
          color: #d7a5ff;
          font-weight: 950;
        }

        .process-grid h3,
        .connected-grid h3 {
          font-size: 1.2rem;
        }

        .process-grid p,
        .connected-grid p {
          margin-bottom: 0;
          font-size: 0.9rem;
        }

        .intake-section {
          padding-top: 90px;
        }

        .intake-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 32px;
        }

        .intake-heading > div {
          max-width: 850px;
        }

        .intake-form {
          padding: clamp(26px, 5vw, 56px);
          border: 1px solid rgba(205, 160, 255, 0.19);
          border-radius: 28px;
          background:
            radial-gradient(
              circle at 90% 0%,
              rgba(191, 119, 255, 0.1),
              transparent 34%
            ),
            rgba(12, 9, 21, 0.9);
          box-shadow: 0 35px 100px rgba(0, 0, 0, 0.34);
        }

        .selected-review {
          margin-bottom: 30px;
          padding: 18px;
          border: 1px solid rgba(205, 160, 255, 0.18);
          border-radius: 16px;
          background: rgba(191, 119, 255, 0.05);
        }

        .selected-review span,
        .selected-review strong {
          display: block;
        }

        .selected-review span {
          color: #8f8199;
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .selected-review strong {
          margin-top: 6px;
          color: #e3c4fa;
          font-size: 1.25rem;
        }

        .selected-review p {
          margin: 7px 0 0;
          font-size: 0.88rem;
        }

        .requested-reviewer {
          margin-top: 18px;
          padding-top: 18px;
          border-top: 1px solid rgba(205, 160, 255, 0.16);
        }

        .requested-reviewer span {
          color: #a894b5;
        }

        .requested-reviewer strong {
          color: #f0d9ff;
          font-size: 1.02rem;
        }

        .requested-reviewer p {
          max-width: 850px;
          color: #9b8fa5;
          font-size: 0.79rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        label {
          display: grid;
          gap: 8px;
        }

        label span {
          color: #cfc3d8;
          font-size: 0.78rem;
          font-weight: 850;
        }

        label.wide {
          grid-column: 1 / -1;
        }

        input,
        select,
        textarea {
          width: 100%;
          border: 1px solid rgba(205, 160, 255, 0.18);
          border-radius: 12px;
          color: #f8f4fb;
          background: rgba(7, 5, 12, 0.82);
          outline: none;
        }

        input,
        select {
          min-height: 48px;
          padding: 0 13px;
        }

        textarea {
          padding: 13px;
          resize: vertical;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: rgba(224, 188, 255, 0.65);
          box-shadow: 0 0 0 3px rgba(191, 119, 255, 0.08);
        }

        .saved-time {
          margin: 17px 0 0;
          color: #8e8198;
          font-size: 0.78rem;
        }

        .notice {
          margin: 12px 0 0;
          padding: 12px 14px;
          border: 1px solid rgba(205, 160, 255, 0.17);
          border-radius: 12px;
          color: #cdbed8;
          background: rgba(191, 119, 255, 0.05);
          font-size: 0.82rem;
        }

        .closed-intake {
          display: grid;
          grid-template-columns: 64px 1fr;
          gap: 18px;
          align-items: center;
          width: 100%;
          padding: 30px;
          border: 1px solid rgba(205, 160, 255, 0.17);
          border-radius: 23px;
          color: inherit;
          text-align: left;
          cursor: pointer;
          background: rgba(13, 10, 23, 0.76);
        }

        .closed-intake > span {
          display: grid;
          place-items: center;
          width: 58px;
          height: 58px;
          border: 1px solid rgba(224, 188, 255, 0.42);
          border-radius: 50%;
          color: #d7a5ff;
          font-size: 1.5rem;
        }

        .closed-intake strong {
          font-size: 1.1rem;
        }

        .closed-intake p {
          margin: 5px 0 0;
        }

        .active-request-banner {
          margin-bottom: 18px;
          padding: 16px 18px;
          border: 1px solid rgba(255, 205, 103, 0.26);
          border-radius: 15px;
          background: rgba(255, 193, 73, 0.06);
        }

        .active-request-banner span,
        .active-request-banner strong {
          display: block;
        }

        .active-request-banner span {
          color: #d8b76e;
          font-size: 0.69rem;
          font-weight: 950;
          letter-spacing: 0.12em;
        }

        .active-request-banner strong {
          margin-top: 5px;
          color: #ffe0a0;
          font-size: 1.02rem;
        }

        .active-request-banner p {
          margin: 5px 0 0;
          font-size: 0.79rem;
        }

        .active-record-link {
          display: inline-flex;
          margin-top: 10px;
          color: #ffe0a0;
          font-size: 0.76rem;
          font-weight: 900;
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        .ready-button {
          color: #0a1712;
          border-color: #8ce8bd;
          background: #8ce8bd;
        }

        .request-library {
          padding-top: 80px;
        }

        .request-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .request-card {
          padding: 24px;
          border: 1px solid rgba(205, 160, 255, 0.16);
          border-radius: 22px;
          background:
            radial-gradient(
              circle at 92% 4%,
              rgba(191, 119, 255, 0.08),
              transparent 31%
            ),
            rgba(13, 10, 23, 0.78);
          box-shadow: 0 25px 75px rgba(0, 0, 0, 0.26);
        }

        .request-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 20px;
        }

        .request-card-top > span:last-child {
          color: #85798f;
          font-size: 0.72rem;
          text-align: right;
        }

        .request-status {
          padding: 6px 9px;
          border: 1px solid rgba(205, 160, 255, 0.18);
          border-radius: 999px;
          color: #bba8c7;
          font-size: 0.67rem;
          font-weight: 950;
          letter-spacing: 0.08em;
        }

        .request-status.ready_for_review {
          color: #99ecc7;
          border-color: rgba(140, 232, 189, 0.35);
          background: rgba(140, 232, 189, 0.06);
        }

        .request-id {
          margin-bottom: 8px;
          color: #d7a5ff;
          font-size: 0.72rem;
          font-weight: 950;
          letter-spacing: 0.08em;
        }

        .request-card h3 {
          margin-bottom: 6px;
          font-size: 1.45rem;
        }

        .request-card > strong {
          display: block;
          margin-bottom: 14px;
          color: #d8c9e3;
          font-size: 0.82rem;
        }

        .request-card dl {
          display: grid;
          gap: 10px;
          margin: 22px 0;
        }

        .request-card dl div {
          display: grid;
          grid-template-columns: 150px 1fr;
          gap: 12px;
          padding-top: 10px;
          border-top: 1px solid rgba(205, 160, 255, 0.1);
        }

        .request-card dt {
          color: #82758d;
          font-size: 0.72rem;
          font-weight: 850;
        }

        .request-card dd {
          margin: 0;
          color: #c5b9ce;
          font-size: 0.8rem;
        }

        .request-boundary {
          padding: 13px;
          border: 1px solid rgba(205, 160, 255, 0.12);
          border-radius: 12px;
          background: rgba(7, 5, 12, 0.55);
          font-size: 0.75rem;
        }

        .request-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 18px;
        }

        .request-actions .button {
          min-height: 42px;
          padding: 0 13px;
          font-size: 0.75rem;
        }

        .empty-request-library {
          padding: 54px;
          border: 1px solid rgba(205, 160, 255, 0.16);
          border-radius: 23px;
          text-align: center;
          background: rgba(13, 10, 23, 0.75);
        }

        .empty-request-library > span {
          color: #d7a5ff;
          font-size: 0.7rem;
          font-weight: 950;
          letter-spacing: 0.14em;
        }

        .empty-request-library h3 {
          margin: 12px 0;
          font-size: 1.6rem;
        }

        .empty-request-library p {
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        .connected-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .connected-grid a {
          min-height: 300px;
          transition: 0.2s ease;
        }

        .connected-grid a:hover {
          border-color: rgba(224, 188, 255, 0.5);
          transform: translateY(-4px);
        }

        .connected-grid a > strong:last-child {
          display: block;
          margin-top: 24px;
          color: #ddbbf7;
          font-size: 0.8rem;
        }

        .final-section {
          padding: 120px 0;
          text-align: center;
        }

        .final-section > p {
          max-width: 860px;
          margin-left: auto;
          margin-right: auto;
        }

        .final-actions {
          justify-content: center;
        }

        footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          width: min(1420px, calc(100% - 34px));
          margin: 0 auto;
          padding: 38px 0;
          border-top: 1px solid rgba(205, 160, 255, 0.13);
        }

        footer p {
          margin: 0;
          color: #71667b;
          font-size: 0.76rem;
          text-align: right;
        }

        @keyframes explode {
          0%,
          83%,
          100% {
            opacity: 0.1;
            transform: scale(0.15);
          }
          87% {
            opacity: 1;
            transform: scale(1.4);
          }
          92% {
            opacity: 0.25;
            transform: scale(7);
          }
        }

        @keyframes travel {
          from {
            transform: translateX(0) rotate(12deg);
          }
          to {
            transform: translateX(170vw) rotate(12deg);
          }
        }

        @keyframes rotate {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes corePulse {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(0.96);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.04);
          }
        }

        @media (max-width: 1100px) {
          .hero {
            grid-template-columns: 1fr;
          }

          .review-map {
            width: min(620px, 100%);
          }

          .type-grid,
          .process-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .active-request-banner {
          margin-bottom: 18px;
          padding: 16px 18px;
          border: 1px solid rgba(255, 205, 103, 0.26);
          border-radius: 15px;
          background: rgba(255, 193, 73, 0.06);
        }

        .active-request-banner span,
        .active-request-banner strong {
          display: block;
        }

        .active-request-banner span {
          color: #d8b76e;
          font-size: 0.69rem;
          font-weight: 950;
          letter-spacing: 0.12em;
        }

        .active-request-banner strong {
          margin-top: 5px;
          color: #ffe0a0;
          font-size: 1.02rem;
        }

        .active-request-banner p {
          margin: 5px 0 0;
          font-size: 0.79rem;
        }

        .active-record-link {
          display: inline-flex;
          margin-top: 10px;
          color: #ffe0a0;
          font-size: 0.76rem;
          font-weight: 900;
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        .ready-button {
          color: #0a1712;
          border-color: #8ce8bd;
          background: #8ce8bd;
        }

        .request-library {
          padding-top: 80px;
        }

        .request-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .request-card {
          padding: 24px;
          border: 1px solid rgba(205, 160, 255, 0.16);
          border-radius: 22px;
          background:
            radial-gradient(
              circle at 92% 4%,
              rgba(191, 119, 255, 0.08),
              transparent 31%
            ),
            rgba(13, 10, 23, 0.78);
          box-shadow: 0 25px 75px rgba(0, 0, 0, 0.26);
        }

        .request-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 20px;
        }

        .request-card-top > span:last-child {
          color: #85798f;
          font-size: 0.72rem;
          text-align: right;
        }

        .request-status {
          padding: 6px 9px;
          border: 1px solid rgba(205, 160, 255, 0.18);
          border-radius: 999px;
          color: #bba8c7;
          font-size: 0.67rem;
          font-weight: 950;
          letter-spacing: 0.08em;
        }

        .request-status.ready_for_review {
          color: #99ecc7;
          border-color: rgba(140, 232, 189, 0.35);
          background: rgba(140, 232, 189, 0.06);
        }

        .request-id {
          margin-bottom: 8px;
          color: #d7a5ff;
          font-size: 0.72rem;
          font-weight: 950;
          letter-spacing: 0.08em;
        }

        .request-card h3 {
          margin-bottom: 6px;
          font-size: 1.45rem;
        }

        .request-card > strong {
          display: block;
          margin-bottom: 14px;
          color: #d8c9e3;
          font-size: 0.82rem;
        }

        .request-card dl {
          display: grid;
          gap: 10px;
          margin: 22px 0;
        }

        .request-card dl div {
          display: grid;
          grid-template-columns: 150px 1fr;
          gap: 12px;
          padding-top: 10px;
          border-top: 1px solid rgba(205, 160, 255, 0.1);
        }

        .request-card dt {
          color: #82758d;
          font-size: 0.72rem;
          font-weight: 850;
        }

        .request-card dd {
          margin: 0;
          color: #c5b9ce;
          font-size: 0.8rem;
        }

        .request-boundary {
          padding: 13px;
          border: 1px solid rgba(205, 160, 255, 0.12);
          border-radius: 12px;
          background: rgba(7, 5, 12, 0.55);
          font-size: 0.75rem;
        }

        .request-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 18px;
        }

        .request-actions .button {
          min-height: 42px;
          padding: 0 13px;
          font-size: 0.75rem;
        }

        .empty-request-library {
          padding: 54px;
          border: 1px solid rgba(205, 160, 255, 0.16);
          border-radius: 23px;
          text-align: center;
          background: rgba(13, 10, 23, 0.75);
        }

        .empty-request-library > span {
          color: #d7a5ff;
          font-size: 0.7rem;
          font-weight: 950;
          letter-spacing: 0.14em;
        }

        .empty-request-library h3 {
          margin: 12px 0;
          font-size: 1.6rem;
        }

        .empty-request-library p {
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        .connected-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 850px) {
          nav {
            display: none;
          }

          .intake-heading {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 650px) {
          .shell {
            width: min(100% - 24px, 1420px);
          }

          .hero,
          .section {
            padding: 75px 0;
          }

          .review-map {
            min-height: 490px;
            border-radius: 28px;
          }

          .map-node {
            width: 125px;
            padding: 9px;
          }

          .node-2,
          .node-3 {
            right: 1%;
          }

          .node-5,
          .node-6 {
            left: 1%;
          }

          .ring-three {
            width: 430px;
            height: 430px;
          }

          .type-grid,
          .process-grid,
          .connected-grid,
          .request-grid,
          .form-grid {
            grid-template-columns: 1fr;
          }

          label.wide {
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

        @media (prefers-reduced-motion: reduce) {
          :global(html) {
            scroll-behavior: auto;
          }

          .star,
          .line,
          .orbit,
          .map-core,
          .map-ring {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}
