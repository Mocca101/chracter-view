import { z } from "zod";

export const zSkillProficiency = z.record(z.string(), z.string().or(z.number()));

export const zStatblock = z.object({
  name: z.string().optional(),
  alignment: z.string().optional(),
  // TODO: Background?
  size: z.string().optional(),
  // TODO: Race?
  type: z.string().optional(),
  subtype: z.string().optional(),
  // TODO: Class?
  cr: z.number().default(1), // Level
  ac: z.number().optional(), // Base AC // TODO: Rework this -> Load from armor (?)
  
  speed: z.string().optional(),

  // Entity Stats
  stats: 
    z.array(z.number().default(10)).optional().or(
    z.array(z.record(z.number().default(10)).optional())
  ),
  skillProficiencies: z.array(zSkillProficiency).optional(),
  
  
  hp: z.number().optional(),
  currentHP: z.number().optional(),
  tempHP: z.number().optional(),
  hit_dice: z.string().optional(),

  // Death Saves 
  deathSaveSuccesses: z.array(z.boolean()).optional(),
  deathSaveFailures: z.array(z.boolean()).optional(),

  senses: z.string().optional(),
  abilitySafeDCs: z.array(z.string()).optional(),

  resistances: z.string().optional(),

  languages: z.string().optional(),
  otherProficiencies: z.string().optional(),
  armorProficiencies: z.string().optional(),
  weaponProficiencies: z.string().optional(),
  toolProficiencies: z.string().optional(),

  inspiration: z.number().optional(),

})

export type Statblock = z.infer<typeof zStatblock>;