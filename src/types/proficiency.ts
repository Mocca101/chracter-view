import type { Tool } from "../data/tools";
import type { ArmorType } from "./armorTypes";
import type {BaseCheck } from "./check";
import type { ProficiencyState } from "./enums";
import type { WeaponCategory } from "./weaponTypes";

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
