"use client";

import { useMemo, useState } from "react";

type Question = {
  id: number;
  prompt: string;
  choices: string[];
  answer: number;
};

const questions: Question[] = [
  {
    id: 1,
    prompt: "What must exist before consequential execution may proceed?",
    choices: [
      "A completed workflow",
      "Admissible evidence",
      "Administrator approval only",
      "AI confidence"
    ],
    answer: 1
  },
  {
    id: 2,
    prompt: "Which outcome should be selected when authority is invalid?",
    choices: ["ALLOW","HOLD","ESCALATE","IGNORE"],
    answer: 2
  }
];

export default function AssessmentPage() {
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const score = useMemo(() => {
    return answers.reduce((t,a,i)=>t + (a===questions[i].answer ? 1:0),0);
  }, [answers]);

  return (
    <main className="min-h-screen bg-[#030812] text-white p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold">Academy Assessment Center</h1>
        <p className="mt-2 text-slate-300">
          Validate understanding before progressing to governed execution.
        </p>

        <div className="mt-8 space-y-6">
          {questions.map((q,qi)=>(
            <section key={q.id} className="rounded-2xl border border-white/10 p-6">
              <h2 className="font-semibold text-xl">{q.prompt}</h2>

              <div className="mt-4 space-y-2">
                {q.choices.map((c,ci)=>(
                  <label key={ci} className="flex gap-3 rounded border border-white/10 p-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={answers[qi]===ci}
                      onChange={()=>{
                        const copy=[...answers];
                        copy[qi]=ci;
                        setAnswers(copy);
                      }}
                    />
                    <span>{c}</span>
                  </label>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-cyan-500/20 p-6">
          <h2 className="text-2xl font-bold">Assessment Result</h2>
          <p className="mt-3 text-lg">
            Score: {score} / {questions.length}
          </p>
          <p className="mt-2 text-slate-300">
            Bucket scoring and remediation hooks can connect here.
          </p>
        </div>
      </div>
    </main>
  );
}
