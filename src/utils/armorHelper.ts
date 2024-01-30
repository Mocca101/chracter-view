import type { Armor, HeavyArmor } from "../types/armorTypes";
import type { ModifierCalc } from "../types/modifier";
import type { Stat } from "../types/stats";

export function getAC(baseAcStat: Stat, modifier: ModifierCalc, armor?: Armor) {
  if (!armor) return modifier(baseAcStat) + 10;

  switch (armor.type) {
    case "light":
      return armor.ac + modifier(baseAcStat);
    case "medium":
      return armor.ac + (Math.min(modifier(baseAcStat) || 0, armor.maxModifier || 2));
    case "heavy":
      return armor.ac;
    default:
      return baseAcStat.value + 10;
  }

}

export function canWearArmor(armor: HeavyArmor, requiredStat: Stat) {
  return armor.minStat ? requiredStat.value >= armor.minStat : true;
}
