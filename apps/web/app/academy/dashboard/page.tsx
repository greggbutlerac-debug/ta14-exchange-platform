'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Lesson = {
  number: string;
  title: string;
  href: string;
  description: string;
};

const lessons: Lesson[] = [
  {
    number: '01',
    title: 'What Is a Governance Route?',
    href: '/academy/what-is-a-route',
    description: 'Learn why a governed route is more than a workflow.',
  },
  {
    number: '02',
    title: 'Reality and Record',
    href: '/academy/reality-and-record',
    description: 'Separate what is true from what has been preserved about it.',
  },
  {
    number: '03',
    title: 'Continuity',
    href: '/academy/continuity',
    description: 'Protect the chain between evidence, determination, and action.',
  },
  {
    number: '04',
    title: 'Admissibility',
    href: '/academy/admissibility',
    description: 'Determine whether an execution has earned the right to proceed.',
  },
  {
    number: '05',
    title: 'Authority and Binding',
    href: '/academy/authority-and-binding',
    description: 'Validate who may authorize consequence and within what boundary.',
  },
  {
    number: '06',
    title: 'Commit and Version History',
    href: '/academy/commit-and-version-history',
    description: 'Preserve the authorized state that execution is permitted to use.',
  },
  {
    number: '07',
    title: 'Execution Correspondence',
    href: '/academy/execution-correspondence',
    description: 'Test whether execution still corresponds to the approved determination.',
  },
  {
    number: '08',
    title: 'Outcome and Verification',
    href: '/academy/outcome-and-verification',
    description: 'Preserve what happened and make the result challengeable.',
  },
];

const STORAGE_KEY = 'ta14-academy-completed-lessons-v1';

function readCompletedLessons(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === 'string')
      : [];
  } catch {
    return [];
  }
}

const controlCards = [
  {
    eyebrow: 'Practice',
    title: 'Execution Simulator',
    description:
      'Test evidence, authority, continuity, boundaries, and dependencies before consequence occurs.',
    href: '/academy/simulator',
    action: 'Open simulator',
  },
  {
    eyebrow: 'Challenge',
    title: 'Review Workspace',
    description:
      'Record governed findings, classify severity, and preserve a challengeable review record.',
    href: '/academy/review',
    action: 'Open review',
  },
  {
    eyebrow: 'Demonstrate',
    title: 'Assessment Center',
    description:
      'Validate understanding through scenario-based questions and competency evidence.',
    href: '/academy/assessment',
    action: 'Open assessment',
  },
];

export default function AcademyDashboardPage() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCompletedLessons(readCompletedLessons());
    setHydrated(true);
  }, []);

  const completedCount = useMemo(
    () =>
      lessons.filter((lesson) => completedLessons.includes(lesson.href)).length,
    [completedLessons],
  );

  const progress = Math.round((completedCount / lessons.length) * 100);
  const nextLesson =
    lessons.find((lesson) => !completedLessons.includes(lesson.href)) ??
    lessons[lessons.length - 1];

  return (
    <main className="missionControl">
      <div className="cosmos" aria-hidden="true">
        <span className="glow glowOne" />
        <span className="glow glowTwo" />
        <span className="stars starsOne" />
        <span className="stars starsTwo" />
      </div>

      <header className="topbar">
        <Link className="brand" href="/academy">
          <span className="mark">TA-14</span>
          <span>
            <strong>Academy Mission Control</strong>
            <small>Seventh major door of the Exchange</small>
          </span>
        </Link>

        <nav aria-label="Mission Control navigation">
          <Link href="/academy">Academy</Link>
          <Link href="/workspace/build">Route Builder</Link>
          <Link href="/verify">Verification</Link>
        </nav>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">TA-14 Academy · Mission Control</p>
          <h1>Continue the work from one governed center.</h1>
          <p className="heroCopy">
            Resume learning, move into practice, challenge a determination, or
            demonstrate competency without duplicating the authoritative systems
            already inside the Exchange.
          </p>
        </div>

        <aside className="principle">
          <span>Governing principle</span>
          <strong>No admissible evidence. No admissible execution.</strong>
        </aside>
      </section>

      <section className="overviewGrid" aria-label="Academy progress overview">
        <article className="primaryPanel">
          <div className="panelHeading">
            <div>
              <p className="eyebrow">Resume learning</p>
              <h2>{nextLesson.title}</h2>
            </div>
            <span className="lessonNumber">{nextLesson.number}</span>
          </div>

          <p>{nextLesson.description}</p>

          <div className="meterCopy">
            <span>Academy progress</span>
            <strong>{hydrated ? `${progress}%` : '—'}</strong>
          </div>
          <div className="meter" aria-label={`${progress}% complete`}>
            <span style={{ width: hydrated ? `${progress}%` : '0%' }} />
          </div>

          <div className="panelActions">
            <Link className="primaryButton" href={nextLesson.href}>
              Continue lesson <b aria-hidden="true">→</b>
            </Link>
            <Link className="secondaryButton" href="/academy/start">
              Revisit orientation
            </Link>
          </div>
        </article>

        <article className="statusPanel">
          <p className="eyebrow">Current pathway</p>
          <h2>Execution Admissibility Foundations</h2>
          <dl>
            <div>
              <dt>Lessons complete</dt>
              <dd>{hydrated ? `${completedCount} of ${lessons.length}` : '—'}</dd>
            </div>
            <div>
              <dt>Training mode</dt>
              <dd>Self-directed</dd>
            </div>
            <div>
              <dt>Credential status</dt>
              <dd>Not yet evaluated</dd>
            </div>
          </dl>
          <p className="boundaryNotice">
            Completion records learning activity. It does not create execution
            authority or independently establish competency.
          </p>
        </article>
      </section>

      <section className="sectionBlock">
        <div className="sectionHeading">
          <div>
            <p className="eyebrow">Learning pathway</p>
            <h2>Eight visible anchors. One continuous governing movement.</h2>
          </div>
          <p>
            These lessons orient the public eight-anchor chain while preserving
            the distinction from TA-14&apos;s complete 24-link runtime architecture.
          </p>
        </div>

        <div className="lessonGrid">
          {lessons.map((lesson) => {
            const complete = completedLessons.includes(lesson.href);

            return (
              <Link className="lessonCard" href={lesson.href} key={lesson.href}>
                <div className="lessonTopline">
                  <span>{lesson.number}</span>
                  <small className={complete ? 'complete' : ''}>
                    {complete ? 'Complete' : 'Available'}
                  </small>
                </div>
                <h3>{lesson.title}</h3>
                <p>{lesson.description}</p>
                <b>Open lesson →</b>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="sectionBlock">
        <div className="sectionHeading compact">
          <div>
            <p className="eyebrow">Practice and proof</p>
            <h2>Move from understanding into governed action.</h2>
          </div>
        </div>

        <div className="controlGrid">
          {controlCards.map((card) => (
            <article className="controlCard" key={card.title}>
              <p className="eyebrow">{card.eyebrow}</p>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <Link href={card.href}>{card.action} →</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="exchangeBand">
        <div>
          <p className="eyebrow">Connected Exchange systems</p>
          <h2>The Academy teaches. The authoritative systems remain authoritative.</h2>
        </div>
        <div className="exchangeLinks">
          <Link href="/workspace/build">Build a governed route</Link>
          <Link href="/registry">Open the Registry</Link>
          <Link href="/verify">Verify a record</Link>
        </div>
      </section>

      <style jsx>{`
        .missionControl {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: #eff8ff;
          background:
            radial-gradient(circle at 12% 12%, rgba(44, 194, 255, .12), transparent 30%),
            radial-gradient(circle at 88% 24%, rgba(103, 74, 255, .13), transparent 32%),
            linear-gradient(180deg, #02070d 0%, #07111d 52%, #030910 100%);
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        }

        .cosmos,
        .glow,
        .stars {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .glow {
          width: 360px;
          height: 360px;
          border-radius: 50%;
          filter: blur(70px);
          opacity: .18;
        }

        .glowOne {
          inset: 18% auto auto -120px;
          background: #43e3ff;
        }

        .glowTwo {
          inset: auto -130px 8% auto;
          background: #7258ff;
        }

        .stars {
          opacity: .34;
          background-image:
            radial-gradient(circle, rgba(255,255,255,.76) 0 1px, transparent 1.2px),
            radial-gradient(circle, rgba(104,230,255,.48) 0 1px, transparent 1.2px);
          background-size: 170px 170px, 250px 250px;
          background-position: 0 0, 60px 80px;
        }

        .starsTwo {
          opacity: .17;
          transform: scale(1.1);
          background-size: 310px 310px, 410px 410px;
        }

        .topbar,
        .hero,
        .overviewGrid,
        .sectionBlock,
        .exchangeBand {
          position: relative;
          z-index: 2;
          width: min(1180px, calc(100% - 40px));
          margin-inline: auto;
        }

        .topbar {
          min-height: 84px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          border-bottom: 1px solid rgba(123, 169, 205, .14);
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 13px;
          color: inherit;
          text-decoration: none;
        }

        .mark {
          display: grid;
          place-items: center;
          min-width: 58px;
          height: 38px;
          border: 1px solid rgba(84, 232, 255, .42);
          border-radius: 12px;
          color: #80efff;
          background: rgba(84, 232, 255, .08);
          font-size: .76rem;
          font-weight: 950;
          letter-spacing: .08em;
        }

        .brand strong,
        .brand small {
          display: block;
        }

        .brand strong {
          font-size: .96rem;
        }

        .brand small {
          margin-top: 3px;
          color: #8197aa;
          font-size: .7rem;
        }

        nav {
          display: flex;
          gap: 22px;
        }

        nav a {
          color: #a9bdcd;
          font-size: .82rem;
          font-weight: 800;
          text-decoration: none;
        }

        nav a:hover {
          color: #73eaff;
        }

        .hero {
          display: grid;
          grid-template-columns: 1.35fr .65fr;
          gap: 54px;
          align-items: end;
          padding: 76px 0 48px;
        }

        .eyebrow {
          margin: 0 0 11px;
          color: #5ce8ff;
          font-size: .7rem;
          font-weight: 950;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        h1,
        h2,
        h3,
        p {
          margin-top: 0;
        }

        h1 {
          max-width: 760px;
          margin-bottom: 20px;
          font-size: clamp(2.8rem, 6vw, 5.4rem);
          line-height: .97;
          letter-spacing: -.055em;
        }

        .heroCopy {
          max-width: 750px;
          margin-bottom: 0;
          color: #a9bdcd;
          font-size: 1.04rem;
          line-height: 1.75;
        }

        .principle {
          padding: 23px;
          border: 1px solid rgba(84, 232, 255, .22);
          border-radius: 22px;
          background: rgba(3, 14, 24, .76);
          box-shadow: 0 20px 70px rgba(0,0,0,.25);
        }

        .principle span {
          display: block;
          margin-bottom: 8px;
          color: #7f96a9;
          font-size: .68rem;
          font-weight: 900;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .principle strong {
          font-size: 1.03rem;
          line-height: 1.45;
        }

        .overviewGrid {
          display: grid;
          grid-template-columns: 1.35fr .65fr;
          gap: 22px;
          padding-bottom: 70px;
        }

        .primaryPanel,
        .statusPanel,
        .lessonCard,
        .controlCard {
          border: 1px solid rgba(125, 170, 205, .16);
          background: linear-gradient(180deg, rgba(11, 27, 43, .82), rgba(4, 13, 23, .86));
          box-shadow: 0 24px 80px rgba(0,0,0,.22);
          backdrop-filter: blur(16px);
        }

        .primaryPanel,
        .statusPanel {
          border-radius: 26px;
          padding: 28px;
        }

        .panelHeading {
          display: flex;
          justify-content: space-between;
          gap: 24px;
          align-items: flex-start;
        }

        .panelHeading h2,
        .statusPanel h2,
        .sectionHeading h2,
        .exchangeBand h2 {
          margin-bottom: 12px;
          font-size: clamp(1.55rem, 3vw, 2.4rem);
          line-height: 1.08;
          letter-spacing: -.035em;
        }

        .primaryPanel > p,
        .sectionHeading > p,
        .controlCard > p,
        .lessonCard > p {
          color: #96aabd;
          line-height: 1.65;
        }

        .lessonNumber {
          color: #5ce8ff;
          font-size: 2rem;
          font-weight: 950;
          opacity: .72;
        }

        .meterCopy {
          display: flex;
          justify-content: space-between;
          margin: 28px 0 9px;
          color: #9fb3c5;
          font-size: .78rem;
          font-weight: 850;
        }

        .meter {
          height: 8px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(127, 166, 198, .13);
        }

        .meter span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #54e8ff, #39f2a1);
          box-shadow: 0 0 16px rgba(57, 242, 161, .4);
          transition: width .35s ease;
        }

        .panelActions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 25px;
        }

        .primaryButton,
        .secondaryButton {
          display: inline-flex;
          align-items: center;
          gap: 16px;
          min-height: 46px;
          padding: 0 17px;
          border-radius: 13px;
          font-size: .82rem;
          font-weight: 900;
          text-decoration: none;
        }

        .primaryButton {
          color: #021018;
          background: linear-gradient(90deg, #65eaff, #3df2a4);
        }

        .secondaryButton {
          border: 1px solid rgba(137, 180, 214, .20);
          color: #dbe9f4;
          background: rgba(255,255,255,.03);
        }

        .statusPanel dl {
          margin: 24px 0;
        }

        .statusPanel dl div {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          padding: 13px 0;
          border-bottom: 1px solid rgba(125, 170, 205, .11);
        }

        .statusPanel dt {
          color: #8499ac;
          font-size: .78rem;
          font-weight: 800;
        }

        .statusPanel dd {
          margin: 0;
          color: #e9f5fd;
          font-size: .8rem;
          font-weight: 900;
          text-align: right;
        }

        .boundaryNotice {
          margin-bottom: 0;
          padding: 15px;
          border: 1px solid rgba(255, 194, 82, .18);
          border-radius: 14px;
          color: #d7c9a7;
          background: rgba(255, 194, 82, .05);
          font-size: .77rem;
          line-height: 1.55;
        }

        .sectionBlock {
          padding: 72px 0;
          border-top: 1px solid rgba(125, 170, 205, .12);
        }

        .sectionHeading {
          display: grid;
          grid-template-columns: 1.25fr .75fr;
          gap: 42px;
          align-items: end;
          margin-bottom: 30px;
        }

        .sectionHeading.compact {
          grid-template-columns: 1fr;
        }

        .sectionHeading > p {
          margin-bottom: 0;
          font-size: .92rem;
        }

        .lessonGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .lessonCard {
          min-height: 245px;
          padding: 21px;
          border-radius: 20px;
          color: inherit;
          text-decoration: none;
          transition: transform .2s ease, border-color .2s ease, background .2s ease;
        }

        .lessonCard:hover {
          transform: translateY(-4px);
          border-color: rgba(84, 232, 255, .40);
          background: linear-gradient(180deg, rgba(16, 38, 58, .92), rgba(5, 16, 27, .92));
        }

        .lessonTopline {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .lessonTopline span {
          color: #5ce8ff;
          font-weight: 950;
        }

        .lessonTopline small {
          padding: 5px 8px;
          border-radius: 999px;
          color: #9eb2c3;
          background: rgba(255,255,255,.04);
          font-size: .62rem;
          font-weight: 900;
        }

        .lessonTopline small.complete {
          color: #66f2b3;
          background: rgba(57, 242, 161, .08);
        }

        .lessonCard h3,
        .controlCard h3 {
          margin-bottom: 10px;
          font-size: 1.12rem;
          line-height: 1.25;
        }

        .lessonCard > p,
        .controlCard > p {
          font-size: .82rem;
        }

        .lessonCard > b {
          display: block;
          margin-top: 20px;
          color: #64e9ff;
          font-size: .76rem;
        }

        .controlGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .controlCard {
          padding: 25px;
          border-radius: 22px;
        }

        .controlCard a {
          display: inline-block;
          margin-top: 12px;
          color: #65e9ff;
          font-size: .8rem;
          font-weight: 900;
          text-decoration: none;
        }

        .exchangeBand {
          display: grid;
          grid-template-columns: 1.25fr .75fr;
          gap: 40px;
          align-items: center;
          margin-bottom: 72px;
          padding: 34px;
          border: 1px solid rgba(84, 232, 255, .18);
          border-radius: 26px;
          background:
            radial-gradient(circle at 100% 0%, rgba(84, 232, 255, .10), transparent 35%),
            rgba(5, 17, 29, .82);
        }

        .exchangeLinks {
          display: grid;
          gap: 10px;
        }

        .exchangeLinks a {
          padding: 13px 15px;
          border: 1px solid rgba(126, 172, 207, .16);
          border-radius: 13px;
          color: #dcebf5;
          background: rgba(255,255,255,.03);
          font-size: .8rem;
          font-weight: 850;
          text-decoration: none;
        }

        @media (max-width: 980px) {
          .hero,
          .overviewGrid,
          .sectionHeading,
          .exchangeBand {
            grid-template-columns: 1fr;
          }

          .lessonGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 720px) {
          .topbar {
            align-items: flex-start;
            padding: 18px 0;
          }

          nav {
            display: none;
          }

          .hero {
            padding-top: 54px;
          }

          .lessonGrid,
          .controlGrid {
            grid-template-columns: 1fr;
          }

          .panelHeading {
            align-items: center;
          }
        }
      `}</style>
    </main>
  );
}
