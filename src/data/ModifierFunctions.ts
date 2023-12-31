import type ModifierCalc from "../types/modifier";
import { isStat, type Stat } from "../types/stats";

export const dndModifierCalc: ModifierCalc = function (this: Stat) {
  if(this && isStat(this)){
    const stat = this as Stat;
    return Math.floor((stat.value - 10) / 2);
  }
  console.error("dndModifierCalc called without a stat, object was: ", this);
  return 0;
}
