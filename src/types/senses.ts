import type { Check } from "./check";

export const SenseKeys = [
  "passivePerception",
  "passiveInsight",
  "passiveInvestigation",
] as const;


export type Sense = {
  name: string;
  base: Check;
}

export type Senses = {
  keySenses: Sense[];
  additionalSenses: string[];
}


