import { parseYaml, stringifyYaml, TFile } from "obsidian";
import type { SectionedFile,  } from "../utils/file";
import { zStatblock, type Statblock } from "../types/zod/zodSchemas";
import type Character from "./character";
import mainStore from "../stores/mainStore";
import type ObsidianCharacterView from "../main";
import { firstParagraph, headingByName, type CodeSection, type Section, type YamlSection, type HeadingSection } from "../utils/fileParser";

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

      return fileString
    })

  }

}

function writeUnderHeading(heading: HeadingSection | undefined, fileString: string, newText: string) : string { 
  if(!heading) return fileString;  

  // Split file into pre & post heading.
  // This is to only replace the text after the heading and not match any previous occurences.
  const parts = fileString.split(heading.text);
  const preDescription = parts[0];
  let postDescription = parts[1];

  const descriptionParagraph = firstParagraph(heading);

  if(!descriptionParagraph) postDescription = '\n' + newText + postDescription;
  else postDescription = postDescription.replace(descriptionParagraph.text.trim(), newText.trim());
  
  return preDescription + heading.text + postDescription;
}