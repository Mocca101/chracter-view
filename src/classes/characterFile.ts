import { parseYaml, stringifyYaml, TFile } from "obsidian";
import type { SectionedFile,  } from "../utils/file";
import { zStatblock, type Statblock } from "../types/zod/zodSchemas";
import type Character from "./character";
import mainStore from "../stores/mainStore";
import type ObsidianCharacterView from "../main";
import { statblockFromString } from "../utils/util";
import { firstParagraph, headingByName, type CodeSection, type Section, type YamlSection } from "../utils/fileParser";

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

    const descriptionString = 'description'
    const descriptionHeading = headingByName(this.sections, descriptionString)
    
    if(!descriptionHeading) return '';

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
    const fileString = await this.p.app.vault.read(this.baseFile);
    const statblockString = statblockFromString(fileString);
    const returnStatblock: Statblock = zStatblock.passthrough().parse(parseYaml(statblockString));

    Object.assign(returnStatblock, character.statblock);

    this.p.app.vault.process(this.baseFile, (data) => {
      return data.replace(statblockString, '\n' + stringifyYaml(returnStatblock));
    })

  }

}