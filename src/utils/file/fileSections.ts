type BaseSection = {
    text: string;
    editedText?: string;
    isNew?: boolean;
};

export type CodeSection = BaseSection & {
    type: 'code';
    language?: string;
};
export type YamlSection = BaseSection & {
    type: 'yaml';
};
export type HeadingSection = BaseSection & {
    type: 'heading';
    level: number;
    subsections: Section[];
};
export type ParagraphSection = BaseSection & {
    type: 'paragraph';
};

export type Section = CodeSection | YamlSection | HeadingSection | ParagraphSection;


export function createHeading(level: number, text?: string, paragraphText?: string, newSubsections?: Section[]): HeadingSection {
    const heading: HeadingSection = {
        isNew: true,
        type: 'heading',
        text: '#'.repeat(level) + " " + (text || 'New Heading'),
        level,
        subsections: [createParagraph(paragraphText), ...(newSubsections || [])],
    };
    return heading;
}

export function createParagraph(text?: string): ParagraphSection {
    return {
        isNew: true,
        type: 'paragraph',
        text: text || 'new paragraph',
    }
}

export function sectionHasChanged(section: Section): boolean {
    const baseCheck = !(!section.editedText) || (section.isNew);
    
    if(baseCheck) return true;
    else if (section.type !== 'heading') return false;
    
    const heading = section as HeadingSection;
    return heading.subsections.some(sectionHasChanged);
}export function headingByName(sections: Section[], name: string): HeadingSection {
    return sections.find(section => section.type === 'heading'
        // Bellow is needed as the first heading is the root and has no text in it's line
        && section.level > 0
        && section?.text?.toLowerCase().includes(name.toLowerCase())
    ) as HeadingSection;
}

export function firstParagraph(heading: HeadingSection): ParagraphSection | null {
    return heading.subsections.find(section => section.type === 'paragraph') as ParagraphSection;
}

export function allText(sections: Section[]): string {
    let text = '';

    const sectionText = (section: Section) => section.editedText ?? section.text;

    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (i === 0) text += sectionText(section);
        else text += '\n' + sectionText(section);
        if (section.type === 'heading') {
            text += '\n' + allText(section.subsections);
        }
    }
    return text;
}

