"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Answer = "yes" | "no" | "unknown" | "";

type Practice = {
  id: string;
  code: string;
  title: string;
  article: string;
  summary: string;
  legalConditions: string[];
  evidence: string[];
  boundaries: string[];
};

const practices: Practice[] = [
  {
    id: "manipulation",
    code: "A",
    title: "Harmful manipulation or deception",
    article: "Article 5(1)(a)",
    summary:
      "AI using subliminal, purposefully manipulative, or deceptive techniques that materially distort behaviour by appreciably impairing informed decision-making and cause—or are reasonably likely to cause—significant harm.",
    legalConditions: [
      "An AI system is placed on the market, put into service, or used.",
      "It uses subliminal techniques beyond consciousness or purposefully manipulative or deceptive techniques.",
      "The objective or effect is material distortion of behaviour.",
      "The person’s or group’s ability to make an informed decision is appreciably impaired.",
      "A decision is taken that would not otherwise have been taken.",
      "Significant harm occurs or is reasonably likely.",
    ],
    evidence: [
      "Interaction and interface design",
      "Behavioural targeting logic",
      "Prompts, nudges, sequencing, and defaults",
      "Intended and observed effects",
      "Affected-person testing",
      "Harm analysis and incident history",
    ],
    boundaries: [
      "Persuasion or personalisation is not automatically prohibited.",
      "The complete legal conditions must be assessed together.",
      "The design claim and actual operating effect must remain distinguishable.",
    ],
  },
  {
    id: "vulnerability",
    code: "B",
    title: "Exploitation of vulnerabilities",
    article: "Article 5(1)(b)",
    summary:
      "AI exploiting vulnerabilities due to age, disability, or a specific social or economic situation to materially distort behaviour in a way that causes—or is reasonably likely to cause—significant harm.",
    legalConditions: [
      "A natural person or specific group has a relevant vulnerability.",
      "The vulnerability arises from age, disability, or a specific social or economic situation.",
      "The AI system exploits that vulnerability.",
      "The objective or effect is material distortion of behaviour.",
      "Significant harm occurs or is reasonably likely to a person.",
    ],
    evidence: [
      "Target-population definition",
      "Segmentation and eligibility logic",
      "Age, disability, social, or economic variables",
      "Design intent and optimisation objectives",
      "Behavioural and harm testing",
      "Safeguards, exclusions, and complaints",
    ],
    boundaries: [
      "The presence of a vulnerable population alone does not establish exploitation.",
      "The route must preserve how the system uses or acts upon the vulnerability.",
      "Significant-harm analysis cannot be replaced by a general fairness statement.",
    ],
  },
  {
    id: "social-scoring",
    code: "C",
    title: "Social scoring",
    article: "Article 5(1)(c)",
    summary:
      "AI evaluating or classifying people or groups over time based on social behaviour or known, inferred, or predicted personal or personality characteristics, where the score leads to specified detrimental or unfavourable treatment.",
    legalConditions: [
      "People or groups are evaluated or classified over time.",
      "The basis includes social behaviour or known, inferred, or predicted personal or personality characteristics.",
      "The resulting score leads to detrimental or unfavourable treatment.",
      "The treatment occurs in unrelated social contexts, or is unjustified or disproportionate to the behaviour or its gravity.",
    ],
    evidence: [
      "Scoring factors and inferred traits",
      "Data sources and time horizon",
      "Contexts in which data originates",
      "Contexts in which the score is used",
      "Treatment, eligibility, ranking, or penalty effects",
      "Justification and proportionality analysis",
    ],
    boundaries: [
      "Not every score or risk rating is social scoring.",
      "Cross-context use, unjustified treatment, and disproportionality are central questions.",
      "Commercial labels must not conceal a functional social score.",
    ],
  },
  {
    id: "criminal-risk",
    code: "D",
    title: "Individual criminal-risk prediction",
    article: "Article 5(1)(d)",
    summary:
      "AI assessing or predicting the risk that a natural person will commit a criminal offence when based solely on profiling or assessment of personality traits and characteristics.",
    legalConditions: [
      "The subject is a natural person.",
      "The output assesses or predicts the risk of committing a criminal offence.",
      "The assessment is based solely on profiling or personality traits and characteristics.",
      "The route is not merely supporting a human assessment already grounded in objective and verifiable facts directly linked to criminal activity.",
    ],
    evidence: [
      "Decision purpose and user",
      "Input variables and feature lineage",
      "Profiling and personality inferences",
      "Objective and verifiable criminal-activity facts",
      "Human assessment chronology",
      "Output use and consequence",
    ],
    boundaries: [
      "The narrow support boundary must be evidenced, not asserted.",
      "A nominal human-in-the-loop does not prove an independent human assessment.",
      "The chronology must show whether objective facts preceded the AI-supported assessment.",
    ],
  },
  {
    id: "facial-scraping",
    code: "E",
    title: "Untargeted facial-image scraping",
    article: "Article 5(1)(e)",
    summary:
      "AI systems creating or expanding facial-recognition databases through untargeted scraping of facial images from the internet or CCTV footage.",
    legalConditions: [
      "The system creates or expands a facial-recognition database.",
      "Facial images are scraped from the internet or CCTV footage.",
      "The scraping is untargeted.",
    ],
    evidence: [
      "Collection architecture and crawler rules",
      "Image sources and acquisition terms",
      "Targeting criteria",
      "Database purpose and matching function",
      "Dataset expansion history",
      "Deletion, exclusion, and provenance records",
    ],
    boundaries: [
      "Dataset labels do not establish whether collection was targeted.",
      "The source, method, scope, and purpose of collection must be preserved.",
      "Other data-protection and biometric laws may apply even where this prohibition is not established.",
    ],
  },
  {
    id: "emotion",
    code: "F",
    title: "Emotion inference in workplaces and education",
    article: "Article 5(1)(f)",
    summary:
      "AI systems inferring emotions of natural persons in workplace and education-institution contexts, except where use is intended for medical or safety reasons.",
    legalConditions: [
      "The system infers emotions of natural persons.",
      "The use occurs in a workplace or education institution.",
      "The claimed use is not within the medical-or-safety exception.",
    ],
    evidence: [
      "System classification and claimed capability",
      "Signals used to infer emotion",
      "Deployment location and context",
      "Intended and actual purpose",
      "Medical or safety exception analysis",
      "Outputs, interventions, and affected-person notice",
    ],
    boundaries: [
      "Attention, fatigue, stress, sentiment, and emotion labels require functional analysis.",
      "The exception is purpose-bound and must not be assumed from a general safety claim.",
      "Article 50 notice duties may remain relevant where an allowed system is deployed.",
    ],
  },
  {
    id: "biometric-categorisation",
    code: "G",
    title: "Sensitive biometric categorisation",
    article: "Article 5(1)(g)",
    summary:
      "Biometric-categorisation systems categorising natural persons individually based on biometric data to deduce or infer specified sensitive characteristics.",
    legalConditions: [
      "Natural persons are individually categorised.",
      "Biometric data is used.",
      "The system deduces or infers race, political opinions, trade-union membership, religious or philosophical beliefs, sex life, or sexual orientation.",
      "The route is not limited to lawful labelling or filtering of lawfully acquired biometric datasets, or biometric-data categorisation in law enforcement within the stated boundary.",
    ],
    evidence: [
      "Biometric modality and processing pipeline",
      "Categories, labels, and inferred attributes",
      "Individual-level output design",
      "Dataset acquisition and lawful-purpose record",
      "Law-enforcement context where claimed",
      "Downstream decisions and disclosures",
    ],
    boundaries: [
      "The exact attribute inferred matters.",
      "Dataset labelling and individual categorisation must remain distinguishable.",
      "Data-protection, equality, and sector rules may independently constrain the activity.",
    ],
  },
  {
    id: "remote-biometric",
    code: "H",
    title: "Real-time remote biometric identification",
    article: "Article 5(1)(h) and Article 5(2)–(7)",
    summary:
      "Real-time remote biometric identification in publicly accessible spaces for law-enforcement purposes is prohibited except for narrowly defined objectives and subject to necessity, proportionality, safeguards, authorisation, and notification conditions.",
    legalConditions: [
      "The identification is remote and real-time.",
      "It occurs in a publicly accessible space.",
      "It is used for law-enforcement purposes.",
      "A permitted objective is specifically established.",
      "Use is strictly necessary and proportionate.",
      "Temporal, geographic, and personal limits are defined.",
      "Prior authorisation or the applicable urgent procedure is satisfied.",
      "Required notifications, assessments, and national-law conditions are satisfied.",
    ],
    evidence: [
      "System modality and real-time function",
      "Publicly accessible location",
      "Law-enforcement authority and objective",
      "Target-person or threat record",
      "Necessity and proportionality assessment",
      "Temporal, geographic, and personal limits",
      "Judicial or independent administrative authorisation",
      "Urgency, notification, deletion, and outcome records",
    ],
    boundaries: [
      "The exception is not a general law-enforcement permission.",
      "No decision producing an adverse legal effect may be based solely on the system output.",
      "Member State law may impose narrower conditions or prohibit use.",
      "This pathway requires competent legal and authority review.",
    ],
  },
];

const initialAnswers: Record<string, Answer> = Object.fromEntries(
  practices.map((practice) => [practice.id, ""]),
);

export default function EuAiActProhibitedPracticesPage() {
  const [answers, setAnswers] =
    useState<Record<string, Answer>>(initialAnswers);
  const [activePractice, setActivePractice] = useState(0);

  const selected = practices[activePractice];
  const yesCount = Object.values(answers).filter((answer) => answer === "yes").length;
  const unknownCount = Object.values(answers).filter(
    (answer) => answer === "unknown" || answer === "",
  ).length;

  const determination = useMemo(() => {
    if (yesCount > 0) {
      return {
        status: "DENY / ESCALATE",
        title: "One or more possible prohibited-practice signals are present.",
        tone: "red",
        text:
          "The current declarations identify at least one Article 5 pathway that must be resolved before the activity proceeds. This is a screening signal, not a final legal determination.",
      };
    }

    if (unknownCount > 0) {
      return {
        status: "HOLD",
        title: "The prohibited-practice screen is incomplete.",
        tone: "amber",
        text:
          "One or more categories remain unanswered or unresolved. Preserve the evidence gap rather than claiming that Article 5 does not apply.",
      };
    }

    return {
      status: "REVIEW",
      title: "No prohibited-practice signal is established by the present answers.",
      tone: "green",
      text:
        "This does not certify legality or non-applicability. The answers, evidence, exceptions, material changes, and other legal frameworks still require preservation and review.",
    };
  }, [unknownCount, yesCount]);

  const setAnswer = (id: string, answer: Answer) => {
    setAnswers((current) => ({ ...current, [id]: answer }));

    const index = practices.findIndex((practice) => practice.id === id);
    if (index >= 0 && index < practices.length - 1) {
      setActivePractice(index + 1);
    }
  };

  const reset = () => {
    setAnswers(initialAnswers);
    setActivePractice(0);
  };

  return (
    <main>
      <div className="cosmos" aria-hidden="true">
        <div className="stars starsOne" />
        <div className="stars starsTwo" />
        <div className="beam beamOne" />
        <div className="beam beamTwo" />
        <div className="orbit orbitOne"><i /></div>
        <div className="orbit orbitTwo"><i /></div>
      </div>

      <header className="topbar shell">
        <Link href="/eu-ai-act" className="brand">
          <span className="brandMark">TA-14</span>
          <span>
            <strong>EU AI Act Prohibited Practices</strong>
            <small>No admissible evidence. No admissible execution.</small>
          </span>
        </Link>

        <nav>
          <Link href="/">Exchange</Link>
          <Link href="/workspace">Workspace</Link>
          <Link className="active" href="/eu-ai-act">EU AI Act</Link>
          <Link href="/workspace/governed-records">Records</Link>
          <Link href="/workspace/entity-review">Review</Link>
        </nav>

        <Link className="headerButton" href="/eu-ai-act/requirements/risk-classification">
          Risk Classification <span>→</span>
        </Link>
      </header>

      <div className="breadcrumbs shell">
        <Link href="/eu-ai-act">EU AI Act</Link>
        <span>/</span>
        <span>Requirements</span>
        <span>/</span>
        <strong>Prohibited Practices</strong>
      </div>

      <section className="hero shell">
        <div>
          <p className="eyebrow">ARTICLE 5 GOVERNANCE WORKSPACE</p>
          <h1>
            Prohibition cannot be governed by a <em>checkbox.</em>
          </h1>
          <p className="lead">
            Screen each practice against its complete conditions, claimed
            exceptions, evidence, authority, operating context, affected
            persons, and actual consequences. A “no” without preserved reasoning
            is not a defensible exclusion.
          </p>

          <div className="heroActions">
            <a className="primaryButton" href="#screening">
              Begin Article 5 Screen <span>→</span>
            </a>
            <Link
              className="secondaryButton"
              href="/workspace/entity-review/eu-ai-act?scope=article-5"
            >
              Request Independent Review
            </Link>
          </div>
        </div>

        <aside className={`heroStatus ${determination.tone}`}>
          <span>CURRENT ROUTE STATUS</span>
          <strong>{determination.status}</strong>
          <h2>{determination.title}</h2>
          <p>{determination.text}</p>
          <div className="counts">
            <div>
              <strong>{yesCount}</strong>
              <span>Possible signals</span>
            </div>
            <div>
              <strong>{unknownCount}</strong>
              <span>Unresolved categories</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="deadline shell">
        <div>
          <span>APPLICATION STATUS</span>
          <strong>Article 5 prohibitions apply.</strong>
        </div>
        <p>
          The screening route must use the controlling Regulation, current
          official guidance, actual system behaviour, and the applicable Member
          State context. This workspace does not replace competent legal advice,
          authority approval, or judicial review.
        </p>
      </section>

      <section className="practiceOverview shell">
        {practices.map((practice, index) => (
          <button
            className={`${answers[practice.id] || "empty"} ${
              activePractice === index ? "active" : ""
            }`}
            key={practice.id}
            type="button"
            onClick={() => setActivePractice(index)}
          >
            <span>{practice.code}</span>
            <strong>{practice.title}</strong>
            <small>{practice.article}</small>
            <i />
          </button>
        ))}
      </section>

      <section className="screening shell" id="screening">
        <div className="screeningHeader">
          <div>
            <p className="eyebrow">EVIDENCE-GATED SCREENING</p>
            <h2>Resolve one prohibited-practice category at a time.</h2>
            <p>
              “Yes” means a possible signal is present. “No” means the present
              record supports exclusion. “Unknown” preserves an evidence or
              authority gap.
            </p>
          </div>
          <button type="button" onClick={reset}>Reset Screen</button>
        </div>

        <div className="screeningLayout">
          <aside className="practiceRail">
            {practices.map((practice, index) => (
              <button
                className={activePractice === index ? "active" : ""}
                key={practice.id}
                type="button"
                onClick={() => setActivePractice(index)}
              >
                <span>{practice.code}</span>
                <div>
                  <strong>{practice.title}</strong>
                  <small>
                    {answers[practice.id]
                      ? answers[practice.id] === "yes"
                        ? "Possible signal"
                        : answers[practice.id] === "no"
                          ? "Excluded on present record"
                          : "Evidence unresolved"
                      : "Not screened"}
                  </small>
                </div>
                <i className={answers[practice.id] || "empty"} />
              </button>
            ))}
          </aside>

          <article className="activePractice">
            <div className="practiceTop">
              <span>ARTICLE 5 CATEGORY {selected.code}</span>
              <strong>{selected.article}</strong>
            </div>
            <h3>{selected.title}</h3>
            <p className="summary">{selected.summary}</p>

            <div className="answerChoices">
              {[
                ["yes", "Possible signal", "One or more conditions may be present."],
                ["no", "Not established", "The current evidence supports exclusion."],
                ["unknown", "Unknown", "Evidence, authority, or facts remain unresolved."],
              ].map(([value, label, description]) => (
                <button
                  className={answers[selected.id] === value ? "chosen" : ""}
                  key={value}
                  type="button"
                  onClick={() => setAnswer(selected.id, value as Answer)}
                >
                  <strong>{label}</strong>
                  <p>{description}</p>
                </button>
              ))}
            </div>

            <div className="conditionBlock">
              <span>CONDITIONS TO TEST</span>
              <ul>
                {selected.legalConditions.map((condition) => (
                  <li key={condition}>{condition}</li>
                ))}
              </ul>
            </div>

            <div className="detailGrid">
              <div>
                <span>EVIDENCE TO PRESERVE</span>
                <ul>
                  {selected.evidence.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <div>
                <span>BOUNDARIES AND CAUTIONS</span>
                <ul>
                  {selected.boundaries.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </div>

            <div className="navigation">
              <button
                disabled={activePractice === 0}
                type="button"
                onClick={() => setActivePractice((current) => Math.max(0, current - 1))}
              >
                ← Previous
              </button>
              <button
                disabled={activePractice === practices.length - 1}
                type="button"
                onClick={() =>
                  setActivePractice((current) =>
                    Math.min(practices.length - 1, current + 1),
                  )
                }
              >
                Next Category →
              </button>
            </div>
          </article>
        </div>
      </section>

      <section className={`determination shell ${determination.tone}`}>
        <div className="determinationHeader">
          <div>
            <p className="eyebrow">CURRENT ARTICLE 5 DETERMINATION</p>
            <span className="status">{determination.status}</span>
            <h2>{determination.title}</h2>
            <p>{determination.text}</p>
          </div>
          <div className="signalMeter">
            <strong>{yesCount}</strong>
            <span>POSSIBLE SIGNALS</span>
          </div>
        </div>

        <div className="resultGrid">
          {practices.map((practice) => {
            const answer = answers[practice.id];
            return (
              <article key={practice.id}>
                <span>{practice.article}</span>
                <strong>{practice.title}</strong>
                <i className={answer || "empty"}>
                  {answer
                    ? answer === "yes"
                      ? "SIGNAL"
                      : answer === "no"
                        ? "EXCLUDED"
                        : "UNKNOWN"
                    : "UNSCREENED"}
                </i>
              </article>
            );
          })}
        </div>

        <div className="determinationActions">
          <Link
            href={`/workspace/governed-records/builder?framework=eu-ai-act&record=Article%205%20Screening%20Record&signals=${yesCount}`}
          >
            Create Article 5 Screening Record <span>→</span>
          </Link>
          <Link
            href="/workspace/routes/new?framework=eu-ai-act&requirement=article-5"
          >
            Build Governance Route <span>→</span>
          </Link>
          <Link
            href="/workspace/entity-review/eu-ai-act?scope=article-5"
          >
            Request Independent Review <span>→</span>
          </Link>
        </div>
      </section>

      <section className="exceptionSection shell">
        <div className="sectionIntro">
          <p className="eyebrow">EXCEPTION DISCIPLINE</p>
          <h2>An exception is a separate evidence route.</h2>
          <p>
            Do not convert a claimed exception into automatic permission. The
            exception’s purpose, actor, scope, conditions, authorisation,
            necessity, proportionality, safeguards, chronology, and continuing
            validity must each remain inspectable.
          </p>
        </div>

        <div className="exceptionGrid">
          {[
            [
              "01",
              "Identify",
              "Name the exact exception, legal source, actor, system, use, and protected objective.",
            ],
            [
              "02",
              "Establish Conditions",
              "Map every condition rather than relying on the exception’s title.",
            ],
            [
              "03",
              "Preserve Authority",
              "Bind mandates, authorisations, judicial or administrative decisions, and jurisdiction.",
            ],
            [
              "04",
              "Test Necessity",
              "Show why the use is necessary, not merely useful or operationally convenient.",
            ],
            [
              "05",
              "Test Proportionality",
              "Preserve limits, alternatives, affected-person risk, duration, geography, and scope.",
            ],
            [
              "06",
              "Record Outcome",
              "Preserve approval, denial, suspension, expiry, notification, deletion, and review.",
            ],
          ].map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="remoteBiometric shell">
        <div>
          <p className="eyebrow">HEIGHTENED PATHWAY</p>
          <h2>Real-time remote biometric identification requires more than a stated objective.</h2>
          <p>
            Where the narrow law-enforcement exception is claimed, preserve the
            permitted objective, authority, necessity, proportionality, target
            or threat, temporal and geographic limits, prior authorisation or
            urgent procedure, notifications, national-law basis, human decision
            process, and resulting outcome.
          </p>
        </div>
        <Link href="/workspace/entity-review/eu-ai-act?scope=remote-biometric-identification">
          Escalate for Competent Review <span>→</span>
        </Link>
      </section>

      <section className="recordArchitecture shell">
        <div className="sectionIntro">
          <p className="eyebrow">GOVERNED RECORD ARCHITECTURE</p>
          <h2>Preserve the prohibition analysis without erasing uncertainty.</h2>
        </div>

        <div className="recordGrid">
          {[
            [
              "Applicability Record",
              "Identifies the actor, system, use, affected persons, jurisdiction, Article 5 categories, and source version.",
            ],
            [
              "Condition Map",
              "Separates each legal condition into established, excluded, disputed, unknown, or outside authority.",
            ],
            [
              "Evidence Map",
              "Binds interfaces, architecture, datasets, targeting, testing, authorisations, incidents, and limitations.",
            ],
            [
              "Exception Record",
              "Preserves the exact exception, conditions, authority, necessity, proportionality, scope, expiry, and outcome.",
            ],
            [
              "Independent Review Record",
              "Preserves reviewer identity, scope, evidence examined, objections, corrections, and retained limitations.",
            ],
            [
              "Execution Decision Record",
              "Preserves ALLOW, HOLD, DENY, or ESCALATE—and what evidence would be required to change that status.",
            ],
          ].map(([title, description], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <Link
                href={`/workspace/governed-records/builder?framework=eu-ai-act&record=${encodeURIComponent(
                  title,
                )}`}
              >
                Create Record <b>→</b>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="connected shell">
        <div className="sectionIntro">
          <p className="eyebrow">CONNECTED PATHWAYS</p>
          <h2>Continue from prohibition screening into the full governance route.</h2>
        </div>

        <div className="connectedGrid">
          {[
            [
              "Risk Classification",
              "/eu-ai-act/requirements/risk-classification",
              "Return to the master category and evidence pathway.",
            ],
            [
              "High-Risk AI Systems",
              "/eu-ai-act/requirements/high-risk",
              "Open the high-risk route where Article 5 prohibition is not established.",
            ],
            [
              "Human Oversight",
              "/eu-ai-act/requirements/human-oversight",
              "Preserve intervention, suspension, escalation, and accountable authority.",
            ],
            [
              "Technical Documentation",
              "/eu-ai-act/requirements/technical-documentation",
              "Bind system identity, purpose, architecture, data, testing, versions, and limitations.",
            ],
          ].map(([title, href, description]) => (
            <Link href={href} key={title}>
              <span>OPEN PATHWAY</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <div>Explore Requirement <b>→</b></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="finalCta shell">
        <div>
          <p className="eyebrow">NO ADMISSIBLE EVIDENCE. NO ADMISSIBLE EXECUTION.</p>
          <h2>A possible prohibited practice must stop the route from silently advancing.</h2>
          <p>
            Preserve the signal, conditions, evidence, exceptions, authority,
            review, and execution decision before the system is placed on the
            market, put into service, or used.
          </p>
        </div>
        <div className="finalActions">
          <Link
            className="primaryButton"
            href={`/workspace/governed-records/builder?framework=eu-ai-act&record=Article%205%20Screening%20Record&signals=${yesCount}`}
          >
            Create Screening Record <span>→</span>
          </Link>
          <Link
            className="secondaryButton"
            href="/workspace/entity-review/eu-ai-act?scope=article-5"
          >
            Open Independent Review
          </Link>
        </div>
      </section>

      <footer className="shell">
        <div>
          <strong>TA-14 Authority Governance Institution</strong>
          <span>No admissible evidence. No admissible execution.</span>
        </div>
        <Link href="/eu-ai-act">Return to EU AI Act Workspace</Link>
      </footer>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }

        :global(html) {
          background: #030914;
          scroll-behavior: smooth;
        }

        :global(body) {
          margin: 0;
          color: #f4f9ff;
          background:
            radial-gradient(circle at 8% 3%, rgba(40, 141, 207, .14), transparent 28%),
            radial-gradient(circle at 92% 22%, rgba(225, 78, 57, .08), transparent 29%),
            linear-gradient(180deg, #030914 0%, #071522 52%, #030914 100%);
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        main {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        .shell {
          width: min(1280px, calc(100% - 36px));
          margin-inline: auto;
          position: relative;
          z-index: 2;
        }

        .cosmos {
          position: fixed;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: -4;
        }

        .stars {
          position: absolute;
          inset: -15%;
        }

        .starsOne {
          background-image:
            radial-gradient(circle, rgba(255,255,255,.72) 0 1px, transparent 1.5px);
          background-size: 108px 108px;
          animation: starMove 44s linear infinite;
        }

        .starsTwo {
          background-image:
            radial-gradient(circle, rgba(77,185,255,.62) 0 1px, transparent 1.5px);
          background-size: 174px 174px;
          background-position: 41px 63px;
          animation: starMoveReverse 58s linear infinite;
        }

        .beam {
          position: absolute;
          width: 72vw;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(81, 189, 240, .44), transparent);
        }

        .beamOne {
          left: -24%;
          top: 25%;
          transform: rotate(11deg);
          animation: beamMove 18s linear infinite;
        }

        .beamTwo {
          right: -25%;
          top: 68%;
          transform: rotate(-9deg);
          animation: beamMoveReverse 24s linear infinite;
        }

        .orbit {
          position: absolute;
          width: 250px;
          height: 250px;
          border-radius: 999px;
          border: 1px solid rgba(88, 185, 231, .16);
          animation: orbital 20s linear infinite;
        }

        .orbit i {
          position: absolute;
          right: -7px;
          top: 50%;
          width: 14px;
          height: 14px;
          border-radius: 999px;
          background: #69ccfa;
          box-shadow: 0 0 18px #69ccfa;
        }

        .orbitOne { right: 3%; top: 9%; }

        .orbitTwo {
          left: 3%;
          bottom: 7%;
          width: 190px;
          height: 190px;
          border-color: rgba(255, 91, 75, .18);
          animation-direction: reverse;
          animation-duration: 16s;
        }

        .orbitTwo i {
          background: #ff6759;
          box-shadow: 0 0 18px #ff6759;
        }

        .topbar {
          min-height: 82px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 24px;
          border-bottom: 1px solid rgba(105, 159, 188, .16);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          color: white;
          text-decoration: none;
        }

        .brandMark {
          min-width: 66px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          color: #07121b;
          background: linear-gradient(135deg, #6bcdfa, #d9f7ff);
          font-size: 13px;
          font-weight: 950;
        }

        .brand > span:last-child {
          display: flex;
          flex-direction: column;
        }

        .brand small {
          margin-top: 3px;
          color: #7e9baa;
          font-size: 11px;
        }

        nav {
          display: flex;
          justify-content: center;
          gap: 22px;
        }

        nav a {
          color: #a8bcc7;
          text-decoration: none;
          font-size: 13px;
          font-weight: 750;
        }

        nav a.active { color: #f7d687; }

        .headerButton {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          gap: 16px;
          padding: 0 16px;
          border-radius: 12px;
          border: 1px solid rgba(255, 193, 71, .36);
          color: #ffd783;
          background: rgba(116, 74, 5, .12);
          text-decoration: none;
          font-size: 12px;
          font-weight: 900;
        }

        .breadcrumbs {
          min-height: 62px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #718d9d;
          font-size: 12px;
        }

        .breadcrumbs a {
          color: #75cfee;
          text-decoration: none;
        }

        .breadcrumbs strong { color: #dbe8ef; }

        .eyebrow {
          margin: 0;
          color: #6dd2f5;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: .18em;
        }

        .hero {
          min-height: 540px;
          display: grid;
          grid-template-columns: 1.16fr .84fr;
          gap: 48px;
          align-items: center;
          padding: 54px 0 70px;
        }

        h1 {
          max-width: 880px;
          margin: 16px 0 0;
          font-size: clamp(54px, 7.5vw, 96px);
          line-height: .94;
          letter-spacing: -.065em;
        }

        h1 em {
          color: #ff7162;
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 500;
        }

        .lead {
          max-width: 830px;
          margin: 24px 0 0;
          color: #a7bac6;
          font-size: 18px;
          line-height: 1.7;
        }

        .heroActions,
        .finalActions {
          display: flex;
          flex-wrap: wrap;
          gap: 11px;
          margin-top: 28px;
        }

        .primaryButton,
        .secondaryButton {
          min-height: 52px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          padding: 0 18px;
          border-radius: 13px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 900;
        }

        .primaryButton {
          color: #06131d;
          background: linear-gradient(135deg, #67caf6, #d8f7ff);
          box-shadow: 0 14px 36px rgba(73, 181, 229, .17);
        }

        .secondaryButton {
          color: #e5f3fa;
          border: 1px solid rgba(100, 184, 222, .23);
          background: rgba(24, 66, 88, .14);
        }

        .heroStatus,
        .deadline,
        .screening,
        .determination,
        .exceptionSection,
        .remoteBiometric,
        .recordArchitecture,
        .connected,
        .finalCta {
          border: 1px solid rgba(111, 163, 190, .15);
          background:
            linear-gradient(180deg, rgba(10, 24, 35, .93), rgba(5, 12, 19, .97));
          border-radius: 24px;
          box-shadow: 0 22px 65px rgba(0,0,0,.23);
        }

        .heroStatus { padding: 32px; }

        .heroStatus.red,
        .determination.red {
          border-color: rgba(255, 91, 91, .36);
        }

        .heroStatus.amber,
        .determination.amber {
          border-color: rgba(255, 171, 64, .31);
        }

        .heroStatus.green,
        .determination.green {
          border-color: rgba(91, 218, 159, .28);
        }

        .heroStatus > span {
          color: #8199a7;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .16em;
        }

        .heroStatus > strong {
          display: inline-flex;
          margin-top: 18px;
          padding: 7px 10px;
          border-radius: 999px;
          color: #ff8c7e;
          background: rgba(255, 91, 75, .08);
          font-size: 10px;
          letter-spacing: .12em;
        }

        .heroStatus h2 {
          margin: 17px 0 10px;
          font-size: 38px;
          line-height: 1.05;
          letter-spacing: -.04em;
        }

        .heroStatus > p {
          color: #a9bbc5;
          line-height: 1.62;
        }

        .counts {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 24px;
        }

        .counts div {
          padding: 17px;
          border-radius: 13px;
          border: 1px solid rgba(106, 161, 188, .13);
          background: rgba(30, 81, 103, .04);
        }

        .counts strong,
        .counts span {
          display: block;
        }

        .counts strong { font-size: 28px; }

        .counts span {
          margin-top: 4px;
          color: #839aa6;
          font-size: 10px;
        }

        .deadline {
          padding: 25px 30px;
          display: grid;
          grid-template-columns: .8fr 1.2fr;
          gap: 32px;
          align-items: center;
          border-color: rgba(255, 101, 84, .21);
        }

        .deadline div span {
          display: block;
          color: #ff7466;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .15em;
        }

        .deadline div strong {
          display: block;
          margin-top: 8px;
          font-size: 20px;
        }

        .deadline p {
          margin: 0;
          color: #b9aaa8;
          line-height: 1.62;
        }

        .practiceOverview {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 11px;
          margin-top: 20px;
        }

        .practiceOverview button {
          min-height: 142px;
          padding: 17px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          position: relative;
          border-radius: 16px;
          border: 1px solid rgba(103, 169, 198, .14);
          color: inherit;
          background: rgba(12, 28, 39, .9);
          text-align: left;
          cursor: pointer;
        }

        .practiceOverview button.active {
          border-color: rgba(108, 207, 245, .44);
        }

        .practiceOverview button > span {
          width: 29px;
          height: 29px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          color: #6ed2f5;
          background: rgba(55, 149, 186, .08);
          font-size: 10px;
          font-weight: 950;
        }

        .practiceOverview strong {
          margin-top: 13px;
          line-height: 1.28;
        }

        .practiceOverview small {
          margin-top: 6px;
          color: #7e96a2;
        }

        .practiceOverview i {
          position: absolute;
          right: 14px;
          top: 14px;
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #334b58;
        }

        .practiceOverview .yes i {
          background: #ff6557;
          box-shadow: 0 0 11px rgba(255, 90, 75, .7);
        }

        .practiceOverview .no i { background: #72d8ad; }
        .practiceOverview .unknown i { background: #ffad53; }

        .screening,
        .determination,
        .exceptionSection,
        .recordArchitecture,
        .connected {
          margin-top: 20px;
          padding: 42px;
        }

        .screeningHeader {
          display: flex;
          justify-content: space-between;
          gap: 30px;
          align-items: end;
        }

        .screeningHeader > div { max-width: 850px; }

        .screeningHeader h2,
        .determinationHeader h2,
        .sectionIntro h2,
        .remoteBiometric h2,
        .finalCta h2 {
          margin: 10px 0 0;
          font-size: clamp(34px, 4.8vw, 56px);
          line-height: 1.02;
          letter-spacing: -.05em;
        }

        .screeningHeader p:not(.eyebrow),
        .sectionIntro p:not(.eyebrow),
        .determinationHeader p,
        .remoteBiometric p:not(.eyebrow),
        .finalCta p:not(.eyebrow) {
          color: #9fb3c0;
          line-height: 1.68;
        }

        .screeningHeader > button {
          min-height: 44px;
          padding: 0 15px;
          border-radius: 11px;
          border: 1px solid rgba(255, 99, 82, .23);
          color: #ff9a8f;
          background: rgba(116, 38, 29, .08);
          font: inherit;
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
        }

        .screeningLayout {
          display: grid;
          grid-template-columns: .78fr 1.22fr;
          gap: 18px;
          margin-top: 28px;
        }

        .practiceRail {
          display: grid;
          gap: 9px;
        }

        .practiceRail > button {
          width: 100%;
          min-height: 78px;
          padding: 12px;
          display: grid;
          grid-template-columns: 34px 1fr 10px;
          gap: 11px;
          align-items: center;
          border-radius: 14px;
          border: 1px solid rgba(98, 164, 194, .13);
          color: inherit;
          background: rgba(32, 87, 112, .035);
          text-align: left;
          cursor: pointer;
        }

        .practiceRail > button.active {
          border-color: rgba(105, 206, 244, .42);
          background: rgba(39, 119, 151, .09);
        }

        .practiceRail > button > span {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          color: #69d0f4;
          background: rgba(58, 155, 194, .09);
          font-size: 10px;
          font-weight: 950;
        }

        .practiceRail strong,
        .practiceRail small { display: block; }

        .practiceRail strong {
          font-size: 12px;
          line-height: 1.35;
        }

        .practiceRail small {
          margin-top: 5px;
          color: #718b99;
          font-size: 10px;
        }

        .practiceRail i {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #334b58;
        }

        .practiceRail i.yes {
          background: #ff6557;
          box-shadow: 0 0 10px rgba(255, 90, 75, .6);
        }

        .practiceRail i.no { background: #72d8ad; }
        .practiceRail i.unknown { background: #ffad53; }

        .activePractice {
          min-height: 740px;
          padding: 30px;
          border-radius: 20px;
          border: 1px solid rgba(255, 99, 82, .17);
          background:
            radial-gradient(circle at 50% 0%, rgba(255, 90, 70, .045), transparent 33%),
            rgba(10, 18, 23, .88);
        }

        .practiceTop {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          color: #ff7567;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .14em;
        }

        .activePractice h3 {
          max-width: 800px;
          margin: 18px 0 12px;
          font-size: clamp(31px, 4vw, 46px);
          line-height: 1.05;
          letter-spacing: -.04em;
        }

        .summary {
          color: #a8bac4;
          line-height: 1.65;
        }

        .answerChoices {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 11px;
          margin-top: 25px;
        }

        .answerChoices button {
          min-height: 122px;
          padding: 17px;
          border-radius: 15px;
          border: 1px solid rgba(103, 175, 207, .14);
          color: inherit;
          background: rgba(31, 88, 113, .035);
          text-align: left;
          cursor: pointer;
        }

        .answerChoices button.chosen {
          border-color: rgba(255, 107, 90, .5);
          background: rgba(148, 48, 37, .1);
        }

        .answerChoices strong { font-size: 16px; }

        .answerChoices p {
          margin: 9px 0 0;
          color: #8299a5;
          font-size: 12px;
          line-height: 1.5;
        }

        .conditionBlock,
        .detailGrid > div {
          padding: 19px;
          border-radius: 15px;
          border: 1px solid rgba(255, 100, 83, .13);
          background: rgba(119, 37, 28, .035);
        }

        .conditionBlock { margin-top: 17px; }

        .conditionBlock > span,
        .detailGrid span {
          color: #ff796c;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: .14em;
        }

        .conditionBlock ul,
        .detailGrid ul {
          display: grid;
          gap: 8px;
          margin: 15px 0 0;
          padding-left: 18px;
          color: #c7d3d9;
        }

        .conditionBlock li,
        .detailGrid li { line-height: 1.45; }

        .detailGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 11px;
          margin-top: 11px;
        }

        .navigation {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-top: 20px;
        }

        .navigation button {
          min-height: 42px;
          padding: 0 14px;
          border-radius: 10px;
          border: 1px solid rgba(99, 178, 213, .18);
          color: #c9e4ef;
          background: rgba(36, 101, 128, .05);
          font: inherit;
          font-size: 11px;
          font-weight: 850;
          cursor: pointer;
        }

        .navigation button:disabled {
          opacity: .35;
          cursor: not-allowed;
        }

        .determination { border-width: 2px; }

        .determinationHeader {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 30px;
          align-items: center;
        }

        .determinationHeader > div:first-child { max-width: 880px; }

        .status {
          display: inline-flex;
          margin-top: 18px;
          padding: 7px 10px;
          border-radius: 999px;
          color: #ff9589;
          background: rgba(255, 89, 73, .08);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .12em;
        }

        .signalMeter {
          width: 170px;
          height: 170px;
          display: grid;
          place-content: center;
          border-radius: 999px;
          border: 2px solid rgba(255, 91, 74, .28);
          background: radial-gradient(circle, rgba(164, 49, 36, .12), transparent 65%);
          text-align: center;
        }

        .signalMeter strong { font-size: 48px; }

        .signalMeter span {
          margin-top: 3px;
          color: #9a7c79;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: .14em;
        }

        .resultGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 11px;
          margin-top: 28px;
        }

        .resultGrid article {
          min-height: 135px;
          padding: 17px;
          border-radius: 15px;
          border: 1px solid rgba(102, 168, 197, .13);
          background: rgba(30, 83, 105, .035);
        }

        .resultGrid article > span {
          color: #7393a2;
          font-size: 9px;
          font-weight: 900;
        }

        .resultGrid article > strong {
          display: block;
          margin-top: 11px;
          min-height: 43px;
          font-size: 13px;
          line-height: 1.35;
        }

        .resultGrid i {
          display: inline-flex;
          margin-top: 11px;
          padding: 5px 8px;
          border-radius: 999px;
          color: #7c929d;
          background: rgba(84, 108, 119, .07);
          font-size: 8px;
          font-style: normal;
          font-weight: 950;
          letter-spacing: .1em;
        }

        .resultGrid i.yes {
          color: #ff8d80;
          background: rgba(179, 54, 40, .09);
        }

        .resultGrid i.no {
          color: #79dbb3;
          background: rgba(50, 145, 103, .08);
        }

        .resultGrid i.unknown {
          color: #ffbc72;
          background: rgba(164, 90, 22, .08);
        }

        .determinationActions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 20px;
        }

        .determinationActions a {
          min-height: 44px;
          padding: 0 14px;
          display: inline-flex;
          align-items: center;
          gap: 18px;
          border-radius: 11px;
          border: 1px solid rgba(102, 190, 227, .22);
          color: #85d8f7;
          background: rgba(38, 112, 143, .06);
          text-decoration: none;
          font-size: 11px;
          font-weight: 900;
        }

        .sectionIntro { max-width: 900px; }

        .exceptionGrid,
        .recordGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 13px;
          margin-top: 28px;
        }

        .exceptionGrid article,
        .recordGrid article {
          min-height: 200px;
          padding: 21px;
          border-radius: 16px;
          border: 1px solid rgba(101, 176, 209, .14);
          background: rgba(31, 87, 111, .04);
        }

        .exceptionGrid span,
        .recordGrid > article > span {
          color: #6dd2f5;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .14em;
        }

        .exceptionGrid h3,
        .recordGrid h3 {
          margin: 17px 0 9px;
          font-size: 21px;
        }

        .exceptionGrid p,
        .recordGrid p {
          margin: 0;
          color: #9fb1bc;
          line-height: 1.55;
        }

        .remoteBiometric {
          margin-top: 20px;
          padding: 42px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 30px;
          align-items: center;
          border-color: rgba(255, 91, 74, .25);
        }

        .remoteBiometric > div { max-width: 900px; }

        .remoteBiometric > a {
          min-height: 52px;
          padding: 0 18px;
          display: inline-flex;
          align-items: center;
          gap: 18px;
          border-radius: 12px;
          color: #ff9e93;
          border: 1px solid rgba(255, 100, 83, .28);
          background: rgba(132, 39, 29, .07);
          text-decoration: none;
          font-size: 12px;
          font-weight: 900;
        }

        .recordGrid article {
          display: flex;
          flex-direction: column;
        }

        .recordGrid p { min-height: 90px; }

        .recordGrid a {
          min-height: 42px;
          margin-top: auto;
          padding: 0 13px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 10px;
          border: 1px solid rgba(100, 190, 229, .21);
          color: #82d5f5;
          background: rgba(41, 117, 149, .06);
          text-decoration: none;
          font-size: 12px;
          font-weight: 900;
        }

        .connectedGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-top: 28px;
        }

        .connectedGrid > a {
          min-height: 250px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          border-radius: 17px;
          border: 1px solid rgba(255, 99, 81, .15);
          color: inherit;
          background:
            radial-gradient(circle at 50% 0%, rgba(255, 79, 61, .05), transparent 34%),
            rgba(12, 19, 22, .86);
          text-decoration: none;
          transition: transform 180ms ease, border-color 180ms ease;
        }

        .connectedGrid > a:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 104, 87, .47);
        }

        .connectedGrid > a > span {
          color: #ff7466;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: .15em;
        }

        .connectedGrid h3 {
          margin: 16px 0 10px;
          font-size: 22px;
        }

        .connectedGrid p {
          margin: 0;
          color: #a8b8c1;
          line-height: 1.55;
        }

        .connectedGrid > a > div {
          margin-top: auto;
          padding-top: 18px;
          display: flex;
          justify-content: space-between;
          color: #ff9185;
          font-size: 12px;
          font-weight: 900;
        }

        .finalCta {
          margin-top: 70px;
          padding: 48px 42px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 32px;
          border-color: rgba(255, 96, 80, .24);
        }

        .finalCta > div:first-child { max-width: 760px; }

        .finalActions {
          justify-content: flex-end;
          margin-top: 0;
        }

        footer {
          min-height: 120px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          color: #718894;
          font-size: 12px;
        }

        footer > div {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        footer strong { color: #a6bac5; }

        footer a {
          color: #78d1f2;
          text-decoration: none;
          font-weight: 850;
        }

        @keyframes starMove {
          from { transform: translate3d(0,0,0); }
          to { transform: translate3d(110px,145px,0); }
        }

        @keyframes starMoveReverse {
          from { transform: translate3d(0,0,0); }
          to { transform: translate3d(-120px,100px,0); }
        }

        @keyframes beamMove {
          from { transform: translateX(-35vw) rotate(11deg); opacity: 0; }
          18% { opacity: .5; }
          82% { opacity: .3; }
          to { transform: translateX(105vw) rotate(11deg); opacity: 0; }
        }

        @keyframes beamMoveReverse {
          from { transform: translateX(35vw) rotate(-9deg); opacity: 0; }
          18% { opacity: .45; }
          82% { opacity: .28; }
          to { transform: translateX(-105vw) rotate(-9deg); opacity: 0; }
        }

        @keyframes orbital { to { transform: rotate(360deg); } }

        @media (max-width: 1080px) {
          nav { display: none; }
          .topbar { grid-template-columns: 1fr auto; }

          .hero,
          .screeningLayout {
            grid-template-columns: 1fr;
          }

          .practiceOverview,
          .resultGrid,
          .connectedGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .remoteBiometric {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .shell { width: min(100% - 20px, 1280px); }

          .brand small,
          .headerButton span { display: none; }

          .hero {
            min-height: auto;
            padding: 42px 0 56px;
          }

          .deadline,
          .determinationHeader,
          .detailGrid {
            grid-template-columns: 1fr;
          }

          .practiceOverview,
          .answerChoices,
          .resultGrid,
          .exceptionGrid,
          .recordGrid,
          .connectedGrid {
            grid-template-columns: 1fr;
          }

          .screeningHeader,
          .finalCta {
            flex-direction: column;
            align-items: flex-start;
          }

          .screening,
          .determination,
          .exceptionSection,
          .remoteBiometric,
          .recordArchitecture,
          .connected,
          .finalCta {
            padding: 28px 22px;
          }

          .signalMeter {
            width: 130px;
            height: 130px;
          }

          .finalActions { justify-content: flex-start; }

          footer {
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
          }
        }
      `}</style>
    </main>
  );
}
