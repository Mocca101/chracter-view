import { type HeavyArmor, type LightArmor, type MediumArmor } from "../types/armorTypes";

const paddedArmor: LightArmor = {
  name: "Padded Armor",
  type: "light",
  ac: 11,
  additionalInfo: "Disadvantage on Stealth Checks. " +
    "Padded armar consists of quilted layers of cloth and batting.",
  stealthDisadvantage: true,
}

const leatherArmor: LightArmor = {
  name: "Leather Armor",
  type: "light",
  ac: 11,
  additionalInfo:
    "The Breastplate of this armor is made of leather that has been stiffened by being boiled in oil. " +
    "The rest of the armor is made of softer and more flexible materials.",
}

const studdedLeatherArmor: LightArmor = {
  name: "Studded Leather Armor",
  type: "light",
  ac: 12,
  additionalInfo:
    "Made from tough but flexible leather, studded leather is reinforced with close-set rivets or spikes.",
}

const hideArmor: MediumArmor = {
  name: "Hide Armor",
  type: "medium",
  ac: 12,
  additionalInfo:
    "This crude armor consists of thick furs and pelts. It is commonly worn by barbarian tribes, evil humanoids, " +
    "and other folk who lack access to the tools and materials needed to create better armor.",
}

const chainShirt: MediumArmor = {
  name: "Chain Shirt",
  type: "medium",
  ac: 13,
  additionalInfo:
    "Made of interlocking metal rings, a chain shirt is worn between layers of clothing or leather. " +
    "This armor offers modest protection to the wearer's upper body and allows the sound of the rings rubbing " +
    "against one another to be muffled by outer layers.",
}

const scaleMail: MediumArmor = {
  name: "Scale Mail",
  type: "medium",
  ac: 14,
  additionalInfo:
    "This armor consists of a coat and leggings (and perhaps a separate skirt) of leather covered with overlapping " +
    "pieces of metal, much like the scales of a fish. The suit includes gauntlets.",
}

const ringMail: HeavyArmor = {
  name: "Ring Mail",
  type: "heavy",
  ac: 14,
  additionalInfo:
    "This armor is leather armor with heavy rings sewn into it. The rings help reinforce the armor against blows " +
    "from swords and axes. Ring mail is inferior to chain mail, and it's usually worn only by those who can't afford " +
    "better armor.",
  stealthDisadvantage: true,
}

const chainMail: HeavyArmor = {
  name: "Chain Mail",
  type: "heavy",
  ac: 16,
  additionalInfo:
    "Made of interlocking metal rings, chain mail includes a layer of quilted fabric worn underneath the mail to " +
    "prevent chafing and to cushion the impact of blows. The suit includes gauntlets.",
  stealthDisadvantage: true,
  minStat: 13,
}

export const BaseArmors: (LightArmor | MediumArmor | HeavyArmor)[] = [
  paddedArmor,
  leatherArmor,
  studdedLeatherArmor,
  hideArmor,
  chainShirt,
  scaleMail,
  ringMail,
  chainMail,
];
