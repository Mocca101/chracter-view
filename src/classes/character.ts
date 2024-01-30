import type { Check } from "../types/check";
import type HitPoints from "../types/hitPoints";
import type { Stat } from "../types/stats";
import type Entity from "../types/entity";
import type Background from "../types/background";
import type Class from "../types/class";
import type Race from "../types/race";
import { DnDBaseSkills } from "../data/BaseSkills";
import type { HitDice } from "../types/hitDice";
import { getAC } from "../utils/armorHelper";
import { type Armor, } from "../types/armorTypes";
import type { Sense, Senses } from "../types/senses";
import type { Proficiencies } from "../types/proficiency";
import type { Statblock } from "../types/zod/zodSchemas";
import { abilityToStatblock, sbProficenciesToProficiencies, statToStatblockStat } from "../utils/conversions";
import { defaultDndStats } from "../data/baseStats";
import type { HeadingSection } from "../utils/file/fileSections";
import { createHeading } from "../utils/file/fileSections";
import { commaStringToArray, commaStringToReducedArray } from "../utils/util";

export default class Character implements Entity, Senses, Proficiencies {


  name: string = "Default Name";
  description: HeadingSection = createHeading(2, "Description", "Default Description");
  alignment: string = "True Neutral";
  size: string = "Medium";
  race?: Race;

  cr: number = 1; // Level
  baseAC: number = 8;
  speed: string[] = ["30"];

  stats: Stat[] = defaultDndStats();
  abilityDCs: Stat[] = [];

  resistances: string[] = [];

  skillProficiencies: Check[] = [];

  hitPoints: HitPoints = {
    max: 12,
    current: 12,
    temporary: 0,
  };
  hitDice: HitDice = {
    diceType: 8,
    max: 1,
    used: 0,
    modifer: '',
  };

  background: Background;
  class?: Class;


  // Character specific stats
  inspiration: number = 0;
  deathSaveSuccesses: boolean[] = [false, false, false];
  deathSaveFailures: boolean[] = [false, false, false];

  // End of character specific stats

  // Equipment

  armor?: Armor;

  // End of Equipment

  // --- Personality ---

  personality: HeadingSection = createHeading(
    2, 
    "Personality", 
    "Default Personality", 
    [
      createHeading(3, "Traits", "Default Traits"),
      createHeading(3, "Ideals", "Default Ideals"),
      createHeading(3, "Bonds", "Default Bonds"),
      createHeading(3, "Flaws", "Default Flaws"),
    ]);

  // --- End of Personality ---

  keySenses: Sense[] = [];
  additionalSenses: string[] = [""];


  // Plain text 

  headings: HeadingSection[] = [];

  private assignSenses() {
    this.keySenses = [
      {
        name: "Passive Wisdom (Perception)",
        base: this.skillProficiencies.find(ability => ability.name === "Perception") as Check,
      },
      {
        name: "Passive Wisdom (Insight)",
        base: this.skillProficiencies.find(ability => ability.name === "Insight") as Check,
      },
      {
        name: "Passive Intelligence (Investigation)",
        base: this.skillProficiencies.find(ability => ability.name === "Investigation") as Check,
      },
    ]
  }

  // --- Proficiencies ---

  armorProficiencies: string[] = [];
  weaponProficiencies: string[] = [];
  toolProficiencies: string[] = [];
  languages: string[] = [''];
  otherProficiencies: string[] = [""];

  // --- End of Proficiencies ---

  constructor(name?: string, description?: HeadingSection, stats?: Stat[], speed?: string[], hitPoints?: HitPoints) {
    if(name) this.name = name;
    if(description) this.description = description;
    if(speed)this.speed = speed ?? ["30"];
    if(hitPoints) this.hitPoints = hitPoints ;

    this.stats = stats ??  defaultDndStats();
    this.abilityDCs[0] = this.stats[0];

    this.skillProficiencies = DnDBaseSkills.map(skill => {
      return {
        ...skill,
        stat: this.stats.find(stat => stat.name === skill.stat.name),
        proficiencyBonus: this.proficiencyBonus,
        proficiency: 0,
        };
    });
    this.assignSenses();
  }

  get initiative() : number {
    return this.stats.find(stat => stat.name === "Dexterity").modifier() ?? 0;
  }

  get ArmorClass() : number {
    const dex = this.stats.find(stat => stat.name === "Dexterity");
    return getAC(dex, this.armor) ?? 0;
  }

  get proficiencyBonus() : number {
    return 1 + Math.max(1, Math.ceil(this.cr / 4))
  }

  get statblock(): Statblock {
    return {
      name: this.name,
      alignment: this.alignment,
      size: this.size,
      // TODO: type
      // TODO: subtype
      // TODO: Class

      cr: this.cr,
      ac: this.baseAC,
      speed: this.speed.join(', '),

      inspiration: this.inspiration,

      hp: this.hitPoints.max,
      currentHP: this.hitPoints.current,
      tempHP: this.hitPoints.temporary,

      hit_dice: `${this.hitDice.max}d${this.hitDice.diceType}${this.hitDice.modifer}`,

      deathSaveSuccesses: this.deathSaveSuccesses,
      deathSaveFailures: this.deathSaveFailures,

      stats: this.stats.map(stat => statToStatblockStat(stat)),
      skillProficiencies: this.skillProficiencies.map(ability => abilityToStatblock(ability)),

      // TODO: used dice
      languages: this.languages.join(', '),
      otherProficiencies: this.otherProficiencies.join(', '),
      armorProficiencies: this.armorProficiencies.join(', '),
      weaponProficiencies: this.weaponProficiencies.join(', '),
      toolProficiencies: this.toolProficiencies.join(', '),


      senses: this.additionalSenses.join(', '),
      abilitySafeDCs: this.abilityDCs.map(stat => stat.name),
      resistances: this.resistances.join(', '),

    }
  }

  set statblock(statblock: Statblock) {
    // this.name = statblock.name; -> Loads name from filename
    if(statblock.alignment) this.alignment = statblock.alignment;
    if(statblock.size) this.size = statblock.size;
    // TODO: type
    // TODO: subtype
    // TODO: Class
    if(statblock.cr) this.cr = statblock.cr;
    if(statblock.ac) this.baseAC = statblock.ac;
    if(statblock.speed) this.speed = statblock.speed.split(',').map(speed => speed.trim());

    this.inspiration = statblock.inspiration ?? 0;

    this.assignHealthFromStatblock(statblock);

    if (statblock.deathSaveSuccesses) this.deathSaveSuccesses = statblock.deathSaveSuccesses.slice(0, 3);
    if (statblock.deathSaveFailures) this.deathSaveFailures = statblock.deathSaveFailures.slice(0, 3);

    this.statsFromStatblock(statblock);
    this.skillProficiencyFromStatblock(statblock);


    if (statblock.languages) {
      this.languages = commaStringToArray(statblock.languages);
    }
    if (statblock.otherProficiencies) {
      this.otherProficiencies = commaStringToArray(statblock.otherProficiencies);
    }
    this.armorProficiencies = commaStringToReducedArray(statblock.armorProficiencies ?? '');
    this.weaponProficiencies = commaStringToReducedArray(statblock.weaponProficiencies ?? '');
    this.toolProficiencies = commaStringToReducedArray(statblock.toolProficiencies ?? '');

    if (statblock.senses) {
      this.additionalSenses = commaStringToArray(statblock.senses);
    }

    if (statblock.abilitySafeDCs) {
      this.abilityDCs = statblock.abilitySafeDCs
        .map((ability) => this.stats.find((stat) => stat.name === ability))
        .filter((stat) => stat !== undefined) as Stat[];
    }

    if (statblock.resistances) {
      this.resistances = commaStringToArray(statblock.resistances);
    }
  }

  private assignHealthFromStatblock(statblock: Statblock) {
    if (statblock.hp) {
      this.hitPoints.max = statblock.hp;
      this.hitPoints.current = statblock.currentHP ?? statblock.hp;
    }

    this.hitPoints.temporary = statblock.tempHP ?? 0;

    if (statblock.hit_dice) {
      const [max, diceTypeAndModifier] = statblock.hit_dice.split('d');
      const [diceType, modifier] = diceTypeAndModifier.split(/(?=[+\-*/])/);
      this.hitDice = {
        max: parseInt(max),
        diceType: parseInt(diceType),
        used: 0,
        modifer: modifier,
      };
    }
  }

  private statsFromStatblock(statblock: Statblock) {
    if (statblock.stats) {
      const stats = statblock.stats;

      for (let i = 0; i < this.stats.length; i++) {
        if (stats[i]) {
          const stat = stats[i];
          if (typeof stat === "number") {
            this.stats[i].value = stat;
            continue;
          }
          this.stats[i].value = Object.values(stat)[0];
        }
      }
    }
  }

  private skillProficiencyFromStatblock(statblock: Statblock) {
    if (statblock.skillProficiencies) {
      const skillProficiencies = sbProficenciesToProficiencies(
        statblock.skillProficiencies
      );

      skillProficiencies.forEach((proficiency) => {
        this.skillProficiencies.map((ability) => {
          if (ability.name === proficiency.check.name)
            ability.proficiency = proficiency.proficiencyState;
          return ability;
        });
      });
    }
  }

}
