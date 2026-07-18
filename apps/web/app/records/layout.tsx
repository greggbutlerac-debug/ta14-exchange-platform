import { Suspense, type ReactNode } from "react";

type RecordsLayoutProps = {
  children: ReactNode;
};

function RecordsLoadingFallback() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "32px",
        background: "#f4f5f7",
        color: "#101827",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <section
        style={{
          width: "min(620px, 100%)",
          padding: "48px 32px",
          border: "1px solid #dce1e8",
          borderRadius: "18px",
          background: "#ffffff",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(15, 23, 42, 0.06)",
        }}
      >
        <div
          style={{
            width: "20px",
            height: "20px",
            margin: "0 auto 24px",
            borderRadius: "999px",
            background: "#10b981",
            boxShadow: "0 0 0 9px rgba(16, 185, 129, 0.14)",
          }}
        />

        <p
          style={{
            margin: "0 0 10px",
            color: "#047857",
            fontSize: "11px",
            fontWeight: 900,
            letterSpacing: "0.15em",
          }}
        >
          TA-14 RECORD EXCHANGE
        </p>

        <h1
          style={{
            margin: "0 0 14px",
            fontSize: "32px",
            letterSpacing: "-0.04em",
          }}
        >
          Preparing route inspection.
        </h1>

        <p
          style={{
            margin: 0,
            color: "#667085",
            lineHeight: 1.65,
          }}
        >
          Loading the preserved route identity and record-retrieval
          interface.
        </p>
      </section>
    </main>
  );
}

export default function RecordsLayout({
  children,
}: RecordsLayoutProps) {
  return (
    <Suspense fallback={<RecordsLoadingFallback />}>
      {children}
    </Suspense>
  );
}
