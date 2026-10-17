import Link from 'next/link';

export const metadata = {
  title: 'Professional Governance Services | TA14 Authority Governance Institution',
  description: 'Bounded independent examinations of AI execution, building automation, and private institutional teaching requirements.',
};

const offers = [
  {
    id: 'ai',
    name: 'AI Execution Authority Review',
    price: '$1,500',
    tag: 'LEAD PROFESSIONAL OFFER',
    description: 'A bounded independent review of one proposed AI-agent or automated-system action and the conditions under which it may proceed.',
    scope: ['One defined proposed consequence and operating context', 'Submitted evidence and continuity assessment', 'Applicable authority and established standing analysis', 'Execution boundary, unresolved conditions, and documented findings'],
    exclusions: 'Not a penetration test, legal opinion, certification, compliance guarantee, or authorization to execute.',
    subject: 'AI Execution Authority Review — paid scope request',
  },
  {
    id: 'building',
    name: 'Building Automation Governance Review',
    price: 'From $1,500',
    tag: 'ENGINEERING & FACILITIES',
    description: 'Examine one monitoring-to-action pathway such as an HVAC setpoint change, air-quality response, automated work order, or building-system intervention.',
    scope: ['Defined asset, actors, and proposed physical action', 'Evidence provenance and continuity checkpoints', 'Authority, standing, and stop conditions', 'Bounded technical findings and recommended verification needs'],
    exclusions: 'Does not replace field inspection, engineering design, licensed professional judgment, or jurisdictional approvals.',
    subject: 'Building Automation Governance Review — paid scope request',
  },
  {
    id: 'teaching',
    name: 'Private Institutional Teaching Room',
    price: 'From $750',
    tag: 'TRAINING & INSTITUTIONS',
    description: 'A private, subject-specific visual teaching experience explaining an agreed governance or accountability problem.',
    scope: ['Written topic and audience brief', 'Proposed lesson sequence and technical boundaries', 'Private teaching-room deliverable after scope agreement', 'One defined review-and-correction cycle'],
    exclusions: 'Training materials are educational and do not confer credentials, certification, or institutional endorsement.',
    subject: 'Private Institutional Teaching Room — paid scope request',
  },
];

export default function ProfessionalServicesPage() {
  return <main className="professional-page"><style>{`\n.professional-page{min-height:100vh;background:radial-gradient(ellipse at 75% 0%,#153652 0%,#040b13 55%);color:#f1f7ff;font-family:Inter,system-ui,sans-serif;padding:1px 0 60px}\n.professional-page *{box-sizing:border-box}.professional-page a{color:inherit;text-decoration:none}.professional-page .mx-auto{margin-left:auto;margin-right:auto}.professional-page .max-w-6xl{max-width:1160px}.professional-page .max-w-4xl{max-width:850px}.professional-page .px-5{padding-left:24px;padding-right:24px}.professional-page .py-12,.professional-page .md\\:py-20{padding-top:68px;padding-bottom:68px}.professional-page nav{display:flex;justify-content:space-between;gap:20px;align-items:center;margin-bottom:70px;border-bottom:1px solid #244055;padding-bottom:20px}.professional-page nav a:first-child{font-weight:800;color:#6ce5ff;letter-spacing:.08em}.professional-page nav a:last-child{color:#bdcbd9}.professional-page h1{font-size:clamp(42px,5vw,68px);line-height:1.06;letter-spacing:-.045em;font-weight:850;margin:16px 0 24px}.professional-page h2{font-size:25px;line-height:1.2;font-weight:800;margin:16px 0}.professional-page h3{font-size:15px;font-weight:800}.professional-page p{line-height:1.7}.professional-page .text-xs{font-size:12px}.professional-page .text-sm{font-size:14px}.professional-page .text-lg{font-size:19px}.professional-page .text-2xl{font-size:25px}.professional-page .text-3xl{font-size:36px}.professional-page .font-bold{font-weight:800}.professional-page .uppercase{text-transform:uppercase}.professional-page .tracking-\\[\\.24em\\]{letter-spacing:.24em}.professional-page .tracking-widest{letter-spacing:.12em}.professional-page .text-cyan-300{color:#6ce5ff}.professional-page .text-emerald-300{color:#64efbc}.professional-page .text-slate-300{color:#c5d3e2}.professional-page .text-slate-400{color:#a2b4c5}.professional-page .text-slate-200{color:#e0ebf6}.professional-page .text-white{color:white}.professional-page .mt-3{margin-top:12px}.professional-page .mt-4{margin-top:16px}.professional-page .mt-5{margin-top:20px}.professional-page .mt-6{margin-top:24px}.professional-page .mt-7{margin-top:28px}.professional-page .mt-8{margin-top:32px}.professional-page .mt-14{margin-top:56px}.professional-page .mb-4{margin-bottom:16px}.professional-page .rounded-xl{border-radius:16px}.professional-page .rounded-2xl{border-radius:22px}.professional-page .border{border:1px solid #34516a}.professional-page .bg-cyan-950\\/30{background:#0c2c3c}.professional-page .bg-\\[\\#0b1827\\]{background:#0b1827}.professional-page .p-5{padding:20px}.professional-page .p-7{padding:28px}.professional-page .p-8{padding:32px}.professional-page .grid{display:grid}.professional-page .gap-6{gap:24px}.professional-page article{display:flex;flex-direction:column;background:linear-gradient(160deg,#10253a,#091623);border:1px solid #31536a;border-radius:22px;padding:30px;box-shadow:0 20px 50px #0004}.professional-page section[aria-label]{grid-template-columns:repeat(3,minmax(0,1fr))}.professional-page ul{list-style:disc;padding-left:22px}.professional-page li{margin:10px 0;line-height:1.6}.professional-page .mt-auto{margin-top:auto}.professional-page .pt-8{padding-top:32px}.professional-page article a{display:block;background:#65dff1;color:#06131d;text-align:center;padding:15px 14px;border-radius:12px;font-weight:800}.professional-page article a:hover{background:#9cf1ff}.professional-page .flex{display:flex}.professional-page .flex-wrap{flex-wrap:wrap}.professional-page .gap-5{gap:20px}.professional-page .underline{text-decoration:underline}.professional-page section:last-child{background:#0a1b2c}.professional-page section:last-child a{color:#6ce5ff;text-decoration:underline}@media(max-width:850px){.professional-page section[aria-label]{grid-template-columns:1fr}.professional-page nav{flex-wrap:wrap;margin-bottom:40px}.professional-page .py-12{padding-top:35px}.professional-page article{padding:24px}}\n`}</style>
    <div className="mx-auto max-w-6xl px-5 py-12 md:py-20">
      <nav className="mb-14 flex flex-wrap items-center justify-between gap-4 text-sm">
        <Link href="/" className="font-bold tracking-wider text-cyan-300">TA14 AUTHORITY GOVERNANCE INSTITUTION</Link>
        <Link href="/start" className="text-slate-300 hover:text-white">Explore the Exchange →</Link>
      </nav>
      <div className="max-w-4xl">
        <p className="mb-4 text-xs font-bold uppercase tracking-[.24em] text-cyan-300">Professional services · Written engagements</p>
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">Before a system acts, establish who has authority.</h1>
        <p className="mt-6 text-lg leading-8 text-slate-300">TA14 examines whether a proposed consequence has sufficient <strong className="text-white">Admissible Evidence, Applicable Authority, and Established Standing</strong> to become reality NOW. Buy a defined professional review, not a predetermined answer.</p>
        <div className="mt-8 rounded-xl border border-cyan-800 bg-cyan-950/30 p-5 text-sm leading-7 text-slate-200">Every engagement begins with a written scope agreement. Advertised prices are starting prices, not an automatic charge. No work begins until scope, delivery terms, and payment arrangements are agreed in writing.</div>
      </div>
      <section aria-label="Professional service offers" className="mt-14 grid gap-6 lg:grid-cols-3">
        {offers.map(offer => <article key={offer.id} id={offer.id} className="flex flex-col rounded-2xl border border-slate-700 bg-[#0b1827] p-7">
          <p className="text-xs font-bold tracking-widest text-cyan-300">{offer.tag}</p>
          <h2 className="mt-4 text-2xl font-bold">{offer.name}</h2>
          <p className="mt-4 text-3xl font-bold text-emerald-300">{offer.price}</p>
          <p className="mt-5 leading-7 text-slate-300">{offer.description}</p>
          <h3 className="mt-7 font-semibold">Included in the proposed scope</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">{offer.scope.map(item => <li key={item}>{item}</li>)}</ul>
          <p className="mt-6 text-sm leading-6 text-slate-400"><strong className="text-slate-200">Boundary:</strong> {offer.exclusions}</p>
          <div className="mt-auto pt-8"><a href={`mailto:ta14admissibleexecution@gmail.com?subject=${encodeURIComponent(offer.subject)}&body=${encodeURIComponent('Please send the written scope request process for this service.\nOrganization / name:\nProposed consequence or topic:\nRelevant jurisdiction:\nDesired delivery date:')}`} className="block rounded-lg bg-cyan-300 px-5 py-4 text-center font-bold text-slate-950 hover:bg-cyan-200">Request a written paid scope →</a></div>
        </article>)}
      </section>
      <section className="mt-14 rounded-2xl border border-slate-700 p-8">
        <h2 className="text-2xl font-bold">What happens next?</h2>
        <p className="mt-4 leading-7 text-slate-300">Send a short written description of the proposed action, relevant actors, jurisdiction, available evidence, and the decision you need examined. TA14 will confirm fit, boundaries, deliverables, fees, and payment terms in writing before accepting an engagement. Sensitive or confidential material should not be sent until an appropriate handling arrangement is agreed.</p>
        <p className="mt-5 text-sm text-slate-400">An examination can conclude ALLOW, HOLD, DENY, or ESCALATE within its defined governance scope. It cannot grant external legal or operational authority.</p>
        <div className="mt-6 flex flex-wrap gap-5 text-sm"><Link href="/pricing" className="text-cyan-300 underline">Explore the $149 entry examination</Link><Link href="/pricing" className="text-cyan-300 underline">See broader institutional pricing</Link></div>
      </section>
    </div>
  </main>;
}
