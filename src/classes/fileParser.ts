// Output Object:
// - statblock 
// - description

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
    const sections = parseSections(fileString);
    console.log(sections);
    const statblock = parseStatblock(sections);
    console.log(statblock);
    const description = parseDescription(sections);
    console.log(description);
    return { statblock, description };
}

type Section = {
    type: 'yaml' | 'code' | 'heading';
    lines: string[];
}

function parseSections(fileString: string) : Section[] {
    const lines = fileString.split('\n');
    const sections: Section[] = [];
    let currentHeading: Section = null;
    let currentBlock: Section = null;
    let inBlock = false;

    for(let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let sectionType = parseLineForSection(line);

        if(sectionType === 'yaml' && i > 0 && currentBlock.type !== 'yaml') sectionType = null;

        if(!sectionType) {
            currentBlock?.lines.push(line);
            currentHeading?.lines.push(line);
            continue;
        }

        if(sectionType === 'heading') {
            currentHeading = { type: 'heading', lines: [line] };
            sections.push(currentHeading);
            continue;
        }

        if(sectionType === 'code') {
            if(currentBlock) {
                currentBlock.lines.push(line);
                currentHeading?.lines.push(line);
                currentBlock = null;
                continue;
            } 
            currentBlock = { type: 'code', lines: [line] };
            sections.push(currentBlock);
            continue;
        }

        if(sectionType === 'yaml') {
            if(currentBlock) {
                currentBlock.lines.push(line);
                currentHeading?.lines.push(line);
                currentBlock = null;
                continue;
            }

            currentBlock = { type: 'yaml', lines: [line] };
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