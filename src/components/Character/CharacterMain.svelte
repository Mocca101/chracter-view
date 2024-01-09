<script lang="ts">
  import EntityView from "./EntityView.svelte";
  import SkillComponent from "./Skill.svelte";
  import AbilitySaveDcs from "./AbilitySaveDCs.svelte";
  import BaseContainerRect from "../BaseUI/BaseContainerRect.svelte";
  import TextNumberInput from "../BaseUI/TextNumberInput.svelte";
  import DeathSaves from "./DeathSaves.svelte";
  import Resistances from "./Resistances.svelte";
  import TempArmorSelect from "../Items/TempArmorSelect.svelte";
  import PersonalityUI from "./PersonalityUI.svelte";
  import SensesUI from "./SensesUI.svelte";
  import ProficienciesUi from "./ProficienciesUI.svelte";
  import { Notice, stringifyYaml, TFile } from "obsidian";
  import CharacterSelect from "./CharacterSelect.svelte";
  import CharacterFile from "../../classes/characterFile";
  import Character from "../../classes/character";
  import mainStore from "../../stores/mainStore";
  import type ObsidianCharacterView from "../../main";
  import { FilePlus, SaveIcon } from "lucide-svelte";
  import { parseFile } from "../../utils/fileParser";

  let p: ObsidianCharacterView;
  mainStore.plugin.subscribe((plugin) => (p = plugin));

  let char = new Character();

  let activeCharacter: TFile = null;

  let sectionedCharacterFile: CharacterFile = null;

  $: if (activeCharacter !== undefined) {
    updateFromCharacter();
  }

  export async function fileUpdated(updatedFile: TFile) {
    if (updatedFile !== activeCharacter) return;
    updateFromCharacter();
  }

  async function updateFromCharacter() {
    console.log(`Update Character ${activeCharacter?.basename}`);
    char = new Character();

    if (!activeCharacter) {
      sectionedCharacterFile = null;
      return;
    }

    if (activeCharacter?.basename) {
      char.name = activeCharacter.basename;
    }
    
    const fileString = await p.app.vault.cachedRead(activeCharacter);

    const parsedFile = parseFile(fileString);

    sectionedCharacterFile = new CharacterFile(activeCharacter, parsedFile);

    if (sectionedCharacterFile.description) {
      char.description = sectionedCharacterFile.description;
    }

    assignFromStatblock(sectionedCharacterFile);
  }

  function assignFromStatblock(charcterfile: CharacterFile) {
    const statblock = charcterfile.statblock;

    if (!statblock) return;
    char.statblock = statblock;
  }

  const onIndexed = p.registerEvent(
    p.app.metadataCache.on("changed", (file: TFile) => {
      if (file.path === activeCharacter.path) {
        updateFromCharacter();
      }
    })
  );

  async function saveToNewFile() {
    let newPath = char.name + ".md";
    let content = "";

    const templateFile = app.vault.getAbstractFileByPath(
      p.settings.characterTemplatePath
    );
    if (templateFile && templateFile instanceof TFile) {
      content = await app.vault.read(templateFile);
    }

    content = content.replace(
      "{{stats}}",
      "\n```statblock\n" + stringifyYaml(char.statblock) + "```\n"
    );

    if (await app.vault.adapter.exists(newPath)) {
      new Notice(
        "File '" +
          newPath +
          "' already exists. Consider changing the characters name."
      );
      return;
    }

    activeCharacter = await p.app.vault.create(newPath, content);
  }

  export function saveChanges() {
    if (!sectionedCharacterFile) return;
    sectionedCharacterFile.writeBack(char);
  }
</script>

<div class="w-6/12 mx-auto">
  <div class="p-1 mb-2 rounded outline outline-1">
    <CharacterSelect
      bind:activeCharacter
      on:character-reload={updateFromCharacter}
    />

    <span class="inline-block h-4 mx-1 outline outline-1"></span>

    <span>
      {#if sectionedCharacterFile}
        <button
          class="inline-block clickable-icon"
          on:click={saveChanges}
          title="Save Changes"
        >
          <SaveIcon size="14" />
        </button>
      {/if}
      <button
        class="inline-block clickable-icon"
        on:click={saveToNewFile}
        title="Save as New File"
      >
        <FilePlus size="14" />
      </button>
    </span>
  </div>

  <EntityView bind:entity={char} />

  <div class="flex gap-4">
    <div class="flex flex-col gap-1 text-center">
      {#each char.skillProficiencies as skill, i}
        <SkillComponent
          bind:check={skill}
          bind:proficiencyBonus={char.proficiencyBonus}
        />
      {/each}
    </div>

    <div>
      <ProficienciesUi bind:proficiencies={char} />
      <SensesUI character={char} />

      <AbilitySaveDcs bind:character={char} class="mb-1" />
      <BaseContainerRect class="flex gap-1 mb-1">
        <span>
          Inspiration: <TextNumberInput
            bind:value={char.inspiration}
            showButtons={true}
            min={0}
          />
        </span>
      </BaseContainerRect>
      <DeathSaves class="mb-1" bind:character={char} />

      <Resistances bind:resistances={char.resistances} />

      <PersonalityUI personality={char} />
    </div>
  </div>

  {#if p.settings.debugMode}
    <!-- TODO: Implement selection via tag -->
    <TempArmorSelect bind:selectedArmor={char.armor} />
    <!-- Print entity on button click -->
    <button on:click={() => console.log(char)}>Print Entity</button>
  {/if}
</div>

<style>
  :global(body) {
    font-family: var(--o-font-general, var(--font-text));
  }
</style>
