import { PluginSettingTab, Setting, debounce, getAllTags } from "obsidian";
import type ObsidianCharacterView from "../main";
import { SuggestionDropdown } from "../components/BaseUI/Suggests/SuggestDropdown";

export default class CharacterViewSettings extends PluginSettingTab {

    plugin: ObsidianCharacterView;

    constructor(app: any, plugin: ObsidianCharacterView) {
        super(app, plugin);
        this.plugin = plugin;
    }
    
    display() {
        const { containerEl } = this;

        containerEl.empty();        

        const sectionParent = containerEl.createDiv();

        sectionParent.createEl("h2", {text: "Character View Settings"});

        this.setupDescriptionHeadingSetting(sectionParent);

        this.setupTemplatePathSetting(sectionParent);

        this.setupCharTagSetting(sectionParent);

        this.setupDebugModeSetting(sectionParent);
    }

    private setupDebugModeSetting(sectionParent: HTMLDivElement) {
        const debugToggle = new Setting(sectionParent);
        debugToggle.setName("Debug Mode");
        debugToggle.setDesc("Toggle Debug Mode");
        debugToggle.addToggle(toggle => {
            toggle.setValue(this.plugin.settings.debugMode);
            toggle.onChange(async (value) => {
                this.plugin.settings.debugMode = value;
                await this.plugin.saveSettings();
            });
        });
    }

    setupDescriptionHeadingSetting(container: HTMLElement) {
        const settingDescrText = new Setting(container)
        
        settingDescrText.setName("Heading of Description");
        settingDescrText.setDesc("The text of the heading of the description in the Character file.");
        settingDescrText.addText(text => {
            text.setPlaceholder("Description");
            text.setValue(this.plugin.settings.descriptionHeading);
            text.onChange(async (value) => {
                this.plugin.settings.descriptionHeading = value;
                await this.plugin.saveSettings();
            });
        });
    }

    debouncedSetMarkdownFiles = debounce(() => {
        this.markdownFilePaths = this.app.vault.getMarkdownFiles().map(file => file.path);
    }, 1000);

    markdownFilePaths: string[] = [];

    setupTemplatePathSetting(container: HTMLElement) {
        const settingTemplatePath = new Setting(container)
        
        settingTemplatePath.setName("Template Path");
        settingTemplatePath.setDesc("The path to the template file.");
        settingTemplatePath.addText(text => {
            text.setPlaceholder("Template Path");
            text.setValue(this.plugin.settings.characterTemplatePath);
            text.onChange(async (value) => {
                this.plugin.settings.characterTemplatePath = value;
                await this.plugin.saveSettings();
            });

            new SuggestionDropdown(
                text.inputEl, 
                () => {
                    this.debouncedSetMarkdownFiles();
                    return this.markdownFilePaths;
                 }, 
                async (submission) => {
                    text.setValue(submission);
                    this.plugin.settings.characterTemplatePath = submission;
                    await this.plugin.saveSettings();
                }
            );
        });
    }

    debouncedSetAvailableTags = debounce(() => {
        this.availableTags = 
            // @ts-ignore - getTags() is not in the typings, it is unofficial and might break
            Object.keys(this.app.metadataCache.getTags())
    }, 1000);

    availableTags: string[] = [];

    setupCharTagSetting(container: HTMLElement) {
        const settingCharTag = new Setting(container)
        
        settingCharTag.setName("Character Tag");
        settingCharTag.setDesc("The tag that identifies a character file.");
        settingCharTag.addText(text => {
            text.setPlaceholder("Character Tag");
            text.setValue(this.plugin.settings.characterTag);
            text.onChange(async (value) => {
                this.plugin.settings.characterTag = value;
                await this.plugin.saveSettings();
            });
            text.inputEl.onClickEvent(() => this.debouncedSetAvailableTags())

            new SuggestionDropdown(
                text.inputEl, 
                () => {
                    this.debouncedSetAvailableTags();
                    return this.availableTags;
                 }, 
                async (submission) => {
                    text.setValue(submission);
                    this.plugin.settings.characterTag = submission;
                    await this.plugin.saveSettings();
                }
            );
        });
    }
    


}