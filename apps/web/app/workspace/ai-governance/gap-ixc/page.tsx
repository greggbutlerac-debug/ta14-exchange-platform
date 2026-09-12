import Link from "next/link";
import { GAP_IXC_DIMENSION_LABELS, GAP_IXC_STATES, type GapIxcDimension } from "@/lib/gap-ixc/types";

export const metadata = {
  title: "GAP-IXC Assurance | TA-14 Exchange",
  description: "Proposition-addressable assurance for governance basis, authority, proposition support, implementation, execution, and consequence.",
};

const dimensions = Object.entries(GAP_IXC_DIMENSION_LABELS) as Array<[GapIxcDimension, string]>;
const flow = [
  ["01", "Freeze", "Fix the proposition, version, scope, exclusions, route, execution boundary, consequence boundary, evidence rules, and output schema before evidence review."],
  ["02", "Admit", "Identify evidence objects, provenance, temporal relevance, integrity, proposition relationship, limitations, contradictions, and derived-evidence lineage."],
  ["03", "Determine", "Assess only applicable G/A/P/I/X/C dimensions. No favorable state inherits into another dimension and no architecture-wide PASS is produced."],
  ["04", "Qualify", "Bind every state to evidentiary standing, evidence references, material qualifications, assessor identity, independence boundary, time, and revalidation triggers."],
  ["05", "Reproduce", "Freeze the same packet for separate assessors. Preserve R0 match through R4 hidden-context dependency without averaging disagreement away."],
  ["06", "Revalidate", "Material change withdraws present reliance where applicable and creates a bounded revalidation event rather than silent inheritance."],
] as const;

export default function GapIxcWorkspacePage() {
  return (
    <main className="page">
      <section className="shell">
        <nav className="top">
          <Link href="/workspace/ai-governance">← AI Governance Home</Link>
          <span>TA-14 · GAP-IXC ASSURANCE</span>
          <Link href="/artifacts/registry">Artifact Registry →</Link>
        </nav>

        <header className="hero">
          <p>PROPOSITION-ADDRESSABLE · EVIDENCE-BOUND · QUALIFICATION-PORTABLE</p>
          <h1>What has actually<br/><em>been established?</em></h1>
          <p className="lead">The execution chain governs how consequence may form. GAP-IXC governs what the Exchange may responsibly say the evidence establishes about a frozen proposition.</p>
          <div className="boundary"><strong>No architecture-wide PASS.</strong><span>No state travels without its proposition, target/version, evidence basis, material qualification, evidence reference, and independence boundary.</span></div>
        </header>

        <section>
          <div className="heading"><p>THE SIX ASSURANCE DIMENSIONS</p><h2>Do not allow one kind of proof to impersonate another.</h2></div>
          <div className="dimensionGrid">
            {dimensions.map(([code, label]) => <article key={code}><b>{code}</b><h3>{label}</h3><p>{({G:"Is an attributable governance basis established for the bounded function?",A:"Is current bounded authority established for the consequential action?",P:"Does admitted evidence establish the exact factual proposition relied upon?",I:"Does admitted evidence establish the claimed control in the identified implementation/version?",X:"Does admitted evidence establish what occurred at the governed execution boundary?",C:"Does admitted evidence establish formation or non-formation of the identified downstream consequence?"} as Record<GapIxcDimension,string>)[code]}</p></article>)}
          </div>
        </section>

        <section className="states">
          <div className="heading"><p>DETERMINATION GRAMMAR</p><h2>Five states. No discretionary midpoint.</h2></div>
          <div className="stateRow">{GAP_IXC_STATES.map(state => <span key={state}>{state.replaceAll("_", " ")}</span>)}</div>
          <p>PARTIALLY ESTABLISHED is available only when material sub-propositions were frozen before evidence review and the frozen sub-propositions resolve differently. Missing evidence is not automatically indeterminate.</p>
        </section>

        <section>
          <div className="heading"><p>THE ASSURANCE ROUTE</p><h2>Freeze first. Evidence decides.</h2></div>
          <div className="flow">{flow.map(([n,title,text]) => <article key={n}><b>{n}</b><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
        </section>

        <section className="separation">
          <div><small>TA-14 EXECUTION ARCHITECTURE</small><h2>Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome</h2><p>Controls whether a consequential action earns standing to bind and execute.</p></div>
          <div><small>GAP-IXC ASSURANCE ARCHITECTURE</small><h2>G · A · P · I · X · C</h2><p>Controls what may be claimed as established about governance basis, authority, evidence, implementation, execution, and consequence.</p></div>
        </section>

        <section className="historical"><strong>Historical non-conversion boundary</strong><p>Existing L0-L7 records remain historical classifications. GAP-IXC does not silently translate an L6 record into favorable present-tense G/A/P/I/X/C states. A later GAP-IXC assessment is a new, separately identified record tied to its frozen historical evidence.</p></section>
      </section>
      <style jsx>{`
        .page{min-height:100vh;background:radial-gradient(circle at 50% 0,rgba(38,152,190,.2),transparent 32%),#02070d;color:#eef8fc}.shell{width:min(1280px,calc(100% - 36px));margin:auto;padding:24px 0 80px}.top{display:grid;grid-template-columns:1fr auto 1fr;gap:16px;padding:14px 16px;border:1px solid #19384a;border-radius:16px;background:#071824;font-size:11px;font-weight:900;letter-spacing:.09em}.top a{color:#9de5f8;text-decoration:none}.top a:last-child{text-align:right}.hero{padding:64px 0 42px}.hero>p:first-child,.heading p{color:#e9bd65;font-size:11px;font-weight:900;letter-spacing:.16em}.hero h1{font-size:clamp(44px,7vw,82px);line-height:.94;margin:12px 0 24px}.hero em{font-style:normal;color:#83e4f6}.lead{max-width:900px;color:#b4c7d1;font-size:19px;line-height:1.7}.boundary,.historical{display:grid;gap:8px;margin-top:24px;padding:20px;border:1px solid #2a6074;border-radius:18px;background:#061721}.boundary strong,.historical strong{color:#fff}.boundary span,.historical p,.states>p{color:#9fb5c0;line-height:1.65}.heading{margin:42px 0 16px}.heading h2{font-size:30px;margin:7px 0}.dimensionGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.dimensionGrid article,.flow article,.separation>div{border:1px solid #19384a;border-radius:18px;background:#06141f;padding:20px}.dimensionGrid b{display:grid;place-items:center;width:42px;height:42px;border:1px solid #3c8298;border-radius:12px;color:#8be8fa}.dimensionGrid h3{font-size:19px}.dimensionGrid p,.flow p,.separation p{color:#9fb5c0;line-height:1.6}.states{margin:44px 0}.stateRow{display:flex;gap:9px;flex-wrap:wrap}.stateRow span{padding:10px 13px;border:1px solid #31566a;border-radius:999px;background:#071824;font-size:10px;font-weight:900;letter-spacing:.07em}.flow{display:grid;gap:10px}.flow article{display:grid;grid-template-columns:54px 1fr;gap:14px}.flow article>b{color:#e9bd65;font-size:18px}.flow h3{margin:0 0 5px}.flow p{margin:0}.separation{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:44px}.separation small{color:#e9bd65;font-weight:900;letter-spacing:.1em}.separation h2{font-size:21px;line-height:1.45}.historical{margin-top:18px;border-color:#66512a}@media(max-width:850px){.top,.dimensionGrid,.separation{grid-template-columns:1fr}.top a:last-child{text-align:left}}`}</style>
    </main>
  );
}
