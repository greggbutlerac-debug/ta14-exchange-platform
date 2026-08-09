'use client';

import { useEffect, useState } from 'react';
import { RegistryInboxMissionControl } from './registry-inbox-mission-control';
import { RegistryRegistrationJourneyIndicator } from './registry-registration-journey-indicator';

type RegistryMissionControlMountProps = {
  className?: string;
};

export function RegistryMissionControlMount({
  className = '',
}: RegistryMissionControlMountProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section
        className={[
          'ta14-registry-mission-control-mount',
          'is-loading',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        aria-label="Registry administration status loading"
      >
        <div className="ta14-registry-mission-control-mount__skeleton">
          <span />
          <span />
          <span />
        </div>

        <style jsx>{`
          .ta14-registry-mission-control-mount {
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 22px;
            padding: 18px;
            background:
              linear-gradient(
                145deg,
                rgba(255, 255, 255, 0.04),
                rgba(255, 255, 255, 0.015)
              );
          }

          .ta14-registry-mission-control-mount__skeleton {
            display: grid;
            gap: 10px;
          }

          .ta14-registry-mission-control-mount__skeleton span {
            display: block;
            height: 12px;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.08);
          }

          .ta14-registry-mission-control-mount__skeleton span:nth-child(1) {
            width: 28%;
          }

          .ta14-registry-mission-control-mount__skeleton span:nth-child(2) {
            width: 66%;
          }

          .ta14-registry-mission-control-mount__skeleton span:nth-child(3) {
            width: 48%;
          }
        `}</style>
      </section>
    );
  }

  return (
    <section
      className={[
        'ta14-registry-mission-control-mount',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="TA-14 Registry administration status"
    >
      <RegistryInboxMissionControl />

      <RegistryRegistrationJourneyIndicator />

      <style jsx>{`
        .ta14-registry-mission-control-mount {
          display: grid;
          gap: 12px;
        }
      `}</style>
    </section>
  );
}
