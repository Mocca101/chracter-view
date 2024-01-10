import { Notice, type TFile } from "obsidian";
import mainStore from "../stores/mainStore";
import type ObsidianCharacterView from "../main";

let p: ObsidianCharacterView;
mainStore.plugin.subscribe((plugin) => (p = plugin));
/***
 * Example: 
 *   on:mouseenter={(e) => {
      linkHover(e.target, e.target, 'Name', someFile);
    }}
 */
export function linkHover(source: EventTarget, target: EventTarget, displayName: string, file?: TFile) {
    p.app.workspace.trigger(
      "link-hover", // Event
      source, // Source
      target, // Target
      displayName, // Display Name
      file?.path
    );
}

export async function linkClick(name: string, file?: TFile) {
    if(!file) {
        new Notice('Note Creation not suppported yet.');
        return;
    }

    const leaf = p.app.workspace.getLeaf(true);
    await leaf.openFile(file, { active : true });
}