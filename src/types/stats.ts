import type ModifierCalc from "./modifier";

export interface Stat {
  name: string;
  value: number;
  max?: number;
  min?: number;
  modifier: ModifierCalc;
}

export function isStat(obj: any): obj is Stat {
  return obj.value !== undefined && obj.name && obj.modifier;
}
