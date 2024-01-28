import type {BaseCheck } from "./check";
import type { ProficiencyState } from "./enums";

// IDEA:
// SkillProficiency {
//   skill: string;
//   baseStatName: string;
//   proficiencyState: ProficiencyState;
//   dice?: DiceCombo;
// }

export type SkillProficiency = {
  check: BaseCheck;
  proficiencyState: ProficiencyState;
}

export type Proficiencies = {
  armorProficiencies: string[];
  weaponProficiencies: string[];
  toolProficiencies: string[];
  languages: string[];
  otherProficiencies: string[];
}
