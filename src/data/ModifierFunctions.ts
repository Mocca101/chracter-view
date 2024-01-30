import type {ModifierCalc} from "../types/modifier";
import { isStat, type Stat } from "../types/stats";

export const dndModifierCalc: ModifierCalc = function (stat: Stat) {
  if(stat && isStat(stat)){
    return Math.floor((stat.value - 10) / 2);
  }
  console.error("dndModifierCalc called without a stat, object was: ", stat);
  return 0;
}
