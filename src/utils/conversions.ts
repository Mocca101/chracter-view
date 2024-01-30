import { DnDBaseSkills } from "../data/BaseSkills";
import type { Check } from "../types/check";
import type { SkillProficiency } from "../types/proficiency";
import type { Stat } from "../types/stats";

export function statToStatblockStat(stat: Stat) {
  return { 
    [stat.name]: stat.value
  }
}

export function abilityToStatblock(check: Check) {
  return {
    [check.name]: check.proficiency
  }
}

export function sbProficenciesToProficiencies(statblockProficiencies: Array<Record<string, string|number>>): Array<SkillProficiency> {
  if(!statblockProficiencies) return [];
  if(!Array.isArray(statblockProficiencies)) return [];
  const proficiencies: Array<SkillProficiency> = [];

  const baseProficiencies = DnDBaseSkills.map(skill => skill.name.toLowerCase());

  for(let i = 0; i < statblockProficiencies.length; i++) {
    const proficiency = statblockProficiencies[i];
    const proficiencyName = Object.keys(proficiency)[0].toLowerCase();
    const proficiencyValue = Object.values(proficiency)[0];

    if(!baseProficiencies.includes(proficiencyName.toLowerCase())) continue;
    if(typeof proficiencyValue !== 'number' && typeof proficiencyValue !=='string') continue;
    proficiencies.push({
      check: DnDBaseSkills[baseProficiencies.indexOf(proficiencyName.toLowerCase())],
      proficiencyState: statblockProficiencyToProficiencyState(proficiencyValue)
    });

  }
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