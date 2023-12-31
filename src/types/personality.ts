export const personalityTraitKeys = ['traits', 'ideals', 'bonds', 'flaws'] as const;

export type PersonalityKey = typeof personalityTraitKeys[number];

export type Personality = {
  [key in PersonalityKey]: string[];
}

export function isPersonalityKey(key: string): key is PersonalityKey {
  const isKey = personalityTraitKeys.includes(key as PersonalityKey);
  return key in personalityTraitKeys;
}
