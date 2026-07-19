import Link from "next/link";

import { login, signup } from "./actions";

type LoginPageProperties = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function LoginPage({
  searchParams,
}: LoginPageProperties) {
  const parameters = await searchParams;
  const error = parameters.error;
  const message = parameters.message;

  return (
    <main className="account-page">
      <section className="account-shell">
        <div className="account-introduction">
          <Link className="brand-link" href="/">
            TA-14 EXCHANGE PLATFORM
          </Link>

          <p className="eyebrow">Governed Account Access</p>

          <h1>Enter the exchange.</h1>

          <p className="introduction-copy">
            Create an account to construct governance routes, preserve your
            work, evaluate admissibility, and maintain continuity between each
            governed record and its outcome.
          </p>

          <div className="chain" aria-label="TA-14 admissible execution chain">
            <span>Reality</span>
            <span>Record</span>
            <span>Continuity</span>
            <span>Admissibility</span>
            <span>Binding</span>
            <span>Commit</span>
            <span>Execution</span>
            <span>Outcome</span>
          </div>

          <p className="principle">
            No admissible evidence. No admissible execution.
          </p>
        </div>

        <div className="account-panel">
          <div className="panel-heading">
            <p className="eyebrow">Account System</p>
            <h2>Sign in or create an account</h2>
            <p>
              Your account will become the ownership boundary for your saved
              routes, evaluations, records, receipts, and live exchange
              activity.
            </p>
          </div>

          {error ? (
            <div className="notice notice-error" role="alert">
              {error}
            </div>
          ) : null}

          {message ? (
            <div className="notice notice-message" role="status">
              {message}
            </div>
          ) : null}

          <div className="form-grid">
            <form action={login} className="account-form">
              <div className="form-heading">
                <span className="form-number">01</span>
                <div>
                  <h3>Sign in</h3>
                  <p>Continue into your governed workspace.</p>
                </div>
              </div>

              <label>
                Email address
                <input
                  autoComplete="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  type="email"
                />
              </label>

              <label>
                Password
                <input
                  autoComplete="current-password"
                  minLength={8}
                  name="password"
                  placeholder="Enter your password"
                  required
                  type="password"
                />
              </label>

              <button type="submit">Enter workspace</button>
            </form>

            <form action={signup} className="account-form">
              <div className="form-heading">
                <span className="form-number">02</span>
                <div>
                  <h3>Create account</h3>
                  <p>Establish your exchange identity.</p>
                </div>
              </div>

              <label>
                Email address
                <input
                  autoComplete="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  type="email"
                />
              </label>

              <label>
                Password
                <input
                  autoComplete="new-password"
                  minLength={8}
                  name="password"
                  placeholder="At least eight characters"
                  required
                  type="password"
                />
              </label>

              <label>
                Confirm password
                <input
                  autoComplete="new-password"
                  minLength={8}
                  name="confirmPassword"
                  placeholder="Repeat your password"
                  required
                  type="password"
                />
              </label>

              <button type="submit">Create exchange account</button>
            </form>
          </div>

          <p className="account-footnote">
            Account creation does not authorize live execution. Paid live
            evaluations remain separately governed and must satisfy the
            exchange’s admissibility requirements.
          </p>
        </div>
      </section>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .account-page {
          min-height: 100vh;
          padding: 48px 24px;
          background:
            radial-gradient(circle at top left, rgba(49, 92, 246, 0.16), transparent 34%),
            linear-gradient(135deg, #05070b 0%, #0a0d14 48%, #111725 100%);
          color: #f7f8fb;
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        .account-shell {
          width: min(1180px, 100%);
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.4fr);
          gap: 32px;
          align-items: stretch;
        }

        .account-introduction,
        .account-panel {
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 28px;
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.35);
        }

        .account-introduction {
          padding: 42px;
          display: flex;
          flex-direction: column;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.055), transparent),
            rgba(5, 8, 14, 0.84);
        }

        .brand-link {
          width: fit-content;
          color: #ffffff;
          text-decoration: none;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.16em;
        }

        .eyebrow {
          margin: 54px 0 14px;
          color: #8fa8ff;
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        h1,
        h2,
        h3,
        p {
          margin-top: 0;
        }

        h1 {
          max-width: 520px;
          margin-bottom: 20px;
          font-size: clamp(2.75rem, 6vw, 5.5rem);
          line-height: 0.94;
          letter-spacing: -0.06em;
        }

        .introduction-copy {
          max-width: 560px;
          color: #afb7c8;
          font-size: 1.02rem;
          line-height: 1.75;
        }

        .chain {
          margin-top: 28px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .chain span {
          padding: 12px 14px;
          border: 1px solid rgba(143, 168, 255, 0.18);
          border-radius: 999px;
          background: rgba(143, 168, 255, 0.06);
          color: #dbe2ff;
          font-size: 0.78rem;
          font-weight: 700;
          text-align: center;
        }

        .principle {
          margin: auto 0 0;
          padding-top: 42px;
          color: #ffffff;
          font-size: 1rem;
          font-weight: 750;
        }

        .account-panel {
          padding: 42px;
          background: rgba(248, 249, 252, 0.97);
          color: #111522;
        }

        .panel-heading .eyebrow {
          margin-top: 0;
          color: #315cf6;
        }

        .panel-heading h2 {
          margin-bottom: 12px;
          font-size: clamp(2rem, 4vw, 3.15rem);
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .panel-heading > p:last-child {
          max-width: 760px;
          margin-bottom: 28px;
          color: #626a7a;
          line-height: 1.65;
        }

        .notice {
          margin-bottom: 22px;
          padding: 14px 16px;
          border-radius: 14px;
          font-size: 0.92rem;
          font-weight: 650;
          line-height: 1.5;
        }

        .notice-error {
          border: 1px solid #ffc5c5;
          background: #fff0f0;
          color: #8a1e1e;
        }

        .notice-message {
          border: 1px solid #bce9cf;
          background: #edfff4;
          color: #17653a;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .account-form {
          padding: 24px;
          border: 1px solid #dde1e9;
          border-radius: 20px;
          background: #ffffff;
        }

        .form-heading {
          margin-bottom: 22px;
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .form-number {
          flex: 0 0 auto;
          display: grid;
          width: 38px;
          height: 38px;
          place-items: center;
          border-radius: 50%;
          background: #111522;
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 800;
        }

        .form-heading h3 {
          margin-bottom: 4px;
          font-size: 1.25rem;
        }

        .form-heading p {
          margin-bottom: 0;
          color: #7a8291;
          font-size: 0.88rem;
          line-height: 1.5;
        }

        label {
          margin-bottom: 16px;
          display: grid;
          gap: 8px;
          color: #303746;
          font-size: 0.82rem;
          font-weight: 750;
        }

        input {
          width: 100%;
          min-height: 48px;
          padding: 0 14px;
          border: 1px solid #cfd5df;
          border-radius: 12px;
          background: #fbfcfe;
          color: #111522;
          font: inherit;
          outline: none;
          transition:
            border-color 160ms ease,
            box-shadow 160ms ease;
        }

        input:focus {
          border-color: #315cf6;
          box-shadow: 0 0 0 4px rgba(49, 92, 246, 0.12);
        }

        button {
          width: 100%;
          min-height: 50px;
          margin-top: 4px;
          border: 0;
          border-radius: 12px;
          background: #315cf6;
          color: #ffffff;
          cursor: pointer;
          font: inherit;
          font-weight: 800;
          transition:
            transform 160ms ease,
            background 160ms ease;
        }

        button:hover {
          background: #244ad3;
          transform: translateY(-1px);
        }

        .account-footnote {
          margin: 24px 0 0;
          color: #747c8b;
          font-size: 0.8rem;
          line-height: 1.6;
        }

        @media (max-width: 920px) {
          .account-shell {
            grid-template-columns: 1fr;
          }

          .principle {
            margin-top: 28px;
          }
        }

        @media (max-width: 680px) {
          .account-page {
            padding: 18px;
          }

          .account-introduction,
          .account-panel {
            padding: 26px;
            border-radius: 22px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .chain {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
