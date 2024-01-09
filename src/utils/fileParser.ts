import { parseYaml } from "obsidian";
import { zStatblock, type Statblock } from "../types/zod/zodSchemas";
import type { HeadingSection } from "./file";

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
}
type ParagraphSection = BaseSection & { 
    type: 'paragraph';
}

type Section = CodeSection | YamlSection | HeadingSection | ParagraphSection;

function readFrontmatter(fileString: string) : { yaml?: YamlSection, rest: string[] } {
    const lines = fileString.split('\n');
    if(!lines[0].startsWith('---')) return { rest: lines };
    const yamlLines = [lines[0]];
    let i = 1;
    for(; i < lines.length; i++) {
        yamlLines.push(lines[i]);
        if(lines[i].startsWith('---')) break;

    }
    const yaml: YamlSection = { type: 'yaml', lines: yamlLines };
    return { yaml, rest: lines.slice(i + 1) };
}

function parseSections(fileString: string) : Section[] {
    let currentHeading: HeadingSection = { type: 'heading', lines: [], level: 0, subsections: [] };
    let currentBlock: Section = currentHeading;
    const sections: Section[] = [currentBlock];

    const { yaml, rest } = readFrontmatter(fileString);
    if(yaml) {
        sections.push(yaml);
        currentHeading.subsections.push(yaml);
    }
    const lines = rest;

    for(let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let sectionType = parseLineForSection(line);

        // Create a paragraph section if its a non-special line (Only if it's under a heading, so e.g. not for codeblocks)
        if(!sectionType && currentBlock.type === 'heading') {
            currentBlock = { type: 'paragraph', lines: [] };
            currentHeading.subsections.push(currentBlock);
            sections.push(currentBlock);
        }

        // If it's a heading create a new heading section and append it to the next higher heading
        if(sectionType === 'heading') {
            const level = line.match(/^#+/)[0].length;
            const newHeading: HeadingSection = { type: 'heading', lines: [], level, subsections: [] }; 
            const parentHeading: HeadingSection = sections
                .filter(section => section.type === 'heading')
                .findLast((section: HeadingSection) => section.level < level) as HeadingSection;


            parentHeading?.subsections.push(newHeading);
            currentHeading = newHeading;
            currentBlock = newHeading;
            sections.push(newHeading);
        }

        // if we're already in a codeblock and the line starts with ``` we're closing the codeblock
        if(sectionType === 'code' && currentBlock.type === 'code') {
            currentBlock.lines.push(line);
            currentBlock = currentHeading;
            continue;
        } 
        // if we're not in a codeblock and the line starts with ``` we're opening a codeblock
        else if(sectionType === 'code') {
            currentBlock = { type: 'code', lines: [], language: line.match(/^```(.*)/)[1] };
            currentHeading.subsections.push(currentBlock);
            sections.push(currentBlock);
        }

        currentBlock.lines.push(line);
    }
    return sections;
}

function parseLineForSection(line: string) : 'code' | 'heading' | null {
    if(line.startsWith('```')) return 'code';
    if (/^#+\s/.test(line)) return 'heading';
    return null;
}

function parseStatblock(sections: Section[]) : Statblock {
    const statblockSection = sections.find(section => section.type === 'code' && section.language === 'statblock');
    if(!statblockSection) return null;

    const statblockAsString = statblockSection.lines.slice(1, -1).join("\n");
    return zStatblock.passthrough().parse(parseYaml(statblockAsString));
}

const descriptionHeading = 'Description';
function parseDescription(sections: Section[]) : string {
    const descriptionSection = sections.find(section => {
        return section.type === 'heading' && section.level > 0 && section.lines[0].toLowerCase().includes(descriptionHeading.toLowerCase())
    }) as HeadingSection;
    if(!descriptionSection) return null;

    const pargraphs = descriptionSection.subsections.filter(section => section.type === 'paragraph');

    if(!pargraphs || pargraphs.length === 0) return '';

    const description = pargraphs[0].lines.join('\n').trim();
    return description;
}