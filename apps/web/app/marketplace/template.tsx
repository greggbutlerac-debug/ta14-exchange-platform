export default function MarketplaceTemplate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="marketplaceTemplate">
      <div className="marketplaceTransitionLayer" aria-hidden="true">
        <span className="transitionLine transitionLineOne" />
        <span className="transitionLine transitionLineTwo" />
        <span className="transitionParticle transitionParticleOne" />
        <span className="transitionParticle transitionParticleTwo" />
        <span className="transitionParticle transitionParticleThree" />
      </div>

      <div className="marketplaceTemplateContent">{children}</div>

      <style>{`
        .marketplaceTemplate {
          position: relative;
          min-height: 100%;
          isolation: isolate;
        }

        .marketplaceTemplateContent {
          position: relative;
          z-index: 2;
          min-height: 100%;
          animation: marketplaceRouteEnter 520ms
            cubic-bezier(0.22, 1, 0.36, 1) both;
          transform-origin: 50% 0%;
        }

        .marketplaceTransitionLayer {
          position: fixed;
          inset: 0;
          z-index: 1;
          overflow: hidden;
          pointer-events: none;
        }

        .transitionLine {
          position: absolute;
          height: 1px;
          opacity: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(103, 224, 223, 0.82),
            rgba(178, 247, 241, 0.58),
            transparent
          );
          filter:
            drop-shadow(0 0 6px rgba(103, 224, 223, 0.45))
            drop-shadow(0 0 18px rgba(103, 224, 223, 0.18));
          animation: marketplaceLinePass 720ms ease-out both;
        }

        .transitionLineOne {
          top: 27%;
          left: -18%;
          width: 58vw;
          transform: rotate(13deg);
        }

        .transitionLineTwo {
          right: -20%;
          bottom: 24%;
          width: 52vw;
          transform: rotate(-16deg);
          animation-delay: 90ms;
        }

        .transitionParticle {
          position: absolute;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          opacity: 0;
          background: #b2f7f1;
          box-shadow:
            0 0 12px rgba(178, 247, 241, 0.92),
            0 0 30px rgba(103, 224, 223, 0.42);
          animation: marketplaceParticlePass 680ms ease-out both;
        }

        .transitionParticleOne {
          top: 19%;
          left: 14%;
        }

        .transitionParticleTwo {
          top: 46%;
          right: 18%;
          width: 5px;
          height: 5px;
          animation-delay: 80ms;
        }

        .transitionParticleThree {
          bottom: 17%;
          left: 38%;
          width: 4px;
          height: 4px;
          animation-delay: 140ms;
        }

        @keyframes marketplaceRouteEnter {
          0% {
            opacity: 0;
            transform: translateY(14px) scale(0.995);
            filter: blur(8px);
          }

          54% {
            opacity: 1;
            filter: blur(0);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes marketplaceLinePass {
          0% {
            opacity: 0;
            translate: -18% 0;
            scale: 0.84 1;
          }

          24% {
            opacity: 0.72;
          }

          68% {
            opacity: 0.36;
          }

          100% {
            opacity: 0;
            translate: 34% 0;
            scale: 1.08 1;
          }
        }

        @keyframes marketplaceParticlePass {
          0% {
            opacity: 0;
            transform: translate3d(-18px, 16px, 0) scale(0.4);
          }

          30% {
            opacity: 1;
          }

          100% {
            opacity: 0;
            transform: translate3d(72px, -34px, 0) scale(1.35);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .marketplaceTemplateContent,
          .transitionLine,
          .transitionParticle {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
          }

          .marketplaceTransitionLayer {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
