import type {BaseCheck } from "./check";

// IDEA:
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
