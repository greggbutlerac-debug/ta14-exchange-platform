import { EXAM1, type ArcadeQuestion } from "./exam1-bank";
import { CORE_EXPANSION } from "./core-expansion-bank";
import { TYPE1_EXPANSION } from "./type1-expansion-bank";

/**
 * Canonical runtime bank for the EPA 608 readiness arcade.
 *
 * Source banks stay separate so each world can be reviewed and validated
 * independently. Each calendar day receives a new deterministic shuffle so
 * learners cannot memorize yesterday's question order or answer-letter order.
 */
const SOURCE_608_BANK: ArcadeQuestion[] = [
  ...EXAM1,
  ...CORE_EXPANSION,
  ...TYPE1_EXPANSION,
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

function hashSeed(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(items: T[], seedText: string) {
  const out = [...items];
  const random = rng(hashSeed(seedText));
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function utcDayKey() {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")}`;
}

function shuffleChoices(question: ArcadeQuestion, dayKey: string): ArcadeQuestion {
  const indexed = question.choices.map((choice, index) => ({ choice, index }));
  const shuffled = seededShuffle(indexed, `${dayKey}:${question.world}:${question.id}:choices`);
  const correct = shuffled.findIndex((entry) => entry.index === question.correct);
  return {
    ...question,
    choices: shuffled.map((entry) => entry.choice) as ArcadeQuestion["choices"],
    correct,
  };
}

const sourceUnique = uniqueByWorldAndId(SOURCE_608_BANK);
const dayKey = utcDayKey();

function buildWorld(world: ArcadeQuestion["world"]) {
  const selected = sourceUnique.filter((question) => question.world === world).slice(0, 100);
  return seededShuffle(selected, `${dayKey}:${world}:questions`).map((question) => shuffleChoices(question, dayKey));
}

export const CORE_BANK = buildWorld("core");
export const TYPE1_BANK = buildWorld("type1");
export const TYPE2_BANK = buildWorld("type2");
export const TYPE3_BANK = buildWorld("type3");
export const TRANSITION_BANK = buildWorld("transition");

export const ARCADE_608_BANK: ArcadeQuestion[] = [
  ...CORE_BANK,
  ...TYPE1_BANK,
  ...TYPE2_BANK,
  ...TYPE3_BANK,
  ...TRANSITION_BANK,
];

export const WORLD_COUNTS = {
  core: CORE_BANK.length,
  type1: TYPE1_BANK.length,
  type2: TYPE2_BANK.length,
  type3: TYPE3_BANK.length,
  transition: TRANSITION_BANK.length,
} as const;

export const WORLD_TARGET = 100;
export const UNIVERSAL_TARGET = WORLD_TARGET * 5;
export const WORLD_READY = {
  core: CORE_BANK.length >= WORLD_TARGET,
  type1: TYPE1_BANK.length >= WORLD_TARGET,
  type2: TYPE2_BANK.length >= WORLD_TARGET,
  type3: TYPE3_BANK.length >= WORLD_TARGET,
  transition: TRANSITION_BANK.length >= WORLD_TARGET,
} as const;

export type { ArcadeQuestion } from "./exam1-bank";
