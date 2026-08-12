import { EXAM1, type ArcadeQuestion } from "./exam1-bank";
import { CORE_EXPANSION } from "./core-expansion-bank";

/**
 * Canonical runtime bank for the EPA 608 readiness arcade.
 *
 * Keep source banks separate so each world can be reviewed, expanded, and
 * validated independently while the game consumes one combined array.
 */
export const ARCADE_608_BANK: ArcadeQuestion[] = [
  ...EXAM1,
  ...CORE_EXPANSION,
];

export const WORLD_COUNTS = ARCADE_608_BANK.reduce<Record<string, number>>(
  (counts, question) => {
    counts[question.world] = (counts[question.world] ?? 0) + 1;
    return counts;
  },
  {},
);

export const CORE_BANK = ARCADE_608_BANK.filter((question) => question.world === "core");
export const TYPE1_BANK = ARCADE_608_BANK.filter((question) => question.world === "type1");
export const TYPE2_BANK = ARCADE_608_BANK.filter((question) => question.world === "type2");
export const TYPE3_BANK = ARCADE_608_BANK.filter((question) => question.world === "type3");
export const TRANSITION_BANK = ARCADE_608_BANK.filter((question) => question.world === "transition");

export type { ArcadeQuestion } from "./exam1-bank";
