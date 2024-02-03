import type {BaseCheck } from "./check";

// TODO: consolidate SkillProficiency and Check
// relevant files: src/types/check.ts, src/types/proficiency.ts, src/utils/conversions.ts, src/data/BaseSkills.ts

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
