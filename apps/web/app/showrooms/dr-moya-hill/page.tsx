'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

type Exhibit = {
  number: number;
  title: string;
  image: string;
  eyebrow: string;
  summary: string;
  narration: string;
  takeaway: string;
};

const exhibits: Exhibit[] = [
  {
    number: 1,
    title: 'Dr. Moya Hill: A Leader in Information Governance',
    image: 'Dr. Moya Hill_ Information Governance Leader.png',
    eyebrow: 'CAREER · LEADERSHIP · PUBLIC EDUCATION',
    summary: 'Dr. Hill describes a career spanning government information-governance programs, FOIA, privacy, records management, transparency, compliance and risk. Through Dr. Moya Hill Solutions LLC she advances independent speaking, education, consulting and organizational learning.',
    narration: 'Meet Dr. Moya Hill, an independent information-governance leader, educator, author and creator of the Unified Information Governance Model. Her public biography describes government experience in records, privacy, Freedom of Information Act responsibilities, transparency and compliance, including chief-level leadership. Her central message is that responsible artificial intelligence depends on the information organizations maintain, understand and govern. This recognition honors her work; it does not speak on behalf of any government employer.',
    takeaway: 'Her career connects public accountability, information stewardship and responsible uses of AI.'
  },
  {
    number: 2,
    title: 'The Unified Information Governance Model™',
    image: 'Unified Information Governance Model.png',
    eyebrow: 'DR. HILL’S INDEPENDENT INTELLECTUAL WORK',
    summary: 'Dr. Hill’s Unified Information Governance Model™ connects responsibilities that often operate separately. The diagram is an educational illustration, not an official implementation specification or a claim that a software integration exists.',
    narration: 'Dr. Hill created the Unified Information Governance Model to bring connected information responsibilities into one governance conversation. The goal is not merely to collect records, install technology, or publish a policy. People need clarity about access, purpose, retention, protection, compliance and accountability across the information lifecycle. The illustrated model helps us discuss the concept. It is not a certified reproduction of her intellectual property, nor evidence that a particular organization has implemented it.',
    takeaway: 'Good information governance connects obligations across the lifecycle rather than leaving them in isolated silos.'
  },
  {
    number: 3,
    title: 'Governing Information Before AI Depends on It',
    image: 'Governing Information Before AI.png',
    eyebrow: 'PRE-INGESTION GOVERNANCE',
    summary: 'Before records or other information become AI inputs, organizations should examine provenance, classification, permitted use, privacy, retention, access, relevance and quality. A technically accessible document is not automatically suitable for AI reliance.',
    narration: 'Consider a policy memo that has been replaced by a newer version. An AI system may still retrieve the earlier memo and produce a persuasive answer. Without source identification, version checks, access restrictions and contextual review, that answer can be wrong even when it sounds confident. Dr. Hill’s work emphasizes that governance starts before information enters a model. Proper classification, protection and lifecycle control help determine whether information is fit for its intended use.',
    takeaway: 'A system being able to access a record does not establish that the record is appropriate to use.'
  },
  {
    number: 4,
    title: 'When AI Outputs Become Records',
    image: 'When AI Outputs Become Records.png',
    eyebrow: 'THE INFORMATION → AI → DECISION → RECORD LOOP',
    summary: 'AI-generated summaries, recommendations and classifications can be saved, circulated and later ingested as new inputs. They need provenance, review, records classification and retention decisions; model output alone does not become verified truth.',
    narration: 'An AI-generated answer does not disappear when the screen closes. It may be copied into a report, entered into a records system or cited in the next decision. The output can then return as new information for another AI system. This feedback loop risks laundering an unverified assertion into apparent organizational fact. Governance asks who created or approved the record, what evidence supports it, which version is authoritative, and how errors and revisions remain visible.',
    takeaway: 'AI output can become a consequential record; its origin and verification status must travel with it.'
  },
  {
    number: 5,
    title: 'Privacy, Transparency, and Accountability',
    image: 'Privacy, Transparency, and Accountability.png',
    eyebrow: 'RIGHTS · LAWFUL DISCLOSURE · RESPONSIBLE USE',
    summary: 'Privacy protects sensitive information while transparency establishes appropriate disclosure. Accountability requires records of decisions, restrictions, custody and oversight. These duties must be evaluated together rather than treated as competing slogans.',
    narration: 'Imagine a public agency answering a legitimate request for records. It must consider disclosure duties while protecting information that cannot lawfully be released. A trustworthy process documents what was reviewed, which restrictions applied and who made the determination. Dr. Hill’s information-governance perspective brings privacy, transparency and recordkeeping into the same conversation. The illustration describes general professional principles, not a decision issued by a specific agency.',
    takeaway: 'Protecting sensitive information and enabling lawful access are both parts of accountable governance.'
  },
  {
    number: 6,
    title: 'Dr. Hill’s Seven Governance Disciplines',
    image: 'Maryland’s Seven Governance Disciplines.png',
    eyebrow: 'SEVEN INTERDEPENDENT RESPONSIBILITIES',
    summary: 'Her described disciplines are Privacy; FOIA & Transparency; Records Management; Cybersecurity; Legal & Compliance; Risk Management; and Training & Culture. They are shown here as an educational paraphrase of her public descriptions.',
    narration: 'The seven governance disciplines identified in Dr. Hill’s work are privacy; Freedom of Information Act and transparency; records management; cybersecurity; legal and compliance; risk management; and training and culture. Each asks different questions. Privacy examines permitted use of personal information. Records management examines custody and retention. Cybersecurity protects access. Compliance examines binding obligations. Risk management addresses possible harm. Training and culture establish whether people understand their responsibilities. Connecting all seven helps prevent gaps between teams.',
    takeaway: 'No single discipline can govern the whole information lifecycle alone.'
  },
  {
    number: 7,
    title: 'Information Governance in Practice',
    image: 'Information Governance in Practice.png',
    eyebrow: 'HYPOTHETICAL ORGANIZATIONAL SCENARIO',
    summary: 'Illustrative case: an organization wants to use historic program documents with an AI assistant. The team checks source and version, lawful access, privacy, retention, completeness and human review before allowing reliance on generated summaries. No particular site, deployment or result is claimed.',
    narration: 'Here is a hypothetical case, not a report of a completed pilot. An organization hopes to use an AI assistant to summarize archived program documents. Some files are outdated, some contain personal information and others have legal retention obligations. Before using them, the team identifies authoritative versions, classifies the records, restricts access, documents purpose and assigns human review. Those steps make later decisions easier to challenge and correct. The purpose is to show what information governance looks like in day-to-day practice.',
    takeaway: 'Policies become meaningful when roles, records and controls shape ordinary decisions.'
  },
  {
    number: 8,
    title: 'Founding Maryland Ambassador Recognition',
    image: 'Maryland’s Legacy of Accountable Governance.png',
    eyebrow: 'HONORARY RECOGNITION · INDEPENDENT LEADERSHIP',
    summary: 'In November 2026 Dr. Hill responded warmly and affirmatively to an invitation to serve in TA-14’s proposed voluntary, honorary Maryland ambassador network. The role has no required duties or financial obligations and confers no governmental authority or institutional endorsement.',
    narration: 'This final exhibit recognizes Dr. Moya Hill’s independent contributions to information governance and professional education. In November 2026, TA-14 invited her to serve as a founding honorary ambassador for Maryland. Her response expressed appreciation and identified a shared concern for trustworthy governance. This recognition is not an appointment by the State of Maryland or a government agency. Nor does it imply a merged product or an operational partnership. The next step is careful review of the proposed public recognition, respecting her own terms, likeness and work.',
    takeaway: 'Recognition should strengthen independent professional voices without confusing authorship, authority or endorsement.'
  }
];

const careerMilestones = [["PUBLIC-SERVICE FOUNDATIONS","Records, privacy and lawful access","Dr. Hill's public professional descriptions identify government information-governance work involving records management, Freedom of Information Act responsibilities, privacy, transparency, compliance and risk. These responsibilities shape how institutions preserve and share information."],["ENTERPRISE LEADERSHIP","Connecting responsibilities across functions","Her public biography describes chief-level leadership and organization-wide information-governance responsibilities. Those experiences provide context for her emphasis on coordinated practice rather than isolated departments."],["INDEPENDENT EDUCATION","Dr. Moya Hill Solutions LLC","Through her independent professional practice, Dr. Hill brings governance concepts into speaking, consulting, education and organizational learning."],["INTELLECTUAL CONTRIBUTION","Unified Information Governance Model™","Dr. Hill developed the Unified Information Governance Model™ as her independently owned framework for considering interdependent information disciplines, including implications for AI."],["THE AI ERA","Governing inputs, outputs and records","Her educational work emphasizes both the information supplied to AI and what happens after AI-generated material is retained, acted on, or treated as an organizational record."],["NOVEMBER 2026","Honorary Maryland ambassador invitation","Dr. Hill warmly affirmed the invitation to take part in a voluntary, honorary Maryland ambassador network. That recognition does not confer state authority or imply approval of this particular publication."]] as const;

const reflections = [["THE HUMAN PURPOSE","Public trust depends on the people who create, protect, disclose, review, and rely on information. Governance is both an organizational obligation and a human practice.","When a public decision is challenged, can its information and decision trail be examined?"],["A CONNECTED APPROACH","Dr. Hill’s independently developed model invites organizations to connect interdependent information duties rather than leaving decisions scattered across disconnected programs.","Where can responsibilities become disconnected between a record’s creation, use, disclosure, and eventual disposition?"],["BEFORE AN AI ANSWER","Reliable AI use begins with the origin, currency, permissions and limitations of the information supplied to the system. These are governance decisions, not merely technical retrieval steps.","Could a confident answer still be based on a superseded policy or a record the user was not permitted to access?"],["THE OUTPUT RETURNS","An AI output can enter an official workflow and later appear to other systems as an authoritative source. Provenance, verification and version history become essential.","If an AI-generated claim is copied into a record, who establishes whether it was ever independently verified?"],["TWO DUTIES, ONE PUBLIC TRUST","Privacy and transparency can both be legally required. Trustworthy practice examines disclosure duties and restrictions together, preserving the reasons for decisions.","How would you demonstrate that a disclosure was both appropriately transparent and protective of restricted information?"],["SEVEN DISCIPLINES, SHARED RESPONSIBILITY","Privacy, FOIA and transparency, records, cybersecurity, legal and compliance, risk, and training and culture intersect throughout the information lifecycle.","Which failure could arise if a cybersecurity restriction is implemented without consulting records and transparency duties?"],["FROM PRINCIPLE TO PRACTICE","In this hypothetical example, good governance changes the work before an AI summary is trusted: authoritative sources, lawful access, retention rules and review all matter.","What would an independent reviewer need to see before accepting an AI-assisted program summary?"],["HONORING INDEPENDENT LEADERSHIP","The honorary Maryland ambassador recognition celebrates Dr. Hill’s independent professional voice. It does not imply any state appointment or joint technical deployment.","How can professional recognition preserve a leader’s independent voice and avoid implying endorsement that was never granted?"]] as const;

const asset = (name: string) => '/' + encodeURIComponent(name);
const pdf = asset('TA14_Dr_Moya_Hill_Ambassador_Showroom_Aligned_Review_v3.pdf');
const portrait = '/dr-moya-hill-face-portrait.jpg';

function Narration({ exhibit }: { exhibit: Exhibit }) {
  const [mode, setMode] = useState<'idle'|'playing'|'paused'|'unsupported'>('idle');
  const token = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => () => {
    if (typeof window !== 'undefined' && token.current && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const start = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) { setMode('unsupported'); return; }
    if (mode === 'paused') { window.speechSynthesis.resume(); setMode('playing'); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(exhibit.narration);
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find(v => /Samantha/i.test(v.name)) ||
      voices.find(v => /en-US/i.test(v.lang)) || voices.find(v => /^en/i.test(v.lang)) || null;
    utterance.rate = 0.86;
    utterance.pitch = 1;
    token.current = utterance;
    utterance.onend = () => { if (token.current === utterance) { token.current = null; setMode('idle'); } };
    utterance.onerror = () => { if (token.current === utterance) { token.current = null; setMode('idle'); } };
    window.speechSynthesis.speak(utterance);
    setMode('playing');
  };
  const pause = () => { window.speechSynthesis.pause(); setMode('paused'); };
  const stop = () => { window.speechSynthesis?.cancel(); token.current = null; setMode('idle'); };

  return <div className={styles.narrator} aria-label={'Narration for exhibit ' + exhibit.number}>
    <div><strong>Listen to Exhibit {exhibit.number}</strong><small>Play Samantha · system voice fallback when Samantha is unavailable</small></div>
    <div className={styles.audioButtons}>
      <button type="button" onClick={start}>{mode === 'paused' ? '▶ Resume' : mode === 'playing' ? '↻ Restart' : '▶ Play Samantha'}</button>
      {mode === 'playing' && <button type="button" onClick={pause}>Ⅱ Pause</button>}
      {(mode === 'playing' || mode === 'paused') && <button type="button" onClick={stop}>■ Stop</button>}
    </div>
    {mode === 'unsupported' && <small role="status">Speech playback is unavailable in this browser. The exhibit transcript is below.</small>}
    <details className={styles.transcript}><summary>Read narration transcript</summary><p>{exhibit.narration}</p></details>
  </div>;
}

export default function DrMoyaHillShowroom() {
  return <main className={styles.page}>
    <nav className={styles.nav}><div className={styles.wrap}><Link href="/">TA-14 Exchange</Link><span>Maryland · Founding Ambassador Recognition</span><Link href="/showrooms">All showrooms</Link></div></nav>
    <header className={styles.hero} id="top"><div className={styles.wrap}>
      <p className={styles.flag}>COLLABORATIVE REVIEW EDITION · NOT YET APPROVED FOR PUBLIC RELEASE</p>
      <div className={styles.heroGrid}><div>
        <p className={styles.ambassadorDesignation}>TA-14 AUTHORITY GOVERNANCE AMBASSADOR <span>MARYLAND</span></p>
        <p className={styles.eyebrow}>FOUNDING HONORARY AMBASSADOR · PROFESSIONAL RECOGNITION</p>
        <h1>Dr. Moya Hill <em>Governing information before AI relies on it.</em></h1>
        <p className={styles.lead}>Celebrating a governance leader, international speaker, educator, author and creator of the independent Unified Information Governance Model™.</p>
        <p className={styles.independence}>Her professional work remains her own. The honorary TA-14 ambassador designation is not a government appointment, employer endorsement, technical certification or claim of jointly implemented technology.</p>
        <div className={styles.actions}><a href="#exhibits">Explore eight exhibits</a><a href={pdf} target="_blank" rel="noopener noreferrer" className={styles.outline}>Read aligned 11-page V3 PDF</a></div>
      </div><figure className={styles.portrait}><img src={portrait} alt="Dr. Moya Hill, in a professional recognition photograph supplied for editorial review" /><figcaption>Supplied recognition image · Inspiring Women Leaders of 2026. Display pending confirmation of reproduction rights and Dr. Hill’s approval.</figcaption></figure></div>
    </div></header>
    <section className={styles.intro}><div className={styles.wrap}>
      <p className={styles.eyebrow}>ABOUT THE RECOGNITION</p>
      <h2>A career in information stewardship and responsible AI</h2>
      <p>Dr. Hill’s public materials describe a career spanning FOIA, privacy, records leadership, transparency, compliance, risk, and information governance. Her work asks organizations to treat information quality, context and obligations as prerequisites for responsible AI use—not as afterthoughts.</p>
      <p>This showroom is an independent educational recognition prepared for her review. The linked 11-page V3 PDF follows the same eight-exhibit sequence used here. The images are illustrative, not records of actual projects. Her model and intellectual property are her own. The November 2026 honorary ambassador invitation received a warmly affirmative response, but that is not approval of these final publication materials.</p>
      <div className={styles.quickLinks}><a href="https://drmoyahill.com/" target="_blank" rel="noopener noreferrer">Professional website</a><a href={pdf} target="_blank" rel="noopener noreferrer">Aligned review PDF · 11 pages</a></div>
    </div></section>
    <section className={styles.career} id="career"><div className={styles.wrap}>
      <p className={styles.eyebrow}>THE WORK BEHIND THE RECOGNITION</p>
      <h2>A career devoted to information stewardship—and what comes next.</h2>
      <p className={styles.careerLead}>These thematic milestones follow Dr. Hill's publicly described professional responsibilities and independently developed ideas. They are an editorial overview, not a complete dated employment history.</p>
      <div className={styles.careerTimeline}>{careerMilestones.map(m => <article key={m[0]} className={styles.careerMilestone}>
        <p>{m[0]}</p><div><h3>{m[1]}</h3><p>{m[2]}</p></div>
      </article>)}</div>
    </div></section>
    <section className={styles.reflectionBand}><div className={styles.wrap}><p className={styles.eyebrow}>AN EDITORIAL REFLECTION · NOT A QUOTATION FROM DR. HILL</p><p>Information becomes valuable when people can trust where it came from, understand how it may be used, and account for the decisions made with it.</p></div></section>
    <section className={styles.chapters} id="exhibits"><div className={styles.wrap}>
      <p className={styles.eyebrow}>THE EDUCATIONAL SERIES</p><h2>Eight distinct exhibits</h2>
      <p className={styles.explain}>Each image is numbered and has its own narration immediately below it. The text distinguishes public biographical descriptions from educational examples and makes no claim of a deployed system.</p>
      <div className={styles.jumps}>{exhibits.map(e => <a href={'#exhibit-' + e.number} key={e.number}>{String(e.number).padStart(2, '0')}</a>)}</div>
      {exhibits.map(e => <article className={styles.exhibit} id={'exhibit-' + e.number} key={e.number}>
        <div className={styles.exhibitHeading}><span>EXHIBIT {e.number} OF 8</span><small>{e.eyebrow}</small></div>
        <h3>{e.title}</h3>
        <p className={styles.summary}>{e.summary}</p>
        <figure className={styles.exhibitArt}><img src={asset(e.image)} loading="lazy" alt={'Educational exhibit ' + e.number + ': ' + e.title} /><figcaption>Conceptual educational artwork · not evidence of a particular real-world implementation.</figcaption></figure>
        <div className={styles.chapterBody}>
          <div className={styles.storyPanel}>
            <p className={styles.eyebrow}>{reflections[e.number - 1][0]}</p>
            <p className={styles.storyText}>{reflections[e.number - 1][1]}</p>
            <div className={styles.takeaway}><strong>THE TEACHING POINT</strong><p>{e.takeaway}</p></div>
          </div>
          <div className={styles.chapterSidebar}>
            <Narration exhibit={e}/>
            <div className={styles.question}><strong>A QUESTION TO CONSIDER</strong><p>{reflections[e.number - 1][2]}</p></div>
            {e.number < 8 && <a className={styles.nextChapter} href={'#exhibit-' + (e.number + 1)}>Continue to chapter {String(e.number+1).padStart(2,'0')} ↓</a>}
          </div>
        </div>
      </article>)}
    </div></section>
    <section className={styles.publication} id="publication"><div className={styles.wrap}>
      <p className={styles.eyebrow}>THE INDEPENDENT COMPANION PUBLICATION</p>
      <h2>Governing information <em>before AI relies on it.</em></h2>
      <p>Explore the aligned eleven-page review PDF. It follows all eight approved exhibits and provides the teaching points, visual sequence, attribution notes, and publication review checklist.</p>
      <a href={pdf} target="_blank" rel="noopener noreferrer">Read the companion PDF ↗</a>
    </div></section>
    <section className={styles.close}><div className={styles.wrap}><p className={styles.eyebrow}>EDITORIAL & PUBLICATION BOUNDARIES</p><h2>Distinct work. Independent leadership. Clear attribution.</h2>
      <p>Dr. Hill’s Unified Information Governance Model™ concerns the governance of information and its lifecycle. TA-14’s Admissible Execution Architecture concerns whether evidence, authority and standing justify a proposed consequence at execution time. Those are separately owned concepts. No operational integration, joint product, public-sector endorsement, grant, verified outcome or regulatory status is claimed.</p>
      <p>Her statements are her own and do not represent the Department of Veterans Affairs or any government agency. Portrait rights, biographical wording, model terminology and final public release remain subject to review.</p>
      <div className={styles.actions}><a href={pdf} target="_blank" rel="noopener noreferrer">Open aligned review PDF</a><Link href="/showrooms" className={styles.outline}>Return to showrooms</Link></div>
    </div></section>
  </main>;
}
