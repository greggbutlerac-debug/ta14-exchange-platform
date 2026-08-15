'use client';

import type { ReactNode } from 'react';

export default function MarketplaceOpportunitiesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="marketplace-opportunities-polish">
      {children}
      <style jsx global>{`
        .marketplace-opportunities-polish .page-shell {
          background:
            radial-gradient(circle at 50% -8%, rgba(54, 210, 255, .16), transparent 28%),
            radial-gradient(circle at 92% 22%, rgba(116, 76, 220, .13), transparent 31%),
            radial-gradient(circle at 5% 58%, rgba(31, 180, 218, .09), transparent 28%),
            linear-gradient(180deg, #020914 0%, #030b14 46%, #02070d 100%) !important;
        }
        .marketplace-opportunities-polish .content-shell {
          width: min(1320px, calc(100% - 44px)) !important;
          padding-top: 44px !important;
        }
        .marketplace-opportunities-polish .breadcrumbs {
          margin-bottom: 34px !important;
          padding: 9px 13px;
          width: fit-content;
          border: 1px solid rgba(118, 224, 248, .15);
          border-radius: 999px;
          background: rgba(5, 20, 31, .64);
          box-shadow: 0 12px 34px rgba(0,0,0,.28);
          backdrop-filter: blur(16px);
        }
        .marketplace-opportunities-polish .hero {
          position: relative;
          max-width: none !important;
          margin-bottom: 22px;
          padding: clamp(34px, 5vw, 66px) !important;
          border: 1px solid rgba(111, 226, 250, .24);
          border-radius: 30px;
          overflow: hidden;
          background:
            linear-gradient(120deg, rgba(7, 27, 43, .96), rgba(4, 14, 25, .92) 56%, rgba(14, 18, 39, .92));
          box-shadow: 0 32px 90px rgba(0,0,0,.48), inset 0 1px rgba(255,255,255,.05), 0 0 70px rgba(47, 208, 245, .06);
        }
        .marketplace-opportunities-polish .hero::before {
          content: '';
          position: absolute;
          width: 560px;
          height: 560px;
          right: -190px;
          top: -260px;
          border: 1px solid rgba(113, 231, 255, .18);
          border-radius: 50%;
          box-shadow: 0 0 0 58px rgba(113,231,255,.045), 0 0 0 116px rgba(113,231,255,.025);
          pointer-events: none;
          animation: marketplaceHalo 10s ease-in-out infinite;
        }
        .marketplace-opportunities-polish .hero::after {
          content: '';
          position: absolute;
          inset: auto -10% -170px 28%;
          height: 260px;
          background: radial-gradient(ellipse, rgba(51, 210, 247, .16), transparent 67%);
          pointer-events: none;
        }
        .marketplace-opportunities-polish .hero > * { position: relative; z-index: 2; }
        .marketplace-opportunities-polish .hero h1 {
          max-width: 980px;
          margin-top: 15px !important;
          font-size: clamp(3.6rem, 7vw, 7.2rem) !important;
          line-height: .9 !important;
          letter-spacing: -.065em !important;
          text-shadow: 0 18px 55px rgba(0,0,0,.65);
        }
        .marketplace-opportunities-polish .hero-copy {
          max-width: 900px !important;
          font-size: clamp(1rem, 1.35vw, 1.22rem) !important;
          color: #a9c3d1 !important;
        }
        .marketplace-opportunities-polish .boundary-banner {
          max-width: 980px;
          margin-top: 30px !important;
          padding: 19px 22px !important;
          border: 1px solid rgba(232, 192, 84, .23) !important;
          border-left: 3px solid #e5c15c !important;
          border-radius: 14px !important;
          background: linear-gradient(90deg, rgba(222, 176, 61, .105), rgba(222, 176, 61, .025)) !important;
          box-shadow: 0 14px 38px rgba(0,0,0,.24);
        }
        .marketplace-opportunities-polish .primary-button,
        .marketplace-opportunities-polish .secondary-button,
        .marketplace-opportunities-polish .card-primary,
        .marketplace-opportunities-polish .card-secondary {
          position: relative;
          overflow: hidden;
          transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease !important;
        }
        .marketplace-opportunities-polish .primary-button {
          border-radius: 13px !important;
          padding: 15px 22px !important;
          box-shadow: 0 12px 34px rgba(65, 210, 242, .22), 0 0 28px rgba(65,210,242,.1) !important;
        }
        .marketplace-opportunities-polish .secondary-button {
          border-radius: 13px !important;
          padding: 15px 22px !important;
          background: linear-gradient(145deg, rgba(14,42,61,.9), rgba(6,21,34,.9)) !important;
        }
        .marketplace-opportunities-polish .primary-button:hover,
        .marketplace-opportunities-polish .secondary-button:hover,
        .marketplace-opportunities-polish .card-primary:hover,
        .marketplace-opportunities-polish .card-secondary:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 18px 42px rgba(0,0,0,.38), 0 0 28px rgba(73,211,242,.12) !important;
        }
        .marketplace-opportunities-polish .summary-grid {
          gap: 13px !important;
          padding: 8px 0 76px !important;
        }
        .marketplace-opportunities-polish .summary-grid article {
          position: relative;
          min-height: 132px !important;
          padding: 19px !important;
          border-color: rgba(109, 218, 242, .2) !important;
          background: linear-gradient(155deg, rgba(10, 35, 52, .9), rgba(4, 15, 25, .88)) !important;
          box-shadow: 0 17px 40px rgba(0,0,0,.3), inset 0 1px rgba(255,255,255,.045);
          overflow: hidden;
          transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease;
        }
        .marketplace-opportunities-polish .summary-grid article::after {
          content: '';
          position: absolute;
          right: -25px;
          bottom: -28px;
          width: 88px;
          height: 88px;
          border: 1px solid rgba(104,224,248,.11);
          border-radius: 50%;
        }
        .marketplace-opportunities-polish .summary-grid article:hover {
          transform: translateY(-4px);
          border-color: rgba(109, 218, 242, .42) !important;
          box-shadow: 0 24px 48px rgba(0,0,0,.42), 0 0 30px rgba(54,211,245,.07);
        }
        .marketplace-opportunities-polish .filter-panel {
          border-color: rgba(112, 224, 248, .26) !important;
          background:
            radial-gradient(circle at 100% 0, rgba(48,199,235,.09), transparent 35%),
            linear-gradient(145deg, rgba(9, 32, 49, .96), rgba(4, 16, 28, .95)) !important;
          box-shadow: 0 28px 70px rgba(0,0,0,.38), inset 0 1px rgba(255,255,255,.045) !important;
        }
        .marketplace-opportunities-polish .filter-button {
          border-radius: 10px !important;
          background: rgba(7, 24, 37, .72) !important;
          transition: .18s ease;
        }
        .marketplace-opportunities-polish .filter-button:hover { border-color: rgba(103,212,235,.5) !important; transform: translateY(-1px); }
        .marketplace-opportunities-polish .filter-button.selected {
          background: linear-gradient(135deg, #a6efff, #61d2e9) !important;
          box-shadow: 0 9px 24px rgba(74,206,235,.18);
        }
        .marketplace-opportunities-polish .opportunity-grid { gap: 20px !important; }
        .marketplace-opportunities-polish .opportunity-card {
          position: relative;
          border-color: rgba(105, 216, 240, .22) !important;
          background:
            radial-gradient(circle at 100% 0, rgba(55, 207, 242, .08), transparent 28%),
            linear-gradient(150deg, rgba(10, 34, 51, .97), rgba(4, 15, 25, .95)) !important;
          box-shadow: 0 24px 58px rgba(0,0,0,.36), inset 0 1px rgba(255,255,255,.05) !important;
          transition: transform .22s ease, border-color .22s ease, box-shadow .22s ease;
          overflow: hidden;
        }
        .marketplace-opportunities-polish .opportunity-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, #6fe4f8, transparent 62%);
          opacity: .65;
        }
        .marketplace-opportunities-polish .opportunity-card:hover {
          transform: translateY(-6px);
          border-color: rgba(105, 216, 240, .5) !important;
          box-shadow: 0 32px 70px rgba(0,0,0,.5), 0 0 38px rgba(46,205,240,.08) !important;
        }
        .marketplace-opportunities-polish .facts-grid div,
        .marketplace-opportunities-polish .evidence-preview div {
          border: 1px solid rgba(111, 206, 229, .09);
          background: linear-gradient(145deg, rgba(255,255,255,.035), rgba(255,255,255,.015)) !important;
        }
        .marketplace-opportunities-polish .card-primary,
        .marketplace-opportunities-polish .card-secondary { border-radius: 11px !important; }
        .marketplace-opportunities-polish .pathway-section {
          position: relative;
          padding-top: 104px !important;
        }
        .marketplace-opportunities-polish .section-intro {
          max-width: 980px !important;
          margin-bottom: 34px !important;
        }
        .marketplace-opportunities-polish .section-intro h2 {
          font-size: clamp(2.8rem, 5.4vw, 5.2rem) !important;
          line-height: .98;
          text-wrap: balance;
        }
        .marketplace-opportunities-polish .pathway-grid {
          gap: 15px !important;
          perspective: 1200px;
        }
        .marketplace-opportunities-polish .pathway-grid a {
          position: relative;
          min-height: 260px !important;
          padding: 23px !important;
          border-color: rgba(106, 218, 242, .21) !important;
          border-radius: 21px !important;
          overflow: hidden;
          background:
            radial-gradient(circle at 0 0, rgba(49,205,240,.11), transparent 42%),
            linear-gradient(150deg, rgba(10,34,51,.94), rgba(4,14,24,.96)) !important;
          box-shadow: 0 20px 48px rgba(0,0,0,.34), inset 0 1px rgba(255,255,255,.05);
          transition: transform .22s ease, border-color .22s ease, box-shadow .22s ease !important;
        }
        .marketplace-opportunities-polish .pathway-grid a::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: linear-gradient(#6fe6fa, #486cff 62%, transparent);
          opacity: .65;
        }
        .marketplace-opportunities-polish .pathway-grid a::after {
          content: 'OPEN →';
          position: absolute;
          left: 23px;
          bottom: 22px;
          color: #6fe4f8;
          font-size: .7rem;
          font-weight: 900;
          letter-spacing: .12em;
        }
        .marketplace-opportunities-polish .pathway-grid a:hover {
          transform: translateY(-7px) rotateX(1deg);
          border-color: rgba(111, 228, 250, .55) !important;
          background: linear-gradient(150deg, rgba(13,45,65,.97), rgba(5,18,29,.98)) !important;
          box-shadow: 0 30px 64px rgba(0,0,0,.48), 0 0 38px rgba(55,211,245,.09);
        }
        .marketplace-opportunities-polish .pathway-grid a > span {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          border: 1px solid rgba(111,228,250,.42);
          border-radius: 12px;
          background: rgba(56, 205, 238, .07);
          box-shadow: 0 0 24px rgba(58,211,244,.09);
          font-weight: 900;
        }
        .marketplace-opportunities-polish .pathway-grid h3 {
          margin: 29px 0 12px !important;
          font-size: 1.22rem !important;
          line-height: 1.2;
        }
        .marketplace-opportunities-polish .pathway-grid p { padding-bottom: 34px; }
        .marketplace-opportunities-polish .final-cta {
          position: relative;
          max-width: 1080px !important;
          margin-top: 100px !important;
          border-color: rgba(110, 224, 248, .28) !important;
          background:
            radial-gradient(circle at 50% 0, rgba(56, 211, 245, .15), transparent 44%),
            radial-gradient(circle at 90% 90%, rgba(111,78,219,.12), transparent 36%),
            linear-gradient(135deg, rgba(9,35,53,.96), rgba(5,16,28,.96)) !important;
          box-shadow: 0 34px 82px rgba(0,0,0,.46), inset 0 1px rgba(255,255,255,.05);
        }
        .marketplace-opportunities-polish .final-cta h2 { font-size: clamp(2.5rem, 4.5vw, 4.4rem) !important; line-height: 1; }
        @keyframes marketplaceHalo {
          0%,100% { transform: scale(.96) rotate(0deg); opacity: .55; }
          50% { transform: scale(1.04) rotate(9deg); opacity: .9; }
        }
        @media (max-width: 1080px) {
          .marketplace-opportunities-polish .pathway-grid { grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
        }
        @media (max-width: 780px) {
          .marketplace-opportunities-polish .content-shell { width: min(100% - 24px, 1320px) !important; }
          .marketplace-opportunities-polish .hero { padding: 30px 22px !important; border-radius: 22px; }
          .marketplace-opportunities-polish .pathway-grid { grid-template-columns: 1fr !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .marketplace-opportunities-polish .hero::before { animation: none; }
        }
      `}</style>
    </div>
  );
}
