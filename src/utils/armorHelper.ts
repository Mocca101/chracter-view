import type { Armor, HeavyArmor } from "../types/armorTypes";
import type { Stat } from "../types/stats";

export function getAC(baseAcStat: Stat, armor?: Armor) {
  if (!armor) return baseAcStat.modifier() + 10;

  switch (armor.type) {
    case "light":
      return armor.ac + baseAcStat.modifier();
    case "medium":
      return armor.ac + (Math.min(baseAcStat.modifier() || 0, armor.maxModifier || 2));
    case "heavy":
      return armor.ac;
    default:
      return baseAcStat.value + 10;
  }

}

export function canWearArmor(armor: HeavyArmor, requiredStat: Stat) {
  return armor.minStat ? requiredStat.value >= armor.minStat : true;
}
