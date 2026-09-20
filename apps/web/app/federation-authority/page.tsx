import Link from 'next/link';
import GuidedShowroom from '../components/GuidedShowroom';

export const metadata = {
  title: 'Federation & Authority | TA-14 Exchange',
  description: 'Cross-domain authority context, Authority Passports, Connection Profiles, interoperability evidence, and bounded recognition.',
};

const flow = ['ISSUING DOMAIN','AUTHORITY PASSPORT','CONNECTION PROFILE','RECEIVING DOMAIN'];
const local = ['LOCAL COMPILATION','ADMISSIBILITY','LOCAL LEASE','LOCAL CAPSULE','EFFECT'];
const decisions = ['ACCEPT','ACCEPT_NARROWED','HOLD','REJECT','QUARANTINE','SUSPEND','ESCALATE'];

const passportFields = [
  ['passport_id','Stable identifier, version, lifecycle state, issue time, expiry and supersession.'],
  ['issuer','Issuer-domain identity, key, trust anchor and authority evidence.'],
  ['principal_lineage','Principal, delegators, depth, signatures and revocation status.'],
  ['constitution_reference','Constitution digest, profile, version, dependencies and amendments.'],
  ['purpose','Allowed objective, forbidden drift and completion condition.'],
  ['delegation_envelope','Allowed receiver classes, maximum depth, fan-out and sub-delegation rules.'],
  ['authority_state','Lease reference, route state, continuity status and expiry.'],
  ['freshness','CURRENT, AGING, STALE, EXPIRED or UNKNOWN, with next validation deadline.'],
  ['consequence_budget','Remaining capacity, reservations, consumed amounts and debt.'],
  ['irreversibility_position','Current stage, next protected threshold and local burden required.'],
  ['jurisdiction','Origin, destination constraints, residency, transfer and legal boundaries.'],
  ['proof_obligations','Required receipts, witnesses, replay, restraint and retention.'],
  ['revocation','Class, endpoint, latency, sequence and propagation requirements.'],
  ['closure_responsibility','Named owner for outcome, remediation, dispute and residual debt.'],
];

const lifecycle = [
  ['DRAFT','Prepared but not issued.'],['ISSUED','Signed by issuer; not yet accepted.'],
  ['ACCEPTED','Accepted for local assessment without narrowing.'],['ACCEPTED_NARROWED','Accepted only after explicit narrowing.'],
  ['ACTIVE','Local compilation and current local assessment support continued use.'],['HEARTBEAT_PENDING','Freshness renewal required before next protected threshold.'],
  ['SUSPENDED','Temporarily barred pending resolution.'],['REVOKED','Authority context terminated.'],
  ['SUPERSEDED','Replaced by a later Passport version.'],['EXPIRED','Time validity ended.'],
  ['DISPUTED','Material lineage, semantic or proof conflict unresolved.'],['CLOSED','Outcome, budget and residual obligations closed.'],
];

const conformance = [
  ['SELF_DECLARED','Implementation operator','Mapped tests, signed evidence bundle, disclosed scope and conflicts.'],
  ['INDEPENDENT_ASSESSED','Independent assessor','Independent test execution, lineage and narrowing review, build/profile binding.'],
  ['TA14_RECOGNIZED','TA-14 or designated authority','Independent assessment plus recognition review, validity and revocation entry.'],
];

export default function FederationAuthorityPage(){
  return <main style={{minHeight:'100vh',background:'linear-gradient(180deg,#02080e,#06151c 48%,#02080e)',color:'#eefcff',fontFamily:'Inter,system-ui,sans-serif'}}>
    <div style={{width:'min(1180px,calc(100% - 36px))',margin:'0 auto',padding:'28px 0 90px'}}>
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0 28px',borderBottom:'1px solid #17333b'}}>
        <Link href="/" style={{color:'#fff',textDecoration:'none',fontWeight:900,letterSpacing:'.12em'}}>TA-14 EXCHANGE</Link>
        <span style={{fontSize:11,color:'#78d9d3',letterSpacing:'.12em'}}>FEDERATION & AUTHORITY</span>
      </nav>
      <div style={{display:'flex',flexWrap:'wrap',gap:8,margin:'18px 0 28px',padding:'12px',border:'1px solid #24464d',borderRadius:12,background:'rgba(3,15,21,.82)'}}>
<Link href="/federation-authority" style={{padding:'10px 12px',border:'1px solid #31545b',borderRadius:8,color:'#d7eeee',textDecoration:'none',fontSize:10,fontWeight:900}}>FAMILY HOME</Link>
<Link href="/admissible-federation-architecture" style={{padding:'10px 12px',border:'1px solid #31545b',borderRadius:8,color:'#d7eeee',textDecoration:'none',fontSize:10,fontWeight:900}}>EXPLORE AFA</Link>
<Link href="/execution-authority-boundary-architecture" style={{padding:'10px 12px',border:'1px solid #31545b',borderRadius:8,color:'#d7eeee',textDecoration:'none',fontSize:10,fontWeight:900}}>EXPLORE EABA</Link>
<Link href="/authority-journey" style={{padding:'10px 12px',borderRadius:8,background:'#71e7df',color:'#031216',textDecoration:'none',fontSize:10,fontWeight:950}}>RUN AUTHORITY JOURNEY</Link>
<Link href="/afa-eaba-operational-challenge" style={{padding:'10px 12px',border:'1px solid #e7c76e',borderRadius:8,color:'#e7c76e',textDecoration:'none',fontSize:10,fontWeight:900}}>INSPECT FROZEN CHALLENGE</Link>
</div>
      <section style={{padding:'76px 0 50px',maxWidth:930}}>
        <div style={{fontSize:11,fontWeight:900,letterSpacing:'.18em',color:'#70e7e0'}}>AUTHORITY PASSPORT PROTOCOL · CROSS-DOMAIN GOVERNANCE</div>
        <h1 style={{fontSize:'clamp(48px,8vw,92px)',lineHeight:.94,letterSpacing:'-.05em',margin:'18px 0'}}>AUTHORITY CAN TRAVEL.<br/><span style={{color:'#70e7e0'}}>EXECUTION AUTHORITY CANNOT.</span></h1>
        <p style={{fontSize:20,lineHeight:1.65,color:'#a9c3ca',maxWidth:820}}>TA-14 Federation & Authority exposes the governed seam between independent domains: what authority context may cross, what the receiving domain may accept, and what must still be re-established locally before protected consequence.</p>
      </section>
      <GuidedShowroom
        eyebrow="FEDERATION & AUTHORITY · GUIDED TOUR"
        title="The crossing is not the permission."
        intro="This surface explains the machinery beneath AFA: what an Authority Passport may carry, what a Connection Profile must declare, and what the receiving domain must still establish for itself."
        accent="#70e7e0"
        gold="#e4ca87"
        steps={[
          {label:'01 · PACKAGE',title:'Package bounded authority context',plain:'The Authority Passport carries identity, issuer, lineage, purpose, authority state, scope, freshness, revocation context, and integrity references.'},
          {label:'02 · PROFILE',title:'Declare the interface',plain:'The Connection Profile says what the provider supplies, what the consumer expects, what is allowed to cross, and what is prohibited from crossing.',why:'Negative space is part of the protocol.'},
          {label:'03 · RECEIVE',title:'Make a receiving-domain determination',plain:'The receiver verifies the presentation and records a bounded decision. It does not inherit execution permission from the sender.'},
          {label:'04 · STOP',title:'Terminate federation before effect',plain:'Local lease, local capsule, commit, execution, and effect remain outside the federation crossing.',result:'ACCEPTANCE DOES NOT GRANT COMMIT OR EXECUTION AUTHORITY'},
          {label:'05 · RE-ESTABLISH',title:'Local governance begins',plain:'Only after the crossing terminates may the receiving domain establish its own admissibility, authority, binding, and consequence route.'},
        ]}
      />

      <section style={{padding:'30px',border:'1px solid #1f4a51',borderRadius:22,background:'rgba(4,20,27,.78)'}}>
        <div style={{fontSize:10,fontWeight:900,letterSpacing:'.16em',color:'#70e7e0',marginBottom:18}}>CROSS-DOMAIN SEAM</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:10,alignItems:'center'}}>{flow.map((x,i)=><span key={x} style={{padding:'14px 16px',border:'1px solid #2a646a',borderRadius:10,fontSize:11,fontWeight:900}}>{x}{i<flow.length-1?'  →':''}</span>)}</div>
        <div style={{margin:'28px 0 18px',padding:'12px 14px',border:'1px dashed #d8b45f',color:'#e4ca87',fontSize:11,fontWeight:900,letterSpacing:'.1em'}}>BOUNDARY: ACCEPTANCE DOES NOT GRANT COMMIT OR EXECUTION AUTHORITY</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:8}}>{local.map((x,i)=><span key={x} style={{padding:'10px 12px',background:'#071a21',borderRadius:8,color:'#a9c3ca',fontSize:10,fontWeight:800}}>{x}{i<local.length-1?'  →':''}</span>)}</div>
      </section>
      <section style={{padding:'34px',border:'1px solid #2a646a',borderRadius:20,background:'linear-gradient(135deg,rgba(22,79,84,.34),rgba(3,15,21,.92))',margin:'28px 0 18px'}}>
        <div style={{fontSize:10,fontWeight:900,letterSpacing:'.16em',color:'#70e7e0'}}>FOUNDING CONNECTION PROFILE · AFA-IP-001 v0.3</div>
        <h2 style={{fontSize:'clamp(30px,5vw,50px)',lineHeight:1.04,letterSpacing:'-.04em',margin:'12px 0'}}>The Connection Profile is the crossing. <span style={{color:'#e4ca87'}}>It is not permission to act.</span></h2>
        <p style={{color:'#a9c3ca',fontSize:16,lineHeight:1.7,maxWidth:900}}>AFA-IP-001 is the TA-14-authored Authority Passport × CNS/CP Connection Profile examination artifact for Passport Presentation & Acceptance. It defines the bounded crossing, preserves negative space, records receipt or refusal, and terminates federation before any local execution entitlement exists.</p>
        <div style={{display:'flex',flexWrap:'wrap',gap:8,margin:'18px 0'}}>
          {['LOCAL EXERCISE','UNPUBLISHED','NON-RESOLVABLE','EXTERNAL INTEROPERABILITY · NOT CLAIMED'].map(x=><span key={x} style={{padding:'8px 10px',border:'1px solid #31545a',borderRadius:8,color:'#a8c1c8',fontSize:9,fontWeight:900}}>{x}</span>)}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:10,marginTop:20}}>
          {[
            ['REQUIRED FOR THIS PROFILE','Passport identity, issuer, lineage, purpose, authority state, freshness, revocation context, consequence bounds, jurisdiction and integrity reference.'],
            ['OPTIONAL IF DECLARED','Constitution reference, delegation envelope, proof obligations, irreversibility position, closure responsibility and understood bounded extensions.'],
            ['PROHIBITED IMPORT','Local Lease, Local Capsule, Commit authorization, Execution authorization, permission to produce Effect, or proof that present local reality remains admissible.'],
          ].map(([t,p])=><article key={t} style={{padding:18,border:'1px solid #214a51',borderRadius:12,background:'#04151c'}}><strong style={{display:'block',color:t==='PROHIBITED IMPORT'?'#ffb29a':'#70e7e0',fontSize:10}}>{t}</strong><p style={{color:'#94adb5',fontSize:11,lineHeight:1.6}}>{p}</p></article>)}
        </div>
        <div style={{marginTop:20,padding:'14px 16px',border:'1px dashed #e4ca87',borderRadius:10,color:'#e4ca87',fontSize:11,fontWeight:900,textAlign:'center'}}>PRESENT → VERIFY → RECEIVE → DETERMINE → TERMINATE → RE-ESTABLISH → LOCAL GOVERNANCE ONLY</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:10,marginTop:20}}>
          <Link href="/admissible-federation-architecture" style={{padding:'12px 15px',borderRadius:9,background:'#70e7e0',color:'#031216',textDecoration:'none',fontSize:10,fontWeight:900}}>OPEN AFA SHOWROOM →</Link>
          <a href="https://doi.org/10.5281/zenodo.22846133" target="_blank" rel="noreferrer" style={{padding:'12px 15px',border:'1px solid #28545b',borderRadius:9,color:'#d7eeee',textDecoration:'none',fontSize:10,fontWeight:900}}>INSPECT AFA v1.0-RC1 ↗</a>
        </div>
        <p style={{marginTop:16,color:'#78939a',fontSize:10,lineHeight:1.6}}>AFA-IP-001 v0.3 remains an examination artifact with evidence gates open. CNS/CP certification or endorsement, registry publication, proven external interoperability, TA14_RECOGNIZED status and completed runtime/CI execution evidence are not claimed.</p>
      </section>

      <section style={{padding:'34px',border:'1px solid #6c5b31',borderRadius:20,background:'linear-gradient(135deg,rgba(83,62,14,.20),rgba(3,15,21,.94))',margin:'28px 0'}}>
        <div style={{fontSize:10,fontWeight:950,letterSpacing:'.16em',color:'#e7c76e'}}>AFA × EABA · FLAGSHIP COMPOSITION</div>
        <h2 style={{fontSize:'clamp(34px,5vw,56px)',lineHeight:1.02,letterSpacing:'-.04em',margin:'12px 0'}}>INTEROPERABILITY WITHOUT AUTHORITY LAUNDERING.</h2>
        <p style={{color:'#a9c3ca',fontSize:16,lineHeight:1.7,maxWidth:900}}>AFA can accept bounded authority context across an independent-domain seam while EABA still HOLDs, DENYs, or ESCALATEs the exact local consequence. The Authority Journey lets you operate both boundaries as one end-to-end path without collapsing them into one architecture.</p>
        <div style={{display:'flex',flexWrap:'wrap',gap:10,marginTop:20}}><Link href="/authority-journey" style={{padding:'13px 16px',borderRadius:9,background:'#71e7df',color:'#031216',textDecoration:'none',fontSize:10,fontWeight:950}}>RUN THE AUTHORITY JOURNEY →</Link><Link href="/afa-eaba-operational-challenge" style={{padding:'13px 16px',border:'1px solid #e7c76e',borderRadius:9,color:'#e7c76e',textDecoration:'none',fontSize:10,fontWeight:900}}>INSPECT FROZEN OPERATIONAL CHALLENGE →</Link></div>
      </section>

      <section style={{padding:'64px 0 20px'}}>
        <h2 style={{fontSize:38,letterSpacing:'-.03em'}}>Enter the federation work.</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:14}}>
          {[
            ['AUTHORITY PASSPORT PROTOCOL','Canonical AVP architecture, object model, lifecycle, receipts, revocation, trust and closure.'],
            ['CONNECTION PROFILES','AVP × CNS/CP interface mapping: provider, consumer, positive space, negative space and versioned profile semantics.'],
            ['PASSPORT LAB','Simulate presentation, receipt, narrowing, freshness, revocation and receiving-domain decisions.'],
            ['INTEROPERABILITY TESTS','Run bounded reference vectors and preserve passes, failures, HOLDs and restraint evidence.'],
            ['CONFORMANCE & RECOGNITION','SELF_DECLARED → INDEPENDENT_ASSESSED → TA14_RECOGNIZED, with scope and validity preserved.'],
            ['IMPLEMENTER CENTER','Schemas, fixtures, implementation guidance and evidence requirements for real integrations.']
          ].map(([t,p])=><article key={t} style={{padding:22,border:'1px solid #173f47',borderRadius:15,background:'rgba(3,15,21,.9)'}}><strong style={{fontSize:12,color:'#70e7e0',letterSpacing:'.08em'}}>{t}</strong><p style={{fontSize:13,lineHeight:1.6,color:'#94adb5'}}>{p}</p></article>)}
        </div>
      </section>
      <section style={{padding:'64px 0',borderTop:'1px solid #14313a'}}>
        <div style={{fontSize:10,fontWeight:900,letterSpacing:'.15em',color:'#70e7e0'}}>WHY FEDERATION NEEDS GOVERNANCE</div>
        <h2 style={{fontSize:40,letterSpacing:'-.03em',margin:'12px 0'}}>Trust is not authority. Identity is not permission. Capability is not admissibility.</h2>
        <p style={{color:'#9fb7be',lineHeight:1.7,maxWidth:900}}>Modern AI, building, financial and operational systems cross organizational boundaries constantly. The dangerous shortcut is to treat successful transport as successful authorization. TA-14 separates the handoff from the consequence so that a receiver can trust an issuer, accept a Passport and still correctly HOLD or REJECT the requested action.</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12,marginTop:24}}>
          {[
            ['TRUST ≠ AUTHORITY','A trusted counterparty may still lack standing for the requested consequence.'],
            ['IDENTITY ≠ PERMISSION','Knowing who acted does not establish what that actor may do here and now.'],
            ['ACCEPTANCE ≠ EXECUTION','Receiving authority context does not grant Commit or Execution authority.'],
            ['CAPABILITY ≠ ADMISSIBILITY','A system may be technically able to act while the governed answer remains HOLD.'],
          ].map(([t,p])=><article key={t} style={{padding:20,border:'1px solid #173f47',borderRadius:14,background:'rgba(3,15,21,.9)'}}><strong style={{color:'#70e7e0',fontSize:11,letterSpacing:'.08em'}}>{t}</strong><p style={{color:'#94adb5',fontSize:12,lineHeight:1.6}}>{p}</p></article>)}
        </div>
      </section>

      <section style={{padding:'64px 0',borderTop:'1px solid #14313a'}}>
        <div style={{fontSize:10,fontWeight:900,letterSpacing:'.15em',color:'#70e7e0'}}>AUTHORITY PASSPORT OBJECT MODEL</div>
        <h2 style={{fontSize:40,letterSpacing:'-.03em',margin:'12px 0'}}>What actually travels across the boundary.</h2>
        <p style={{color:'#9fb7be',lineHeight:1.7,maxWidth:900}}>An Authority Passport is not a bearer token. It is a bounded, inspectable authority-context object carrying origin, lineage, purpose, delegation limits, freshness, consequence capacity, jurisdiction, proof obligations, revocation and closure responsibility.</p>
        <div style={{marginTop:24,padding:'12px 24px',border:'1px solid #1f4a51',borderRadius:18,background:'rgba(4,20,27,.78)'}}>
          {passportFields.map(([f,p])=><div key={f} style={{display:'grid',gridTemplateColumns:'minmax(150px,210px) 1fr',gap:18,padding:'14px 0',borderBottom:'1px solid rgba(255,255,255,.06)'}}><code style={{color:'#79dcff',fontWeight:900}}>{f}</code><span style={{color:'#9eb4bb',fontSize:13,lineHeight:1.55}}>{p}</span></div>)}
        </div>
      </section>

      <section style={{padding:'64px 0',borderTop:'1px solid #14313a'}}>
        <div style={{fontSize:10,fontWeight:900,letterSpacing:'.15em',color:'#70e7e0'}}>LIFECYCLE + FRESHNESS</div>
        <h2 style={{fontSize:40,letterSpacing:'-.03em',margin:'12px 0'}}>Cryptographically valid is not the same as currently usable.</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:10,marginTop:24}}>
          {lifecycle.map(([s,p])=><article key={s} style={{padding:16,border:'1px solid #173f47',borderRadius:12,background:'#05151c'}}><strong style={{color:'#d9f8f6',fontSize:11}}>{s}</strong><p style={{color:'#94adb5',fontSize:11,lineHeight:1.55}}>{p}</p></article>)}
        </div>
        <div style={{marginTop:22,padding:22,border:'1px solid #5b4d2a',borderRadius:16,background:'rgba(42,32,8,.24)'}}>
          <strong style={{color:'#e4ca87'}}>FRESHNESS POSTURE</strong>
          <p style={{color:'#b9b19b',lineHeight:1.7}}>CURRENT may enter local assessment. AGING requires renewal soon. STALE means HOLD or SUSPEND. EXPIRED means REJECT or close. UNKNOWN means QUARANTINE or HOLD until authoritative status is restored.</p>
        </div>
      </section>

      <section style={{padding:'64px 0',borderTop:'1px solid #14313a'}}>
        <div style={{fontSize:10,fontWeight:900,letterSpacing:'.15em',color:'#70e7e0'}}>RECEIVING-DOMAIN DECISIONS</div>
        <h2 style={{fontSize:40,letterSpacing:'-.03em',margin:'12px 0'}}>The receiving domain keeps the right to refuse.</h2>
        <div style={{display:'flex',flexWrap:'wrap',gap:9,marginTop:16}}>{decisions.map(x=><span key={x} style={{padding:'10px 13px',border:'1px solid #28545b',borderRadius:8,fontSize:10,fontWeight:900}}>{x}</span>)}</div>
        <p style={{color:'#9fb7be',lineHeight:1.7,maxWidth:900,marginTop:20}}>ACCEPT only means the Passport may enter local assessment. ACCEPT_NARROWED means the receiver has explicitly reduced scope. HOLD preserves the stop condition. REJECT refuses the route. QUARANTINE freezes an untrusted path. SUSPEND temporarily bars continued use. ESCALATE preserves a safe posture while an authorized reviewer resolves the condition.</p>
      </section>

      <section style={{padding:'64px 0',borderTop:'1px solid #14313a'}}>
        <div style={{fontSize:10,fontWeight:900,letterSpacing:'.15em',color:'#70e7e0'}}>LOCAL RE-ESTABLISHMENT</div>
        <h2 style={{fontSize:40,letterSpacing:'-.03em',margin:'12px 0'}}>What must happen after acceptance.</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:10,marginTop:24}}>
          {[
            ['01','LOCAL CONSTITUTION','Compile the receiving domain’s own governing rules.'],
            ['02','LOCAL EVIDENCE','Attach current local and target-state evidence.'],
            ['03','ADMISSIBILITY','Determine whether the next protected step is supported now.'],
            ['04','CAPACITY','Reserve the bounded consequence capacity required.'],
            ['05','FINAL HEARTBEAT','Recheck freshness and changed conditions immediately before release.'],
            ['06','LOCAL CAPSULE','Issue a one-time local execution capsule only after the burden is satisfied.'],
            ['07','EFFECT + CLOSURE','Observe consequence, preserve receipts and close residual obligations.'],
          ].map(([n,t,p])=><article key={n} style={{padding:18,border:'1px solid #1b444b',borderRadius:12,background:'#04151c'}}><span style={{color:'#70e7e0',fontSize:9,fontWeight:900}}>{n}</span><strong style={{display:'block',margin:'12px 0 7px',fontSize:11}}>{t}</strong><p style={{fontSize:10,color:'#94adb5',lineHeight:1.5}}>{p}</p></article>)}
        </div>
        <div style={{marginTop:20,padding:14,border:'1px dashed #d8b45f',borderRadius:10,color:'#e4ca87',fontSize:11,fontWeight:900,textAlign:'center'}}>NO LOCAL RE-ESTABLISHMENT → NO PROTECTED CONSEQUENCE.</div>
      </section>

      <section style={{padding:'64px 0',borderTop:'1px solid #14313a'}}>
        <div style={{fontSize:10,fontWeight:900,letterSpacing:'.15em',color:'#70e7e0'}}>AVP × CNS/CP</div>
        <h2 style={{fontSize:40,letterSpacing:'-.03em',margin:'12px 0'}}>Connection Profiles define the handoff. TA-14 still governs what happens next.</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:12,marginTop:24}}>
          {[
            ['WHAT MAY CROSS','Only the bounded authority context and receipt/verification data explicitly named by the Connection Profile.'],
            ['WHAT MUST NOT CROSS','Automatic Commit authority, automatic Execution authority, silent broadening, protected credentials or undisclosed local policy.'],
            ['WHAT THE CP ESTABLISHES','A provider/consumer contract and inspectable record of the cross-boundary interaction.'],
            ['WHAT TA-14 STILL ESTABLISHES','Whether current local evidence, scope, standing and authority support Commit and Execution.'],
          ].map(([t,p])=><article key={t} style={{padding:22,border:'1px solid #214a51',borderRadius:14,background:'rgba(3,15,21,.9)'}}><strong style={{color:'#70e7e0',fontSize:11}}>{t}</strong><p style={{color:'#94adb5',fontSize:12,lineHeight:1.6}}>{p}</p></article>)}
        </div>
      </section>

      <section style={{padding:'64px 0',borderTop:'1px solid #14313a'}}>
        <div style={{fontSize:10,fontWeight:900,letterSpacing:'.15em',color:'#70e7e0'}}>INTEROPERABILITY TESTING</div>
        <h2 style={{fontSize:40,letterSpacing:'-.03em',margin:'12px 0'}}>We test the refusal path as seriously as the success path.</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:10,marginTop:24}}>
          {[
            'Direct Passport-to-effector attempt','Broadening beyond delegated scope','Revocation race before threshold crossing',
            'Stale or expired Passport','Semantic mismatch between domains','Consequence-budget conflict',
            'Unresolved lineage or delegation conflict','Jurisdiction incompatibility','Missing proof or receipt obligation',
            'Trust level incorrectly treated as execution authority','Changed conditions after acceptance','Closure or residual-obligation failure',
          ].map(v=><div key={v} style={{padding:14,border:'1px solid #193f46',borderRadius:10,background:'#04141a',fontSize:11,color:'#b1c6cc'}}>{v}</div>)}
        </div>
      </section>

      <section style={{padding:'64px 0',borderTop:'1px solid #14313a'}}>
        <div style={{fontSize:10,fontWeight:900,letterSpacing:'.15em',color:'#70e7e0'}}>CONFORMANCE + RECOGNITION</div>
        <h2 style={{fontSize:40,letterSpacing:'-.03em',margin:'12px 0'}}>Compatibility, independent assessment and TA-14 recognition are different claims.</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:12,marginTop:24}}>
          {conformance.map(([l,i,e])=><article key={l} style={{padding:22,border:'1px solid #214a51',borderRadius:15,background:'#04151c'}}><strong style={{display:'block',color:'#70e7e0',fontSize:12}}>{l}</strong><b style={{display:'block',margin:'10px 0',fontSize:13}}>{i}</b><p style={{color:'#94adb5',fontSize:12,lineHeight:1.6}}>{e}</p></article>)}
        </div>
        <p style={{color:'#b9b19b',lineHeight:1.7,marginTop:20}}>Every public conformance claim should bind itself to the exact AVP version, dependency versions, sector profile, issuer and receiver domains, trust anchors, evidence bundle, validity period and reassessment triggers. Protocol compatibility by itself is not TA-14 recognition.</p>
      </section>

      <section style={{padding:'64px 0',borderTop:'1px solid #14313a'}}>
        <div style={{fontSize:10,fontWeight:900,letterSpacing:'.15em',color:'#70e7e0'}}>IMPLEMENTER CENTER</div>
        <h2 style={{fontSize:40,letterSpacing:'-.03em',margin:'12px 0'}}>How the frozen protocol becomes working infrastructure.</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12,marginTop:24}}>
          {[
            ['SCHEMAS','Machine-readable Passport and receipt structures bound to a protocol version.'],
            ['REGISTRIES','Profiles, trust anchors, versions, receipts, revocations and public status.'],
            ['TEST VECTORS','Executable positive and negative cases.'],
            ['SDKs','Implementation helpers that preserve the protocol boundary rather than bypassing it.'],
            ['INTEROPERABILITY DEMOS','Independent-domain tests showing what crossed and what stayed local.'],
            ['ASSURANCE EVIDENCE','Inspectable records supporting self-declared, independent or recognized claims.'],
          ].map(([t,p])=><article key={t} style={{padding:20,border:'1px solid #173f47',borderRadius:14,background:'rgba(3,15,21,.9)'}}><strong style={{color:'#70e7e0',fontSize:11}}>{t}</strong><p style={{color:'#94adb5',fontSize:12,lineHeight:1.6}}>{p}</p></article>)}
        </div>
      </section>
      <section style={{padding:34,border:'1px solid #5b4d2a',borderRadius:18,background:'rgba(42,32,8,.28)',marginTop:10}}>
        <div style={{fontSize:10,fontWeight:900,letterSpacing:'.15em',color:'#e4ca87'}}>COMMERCIAL ENTRY</div>
        <h2 style={{fontSize:30,margin:'10px 0'}}>Bring us one real boundary where authority context crosses but execution authority must remain local.</h2>
        <p style={{color:'#aebdc1',lineHeight:1.65}}>Begin with a bounded readiness review. From there, TA-14 can map the interface, support implementation, run a bounded interoperability examination, preserve the evidence, and where requirements are met, support a conformance or recognition pathway and later revalidation.</p>
        <Link href="/review" style={{display:'inline-block',marginTop:10,padding:'13px 16px',borderRadius:9,background:'#70e7e0',color:'#031216',textDecoration:'none',fontSize:11,fontWeight:900}}>REQUEST TA-14 READINESS REVIEW →</Link>
      </section>
    </div>
  </main>
}
