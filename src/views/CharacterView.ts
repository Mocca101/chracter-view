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

	// TODO: Move the debounce to the component and call the components debounced function from here.
	// TODO: In the component we can check if it's curretnly doing the debounce and display a loading symbol somewhere to show it's working/watching for changes.
	debouncedUpdateFromCharacter = debounce((file: TFile) => this.component.fileUpdated(file), 2500);

	private async onFileModified(file: TFile): Promise<void> {
		// Get the index of the prop in the context via $$.props.[propName]
		// Get the actual value from the context via $$.ctx.[propIndex]

		const activeCharacter = this.component.$$.ctx[this.component.$$.props.activeCharacter]

		if (file.path === activeCharacter?.path) {
			this.debouncedUpdateFromCharacter(file);
		}

	}
}
