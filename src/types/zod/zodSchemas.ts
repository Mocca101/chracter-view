import { z } from "zod";

export const zSkillProficiency = z.record(z.string(), z.string().or(z.number()));

const zDiceCombo = z.object({
  diceType: z.number(),
  quantity: z.number(),
  modifier: z.number().optional(),
})

type DiceCombo = z.infer<typeof zDiceCombo>;

const diceComboInString = z.string().transform((str, ctx) => {
  const [quantity, diceType, modifier] = str.split(/[-+d]/).map(item => parseInt(item.trim()));

  if(!quantity || !diceType) {
    ctx.addIssue(
      {
        code: z.ZodIssueCode.custom,
        message: 'Invalid dice combo, quantity or diceType is missing or not a number.',
      }
    )
    return z.never();
  }

  return {
    diceType: diceType,
    quantity: quantity,
    modifier: modifier ? modifier : undefined,
  } as DiceCombo;

})


/** 
 * Structure:
 * name: {
 *  stat,
 *  proficiencyState,
 *  dice, 
 * }
*/
export const zBaseCheck = z.record(z.string(), z.object({
  stat: z.string(),
  proficiencyState: z.number().default(0),
  dice: diceComboInString,
}))



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