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

const asset = (name: string) => '/' + encodeURIComponent(name);
const pdf = asset('TA14_Dr_Moya_Hill_Ambassador_Showroom_Aligned_Review_v3.pdf');
const portrait = 'data:image/jpeg;base64,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';

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
        <p className={styles.eyebrow}>FOUNDING MARYLAND AMBASSADOR · PROFESSIONAL RECOGNITION</p>
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
    <section className={styles.chapters} id="exhibits"><div className={styles.wrap}>
      <p className={styles.eyebrow}>THE EDUCATIONAL SERIES</p><h2>Eight distinct exhibits</h2>
      <p className={styles.explain}>Each image is numbered and has its own narration immediately below it. The text distinguishes public biographical descriptions from educational examples and makes no claim of a deployed system.</p>
      <div className={styles.jumps}>{exhibits.map(e => <a href={'#exhibit-' + e.number} key={e.number}>{String(e.number).padStart(2, '0')}</a>)}</div>
      {exhibits.map(e => <article className={styles.exhibit} id={'exhibit-' + e.number} key={e.number}>
        <div className={styles.exhibitHeading}><span>EXHIBIT {e.number} OF 8</span><small>{e.eyebrow}</small></div>
        <h3>{e.title}</h3>
        <p className={styles.summary}>{e.summary}</p>
        <figure className={styles.exhibitArt}><img src={asset(e.image)} loading="lazy" alt={'Educational exhibit ' + e.number + ': ' + e.title} /><figcaption>Conceptual educational artwork · not evidence of a particular real-world implementation.</figcaption></figure>
        <Narration exhibit={e}/>
        <div className={styles.takeaway}><strong>THE TEACHING POINT</strong><p>{e.takeaway}</p></div>
      </article>)}
    </div></section>
    <section className={styles.close}><div className={styles.wrap}><p className={styles.eyebrow}>EDITORIAL & PUBLICATION BOUNDARIES</p><h2>Distinct work. Independent leadership. Clear attribution.</h2>
      <p>Dr. Hill’s Unified Information Governance Model™ concerns the governance of information and its lifecycle. TA-14’s Admissible Execution Architecture concerns whether evidence, authority and standing justify a proposed consequence at execution time. Those are separately owned concepts. No operational integration, joint product, public-sector endorsement, grant, verified outcome or regulatory status is claimed.</p>
      <p>Her statements are her own and do not represent the Department of Veterans Affairs or any government agency. Portrait rights, biographical wording, model terminology and final public release remain subject to review.</p>
      <div className={styles.actions}><a href={pdf} target="_blank" rel="noopener noreferrer">Open aligned review PDF</a><Link href="/showrooms" className={styles.outline}>Return to showrooms</Link></div>
    </div></section>
  </main>;
}
