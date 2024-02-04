import { DnDBaseSkills } from "../data/BaseSkills";
import type { Check } from "../types/check";
import type { Stat } from "../types/stats";
import type { ZSkill } from "../types/zod/zodSchemas";

export function statToStatblockStat(stat: Stat) {
  return { 
    [stat.name]: stat.value
  }
}

export function abilityToStatblock(check: Check) : ZSkill {
  return {
    [check.name]: {
      stat: check.stat.name.slice(0, 3),
      proficiency: check.proficiency,
    }
  }
}

export function sbProficenciesToCheck(statblockProficiencies: Array<ZSkill>, stats: Stat[]): Array<Check> {
  if(!statblockProficiencies) return [];
  if(!Array.isArray(statblockProficiencies)) return [];
  const proficiencies: Array<Check> = [];

  statblockProficiencies.forEach(skill => {
    const skillName = Object.keys(skill)[0];
    const stat = stats.find(stat => stat.name.toLowerCase().includes(skill[skillName].stat.toLowerCase()));
    console.log('sbProficenciesToCheck -> stat', skillName, stat, stats, skill);
    const check: Check = {
      name: skillName,
      stat: stat,
      dice: skill[skillName].dice ?? "1d20",
      proficiency: skill[skillName].proficiency ?? 0,
    }  
    proficiencies.push(check);
  });
  return proficiencies;
}

function statblockProficiencyToProficiencyState(proficiency: string|number): number {
  if(typeof proficiency !== 'number' && typeof proficiency!=='string') return 0;

  if(typeof proficiency === 'number') {
    switch (proficiency) {
      case 1: return 1;
      case 2: return 2;
    }
  } else {
    if('proficient'.contains(proficiency.toLowerCase())) return 1;
    if('expertise'.contains(proficiency.toLowerCase())) return 2;
  }
  return 0;
}