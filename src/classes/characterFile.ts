import { parseYaml, stringifyYaml, TFile } from "obsidian";
import type { CodeSection, SectionedFile, TypedSection, YamlSection } from "../utils/file";
import { zStatblock, type Statblock } from "../types/zod/zodSchemas";
import type Character from "./character";
import mainStore from "../stores/mainStore";
import type ObsidianCharacterView from "../main";
import { statblockFromString } from "../utils/util";

export default class CharacterFile implements SectionedFile {
  p: ObsidianCharacterView;

  baseFile: TFile;
  sections: TypedSection[];

  constructor(sectionedFile: SectionedFile) {
    mainStore.plugin.subscribe(plugin => this.p = plugin);
    this.baseFile = sectionedFile.baseFile;
    this.sections = sectionedFile.sections;
  }

  get frontmatter() : YamlSection {
    if(this.sections.length < 1) return null;
    if(this.sections[0].type !== 'yaml') return null;

    return this.sections[0].yaml;
  }

  get description() : string {
    if(this.sections.length < 1) {
      return '';
    }
    const descriptionHeading = this.getHeading('Description');
    if(!descriptionHeading) return '';
    return this.getContentBelowSection(descriptionHeading.index, descriptionHeading.section.level).trim();
  }

  getHeading(text: string) {
    for(let i = 0; i < this.sections.length; i++) {
      const section = this.sections[i];
      if(section.type!== 'heading') continue;
      if(section.text.toLowerCase().contains(text.toLowerCase())) return { section, index: i };
    }
    return null;
  }

  getContentBelowSection(sectionIndex: number, stopAtHeadingLevel?: number) : string {
    const content = [''];
    for(let i = sectionIndex + 1; i < this.sections.length; i++) {
      const section = this.sections[i];
      if(section.type!== 'heading') {
        content.push(section.content);
        continue;
      }

      if(stopAtHeadingLevel && section.level <= stopAtHeadingLevel) break;
      content.push(section.content);
    }
    return content.join('\n');
  }

  /**
   * Returns the first statblock found in the file, if it exists.
   */
  get statblock(): Statblock {
    if(!this.statblockSection) return null;

    const statblockAsString = this.statblockSection.lines.slice(1, -1).join("\n");
    return zStatblock.passthrough().parse(parseYaml(statblockAsString));
  }

  get statblockSection(): CodeSection {
    for(let i = 0; i < this.sections.length; i++) {
      const section = this.sections[i];
      if(section.type !== 'code') continue;
      if (section.language !== "statblock") continue;
      return section;
    }
    return null;
  }

  async writeBack(character: Character) {
    const fileString = await this.p.app.vault.read(this.baseFile);
    const statblockString = statblockFromString(fileString);
    const returnStatblock: Statblock = zStatblock.passthrough().parse(parseYaml(statblockString));

    Object.assign(returnStatblock, character.statblock);

    app.vault.process(this.baseFile, (data) => {
      return data.replace(statblockString, '\n' + stringifyYaml(returnStatblock));
    })

  }

}