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

type AcademyNavigationItem = {
  label: string;
  href: string;
  glyph: string;
  match?: string[];
  accent?: 'standard' | 'gold' | 'green';
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

const academyNavigation: AcademyNavigationItem[] = [
  { label: 'Academy Home', href: '/academy', glyph: 'AC' },
  {
    label: 'Start Here',
    href: '/academy/start',
    glyph: '01',
    match: ['/academy/start', '/academy/what-is-a-route'],
    accent: 'green',
  },
  { label: 'Mission Control', href: '/academy/dashboard', glyph: 'MC' },
  { label: 'Architecture Explorer', href: '/academy/architecture-explorer', glyph: 'AR' },
  {
    label: '24-Link Architecture',
    href: '/academy/24-link-architecture',
    glyph: '24',
    match: ['/academy/24-link-architecture'],
    accent: 'green',
  },
  { label: 'Learning Routes', href: '/academy/routes', glyph: 'RT' },
  {
    label: 'Simulation Center',
    href: '/academy/simulator',
    glyph: 'SIM',
    match: [
      '/academy/simulator',
      '/academy/execution-boundary-lab',
      '/academy/evidence-conflict-resolution-lab',
      '/academy/route-construction-lab',
      '/academy/route-validation-workshop',
      '/academy/runtime-governance-lab',
      '/academy/decision-record-lab',
      '/academy/challenge-and-appeal-lab',
      '/academy/governed-execution-studio',
    ],
  },
  { label: 'Review Workspace', href: '/academy/review', glyph: 'RV' },
  { label: 'Assessment Center', href: '/academy/assessment', glyph: 'AS' },
  {
    label: 'Credential Dashboard',
    href: '/academy/credential-dashboard',
    glyph: 'CR',
    accent: 'gold',
  },
  {
    label: 'Credential Registry',
    href: '/academy/credential-registry',
    glyph: 'RG',
    accent: 'gold',
  },
  {
    label: 'Instructor Console',
    href: '/academy/instructor-console',
    glyph: 'IN',
  },
  {
    label: 'Accreditation Center',
    href: '/academy/accreditation-center',
    glyph: 'AD',
  },
];

const mobileNavigation = [
  academyNavigation[0],
  academyNavigation[1],
  academyNavigation[2],
  academyNavigation[6],
  academyNavigation[8],
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

function isNavigationItemActive(pathname: string, item: AcademyNavigationItem) {
  if (item.href === '/academy') return pathname === '/academy';

  const matches = item.match ?? [item.href];
  return matches.some(
    (match) => pathname === match || pathname.startsWith(`${match}/`),
  );
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

  useEffect(() => {
    setPanelOpen(false);
  }, [pathname]);

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

  const completedCount = completedLessons.filter((href) =>
    lessons.some((lesson) => lesson.href === href),
  ).length;
  const progress = Math.round((completedCount / lessons.length) * 100);
  const currentIsComplete = currentLesson
    ? completedLessons.includes(currentLesson.href)
    : false;

  const continueHref = useMemo(() => {
    const firstIncomplete = lessons.find(
      (lesson) =>
        lesson.status === 'live' && !completedLessons.includes(lesson.href),
    );
    return firstIncomplete?.href ?? '/academy/dashboard';
  }, [completedLessons]);

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

  return (
    <div className="academy-framework">
      <style>{`
        .academy-framework {
          position: relative;
          min-height: 100vh;
          color: #eff8ff;
          background:
            radial-gradient(circle at 16% -8%, rgba(84, 232, 255, .12), transparent 30%),
            radial-gradient(circle at 92% 10%, rgba(57, 242, 161, .07), transparent 26%),
            #030a11;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .academy-framework::before {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          content: "";
          opacity: .18;
          background-image:
            linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: linear-gradient(to bottom, #000, rgba(0,0,0,.68) 58%, transparent);
        }

        .academy-sidebar {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 70;
          width: 270px;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          padding: 18px 14px 22px;
          border-right: 1px solid rgba(126, 174, 211, .14);
          background:
            radial-gradient(circle at 50% 0%, rgba(84, 232, 255, .09), transparent 26%),
            rgba(3, 9, 16, .94);
          box-shadow: 18px 0 54px rgba(0,0,0,.18);
          backdrop-filter: blur(22px);
        }

        .academy-sidebar-brand {
          display: grid;
          grid-template-columns: 44px minmax(0, 1fr);
          align-items: center;
          gap: 11px;
          min-height: 62px;
          padding: 8px 8px 16px;
          border-bottom: 1px solid rgba(126, 174, 211, .13);
          color: #fff;
          text-decoration: none;
        }

        .academy-brand-mark {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(84, 232, 255, .34);
          border-radius: 14px;
          color: #dffaff;
          background: linear-gradient(145deg, rgba(84, 232, 255, .20), rgba(15, 34, 49, .76));
          box-shadow: inset 0 1px 0 rgba(255,255,255,.14), 0 12px 28px rgba(45, 205, 236, .12);
          font-size: .72rem;
          font-weight: 950;
          letter-spacing: -.03em;
        }

        .academy-brand-copy {
          min-width: 0;
          display: grid;
          gap: 3px;
        }

        .academy-brand-copy strong {
          color: #fff;
          font-size: .82rem;
          letter-spacing: .12em;
        }

        .academy-brand-copy span {
          overflow: hidden;
          color: #8198ac;
          font-size: .67rem;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .academy-sidebar-return {
          min-height: 39px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 14px 7px 18px;
          border: 1px solid rgba(138, 177, 211, .18);
          border-radius: 12px;
          color: #c9d9e7;
          background: rgba(255,255,255,.025);
          text-decoration: none;
          font-size: .72rem;
          font-weight: 850;
          transition: 160ms ease;
        }

        .academy-sidebar-return:hover,
        .academy-sidebar-return:focus-visible {
          color: #fff;
          border-color: rgba(84, 232, 255, .34);
          background: rgba(84, 232, 255, .07);
          outline: none;
          transform: translateY(-1px);
        }

        .academy-nav-label {
          display: block;
          padding: 0 10px 9px;
          color: #62798d;
          font-size: .64rem;
          font-weight: 900;
          letter-spacing: .17em;
          text-transform: uppercase;
        }

        .academy-sidebar-nav {
          display: grid;
          gap: 6px;
        }

        .academy-nav-item {
          min-height: 47px;
          display: grid;
          grid-template-columns: 31px minmax(0, 1fr);
          align-items: center;
          gap: 10px;
          padding: 7px 10px;
          border: 1px solid transparent;
          border-radius: 13px;
          color: #aebfd0;
          text-decoration: none;
          font-size: .79rem;
          font-weight: 760;
          transition: 160ms ease;
        }

        .academy-nav-item:hover,
        .academy-nav-item:focus-visible {
          color: #fff;
          border-color: rgba(84, 232, 255, .20);
          background: rgba(84, 232, 255, .055);
          outline: none;
          transform: translateX(2px);
        }

        .academy-nav-item.active {
          color: #fff;
          border-color: rgba(84, 232, 255, .28);
          background: linear-gradient(135deg, rgba(84, 232, 255, .14), rgba(57, 242, 161, .035));
          box-shadow: inset 3px 0 0 #54e8ff;
        }

        .academy-nav-item.gold {
          color: #f2db9b;
        }

        .academy-nav-item.gold.active {
          border-color: rgba(242, 196, 86, .30);
          background: linear-gradient(135deg, rgba(242, 196, 86, .13), rgba(242, 196, 86, .035));
          box-shadow: inset 3px 0 0 #f2c456;
        }

        .academy-nav-item.green.active {
          border-color: rgba(57, 242, 161, .29);
          background: linear-gradient(135deg, rgba(57, 242, 161, .13), rgba(84, 232, 255, .035));
          box-shadow: inset 3px 0 0 #39f2a1;
        }

        .academy-nav-glyph {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 9px;
          color: #6feaff;
          background: rgba(255,255,255,.025);
          font-size: .57rem;
          font-weight: 950;
          letter-spacing: -.02em;
        }

        .academy-nav-item.gold .academy-nav-glyph {
          color: #f2c456;
          border-color: rgba(242, 196, 86, .20);
        }

        .academy-nav-item.green .academy-nav-glyph {
          color: #65f1b5;
          border-color: rgba(57, 242, 161, .20);
        }

        .academy-cta-card {
          margin-top: auto;
          padding: 17px;
          border: 1px solid rgba(57, 242, 161, .20);
          border-radius: 18px;
          background:
            radial-gradient(circle at 100% 0%, rgba(84, 232, 255, .13), transparent 42%),
            linear-gradient(145deg, rgba(57, 242, 161, .075), rgba(255,255,255,.02));
          box-shadow: inset 0 1px 0 rgba(255,255,255,.04);
        }

        .academy-cta-card small {
          display: block;
          color: #65f1b5;
          font-size: .62rem;
          font-weight: 950;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .academy-cta-card strong {
          display: block;
          margin-top: 8px;
          color: #fff;
          font-size: .91rem;
          line-height: 1.38;
        }

        .academy-cta-card p {
          margin: 8px 0 13px;
          color: #8fa6b8;
          font-size: .71rem;
          line-height: 1.55;
        }

        .academy-cta-button {
          min-height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          color: #03120d;
          background: linear-gradient(105deg, #54e8ff, #39f2a1);
          box-shadow: 0 12px 28px rgba(57, 242, 161, .13);
          text-decoration: none;
          font-size: .73rem;
          font-weight: 950;
        }

        .academy-cta-secondary {
          display: flex;
          justify-content: center;
          margin-top: 10px;
          color: #a9c5d5;
          text-decoration: none;
          font-size: .68rem;
          font-weight: 800;
        }

        .academy-cta-quick-label {
          display: block;
          margin: 14px 0 8px;
          color: #6f8799;
          font-size: .56rem;
          font-weight: 950;
          letter-spacing: .13em;
          text-transform: uppercase;
        }

        .academy-cta-quick-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 7px;
        }

        .academy-cta-quick-link {
          min-height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px 7px;
          border: 1px solid rgba(126, 174, 211, .14);
          border-radius: 10px;
          color: #a9c5d5;
          background: rgba(255,255,255,.022);
          text-align: center;
          text-decoration: none;
          font-size: .59rem;
          font-weight: 850;
          line-height: 1.2;
          transition: 150ms ease;
        }

        .academy-cta-quick-link:hover,
        .academy-cta-quick-link:focus-visible {
          color: #fff;
          border-color: rgba(84, 232, 255, .30);
          background: rgba(84, 232, 255, .065);
          outline: none;
          transform: translateY(-1px);
        }

        .academy-cta-boundary {
          margin-top: 12px;
          padding-top: 10px;
          border-top: 1px solid rgba(126, 174, 211, .12);
          color: #6f8799;
          font-size: .57rem;
          line-height: 1.45;
        }

        .academy-content {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          margin-left: 270px;
        }

        .academy-progress-line {
          position: fixed;
          inset: 0 0 auto 270px;
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
          font: 900 .74rem/1 Inter, ui-sans-serif, system-ui, sans-serif;
          letter-spacing: .03em;
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

        .academy-mobile-nav {
          display: none;
        }

        @media (max-width: 1180px) {
          .academy-sidebar {
            width: 248px;
          }

          .academy-content {
            margin-left: 248px;
          }

          .academy-progress-line {
            left: 248px;
          }
        }

        @media (max-width: 760px) {
          .academy-sidebar {
            display: none;
          }

          .academy-content {
            margin-left: 0;
            padding-bottom: 78px;
          }

          .academy-progress-line {
            left: 0;
          }

          .academy-mobile-nav {
            position: fixed;
            right: 10px;
            bottom: 10px;
            left: 10px;
            z-index: 88;
            min-height: 64px;
            display: grid;
            grid-template-columns: repeat(5, minmax(0, 1fr));
            gap: 3px;
            padding: 7px;
            border: 1px solid rgba(126, 174, 211, .18);
            border-radius: 19px;
            background: rgba(3, 9, 16, .95);
            box-shadow: 0 22px 60px rgba(0,0,0,.44);
            backdrop-filter: blur(22px);
          }

          .academy-mobile-link {
            min-width: 0;
            display: grid;
            place-items: center;
            align-content: center;
            gap: 3px;
            padding: 5px 2px;
            border-radius: 12px;
            color: #9fb2c3;
            text-decoration: none;
            font-size: .58rem;
            font-weight: 850;
            text-align: center;
          }

          .academy-mobile-link b {
            color: #63eaff;
            font-size: .66rem;
          }

          .academy-mobile-link.active {
            color: #fff;
            background: rgba(84, 232, 255, .10);
            box-shadow: inset 0 0 0 1px rgba(84, 232, 255, .18);
          }
        }

        @media (max-width: 720px) {
          .academy-launcher {
            top: auto;
            right: 12px;
            bottom: 86px;
            min-height: 46px;
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

      <aside className="academy-sidebar" aria-label="TA-14 Academy navigation">
        <Link className="academy-sidebar-brand" href="/academy">
          <span className="academy-brand-mark">TA-14</span>
          <span className="academy-brand-copy">
            <strong>TA-14 ACADEMY</strong>
            <span>Governance learning institution</span>
          </span>
        </Link>

        <Link className="academy-sidebar-return" href="/">
          ← Return to Exchange
        </Link>

        <section>
          <span className="academy-nav-label">Academy</span>
          <nav className="academy-sidebar-nav">
            {academyNavigation.map((item) => {
              const active = isNavigationItemActive(pathname, item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`academy-nav-item${active ? ' active' : ''}${
                    item.accent ? ` ${item.accent}` : ''
                  }`}
                >
                  <span className="academy-nav-glyph" aria-hidden="true">
                    {item.glyph}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </section>

        <article className="academy-cta-card">
          <small>Primary action</small>
          <strong>Continue your governed learning route.</strong>
          <p>
            Move from orientation into applied route construction, simulation,
            review, assessment, and evidence-backed credential progression.
          </p>
          <Link className="academy-cta-button" href={continueHref}>
            {completedCount > 0 ? 'Continue Learning →' : 'Start the Academy →'}
          </Link>
          <Link className="academy-cta-secondary" href="/academy/dashboard">
            Open Mission Control
          </Link>

          <span className="academy-cta-quick-label">Direct Academy actions</span>
          <div className="academy-cta-quick-grid">
            <Link className="academy-cta-quick-link" href="/academy/architecture-explorer">
              Explore Architecture
            </Link>
            <Link className="academy-cta-quick-link" href="/academy/routes">
              Choose a Route
            </Link>
            <Link className="academy-cta-quick-link" href="/academy/simulator">
              Run a Simulation
            </Link>
            <Link className="academy-cta-quick-link" href="/academy/review">
              Open Review
            </Link>
            <Link className="academy-cta-quick-link" href="/academy/assessment">
              Enter Assessment
            </Link>
            <Link className="academy-cta-quick-link" href="/academy/credential-registry">
              Verify Credentials
            </Link>
          </div>

          <div className="academy-cta-boundary">
            Learning is open by pathway. Formal credentials, instruction, accreditation,
            and institutional representation remain governed by TA-14 authorization.
          </div>
        </article>
      </aside>

      <div className="academy-progress-line" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="academy-content">{children}</div>

      <nav className="academy-mobile-nav" aria-label="Mobile Academy navigation">
        {mobileNavigation.map((item) => {
          const active = isNavigationItemActive(pathname, item);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`academy-mobile-link${active ? ' active' : ''}`}
            >
              <b aria-hidden="true">{item.glyph}</b>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {currentLesson ? (
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
      ) : null}

      {panelOpen && currentLesson ? (
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
