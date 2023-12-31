import { parseYaml, type Pos, type SectionCache, type TFile } from "obsidian";

export type ContentSection = SectionCache & {
    content : string;
}

export type SectionedFile = {
    baseFile: TFile;
    sections: TypedSection[];
}

export class HeadingSection implements ContentSection {
    id?: string;
    position: Pos;
    type: 'heading';
    level: number;
    text: string;

    constructor(metadata: SectionCache, level: number, text: string) {        
        Object.assign(this, metadata);
        this.level = level;
        this.text = text
    }

    get content() {
        return `${'#'.repeat(this.level)} ${this.text}`;
    }
}

export class YamlSection implements ContentSection {
    id?: string;
    position: Pos;
    content: string;
    type: 'yaml';

    constructor(metadata: SectionCache, content: string) {        
        Object.assign(this, metadata);
        this.content = content;
    }

    get yaml() {
        return parseYaml(this.content.slice(3, this.content.length - 3));
    }
}

export class ParagraphSection implements ContentSection {
    id?: string;
    position: Pos;
    content: string;
    type: 'paragraph';

    constructor(metadata: SectionCache, content: string) {        
        Object.assign(this, metadata);
        this.content = content;
    }

    get text() {
        return this.content;
    }
}

export class CodeSection implements ContentSection {
    id?: string;
    position: Pos;
    content: string;
    type: 'code';
    lines: string[];

    constructor(metadata: SectionCache, content: string) {        
        Object.assign(this, metadata);
        this.content = content;
        this.lines = this.content.split('\n');
    }

    get language() {
        return this.lines?.[0]?.replace(/[`\s]/g, '')
    }

}

export class ThematicBreakSection implements ContentSection {
    id?: string;
    position: Pos;
    content: string;
    type: 'thematicBreak';

    constructor(metadata: SectionCache, content: string) {        
        Object.assign(this, metadata);
        this.content = content;
    }
}

export type TypedSection = HeadingSection | YamlSection | ParagraphSection | CodeSection | ThematicBreakSection;
export type SectionType = TypedSection['type'];
