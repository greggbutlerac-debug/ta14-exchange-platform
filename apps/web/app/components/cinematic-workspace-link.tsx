"use client";

import {
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

type CinematicWorkspaceLinkProps = {
  href: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  ariaLabel?: string;
};

const TRANSITION_DURATION_MS = 720;

function shouldNavigateNormally(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

export default function CinematicWorkspaceLink({
  href,
  className,
  style,
  children,
  ariaLabel,
}: CinematicWorkspaceLinkProps) {
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isEntering, setIsEntering] = useState(false);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (shouldNavigateNormally(event) || isEntering) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      return;
    }

    event.preventDefault();
    setIsEntering(true);

    timerRef.current = setTimeout(() => {
      router.push(href);
    }, TRANSITION_DURATION_MS);
  }

  return (
    <a
      href={href}
      className={`${className ?? ""}${isEntering ? " isEntering" : ""}`}
      style={style}
      aria-label={ariaLabel}
      aria-current={isEntering ? "page" : undefined}
      onClick={handleClick}
    >
      {children}

      <span className="cinematicTransition" aria-hidden="true">
        <span className="transitionLight" />
        <span className="transitionGate transitionGateLeft" />
        <span className="transitionGate transitionGateRight" />
        <span className="transitionSeal">TA-14</span>
      </span>

      <style jsx>{`
        .cinematicTransition {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: grid;
          place-items: center;
          overflow: hidden;
          pointer-events: none;
          opacity: 0;
          background:
            radial-gradient(
              circle at 50% 50%,
              rgba(255, 224, 145, 0.14),
              transparent 24%
            ),
            #020711;
          transition: opacity 180ms ease;
        }

        .transitionLight {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 18vw;
          min-width: 120px;
          height: 125vh;
          transform: translate(-50%, -50%) scaleX(0.08);
          transform-origin: center;
          clip-path: polygon(46% 0, 54% 0, 100% 100%, 0 100%);
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.98),
              rgba(255, 224, 135, 0.94) 32%,
              rgba(255, 166, 35, 0.58) 66%,
              transparent
            );
          filter: blur(8px);
          opacity: 0;
        }

        .transitionGate {
          position: absolute;
          top: -8vh;
          bottom: -8vh;
          width: 51vw;
          background:
            repeating-linear-gradient(
              96deg,
              rgba(255, 255, 255, 0.025) 0 2px,
              transparent 2px 10px
            ),
            linear-gradient(
              90deg,
              #4d2902,
              #c4861a 20%,
              #f0c765 48%,
              #a9650c 76%,
              #3b1e01
            );
          box-shadow:
            inset 0 0 0 2px rgba(255, 231, 178, 0.24),
            inset 0 0 50px rgba(66, 31, 0, 0.42),
            0 0 70px rgba(255, 188, 53, 0.24);
        }

        .transitionGateLeft {
          left: -51vw;
          transform-origin: right center;
        }

        .transitionGateRight {
          right: -51vw;
          transform-origin: left center;
        }

        .transitionSeal {
          position: relative;
          z-index: 2;
          width: 88px;
          height: 88px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          border: 1px solid rgba(255, 215, 130, 0.88);
          color: #ffe5a1;
          background:
            radial-gradient(
              circle at 42% 36%,
              rgba(255, 246, 202, 0.24),
              transparent 34%
            ),
            linear-gradient(145deg, #b87411, #5e3102);
          box-shadow:
            0 0 0 5px rgba(117, 68, 7, 0.66),
            0 0 36px rgba(255, 190, 58, 0.48);
          font-size: 17px;
          font-weight: 950;
          letter-spacing: 0.08em;
          opacity: 0;
          transform: scale(0.72);
        }

        :global(.isEntering) .cinematicTransition {
          pointer-events: auto;
          opacity: 1;
        }

        :global(.isEntering) .transitionGateLeft {
          animation: closeGateLeft 720ms cubic-bezier(0.2, 0.78, 0.18, 1)
            forwards;
        }

        :global(.isEntering) .transitionGateRight {
          animation: closeGateRight 720ms cubic-bezier(0.2, 0.78, 0.18, 1)
            forwards;
        }

        :global(.isEntering) .transitionLight {
          animation: transitionLight 720ms ease-out forwards;
        }

        :global(.isEntering) .transitionSeal {
          animation: transitionSeal 720ms ease-out forwards;
        }

        @keyframes closeGateLeft {
          0% {
            transform: translateX(0) rotateY(-10deg);
          }
          68%,
          100% {
            transform: translateX(50vw) rotateY(0deg);
          }
        }

        @keyframes closeGateRight {
          0% {
            transform: translateX(0) rotateY(10deg);
          }
          68%,
          100% {
            transform: translateX(-50vw) rotateY(0deg);
          }
        }

        @keyframes transitionLight {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scaleX(0.08);
          }
          30% {
            opacity: 0.96;
          }
          72%,
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scaleX(5.8);
          }
        }

        @keyframes transitionSeal {
          0%,
          40% {
            opacity: 0;
            transform: scale(0.72);
          }
          67% {
            opacity: 1;
            transform: scale(1.06);
          }
          100% {
            opacity: 0;
            transform: scale(1.18);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cinematicTransition {
            display: none;
          }
        }
      `}</style>
    </a>
  );
}
