import { parseYaml, stringifyYaml, TFile } from "obsidian";
import { zStatblock, type Statblock } from "../types/zod/zodSchemas";
import type Character from "./character";
import mainStore from "../stores/mainStore";
import type ObsidianCharacterView from "../main";
import { firstParagraph, headingByName, allText, setNotNew, setNotEdited } from "../utils/file/fileSections";
import { type CodeSection, type Section, type YamlSection, type HeadingSection, type ParagraphSection } from "../utils/file/fileSections";
import { sectionHasChanged } from "../utils/file/fileSections";


const personalityHeadingOptions = {
  title: 'Personality',
  level: 2,
}

export default class CharacterFile {
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

  get description() : HeadingSection {
    if(this.sections.length < 1) return null;
    return headingByName(this.sections, this.p.settings.descriptionHeading);
  }

  get personality() : HeadingSection {
    if(this.sections.length < 1) return null;
    return headingByName(this.sections, this.p.settings.personalityHeading);
  }

  get notes() : HeadingSection {
    if(this.sections.length < 1) return null;
    return headingByName(this.sections, this.p.settings.notesHeading);
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

  writeBack(character: Character) {
    const statblockString = this.statblockSection.text;
    const returnStatblock: Statblock = zStatblock.passthrough().parse(parseYaml(statblockString));

    Object.assign(returnStatblock, character.statblock);

    this.p.app.vault.process(this.baseFile, (data) => {
      let fileString = data;

      // Replace the statblock with the new one
      fileString = fileString.replace(statblockString, stringifyYaml(returnStatblock));

      if(sectionHasChanged(character.description))fileString = writeBackSection(character.description, ['', fileString]).join(''); 
      if(sectionHasChanged(character.personality)) fileString = writeBackSection(character.personality, ['', fileString]).join('');
      if(sectionHasChanged(character.notes)) fileString = writeBackSection(character.notes, ['', fileString]).join('');

      character.headings.forEach(heading => {
        if(!sectionHasChanged(heading)) return;
        fileString = writeBackSection(heading, ['', fileString]).join('');
      });

      return fileString
    })

  }
}

function appendNewSection(section: Section, text: string) : string {
  if(!section.isNew) return text;

  section.isNew = false;
  console.log('New subsection', section);

  let addedText = section.text + '\n';
  if(section.editedText) addedText = section.editedText + '\n';
  if(section.type === 'heading') {
    addedText += allText(section.subsections);
    setNotNew(section.subsections);
    setNotEdited(section.subsections);
  }

  text += '\n' + addedText + '\n';

  return text;
}


/**
 * Writes back a section to the text file.
 * 
 * @param section - The section to write back.
 * @param splitText - The split text containing the start and end portions.
 * @returns The updated split text after writing back the section.
 */
function writeBackSection(section: Section, splitText: [string,string]) : [string, string] {
  let [textStart, textEnd] = splitText;

  if(section.isNew) {
    if(textStart) return [appendNewSection(section, textStart), textEnd];
    return ['', appendNewSection(section, textEnd)];
  }

  if(!textEnd) console.error(`No text end found for section ${section.text}`);

  let splitTextStart;
  [splitTextStart, textEnd] = splitOnFirst(textEnd, section.text);
  textStart += splitTextStart;
  if(!section.text) textStart += '\n';
  textStart += section.editedText ?? section.text;

  section.editedText = null;
  if(section.type !== 'heading') return [textStart, textEnd];

  for(let i = 0; i < section.subsections.length; i++) {
    const subsection = section.subsections[i];
    [textStart, textEnd] = writeBackSection(subsection, [textStart, textEnd]);
  }

  return [textStart, textEnd];
}


function splitOnFirst (str: string, sep: string) : [string, string]{
  const index = str.indexOf(sep);
  return index < 0 ? [str, null] : [str.slice(0, index), str.slice(index + sep.length)];
}