import Link from 'next/link';

const plans=[
  {name:'Evidence Passport',price:'$19',fit:'1–3 AI systems',copy:'Keep a living system-level evidence record with obligations, gaps, versions and revalidation state.',href:'/eu-ai-act/join?plan=passport'},
  {name:'Compliance Workspace',price:'$49',fit:'Up to 10 AI systems',copy:'Coordinate evidence, owners, documentation, incidents and team compliance work in one governed workspace.',href:'/eu-ai-act/join?plan=workspace'},
  {name:'Governance Pro',price:'$99',fit:'Up to 25 AI systems',copy:'Operate broader high-risk, GPAI, FRIA, post-market and material-change governance across a growing portfolio.',href:'/eu-ai-act/join?plan=pro'},
  {name:'Institution',price:'$499',fit:'Up to 50 AI systems',copy:'Run institutional governance with expanded users, authority workflows, examiner rooms and portfolio reporting.',href:'/eu-ai-act/join?plan=institution'},
];

export default function PaidPlanRail(){
  return <section className="paidRail" aria-labelledby="paid-plan-heading">
    <div className="paidHead">
      <small>READY TO OPERATE · START PAID ACCESS NOW</small>
      <h2 id="paid-plan-heading">Move from reading about the EU AI Act to maintaining the record.</h2>
      <p>Choose the smallest operating tier that fits the portfolio today. Upgrade when system count, team size or governance scope actually requires it.</p>
    </div>
    <div className="paidPlans">
      {plans.map(plan=><article key={plan.name}>
        <span>{plan.fit}</span>
        <h3>{plan.name}</h3>
        <b>{plan.price}<i>/MO</i></b>
        <p>{plan.copy}</p>
        <Link href={plan.href}>START {plan.name.toUpperCase()} →</Link>
      </article>)}
    </div>
    <div className="paidReview"><div><b>Need an independent human readiness examination?</b><span>A governed readiness review is separate from software access and starts at $750.</span></div><Link href="/eu-ai-act/readiness-review">REQUEST READINESS REVIEW →</Link></div>
    <style>{`.paidRail{max-width:1450px;margin:0 auto 100px;padding:0 5vw}.paidHead{max-width:940px;margin:0 auto 30px;text-align:center}.paidHead small{color:#72e2ff;font-size:9px;font-weight:950;letter-spacing:.2em}.paidHead h2{font:clamp(34px,4vw,58px)/1 Georgia,serif;margin:10px 0;color:#eef7ff}.paidHead p{color:#97adbe;line-height:1.75}.paidPlans{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.paidPlans article{min-height:300px;padding:24px;border:1px solid #26516c;background:linear-gradient(180deg,#071b2a,#05101a);display:flex;flex-direction:column}.paidPlans span{font-size:8px;color:#72def8;font-weight:900;letter-spacing:.08em}.paidPlans h3{font:24px Georgia,serif;margin:13px 0 8px;color:#f1f8fd}.paidPlans b{font:42px Georgia,serif;color:#fff}.paidPlans b i{font:9px Inter,system-ui,sans-serif;font-style:normal;color:#7894a7}.paidPlans p{font-size:11px;line-height:1.7;color:#9db2c1;flex:1}.paidPlans a{display:block;text-align:center;padding:13px 10px;background:#7fe8ff;color:#061018;text-decoration:none;font-size:8px;font-weight:950;letter-spacing:.06em;border-radius:8px}.paidReview{margin-top:12px;padding:18px 20px;border:1px solid #8f7135;background:#151108;display:flex;align-items:center;justify-content:space-between;gap:18px}.paidReview div{display:grid;gap:5px}.paidReview b{font-size:11px;color:#f6d889}.paidReview span{font-size:10px;color:#baa983}.paidReview a{white-space:nowrap;padding:11px 13px;border:1px solid #b18b43;color:#f5d889;text-decoration:none;font-size:8px;font-weight:950}@media(max-width:960px){.paidPlans{grid-template-columns:repeat(2,1fr)}}@media(max-width:620px){.paidPlans{grid-template-columns:1fr}.paidReview{align-items:flex-start;flex-direction:column}}`}</style>
  </section>
}
