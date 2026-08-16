"use client";

import { useEffect } from "react";

const CORRECT_BY_STEP: Record<number, number> = {
  1: 1,
  2: 0,
  3: 1,
  4: 0,
  5: 0,
  6: 1,
  7: 1,
  8: 0,
  9: 0,
  10: 0,
  11: 0,
  12: 0,
  13: 0,
  14: 0,
};

const WRONG_ANSWER_EXTENSIONS = [
  " That conclusion can sound reasonable in the moment because the observed condition is real, but it still reaches beyond what the preserved evidence can actually prove at this stage of the service sequence.",
  " A technician might defend this choice as efficient because it appears to reduce uncertainty quickly, yet it would still collapse observation, determination, and intervention into one step before the required evidence boundary has been satisfied.",
  " This option has practical appeal because it gives the homeowner a clear answer immediately, but clarity is not the same as support; the current record still leaves material conditions unresolved and therefore does not justify this conclusion.",
  " The action may resemble common field practice and may even produce useful information, but usefulness alone does not make it admissible when the sequence requires the original operating state and prerequisite measurements to remain intact first.",
  " This sounds thorough because it addresses several possible causes at once, but it would expand the claim beyond the narrow determination supported by the current record and could attach consequence to evidence that has not yet been completed.",
  " The reasoning is plausible if the goal is speed, and the proposed action could eventually become appropriate, but the present evidence state does not yet establish the authority to move from suspicion to a consequence-bearing intervention.",
  " A more aggressive service approach could choose this path on the theory that multiple abnormal observations justify acting early, but the TA-14 sequence requires those observations to remain bounded until the governing measurements and comparison state are complete.",
];

function getStepNumber() {
  const zone = document.querySelector<HTMLElement>(".zone")?.textContent ?? "";
  const match = zone.match(/STEP\s+(\d+)\s+OF\s+14/i);
  return match ? Number(match[1]) : 0;
}

function normalize(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

export default function AnswerLengthIntegrity() {
  useEffect(() => {
    const originals = new WeakMap<HTMLElement, string>();
    let lastStep = -1;

    const restore = () => {
      document.querySelectorAll<HTMLElement>(".choice").forEach((button) => {
        const original = originals.get(button);
        if (original) button.textContent = original;
      });
    };

    const apply = () => {
      const step = getStepNumber();
      const buttons = Array.from(document.querySelectorAll<HTMLElement>(".choice"));
      if (!step || buttons.length !== 4) return;

      if (step !== lastStep) {
        restore();
        lastStep = step;
      }

      buttons.forEach((button) => {
        if (!originals.has(button)) originals.set(button, normalize(button.textContent ?? ""));
      });

      const correctIndex = CORRECT_BY_STEP[step];
      if (correctIndex === undefined) return;

      const correctLength = normalize(originals.get(buttons[correctIndex]) ?? "").length;
      const wrongIndexes = buttons.map((_, index) => index).filter((index) => index !== correctIndex);

      // Alternate by step: on roughly half the questions, make one wrong answer
      // intentionally longer than the correct answer. On the others, keep lengths
      // close enough that "pick the longest" is still unreliable.
      const makeWrongLongest = step % 2 === 0;
      const selectedWrong = wrongIndexes[(step * 7) % wrongIndexes.length];

      wrongIndexes.forEach((index, wrongPosition) => {
        const button = buttons[index];
        const original = originals.get(button) ?? normalize(button.textContent ?? "");
        let next = original;

        if (makeWrongLongest && index === selectedWrong) {
          let extensionIndex = (step + wrongPosition) % WRONG_ANSWER_EXTENSIONS.length;
          while (next.length <= correctLength + 28) {
            next += WRONG_ANSWER_EXTENSIONS[extensionIndex];
            extensionIndex = (extensionIndex + 1) % WRONG_ANSWER_EXTENSIONS.length;
          }
        } else if (!makeWrongLongest && original.length < correctLength * 0.82) {
          next += WRONG_ANSWER_EXTENSIONS[(step + wrongPosition + 2) % WRONG_ANSWER_EXTENSIONS.length];
        }

        if (button.textContent !== next) button.textContent = next;
      });
    };

    apply();
    const observer = new MutationObserver(() => window.requestAnimationFrame(apply));
    observer.observe(document.body, { subtree: true, childList: true, characterData: true });

    return () => {
      observer.disconnect();
      restore();
    };
  }, []);

  return null;
}
