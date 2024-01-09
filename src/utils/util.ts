import type { CachedMetadata, SectionCache, TFile } from "obsidian";
import type { BaseCheck } from "../types/check";
import type { Stat } from "../types/stats";
import { App } from "obsidian";
import { HeadingSection, ParagraphSection, YamlSection, type SectionType, type SectionedFile, type TypedSection, CodeSection, ThematicBreakSection } from "./file";
import { parseFile } from "./fileParser";

let app: App;

export function initUtils(_app: App) {
  app = _app;
}

export function getStatForCheck(check:BaseCheck, stats:Stat[]) {
  return stats.find(stat => stat.name === check.stat.name);
}

export function upperFirst(str:string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const compose = <T>(fn1: (a: T) => T, ...fns: Array<(a: T) => T>) =>
fns.reduce((prevFn, nextFn) => value => prevFn(nextFn(value)), fn1);

export async function getContentsUnderHeader(file: TFile, headerText: string) : Promise<string> | null {
  const fileCache = app.metadataCache.getFileCache(file);
  
  const descriptionIndex = indexOfHeader(fileCache, headerText);

  if(descriptionIndex < 0) {
    return null;
  }

  const fileString = await app.vault.cachedRead(file);

  const startPos = fileCache.headings[descriptionIndex].position.end.offset;
  let endPos = fileString.length;

  if(fileCache.headings.length > descriptionIndex) {
    endPos = fileCache.headings[descriptionIndex + 1].position.start.offset;
  }

  return fileString.slice(startPos, endPos);
}

export function indexOfHeader(fileCache: CachedMetadata, headerText: string, inSections = false) {
  let headerIndex = fileCache.headings.findIndex(
    (heading) => heading?.heading?.toLowerCase().indexOf(headerText) >= 0
  );
  if(!inSections || headerIndex < 0) {
    return headerIndex;
  }

  let passedHeaders = 0;
  for (let sectionIndex = 0; sectionIndex < fileCache.sections.length; sectionIndex++) {
    const section = fileCache.sections[sectionIndex];
    
    if(section.type !== 'header') 
      continue;

    if(passedHeaders === headerIndex)
      return sectionIndex;

    passedHeaders++;
  }

  return headerIndex
}

export function statblockFromString(fileString: string): string {
  const startString = '```statblock';
  const endString = '```';
  const statblockStart = fileString.indexOf(startString);
  const statblockEnd = fileString.indexOf(endString , statblockStart + startString.length);

  return fileString.slice(statblockStart + startString.length, statblockEnd);
}

export async function getSectionedFile(file: TFile): Promise<SectionedFile> {
  const fileString = await app.vault.cachedRead(file);

  const parsedFile = parseFile(fileString);
  console.log(parsedFile);
  
  // Read cach after to make sure sections are there
  let fileCache = app.metadataCache.getFileCache(file);
  if(!fileCache) { 
    console.log('fileCache is null');
    return null;
  }

  const sectionedFile: SectionedFile = {
    baseFile: file,
    sections: []
  }
  
  let headingIndex = 0;

  if(!fileCache.sections) {
    console.log('no sections to get');
    return null;
  }

  for (let i = 0; i < fileCache.sections.length; i++) {
    const section = fileCache.sections[i];

    const type: SectionType = section.type as SectionType;

    switch (type) {
      case 'heading':
        const heading = fileCache.headings[headingIndex];
        sectionedFile.sections[i] = new HeadingSection(section, heading.level, heading.heading )
        headingIndex++;
        break;
      case 'paragraph':
        sectionedFile.sections[i] = new ParagraphSection(section, fileString.slice(...sectionStartEndOffset(section)));
        break;
      case 'yaml':
        sectionedFile.sections[i] = new YamlSection(section, fileString.slice(...sectionStartEndOffset(section)));          
        break;
      case 'code':
        sectionedFile.sections[i] = new CodeSection(section, fileString.slice(...sectionStartEndOffset(section)));
        break;
      case 'thematicBreak':
        sectionedFile.sections[i] = new ThematicBreakSection(section, fileString.slice(...sectionStartEndOffset(section)));
        break;
      default:
        console.error('Section type ' + section.type + ' not implemented yet.')
        break;
    } 
  }
  return sectionedFile;
}

function sectionStartEndOffset(sectionCache: SectionCache) {
  return [
    sectionCache.position.start.offset,
    sectionCache.position.end.offset
  ]
}
