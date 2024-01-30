import type {BaseCheck } from "./check";

// TODO: IDEA: -> Actually I think having the base stat as type is good, but it should be possible to set the stat as a string. Which should achievable via zod.
// SkillProficiency {
//   skill: string;
//   baseStatName: string;
//   proficiencyState: number;
//   dice?: DiceCombo;
// }

export type SkillProficiency = {
  check: BaseCheck;
  proficiencyState: number;
}

export type Proficiencies = {
  armorProficiencies: string[];
  weaponProficiencies: string[];
  toolProficiencies: string[];
  languages: string[];
  otherProficiencies: string[];
}
