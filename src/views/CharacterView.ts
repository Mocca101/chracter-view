import { ItemView, TFile, WorkspaceLeaf } from "obsidian";
import CharacterMainSvelte from "../components/Character/CharacterMain.svelte";
import mainStore from "../stores/mainStore";
import type ObsidianCharacterView from "../main";

export const VIEW_TYPE_CHARACTER = "character-view";

export class CharacterView extends ItemView {
	p: ObsidianCharacterView;

	component: CharacterMainSvelte;

	saveActiveCharacter() {
		this.component.saveChanges();
	}

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);

		this.onFileModified = this.onFileModified.bind(this);
		
    this.registerEvent(this.app.vault.on("modify", this.onFileModified));
	}

	getViewType() {
		return VIEW_TYPE_CHARACTER;
	}

	getDisplayText() {
		return "Character View";
	}

	getIcon(): string {
		return "venetian-mask"
	}

  	async onOpen() {
		mainStore.plugin.subscribe((plugin) => (this.p = plugin));
		this.p.diceRollerPlugin = this.p.app.plugins.getPlugin("obsidian-dice-roller");
		this.component = new CharacterMainSvelte({
			target: this.contentEl,
		});

	}

	async onClose() {
		this.component.$destroy();
	}

	private async onFileModified(file: TFile): Promise<void> {
		this.component.fileUpdated(file);
  }
}
