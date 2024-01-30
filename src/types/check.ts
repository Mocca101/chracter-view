
import type ModifierCalc from "./modifier";
import { type Stat } from "./stats";
import type { RollMode } from "./types";
import { dndModifierCalc } from "../data/ModifierFunctions";

export type BaseCheck = {
  name: string;
  stat: Stat;
  dice: string;
  modifierCalculation: ModifierCalc;
}

export const dndDefaultCheck: {
  dice: string,
  modifierCalculation: ModifierCalc
} = {
  dice: "1d20",
  modifierCalculation: dndModifierCalc,
}

export type Modifiers = {
  stat: Stat;
  proficiency?: number;
  roleMode?: RollMode;
  additionalBoni?: number[];
}

export type Check = BaseCheck & Modifiers 
