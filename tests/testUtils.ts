const originalStatblock: string = 
  "\n### Stats" +
  "\n```statblock\n" +
  "name: Kuini\nalignment: True Neutral\ntype: aberration\nsubtype: \"\"\ncr: 18\nspeed: 10 ft., swim 40 ft.\n" +
  "stats:\n  - Strength: 20\n  - Dexterity: 9\n  - Constitution: 15\n  - Intelligence: 4\n  - Wisdom: 15\n  - Charisma: 18\n" +
  "ac: 17\nhp: 135\nhit_dice: 12d12+36\nlanguages: Deep Speech, telepathy 120 ft.\n" +
  "skillProficiencies:\n  - Acrobatics: 1\n  - Animal Handling: 0\n  - Arcana: 2\n  - Athletics: 0\n  - Deception: 2\n  - History: 0\n  - Insight: 2\n  - Intimidation: 0\n  - Investigation: 0\n  - Medicine: 0\n  - Nature: 0\n  - Perception: 0\n  - Performance: 0\n  - Persuasion: 0\n  - Religion: 0\n  - Sleight of Hand: 0\n  - Stealth: 0\n  - Survival: 2\n" +
  "dice: true\nrender: true\n" +
  "saves:\n  - constitution: 6\n  - intelligence: 8\n  - wisdom: 6\n" +
  "skillsaves:\n  - history: 12\n  - perception: 10\n" +
  "damage_vulnerabilities: \"\"\ndamage_resistances: \"\"\ndamage_immunities: \"\"\ncondition_immunities: \"\"\n" +
  "senses: darkvision 120 ft., passive Perception 20\n" +
  "bestiary: true\n" +
  "traits:\n  - name: Amphibious\n    desc: The aboleth can breathe air and water.\n    attack_bonus: 0\n  - name: Mucous Cloud\n    desc: While underwater, the aboleth is surrounded by transformative mucus. A creature that touches the aboleth or that hits it with a melee attack while within 5 ft. of it must make a DC 14 Constitution saving throw. On a failure, the creature is diseased for 1d4 hours. The diseased creature can breathe only underwater.\n    attack_bonus: 0\n  - name: Probing Telepathy\n    desc: If a creature communicates telepathically with the aboleth, the aboleth learns the creature\'s greatest desires if the aboleth can see the creature.\n    attack_bonus: 0\nactions:\n  - name: Multiattack\n    desc: The aboleth makes three tentacle attacks.\n    attack_bonus: 0\n  - name: Tentacle\n    desc: \"Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 12 (2d6 + 5) bludgeoning damage. If the target is a creature, it must succeed on a DC 14 Constitution saving throw or become diseased. The disease has no effect for 1 minute and can be removed by any magic that cures disease. After 1 minute, the diseased creature\'s skin becomes translucent and slimy, the creature can\'t regain hit points unless it is underwater, and the disease can be removed only by heal or another disease-curing spell of 6th level or higher. When the creature is outside a body of water, it takes 6 (1d12) acid damage every 10 minutes unless moisture is applied to the skin before 10 minutes have passed.\"\n    attack_bonus: 9\n    damage_dice: 2d6\n    damage_bonus: 5\n  - name: Tail\n    desc: \"Melee Weapon Attack: +9 to hit, reach 10 ft. one target. Hit: 15 (3d6 + 5) bludgeoning damage.\"\n    attack_bonus: 9\n    damage_dice: 3d6\n    damage_bonus: 5\n  - name: Enslave (3/day)\n    desc: |-\n      The aboleth targets one creature it can see within 30 ft. of it. The target must succeed on a DC 14 Wisdom saving throw or be magically charmed by the aboleth until the aboleth dies or until it is on a different plane of existence from the target. The charmed target is under the aboleth\'s control and can\'t take reactions, and the aboleth and the target can communicate telepathically with each other over any distance.\n      Whenever the charmed target takes damage, the target can repeat the saving throw. On a success, the effect ends. No more than once every 24 hours, the target can also repeat the saving throw when it is at least 1 mile away from the aboleth.\n    attack_bonus: 0\nlegendary_actions:\n  - name: Detect\n    desc: The aboleth makes a Wisdom (Perception) check.\n    attack_bonus: 0\n  - name: Tail Swipe\n    desc: The aboleth makes one tail attack.\n    attack_bonus: 0\n  - name: Psychic Drain (Costs 2 Actions)\n    desc: One creature charmed by the aboleth takes 10 (3d6) psychic damage, and the aboleth regains hit points equal to the damage the creature takes.\n    attack_bonus: 0\n" +
  "spells:\n  - some other spell\n" +
  "\n```\n"
  
const editedStatblock: string = 
  "\n### Stats" +
  "\n```statblock\n" +
  "name: Kuini_base_spec\nalignment: True Neutral\ntype: aberration\nsubtype: \"\"\ncr: 18\nac: 17\nspeed: 10 ft., swim 40 ft.\n" +
  "stats:\n  - Strength: 20\n  - Dexterity: 9\n  - Constitution: 15\n  - Intelligence: 4\n  - Wisdom: 15\n  - Charisma: 18\n" +
  "skillProficiencies:\n  - Acrobatics: 1\n  - Animal Handling: 0\n  - Arcana: 2\n  - Athletics: 0\n  - Deception: 2\n  - History: 0\n  - Insight: 2\n  - Intimidation: 0\n  - Investigation: 0\n  - Medicine: 0\n  - Nature: 0\n  - Perception: 0\n  - Performance: 0\n  - Persuasion: 0\n  - Religion: 0\n  - Sleight of Hand: 0\n  - Stealth: 0\n  - Survival: 2\n" +
  "hp: 135\nhit_dice: 12d12+36\n" +
  "senses: darkvision 120 ft., passive Perception 20\n" +
  "languages: Deep Speech, telepathy 120 ft.\n" +
  "dice: true\nrender: true\n" +
  "saves:\n  - constitution: 6\n  - intelligence: 8\n  - wisdom: 6\n" +
  "skillsaves:\n  - history: 12\n  - perception: 10\n" +
  "damage_vulnerabilities: \"\"\ndamage_resistances: \"\"\ndamage_immunities: \"\"\ncondition_immunities: \"\"\n" +
  "bestiary: true\n" +
  "traits:\n  - name: Amphibious\n    desc: The aboleth can breathe air and water.\n    attack_bonus: 0\n  - name: Mucous Cloud\n    desc: While underwater, the aboleth is surrounded by transformative mucus. A creature that touches the aboleth or that hits it with a melee attack while within 5 ft. of it must make a DC 14 Constitution saving throw. On a failure, the creature is diseased for 1d4 hours. The diseased creature can breathe only underwater.\n    attack_bonus: 0\n  - name: Probing Telepathy\n    desc: If a creature communicates telepathically with the aboleth, the aboleth learns the creature\'s greatest desires if the aboleth can see the creature.\n    attack_bonus: 0\nactions:\n  - name: Multiattack\n    desc: The aboleth makes three tentacle attacks.\n    attack_bonus: 0\n  - name: Tentacle\n    desc: \"Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 12 (2d6 + 5) bludgeoning damage. If the target is a creature, it must succeed on a DC 14 Constitution saving throw or become diseased. The disease has no effect for 1 minute and can be removed by any magic that cures disease. After 1 minute, the diseased creature\'s skin becomes translucent and slimy, the creature can\'t regain hit points unless it is underwater, and the disease can be removed only by heal or another disease-curing spell of 6th level or higher. When the creature is outside a body of water, it takes 6 (1d12) acid damage every 10 minutes unless moisture is applied to the skin before 10 minutes have passed.\"\n    attack_bonus: 9\n    damage_dice: 2d6\n    damage_bonus: 5\n  - name: Tail\n    desc: \"Melee Weapon Attack: +9 to hit, reach 10 ft. one target. Hit: 15 (3d6 + 5) bludgeoning damage.\"\n    attack_bonus: 9\n    damage_dice: 3d6\n    damage_bonus: 5\n  - name: Enslave (3/day)\n    desc: |-\n      The aboleth targets one creature it can see within 30 ft. of it. The target must succeed on a DC 14 Wisdom saving throw or be magically charmed by the aboleth until the aboleth dies or until it is on a different plane of existence from the target. The charmed target is under the aboleth\'s control and can\'t take reactions, and the aboleth and the target can communicate telepathically with each other over any distance.\n      Whenever the charmed target takes damage, the target can repeat the saving throw. On a success, the effect ends. No more than once every 24 hours, the target can also repeat the saving throw when it is at least 1 mile away from the aboleth.\n    attack_bonus: 0\nlegendary_actions:\n  - name: Detect\n    desc: The aboleth makes a Wisdom (Perception) check.\n    attack_bonus: 0\n  - name: Tail Swipe\n    desc: The aboleth makes one tail attack.\n    attack_bonus: 0\n  - name: Psychic Drain (Costs 2 Actions)\n    desc: One creature charmed by the aboleth takes 10 (3d6) psychic damage, and the aboleth regains hit points equal to the damage the creature takes.\n    attack_bonus: 0\n" +
  "spells:\n  - some other spell\n" + 
  "size: Medium\n"+
  "inspiration: 0\n" +
  "currentHP: 135\n" + 
  "tempHP: 0\n" +
  "deathSaveSuccesses:\n  - false\n  - false\n  - false\n" +
  "deathSaveFailures:\n  - false\n  - false\n  - false\n" +
  "otherProficiencies: \"\"\n"+ 
  "armorProficiencies: \"\"\n"+ 
  "weaponProficiencies: \"\"\n"+ 
  "toolProficiencies: \"\"\n"+ 
  "abilitySafeDCs:\n  - Strength\n"+ 
  "resistances: \"\""+ 
  "\n" +
  "\n```\n"

export const defaultPersonalityParagraph: string = "test text";
const defaultPersonality: string = 
  "\n### Personality\n" +
  `${defaultPersonalityParagraph}\n` +
  "\n#### sub Personality\n" +
  "sub test text\n"

export const kuiniString: string =
  "---\nfileClass: DnD Character\ntype: DnD Character\nSource:\ntags: []\n---\n" +
  "\n[[Dungeons and Dragons|DnD]] - [[Character]]\n" +
  "\n### Description\n\nA non-default #dnd-character.\n" +
  defaultPersonality +
  "\n### Character\n\n\nclass:: Fighter, Barbarian, Wizard\nrace:: Elf\ngender:: ♂\n\n" +
  originalStatblock

// Edited
  
export const newSubheadingString: string = "Test Subheading";
export const newParagraphString: string = "Test Paragraph";

export const kuiniWithAddedSubheading: string =
  "---\nfileClass: DnD Character\ntype: DnD Character\nSource:\ntags: []\n---\n" +
  "\n[[Dungeons and Dragons|DnD]] - [[Character]]\n" +
  "\n### Description\n\nA non-default #dnd-character.\n" +
  defaultPersonality +
  // Added a new subheading
  `\n#### ${newSubheadingString}\n` +
  newParagraphString +
  "\n" +
  // End
  "\n### Character\n\n\nclass:: Fighter, Barbarian, Wizard\nrace:: Elf\ngender:: ♂\n\n" +
  editedStatblock

export const editedParagraphString: string = "Edited Paragraph";
const editedPersonality: string =  
  "\n### Personality\n" +
  `${editedParagraphString}` +
  "\n#### sub Personality\n" +
  "sub test text\n"

export const kuiniWithEditedParagraph: string = 
  "---\nfileClass: DnD Character\ntype: DnD Character\nSource:\ntags: []\n---\n" +
  "\n[[Dungeons and Dragons|DnD]] - [[Character]]\n" +
  "\n### Description\n\nA non-default #dnd-character.\n" +
  editedPersonality +
  // End
  "\n### Character\n\n\nclass:: Fighter, Barbarian, Wizard\nrace:: Elf\ngender:: ♂\n\n" +
  editedStatblock

