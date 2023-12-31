export const weaponCategories = [
  "simple",
  "martial",
  "exotic",
  "firearms",
  "siege",
  "special",
] as const;

export type WeaponCategory = typeof weaponCategories[number];

const weaponProperties = [
  "ammunition",
  "finesse",
  "heavy",
  "light",
  "loading",
  "range",
  "reach",
  "special",
  "thrown",
  "twoHanded",
  "versatile",
] as const;

export type WeaponProperty = typeof weaponProperties[number];
