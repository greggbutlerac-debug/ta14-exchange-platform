'use client';

import { useEffect, useRef, useState } from 'react';

const STEP_LABELS = [
  'Governance identity secured',
  'Authority and attribution secured',
  'Stewardship route secured',
  'Governance description secured',
  'Formal claims secured',
  'Non-claims and limitations secured',
  'Scope declaration secured',
  'Evidence stage secured',
  'Publication record stage secured',
  'Repository record stage secured',
  'Additional provenance stage secured',
  'Review pathway secured',
  'Declarations secured',
  'Registration package secured',
];

function readActiveStep(): number | null {
  const marker = document.querySelector('.step-header span');
  const match = marker?.textContent?.match(/STEP\s+(\d+)\s+OF\s+14/i);
  return match ? Number(match[1]) - 1 : null;
}

export default function RegistrationMilestoneCelebration() {
  const [celebration, setCelebration] = useState<{ step: number; label: string } | null>(null);
  const previousStep = useRef<number | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const observe = () => {
      const next = readActiveStep();
      if (next === null) return;

      if (previousStep.current === null) {
        previousStep.current = next;
        return;
      }

      if (next > previousStep.current) {
        const completed = next - 1;
        setCelebration({
          step: completed + 1,
          label: STEP_LABELS[completed] ?? 'Governed milestone secured',
        });

        if (timer.current) window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCelebration(null), 2100);
      }

      previousStep.current = next;
    };

    observe();
    const observer = new MutationObserver(observe);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    return () => {
      observer.disconnect();
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  if (!celebration) return null;

  return (
    <div className="ta14-milestone" role="status" aria-live="polite">
      <div className="ta14-milestone-burst" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, index) => (
          <i key={index} style={{ '--ray': index } as React.CSSProperties} />
        ))}
      </div>
      <div className="ta14-milestone-seal" aria-hidden="true">✓</div>
      <div className="ta14-milestone-copy">
        <span>TA-14 REGISTRY · MILESTONE {String(celebration.step).padStart(2, '0')}</span>
        <strong>{celebration.label}</strong>
        <small>Progress preserved. Continue building the governed record.</small>
      </div>
      <style jsx>{`
        .ta14-milestone {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: grid;
          place-items: center;
          pointer-events: none;
          background: radial-gradient(circle at center, rgba(218, 174, 85, .12), transparent 42%);
          animation: veil 2.1s ease both;
        }
        .ta14-milestone-copy {
          position: relative;
          z-index: 3;
          width: min(560px, calc(100vw - 40px));
          padding: 24px 28px;
          text-align: center;
          border: 1px solid rgba(223, 181, 94, .58);
          border-radius: 22px;
          background: linear-gradient(145deg, rgba(30, 22, 8, .97), rgba(3, 16, 29, .98));
          box-shadow: 0 30px 100px rgba(0,0,0,.58), 0 0 70px rgba(218,174,85,.15);
          animation: rise .55s cubic-bezier(.2,.9,.25,1.15) both;
        }
        .ta14-milestone-copy span {
          display: block;
          color: #d9ad58;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .18em;
        }
        .ta14-milestone-copy strong {
          display: block;
          margin-top: 8px;
          color: #f7f4eb;
          font-size: clamp(20px, 3vw, 30px);
          line-height: 1.18;
        }
        .ta14-milestone-copy small {
          display: block;
          margin-top: 8px;
          color: #9eb0bf;
          font-size: 12px;
        }
        .ta14-milestone-seal {
          position: absolute;
          z-index: 4;
          transform: translateY(-92px);
          display: grid;
          place-items: center;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          border: 1px solid rgba(244, 204, 120, .85);
          background: radial-gradient(circle at 35% 30%, #f2cf82, #a46e1c 68%);
          color: #07111c;
          font-size: 25px;
          font-weight: 950;
          box-shadow: 0 0 38px rgba(223,177,83,.5);
          animation: seal .65s cubic-bezier(.2,.9,.25,1.2) both;
        }
        .ta14-milestone-burst { position: absolute; width: 12px; height: 12px; }
        .ta14-milestone-burst i {
          --ray: 0;
          position: absolute;
          left: 5px;
          top: 5px;
          width: 3px;
          height: 13px;
          border-radius: 99px;
          background: linear-gradient(#f4d48e, rgba(244,212,142,0));
          transform: rotate(calc(var(--ray) * 20deg)) translateY(-48px);
          transform-origin: 50% 53px;
          animation: spark 1.15s ease-out both;
          animation-delay: calc(var(--ray) * 18ms);
        }
        @keyframes rise { from { opacity: 0; transform: translateY(18px) scale(.94); } to { opacity: 1; transform: none; } }
        @keyframes seal { from { opacity: 0; transform: translateY(-70px) scale(.3) rotate(-18deg); } to { opacity: 1; transform: translateY(-92px) scale(1); } }
        @keyframes spark { 0% { opacity: 0; } 20% { opacity: 1; } 100% { opacity: 0; transform: rotate(calc(var(--ray) * 20deg)) translateY(-130px); } }
        @keyframes veil { 0%, 100% { opacity: 0; } 12%, 78% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          .ta14-milestone, .ta14-milestone-copy, .ta14-milestone-seal, .ta14-milestone-burst i { animation: none; }
          .ta14-milestone-burst { display: none; }
        }
      `}</style>
    </div>
  );
}
