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

  get personality() : HeadingSection | null | undefined {
    if(this.sections.length < 1) return null;

    return headingByName(this.sections, personalityHeadingOptions.title);
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

      // fileString = writeUnderHeading(
      //   headingByName(this.sections, this.p.settings.descriptionHeading),
      //   fileString,
      //   character.description);

      // const personalityHeading = headingByName(this.sections, personalityHeadingOptions.title);

      // if(!personalityHeading) {
      //   fileString += `\n\n${'#'.repeat(personalityHeadingOptions.level)} ${personalityHeadingOptions.title}\n\n`;
      // } else {
      //   fileString = writeUnderHeading(personalityHeading, fileString, character.generalPersonality);
      // }

      // character.personalityTraits.forEach(trait => {
      //   console.log(trait);

      //   const traitHeading = headingByName(this.sections, trait.name);

      //   if(!traitHeading) {
      //     fileString += `\n\n${'#'.repeat(personalityHeadingOptions.level + 1)} ${trait.name}\n\n ${trait.text}`;
      //   }
      //   else {
      //     fileString = writeUnderHeading(traitHeading, fileString, trait.text);
      //   }
      // });


      // TODO: Make sure the edited part of the headings gets the text assigned.
      //  Idea: make a class of the heading section so that it can be editied with svelte 
      //  Idea: rewrite the component to somehow 'manually' update the properties of the heading section

      character.headings.forEach(heading => {
        fileString = writeHeadingSectionBack(heading, fileString);
      });

      return fileString
    })

  }
}


/***
 * 
 * Assumes:
 *  - That a headings title is the same in both the original and edited version
 *  - That non-heading sections stay in the same order for each heading
 *  - Structure of the file/heading object to be: 
 *  {
 *    heading: {
 *      text: string,
 *      subsections: [
 *      non-heading-sections,
 *      .
 *      .
 *      .
 *      heading-sections,
 *      ]
 *      -> Headings are at the end of the subsections array.
 *   },
 *  }
 */
function writeHeadingSectionBack(heading: {
    original: HeadingSection
    edited: HeadingSection 
  }, 
  originalText: string) :string {

  // Split string in pre & post heading
  let [preHeading, postHeading] = originalText.split(heading.original.text);

  preHeading += heading.original.text;

  
  for(let i = 0; i < heading.edited.subsections.length; i++) {

    if(i > heading.original.subsections.length){ console.log('extra Sections'); break; }

    const editedSubsection = heading.edited.subsections[i];

    if(editedSubsection.type !== 'heading') {
      const originalSubsection = heading.original.subsections[i];

      if(!originalSubsection) { console.log('subsecition not present in original'); break; }

      postHeading = postHeading.replace(originalSubsection.text.trim(), editedSubsection.text.trim() + 'edited');
      continue;
    }

    const editedHeading = editedSubsection as HeadingSection;
    console.log(editedHeading.text);
    const originalHeading = headingByName(heading.original.subsections, editedHeading.text);

    if(!originalHeading) { console.log('heading not present in original'); break; }

    postHeading = writeHeadingSectionBack({ original: originalHeading, edited: editedHeading }, postHeading);

  }

  const newText = preHeading + postHeading;

  // console.log(newText);

  return newText;
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
