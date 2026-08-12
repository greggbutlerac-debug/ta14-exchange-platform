import { EXAM1, type ArcadeQuestion } from "./exam1-bank";
import { CORE_EXPANSION } from "./core-expansion-bank";

/**
 * Canonical runtime bank for the EPA 608 readiness arcade.
 *
 * Source banks stay separate so each world can be reviewed and validated
 * independently. The runtime then selects up to 100 unique questions per
 * equipment world so a 100-question campaign never wraps back to question 1.
 */
const SOURCE_608_BANK: ArcadeQuestion[] = [
  ...EXAM1,
  ...CORE_EXPANSION,
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

const sourceUnique = uniqueByWorldAndId(SOURCE_608_BANK);

export const CORE_BANK = sourceUnique.filter((question) => question.world === "core").slice(0, 100);
export const TYPE1_BANK = sourceUnique.filter((question) => question.world === "type1").slice(0, 100);
export const TYPE2_BANK = sourceUnique.filter((question) => question.world === "type2").slice(0, 100);
export const TYPE3_BANK = sourceUnique.filter((question) => question.world === "type3").slice(0, 100);
export const TRANSITION_BANK = sourceUnique.filter((question) => question.world === "transition").slice(0, 100);

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
