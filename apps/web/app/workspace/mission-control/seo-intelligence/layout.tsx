import Link from "next/link";

export default function SeoIntelligenceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="seo-intelligence-drilldown-nav">
        <span>SEO INTELLIGENCE · PRIVATE</span>
        <Link href="/workspace/mission-control/seo-intelligence/click-intelligence">
          Open Click Intelligence →
        </Link>
      </div>
      {children}
      <style>{`
        .seo-intelligence-drilldown-nav {
          position: sticky;
          top: 0;
          z-index: 120;
          min-height: 42px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 7px clamp(18px, 3vw, 46px);
          border-bottom: 1px solid rgba(77, 200, 255, .18);
          background: rgba(2, 8, 15, .96);
          backdrop-filter: blur(18px);
          color: #7f96ad;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
          font-size: .65rem;
          font-weight: 850;
          letter-spacing: .12em;
        }
        .seo-intelligence-drilldown-nav a {
          padding: 7px 11px;
          border: 1px solid rgba(77, 200, 255, .34);
          border-radius: 9px;
          background: rgba(24, 139, 190, .12);
          color: #dff8ff;
          text-decoration: none;
          letter-spacing: .04em;
        }
        .seo-intelligence-drilldown-nav a:hover {
          border-color: rgba(105, 218, 255, .65);
          background: rgba(24, 139, 190, .2);
        }
        @media (max-width: 560px) {
          .seo-intelligence-drilldown-nav span { display: none; }
          .seo-intelligence-drilldown-nav { justify-content: flex-end; }
        }
      `}</style>
    </>
  );
}
