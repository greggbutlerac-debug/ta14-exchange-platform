'use client';

import { RegistryInboxIndicator } from './registry-inbox-indicator';
import { RegistryDeliveryHealth } from './registry-delivery-health';

type RegistryInboxMissionControlProps = {
  className?: string;
};

export function RegistryInboxMissionControl({
  className = '',
}: RegistryInboxMissionControlProps) {
  return (
    <section
      className={[
        'ta14-registry-inbox-mission-control',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Registry administration status"
    >
      <div className="ta14-registry-inbox-mission-control__signal">
        <span
          className="ta14-registry-inbox-mission-control__pulse"
          aria-hidden="true"
        />
        <span>Registry Administration</span>
      </div>

      <div className="ta14-registry-inbox-mission-control__body">
        <div className="ta14-registry-inbox-mission-control__copy">
          <span className="ta14-registry-inbox-mission-control__eyebrow">
            Institutional awareness
          </span>

          <strong className="ta14-registry-inbox-mission-control__title">
            Registration events remain visible after automatic completion.
          </strong>

          <p className="ta14-registry-inbox-mission-control__description">
            Automatic governance registration remains automatic. The
            administration inbox preserves awareness of completed
            registrations and separates informational events from matters
            requiring administrative action.
          </p>
        </div>

        <div className="ta14-registry-inbox-mission-control__controls">
          <RegistryInboxIndicator
            className="ta14-registry-inbox-mission-control__indicator"
          />

          <RegistryDeliveryHealth
            className="ta14-registry-inbox-mission-control__delivery"
          />
        </div>
      </div>

      <div className="ta14-registry-inbox-mission-control__boundary">
        <span>Registration</span>
        <span aria-hidden="true">→</span>
        <span>Notification</span>
        <span aria-hidden="true">→</span>
        <span>Awareness</span>
        <span aria-hidden="true">→</span>
        <span>Acknowledgement</span>
      </div>

      <style jsx>{`
        .ta14-registry-inbox-mission-control {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 22px;
          padding: 18px;
          background:
            radial-gradient(
              circle at 8% 0%,
              rgba(126, 231, 135, 0.09),
              transparent 34%
            ),
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.055),
              rgba(255, 255, 255, 0.018)
            );
        }

        .ta14-registry-inbox-mission-control::before {
          position: absolute;
          inset: 0;
          pointer-events: none;
          content: '';
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.025),
              transparent
            );
          transform: translateX(-100%);
          animation: ta14-registry-admin-scan 9s linear infinite;
        }

        .ta14-registry-inbox-mission-control__signal {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.14em;
          opacity: 0.72;
          text-transform: uppercase;
        }

        .ta14-registry-inbox-mission-control__pulse {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: currentColor;
          box-shadow: 0 0 0 0 currentColor;
          animation: ta14-registry-admin-pulse 2.4s ease-out infinite;
        }

        .ta14-registry-inbox-mission-control__body {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .ta14-registry-inbox-mission-control__copy {
          display: grid;
          max-width: 720px;
          gap: 7px;
        }

        .ta14-registry-inbox-mission-control__eyebrow {
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.12em;
          opacity: 0.58;
          text-transform: uppercase;
        }

        .ta14-registry-inbox-mission-control__title {
          font-size: clamp(16px, 2vw, 22px);
          line-height: 1.2;
        }

        .ta14-registry-inbox-mission-control__description {
          max-width: 680px;
          margin: 0;
          font-size: 12px;
          line-height: 1.65;
          opacity: 0.68;
        }

        .ta14-registry-inbox-mission-control__boundary {
          position: relative;
          z-index: 1;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.09);
          padding-top: 12px;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.1em;
          opacity: 0.5;
          text-transform: uppercase;
        }

        .ta14-registry-inbox-mission-control__controls {
          display: grid;
          flex: 0 0 auto;
          gap: 10px;
          min-width: 280px;
        }

        :global(
            .ta14-registry-inbox-mission-control__indicator
          ),
        :global(
            .ta14-registry-inbox-mission-control__delivery
          ) {
          width: 100%;
        }

        @keyframes ta14-registry-admin-pulse {
          0% {
            box-shadow: 0 0 0 0 currentColor;
            opacity: 0.9;
          }

          70% {
            box-shadow: 0 0 0 8px transparent;
            opacity: 0.55;
          }

          100% {
            box-shadow: 0 0 0 0 transparent;
            opacity: 0.9;
          }
        }

        @keyframes ta14-registry-admin-scan {
          0% {
            transform: translateX(-100%);
          }

          45%,
          100% {
            transform: translateX(100%);
          }
        }

        @media (max-width: 760px) {
          .ta14-registry-inbox-mission-control__body {
            align-items: stretch;
            flex-direction: column;
          }

          .ta14-registry-inbox-mission-control__controls {
            min-width: 0;
            width: 100%;
          }

          :global(
              .ta14-registry-inbox-mission-control__indicator
            ),
          :global(
              .ta14-registry-inbox-mission-control__delivery
            ) {
            width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ta14-registry-inbox-mission-control::before,
          .ta14-registry-inbox-mission-control__pulse {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
