import { parseYaml, stringifyYaml, TFile } from "obsidian";
import type { SectionedFile,  } from "../utils/file";
import { zStatblock, type Statblock } from "../types/zod/zodSchemas";
import type Character from "./character";
import mainStore from "../stores/mainStore";
import type ObsidianCharacterView from "../main";
import { firstParagraph, headingByName, type CodeSection, type Section, type YamlSection, type HeadingSection } from "../utils/fileParser";
import type { personalityTrait } from "../types/personality";


const personalityHeadingOptions = {
  title: 'Personality',
  level: 2,
}

export default class CharacterFile implements SectionedFile {
  p: ObsidianCharacterView;

  baseFile: TFile;
  sections: Section[];

  constructor(baseFile: TFile, sections: Section[]) {
    mainStore.plugin.subscribe(plugin => this.p = plugin);
    this.baseFile = baseFile;
    this.sections = sections;
  }

  get frontmatter() : YamlSection | null {
    if(this.sections.length < 1) return null;
    return this.sections.find(section => section.type === 'yaml') as YamlSection | null;;
  }

  get description() : string {
    if(this.sections.length < 1) return '';

    const descriptionHeading = headingByName(this.sections, this.p.settings.descriptionHeading);

    if(!descriptionHeading) return '';

    const descriptionParagraph = firstParagraph(descriptionHeading);

    if(!descriptionParagraph || !descriptionHeading.text) return '';

    return firstParagraph(descriptionHeading).text.trim() ?? '';
  }

  get personalityTraits() {
    const personalityHeading = headingByName(this.sections, personalityHeadingOptions.title);

    if(!personalityHeading) return [];

    const personalityTraits = personalityHeading.subsections.filter(section => section.type === 'heading' && section.level === personalityHeadingOptions.level + 1) as HeadingSection[];

    return personalityTraits.map(trait => {
      const traitParagraph = firstParagraph(trait);

      if(!traitParagraph) return null;

      return {
        name: trait.text.slice(trait.level + 1).trim(),
        text: traitParagraph.text.trim(),
      }
    }).filter(trait => trait !== null) as personalityTrait[];
  }

  get generalPersonality() : string {
    const personalityHeading = headingByName(this.sections, personalityHeadingOptions.title);

    if(!personalityHeading) return '';


    const personalityParagraph =  firstParagraph(personalityHeading);

    if(!personalityParagraph) return '';

    return personalityParagraph.text.trim();
  }

  /**
   * Returns the first statblock found in the file, if it exists.
   */
  get statblock(): Statblock {
    if(!this.statblockSection) return null;

    const statblockAsString = this.statblockSection.text;
    return zStatblock.passthrough().parse(parseYaml(statblockAsString));
  }

  get statblockSection(): CodeSection {
    return this.sections.find(section => section.type === 'code' && section.language === 'statblock') as CodeSection;
  }

  async writeBack(character: Character) {
    const statblockString = this.statblockSection.text;
    const returnStatblock: Statblock = zStatblock.passthrough().parse(parseYaml(statblockString));

    Object.assign(returnStatblock, character.statblock);

    this.p.app.vault.process(this.baseFile, (data) => {
      let fileString = data;

      // Replace the statblock with the new one
      fileString = fileString.replace(statblockString, stringifyYaml(returnStatblock));

      // Replace the description with the new one

      fileString = writeUnderHeading(
        headingByName(this.sections, this.p.settings.descriptionHeading),
        fileString,
        character.description);

      const personalityHeading = headingByName(this.sections, personalityHeadingOptions.title);

      if(!personalityHeading) {
        fileString += `\n\n${'#'.repeat(personalityHeadingOptions.level)} ${personalityHeadingOptions.title}\n\n`;
      } else {
        fileString = writeUnderHeading(personalityHeading, fileString, character.generalPersonality);
      }

      character.personalityTraits.forEach(trait => {
        console.log(trait);

        const traitHeading = headingByName(this.sections, trait.name);

        if(!traitHeading) {
          fileString += `\n\n${'#'.repeat(personalityHeadingOptions.level + 1)} ${trait.name}\n\n ${trait.text}`;
        }
        else {
          fileString = writeUnderHeading(traitHeading, fileString, trait.text);
        }
      });

      return fileString
    })

  }

}

function writeUnderHeading(heading: HeadingSection | undefined, text: string, textToInsert: string) : string {
  if(!heading) return text;

  // Split file into pre & post heading.
  // This is to only replace the text after the heading and not match any previous occurences.
  const parts = text.split(heading.text);
  const preDescription = parts[0];
  let postDescription = parts[1];

  const descriptionParagraph = firstParagraph(heading);

  if(!descriptionParagraph) postDescription = textToInsert + postDescription;
  else postDescription = postDescription.replace(descriptionParagraph.text.trim(), textToInsert.trim());

  return preDescription + heading.text + '\n' + postDescription;
}
