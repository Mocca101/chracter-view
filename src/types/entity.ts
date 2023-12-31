import type { Stat } from "./stats";
import type HitPoints from "./hitPoints";
import type Background from "./background";
import type Race from "./race";
import type Class from "./class";
import type { HitDice } from "./diceCombo";

export default interface Entity extends EntityStats, EntityBase {

}

interface EntityStats {
  stats: Stat[];
  cr: number;
  speed: number;
  hitPoints: HitPoints;
  hitDice: HitDice;
}

interface EntityBase {
  name: string;
  description: string;
  alignment: string;
  background: Background;
  size: string;
  race?: Race;
  class?: Class;
}
