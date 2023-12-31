import { FuzzySuggestModal, type TFile } from "obsidian"

export class FuzzyFileModal extends FuzzySuggestModal<TFile>
{
    onSelection: (result: TFile) => void

    getItems(): TFile[]
    {
        const files = this.app.vault.getMarkdownFiles()
        return files;
    }
    getItemText(item: TFile): string
    {
        return item.basename;
    }
    onChooseItem(item: TFile, evt: MouseEvent | KeyboardEvent): void
    {
        this.onSelection(item);
    }
}