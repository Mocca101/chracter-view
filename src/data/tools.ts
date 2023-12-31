const artisansTools = [
  "Alchemist's supplies",
  "Brewer's supplies",
  "Calligrapher's supplies",
  "Carpenter's tools",
  "Cartographer's tools",
  "Cobbler's tools",
  "Cook's utensils",
  "Glassblower's tools",
  "Jewler's tools",
  "Leatherworker's tools",
  "Mason's tools",
  "Painter's supplies",
  "Potter's tools",
  "Smith's tools",
  "Tinker's tools",
  "Weaver's tools",
  "Woodcarver's tools",
] as const;

const kits = [
  "Disguise Kit",
  "Forgery Kit",
  "Herbalism Kit",
  "Navigator's Tools",
  "Poisoner's Kit",
  "Thieves' Tools",
] as const;

const instruments = [
  "Bagpipes",
  "Drum",
  "Dulcimer",
  "Flute",
  "Lute",
  "Lyre",
  "Horn",
  "Pan flute",
  "Shawm",
  "Viol",
] as const;

const gamingSets = [
  "Dice set",
  "Dragonchess set",
  "Playing card set",
  "Three-Dragon Ante set",
] as const;

const vehicles = [
  "Land",
  "Water",
  "Air",
] as const;

type ArtisanToolTypes = typeof artisansTools[number];
type KitTypes = typeof kits[number];
type InstrumentTypes = typeof instruments[number];
type GamingSetTypes = typeof gamingSets[number];
type VehicleTypes = typeof vehicles[number];

export type Tool = ArtisanToolTypes | KitTypes | InstrumentTypes | GamingSetTypes | VehicleTypes;
export const tools = [
  ...artisansTools,
  ...kits,
  ...instruments,
  ...gamingSets,
  ...vehicles,
] as const;
