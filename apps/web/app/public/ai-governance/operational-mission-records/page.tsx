import type { Metadata } from "next";
import Link from "next/link";

const description =
  "Public TA-14 Operational Mission Records preserve consequential real-world workflows as evidence evolves without turning connectivity, status, or capability into execution authority.";
const canonical = "https://www.ta14exchange.com/public/ai-governance/operational-mission-records";

export const metadata: Metadata = {
  title: "Operational Mission Records",
  description,
  alternates: { canonical },
  openGraph: {
    title: "Operational Mission Records | TA-14 Authority",
    description,
    url: canonical,
    siteName: "TA-14 Authority",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Operational Mission Records | TA-14 Authority",
    description,
    images: ["https://www.ta14exchange.com/ta14-social-preview.png"],
  },
};

export default function PublicOperationalMissionRecordsPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#030b13", color: "#f4f1e8", fontFamily: "Arial,sans-serif", padding: "32px" }}>
      <section style={{ maxWidth: 1280, margin: "0 auto" }}>
        <nav style={{ display: "flex", justifyContent: "space-between", gap: 24, padding: "16px 0", borderBottom: "1px solid #ffffff22", flexWrap: "wrap" }}>
          <Link href="/" style={{ color: "#7edcf3" }}>← TA-14 Exchange</Link>
          <span style={{ fontSize: 12, letterSpacing: ".14em", fontWeight: 900 }}>TA-14 · PUBLIC GOVERNED EVIDENCE</span>
        </nav>

        <header style={{ padding: "90px 0 55px", maxWidth: 980 }}>
          <p style={{ color: "#e9b84f", fontSize: 12, fontWeight: 900, letterSpacing: ".15em" }}>OPERATIONAL MISSION RECORDS · OMR</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(52px,7vw,96px)", lineHeight: .95, margin: "18px 0" }}>Preserve what actually happened.</h1>
          <p style={{ fontSize: 21, lineHeight: 1.65, color: "#b5c3cd" }}>
            An Operational Mission Record preserves a consequential real-world workflow as evidence evolves: objects, assertions, determinations, machine and human handoffs, failures, corrections, challenges, authority boundaries, execution state, and outcome. It does not turn connectivity into authority or workflow status into physical truth.
          </p>
        </header>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12, marginBottom: 36 }}>
          {[
            ["FD", "Founding Demonstration", "Does a bounded proposition about one architecture survive examination?"],
            ["IE", "Interoperability Examination", "What is supported at a bounded relationship between independent architectures?"],
            ["OMR", "Operational Mission Record", "What actually happened as governed architecture encountered consequential work?"],
          ].map(([code, title, text]) => (
            <article key={code} style={{ border: "1px solid #ffffff20", borderRadius: 18, padding: 24, background: "#081724" }}>
              <b style={{ color: code === "OMR" ? "#e9b84f" : "#7edcf3" }}>{code}</b>
              <h2 style={{ fontFamily: "Georgia,serif" }}>{title}</h2>
              <p style={{ color: "#9fb0bc", lineHeight: 1.55 }}>{text}</p>
            </article>
          ))}
        </section>

        <Link href="/public/ai-governance/operational-mission-records/onuma-re1" style={{ display: "block", border: "1px solid #e9b84f77", borderRadius: 24, padding: "34px", background: "linear-gradient(135deg,#101c26,#07131f)", color: "inherit", textDecoration: "none" }}>
          <p style={{ color: "#e9b84f", fontSize: 11, fontWeight: 900, letterSpacing: ".14em" }}>TA14-OMR-000001 · MISSION OPEN</p>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 30, alignItems: "end", flexWrap: "wrap" }}>
            <div>
              <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(34px,5vw,62px)", margin: "8px 0" }}>The HOLD that became work.</h2>
              <p style={{ color: "#aebdca", fontSize: 17 }}>ONUMA / TA-14 · RE1 Governed Building Interoperability Mission</p>
            </div>
            <strong style={{ color: "#ff675b", fontSize: 32 }}>HOLD →</strong>
          </div>
        </Link>

        <section style={{ marginTop: 34, padding: 28, border: "1px solid #ffffff18", borderRadius: 20 }}>
          <p style={{ color: "#e9b84f", fontSize: 11, fontWeight: 900, letterSpacing: ".14em" }}>PUBLICATION BOUNDARY</p>
          <h2 style={{ fontFamily: "Georgia,serif", fontSize: 34 }}>Public evidence does not mean unrestricted evidence.</h2>
          <p style={{ color: "#9fb0bc", lineHeight: 1.6, maxWidth: 900 }}>
            Published OMR surfaces expose only evidence and source links appropriate for public inspection. Controlled correspondence, credentials, working documents, account-specific access links, and other private mission evidence remain outside the public route.
          </p>
        </section>
      </section>
    </main>
  );
}
