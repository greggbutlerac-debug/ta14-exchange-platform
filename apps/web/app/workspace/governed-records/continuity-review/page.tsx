"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ContinuityState = "CONTINUOUS" | "LIMITED" | "HOLD" | "BROKEN";

type TimelineEvent = {
  id: string;
  start: string;
  end: string;
  source: string;
  authority: string;
  standing: "CURRENT" | "LIMITED" | "EXPIRED" | "UNKNOWN";
  reset: boolean;
};

type Finding = {
  code: string;
  title: string;
  location: string;
  effect: string;
  consequence: string;
  severity: "info" | "limited" | "hold" | "broken";
};

const sampleEvents: TimelineEvent[] = [
  {
    id: "EV-001",
    start: "2026-07-20T08:00",
    end: "2026-07-20T10:00",
    source: "AIR-HUB-04",
    authority: "Facilities Operations",
    standing: "CURRENT",
    reset: false,
  },
  {
    id: "EV-002",
    start: "2026-07-20T10:00",
    end: "2026-07-20T12:00",
    source: "AIR-HUB-04",
    authority: "Facilities Operations",
    standing: "CURRENT",
    reset: false,
  },
  {
    id: "EV-003",
    start: "2026-07-20T12:20",
    end: "2026-07-20T14:00",
    source: "AIR-HUB-04",
    authority: "Facilities Operations",
    standing: "CURRENT",
    reset: false,
  },
];

const emptyEvent = (): TimelineEvent => ({
  id: `EV-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
  start: "",
  end: "",
  source: "",
  authority: "",
  standing: "UNKNOWN",
  reset: false,
});

function minutes(value: string): number | null {
  if (!value) return null;
  const date = new Date(value);
  const time = date.getTime();
  return Number.isNaN(time) ? null : Math.round(time / 60000);
}

function evaluate(
  recordId: string,
  recordClass: string,
  declaredSource: string,
  sourceAuthority: string,
  declaredStart: string,
  declaredEnd: string,
  evidenceStanding: string,
  events: TimelineEvent[],
): { state: ContinuityState; findings: Finding[] } {
  const findings: Finding[] = [];

  if (
    !recordId.trim() ||
    !recordClass.trim() ||
    !declaredSource.trim() ||
    !sourceAuthority.trim() ||
    !declaredStart ||
    !declaredEnd ||
    !evidenceStanding.trim()
  ) {
    findings.push({
      code: "CR-HOLD-001",
      title: "Required continuity boundary is missing",
      location: "Record identity and declared boundary",
      effect:
        "The review cannot establish the identity, period, source, authority, or evidence standing needed to test continuity.",
      consequence:
        "The record remains on HOLD until the missing boundary is supplied or formally excepted.",
      severity: "hold",
    });
  }

  const valid = events
    .map((event, index) => ({
      event,
      index,
      start: minutes(event.start),
      end: minutes(event.end),
    }))
    .filter(
      (
        item,
      ): item is {
        event: TimelineEvent;
        index: number;
        start: number;
        end: number;
      } => item.start !== null && item.end !== null,
    );

  if (events.length === 0) {
    findings.push({
      code: "CR-HOLD-002",
      title: "No sequence has been supplied",
      location: "Timeline",
      effect: "No ordered evidence intervals are available for review.",
      consequence:
        "Continuity cannot be evaluated until at least one interval is supplied.",
      severity: "hold",
    });
  }

  valid.forEach(({ event, index, start, end }) => {
    if (end <= start) {
      findings.push({
        code: "CR-BROKEN-001",
        title: "Interval end does not follow interval start",
        location: `${event.id || `Event ${index + 1}`}`,
        effect: "The event order is internally invalid.",
        consequence:
          "This interval cannot support an ordered continuity chain.",
        severity: "broken",
      });
    }

    if (!event.source.trim() || !event.authority.trim()) {
      findings.push({
        code: "CR-HOLD-003",
        title: "Source or authority is unresolved",
        location: `${event.id || `Event ${index + 1}`}`,
        effect:
          "The interval cannot be attributed to a declared source and accountable authority.",
        consequence:
          "The affected interval cannot advance to stronger admissibility review.",
        severity: "hold",
      });
    }

    if (event.standing === "EXPIRED" || event.standing === "UNKNOWN") {
      findings.push({
        code: "CR-HOLD-004",
        title: "Evidence standing is unresolved",
        location: `${event.id || `Event ${index + 1}`}`,
        effect:
          "The interval lacks current calibration or declared evidence standing.",
        consequence:
          "The affected interval remains bounded and cannot support whole-period continuity.",
        severity: "hold",
      });
    }

    if (event.standing === "LIMITED") {
      findings.push({
        code: "CR-LIMITED-001",
        title: "Evidence standing is limited",
        location: `${event.id || `Event ${index + 1}`}`,
        effect:
          "The interval may remain reviewable only within its declared limitation.",
        consequence:
          "Any downstream conclusion must be restricted to the standing that remains.",
        severity: "limited",
      });
    }

    if (event.reset) {
      findings.push({
        code: "CR-BROKEN-002",
        title: "Unexplained reset declared",
        location: `${event.id || `Event ${index + 1}`}`,
        effect:
          "The sequence indicates a reset without an attached continuity explanation.",
        consequence:
          "Whole-period continuity is defeated unless the reset is independently bounded.",
        severity: "broken",
      });
    }
  });

  for (let index = 1; index < valid.length; index += 1) {
    const previous = valid[index - 1];
    const current = valid[index];

    if (current.start < previous.start) {
      findings.push({
        code: "CR-BROKEN-003",
        title: "Out-of-order interval detected",
        location: `${previous.event.id} → ${current.event.id}`,
        effect:
          "The submitted sequence reverses chronological order.",
        consequence:
          "The declared chain cannot support whole-period continuity.",
        severity: "broken",
      });
    }

    if (current.start < previous.end) {
      findings.push({
        code: "CR-BROKEN-004",
        title: "Duplicated or overlapping interval",
        location: `${previous.event.id} / ${current.event.id}`,
        effect:
          "Two intervals claim the same portion of the declared period.",
        consequence:
          "The record cannot establish a single unambiguous sequence for the overlap.",
        severity: "broken",
      });
    }

    if (current.start > previous.end) {
      const gap = current.start - previous.end;
      findings.push({
        code: gap > 60 ? "CR-BROKEN-005" : "CR-LIMITED-002",
        title:
          gap > 60
            ? "Material continuity gap detected"
            : "Bounded continuity gap detected",
        location: `${previous.event.id} → ${current.event.id}`,
        effect: `${gap} minutes are not represented by the submitted sequence.`,
        consequence:
          gap > 60
            ? "Whole-period continuity is defeated across the missing interval."
            : "Review remains possible only outside the missing interval.",
        severity: gap > 60 ? "broken" : "limited",
      });
    }

    if (
      current.event.source.trim() &&
      previous.event.source.trim() &&
      current.event.source !== previous.event.source
    ) {
      findings.push({
        code: "CR-BROKEN-006",
        title: "Source identity changed",
        location: `${previous.event.id} → ${current.event.id}`,
        effect:
          "The evidence source changes without a preserved transfer or binding record.",
        consequence:
          "Source continuity is broken unless the transition is independently established.",
        severity: "broken",
      });
    }

    if (
      current.event.authority.trim() &&
      previous.event.authority.trim() &&
      current.event.authority !== previous.event.authority
    ) {
      findings.push({
        code: "CR-HOLD-005",
        title: "Authority changed without continuity evidence",
        location: `${previous.event.id} → ${current.event.id}`,
        effect:
          "Accountability changes across the route without an attached authority transfer.",
        consequence:
          "The route remains on HOLD at the authority transition.",
        severity: "hold",
      });
    }
  }

  const declaredStartMinutes = minutes(declaredStart);
  const declaredEndMinutes = minutes(declaredEnd);

  if (
    declaredStartMinutes !== null &&
    declaredEndMinutes !== null &&
    valid.length > 0
  ) {
    const first = valid[0];
    const last = valid[valid.length - 1];

    if (declaredEndMinutes <= declaredStartMinutes) {
      findings.push({
        code: "CR-BROKEN-007",
        title: "Declared review period is invalid",
        location: "Declared period",
        effect: "The declared end does not follow the declared start.",
        consequence:
          "The continuity review cannot establish a valid period boundary.",
        severity: "broken",
      });
    }

    if (
      first.start > declaredStartMinutes ||
      last.end < declaredEndMinutes
    ) {
      findings.push({
        code: "CR-LIMITED-003",
        title: "Captured period does not cover the declared period",
        location: "Declared period versus captured sequence",
        effect:
          "The submitted events do not fully occupy the period presented for review.",
        consequence:
          "The review must be restricted to the captured interval only.",
        severity: "limited",
      });
    }
  }

  if (
    declaredSource.trim() &&
    events.some(
      (event) =>
        event.source.trim() && event.source.trim() !== declaredSource.trim(),
    )
  ) {
    findings.push({
      code: "CR-BROKEN-008",
      title: "Timeline source conflicts with declared source",
      location: "Record header versus timeline",
      effect:
        "One or more intervals are attributed to a source different from the declared record source.",
      consequence:
        "The record cannot support a single-source continuity claim.",
      severity: "broken",
    });
  }

  if (findings.some((finding) => finding.severity === "broken")) {
    return { state: "BROKEN", findings };
  }

  if (findings.some((finding) => finding.severity === "hold")) {
    return { state: "HOLD", findings };
  }

  if (findings.some((finding) => finding.severity === "limited")) {
    return { state: "LIMITED", findings };
  }

  return {
    state: "CONTINUOUS",
    findings: [
      {
        code: "CR-CONT-001",
        title: "No material continuity break detected",
        location: "Declared review boundary",
        effect:
          "The submitted sequence remains connected across the supplied source, authority, timing, and evidence-standing fields.",
        consequence:
          "The record may advance to the next bounded review layer. This does not prove the underlying condition acceptable.",
        severity: "info",
      },
    ],
  };
}

export default function ContinuityReviewPage() {
  const [recordId, setRecordId] = useState("AIR-2026-0720-04");
  const [recordClass, setRecordClass] = useState(
    "Atmospheric Integrity Record",
  );
  const [declaredSource, setDeclaredSource] = useState("AIR-HUB-04");
  const [sourceAuthority, setSourceAuthority] = useState(
    "Facilities Operations",
  );
  const [declaredStart, setDeclaredStart] = useState("2026-07-20T08:00");
  const [declaredEnd, setDeclaredEnd] = useState("2026-07-20T14:00");
  const [evidenceStanding, setEvidenceStanding] = useState(
    "Current calibration declaration",
  );
  const [events, setEvents] = useState<TimelineEvent[]>(sampleEvents);
  const [hasRun, setHasRun] = useState(true);

  const result = useMemo(
    () =>
      evaluate(
        recordId,
        recordClass,
        declaredSource,
        sourceAuthority,
        declaredStart,
        declaredEnd,
        evidenceStanding,
        events,
      ),
    [
      recordId,
      recordClass,
      declaredSource,
      sourceAuthority,
      declaredStart,
      declaredEnd,
      evidenceStanding,
      events,
    ],
  );

  const stateCopy: Record<
    ContinuityState,
    { title: string; text: string; next: string }
  > = {
    CONTINUOUS: {
      title: "Continuity retained within the declared boundary",
      text: "No material sequence break was detected in the submitted evidence route.",
      next: "The record may advance to comparison or verification, subject to those separate review boundaries.",
    },
    LIMITED: {
      title: "Continuity is bounded",
      text: "Some intervals retain standing, but the record does not support an unrestricted whole-period conclusion.",
      next: "Restrict downstream use to the intervals that remain connected.",
    },
    HOLD: {
      title: "Required continuity evidence is unresolved",
      text: "A required identity, period, source, authority, or evidence-standing boundary is missing or unresolved.",
      next: "Supply or formally except the missing boundary before advancing.",
    },
    BROKEN: {
      title: "The declared continuity chain is broken",
      text: "Material sequence, source, authority, overlap, reset, or period defects defeat the whole-period continuity claim.",
      next: "Preserve this adverse result and correct the underlying record route without erasing the original finding.",
    },
  };

  const updateEvent = (
    id: string,
    patch: Partial<TimelineEvent>,
  ) => {
    setEvents((current) =>
      current.map((event) =>
        event.id === id ? { ...event, ...patch } : event,
      ),
    );
    setHasRun(false);
  };

  const loadCleanSample = () => {
    setRecordId("AIR-2026-0720-04");
    setRecordClass("Atmospheric Integrity Record");
    setDeclaredSource("AIR-HUB-04");
    setSourceAuthority("Facilities Operations");
    setDeclaredStart("2026-07-20T08:00");
    setDeclaredEnd("2026-07-20T14:00");
    setEvidenceStanding("Current calibration declaration");
    setEvents([
      {
        id: "EV-001",
        start: "2026-07-20T08:00",
        end: "2026-07-20T10:00",
        source: "AIR-HUB-04",
        authority: "Facilities Operations",
        standing: "CURRENT",
        reset: false,
      },
      {
        id: "EV-002",
        start: "2026-07-20T10:00",
        end: "2026-07-20T12:00",
        source: "AIR-HUB-04",
        authority: "Facilities Operations",
        standing: "CURRENT",
        reset: false,
      },
      {
        id: "EV-003",
        start: "2026-07-20T12:00",
        end: "2026-07-20T14:00",
        source: "AIR-HUB-04",
        authority: "Facilities Operations",
        standing: "CURRENT",
        reset: false,
      },
    ]);
    setHasRun(true);
  };

  const loadBrokenSample = () => {
    setRecordId("AIR-2026-0720-04");
    setRecordClass("Atmospheric Integrity Record");
    setDeclaredSource("AIR-HUB-04");
    setSourceAuthority("Facilities Operations");
    setDeclaredStart("2026-07-20T08:00");
    setDeclaredEnd("2026-07-20T14:00");
    setEvidenceStanding("Current calibration declaration");
    setEvents(sampleEvents);
    setHasRun(true);
  };

  return (
    <main className="page-shell">
      <div className="stars stars-one" />
      <div className="stars stars-two" />

      <header className="topbar">
        <Link className="brand" href="/workspace/governed-records">
          <span className="brand-mark">TA-14</span>
          <span>
            <strong>Governed Records</strong>
            <small>Continuity Review</small>
          </span>
        </Link>

        <nav aria-label="Governed Records">
          <Link href="/workspace/governed-records/my-records">My Records</Link>
          <Link
            className="active"
            href="/workspace/governed-records/continuity-review"
          >
            Continuity Review
          </Link>
          <Link href="/workspace/governed-records/comparison">
            Record Comparison
          </Link>
          <Link href="/workspace/governed-records/verification">
            Verification
          </Link>
        </nav>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">RECORD → CONTINUITY</p>
          <h1>Determine whether the evidence remains connected.</h1>
          <p className="hero-copy">
            Review ordered intervals, source identity, authority, evidence
            standing, resets, overlaps, and gaps without rewriting the original
            record or converting continuity into diagnosis.
          </p>
        </div>

        <div className={`state-card state-${result.state.toLowerCase()}`}>
          <span>Current determination</span>
          <strong>{hasRun ? result.state : "NOT RUN"}</strong>
          <p>
            {hasRun
              ? stateCopy[result.state].text
              : "The record changed. Run the review to refresh the determination."}
          </p>
        </div>
      </section>

      <section className="canon-strip">
        <span>Reality</span>
        <b>→</b>
        <span>Record</span>
        <b>→</b>
        <strong>Continuity</strong>
        <b>→</b>
        <span>Admissibility</span>
        <b>→</b>
        <span>Binding</span>
        <b>→</b>
        <span>Commit</span>
        <b>→</b>
        <span>Execution</span>
        <b>→</b>
        <span>Outcome</span>
      </section>

      <section className="workspace-grid">
        <div className="panel source-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">PRESERVED SOURCE BOUNDARY</p>
              <h2>Record identity</h2>
            </div>
            <span className="badge">Source not altered</span>
          </div>

          <div className="field-grid">
            <label>
              <span>Record identity</span>
              <input
                value={recordId}
                onChange={(event) => {
                  setRecordId(event.target.value);
                  setHasRun(false);
                }}
              />
            </label>

            <label>
              <span>Record class</span>
              <input
                value={recordClass}
                onChange={(event) => {
                  setRecordClass(event.target.value);
                  setHasRun(false);
                }}
              />
            </label>

            <label>
              <span>Declared source</span>
              <input
                value={declaredSource}
                onChange={(event) => {
                  setDeclaredSource(event.target.value);
                  setHasRun(false);
                }}
              />
            </label>

            <label>
              <span>Source authority</span>
              <input
                value={sourceAuthority}
                onChange={(event) => {
                  setSourceAuthority(event.target.value);
                  setHasRun(false);
                }}
              />
            </label>

            <label>
              <span>Declared start</span>
              <input
                type="datetime-local"
                value={declaredStart}
                onChange={(event) => {
                  setDeclaredStart(event.target.value);
                  setHasRun(false);
                }}
              />
            </label>

            <label>
              <span>Declared end</span>
              <input
                type="datetime-local"
                value={declaredEnd}
                onChange={(event) => {
                  setDeclaredEnd(event.target.value);
                  setHasRun(false);
                }}
              />
            </label>

            <label className="wide">
              <span>Calibration or evidence standing</span>
              <input
                value={evidenceStanding}
                onChange={(event) => {
                  setEvidenceStanding(event.target.value);
                  setHasRun(false);
                }}
              />
            </label>
          </div>
        </div>

        <aside className="panel boundary-panel">
          <p className="eyebrow">SEPARATION RULE</p>
          <h2>This review does not diagnose.</h2>
          <p>
            Continuity review tests whether evidence remains connected across
            the declared route. It does not determine whether the underlying
            environment, system, person, organization, or outcome is safe,
            healthy, compliant, correct, or optimized.
          </p>
          <div className="boundary-list">
            <span>Original record</span>
            <strong>Preserved</strong>
            <span>Continuity artifact</span>
            <strong>Generated separately</strong>
            <span>Diagnosis</span>
            <strong>Not performed</strong>
            <span>Optimization</span>
            <strong>Not performed</strong>
          </div>
        </aside>
      </section>

      <section className="panel timeline-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">ORDERED EVIDENCE ROUTE</p>
            <h2>Timeline intervals</h2>
          </div>

          <div className="button-row">
            <button type="button" onClick={loadCleanSample}>
              Load continuous sample
            </button>
            <button type="button" onClick={loadBrokenSample}>
              Load gap sample
            </button>
            <button
              className="primary"
              type="button"
              onClick={() => setHasRun(true)}
            >
              Run continuity review
            </button>
          </div>
        </div>

        <div className="timeline-table">
          <div className="timeline-head">
            <span>Event</span>
            <span>Start</span>
            <span>End</span>
            <span>Source</span>
            <span>Authority</span>
            <span>Standing</span>
            <span>Reset</span>
            <span />
          </div>

          {events.map((event) => (
            <div className="timeline-row" key={event.id}>
              <input
                aria-label="Event identity"
                value={event.id}
                onChange={(change) =>
                  updateEvent(event.id, { id: change.target.value })
                }
              />
              <input
                aria-label="Interval start"
                type="datetime-local"
                value={event.start}
                onChange={(change) =>
                  updateEvent(event.id, { start: change.target.value })
                }
              />
              <input
                aria-label="Interval end"
                type="datetime-local"
                value={event.end}
                onChange={(change) =>
                  updateEvent(event.id, { end: change.target.value })
                }
              />
              <input
                aria-label="Source"
                value={event.source}
                onChange={(change) =>
                  updateEvent(event.id, { source: change.target.value })
                }
              />
              <input
                aria-label="Authority"
                value={event.authority}
                onChange={(change) =>
                  updateEvent(event.id, { authority: change.target.value })
                }
              />
              <select
                aria-label="Evidence standing"
                value={event.standing}
                onChange={(change) =>
                  updateEvent(event.id, {
                    standing: change.target
                      .value as TimelineEvent["standing"],
                  })
                }
              >
                <option value="CURRENT">Current</option>
                <option value="LIMITED">Limited</option>
                <option value="EXPIRED">Expired</option>
                <option value="UNKNOWN">Unknown</option>
              </select>
              <label className="reset-check">
                <input
                  type="checkbox"
                  checked={event.reset}
                  onChange={(change) =>
                    updateEvent(event.id, { reset: change.target.checked })
                  }
                />
                <span>Reset</span>
              </label>
              <button
                className="icon-button"
                type="button"
                aria-label={`Remove ${event.id}`}
                onClick={() => {
                  setEvents((current) =>
                    current.filter((item) => item.id !== event.id),
                  );
                  setHasRun(false);
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button
          className="add-button"
          type="button"
          onClick={() => {
            setEvents((current) => [...current, emptyEvent()]);
            setHasRun(false);
          }}
        >
          + Add interval
        </button>
      </section>

      <section className="result-grid">
        <div className={`panel determination state-${result.state.toLowerCase()}`}>
          <div className="panel-heading">
            <div>
              <p className="eyebrow">CONTINUITY DETERMINATION</p>
              <h2>{hasRun ? result.state : "NOT RUN"}</h2>
            </div>
            <span className="determination-chip">
              {hasRun ? result.findings.length : 0} finding
              {hasRun && result.findings.length === 1 ? "" : "s"}
            </span>
          </div>

          <h3>
            {hasRun
              ? stateCopy[result.state].title
              : "The submitted route has changed"}
          </h3>
          <p>
            {hasRun
              ? stateCopy[result.state].next
              : "Run the continuity review to generate a fresh bounded determination."}
          </p>
        </div>

        <div className="panel proof-panel">
          <p className="eyebrow">BOUNDARY OF PROOF</p>
          <div>
            <h3>What this review can prove</h3>
            <p>
              Whether the submitted sequence remains connected across its
              declared identity, timing, source, authority, and evidence
              standing.
            </p>
          </div>
          <div>
            <h3>What this review does not prove</h3>
            <p>
              Safety, health, compliance, correctness, diagnosis, causation,
              optimization, or that the underlying real-world condition was
              acceptable.
            </p>
          </div>
        </div>
      </section>

      <section className="panel findings-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">EVIDENCE-BOUND FINDINGS</p>
            <h2>Why the route received this determination</h2>
          </div>
        </div>

        <div className="findings-list">
          {(hasRun ? result.findings : []).map((finding) => (
            <article
              className={`finding finding-${finding.severity}`}
              key={`${finding.code}-${finding.location}`}
            >
              <div className="finding-code">{finding.code}</div>
              <div>
                <h3>{finding.title}</h3>
                <dl>
                  <div>
                    <dt>Evidence location</dt>
                    <dd>{finding.location}</dd>
                  </div>
                  <div>
                    <dt>Effect on continuity</dt>
                    <dd>{finding.effect}</dd>
                  </div>
                  <div>
                    <dt>Bounded consequence</dt>
                    <dd>{finding.consequence}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}

          {!hasRun ? (
            <div className="empty-state">
              The timeline changed. Run the review to generate a new continuity
              artifact.
            </div>
          ) : null}
        </div>
      </section>

      <section className="next-panel">
        <div>
          <p className="eyebrow">NEXT ADMISSIBLE STEP</p>
          <h2>Continue without collapsing the review layers.</h2>
          <p>
            Comparison and verification remain separate activities. Opening
            either page does not upgrade this determination or erase an adverse
            finding.
          </p>
        </div>

        <div className="next-actions">
          <Link href="/workspace/governed-records/comparison">
            <span>Compare two records</span>
            <strong>Open Record Comparison →</strong>
          </Link>
          <Link href="/workspace/governed-records/verification">
            <span>Inspect verification standing</span>
            <strong>Open Verification →</strong>
          </Link>
        </div>
      </section>

      <footer>
        <strong>No admissible evidence. No admissible execution.</strong>
        <span>
          The record, continuity review, interpretation, diagnosis, and
          optimization remain distinct artifacts.
        </span>
      </footer>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          background: #04100f;
        }

        :global(body) {
          margin: 0;
          background: #04100f;
          color: #eef8f4;
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        :global(a) {
          color: inherit;
          text-decoration: none;
        }

        button,
        input,
        select {
          font: inherit;
        }

        .page-shell {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          padding: 0 28px 48px;
          background:
            radial-gradient(circle at 12% 6%, rgba(37, 190, 152, 0.13), transparent 28%),
            radial-gradient(circle at 84% 18%, rgba(194, 151, 67, 0.12), transparent 24%),
            linear-gradient(180deg, #061513 0%, #03100f 48%, #020b0b 100%);
          isolation: isolate;
        }

        .stars {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: -1;
          opacity: 0.42;
          background-image:
            radial-gradient(circle, rgba(255, 255, 255, 0.8) 1px, transparent 1px),
            radial-gradient(circle, rgba(120, 255, 219, 0.58) 1px, transparent 1px);
          background-size: 86px 86px, 137px 137px;
          background-position: 0 0, 21px 39px;
        }

        .stars-two {
          opacity: 0.18;
          transform: scale(1.2);
        }

        .topbar {
          width: min(1500px, 100%);
          margin: 0 auto;
          min-height: 82px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          border-bottom: 1px solid rgba(153, 213, 196, 0.15);
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }

        .brand-mark {
          display: grid;
          place-items: center;
          width: 48px;
          height: 48px;
          border-radius: 16px;
          border: 1px solid rgba(213, 181, 102, 0.65);
          color: #f2d694;
          background: linear-gradient(145deg, rgba(211, 170, 75, 0.18), rgba(18, 52, 45, 0.92));
          box-shadow: inset 0 0 24px rgba(247, 211, 127, 0.08);
          font-weight: 900;
          font-size: 13px;
        }

        .brand > span:last-child {
          display: grid;
          gap: 3px;
        }

        .brand strong {
          font-size: 14px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .brand small {
          color: #8eaaa2;
        }

        nav {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        nav a {
          padding: 10px 12px;
          border-radius: 999px;
          color: #91aaa3;
          font-size: 13px;
          transition: 160ms ease;
        }

        nav a:hover,
        nav a:focus-visible,
        nav a.active {
          color: #f7fffc;
          background: rgba(34, 128, 105, 0.18);
          outline: none;
        }

        .hero {
          width: min(1500px, 100%);
          margin: 0 auto;
          padding: 78px 0 34px;
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(290px, 0.6fr);
          gap: 36px;
          align-items: end;
        }

        .eyebrow {
          margin: 0 0 10px;
          color: #73d9bd;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.16em;
        }

        h1 {
          max-width: 900px;
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(42px, 6vw, 82px);
          line-height: 0.98;
          letter-spacing: -0.045em;
        }

        .hero-copy {
          max-width: 820px;
          margin: 24px 0 0;
          color: #a8beb8;
          font-size: 18px;
          line-height: 1.75;
        }

        .state-card,
        .panel,
        .next-panel {
          border: 1px solid rgba(135, 191, 176, 0.16);
          background: linear-gradient(180deg, rgba(10, 33, 29, 0.92), rgba(5, 20, 18, 0.92));
          box-shadow: 0 18px 70px rgba(0, 0, 0, 0.22);
          backdrop-filter: blur(16px);
        }

        .state-card {
          padding: 24px;
          border-radius: 24px;
        }

        .state-card span {
          display: block;
          color: #809b94;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .state-card strong {
          display: block;
          margin: 8px 0;
          font-size: 30px;
        }

        .state-card p {
          margin: 0;
          color: #b4c8c2;
          line-height: 1.6;
        }

        .state-continuous {
          border-color: rgba(82, 223, 164, 0.45);
        }

        .state-limited {
          border-color: rgba(230, 189, 93, 0.45);
        }

        .state-hold {
          border-color: rgba(240, 167, 75, 0.48);
        }

        .state-broken {
          border-color: rgba(241, 102, 102, 0.52);
        }

        .canon-strip {
          width: min(1500px, 100%);
          margin: 0 auto 28px;
          display: flex;
          gap: 12px;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          padding: 14px 20px;
          border-radius: 18px;
          border: 1px solid rgba(116, 186, 166, 0.14);
          background: rgba(4, 18, 16, 0.72);
          color: #738e87;
          font-size: 13px;
        }

        .canon-strip strong {
          color: #e8c976;
        }

        .canon-strip b {
          color: #43665d;
        }

        .workspace-grid,
        .result-grid {
          width: min(1500px, 100%);
          margin: 0 auto 24px;
          display: grid;
          grid-template-columns: minmax(0, 1.45fr) minmax(300px, 0.55fr);
          gap: 24px;
        }

        .panel {
          border-radius: 24px;
          padding: 28px;
        }

        .panel-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 24px;
        }

        h2,
        h3,
        p {
          margin-top: 0;
        }

        h2 {
          margin-bottom: 0;
          font-size: 28px;
        }

        h3 {
          line-height: 1.35;
        }

        .badge,
        .determination-chip {
          padding: 8px 11px;
          border-radius: 999px;
          background: rgba(80, 187, 156, 0.12);
          border: 1px solid rgba(80, 187, 156, 0.22);
          color: #9ce0ce;
          font-size: 12px;
          white-space: nowrap;
        }

        .field-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        label {
          display: grid;
          gap: 8px;
        }

        label > span {
          color: #9bb1ab;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .wide {
          grid-column: 1 / -1;
        }

        input,
        select {
          width: 100%;
          min-width: 0;
          border: 1px solid rgba(133, 184, 170, 0.16);
          border-radius: 13px;
          padding: 12px 13px;
          color: #f4fffc;
          background: rgba(3, 16, 14, 0.82);
          outline: none;
        }

        input:focus,
        select:focus {
          border-color: rgba(100, 226, 192, 0.58);
          box-shadow: 0 0 0 3px rgba(55, 185, 149, 0.1);
        }

        .boundary-panel p {
          color: #a9bdb7;
          line-height: 1.7;
        }

        .boundary-list {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 12px 18px;
          margin-top: 24px;
          padding-top: 22px;
          border-top: 1px solid rgba(140, 184, 172, 0.14);
        }

        .boundary-list span {
          color: #7f9a93;
        }

        .boundary-list strong {
          color: #dcebe7;
          text-align: right;
        }

        .timeline-panel,
        .findings-panel {
          width: min(1500px, 100%);
          margin: 0 auto 24px;
        }

        .button-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        button,
        .next-actions a {
          border: 1px solid rgba(134, 186, 172, 0.18);
          border-radius: 12px;
          padding: 11px 14px;
          color: #dbeae6;
          background: rgba(7, 27, 24, 0.9);
          cursor: pointer;
          transition: 160ms ease;
        }

        button:hover,
        button:focus-visible,
        .next-actions a:hover,
        .next-actions a:focus-visible {
          border-color: rgba(105, 221, 190, 0.5);
          transform: translateY(-1px);
          outline: none;
        }

        button.primary {
          color: #042019;
          background: linear-gradient(135deg, #7ce5c6, #d9bd6a);
          border-color: transparent;
          font-weight: 800;
        }

        .timeline-table {
          overflow-x: auto;
        }

        .timeline-head,
        .timeline-row {
          display: grid;
          grid-template-columns:
            110px minmax(180px, 1fr) minmax(180px, 1fr)
            minmax(140px, 0.8fr) minmax(170px, 1fr) 130px 80px 44px;
          gap: 10px;
          align-items: center;
          min-width: 1180px;
        }

        .timeline-head {
          padding: 0 4px 10px;
          color: #6f8c84;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .timeline-row {
          padding: 12px 0;
          border-top: 1px solid rgba(136, 183, 171, 0.1);
        }

        .reset-check {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .reset-check input {
          width: auto;
        }

        .icon-button {
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          padding: 0;
          color: #f29a9a;
          font-size: 22px;
        }

        .add-button {
          margin-top: 18px;
        }

        .determination h2 {
          font-size: 38px;
          letter-spacing: 0.04em;
        }

        .determination > p,
        .proof-panel p {
          color: #a8bdb7;
          line-height: 1.7;
        }

        .proof-panel {
          display: grid;
          gap: 16px;
        }

        .proof-panel > div {
          padding: 18px;
          border-radius: 16px;
          background: rgba(3, 15, 13, 0.62);
          border: 1px solid rgba(131, 185, 171, 0.12);
        }

        .proof-panel h3 {
          margin-bottom: 8px;
        }

        .proof-panel p {
          margin-bottom: 0;
        }

        .findings-list {
          display: grid;
          gap: 14px;
        }

        .finding {
          display: grid;
          grid-template-columns: 132px minmax(0, 1fr);
          gap: 20px;
          padding: 20px;
          border-radius: 18px;
          border: 1px solid rgba(133, 184, 170, 0.14);
          background: rgba(3, 16, 14, 0.62);
        }

        .finding-limited {
          border-color: rgba(223, 186, 88, 0.3);
        }

        .finding-hold {
          border-color: rgba(238, 157, 65, 0.34);
        }

        .finding-broken {
          border-color: rgba(241, 99, 99, 0.38);
        }

        .finding-code {
          align-self: start;
          padding: 8px 10px;
          border-radius: 10px;
          color: #82d9c1;
          background: rgba(76, 180, 151, 0.11);
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 12px;
        }

        .finding h3 {
          margin-bottom: 15px;
        }

        dl {
          margin: 0;
          display: grid;
          gap: 12px;
        }

        dl > div {
          display: grid;
          grid-template-columns: 170px minmax(0, 1fr);
          gap: 18px;
        }

        dt {
          color: #6f8c84;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        dd {
          margin: 0;
          color: #b7c9c4;
          line-height: 1.6;
        }

        .empty-state {
          padding: 26px;
          border-radius: 16px;
          border: 1px dashed rgba(137, 187, 173, 0.2);
          color: #8ea59f;
          text-align: center;
        }

        .next-panel {
          width: min(1500px, 100%);
          margin: 0 auto;
          border-radius: 26px;
          padding: 28px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(360px, 0.8fr);
          gap: 30px;
          align-items: center;
        }

        .next-panel p {
          color: #a7bbb5;
          line-height: 1.7;
          margin-bottom: 0;
        }

        .next-actions {
          display: grid;
          gap: 12px;
        }

        .next-actions a {
          display: grid;
          gap: 6px;
          padding: 16px 18px;
        }

        .next-actions span {
          color: #809991;
          font-size: 12px;
        }

        .next-actions strong {
          color: #edf8f4;
        }

        footer {
          width: min(1500px, 100%);
          margin: 34px auto 0;
          padding: 22px 0 0;
          display: flex;
          gap: 16px;
          justify-content: space-between;
          color: #6f8881;
          border-top: 1px solid rgba(136, 184, 171, 0.12);
          font-size: 12px;
        }

        footer strong {
          color: #c9aa59;
        }

        @media (max-width: 1050px) {
          .hero,
          .workspace-grid,
          .result-grid,
          .next-panel {
            grid-template-columns: 1fr;
          }

          nav {
            display: none;
          }
        }

        @media (max-width: 720px) {
          .page-shell {
            padding-inline: 16px;
          }

          .topbar {
            min-height: 72px;
          }

          .hero {
            padding-top: 54px;
          }

          .panel {
            padding: 21px;
          }

          .field-grid {
            grid-template-columns: 1fr;
          }

          .wide {
            grid-column: auto;
          }

          .panel-heading {
            display: grid;
          }

          .button-row {
            justify-content: flex-start;
          }

          .finding {
            grid-template-columns: 1fr;
          }

          dl > div {
            grid-template-columns: 1fr;
            gap: 5px;
          }

          footer {
            display: grid;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            transition: none !important;
          }

          .stars {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}
