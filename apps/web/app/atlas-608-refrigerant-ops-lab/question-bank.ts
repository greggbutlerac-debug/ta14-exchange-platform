import { EXAM1, type ArcadeQuestion } from "./exam1-bank";
import { CORE_EXPANSION } from "./core-expansion-bank";
import { TYPE1_EXPANSION } from "./type1-expansion-bank";
import { TYPE2_EXPANSION } from "./type2-expansion-bank";
import { TYPE3_EXPANSION } from "./type3-expansion-bank";
import { TRANSITION_EXPANSION } from "./transition-expansion-bank";

/** Canonical source bank for the EPA 608 readiness arcade. */
const SOURCE_608_BANK: ArcadeQuestion[] = [
  ...EXAM1,
  ...CORE_EXPANSION,
  ...TYPE1_EXPANSION,
  ...TYPE2_EXPANSION,
  ...TYPE3_EXPANSION,
  ...TRANSITION_EXPANSION,
];

const uniqueByWorldAndId = (questions: ArcadeQuestion[]) => {
  const seen = new Set<string>();
  return questions.filter((question) => {
    const key = `${question.world}:${question.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const reasoningTail = [
  "Judge this choice against the equipment facts and the governing service procedure before relying on it.",
  "This conclusion still has to survive the refrigerant identity, equipment category, and safety conditions in the stem.",
  "Treat this as a complete answer only if the actual operating evidence and applicable rule support the conclusion.",
  "Compare this claim with the full scenario rather than assuming one familiar clue controls the entire service decision.",
];

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Prevent answer-length leakage.
 *
 * Some original study questions naturally had a detailed correct response and
 * very short distractors. That makes "pick the longest answer" a game exploit.
 * We preserve the original claim in every option, but short options receive a
 * neutral reasoning sentence so visual/word-count length is no longer a clue.
 */
function camouflageChoiceLength(question: ArcadeQuestion): ArcadeQuestion {
  const lengths = question.choices.map(wordCount);
  const longest = Math.max(...lengths);
  const floor = Math.max(11, Math.ceil(longest * 0.72));
  const choices = question.choices.map((choice, index) => {
    if (wordCount(choice) >= floor) return choice;
    const tail = reasoningTail[(question.id + index) % reasoningTail.length];
    return `${choice} ${tail}`;
  }) as ArcadeQuestion["choices"];
  return { ...question, choices };
}

function shuffleChoices(question: ArcadeQuestion): ArcadeQuestion {
  const balanced = camouflageChoiceLength(question);
  const indexed = balanced.choices.map((choice, index) => ({ choice, index }));
  const randomized = shuffle(indexed);
  const correct = randomized.findIndex((entry) => entry.index === balanced.correct);
  return {
    ...balanced,
    choices: randomized.map((entry) => entry.choice) as ArcadeQuestion["choices"],
    correct,
  };
}

const sourceUnique = uniqueByWorldAndId(SOURCE_608_BANK);

/** Create a brand-new randomized deck on demand for every run/restart. */
export function createRandomizedDeck(
  world: ArcadeQuestion["world"] | "universal",
  limit?: number,
): ArcadeQuestion[] {
  const source = world === "universal"
    ? sourceUnique
    : sourceUnique.filter((question) => question.world === world);
  const randomized = shuffle(source).map(shuffleChoices);
  return typeof limit === "number" ? randomized.slice(0, limit) : randomized;
}

/** Questions that still have a conspicuous authored length imbalance. */
export const LENGTH_LEAK_AUDIT = sourceUnique.filter((question) => {
  const counts = question.choices.map(wordCount);
  const correctWords = counts[question.correct];
  const wrongWords = counts.filter((_, index) => index !== question.correct);
  const wrongAverage = wrongWords.reduce((sum, count) => sum + count, 0) / wrongWords.length;
  return correctWords > wrongAverage * 1.35;
}).map((question) => ({
  id: question.id,
  world: question.world,
  lesson: question.lesson,
}));

export const CORE_BANK = createRandomizedDeck("core", 100);
export const TYPE1_BANK = createRandomizedDeck("type1", 100);
export const TYPE2_BANK = createRandomizedDeck("type2", 100);
export const TYPE3_BANK = createRandomizedDeck("type3", 100);
export const TRANSITION_BANK = createRandomizedDeck("transition", 100);

export const ARCADE_608_BANK: ArcadeQuestion[] = [
  ...CORE_BANK,
  ...TYPE1_BANK,
  ...TYPE2_BANK,
  ...TYPE3_BANK,
  ...TRANSITION_BANK,
];

export const WORLD_COUNTS = {
  core: sourceUnique.filter((question) => question.world === "core").length,
  type1: sourceUnique.filter((question) => question.world === "type1").length,
  type2: sourceUnique.filter((question) => question.world === "type2").length,
  type3: sourceUnique.filter((question) => question.world === "type3").length,
  transition: sourceUnique.filter((question) => question.world === "transition").length,
} as const;

export const WORLD_TARGET = 100;
export const UNIVERSAL_TARGET = WORLD_TARGET * 5;
export const WORLD_READY = {
  core: WORLD_COUNTS.core >= WORLD_TARGET,
  type1: WORLD_COUNTS.type1 >= WORLD_TARGET,
  type2: WORLD_COUNTS.type2 >= WORLD_TARGET,
  type3: WORLD_COUNTS.type3 >= WORLD_TARGET,
  transition: WORLD_COUNTS.transition >= WORLD_TARGET,
} as const;

export type { ArcadeQuestion } from "./exam1-bank";
