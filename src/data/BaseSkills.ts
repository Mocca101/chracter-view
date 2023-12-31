import type {BaseCheck} from "../types/check";
import { dndDefaultCheck } from "../types/check";
import { Strength, Dexterity, Intelligence, Wisdom, Charisma } from "./baseStats";


export const Acrobatics: BaseCheck = {
  ...dndDefaultCheck,
  name: "Acrobatics",
  stat: Dexterity,
};

export const AnimalHandling: BaseCheck = {
  ...dndDefaultCheck,
  name: "Animal Handling",
  stat: Wisdom,
};

export const Arcana: BaseCheck = {
  ...dndDefaultCheck,
  name: "Arcana",
  stat: Intelligence,
};

export const Athletics: BaseCheck = {
  ...dndDefaultCheck,
  name: "Athletics",
  stat: Strength,
};

export const Deception: BaseCheck = {
  ...dndDefaultCheck,
  name: "Deception",
  stat: Charisma,
};

export const History: BaseCheck = {
  ...dndDefaultCheck,
  name: "History",
  stat: Intelligence,
};

export const Insight: BaseCheck = {
  ...dndDefaultCheck,
  name: "Insight",
  stat: Wisdom,
};

export const Intimidation: BaseCheck = {
  ...dndDefaultCheck,
  name: "Intimidation",
  stat: Charisma,
};

export const Investigation: BaseCheck = {
  ...dndDefaultCheck,
  name: "Investigation",
  stat: Intelligence,
};

export const Medicine: BaseCheck = {
  ...dndDefaultCheck,
  name: "Medicine",
  stat: Wisdom,
};

export const Nature: BaseCheck = {
  ...dndDefaultCheck,
  name: "Nature",
  stat: Intelligence,
};

export const Perception: BaseCheck = {
  ...dndDefaultCheck,
  name: "Perception",
  stat: Wisdom,
};

export const Performance: BaseCheck = {
  ...dndDefaultCheck,
  name: "Performance",
  stat: Charisma,
};

export const Persuasion: BaseCheck = {
  ...dndDefaultCheck,
  name: "Persuasion",
  stat: Charisma,
};

export const Religion: BaseCheck = {
  ...dndDefaultCheck,
  name: "Religion",
  stat: Intelligence,
};

export const SleightOfHand: BaseCheck = {
  ...dndDefaultCheck,
  name: "Sleight of Hand",
  stat: Dexterity,
};

export const Stealth: BaseCheck = {
  ...dndDefaultCheck,
  name: "Stealth",
  stat: Dexterity,
};

export const Survival: BaseCheck = {
  ...dndDefaultCheck,
  name: "Survival",
  stat: Wisdom,
};

export const DnDBaseSkills: BaseCheck[] = [
  Acrobatics,
  AnimalHandling,
  Arcana,
  Athletics,
  Deception,
  History,
  Insight,
  Intimidation,
  Investigation,
  Medicine,
  Nature,
  Perception,
  Performance,
  Persuasion,
  Religion,
  SleightOfHand,
  Stealth,
  Survival,
];
