import Link from 'next/link';

export default function CommandCenterHub() {
  return (
    <main className="shell">
      <header>
        <span>TA-14 OPERATING ROOMS</span>
        <h1>COMMAND <em>CENTERS</em></h1>
        <p>Two operating environments. Two different purposes. No blended metrics.</p>
      </header>

      <section className="grid">
        <Link className="card commercial" href="/eu-ai-act/command-center">
          <small>COMMERCIAL OPERATIONS</small>
          <h2>Commercial Command Center</h2>
          <p>EU AI Act systems, obligations, evidence state, change impact, revalidation, examinations and governed commercial execution.</p>
          <strong>OPEN COMMERCIAL →</strong>
        </Link>

        <Link className="card residential" href="/transparent-air/command-center">
          <small>RESIDENTIAL OPERATIONS</small>
          <h2>Transparent Air Residential Command Center</h2>
          <p>Local SEO, Google indexing state, market pages, residential search visibility, Search Console actions and phone-call conversion.</p>
          <strong>OPEN RESIDENTIAL →</strong>
        </Link>
      </section>

      <footer>
        <Link href="/">← TA-14 Exchange</Link>
      </footer>

      <style>{`
        *{box-sizing:border-box}body{margin:0}.shell{min-height:100vh;background:#05090d;color:#eef8fb;font-family:Inter,system-ui,sans-serif;padding:0 5vw 70px}header{max-width:1250px;margin:auto;padding:110px 0 60px}header span{font-size:10px;letter-spacing:.2em;font-weight:900;color:#81dfea}h1{font:clamp(62px,9vw,118px)/.88 Georgia,serif;margin:18px 0}h1 em{font-style:normal;color:#7fe5db}header p{font-size:18px;color:#8eaab5}.grid{max-width:1250px;margin:auto;display:grid;grid-template-columns:1fr 1fr;gap:18px}.card{min-height:420px;padding:42px;border:1px solid #25404d;text-decoration:none;color:#eef8fb;display:flex;flex-direction:column;justify-content:flex-end;transition:.18s ease}.card:hover{transform:translateY(-3px);border-color:#7bdeda}.commercial{background:radial-gradient(circle at 75% 10%,#174b8066,transparent 38%),#09141d}.residential{background:radial-gradient(circle at 75% 10%,#17696066,transparent 38%),#0a191b}.card small{font-size:9px;letter-spacing:.17em;font-weight:900;color:#79dbe5}.residential small{color:#7fe5db}.card h2{font:42px/1.02 Georgia,serif;margin:12px 0 16px}.card p{color:#9ab0ba;line-height:1.7;max-width:540px}.card strong{margin-top:26px;font-size:10px;letter-spacing:.12em;color:#c5f7f4}footer{max-width:1250px;margin:35px auto 0}footer a{color:#90bec7;text-decoration:none;font-size:10px;font-weight:900}@media(max-width:800px){header{padding-top:70px}.grid{grid-template-columns:1fr}.card{min-height:330px}h1{font-size:58px}}
      `}</style>
    </main>
  );
}
