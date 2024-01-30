import type { Stat } from "./stats";
import type HitPoints from "./hitPoints";
import type Background from "./background";
import type Race from "./race";
import type Class from "./class";
import type { HitDice } from "./hitDice";
import type { HeadingSection } from "../utils/file/fileSections";

export default interface Entity extends EntityStats, EntityBase {

}

interface EntityStats {
  stats: Stat[];
  cr: number;
  speed: string[];
  hitPoints: HitPoints;
  hitDice: HitDice;
}

interface EntityBase {
  name: string;
  description: HeadingSection;
  alignment: string;
  background: Background;
  size: string;
  race?: Race;
  class?: Class;
}
