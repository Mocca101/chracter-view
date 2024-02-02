import "./styles.css";
import { Plugin } from "obsidian";
import mainStore from "./stores/mainStore";
import { CharacterView, VIEW_TYPE_CHARACTER } from "./views/CharacterView";
import { initUtils } from "./utils/util";
import CharacterViewSettings from "./views/CharacterViewSettings";

interface ObsidianCharacterViewSettings {
	characterTag: string;
	characterTemplatePath: string; // full path from vault root, including the .md extension
	descriptionHeading: string;
	personalityHeading: string;
	notesHeading: string;
	debugMode: boolean;
}

const DEFAULT_SETTINGS: ObsidianCharacterViewSettings = {
	characterTag: "#dnd-character",
	characterTemplatePath: "templates/char_template.md",
	descriptionHeading: "Description",
	personalityHeading: "Personality",
	notesHeading: "Notes",
	debugMode: false
};

export default class ObsidianCharacterView extends Plugin {

	settings: ObsidianCharacterViewSettings;

	name:string = "Obsidian Character View";

	diceRollerPlugin;

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async onload() {
		initUtils(this.app);
		await this.loadSettings();

		this.addSettingTab(new CharacterViewSettings(this.app, this));

		// @ts-ignore "plugin" doesn't exist
		this.diceRollerPlugin = this.app.plugins.getPlugin("obsidian-dice-roller");

		mainStore.plugin.set(this);
		this.registerView(VIEW_TYPE_CHARACTER, (leaf) => new CharacterView(leaf));

		this.addRibbonIcon("venetian-mask", "Open Character View", () => {
			this.activateCharacterView();
		});
		

		this.addCommand({
			id: "save-active-character",
			name: "Save Active Character",
			callback: () => {
				const activeView = this.app.workspace.getActiveViewOfType(CharacterView);
				if(activeView) {
					activeView.saveActiveCharacter();
				}
			},
		})


	}

	onunload() {
		console.log("unloading plugin");
	}


	async activateCharacterView() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_CHARACTER);

		await this.app.workspace.getLeaf('tab').setViewState({
			type: VIEW_TYPE_CHARACTER,
			active: true,
		});

		this.app.workspace.revealLeaf(
			this.app.workspace.getLeavesOfType(VIEW_TYPE_CHARACTER)[0],
		);
	}
}
