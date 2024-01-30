
import { type Stat } from "./stats";
import type { RollMode } from "./types";

export type BaseCheck = {
  name: string;
  stat: Stat;
  dice: string;
}

export const dndDefaultCheck: {
  dice: string,
} = {
  dice: "1d20",
}

export type Modifiers = {
  stat: Stat;
  proficiency?: number;
  roleMode?: RollMode;
  additionalBoni?: number[];
}

export type Check = BaseCheck & Modifiers 
