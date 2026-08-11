import Link from "next/link";

const CLASSES = [
  {
    code: "CLASS-01",
    title: "Execution Artifacts",
    description:
      "Bounded records of governed execution events, determinations, technical effects, receipts, outcomes, and preserved execution evidence.",
    identity:
      "Execution artifacts answer what happened at a governed execution boundary and what bounded consequence was released, held, denied, escalated, or verified.",
    href: "#directory",
    status: "Established corpus",
  },
  {
    code: "CLASS-02",
    title: "Governed Finding Artifacts",
    description:
      "Controlled TA-14 review records produced from admitted evidence, frozen claims, correction chronology, bounded findings, and explicit non-claims.",
    identity:
      "Governed findings answer what the admitted evidence establishes, what remains unestablished, and how factual corrections alter the record without erasing chronology.",
    href: "#governed-findings",
    status: "Live production corpus",
  },
] as const;

export default function ArtifactClassificationBridge() {
  return (
    <section
      aria-labelledby="artifact-classification-title"
      style={{
        marginTop: 48,
        borderTop: "1px solid rgba(255,255,255,.12)",
        paddingTop: 42,
      }}
    >
      <div style={{ maxWidth: 900 }}>
        <p
          style={{
            margin: 0,
            fontSize: 12,
            letterSpacing: ".16em",
            textTransform: "uppercase",
            opacity: .58,
          }}
        >
          One Exchange Registry · Multiple governed artifact classes
        </p>
        <h2
          id="artifact-classification-title"
          style={{ margin: "10px 0 14px", fontSize: "clamp(1.9rem,4vw,3.3rem)" }}
        >
          Artifact classes preserve different propositions.
        </h2>
        <p style={{ margin: 0, lineHeight: 1.75, opacity: .76, fontSize: 17 }}>
          TA-14 does not collapse every governed record into one evidence type. Execution artifacts preserve bounded execution events. Governed finding artifacts preserve the result of bounded evidence review. Both may belong to the same governance history while proving different things.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: 16,
          marginTop: 28,
        }}
      >
        {CLASSES.map((artifactClass) => (
          <article
            key={artifactClass.code}
            style={{
              border: "1px solid rgba(159,199,255,.2)",
              borderRadius: 22,
              padding: 22,
              background: "rgba(255,255,255,.025)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, letterSpacing: ".12em", opacity: .58 }}>{artifactClass.code}</span>
              <span style={{ fontSize: 12, opacity: .66 }}>{artifactClass.status}</span>
            </div>
            <h3 style={{ fontSize: 24, margin: "14px 0 10px" }}>{artifactClass.title}</h3>
            <p style={{ lineHeight: 1.68, opacity: .82 }}>{artifactClass.description}</p>
            <p style={{ lineHeight: 1.68, opacity: .68, fontSize: 14 }}>{artifactClass.identity}</p>
            <Link href={artifactClass.href} style={{ color: "#9fc7ff", fontWeight: 700 }}>
              Open {artifactClass.title} →
            </Link>
          </article>
        ))}
      </div>

      <div
        style={{
          marginTop: 22,
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,.1)",
          padding: 18,
          lineHeight: 1.65,
          opacity: .74,
        }}
      >
        <strong>Registry rule:</strong> Artifact class does not change the claims boundary. A governed finding does not become an execution artifact merely because it concerns execution, and an execution artifact does not become a TA-14 finding merely because it is registered in the Exchange.
      </div>
    </section>
  );
}
