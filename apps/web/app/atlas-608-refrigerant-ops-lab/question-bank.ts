import { EXAM1, type ArcadeQuestion } from "./exam1-bank";
import { CORE_EXPANSION } from "./core-expansion-bank";
import { TYPE1_EXPANSION } from "./type1-expansion-bank";
import { TYPE2_EXPANSION } from "./type2-expansion-bank";

/**
 * Canonical source bank for the EPA 608 readiness arcade.
 *
 * Source banks stay separate so each world can be reviewed and validated
 * independently. Runtime decks are intentionally NOT tied to a calendar day.
 * Every fresh game/page start gets a newly randomized question order and
 * newly randomized answer-letter order so learners train recognition rather
 * than memorizing yesterday's sequence.
 */
const SOURCE_608_BANK: ArcadeQuestion[] = [
  ...EXAM1,
  ...CORE_EXPANSION,
  ...TYPE1_EXPANSION,
  ...TYPE2_EXPANSION,
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

function shuffleChoices(question: ArcadeQuestion): ArcadeQuestion {
  const indexed = question.choices.map((choice, index) => ({ choice, index }));
  const randomized = shuffle(indexed);
  const correct = randomized.findIndex((entry) => entry.index === question.correct);
  return {
    ...question,
    choices: randomized.map((entry) => entry.choice) as ArcadeQuestion["choices"],
    correct,
  };
}

const sourceUnique = uniqueByWorldAndId(SOURCE_608_BANK);

/** Create a brand-new randomized deck on demand. */
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

/**
 * Initial runtime banks are randomized at each fresh browser/game load.
 * The game UI can call createRandomizedDeck again whenever a player explicitly
 * starts/restarts a run, giving the next 25-question attempt a fresh draw.
 */
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
