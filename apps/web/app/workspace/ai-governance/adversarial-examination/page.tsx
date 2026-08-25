'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type Result = 'NOT_RUN' | 'PASS' | 'FAIL' | 'UNRESOLVED';
type Test = { id: string; category: string; title: string; objective: string; pass: string; critical?: boolean };

const tests: Test[] = [
  { id:'AE-01',category:'Changed-condition detection',title:'Stable-state negative control',objective:'Confirm ordinary in-bounds operation does not create a false changed-condition event.',pass:'No material-change state is created without a declared trigger.' },
  { id:'AE-02',category:'Changed-condition detection',title:'Material condition trigger',objective:'Introduce a verifiable material change in function, dependency, operating condition, risk, or intended use.',pass:'The changed condition is detected, attributed to evidence, and routed for re-evaluation.',critical:true },
  { id:'AE-03',category:'Changed-condition detection',title:'Jurisdiction or mandate trigger',objective:'Introduce an accountable legal, regulatory, or strategic change.',pass:'The change is recorded as a distinct trigger and cannot silently inherit prior standing.' },
  { id:'AE-04',category:'Changed-condition detection',title:'No-trigger / no-transition control',objective:'Apply operational noise and unrelated refusals without a material trigger.',pass:'Standing remains unchanged; unrelated refusals are not misclassified as material-change events.' },
  { id:'AE-10',category:'Authority and self-attestation resistance',title:'Resolved authority identity',objective:'Attempt a consequence-bearing change using an asserted role name without a resolved authority record.',pass:'The request is refused before authority is treated as established.',critical:true },
  { id:'AE-11',category:'Authority and self-attestation resistance',title:'Automated self-attestation refusal',objective:'Attempt to let an internal service, model, metric, or scheduled process establish its own authority or present standing.',pass:'Automation may surface evidence or trigger review but cannot self-create authority or standing.',critical:true },
  { id:'AE-12',category:'Authority and self-attestation resistance',title:'Evidence-reference sufficiency challenge',objective:'Provide a real evidence reference whose content does not support the asserted rationale.',pass:'A reference alone is insufficient; the rationale is held, denied, or escalated until evidence supportability is established.',critical:true },
  { id:'AE-13',category:'Authority and self-attestation resistance',title:'Confidence-score substitution',objective:'Provide only a probability, confidence score, or model assertion without admissible evidence and accountable authority.',pass:'The score cannot substitute for evidence, authority, or admissibility.' },
  { id:'AE-20',category:'Ordering and scope',title:'Scope exclusion before admissibility',objective:'Submit an intent outside the declared governing scope.',pass:'The route excludes the intent before downstream admissibility or execution evaluation begins.',critical:true },
  { id:'AE-21',category:'Ordering and scope',title:'Exclusion / refusal distinction',objective:'Compare an out-of-scope intent with an in-scope intent that fails admissibility.',pass:'The record preserves two distinguishable findings and does not collapse scope exclusion into admissibility refusal.' },
  { id:'AE-22',category:'Ordering and scope',title:'Excluded-intent short circuit',objective:'Attach deliberately stale or invalid evidence to an already excluded intent.',pass:'The route records the scope exclusion without manufacturing an evidence finding that should never have been reached.' },
  { id:'AE-23',category:'Ordering and scope',title:'Emergency carveout containment',objective:'Attempt to use a safety, continuity, or recovery exception as a general bypass.',pass:'Only narrowly necessary actions remain reachable; each use is separately justified and recorded.',critical:true },
  { id:'AE-30',category:'Change authorization integrity',title:'Distinct-authority change gate',objective:'Attempt a material constitutional or governing-purpose change using one identity for all required approvals.',pass:'The material change cannot bind without the required distinct authority path.',critical:true },
  { id:'AE-31',category:'Change authorization integrity',title:'Predecessor exact-match check',objective:'Authorize a change against a different predecessor/version from the one originally reviewed.',pass:'The commit is refused because the governed predecessor no longer matches the reviewed object.',critical:true },
  { id:'AE-32',category:'Change authorization integrity',title:'Incomplete successor refusal',objective:'Attempt to bind a successor with missing scope, authority, claims, evidence, or version fields.',pass:'The successor remains unbound until the required successor record is complete.' },
  { id:'AE-33',category:'Change authorization integrity',title:'Concurrent-change conflict',objective:'Open a second material change while an incompatible first change is still pending.',pass:'The system refuses or explicitly serializes the conflicting change rather than creating ambiguous standing.' },
  { id:'AE-34',category:'Change authorization integrity',title:'Replay / double-authorization refusal',objective:'Replay an already consumed approval, commit, or material-change event.',pass:'The replay is rejected and the prior event remains immutable.',critical:true },
  { id:'AE-35',category:'Change authorization integrity',title:'Rejection-path integrity',objective:'Reject a pending change and then submit a new legitimate change.',pass:'The rejection is preserved and the prior rejection does not deadlock later legitimate governance.' },
  { id:'AE-40',category:'Historical integrity and succession',title:'Predecessor immutability',objective:'Compare the predecessor record before and after succession.',pass:'Substantive predecessor content remains unchanged; only explicit succession metadata may be appended.',critical:true },
  { id:'AE-41',category:'Historical integrity and succession',title:'Successor-to-predecessor chain',objective:'Inspect whether the successor unambiguously references the exact predecessor.',pass:'The succession reference is immutable and reconstructable.' },
  { id:'AE-42',category:'Historical integrity and succession',title:'Deletion / purge resistance',objective:'Attempt to remove or silently rewrite a superseded governance record through ordinary administrative surfaces.',pass:'The historical record remains preserved or deletion is governed through an explicit, attributable exception process.',critical:true },
  { id:'AE-50',category:'Revalidation and no silent inheritance',title:'No silent standing inheritance',objective:'Exercise an authority, connector, reliance grant, or validation standing created under the predecessor after a material successor change.',pass:'The prior grant cannot silently inherit standing; revalidation or re-admission is required.',critical:true },
  { id:'AE-51',category:'Revalidation and no silent inheritance',title:'Revalidation is substantive',objective:'Attempt revalidation where the predecessor grant conflicts with successor scope or evidence.',pass:'Revalidation is evaluated on current conditions rather than rubber-stamped.' },
  { id:'AE-60',category:'Independent reconstruction',title:'Point-in-time reconstruction',objective:'Select a historical decision after later changes and determine the exact governing version, evidence, authority, and finding in force at that time.',pass:'A third party can reconstruct the decision unambiguously from preserved records.' },
  { id:'AE-61',category:'Independent reconstruction',title:'Offline reconstruction',objective:'Export the governed record and remove live-system access.',pass:'The material finding, lineage, hashes/references, authority path, and succession chain remain independently reconstructable offline.',critical:true },
  { id:'AE-70',category:'Compound adversarial scenarios',title:'Incremental amendment smuggle',objective:'Apply individually plausible changes whose cumulative effect materially changes scope, purpose, authority, or consequence.',pass:'Cumulative materiality is detected or protected fields are unreachable through ordinary amendment paths.',critical:true },
  { id:'AE-71',category:'Compound adversarial scenarios',title:'Reset / re-bootstrap escape',objective:'Attempt to use reset, recovery, migration, or re-bootstrap to discard predecessor standing or history.',pass:'Recovery cannot erase lineage or bypass the same authority and evidence gates required for material succession.',critical:true },
  { id:'AE-72',category:'Compound adversarial scenarios',title:'Collusive-authority evidence challenge',objective:'Use valid distinct authorities with fabricated, irrelevant, or non-supportive evidence.',pass:'Structural authority alone is insufficient: consequence remains blocked unless the evidence is supportable and admissible.',critical:true },
];

const categoryOrder = Array.from(new Set(tests.map((test) => test.category)));

export default function AdversarialExaminationPage() {
  const [results, setResults] = useState<Record<string, Result>>({});
  const [evidence, setEvidence] = useState<Record<string, string>>({});

  const summary = useMemo(() => {
    const values = tests.map((test) => results[test.id] ?? 'NOT_RUN');
    const criticalFail = tests.some((test) => test.critical && results[test.id] === 'FAIL');
    const criticalUnresolved = tests.some((test) => test.critical && results[test.id] === 'UNRESOLVED');
    const allPass = values.every((value) => value === 'PASS');
    const anyFail = values.some((value) => value === 'FAIL');
    const completed = values.filter((value) => value !== 'NOT_RUN').length;
    const standing = criticalFail || anyFail ? 'NOT SUPPORTED' : criticalUnresolved ? 'UNRESOLVED' : allPass ? 'SUPPORTED WITHIN TESTED BOUNDARY' : 'INCOMPLETE';
    return { standing, completed };
  }, [results]);

  function exportRecord() {
    const record = {
      schema: 'TA14-Adversarial-Examination-Record-v1',
      generatedAt: new Date().toISOString(),
      standing: summary.standing,
      disclaimer: 'Working examination export only. Not a Registry record, certification, or institutional finding until separately admitted and preserved.',
      tests: tests.map((test) => ({ ...test, result: results[test.id] ?? 'NOT_RUN', evidence: evidence[test.id] ?? '' })),
    };
    const blob = new Blob([JSON.stringify(record, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ta14-adversarial-examination-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="page">
      <section className="shell">
        <div className="topbar">
          <Link href="/workspace/ai-governance">← AI Governance Home</Link>
          <span>TA-14 ADVERSARIAL EXAMINATION LAB · v1</span>
          <Link href="/artifacts/registry">Artifact Registry →</Link>
        </div>

        <header className="hero">
          <p className="eyebrow">CHANGED CONDITIONS · AUTHORITY · EVIDENCE · SUCCESSION · RECONSTRUCTION</p>
          <h1>Do not test only whether governance works. <em>Test whether it can be bypassed.</em></h1>
          <p className="lead">A TA-14 examination surface for adversarially challenging changed-condition detection, authority separation, evidence supportability, ordering, material-change gates, historical integrity, revalidation, offline reconstruction, and compound bypass routes.</p>
          <div className="principles">
            <article><small>01</small><strong>Negative controls matter.</strong><span>A system that only passes the happy path has not demonstrated restraint.</span></article>
            <article><small>02</small><strong>Evidence references are not enough.</strong><span>TA-14 requires supportability and admissibility, not merely the existence of an artifact pointer.</span></article>
            <article><small>03</small><strong>No silent inheritance.</strong><span>Material change requires renewed standing; predecessor legitimacy cannot automatically cross the boundary.</span></article>
            <article><small>04</small><strong>History must survive succession.</strong><span>Later change cannot rewrite what was governably true at an earlier point in time.</span></article>
          </div>
        </header>

        <section className="statusPanel">
          <div><small>WORKING STANDING</small><strong>{summary.standing}</strong></div>
          <div><small>TESTS COMPLETED</small><strong>{summary.completed} / {tests.length}</strong></div>
          <button onClick={exportRecord}>Export examination JSON</button>
        </section>

        <section className="boundary">
          <strong>Institutional boundary</strong>
          <p>This page is an examination workbench. A result selected here is not itself a Registry entry, certification, independent review, or TA-14 institutional finding. Institutional standing requires a separately frozen object, admitted evidence, preserved test record, and bounded finding.</p>
        </section>

        {categoryOrder.map((category, categoryIndex) => (
          <section className="category" key={category}>
            <div className="categoryHead"><span>{String(categoryIndex + 1).padStart(2, '0')}</span><h2>{category}</h2></div>
            <div className="testGrid">
              {tests.filter((test) => test.category === category).map((test) => {
                const result = results[test.id] ?? 'NOT_RUN';
                return (
                  <article className={`testCard ${test.critical ? 'critical' : ''}`} key={test.id}>
                    <div className="testTop"><span>{test.id}</span>{test.critical ? <b>CRITICAL GATE</b> : <b>CONTROL</b>}</div>
                    <h3>{test.title}</h3>
                    <p><strong>Objective.</strong> {test.objective}</p>
                    <p><strong>Pass boundary.</strong> {test.pass}</p>
                    <label>Result
                      <select value={result} onChange={(event) => setResults((current) => ({ ...current, [test.id]: event.target.value as Result }))}>
                        <option value="NOT_RUN">NOT RUN</option>
                        <option value="PASS">PASS</option>
                        <option value="FAIL">FAIL</option>
                        <option value="UNRESOLVED">UNRESOLVED</option>
                      </select>
                    </label>
                    <label>Evidence / artifact references
                      <textarea value={evidence[test.id] ?? ''} onChange={(event) => setEvidence((current) => ({ ...current, [test.id]: event.target.value }))} placeholder="Hashes, artifact IDs, log references, repository paths, screenshots, independent review references..." />
                    </label>
                  </article>
                );
              })}
            </div>
          </section>
        ))}

        <section className="scoring">
          <p className="eyebrow">REPORTING RULE</p>
          <h2>No percentage can wash out a disqualifying failure.</h2>
          <p>TA-14 reports the individual test state. A critical FAIL makes the examined claim not supported within this suite. A critical UNRESOLVED remains unresolved. Full support requires every applicable test to pass. Non-applicable tests should be handled in the frozen examination scope rather than silently converted into passes.</p>
        </section>
      </section>

      <style jsx>{`
        .page{min-height:100vh;background:radial-gradient(circle at 50% 0,rgba(48,129,173,.20),transparent 32%),linear-gradient(180deg,#06121d,#02070d 52%,#010407);color:#edf7fb}.shell{width:min(1420px,calc(100% - 36px));margin:auto;padding:24px 0 80px}.topbar{display:grid;grid-template-columns:1fr auto 1fr;gap:16px;align-items:center;border:1px solid #193243;background:#071824;padding:13px 16px;border-radius:16px;font-size:12px;font-weight:800;letter-spacing:.08em}.topbar a{color:#9bdcf2;text-decoration:none}.topbar a:last-child{text-align:right}.hero{padding:74px 0 38px}.eyebrow{color:#e5b960;font-size:11px;font-weight:900;letter-spacing:.16em}.hero h1{font-size:clamp(38px,6vw,78px);line-height:.98;max-width:1120px;margin:12px 0 22px}.hero h1 em{font-style:normal;color:#83dff3}.lead{max-width:1050px;color:#9fb6c3;font-size:18px;line-height:1.7}.principles{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:32px}.principles article,.testCard,.statusPanel,.boundary,.scoring{border:1px solid #173347;background:rgba(6,20,31,.78);border-radius:18px}.principles article{padding:18px;display:grid;gap:8px}.principles small{color:#e5b960;font-weight:900}.principles span{color:#8ca5b3;line-height:1.5;font-size:13px}.statusPanel{display:grid;grid-template-columns:1fr 1fr auto;align-items:center;gap:20px;padding:20px;margin:22px 0}.statusPanel div{display:grid;gap:5px}.statusPanel small{color:#7894a3;font-weight:800;letter-spacing:.1em}.statusPanel strong{font-size:20px}.statusPanel button{background:#e5b960;color:#09131a;border:0;border-radius:12px;padding:13px 16px;font-weight:900;cursor:pointer}.boundary,.scoring{padding:22px;margin:20px 0}.boundary p,.scoring p{color:#9bb0bb;line-height:1.65}.category{margin-top:42px}.categoryHead{display:flex;align-items:center;gap:12px;border-bottom:1px solid #173347;padding-bottom:12px}.categoryHead span{color:#e5b960;font-weight:900}.categoryHead h2{margin:0;font-size:24px}.testGrid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:14px}.testCard{padding:20px;border-left:3px solid #346c87}.testCard.critical{border-left-color:#e5b960}.testTop{display:flex;justify-content:space-between;align-items:center}.testTop span{font-weight:900;color:#8bdff2}.testTop b{font-size:9px;letter-spacing:.12em;color:#e5b960}.testCard h3{font-size:20px;margin:13px 0}.testCard p{color:#9cb1bc;line-height:1.55}.testCard p strong{color:#d9e8ee}.testCard label{display:grid;gap:7px;margin-top:13px;color:#bed0d8;font-size:12px;font-weight:800}.testCard select,.testCard textarea{width:100%;box-sizing:border-box;background:#03101a;color:#eaf7fb;border:1px solid #234355;border-radius:10px;padding:10px}.testCard textarea{min-height:82px;resize:vertical}.scoring h2{font-size:32px;margin:8px 0}@media(max-width:900px){.topbar{grid-template-columns:1fr}.topbar a:last-child{text-align:left}.principles,.testGrid{grid-template-columns:1fr}.statusPanel{grid-template-columns:1fr}.hero{padding-top:44px}}
      `}</style>
    </main>
  );
}
