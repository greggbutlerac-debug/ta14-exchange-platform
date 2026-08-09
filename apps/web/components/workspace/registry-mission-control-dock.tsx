'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { RegistryMissionControlMount } from './registry-mission-control-mount';

const STORAGE_KEY = 'ta14.registryMissionControl.dismissed.v1';

type RegistryMissionControlDockProps = {
  className?: string;
};

export function RegistryMissionControlDock({
  className = '',
}: RegistryMissionControlDockProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Preserve a stable integration seam for future workspace-level
    // notification behavior without mutating the registration lifecycle.
    if (typeof window === 'undefined') return;

    const dismissed = window.sessionStorage.getItem(STORAGE_KEY);

    if (dismissed === 'true') {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [pathname]);

  const isRegistryInbox =
    pathname === '/workspace/ai-governance/registry/inbox' ||
    pathname?.startsWith(
      '/workspace/ai-governance/registry/inbox/',
    );

  if (isRegistryInbox) {
    return null;
  }

  return (
    <aside
      className={[
        'ta14-registry-mission-control-dock',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="TA-14 Registry Mission Control"
    >
      <div className="ta14-registry-mission-control-dock__frame">
        <div
          className="ta14-registry-mission-control-dock__rail"
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
        </div>

        <RegistryMissionControlMount />
      </div>

      <style jsx>{`
        .ta14-registry-mission-control-dock {
          position: relative;
          width: 100%;
        }

        .ta14-registry-mission-control-dock__frame {
          position: relative;
          width: 100%;
        }

        .ta14-registry-mission-control-dock__rail {
          position: absolute;
          top: 18px;
          bottom: 18px;
          left: -7px;
          z-index: 2;
          display: grid;
          width: 14px;
          align-content: space-between;
          justify-items: center;
          pointer-events: none;
        }

        .ta14-registry-mission-control-dock__rail::before {
          position: absolute;
          top: 7px;
          bottom: 7px;
          left: 50%;
          width: 1px;
          content: '';
          background:
            linear-gradient(
              to bottom,
              transparent,
              rgba(255, 255, 255, 0.24),
              transparent
            );
          transform: translateX(-50%);
        }

        .ta14-registry-mission-control-dock__rail span {
          position: relative;
          z-index: 1;
          display: block;
          width: 5px;
          height: 5px;
          border: 1px solid rgba(255, 255, 255, 0.28);
          border-radius: 999px;
          background: rgba(10, 14, 24, 0.95);
          box-shadow: 0 0 12px rgba(255, 255, 255, 0.08);
        }

        @media (max-width: 900px) {
          .ta14-registry-mission-control-dock__rail {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
}
