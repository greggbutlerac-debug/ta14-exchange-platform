import Link from "next/link";

const events = [
  {
    id: "EVT-8112",
    event: "scope.version.accepted",
    subject: "TA14-SCP-000084",
    actor: "Authorized organization representative",
    occurred: "8 minutes ago",
    className: "gold",
  },
  {
    id: "EVT-8111",
    event: "evidence.package.submitted",
    subject: "TA14-EVD-000119",
    actor: "Governance entity steward",
    occurred: "27 minutes ago",
    className: "cyan",
  },
  {
    id: "EVT-8110",
    event: "registry.review.assigned",
    subject: "TA14-ENT-000017",
    actor: "TA-14 Registry",
    occurred: "1 hour ago",
    className: "violet",
  },
  {
    id: "EVT-8109",
    event: "credential.issued",
    subject: "TA14-CRD-000006",
    actor: "TA-14 Academy",
    occurred: "Yesterday",
    className: "green",
  },
  {
    id: "EVT-8108",
    event: "artifact.outcome.required",
    subject: "TA14-EA-000012",
    actor: "Artifact integrity service",
    occurred: "Yesterday",
    className: "red",
  },
] as const;

export default function InstitutionalHistoryPage() {
  return (
    <main className="historyPage">
      <div className="grid" />
      <header className="topbar">
        <div>
          <p>TA-14 AUTHORITY GOVERNANCE INSTITUTION</p>
          <h1>Institutional History</h1>
        </div>
        <div className="actions">
          <Link href="/workspace/mission-control">← Mission Control</Link>
          <Link href="/workspace/history" className="routeLedger">Route History Ledger →</Link>
        </div>
      </header>

      <section className="hero">
        <p className="eyebrow">INSTITUTION-WIDE CHRONOLOGY</p>
        <h2>See what the institution did, in what order, and under which record.</h2>
        <p className="lead">
          Institutional History preserves the cross-institution operating chronology: scope actions,
          evidence events, registry assignments, credentials, review events, artifacts, corrections,
          appeals, authority changes, publication actions, and outcomes. Route-specific technical
          lineage remains separately preserved in the Route History Ledger.
        </p>
        <div className="boundary">
          <strong>HISTORY BOUNDARY</strong>
          <span>Institutional chronology is not the same record as route-version lineage.</span>
        </div>
      </section>

      <section className="summary">
        <article><span>5</span><small>Current visible events</small></article>
        <article><span>5</span><small>Institutional subjects</small></article>
        <article><span>4</span><small>Institutional actors/services</small></article>
        <article><span>1</span><small>Canonical chronology</small></article>
      </section>

      <section className="panel">
        <div className="panelHeading">
          <div>
            <p className="eyebrow">RECENT INSTITUTIONAL EVENTS</p>
            <h3>Append-only operating history</h3>
          </div>
          <span>Current Mission Control projection</span>
        </div>

        <div className="eventList">
          {events.map((item) => (
            <article key={item.id} className="eventRow">
              <div className={`eventMark ${item.className}`} />
              <div className="eventPrimary">
                <strong>{item.event}</strong>
                <span>{item.id}</span>
              </div>
              <div>
                <small>SUBJECT</small>
                <strong>{item.subject}</strong>
              </div>
              <div>
                <small>ACTOR</small>
                <strong>{item.actor}</strong>
              </div>
              <div>
                <small>OCCURRED</small>
                <strong>{item.occurred}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="split">
        <article className="panel compact">
          <p className="eyebrow">WHAT BELONGS HERE</p>
          <h3>Institutional consequence history</h3>
          <p>Registration, evidence admission, assignments, scope changes, credentials, determinations, publication, corrections, appeals, authority changes, standards actions, and outcomes.</p>
        </article>
        <article className="panel compact">
          <p className="eyebrow">SEPARATE SPECIALIZED LEDGER</p>
          <h3>Route History Ledger</h3>
          <p>Route creation, version publication, test receipts, replay determinations, revocations, predecessor digests, and route-specific continuity remain at their existing specialized destination.</p>
          <Link href="/workspace/history">Open Route History Ledger →</Link>
        </article>
      </section>

      <footer>
        <strong>No silent rewrite of institutional history.</strong>
        <p>Corrections, supersession, and changed conditions should add chronology rather than erase prior institutional state.</p>
        <Link href="/institution/constitution">Read TA-14 Institutional Constitution →</Link>
      </footer>

      <style>{`
        *{box-sizing:border-box}.historyPage{min-height:100vh;background:#030712;color:#f4f8ff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;position:relative;padding:30px}.grid{position:fixed;inset:0;pointer-events:none;background-image:radial-gradient(circle at 18% 6%,rgba(89,215,255,.12),transparent 25%),radial-gradient(circle at 82% 15%,rgba(242,200,101,.08),transparent 20%),linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px);background-size:auto,auto,58px 58px,58px 58px}.topbar,.hero,.summary,.panel,.split,footer{position:relative;z-index:1;width:min(1180px,100%);margin-left:auto;margin-right:auto}.topbar{display:flex;justify-content:space-between;align-items:center;padding:8px 0 24px}.topbar p,.eyebrow{margin:0;color:#59d7ff;font-size:11px;font-weight:900;letter-spacing:.16em}.topbar h1{margin:5px 0 0;font-size:28px}.actions{display:flex;gap:10px}.actions a,.compact a,footer a{color:#9ee9ff;text-decoration:none;font-weight:800}.actions a{padding:10px 13px;border:1px solid rgba(89,215,255,.22);border-radius:10px}.actions .routeLedger{border-color:rgba(242,200,101,.3);color:#f2c865}.hero,.panel,footer{border:1px solid rgba(132,164,202,.17);background:linear-gradient(145deg,rgba(8,19,39,.93),rgba(4,10,23,.9));border-radius:24px}.hero{padding:42px}.hero h2{font-size:clamp(34px,5vw,58px);line-height:1.03;letter-spacing:-.045em;max-width:900px;margin:12px 0 20px}.lead{color:#aebfd1;font-size:17px;line-height:1.8;max-width:930px}.boundary{margin-top:26px;padding:15px 18px;border-left:3px solid #f2c865;background:rgba(242,200,101,.06);display:flex;gap:12px;flex-wrap:wrap}.boundary strong{color:#f2c865}.boundary span{color:#c0cadd}.summary{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:16px;margin-bottom:16px}.summary article{padding:20px;border:1px solid rgba(132,164,202,.16);border-radius:18px;background:rgba(6,14,29,.86)}.summary span{display:block;font-size:30px;font-weight:950}.summary small{color:#8fa4bb}.panel{padding:28px}.panelHeading{display:flex;justify-content:space-between;gap:20px;align-items:end}.panelHeading h3,.compact h3{font-size:25px;margin:7px 0 0}.panelHeading>span{color:#7f94aa;font-size:12px}.eventList{margin-top:22px;display:grid;gap:8px}.eventRow{display:grid;grid-template-columns:5px 1.2fr .9fr 1.1fr .55fr;gap:15px;align-items:center;padding:15px;border:1px solid rgba(132,164,202,.12);border-radius:14px;background:rgba(2,8,20,.52)}.eventMark{height:48px;border-radius:999px;background:#59d7ff}.eventMark.gold{background:#f2c865}.eventMark.violet{background:#ae92ff}.eventMark.green{background:#65dfaa}.eventMark.red{background:#ff7c8d}.eventPrimary strong{display:block}.eventPrimary span,.eventRow small{color:#7f94aa;font-size:11px}.eventRow>div:not(.eventPrimary):not(.eventMark){display:grid;gap:4px}.eventRow>div>strong{font-size:13px}.split{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px}.compact{margin:0}.compact p:not(.eyebrow),footer p{color:#aebfd1;line-height:1.7}.compact a{display:inline-block;margin-top:8px}footer{margin-top:16px;padding:28px}footer strong{font-size:20px}footer a{display:inline-block;margin-top:8px}@media(max-width:850px){.historyPage{padding:16px}.topbar{align-items:flex-start;gap:16px;flex-direction:column}.summary{grid-template-columns:repeat(2,1fr)}.eventRow{grid-template-columns:5px 1fr}.eventRow>div:not(.eventPrimary):not(.eventMark){grid-column:2}.split{grid-template-columns:1fr}.hero{padding:28px}}@media(max-width:520px){.summary{grid-template-columns:1fr}.actions{flex-wrap:wrap}.hero h2{font-size:36px}}
      `}</style>
    </main>
  );
}
