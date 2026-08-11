import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedGovernedArtifact } from "../../../../lib/governed-artifacts/public-repository";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ARTIFACT_IDENTIFIER = "FD-2026-0005-GFR";

export default async function GovernedFindingPage() {
  const artifact = await getPublishedGovernedArtifact(ARTIFACT_IDENTIFIER);
  if (!artifact) notFound();

  return (
    <main style={{ minHeight: "100vh", background: "#050914", color: "#eef5ff", padding: "48px 24px" }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <Link href="/artifacts/registry" style={{ color: "#9fc7ff" }}>← Artifact Registry</Link>
        <p style={{ marginTop: 32, letterSpacing: ".16em", textTransform: "uppercase", opacity: .7 }}>TA-14 Governed Finding Record</p>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", lineHeight: 1.02, margin: "12px 0 18px" }}>{artifact.title}</h1>
        <p style={{ maxWidth: 850, fontSize: 18, lineHeight: 1.7, opacity: .86 }}>{artifact.public_summary}</p>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 14, marginTop: 32 }}>
          <Fact label="Artifact" value={artifact.artifact_identifier} />
          <Fact label="Governance" value={`${artifact.governance_name} · ${artifact.governance_registry_identifier}`} />
          <Fact label="Governance version" value={`${artifact.governance_version ?? "Not declared"} · ${artifact.governance_version_verification_status}`} />
          <Fact label="Record version" value={artifact.current_record_version} />
          <Fact label="Finding" value={artifact.finding_class ?? "Not classified"} />
          <Fact label="Technical review" value={artifact.technical_review_status ?? "Not applicable"} />
          <Fact label="Correction" value={artifact.correction_status ?? "Not applicable"} />
          <Fact label="Administrative verification" value={artifact.administrative_verification_status ?? "Not applicable"} />
        </section>

        <Section title="Public finding language">
          <p>{artifact.public_finding_language ?? artifact.public_summary}</p>
        </Section>

        <Section title="Claims boundary">
          <p>{artifact.claims_boundary}</p>
        </Section>

        <Section title="Limitations">
          <ul style={{ paddingLeft: 22, lineHeight: 1.75 }}>
            {artifact.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}
          </ul>
        </Section>

        <Section title="Evidence and integrity">
          <p><strong>Evidence objects:</strong> {artifact.evidence_object_identifiers.join(", ") || "None publicly declared"}</p>
          <p><strong>Source SHA-256:</strong> <code style={{ overflowWrap: "anywhere" }}>{artifact.source_sha256 ?? "Not published"}</code></p>
          <p><strong>Source size:</strong> {artifact.source_size_bytes ? `${artifact.source_size_bytes.toLocaleString()} bytes` : "Not published"}</p>
          <p><strong>Disclosure:</strong> {artifact.disclosure_state}. {artifact.file_publication_authorized ? "The governed source file is authorized for publication." : "The governed source file is not authorized for public publication."}</p>
          {artifact.file_publication_authorized && artifact.public_file_url ? (
            <p><a href={artifact.public_file_url} style={{ color: "#9fc7ff" }}>Open governed source file</a></p>
          ) : null}
        </Section>
      </div>
    </main>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div style={{ border: "1px solid rgba(159,199,255,.22)", borderRadius: 16, padding: 18, background: "rgba(255,255,255,.025)" }}><div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: ".1em", opacity: .6 }}>{label}</div><div style={{ marginTop: 8, fontWeight: 700, lineHeight: 1.45 }}>{value}</div></div>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section style={{ marginTop: 42, borderTop: "1px solid rgba(255,255,255,.12)", paddingTop: 24 }}><h2 style={{ fontSize: 24 }}>{title}</h2><div style={{ lineHeight: 1.75, opacity: .86 }}>{children}</div></section>;
}
