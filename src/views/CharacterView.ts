import { ItemView, TFile, WorkspaceLeaf, debounce } from "obsidian";
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

	debouncedUpdateFromCharacter = debounce((file: TFile) => this.component.fileUpdated(file), 2000, true);

	private async onFileModified(file: TFile): Promise<void> {
		console.log("File modified", file.path);

		// TODO: Limit how often the view updates on file change, to avoid lag
		// Get activeCharacter from component

		if (file === this.component.$$.props.activeCharacter) {
			this.debouncedUpdateFromCharacter(file);
		}
			
  	}
}
