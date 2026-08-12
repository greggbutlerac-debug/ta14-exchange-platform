import Link from "next/link";

export default function FoundingMethodologyEntry() {
  return (
    <section
      aria-label="Founding Demonstration Methodology and Independence Standard"
      style={{
        position: "relative",
        zIndex: 20,
        width: "min(1310px, 90vw)",
        margin: "0 auto 28px",
        padding: "24px",
        borderRadius: 20,
        border: "1px solid rgba(110,215,255,.20)",
        background:
          "linear-gradient(135deg, rgba(7,35,53,.94), rgba(8,25,38,.96) 55%, rgba(47,34,13,.72))",
        color: "#eef8ff",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 22,
          flexWrap: "wrap",
        }}
      >
        <div style={{ maxWidth: 900 }}>
          <p
            style={{
              margin: 0,
              color: "#79d8f5",
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: ".14em",
            }}
          >
            PUBLIC OPERATING STANDARD · NOW IN FORCE FOR FOUNDING DEMONSTRATIONS
          </p>
          <h2 style={{ margin: "9px 0 8px", fontSize: 27, letterSpacing: "-.025em" }}>
            The cases produced the methodology. The methodology now governs the next cases.
          </h2>
          <p style={{ margin: 0, color: "#9eb8c7", lineHeight: 1.65, fontSize: 13 }}>
            Registration-first entry, frozen claims, evidence admission, finding classes,
            correction symmetry, assessor independence, administrative verification,
            publication control, and chronology preservation are now expressed as one
            Founding Demonstration Methodology &amp; Independence Standard.
          </p>
        </div>
        <Link
          href="/artifacts/founding-demonstrations/methodology"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px 16px",
            borderRadius: 11,
            border: "1px solid rgba(110,215,255,.26)",
            background: "rgba(74,181,225,.10)",
            color: "#ccefff",
            fontSize: 12,
            fontWeight: 850,
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          Read the Methodology Standard →
        </Link>
      </div>
    </section>
  );
}
