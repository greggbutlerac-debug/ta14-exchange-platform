import { EXAM1, type ArcadeQuestion } from "./exam1-bank";
import { CORE_EXPANSION } from "./core-expansion-bank";
import { TYPE1_EXPANSION } from "./type1-expansion-bank";
import { TYPE2_EXPANSION } from "./type2-expansion-bank";
import { TYPE3_EXPANSION } from "./type3-expansion-bank";
import { TRANSITION_EXPANSION } from "./transition-expansion-bank";

/**
 * Canonical source bank for the EPA 608 readiness arcade.
 *
 * NOTE: type1-final-bank.ts is intentionally not part of the runtime source.
 * It is retained only as legacy authored material. The canonical Type I runtime
 * source is EXAM1 + TYPE1_EXPANSION, deduplicated below.
 */
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

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function shuffleChoices(question: ArcadeQuestion): ArcadeQuestion {
  const indexed = question.choices.map((choice, index) => ({ choice, index }));
  const randomized = shuffle(indexed);
  const correct = randomized.findIndex(
    (entry) => entry.index === question.correct,
  );
  return {
    ...question,
    choices: randomized.map(
      (entry) => entry.choice,
    ) as ArcadeQuestion["choices"],
    correct,
  };
}

const sourceUnique = uniqueByWorldAndId(SOURCE_608_BANK);

/** Create a brand-new randomized deck on demand for every run/restart. */
export function createRandomizedDeck(
  world: ArcadeQuestion["world"] | "universal",
  limit?: number,
): ArcadeQuestion[] {
  const source =
    world === "universal"
      ? sourceUnique
      : sourceUnique.filter((question) => question.world === world);
  const randomized = shuffle(source).map(shuffleChoices);
  return typeof limit === "number" ? randomized.slice(0, limit) : randomized;
}

/**
 * Put one example of each required bucket at the front of a deck while
 * preserving random order for the rest. This prevents a legitimate 100-question
 * readiness run from failing only because random ordering never surfaced a
 * required evidence bucket.
 */
function promoteRequiredBuckets(
  questions: ArcadeQuestion[],
  requiredBuckets: string[],
): ArcadeQuestion[] {
  const remaining = [...questions];
  const promoted: ArcadeQuestion[] = [];

  for (const bucket of requiredBuckets) {
    const index = remaining.findIndex((question) => question.bucket === bucket);
    if (index >= 0) promoted.push(...remaining.splice(index, 1));
  }

  return [...promoted, ...remaining];
}

function interleaveWorlds(worldDecks: ArcadeQuestion[][]): ArcadeQuestion[] {
  const out: ArcadeQuestion[] = [];
  const max = Math.max(...worldDecks.map((deck) => deck.length));

  for (let index = 0; index < max; index += 1) {
    for (const deck of worldDecks) {
      if (deck[index]) out.push(deck[index]);
    }
  }

  return out;
}

/** Questions that still have a conspicuous authored length imbalance. */
export const LENGTH_LEAK_AUDIT = sourceUnique
  .filter((question) => {
    const counts = question.choices.map(wordCount);
    const correctWords = counts[question.correct];
    const wrongWords = counts.filter((_, index) => index !== question.correct);
    const wrongAverage =
      wrongWords.reduce((sum, count) => sum + count, 0) / wrongWords.length;
    return correctWords > wrongAverage * 1.35;
  })
  .map((question) => ({
    id: question.id,
    world: question.world,
    lesson: question.lesson,
  }));

export const CORE_BANK = promoteRequiredBuckets(
  createRandomizedDeck("core", 100),
  ["Core", "Three Rs", "Safety"],
);
export const TYPE1_BANK = createRandomizedDeck("type1", 100);
export const TYPE2_BANK = createRandomizedDeck("type2", 100);
export const TYPE3_BANK = createRandomizedDeck("type3", 100);
export const TRANSITION_BANK = createRandomizedDeck("transition", 100);

/**
 * Runtime bank order is deliberately interleaved rather than concatenated.
 * World-specific runs still filter to their full 100-question deck. The
 * Universe Gate consumes the first 100 entries and therefore receives a
 * balanced 20-question sample from each of the five worlds, with Core/Three
 * Rs/Safety promoted early enough to guarantee required-bucket coverage.
 */
export const ARCADE_608_BANK: ArcadeQuestion[] = interleaveWorlds([
  CORE_BANK,
  TYPE1_BANK,
  TYPE2_BANK,
  TYPE3_BANK,
  TRANSITION_BANK,
]);

export const WORLD_COUNTS = {
  core: sourceUnique.filter((question) => question.world === "core").length,
  type1: sourceUnique.filter((question) => question.world === "type1").length,
  type2: sourceUnique.filter((question) => question.world === "type2").length,
  type3: sourceUnique.filter((question) => question.world === "type3").length,
  transition: sourceUnique.filter((question) => question.world === "transition")
    .length,
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
