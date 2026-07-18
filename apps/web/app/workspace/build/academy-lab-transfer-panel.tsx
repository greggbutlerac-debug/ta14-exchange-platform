"use client";

import type { AcademyLabTransfer } from "./use-academy-lab-transfer";

type AcademyLabTransferPanelProps = {
  transfer: AcademyLabTransfer;
  onApply: () => void;
  onDismiss: () => void;
};

export default function AcademyLabTransferPanel({
  transfer,
  onApply,
  onDismiss,
}: AcademyLabTransferPanelProps) {
  return (
    <section
      aria-labelledby="academy-transfer-title"
      style={{
        marginBottom: "24px",
        padding: "20px",
        border: "1px solid rgba(96, 165, 250, 0.45)",
        borderRadius: "16px",
        background:
          "linear-gradient(135deg, rgba(30, 64, 175, 0.18), rgba(15, 23, 42, 0.82))",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ maxWidth: "760px" }}>
          <div
            style={{
              marginBottom: "8px",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#93c5fd",
            }}
          >
            Academy Lab Transfer Detected
          </div>

          <h2
            id="academy-transfer-title"
            style={{
              margin: 0,
              fontSize: "22px",
              lineHeight: 1.25,
            }}
          >
            {transfer.labTitle}
          </h2>

          <p
            style={{
              margin: "10px 0 0",
              color: "rgba(226, 232, 240, 0.82)",
              lineHeight: 1.6,
            }}
          >
            A route draft from the Academy Lab is ready to be loaded into
            the Visual Route Builder. Applying it will replace the current
            route name, metadata, and eight-stage chain.
          </p>

          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              marginTop: "14px",
            }}
          >
            <span
              style={{
                padding: "6px 10px",
                borderRadius: "999px",
                background: "rgba(15, 23, 42, 0.75)",
                border: "1px solid rgba(148, 163, 184, 0.25)",
                fontSize: "12px",
              }}
            >
              Source: Academy Lab
            </span>

            <span
              style={{
                padding: "6px 10px",
                borderRadius: "999px",
                background: "rgba(15, 23, 42, 0.75)",
                border: "1px solid rgba(148, 163, 184, 0.25)",
                fontSize: "12px",
              }}
            >
              Lab ID: {transfer.labId}
            </span>

            <span
              style={{
                padding: "6px 10px",
                borderRadius: "999px",
                background: "rgba(15, 23, 42, 0.75)",
                border: "1px solid rgba(148, 163, 184, 0.25)",
                fontSize: "12px",
              }}
            >
              Schema: {transfer.route.schema}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={onDismiss}
            style={{
              minHeight: "42px",
              padding: "0 16px",
              borderRadius: "10px",
              border: "1px solid rgba(148, 163, 184, 0.35)",
              background: "rgba(15, 23, 42, 0.7)",
              color: "#e2e8f0",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Dismiss
          </button>

          <button
            type="button"
            onClick={onApply}
            style={{
              minHeight: "42px",
              padding: "0 18px",
              borderRadius: "10px",
              border: "1px solid rgba(147, 197, 253, 0.55)",
              background: "#2563eb",
              color: "#ffffff",
              cursor: "pointer",
              fontWeight: 800,
            }}
          >
            Load into Builder
          </button>
        </div>
      </div>
    </section>
  );
}
