'use client';

import { useState } from 'react';

type Decision = 'ALLOW' | 'HOLD' | 'DENY' | 'ESCALATE';
const scenarios: { title: string; situation: string; answer: Decision; explanation: string }[] = [
  {
    title: 'Unverified filtration result',
    situation: 'A building manager wants to announce that a new filter reduced exposure by 40%. The equipment is installed, but baseline and post-installation measurements are missing.',
    answer: 'HOLD',
    explanation: 'The claimed consequence lacks admissible measurements. Preserve the proposal, obtain attributable baseline and follow-up evidence, and do not publish the reduction as established.'
  },
  {
    title: 'Unauthorized operational change',
    situation: 'A contractor has reliable particle measurements but proposes changing a public building ventilation schedule without authorization from the responsible operator.',
    answer: 'DENY',
    explanation: 'Reliable evidence alone does not confer applicable authority. This unauthorized execution route must not proceed; a separately authorized proposal could be reconsidered.'
  },
  {
    title: 'Conflicting standing and authority',
    situation: 'Residents report a credible near-roadway exposure concern, while two agencies disagree over which one can authorize a proposed intervention.',
    answer: 'ESCALATE',
    explanation: 'The dispute over decision authority and standing requires an accountable human resolution. Record the affected parties and route the unresolved jurisdiction question to the appropriate authority.'
  },
  {
    title: 'Bounded, documented intervention',
    situation: 'A facilities operator has calibrated baseline evidence, documented authorization and standing, an approved limited filtration trial, a defined stop condition, and an independent verification plan.',
    answer: 'ALLOW',
    explanation: 'A bounded trial may proceed within its approved scope. ALLOW does not certify that filtration will improve health; outcomes still require measurement and independent review.'
  }
];
const choices: Decision[] = ['ALLOW', 'HOLD', 'DENY', 'ESCALATE'];

export default function BruggeAcademyChallenge() {
  const [answers, setAnswers] = useState<(Decision | null)[]>([null, null, null, null]);
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false, false]);
  const completed = revealed.every(Boolean);
  return <section id="academy-challenge" className="be-academy" aria-labelledby="be-academy-title">
    <div className="be-kicker">TA-14 ACADEMY · HYPOTHETICAL TRAINING</div>
    <h2 id="be-academy-title">The execution boundary challenge</h2>
    <p>Four fictional governance situations. Choose the best disposition using admissible evidence, applicable authority, and established standing. These scenarios are a proposed TA-14 teaching exercise, not experiments, findings, or endorsements from Dr. Brugge or his coauthors.</p>
    <p className="be-academy-progress" role="status">{revealed.filter(Boolean).length} of 4 explanations revealed</p>
    <div className="be-academy-grid">
      {scenarios.map((s, i) => <article className="be-academy-card" key={s.title}>
        <h3>{String(i + 1).padStart(2, '0')} · {s.title}</h3>
        <p>{s.situation}</p>
        <fieldset>
          <legend>What should happen at the execution boundary?</legend>
          <div className="be-academy-options">
            {choices.map(choice => <label key={choice}>
              <input type="radio" name={'brugge-scenario-' + i} value={choice} checked={answers[i] === choice} onChange={() => {
                setAnswers(old => old.map((a, j) => j === i ? choice : a));
                setRevealed(old => old.map((v, j) => j === i ? false : v));
              }}/>
              <span>{choice}</span>
            </label>)}
          </div>
        </fieldset>
        <button type="button" disabled={!answers[i]} onClick={() => setRevealed(old => old.map((v, j) => j === i ? true : v))}>Show explanation</button>
        {revealed[i] && <div className="be-academy-feedback" role="status">
          <strong>{answers[i] === s.answer ? 'Matches the teaching example.' : 'Review the decision boundary.'} Suggested disposition: {s.answer}.</strong>
          <p>{s.explanation}</p>
        </div>}
      </article>)}
    </div>
    {completed && <p className="be-academy-complete" role="status">All four explanations reviewed. This is an educational exercise, not a certification or scientific validation.</p>}
  </section>;
}
