import Link from "next/link";

export default function PublicCorpusRecordNotFound() {
  return (
    <main className="notFoundPage">
      <div className="orbit orbitOne" aria-hidden="true" />
      <div className="orbit orbitTwo" aria-hidden="true" />

      <section className="notFoundCard">
        <div className="eyebrow">TA-14 Public Corpus</div>

        <p className="code">404 · Record not found</p>

        <h1>This public record could not be located.</h1>

        <p className="lead">
          The record identifier may be incomplete, the route may have changed,
          or the item may not yet be available as an individual corpus record.
          The complete Public Corpus remains available for search and review.
        </p>

        <div className="actions">
          <Link href="/foundation/public-corpus">
            Search the Complete Public Corpus
          </Link>

          <Link href="/foundation">Return to Credentials & Public Record</Link>
        </div>

        <div className="boundary">
          <span>Public-record boundary</span>
          <p>
            A missing route is not evidence that a publication, filing,
            repository, implementation, or chronology item does not exist. It
            means only that this specific corpus-record route could not be
            resolved.
          </p>
        </div>
      </section>

      <style>{`
        :root {
          color-scheme: dark;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #020911;
        }

        .notFoundPage {
          position: relative;
          min-height: 100vh;
          padding: 32px;
          display: grid;
          place-items: center;
          overflow: hidden;
          color: #eef7fb;
          background:
            radial-gradient(
              circle at 18% 12%,
              rgba(52, 167, 198, 0.17),
              transparent 30rem
            ),
            radial-gradient(
              circle at 83% 78%,
              rgba(224, 164, 66, 0.12),
              transparent 27rem
            ),
            linear-gradient(155deg, #071826 0%, #020911 55%, #04111b 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .notFoundPage::before {
          position: absolute;
          inset: 0;
          content: "";
          pointer-events: none;
          opacity: 0.18;
          background-image:
            linear-gradient(
              rgba(111, 212, 235, 0.08) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(111, 212, 235, 0.08) 1px,
              transparent 1px
            );
          background-size: 74px 74px;
          mask-image: radial-gradient(circle at center, black, transparent 76%);
        }

        .orbit {
          position: absolute;
          width: 440px;
          height: 440px;
          border: 1px solid rgba(115, 214, 237, 0.12);
          border-radius: 50%;
          pointer-events: none;
          animation: orbitDrift 18s ease-in-out infinite alternate;
        }

        .orbit::before,
        .orbit::after {
          position: absolute;
          content: "";
          border-radius: 50%;
          background: #7bdff0;
          box-shadow: 0 0 22px rgba(123, 223, 240, 0.76);
        }

        .orbit::before {
          top: 12%;
          left: 7%;
          width: 4px;
          height: 4px;
        }

        .orbit::after {
          right: 5%;
          bottom: 21%;
          width: 3px;
          height: 3px;
        }

        .orbitOne {
          top: -180px;
          right: -110px;
        }

        .orbitTwo {
          bottom: -250px;
          left: -160px;
          transform: scale(1.3);
          animation-delay: -7s;
        }

        .notFoundCard {
          position: relative;
          z-index: 1;
          width: min(780px, 100%);
          padding: clamp(30px, 6vw, 62px);
          border: 1px solid rgba(111, 211, 234, 0.2);
          border-radius: 28px;
          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(237, 184, 88, 0.1),
              transparent 34%
            ),
            linear-gradient(
              145deg,
              rgba(12, 36, 52, 0.94),
              rgba(3, 15, 25, 0.96)
            );
          box-shadow:
            0 34px 110px rgba(0, 0, 0, 0.45),
            inset 0 1px 0 rgba(255, 255, 255, 0.03);
        }

        .eyebrow {
          color: #77deef;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .code {
          margin: 25px 0 13px;
          color: #f1c879;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        h1 {
          max-width: 680px;
          margin: 0;
          color: #f4f8fa;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(41px, 7vw, 72px);
          font-weight: 500;
          line-height: 0.99;
          letter-spacing: -0.045em;
        }

        .lead {
          max-width: 670px;
          margin: 27px 0 0;
          color: #a3b8c4;
          font-size: clamp(15px, 2vw, 18px);
          line-height: 1.72;
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 31px;
        }

        .actions a {
          min-height: 49px;
          padding: 0 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #06131b;
          border-radius: 12px;
          background: linear-gradient(135deg, #f2d18e, #d8a148);
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.045em;
          text-align: center;
          text-decoration: none;
          text-transform: uppercase;
        }

        .actions a + a {
          color: #d8ebf2;
          border: 1px solid rgba(112, 211, 234, 0.23);
          background: rgba(5, 25, 38, 0.78);
        }

        .boundary {
          margin-top: 37px;
          padding-top: 23px;
          border-top: 1px solid rgba(112, 207, 230, 0.14);
        }

        .boundary span {
          color: #7cdfee;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .boundary p {
          margin: 11px 0 0;
          color: #718a98;
          font-size: 11px;
          line-height: 1.65;
        }

        @keyframes orbitDrift {
          from {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          to {
            transform: translate3d(-35px, 25px, 0) rotate(16deg);
          }
        }

        @media (max-width: 620px) {
          .notFoundPage {
            padding: 12px;
          }

          .notFoundCard {
            padding: 28px 22px;
            border-radius: 20px;
          }

          .actions {
            display: grid;
          }

          .actions a {
            width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .orbit {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}
