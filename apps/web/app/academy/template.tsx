import Link from "next/link";
import type { ReactNode } from "react";

export default function AcademyTemplate({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <aside className="academyArcadeLaunch" aria-label="TA-14 Academy HVACDR Arcade launch">
        <div className="academyArcadePulse" />
        <div className="academyArcadeCopy">
          <small>TA-14 ACADEMY // HVACDR ARCADE</small>
          <strong>EPA 608 REFRIGERANT OPS</strong>
          <span>Enter the playable training universe.</span>
        </div>
        <Link href="/atlas-608-refrigerant-ops-lab/campaign">ENTER ARCADE ⚡</Link>
      </aside>
      <style>{`
        .academyArcadeLaunch {
          position: fixed;
          right: 24px;
          bottom: 24px;
          z-index: 96;
          width: min(410px, calc(100vw - 34px));
          display: grid;
          grid-template-columns: 16px minmax(0, 1fr) auto;
          align-items: center;
          gap: 13px;
          padding: 13px 14px;
          border: 1px solid rgba(61, 233, 255, .58);
          border-radius: 16px;
          color: #effcff;
          background:
            radial-gradient(circle at 0 50%, rgba(76,255,157,.13), transparent 28%),
            linear-gradient(135deg, rgba(4,22,34,.97), rgba(3,13,22,.97));
          box-shadow:
            0 22px 70px rgba(0,0,0,.52),
            0 0 36px rgba(47,220,255,.16),
            inset 0 1px 0 rgba(255,255,255,.07);
          backdrop-filter: blur(18px);
          overflow: hidden;
        }
        .academyArcadeLaunch::before {
          position: absolute;
          inset: 0;
          content: "";
          pointer-events: none;
          background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,.07), transparent 67%);
          transform: translateX(-120%);
          animation: academyArcadeSweep 5.2s linear infinite;
        }
        .academyArcadePulse {
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: #53ff9b;
          box-shadow: 0 0 11px #53ff9b, 0 0 28px rgba(61,255,155,.6);
          animation: academyArcadePulse 1.6s ease-in-out infinite;
        }
        .academyArcadeCopy {
          min-width: 0;
          display: grid;
          gap: 2px;
        }
        .academyArcadeCopy small {
          color: #5deaff;
          font-size: .58rem;
          font-weight: 950;
          letter-spacing: .15em;
        }
        .academyArcadeCopy strong {
          font-size: .78rem;
          letter-spacing: .04em;
        }
        .academyArcadeCopy span {
          color: #8eaabb;
          font-size: .66rem;
        }
        .academyArcadeLaunch a {
          position: relative;
          z-index: 1;
          min-height: 39px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 13px;
          border: 1px solid rgba(73,255,155,.68);
          border-radius: 11px;
          color: #caffdc;
          background: linear-gradient(180deg, rgba(10,69,43,.92), rgba(5,37,26,.95));
          box-shadow: 0 0 24px rgba(68,255,146,.13);
          text-decoration: none;
          font-size: .63rem;
          font-weight: 950;
          letter-spacing: .07em;
          white-space: nowrap;
          transition: 160ms ease;
        }
        .academyArcadeLaunch a:hover,
        .academyArcadeLaunch a:focus-visible {
          color: #fff;
          border-color: #66ffa7;
          box-shadow: 0 0 36px rgba(68,255,146,.3);
          outline: none;
          transform: translateY(-2px);
        }
        @keyframes academyArcadeSweep {
          42%, 100% { transform: translateX(120%); }
        }
        @keyframes academyArcadePulse {
          50% { transform: scale(1.35); opacity: .62; }
        }
        @media (max-width: 720px) {
          .academyArcadeLaunch {
            right: 12px;
            bottom: 12px;
            grid-template-columns: 12px minmax(0,1fr);
          }
          .academyArcadeLaunch a {
            grid-column: 1 / -1;
            width: 100%;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .academyArcadeLaunch::before,
          .academyArcadePulse { animation: none; }
        }
      `}</style>
    </>
  );
}
