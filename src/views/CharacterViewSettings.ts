import { PluginSettingTab, Setting, debounce } from "obsidian";
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
    


}