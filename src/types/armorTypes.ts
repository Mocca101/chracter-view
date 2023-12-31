import type { Item } from "./types";

export type ArmorSource = {
  ac: number;
  additionalInfo?: string;
}

type ArmorBase = ArmorSource & Item & {
  stealthDisadvantage?: boolean;
}

export type LightArmor = ArmorBase & {
  type: 'light'
}

export type MediumArmor = ArmorBase & {
  type: 'medium'
  maxModifier?: number;
}

export type HeavyArmor = ArmorBase & {
  type: 'heavy'
  minStat?: number;
}

export const defaultArmor: ArmorBase = {
  name: "Default Armor",
  ac: 11,
}

export type Shield = ArmorSource & Item & {
  type: 'shield'
}

export type Armor = LightArmor | MediumArmor | HeavyArmor | Shield;

// Generate an array of available armor types from the type field, using type script

export type ArmorType = Armor['type']
export const armorTypesArray: ArmorType[] = ['light', 'medium', 'heavy', 'shield'];

