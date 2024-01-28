import type { Armor } from "../types/armorTypes";
import type { BaseCheck } from "../types/check";
import type { Stat } from "../types/stats";
import { Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma } from "./baseStats";

export interface Class {
  name: string;
  hitDie: number;
  savingThrows: Stat[];
  skillProficiencies: BaseCheck[];
  armorProficiencies: Armor[];
  weaponProficiencies: string[];
  
  equipment: string[];
  features: string[];
}

export const Barbarian: Class = {
  name: "Barbarian",
  hitDie: 12,
  savingThrows: [Strength, Constitution],
  skillProficiencies: [], 
  armorProficiencies: [], // Light, Medium, Shields 
  weaponProficiencies: [], // Simple, Martial
  equipment: [
    "Greataxe",
    "2 Handaxes",
    "Explorer's Pack",
    "4 Javelins"
  ],
  features: [
    "Rage",
    "Unarmored Defense",
    "Reckless Attack",
    "Danger Sense",
    "Primal Path",
    "Extra Attack",
  ],
};

