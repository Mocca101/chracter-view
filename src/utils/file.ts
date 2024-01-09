import { parseYaml, type Pos, type SectionCache, type TFile } from "obsidian";


export type SectionedFile = {
    baseFile: TFile;
    sections: TypedSection[];
}
