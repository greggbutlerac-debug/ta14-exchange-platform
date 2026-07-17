'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';

type AcademyLesson = {
  number: string;
  title: string;
  href: string;
  status: 'live' | 'planned';
  labHref?: string;
};

const lessons: AcademyLesson[] = [
  {
    number: '01',
    title: 'What Is a Governance Route?',
    href: '/academy/what-is-a-route',
    status: 'live',
    labHref: '/workspace/demonstrations',
  },
  {
    number: '02',
    title: 'Reality and Record',
    href: '/academy/reality-and-record',
    status: 'planned',
    labHref: '/workspace/lab?lesson=reality-record',
  },
  {
    number: '03',
    title: 'Continuity and Provenance',
    href: '/academy/continuity-and-provenance',
    status: 'planned',
    labHref: '/workspace/lab?lesson=continuity',
  },
  {
    number: '04',
    title: 'Admissibility Before Execution',
    href: '/academy/admissibility-before-execution',
    status: 'planned',
    labHref: '/workspace/demonstrations',
  },
  {
    number: '05',
    title: 'Authority and Binding',
    href: '/academy/authority-and-binding',
    status: 'planned',
    labHref: '/workspace/lab?lesson=binding',
  },
  {
    number: '06',
    title: 'Commit and Version History',
    href: '/academy/commit-and-version-history',
    status: 'planned',
    labHref: '/workspace/demonstrations',
  },
  {
    number: '07',
    title: 'Execution Correspondence',
    href: '/academy/execution-correspondence',
    status: 'planned',
    labHref: '/workspace/lab?lesson=execution-outcome',
  },
  {
    number: '08',
    title: 'Outcome and Verification',
    href: '/academy/outcome-and-verification',
    status: 'planned',
    labHref: '/verify',
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

export default function AcademyLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCompletedLessons(readCompletedLessons());
    setHydrated(true);
  }, []);

  const currentIndex = useMemo(
    () => lessons.findIndex((lesson) => lesson.href === pathname),
    [pathname],
  );

  const currentLesson = currentIndex >= 0 ? lessons[currentIndex] : null;
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < lessons.length - 1
      ? lessons[currentIndex + 1]
      : null;

  const isAcademyHome = pathname === '/academy';
  const completedCount = completedLessons.filter((href) =>
    lessons.some((lesson) => lesson.href === href),
  ).length;
  const progress = Math.round((completedCount / lessons.length) * 100);
  const currentIsComplete = currentLesson
    ? completedLessons.includes(currentLesson.href)
    : false;

  function toggleCurrentLessonComplete() {
    if (!currentLesson) return;

    setCompletedLessons((existing) => {
      const next = existing.includes(currentLesson.href)
        ? existing.filter((href) => href !== currentLesson.href)
        : [...existing, currentLesson.href];

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  if (isAcademyHome || !currentLesson) {
    return <>{children}</>;
  }

  return (
    <div className="academy-framework">
      <style>{`
        .academy-framework {
          position: relative;
          min-height: 100vh;
        }

        .academy-progress-line {
          position: fixed;
          inset: 0 0 auto;
          z-index: 80;
          height: 3px;
          background: rgba(111, 145, 177, .16);
          pointer-events: none;
        }

        .academy-progress-line > span {
          display: block;
          height: 100%;
          background: linear-gradient(90deg, #54e8ff, #39f2a1);
          box-shadow: 0 0 18px rgba(57, 242, 161, .45);
          transition: width .3s ease;
        }

        .academy-launcher {
          position: fixed;
          right: 18px;
          top: 18px;
          z-index: 90;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          min-height: 44px;
          padding: 0 15px;
          border: 1px solid rgba(84, 232, 255, .34);
          border-radius: 999px;
          color: #eefaff;
          background: rgba(3, 10, 18, .90);
          box-shadow: 0 18px 60px rgba(0, 0, 0, .30);
          backdrop-filter: blur(18px);
          cursor: pointer;
          font: 900 .78rem/1 Inter, ui-sans-serif, system-ui, sans-serif;
          letter-spacing: .04em;
        }

        .academy-launcher-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #39f2a1;
          box-shadow: 0 0 14px rgba(57, 242, 161, .75);
        }

        .academy-panel-backdrop {
          position: fixed;
          inset: 0;
          z-index: 94;
          border: 0;
          padding: 0;
          background: rgba(0, 3, 8, .58);
          backdrop-filter: blur(7px);
          cursor: pointer;
        }

        .academy-panel {
          position: fixed;
          top: 12px;
          right: 12px;
          bottom: 12px;
          z-index: 95;
          width: min(390px, calc(100vw - 24px));
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid rgba(119, 170, 210, .22);
          border-radius: 24px;
          color: #f4f9ff;
          background:
            radial-gradient(circle at 90% 0%, rgba(84, 232, 255, .13), transparent 34%),
            linear-gradient(180deg, rgba(7, 18, 30, .98), rgba(2, 8, 15, .99));
          box-shadow: 0 28px 100px rgba(0, 0, 0, .55);
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        }

        .academy-panel-header {
          padding: 22px 22px 18px;
          border-bottom: 1px solid rgba(119, 170, 210, .15);
        }

        .academy-panel-headline {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
        }

        .academy-panel-eyebrow {
          margin: 0 0 7px;
          color: #65e9ff;
          font-size: .68rem;
          font-weight: 950;
          letter-spacing: .15em;
          text-transform: uppercase;
        }

        .academy-panel-title {
          margin: 0;
          font-size: 1.12rem;
          line-height: 1.25;
        }

        .academy-close {
          flex: 0 0 auto;
          width: 36px;
          height: 36px;
          border: 1px solid rgba(144, 178, 211, .20);
          border-radius: 12px;
          color: #dbe9f5;
          background: rgba(255, 255, 255, .04);
          cursor: pointer;
          font-size: 1.05rem;
        }

        .academy-meter {
          margin-top: 17px;
        }

        .academy-meter-copy {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 8px;
          color: #9eb3c6;
          font-size: .74rem;
          font-weight: 800;
        }

        .academy-meter-track {
          height: 7px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(142, 176, 207, .14);
        }

        .academy-meter-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #54e8ff, #39f2a1);
          transition: width .3s ease;
        }

        .academy-lesson-list {
          flex: 1;
          overflow-y: auto;
          padding: 14px;
        }

        .academy-lesson-link,
        .academy-lesson-disabled {
          width: 100%;
          display: grid;
          grid-template-columns: 38px minmax(0, 1fr) auto;
          align-items: center;
          gap: 11px;
          min-height: 64px;
          padding: 10px 11px;
          border: 1px solid transparent;
          border-radius: 16px;
          color: #c8d8e6;
          background: transparent;
          text-align: left;
          text-decoration: none;
        }

        .academy-lesson-link:hover {
          border-color: rgba(84, 232, 255, .23);
          background: rgba(84, 232, 255, .055);
        }

        .academy-lesson-current {
          border-color: rgba(84, 232, 255, .30);
          color: #fff;
          background: linear-gradient(100deg, rgba(84, 232, 255, .10), rgba(57, 242, 161, .045));
        }

        .academy-lesson-disabled {
          opacity: .55;
          cursor: not-allowed;
        }

        .academy-lesson-number {
          display: grid;
          place-items: center;
          width: 34px;
          height: 34px;
          border: 1px solid rgba(137, 174, 208, .18);
          border-radius: 11px;
          color: #73eaff;
          background: rgba(255, 255, 255, .025);
          font-size: .72rem;
          font-weight: 950;
        }

        .academy-lesson-name {
          display: block;
          font-size: .82rem;
          font-weight: 850;
          line-height: 1.3;
        }

        .academy-lesson-state {
          color: #7f98ae;
          font-size: .63rem;
          font-weight: 900;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .academy-check {
          display: grid;
          place-items: center;
          width: 25px;
          height: 25px;
          border-radius: 50%;
          color: #042018;
          background: #39f2a1;
          font-size: .72rem;
          font-weight: 950;
        }

        .academy-panel-footer {
          padding: 16px;
          border-top: 1px solid rgba(119, 170, 210, .15);
          background: rgba(1, 6, 12, .52);
        }

        .academy-footer-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
        }

        .academy-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 43px;
          padding: 0 13px;
          border: 1px solid rgba(145, 180, 214, .20);
          border-radius: 13px;
          color: #dce9f4;
          background: rgba(255, 255, 255, .035);
          text-decoration: none;
          cursor: pointer;
          font: 900 .74rem/1.2 Inter, ui-sans-serif, system-ui, sans-serif;
        }

        .academy-action:hover {
          border-color: rgba(84, 232, 255, .40);
        }

        .academy-action-primary {
          grid-column: 1 / -1;
          border: 0;
          color: #03100c;
          background: linear-gradient(100deg, #54e8ff, #39f2a1);
        }

        .academy-action-complete {
          grid-column: 1 / -1;
          border-color: rgba(57, 242, 161, .32);
          color: #a8ffd8;
          background: rgba(57, 242, 161, .075);
        }

        .academy-action-muted {
          opacity: .42;
          cursor: not-allowed;
        }

        @media (max-width: 720px) {
          .academy-launcher {
            top: auto;
            right: 12px;
            bottom: 12px;
            min-height: 48px;
          }

          .academy-panel {
            top: 8px;
            right: 8px;
            bottom: 8px;
            width: calc(100vw - 16px);
            border-radius: 20px;
          }
        }
      `}</style>

      <div className="academy-progress-line" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      {children}

      <button
        type="button"
        className="academy-launcher"
        onClick={() => setPanelOpen(true)}
        aria-label="Open Academy lesson navigation"
        aria-expanded={panelOpen}
      >
        <span className="academy-launcher-dot" />
        Lesson {currentLesson.number} · {hydrated ? `${progress}% complete` : 'Academy'}
      </button>

      {panelOpen ? (
        <>
          <button
            type="button"
            className="academy-panel-backdrop"
            onClick={() => setPanelOpen(false)}
            aria-label="Close Academy lesson navigation"
          />

          <aside className="academy-panel" aria-label="Academy lesson navigation">
            <header className="academy-panel-header">
              <div className="academy-panel-headline">
                <div>
                  <p className="academy-panel-eyebrow">TA-14 Academy</p>
                  <h2 className="academy-panel-title">Admissible Execution Learning Path</h2>
                </div>
                <button
                  type="button"
                  className="academy-close"
                  onClick={() => setPanelOpen(false)}
                  aria-label="Close lesson navigation"
                >
                  ×
                </button>
              </div>

              <div className="academy-meter">
                <div className="academy-meter-copy">
                  <span>{completedCount} of {lessons.length} lessons complete</span>
                  <span>{progress}%</span>
                </div>
                <div className="academy-meter-track" aria-hidden="true">
                  <div className="academy-meter-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </header>

            <nav className="academy-lesson-list">
              {lessons.map((lesson) => {
                const isCurrent = lesson.href === pathname;
                const isComplete = completedLessons.includes(lesson.href);

                if (lesson.status === 'planned') {
                  return (
                    <div className="academy-lesson-disabled" key={lesson.href}>
                      <span className="academy-lesson-number">{lesson.number}</span>
                      <span>
                        <span className="academy-lesson-name">{lesson.title}</span>
                        <span className="academy-lesson-state">Next release</span>
                      </span>
                      {isComplete ? <span className="academy-check">✓</span> : null}
                    </div>
                  );
                }

                return (
                  <Link
                    href={lesson.href}
                    key={lesson.href}
                    className={`academy-lesson-link${isCurrent ? ' academy-lesson-current' : ''}`}
                    onClick={() => setPanelOpen(false)}
                  >
                    <span className="academy-lesson-number">{lesson.number}</span>
                    <span>
                      <span className="academy-lesson-name">{lesson.title}</span>
                      <span className="academy-lesson-state">
                        {isCurrent ? 'Current lesson' : 'Available'}
                      </span>
                    </span>
                    {isComplete ? <span className="academy-check">✓</span> : null}
                  </Link>
                );
              })}
            </nav>

            <footer className="academy-panel-footer">
              <div className="academy-footer-actions">
                {previousLesson?.status === 'live' ? (
                  <Link className="academy-action" href={previousLesson.href}>
                    ← Previous
                  </Link>
                ) : (
                  <span className="academy-action academy-action-muted">← Previous</span>
                )}

                {nextLesson?.status === 'live' ? (
                  <Link className="academy-action" href={nextLesson.href}>
                    Next →
                  </Link>
                ) : (
                  <span className="academy-action academy-action-muted">Next →</span>
                )}

                <button
                  type="button"
                  className="academy-action academy-action-complete"
                  onClick={toggleCurrentLessonComplete}
                >
                  {currentIsComplete ? '✓ Lesson completed' : 'Mark lesson complete'}
                </button>

                {currentLesson.labHref ? (
                  <Link className="academy-action academy-action-primary" href={currentLesson.labHref}>
                    Launch connected lab →
                  </Link>
                ) : null}
              </div>
            </footer>
          </aside>
        </>
      ) : null}
    </div>
  );
}
