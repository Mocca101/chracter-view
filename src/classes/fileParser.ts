import { parseYaml } from "obsidian";
import { zStatblock, type Statblock } from "../types/zod/zodSchemas";

// Parsing functionality
// - Generic parser for yaml sections
// - generic parser for code sections
// - generic parser for heading (and content beneath) sections

// In effect:
// - parse the file string for the statblock and create a statblock object
//   - the description should be found by the heading wiht the text in the variable descriptionHeading
//   - the description should be the content below the heading until the next heading of the same level or higher

type ParsedFile = {
    statblock: Statblock;
    description: string;
}

export function parseFile(fileString: string) : ParsedFile {
    console.log('start parsing in fileParser.ts');
    
    const sections = parseSections(fileString);
    console.log('sections', sections);
    const statblock = parseStatblock(sections);
    const description = parseDescription(sections);
    return { statblock, description };
}

type BaseSection = {
    lines: string[];
}

type CodeSection = BaseSection & {
    type: 'code';
    language?: string;
}
type YamlSection = BaseSection & {
    type: 'yaml';
}
type HeadingSection = BaseSection & {
    type: 'heading';
    level: number;
    subsections: Section[];
    parentSection?: HeadingSection;
}

type ParagraphSection = BaseSection & { 
    type: 'paragraph';
}

type Section = CodeSection | YamlSection | HeadingSection | ParagraphSection;

function parseSections(fileString: string) : Section[] {
    const lines = fileString.split('\n');
    let currentHeading: HeadingSection = { type: 'heading', lines: [], level: 0, subsections: [] };
    let currentBlock: Section = currentHeading;
    const sections: Section[] = [currentBlock];

    // TODO: refactor this to be more readable
    // TODO: add blocks & headings to parent headings

    console.log(currentBlock)

    for(let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let sectionType = parseLineForSection(line);


        if(sectionType === 'yaml' && i > 0 && currentBlock?.type !== 'yaml') sectionType = null;

        if(!sectionType) {
            currentBlock?.lines.push(line);
            continue;
        }

        if(sectionType === 'heading') {
            const level = line.match(/^#+/)[0].length;

            const newHeading: HeadingSection = { type: 'heading', lines: [line], level, subsections: [] };

            if(level > currentHeading.level) {
                currentHeading.subsections.push(newHeading);
                newHeading.parentSection = currentHeading;
                currentHeading = newHeading;

                console.log('level < currentHeading.level', currentHeading);
            } 
            // else if(level === currentHeading.level) {
            //     currentHeading.parentSection.subsections.push(newHeading);
            //     newHeading.parentSection = currentHeading.parentSection;
            //     currentHeading = newHeading;            
            // } 
            else {
                while(level < currentHeading.level) {
                    currentHeading = currentHeading.parentSection;
                    console.log('level < currentHeading.level', currentHeading);
                }
                currentHeading.subsections.push(newHeading);
                newHeading.parentSection = currentHeading;
                currentHeading = newHeading;
            }            

            currentBlock = currentHeading;
            sections.push(currentBlock);
            continue;
        }

        if(sectionType === 'code') {
            if(currentBlock.type === 'code') {
                currentBlock.lines.push(line);
                currentBlock = currentHeading;
                continue;
            } 
            currentBlock = { type: 'code', lines: [line] };
            currentHeading.subsections.push(currentBlock);
            sections.push(currentBlock);
            continue;
        }

        if(sectionType === 'yaml') {
            if(currentBlock.type === 'yaml') {
                currentBlock.lines.push(line);
                currentBlock = currentHeading;
                continue;
            }

            currentBlock = { type: 'yaml', lines: [line] };
            currentHeading.subsections.push(currentBlock);
            sections.push(currentBlock);
            continue;
        }
    }
    return sections;
}

function parseLineForSection(line: string) : 'yaml' | 'code' | 'heading' | null {
    if(line.startsWith('---')) return 'yaml';
    if(line.startsWith('```')) return 'code';
    if (/^#+\s/.test(line)) return 'heading';
    return null;
}

function parseStatblock(sections: Section[]) : Statblock {
    const statblockSection = sections.find(section => section.type === 'code' && section.lines[0].startsWith('```statblock'));
    if(!statblockSection) return null;

    const statblockAsString = statblockSection.lines.slice(1, -1).join("\n");
    return zStatblock.passthrough().parse(parseYaml(statblockAsString));
}

const descriptionHeading = 'Description';
function parseDescription(sections: Section[]) : string {
    const descriptionSection = sections.find(section => {
        return section.type === 'heading' && section.lines[0].toLowerCase().includes(descriptionHeading.toLowerCase())
    });
    if(!descriptionSection) return null;

    const description = descriptionSection.lines.slice(1).join('\n');
    return description;
}