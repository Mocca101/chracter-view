import { parseYaml } from "obsidian";
import { zStatblock, type Statblock } from "../types/zod/zodSchemas";


export function parseFile(fileString: string) : Section[] {
    const sections = parseSections(fileString);
    return sections;
}

type BaseSection = {
    text: string;
    editedText?: string;
    new?: boolean;
}

export type CodeSection = BaseSection & {
    type: 'code';
    language?: string;
}
export type YamlSection = BaseSection & {
    type: 'yaml';
}
export type HeadingSection = BaseSection & {
    type: 'heading';
    level: number;
    subsections: Section[];
}
export type ParagraphSection = BaseSection & {
    type: 'paragraph';
}

export type Section = CodeSection | YamlSection | HeadingSection | ParagraphSection;

function readFrontmatter(fileString: string) : { yaml?: YamlSection, rest: string[] } {
    const lines = fileString.split('\n');
    if(!lines[0].startsWith('---')) return { rest: lines };
    let text = '';
    let i = 1;
    for(; i < lines.length; i++) {
        if(lines[i].startsWith('---')) break;
        text += '\n' + lines[i];
    }
    const yaml: YamlSection = { type: 'yaml', text };
    return { yaml, rest: lines.slice(i + 1) };
}

function parseSections(fileString: string) : Section[] {
    let currentHeading: HeadingSection = { type: 'heading', text: '', level: 0, subsections: [] };
    let currentBlock: Section = currentHeading;
    let currentText: string[] = [];
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

        if(sectionType) {
            currentBlock.text = currentText.join('\n');
            currentText = [];
        }

        // Create a paragraph section if its a non-special line (Only if it's under a heading, so e.g. not for codeblocks)
        if(!sectionType && currentBlock.type === 'heading') {
            currentBlock = { type: 'paragraph', text: '' };
            currentHeading.subsections.push(currentBlock);
            sections.push(currentBlock);
        }

        // If it's a heading create a new heading section and append it to the next higher heading
        if(sectionType === 'heading') {
            const level = line.match(/^#+/)[0].length;
            const newHeading: HeadingSection = { type: 'heading', text: line, level, subsections: [] };
            const parentHeading: HeadingSection = sections
                .filter(section => section.type === 'heading')
                .findLast((section: HeadingSection) => section.level < level) as HeadingSection;

            parentHeading?.subsections.push(newHeading);
            currentHeading = newHeading;
            currentBlock = newHeading;
            sections.push(newHeading);
            continue;
        }

        // if we're already in a codeblock and the line starts with ``` we're closing the codeblock
        if(sectionType === 'code' && currentBlock.type === 'code') {
            currentBlock = currentHeading;
            continue;
        }
        // if we're not in a codeblock and the line starts with ``` we're opening a codeblock
        else if(sectionType === 'code') {
            currentBlock = { type: 'code', text: '', language: line.match(/^```(.*)/)[1] };
            currentHeading.subsections.push(currentBlock);
            sections.push(currentBlock);
            continue;
        }

        currentText.push(line);
    }

    if(currentText.length > 0) {
        currentBlock.text = currentText.join('\n');
    }

    return sections;
}

function parseLineForSection(line: string) : 'code' | 'heading' | null {
    if(line.startsWith('```')) return 'code';
    if (/^#+\s/.test(line)) return 'heading';
    return null;
}

function getStatblock(sections: Section[]) : Statblock {
    const statblockSection = sections.find(section => section.type === 'code' && section.language === 'statblock');
    if(!statblockSection) return null;

    const statblockAsString = statblockSection.text.slice(1, -1);
    return zStatblock.passthrough().parse(parseYaml(statblockAsString));
}

export function headingByName(sections: Section[], name: string) : HeadingSection {
    return sections.find(section =>
        section.type === 'heading'
        // Bellow is needed as the first heading is the root and has no text in it's line
        && section.level > 0
        && section?.text?.toLowerCase().includes(name.toLowerCase())
    ) as HeadingSection;
}

export function firstParagraph(heading: HeadingSection) : ParagraphSection | null {
    return heading.subsections.find(section => section.type === 'paragraph') as ParagraphSection;
}

export function allText(sections: Section[]) : string {
    let text = '';    

    const sectionText = (section: Section) => section.editedText ?? section.text;

    for(let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if(i === 0) text += sectionText(section);
        else text += '\n' + sectionText(section);
        if(section.type === 'heading') {
            text += '\n' + allText(section.subsections);
        }
    }
    return text;
}
