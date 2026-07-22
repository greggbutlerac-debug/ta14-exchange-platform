"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Answer = "yes" | "no" | "unknown" | "";

type Classification = {
  id: string;
  label: string;
  status: string;
  tone: string;
  summary: string;
  articles: string[];
  evidence: string[];
  nextLinks: {
    title: string;
    href: string;
  }[];
};

const questions = [
  {
    id: "aiSystem",
    title: "Is the subject an AI system or general-purpose AI model?",
    help:
      "Establish whether the subject falls within the claimed AI-system or GPAI-model pathway before applying risk categories.",
    evidence:
      "System description, architecture, intended purpose, model documentation, supplier declarations, and operating behavior.",
  },
  {
    id: "prohibited",
    title: "Does the intended use appear to match a prohibited-practice category?",
    help:
      "Examples may include certain manipulative, exploitative, social-scoring, biometric, emotion-recognition, or predictive-policing uses, subject to the exact legal conditions and exceptions.",
    evidence:
      "Use-case description, affected persons, deployment context, purpose, decision authority, safeguards, exceptions, and legal analysis.",
  },
  {
    id: "annexProduct",
    title: "Is the AI system a safety component of a regulated product—or itself such a product?",
    help:
      "This branch examines systems connected to Union product-safety legislation and third-party conformity assessment.",
    evidence:
      "Product identity, applicable legislation, safety function, manufacturer documentation, and conformity route.",
  },
  {
    id: "annexIII",
    title: "Does the use case appear within an Annex III high-risk area?",
    help:
      "This may include biometrics, critical infrastructure, education, employment, essential services, law enforcement, migration, justice, or democratic processes.",
    evidence:
      "Use-case mapping, operator identity, affected-person context, decision consequence, intended purpose, and claimed exception analysis.",
  },
  {
    id: "article50",
    title: "Does the system interact with people or generate, manipulate, detect, or publish synthetic content?",
    help:
      "This branch examines Article 50 transparency duties, including direct interaction, marking, detectability, biometric or emotion-recognition notice, deepfakes, and public-interest text.",
    evidence:
      "Interface captures, content types, disclosure design, marking architecture, publication context, editorial control, and exception analysis.",
  },
  {
    id: "gpai",
    title: "Is the subject a general-purpose AI model supplied for downstream integration?",
    help:
      "This branch separates model-provider obligations from downstream AI-system obligations.",
    evidence:
      "Model identity, capabilities, release method, weights or access model, licence, downstream documentation, and modification history.",
  },
  {
    id: "systemic",
    title: "Could the GPAI model meet a systemic-risk pathway?",
    help:
      "This requires a separate, evidence-based evaluation and should not be inferred from popularity or model size alone.",
    evidence:
      "Compute and capability evidence, evaluation results, designation status, systemic-risk analysis, incidents, and cybersecurity records.",
  },
] as const;

const initialAnswers: Record<string, Answer> = Object.fromEntries(
  questions.map((question) => [question.id, ""]),
);

function determineClassification(
  answers: Record<string, Answer>,
): Classification {
  if (!answers.aiSystem || answers.aiSystem === "unknown") {
    return {
      id: "insufficient",
      label: "Insufficient Evidence",
      status: "HOLD",
      tone: "amber",
      summary:
        "The route cannot yet establish that the subject is an AI system or GPAI model within the claimed pathway. Preserve the unresolved definition evidence before continuing.",
      articles: ["Article 3", "Scope and definitions"],
      evidence: [
        "System or model identity",
        "Technical architecture",
        "Intended purpose",
        "Supplier or developer declaration",
        "Observed operating behavior",
      ],
      nextLinks: [
        {
          title: "Create Applicability Record",
          href: "/workspace/governed-records/builder?framework=eu-ai-act&record=Applicability%20Record",
        },
        {
          title: "Request Classification Review",
          href: "/workspace/entity-review/eu-ai-act?scope=classification",
        },
      ],
    };
  }

  if (answers.aiSystem === "no") {
    return {
      id: "outside",
      label: "Outside the Claimed AI Pathway",
      status: "REVIEW",
      tone: "slate",
      summary:
        "Current answers do not establish that the subject is an AI system or GPAI model. That does not establish that no other law, product rule, data rule, consumer rule, or sector obligation applies.",
      articles: ["Article 2", "Article 3"],
      evidence: [
        "Reasoned exclusion analysis",
        "Technical description",
        "Product and software classification",
        "Other applicable legal frameworks",
        "Reviewer identity and limitations",
      ],
      nextLinks: [
        {
          title: "Preserve Exclusion Record",
          href: "/workspace/governed-records/builder?framework=eu-ai-act&record=Exclusion%20Record",
        },
        {
          title: "Open Entity Review",
          href: "/workspace/entity-review/eu-ai-act?scope=outside-pathway",
        },
      ],
    };
  }

  if (answers.prohibited === "yes") {
    return {
      id: "prohibited",
      label: "Possible Prohibited Practice",
      status: "DENY / ESCALATE",
      tone: "red",
      summary:
        "The declared use may fall within a prohibited-practice pathway. Execution should not proceed on this record alone. The precise legal conditions, exceptions, evidence, and competent review must be resolved.",
      articles: ["Article 5", "Relevant recitals and guidance"],
      evidence: [
        "Exact intended and actual use",
        "Affected-person population",
        "Purpose and decision consequence",
        "Operator authority",
        "Exception analysis",
        "Independent legal and technical review",
      ],
      nextLinks: [
        {
          title: "Open Prohibited Practices",
          href: "/eu-ai-act/requirements/prohibited-practices",
        },
        {
          title: "Request Independent Review",
          href: "/workspace/entity-review/eu-ai-act?scope=prohibited-practice",
        },
      ],
    };
  }

  if (answers.annexProduct === "yes" || answers.annexIII === "yes") {
    return {
      id: "high-risk",
      label: "Possible High-Risk AI System",
      status: "CONTROLLED PATHWAY",
      tone: "gold",
      summary:
        "The declared system may enter a high-risk pathway through regulated-product integration or an Annex III use case. The specific category, exception, operator role, and lifecycle obligations must be preserved.",
      articles: [
        "Articles 6–7",
        "Articles 9–17",
        "Articles 26–27",
        "Article 43",
        "Annexes I and III",
      ],
      evidence: [
        "Role and operator classification",
        "Annex I or Annex III mapping",
        "Intended purpose and actual use",
        "Risk-management system",
        "Data-governance evidence",
        "Technical documentation",
        "Human oversight and logging",
        "Conformity and post-market records",
      ],
      nextLinks: [
        {
          title: "Open High-Risk Pathway",
          href: "/eu-ai-act/requirements/high-risk",
        },
        {
          title: "Open Human Oversight",
          href: "/eu-ai-act/requirements/human-oversight",
        },
        {
          title: "Open FRIA",
          href: "/eu-ai-act/requirements/fria",
        },
      ],
    };
  }

  if (answers.gpai === "yes") {
    if (answers.systemic === "yes") {
      return {
        id: "gpai-systemic",
        label: "GPAI Model — Possible Systemic Risk",
        status: "ESCALATED MODEL PATHWAY",
        tone: "purple",
        summary:
          "The subject appears to be a general-purpose AI model with a possible systemic-risk pathway. Model-level documentation, evaluations, incident governance, cybersecurity, and designation evidence require separate review.",
        articles: ["Articles 51–55", "Annexes XI–XIII"],
        evidence: [
          "Model identity and provider",
          "Capability and compute evidence",
          "Evaluation and adversarial testing",
          "Systemic-risk assessment",
          "Serious-incident records",
          "Cybersecurity controls",
          "Downstream information package",
        ],
        nextLinks: [
          {
            title: "Open GPAI Pathway",
            href: "/eu-ai-act/requirements/gpai",
          },
          {
            title: "Open Incident Reporting",
            href: "/eu-ai-act/requirements/incident-reporting",
          },
          {
            title: "Create Systemic Risk Record",
            href: "/workspace/governed-records/builder?framework=eu-ai-act&record=GPAI%20Systemic%20Risk%20Record",
          },
        ],
      };
    }

    return {
      id: "gpai",
      label: "General-Purpose AI Model",
      status: "MODEL PATHWAY",
      tone: "purple",
      summary:
        "The subject appears to enter the GPAI model pathway. Model-provider duties must remain separate from downstream AI-system duties, and systemic-risk status remains unresolved unless established.",
      articles: ["Articles 51–54", "Annexes XI and XII"],
      evidence: [
        "Model identity and provider",
        "Capabilities and limitations",
        "Training and evaluation documentation",
        "Downstream technical information",
        "Copyright policy",
        "Training-content summary",
        "Modification and release history",
      ],
      nextLinks: [
        {
          title: "Open GPAI Pathway",
          href: "/eu-ai-act/requirements/gpai",
        },
        {
          title: "Open Technical Documentation",
          href: "/eu-ai-act/requirements/technical-documentation",
        },
      ],
    };
  }

  if (answers.article50 === "yes") {
    return {
      id: "transparency",
      label: "Transparency-Scoped AI",
      status: "ARTICLE 50 PATHWAY",
      tone: "blue",
      summary:
        "The declared system or content use may trigger an Article 50 transparency pathway. The exact paragraph, actor, content type, exception, and evidence of implementation must be resolved.",
      articles: ["Article 50(1)–(4)"],
      evidence: [
        "Provider or deployer role",
        "Interaction or content classification",
        "Disclosure wording and timing",
        "Machine-readable marking",
        "Detectability testing",
        "Publication and editorial context",
        "Exception and technical-feasibility analysis",
      ],
      nextLinks: [
        {
          title: "Open Article 50",
          href: "/eu-ai-act/requirements/article-50",
        },
        {
          title: "Create Transparency Record",
          href: "/workspace/governed-records/builder?framework=eu-ai-act&record=Transparency%20Implementation%20Record",
        },
      ],
    };
  }

  const unresolved = Object.values(answers).some(
    (answer) => answer === "" || answer === "unknown",
  );

  if (unresolved) {
    return {
      id: "conditional",
      label: "Conditional / Unresolved Classification",
      status: "HOLD",
      tone: "amber",
      summary:
        "The current evidence does not support a complete category determination. Preserve the known facts, unknown facts, excluded pathways, and evidence still required.",
      articles: ["Articles 2–7", "Article 50", "Articles 51–55"],
      evidence: [
        "Complete role classification",
        "Complete use-case description",
        "Annex I and Annex III mapping",
        "Article 5 exclusion analysis",
        "Article 50 content and interaction analysis",
        "GPAI applicability analysis",
      ],
      nextLinks: [
        {
          title: "Create Classification Gap Record",
          href: "/workspace/governed-records/builder?framework=eu-ai-act&record=Classification%20Gap%20Record",
        },
        {
          title: "Request Independent Review",
          href: "/workspace/entity-review/eu-ai-act?scope=classification-gap",
        },
      ],
    };
  }

  return {
    id: "other",
    label: "No Listed Category Established",
    status: "REVIEW",
    tone: "green",
    summary:
      "The current declarations do not establish a prohibited, high-risk, GPAI, or Article 50 category. This is not a certification of non-applicability. Preserve the evidence and review other obligations, role duties, and material changes.",
    articles: ["Articles 2–4", "Role-specific obligations"],
    evidence: [
      "Completed classification record",
      "Role determination",
      "System and use-case description",
      "Exclusion reasoning",
      "Material-change monitoring",
      "Independent review where consequential",
    ],
    nextLinks: [
      {
        title: "Create Classification Record",
        href: "/workspace/governed-records/builder?framework=eu-ai-act&record=Risk%20Classification%20Record",
      },
      {
        title: "Open Role Pathways",
        href: "/eu-ai-act",
      },
    ],
  };
}

export default function EuAiActRiskClassificationPage() {
  const [answers, setAnswers] =
    useState<Record<string, Answer>>(initialAnswers);
  const [activeQuestion, setActiveQuestion] = useState(0);

  const classification = useMemo(
    () => determineClassification(answers),
    [answers],
  );

  const answeredCount = Object.values(answers).filter(Boolean).length;
  const progress = Math.round((answeredCount / questions.length) * 100);

  const updateAnswer = (id: string, answer: Answer) => {
    setAnswers((current) => ({ ...current, [id]: answer }));

    const questionIndex = questions.findIndex((question) => question.id === id);
    if (questionIndex >= 0 && questionIndex < questions.length - 1) {
      setActiveQuestion(questionIndex + 1);
    }
  };

  const reset = () => {
    setAnswers(initialAnswers);
    setActiveQuestion(0);
  };

  return (
    <main>
      <div className="cosmos" aria-hidden="true">
        <div className="stars starsOne" />
        <div className="stars starsTwo" />
        <div className="movingLine lineOne" />
        <div className="movingLine lineTwo" />
        <div className="orbital orbitalOne">
          <i />
        </div>
        <div className="orbital orbitalTwo">
          <i />
        </div>
      </div>

      <header className="topbar shell">
        <Link href="/eu-ai-act" className="brand">
          <span className="brandMark">TA-14</span>
          <span>
            <strong>EU AI Act Classification</strong>
            <small>No admissible evidence. No admissible execution.</small>
          </span>
        </Link>

        <nav>
          <Link href="/">Exchange</Link>
          <Link href="/workspace">Workspace</Link>
          <Link className="active" href="/eu-ai-act">
            EU AI Act
          </Link>
          <Link href="/workspace/governed-records">Records</Link>
          <Link href="/workspace/entity-review">Review</Link>
        </nav>

        <Link className="headerButton" href="/eu-ai-act">
          EU AI Act Workspace
          <span>→</span>
        </Link>
      </header>

      <div className="breadcrumbs shell">
        <Link href="/eu-ai-act">EU AI Act</Link>
        <span>/</span>
        <span>Requirements</span>
        <span>/</span>
        <strong>Risk Classification</strong>
      </div>

      <section className="hero shell">
        <div className="heroCopy">
          <p className="eyebrow">MASTER CLASSIFICATION PATHWAY</p>
          <h1>
            Classify the route without <em>inventing certainty.</em>
          </h1>
          <p className="lead">
            Separate the subject, role, use case, evidence, exclusions, and
            unresolved facts before claiming that an AI system is prohibited,
            high-risk, transparency-scoped, general-purpose, or outside a
            listed category.
          </p>

          <div className="heroActions">
            <a className="primaryButton" href="#classification-workflow">
              Begin Classification
              <span>→</span>
            </a>
            <Link
              className="secondaryButton"
              href="/workspace/entity-review/eu-ai-act?scope=risk-classification"
            >
              Request Independent Review
            </Link>
          </div>
        </div>

        <aside className={`resultPreview ${classification.tone}`}>
          <span className="previewLabel">CURRENT ROUTE SIGNAL</span>
          <strong>{classification.status}</strong>
          <h2>{classification.label}</h2>
          <p>{classification.summary}</p>
          <div className="previewProgress">
            <div>
              <span>Questions answered</span>
              <strong>
                {answeredCount}/{questions.length}
              </strong>
            </div>
            <div className="progressTrack">
              <i style={{ width: `${progress}%` }} />
            </div>
          </div>
        </aside>
      </section>

      <section className="boundary shell">
        <div>
          <span>TA-14 CLASSIFICATION BOUNDARY</span>
          <strong>
            This workflow creates a bounded governance signal—not legal
            certification.
          </strong>
        </div>
        <p>
          Every answer remains a declaration until supported by attributable
          evidence. Unknown answers remain visible. Final legal interpretation,
          regulator judgment, conformity assessment, and professional advice
          remain outside this classification unless separately established.
        </p>
      </section>

      <section className="categoryMap shell">
        {[
          ["01", "Prohibited", "Article 5", "red"],
          ["02", "High-Risk", "Articles 6–7", "gold"],
          ["03", "Transparency", "Article 50", "blue"],
          ["04", "GPAI", "Articles 51–55", "purple"],
          ["05", "Unresolved", "Evidence gap", "amber"],
        ].map(([number, title, article, tone]) => (
          <article className={tone} key={title}>
            <span>{number}</span>
            <strong>{title}</strong>
            <p>{article}</p>
          </article>
        ))}
      </section>

      <section
        className="classificationWorkspace shell"
        id="classification-workflow"
      >
        <div className="workflowHeader">
          <div>
            <p className="eyebrow">GUIDED CLASSIFICATION</p>
            <h2>Answer from evidence—not assumption.</h2>
            <p>
              Select “Unknown” whenever the record cannot establish the answer.
              The pathway will preserve the gap instead of forcing a
              classification.
            </p>
          </div>

          <button type="button" onClick={reset}>
            Reset Pathway
          </button>
        </div>

        <div className="classificationLayout">
          <aside className="questionRail">
            {questions.map((question, index) => {
              const answer = answers[question.id];

              return (
                <button
                  className={activeQuestion === index ? "selected" : ""}
                  key={question.id}
                  type="button"
                  onClick={() => setActiveQuestion(index)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{question.title}</strong>
                    <small>
                      {answer
                        ? answer === "yes"
                          ? "Declared yes"
                          : answer === "no"
                            ? "Declared no"
                            : "Evidence unresolved"
                        : "Not answered"}
                    </small>
                  </div>
                  <i className={answer || "empty"} />
                </button>
              );
            })}
          </aside>

          <div className="activeQuestion">
            <div className="questionNumber">
              QUESTION {String(activeQuestion + 1).padStart(2, "0")}
            </div>
            <h3>{questions[activeQuestion].title}</h3>
            <p className="questionHelp">{questions[activeQuestion].help}</p>

            <div className="answerGrid">
              {[
                ["yes", "Yes", "The current record supports this declaration."],
                ["no", "No", "The current record supports exclusion."],
                [
                  "unknown",
                  "Unknown",
                  "Evidence is missing, disputed, or outside present authority.",
                ],
              ].map(([value, label, help]) => (
                <button
                  className={
                    answers[questions[activeQuestion].id] === value
                      ? "chosen"
                      : ""
                  }
                  key={value}
                  type="button"
                  onClick={() =>
                    updateAnswer(
                      questions[activeQuestion].id,
                      value as Answer,
                    )
                  }
                >
                  <span>{label}</span>
                  <p>{help}</p>
                </button>
              ))}
            </div>

            <div className="evidencePrompt">
              <span>EVIDENCE EXPECTED</span>
              <p>{questions[activeQuestion].evidence}</p>
            </div>

            <div className="questionNavigation">
              <button
                disabled={activeQuestion === 0}
                type="button"
                onClick={() =>
                  setActiveQuestion((current) => Math.max(0, current - 1))
                }
              >
                ← Previous
              </button>
              <button
                disabled={activeQuestion === questions.length - 1}
                type="button"
                onClick={() =>
                  setActiveQuestion((current) =>
                    Math.min(questions.length - 1, current + 1),
                  )
                }
              >
                Next Question →
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className={`determination shell ${classification.tone}`}>
        <div className="determinationHeader">
          <div>
            <p className="eyebrow">CURRENT BOUNDED DETERMINATION</p>
            <span className="statusBadge">{classification.status}</span>
            <h2>{classification.label}</h2>
            <p>{classification.summary}</p>
          </div>

          <div className="determinationScore">
            <strong>{progress}%</strong>
            <span>PATHWAY COMPLETION</span>
          </div>
        </div>

        <div className="determinationBody">
          <article>
            <span>RELEVANT LEGAL PATHWAYS</span>
            <ul>
              {classification.articles.map((article) => (
                <li key={article}>{article}</li>
              ))}
            </ul>
          </article>

          <article>
            <span>EVIDENCE STILL REQUIRED</span>
            <ul>
              {classification.evidence.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>

        <div className="determinationActions">
          {classification.nextLinks.map((link) => (
            <Link href={link.href} key={link.title}>
              {link.title}
              <span>→</span>
            </Link>
          ))}
          <Link
            href={`/workspace/routes/new?framework=eu-ai-act&classification=${classification.id}`}
          >
            Build Governance Route
            <span>→</span>
          </Link>
        </div>
      </section>

      <section className="decisionTree shell">
        <div className="sectionIntro">
          <p className="eyebrow">VISIBLE DECISION PATH</p>
          <h2>See how the route reached its current signal.</h2>
          <p>
            This tree does not hide unanswered questions. Each branch remains
            visible as declared yes, declared no, unresolved, or not yet
            answered.
          </p>
        </div>

        <div className="tree">
          {questions.map((question, index) => {
            const answer = answers[question.id];

            return (
              <div className="treeRow" key={question.id}>
                <div className="treeNode">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{question.title}</strong>
                </div>
                <div className={`treeAnswer ${answer || "empty"}`}>
                  {answer
                    ? answer === "yes"
                      ? "YES"
                      : answer === "no"
                        ? "NO"
                        : "UNKNOWN"
                    : "NOT ANSWERED"}
                </div>
                {index < questions.length - 1 && <i />}
              </div>
            );
          })}
        </div>
      </section>

      <section className="separation shell">
        <div className="sectionIntro">
          <p className="eyebrow">TA-14 SEPARATION DISCIPLINE</p>
          <h2>Do not collapse the evidence into the conclusion.</h2>
        </div>

        <div className="separationGrid">
          {[
            [
              "01",
              "Declared Facts",
              "What the organisation or operator states about the system, role, use case, and context.",
            ],
            [
              "02",
              "Supporting Evidence",
              "Documents, architecture, tests, interfaces, logs, contracts, records, and source material.",
            ],
            [
              "03",
              "Assumptions",
              "Statements used provisionally but not yet established by admissible evidence.",
            ],
            [
              "04",
              "Unresolved Questions",
              "Missing, disputed, stale, inaccessible, or authority-dependent facts.",
            ],
            [
              "05",
              "Classification Rule",
              "The legal condition, category, exception, or guidance being applied.",
            ],
            [
              "06",
              "Bounded Determination",
              "The classification supported by the present evidence, with limits and review status preserved.",
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

      <section className="connectedRoutes shell">
        <div className="sectionIntro">
          <p className="eyebrow">CONNECTED REQUIREMENT ROUTES</p>
          <h2>Continue from classification into implementation.</h2>
        </div>

        <div className="routeGrid">
          {[
            [
              "Prohibited Practices",
              "/eu-ai-act/requirements/prohibited-practices",
              "Map the exact prohibited-practice condition, exception, evidence, and escalation boundary.",
            ],
            [
              "High-Risk AI Systems",
              "/eu-ai-act/requirements/high-risk",
              "Open provider, deployer, conformity, risk, data, oversight, logging, and monitoring duties.",
            ],
            [
              "Article 50 Transparency",
              "/eu-ai-act/requirements/article-50",
              "Map interaction disclosure, synthetic-content marking, notices, deepfakes, and public-interest text.",
            ],
            [
              "General-Purpose AI",
              "/eu-ai-act/requirements/gpai",
              "Separate model-provider duties, systemic-risk pathways, and downstream information.",
            ],
            [
              "Human Oversight",
              "/eu-ai-act/requirements/human-oversight",
              "Define accountable human authority, intervention, suspension, override, and escalation.",
            ],
            [
              "Technical Documentation",
              "/eu-ai-act/requirements/technical-documentation",
              "Bind identity, purpose, architecture, data, tests, versions, limitations, and changes.",
            ],
          ].map(([title, href, description]) => (
            <Link href={href} key={title}>
              <span>OPEN PATHWAY</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <div>
                Explore Requirement
                <b>→</b>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="finalCta shell">
        <div>
          <p className="eyebrow">PRESERVE THE CLASSIFICATION</p>
          <h2>A classification without its evidence route is only a claim.</h2>
          <p>
            Create a dated record containing the subject, role, use case,
            answers, evidence, exclusions, unresolved questions, reviewer
            status, and current bounded determination.
          </p>
        </div>

        <div className="finalActions">
          <Link
            className="primaryButton"
            href={`/workspace/governed-records/builder?framework=eu-ai-act&record=Risk%20Classification%20Record&classification=${classification.id}`}
          >
            Create Classification Record
            <span>→</span>
          </Link>
          <Link
            className="secondaryButton"
            href="/workspace/entity-review/eu-ai-act?scope=risk-classification"
          >
            Request Independent Review
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
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          background: #030914;
          scroll-behavior: smooth;
        }

        :global(body) {
          margin: 0;
          color: #f4f9ff;
          background:
            radial-gradient(circle at 9% 4%, rgba(41, 143, 208, 0.14), transparent 28%),
            radial-gradient(circle at 91% 27%, rgba(224, 163, 38, 0.08), transparent 28%),
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
            radial-gradient(circle, rgba(77,185,255,.65) 0 1px, transparent 1.5px);
          background-size: 174px 174px;
          background-position: 41px 63px;
          animation: starMoveReverse 58s linear infinite;
        }

        .movingLine {
          position: absolute;
          width: 72vw;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(81, 189, 240, .46), transparent);
        }

        .lineOne {
          left: -24%;
          top: 25%;
          transform: rotate(11deg);
          animation: lineMove 18s linear infinite;
        }

        .lineTwo {
          right: -25%;
          top: 68%;
          transform: rotate(-9deg);
          animation: lineMoveReverse 24s linear infinite;
        }

        .orbital {
          position: absolute;
          width: 250px;
          height: 250px;
          border-radius: 999px;
          border: 1px solid rgba(88, 185, 231, .16);
          animation: orbital 20s linear infinite;
        }

        .orbital i {
          position: absolute;
          right: -7px;
          top: 50%;
          width: 14px;
          height: 14px;
          border-radius: 999px;
          background: #69ccfa;
          box-shadow: 0 0 18px #69ccfa;
        }

        .orbitalOne {
          right: 3%;
          top: 9%;
        }

        .orbitalTwo {
          left: 3%;
          bottom: 7%;
          width: 190px;
          height: 190px;
          border-color: rgba(255, 190, 66, .18);
          animation-direction: reverse;
          animation-duration: 16s;
        }

        .orbitalTwo i {
          background: #ffc653;
          box-shadow: 0 0 18px #ffc653;
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

        nav a.active {
          color: #f7d687;
        }

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

        .breadcrumbs strong {
          color: #dbe8ef;
        }

        .hero {
          min-height: 530px;
          display: grid;
          grid-template-columns: 1.15fr .85fr;
          gap: 48px;
          align-items: center;
          padding: 54px 0 70px;
        }

        .eyebrow {
          margin: 0;
          color: #6dd2f5;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: .18em;
        }

        h1 {
          max-width: 850px;
          margin: 16px 0 0;
          font-size: clamp(54px, 7.7vw, 98px);
          line-height: .94;
          letter-spacing: -.065em;
        }

        h1 em {
          color: #ffc84f;
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 500;
        }

        .lead {
          max-width: 820px;
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

        .resultPreview,
        .boundary,
        .classificationWorkspace,
        .determination,
        .decisionTree,
        .separation,
        .connectedRoutes,
        .finalCta {
          border: 1px solid rgba(111, 163, 190, .15);
          background:
            linear-gradient(180deg, rgba(10, 24, 35, .93), rgba(5, 12, 19, .97));
          border-radius: 24px;
          box-shadow: 0 22px 65px rgba(0,0,0,.23);
        }

        .resultPreview {
          padding: 32px;
        }

        .resultPreview.blue,
        .determination.blue {
          border-color: rgba(89, 190, 239, .28);
        }

        .resultPreview.gold,
        .determination.gold {
          border-color: rgba(255, 192, 67, .31);
        }

        .resultPreview.red,
        .determination.red {
          border-color: rgba(255, 91, 91, .34);
        }

        .resultPreview.purple,
        .determination.purple {
          border-color: rgba(192, 106, 255, .31);
        }

        .resultPreview.amber,
        .determination.amber {
          border-color: rgba(255, 171, 64, .3);
        }

        .resultPreview.green,
        .determination.green {
          border-color: rgba(91, 218, 159, .28);
        }

        .previewLabel {
          color: #8199a7;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .16em;
        }

        .resultPreview > strong {
          display: inline-flex;
          margin-top: 18px;
          padding: 7px 10px;
          border-radius: 999px;
          color: #ffd67d;
          background: rgba(255, 190, 62, .08);
          font-size: 10px;
          letter-spacing: .12em;
        }

        .resultPreview h2 {
          margin: 17px 0 10px;
          font-size: 39px;
          line-height: 1.05;
          letter-spacing: -.04em;
        }

        .resultPreview > p {
          color: #a9bbc5;
          line-height: 1.62;
        }

        .previewProgress {
          margin-top: 26px;
          padding-top: 20px;
          border-top: 1px solid rgba(106, 161, 188, .14);
        }

        .previewProgress > div:first-child {
          display: flex;
          justify-content: space-between;
          color: #8fa6b2;
          font-size: 12px;
        }

        .previewProgress strong {
          color: #dbe9ef;
        }

        .progressTrack {
          height: 8px;
          margin-top: 10px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255,255,255,.05);
        }

        .progressTrack i {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #60c9f5, #ffd25f);
          transition: width 260ms ease;
        }

        .boundary {
          padding: 25px 30px;
          display: grid;
          grid-template-columns: .8fr 1.2fr;
          gap: 32px;
          align-items: center;
          border-color: rgba(255, 190, 61, .21);
        }

        .boundary div span {
          display: block;
          color: #ffc554;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .15em;
        }

        .boundary div strong {
          display: block;
          margin-top: 8px;
          font-size: 20px;
        }

        .boundary p {
          margin: 0;
          color: #b9aa8e;
          line-height: 1.62;
        }

        .categoryMap {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
          margin-top: 20px;
        }

        .categoryMap article {
          min-height: 122px;
          padding: 18px;
          border-radius: 16px;
          border: 1px solid rgba(105, 164, 192, .14);
          background: rgba(11, 27, 38, .88);
        }

        .categoryMap article.red {
          border-color: rgba(255, 91, 91, .22);
        }

        .categoryMap article.gold {
          border-color: rgba(255, 193, 68, .22);
        }

        .categoryMap article.blue {
          border-color: rgba(87, 192, 241, .22);
        }

        .categoryMap article.purple {
          border-color: rgba(190, 105, 255, .22);
        }

        .categoryMap article.amber {
          border-color: rgba(255, 170, 61, .22);
        }

        .categoryMap span {
          color: #6dd2f5;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .14em;
        }

        .categoryMap strong {
          display: block;
          margin-top: 17px;
          font-size: 18px;
        }

        .categoryMap p {
          margin: 5px 0 0;
          color: #8ea4b0;
          font-size: 12px;
        }

        .classificationWorkspace,
        .determination,
        .decisionTree,
        .separation,
        .connectedRoutes {
          margin-top: 20px;
          padding: 42px;
        }

        .workflowHeader {
          display: flex;
          justify-content: space-between;
          gap: 30px;
          align-items: end;
        }

        .workflowHeader > div {
          max-width: 850px;
        }

        .workflowHeader h2,
        .determinationHeader h2,
        .sectionIntro h2,
        .finalCta h2 {
          margin: 10px 0 0;
          font-size: clamp(34px, 4.8vw, 56px);
          line-height: 1.02;
          letter-spacing: -.05em;
        }

        .workflowHeader p:not(.eyebrow),
        .sectionIntro p:not(.eyebrow),
        .determinationHeader p,
        .finalCta p:not(.eyebrow) {
          color: #9fb3c0;
          line-height: 1.68;
        }

        .workflowHeader > button {
          min-height: 44px;
          padding: 0 15px;
          border-radius: 11px;
          border: 1px solid rgba(255, 190, 65, .23);
          color: #ffd67e;
          background: rgba(108, 69, 6, .08);
          font: inherit;
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
        }

        .classificationLayout {
          display: grid;
          grid-template-columns: .82fr 1.18fr;
          gap: 18px;
          margin-top: 28px;
        }

        .questionRail {
          display: grid;
          gap: 9px;
        }

        .questionRail > button {
          width: 100%;
          min-height: 84px;
          padding: 13px;
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

        .questionRail > button.selected {
          border-color: rgba(105, 206, 244, .42);
          background: rgba(39, 119, 151, .09);
        }

        .questionRail > button > span {
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

        .questionRail strong,
        .questionRail small {
          display: block;
        }

        .questionRail strong {
          font-size: 12px;
          line-height: 1.35;
        }

        .questionRail small {
          margin-top: 5px;
          color: #718b99;
          font-size: 10px;
        }

        .questionRail i {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #ffc452;
          box-shadow: 0 0 10px rgba(255, 190, 61, .5);
        }

        .questionRail i.no {
          background: #8ca1ac;
          box-shadow: none;
        }

        .questionRail i.unknown {
          background: #ff9f4a;
        }

        .questionRail i.empty {
          background: #334b58;
          box-shadow: none;
        }

        .activeQuestion {
          min-height: 560px;
          padding: 30px;
          border-radius: 20px;
          border: 1px solid rgba(255, 191, 66, .17);
          background:
            radial-gradient(circle at 50% 0%, rgba(255, 183, 38, .05), transparent 33%),
            rgba(10, 18, 23, .88);
        }

        .questionNumber {
          color: #ffc750;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .15em;
        }

        .activeQuestion h3 {
          max-width: 760px;
          margin: 18px 0 12px;
          font-size: clamp(29px, 4vw, 44px);
          line-height: 1.07;
          letter-spacing: -.04em;
        }

        .questionHelp {
          color: #a6b8c2;
          line-height: 1.62;
        }

        .answerGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 11px;
          margin-top: 28px;
        }

        .answerGrid button {
          min-height: 142px;
          padding: 18px;
          border-radius: 15px;
          border: 1px solid rgba(103, 175, 207, .14);
          color: inherit;
          background: rgba(31, 88, 113, .035);
          text-align: left;
          cursor: pointer;
        }

        .answerGrid button.chosen {
          border-color: rgba(103, 205, 244, .48);
          background: rgba(46, 133, 168, .11);
          box-shadow: 0 0 24px rgba(70, 174, 216, .08);
        }

        .answerGrid span {
          color: #e7f4fa;
          font-size: 18px;
          font-weight: 900;
        }

        .answerGrid p {
          margin: 10px 0 0;
          color: #8299a5;
          font-size: 12px;
          line-height: 1.5;
        }

        .evidencePrompt {
          margin-top: 18px;
          padding: 18px;
          border-radius: 15px;
          border: 1px solid rgba(255, 191, 66, .16);
          background: rgba(116, 72, 5, .055);
        }

        .evidencePrompt span {
          color: #ffc750;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: .14em;
        }

        .evidencePrompt p {
          margin: 9px 0 0;
          color: #c7b996;
          line-height: 1.55;
        }

        .questionNavigation {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-top: 22px;
        }

        .questionNavigation button {
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

        .questionNavigation button:disabled {
          opacity: .35;
          cursor: not-allowed;
        }

        .determination {
          border-width: 2px;
        }

        .determinationHeader {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 30px;
          align-items: center;
        }

        .statusBadge {
          display: inline-flex;
          margin-top: 18px;
          padding: 7px 10px;
          border-radius: 999px;
          color: #ffd27a;
          background: rgba(255, 190, 62, .08);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .12em;
        }

        .determinationHeader > div:first-child {
          max-width: 860px;
        }

        .determinationScore {
          width: 170px;
          height: 170px;
          display: grid;
          place-content: center;
          border-radius: 999px;
          border: 2px solid rgba(104, 205, 244, .27);
          background: radial-gradient(circle, rgba(57, 144, 180, .12), transparent 65%);
          text-align: center;
        }

        .determinationScore strong {
          font-size: 42px;
        }

        .determinationScore span {
          margin-top: 3px;
          color: #7f98a6;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: .14em;
        }

        .determinationBody {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-top: 28px;
        }

        .determinationBody article {
          padding: 22px;
          border-radius: 16px;
          border: 1px solid rgba(101, 173, 204, .13);
          background: rgba(31, 85, 108, .035);
        }

        .determinationBody article > span {
          color: #6dd2f5;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: .14em;
        }

        .determinationBody ul {
          display: grid;
          gap: 9px;
          margin: 17px 0 0;
          padding-left: 18px;
          color: #c4d2da;
        }

        .determinationBody li {
          line-height: 1.45;
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

        .sectionIntro {
          max-width: 900px;
        }

        .tree {
          margin-top: 28px;
        }

        .treeRow {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 150px;
          gap: 16px;
          align-items: center;
          padding-bottom: 28px;
        }

        .treeNode {
          min-height: 72px;
          padding: 15px;
          display: grid;
          grid-template-columns: 36px 1fr;
          gap: 13px;
          align-items: center;
          border-radius: 14px;
          border: 1px solid rgba(101, 177, 209, .14);
          background: rgba(34, 93, 118, .04);
        }

        .treeNode span {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          color: #68cff3;
          background: rgba(55, 149, 186, .08);
          font-size: 10px;
          font-weight: 950;
        }

        .treeAnswer {
          min-height: 44px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          color: #6ee0b4;
          border: 1px solid rgba(84, 212, 158, .22);
          background: rgba(50, 149, 108, .06);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .11em;
        }

        .treeAnswer.no {
          color: #aebdc5;
          border-color: rgba(151, 174, 184, .18);
          background: rgba(111, 133, 143, .05);
        }

        .treeAnswer.unknown {
          color: #ffbd72;
          border-color: rgba(255, 166, 72, .24);
          background: rgba(166, 91, 23, .06);
        }

        .treeAnswer.empty {
          color: #6f8591;
          border-color: rgba(104, 133, 147, .14);
          background: rgba(68, 91, 102, .04);
        }

        .treeRow > i {
          position: absolute;
          left: 33px;
          bottom: 4px;
          width: 1px;
          height: 22px;
          background: linear-gradient(180deg, #52b8df, transparent);
        }

        .separationGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 13px;
          margin-top: 28px;
        }

        .separationGrid article {
          min-height: 190px;
          padding: 21px;
          border-radius: 16px;
          border: 1px solid rgba(101, 176, 209, .14);
          background: rgba(31, 87, 111, .04);
        }

        .separationGrid span {
          color: #6dd2f5;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .14em;
        }

        .separationGrid h3 {
          margin: 17px 0 9px;
          font-size: 21px;
        }

        .separationGrid p {
          margin: 0;
          color: #9fb1bc;
          line-height: 1.55;
        }

        .routeGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 13px;
          margin-top: 28px;
        }

        .routeGrid > a {
          min-height: 260px;
          padding: 21px;
          display: flex;
          flex-direction: column;
          border-radius: 17px;
          border: 1px solid rgba(255, 189, 66, .16);
          color: inherit;
          background:
            radial-gradient(circle at 50% 0%, rgba(255, 182, 38, .055), transparent 34%),
            rgba(12, 19, 22, .86);
          text-decoration: none;
          transition: transform 180ms ease, border-color 180ms ease;
        }

        .routeGrid > a:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 194, 74, .5);
        }

        .routeGrid > a > span {
          color: #ffc955;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: .15em;
        }

        .routeGrid h3 {
          margin: 16px 0 10px;
          font-size: 23px;
        }

        .routeGrid p {
          margin: 0;
          color: #a8b8c1;
          line-height: 1.55;
        }

        .routeGrid > a > div {
          margin-top: auto;
          padding-top: 18px;
          display: flex;
          justify-content: space-between;
          color: #ffd270;
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
          border-color: rgba(101, 190, 227, .21);
        }

        .finalCta > div:first-child {
          max-width: 730px;
        }

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

        footer strong {
          color: #a6bac5;
        }

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

        @keyframes lineMove {
          from { transform: translateX(-35vw) rotate(11deg); opacity: 0; }
          18% { opacity: .5; }
          82% { opacity: .3; }
          to { transform: translateX(105vw) rotate(11deg); opacity: 0; }
        }

        @keyframes lineMoveReverse {
          from { transform: translateX(35vw) rotate(-9deg); opacity: 0; }
          18% { opacity: .45; }
          82% { opacity: .28; }
          to { transform: translateX(-105vw) rotate(-9deg); opacity: 0; }
        }

        @keyframes orbital {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1060px) {
          nav {
            display: none;
          }

          .topbar {
            grid-template-columns: 1fr auto;
          }

          .hero,
          .classificationLayout {
            grid-template-columns: 1fr;
          }

          .categoryMap {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .routeGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .shell {
            width: min(100% - 20px, 1280px);
          }

          .brand small,
          .headerButton span {
            display: none;
          }

          .hero {
            min-height: auto;
            padding: 42px 0 56px;
          }

          .boundary,
          .determinationHeader,
          .determinationBody {
            grid-template-columns: 1fr;
          }

          .categoryMap,
          .answerGrid,
          .separationGrid,
          .routeGrid {
            grid-template-columns: 1fr;
          }

          .workflowHeader,
          .finalCta {
            flex-direction: column;
            align-items: flex-start;
          }

          .classificationWorkspace,
          .determination,
          .decisionTree,
          .separation,
          .connectedRoutes,
          .finalCta {
            padding: 28px 22px;
          }

          .determinationScore {
            width: 130px;
            height: 130px;
          }

          .treeRow {
            grid-template-columns: 1fr;
          }

          .treeRow > i {
            display: none;
          }

          .finalActions {
            justify-content: flex-start;
          }

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
