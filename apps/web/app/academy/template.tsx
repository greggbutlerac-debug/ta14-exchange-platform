import Link from "next/link";
import type { ReactNode } from "react";

export default function AcademyTemplate({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <aside className="academyHvacDoor" aria-label="Open TA-14 Academy HVAC world">
        <Link href="/academy/hvac" aria-label="Open HVAC">
          <span className="academyHvacMark">HVAC</span>
          <span className="academyHvacArrow">→</span>
        </Link>
      </aside>
      <style>{`
        .academyHvacDoor {
          position: fixed;
          left: 18px;
          top: 50%;
          z-index: 96;
          transform: translateY(-50%);
        }
        .academyHvacDoor a {
          width: 76px;
          min-height: 176px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 18px 10px 14px;
          border: 1px solid rgba(61, 233, 255, .54);
          border-radius: 17px;
          color: #effcff;
          background:
            radial-gradient(circle at 50% 0, rgba(76,255,157,.14), transparent 36%),
            linear-gradient(180deg, rgba(4,22,34,.97), rgba(3,13,22,.98));
          box-shadow:
            0 22px 70px rgba(0,0,0,.5),
            0 0 32px rgba(47,220,255,.14),
            inset 0 1px 0 rgba(255,255,255,.07);
          backdrop-filter: blur(18px);
          text-decoration: none;
          overflow: hidden;
          transition: 170ms ease;
        }
        .academyHvacDoor a::before {
          position: absolute;
          inset: 0;
          content: "";
          pointer-events: none;
          border-radius: inherit;
          background: linear-gradient(180deg, transparent 24%, rgba(255,255,255,.06), transparent 62%);
          transform: translateY(-120%);
          transition: 350ms ease;
        }
        .academyHvacDoor a:hover,
        .academyHvacDoor a:focus-visible {
          border-color: #63efff;
          box-shadow: 0 24px 80px rgba(0,0,0,.56), 0 0 42px rgba(47,220,255,.25);
          outline: none;
          transform: translateX(3px);
        }
        .academyHvacDoor a:hover::before,
        .academyHvacDoor a:focus-visible::before { transform: translateY(120%); }
        .academyHvacMark {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          font-size: .82rem;
          font-weight: 950;
          letter-spacing: .2em;
          color: #dffaff;
        }
        .academyHvacArrow {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(73,255,155,.54);
          border-radius: 50%;
          color: #69ffad;
          background: rgba(13,80,51,.28);
          font-size: 1rem;
          font-weight: 950;
        }
        @media (max-width: 720px) {
          .academyHvacDoor {
            left: 10px;
            top: auto;
            bottom: 12px;
            transform: none;
          }
          .academyHvacDoor a {
            width: auto;
            min-height: 48px;
            flex-direction: row;
            padding: 7px 8px 7px 14px;
            border-radius: 14px;
          }
          .academyHvacMark {
            writing-mode: horizontal-tb;
            transform: none;
            font-size: .72rem;
          }
          .academyHvacArrow { width: 34px; height: 34px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .academyHvacDoor a,
          .academyHvacDoor a::before { transition: none; }
        }
      `}</style>
    </>
  );
}
