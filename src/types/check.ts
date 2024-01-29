
import type ModifierCalc from "./modifier";
import { type Stat } from "./stats";
import type { RollMode } from "./types";
import { dndModifierCalc } from "../data/ModifierFunctions";
import type DiceCombo from "./diceCombo";

export type BaseCheck = {
  name: string;
  stat: Stat;
  dice: DiceCombo;
  modifierCalculation: ModifierCalc;
}

export const dndDefaultCheck: {
  dice: DiceCombo,
  modifierCalculation: ModifierCalc
} = {
  dice: {
    diceType: 20,
    quantity: 1,
  },
  modifierCalculation: dndModifierCalc,
}

export type Modifiers = {
  stat: Stat;
  proficiency?: number;
  roleMode?: RollMode;
  additionalBoni?: number[];
}

export type Check = BaseCheck & Modifiers 
