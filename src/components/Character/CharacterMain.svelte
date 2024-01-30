<script lang="ts">
  import EntityView from "./EntityView.svelte";
  import SkillComponent from "./Skill.svelte";
  import AbilitySaveDcs from "./AbilitySaveDCs.svelte";
  import BaseContainerRect from "../BaseUI/BaseContainerRect.svelte";
  import TextNumberInput from "../BaseUI/TextNumberInput.svelte";
  import DeathSaves from "./DeathSaves.svelte";
  import Resistances from "./Resistances.svelte";
  import TempArmorSelect from "../Items/TempArmorSelect.svelte";
  import SensesUI from "./SensesUI.svelte";
  import ProficienciesUi from "./ProficienciesUI.svelte";
  import { debounce, Notice, stringifyYaml, TFile } from "obsidian";
  import CharacterSelect from "./CharacterSelect.svelte";
  import CharacterFile from "../../classes/characterFile";
  import Character from "../../classes/character";
  import mainStore from "../../stores/mainStore";
  import type ObsidianCharacterView from "../../main";
  import { FilePlus, SaveIcon } from "lucide-svelte";
  import { parseFile } from "../../utils/file/fileParser";
  import CollapsibleHeading from "../BaseUI/Sections/CollapsibleHeading.svelte";
  import PlainHeading from "../BaseUI/Sections/PlainHeading.svelte";
  import { allText } from "../../utils/file/fileSections";

  let p: ObsidianCharacterView;
  mainStore.plugin.subscribe((plugin) => (p = plugin));

  let char = new Character();

  export let activeCharacter: TFile = null;

  let sectionedCharacterFile: CharacterFile = null;

  $: if (activeCharacter !== undefined) {
    updateFromCharacter();
  }

  let fileWasUpdated = false;

  const debouncedFileUpdate = debounce(
    (file: TFile) => {
      if (file !== activeCharacter) return;
      updateFromCharacter();
    },
    2500
  )


  export function fileUpdated(updatedFile: TFile) {
    fileWasUpdated = true;
    debouncedFileUpdate(updatedFile);
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

    char.headings = [...char.headings]
    const personality = sectionedCharacterFile.personality;
    if(personality) char.personality = sectionedCharacterFile.personality;

    fileWasUpdated = false;
  }

  function assignFromStatblock(charcterfile: CharacterFile) {
    const statblock = charcterfile.statblock;

    if (!statblock) return;
    char.statblock = statblock;
  }

  async function saveToNewFile() {
    let newPath = char.name + ".md";
    let content =
      `${char.name} ${p.settings.characterTag}\n\n` +
      "### Description\n\n" +
      "{{description}}}\n\n" +
      "### Stats \n\n" +
      "{{stats}}";

    const templateFile = p.app.vault.getAbstractFileByPath(
      p.settings.characterTemplatePath
    );
    if (templateFile && templateFile instanceof TFile) {
      content = await p.app.vault.read(templateFile);
    } else {
      new Notice(
        "Could not find template file. If you want to customize what the created file looks like set it in the plugins settings."
        )
    }


    content = content.replace(
      "{{stats}}",
      "\n```statblock\n" + stringifyYaml(char.statblock) + "```\n"
    );

    content = content.replace("{{description}}", allText([char.description]));

    if (await p.app.vault.adapter.exists(newPath)) {
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
{#if fileWasUpdated}    
<div role="status" class="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
  <svg aria-hidden="true" class="w-8 h-8 text-transparent animate-spin fill-[var(--text-normal)]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
  <span class="sr-only">Loading...</span>
</div>
{/if}
<div class="w-6/12 mx-auto{fileWasUpdated ? ' opacity-25 pointer-events-none' : ''}">

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

  {#if char.headings && char.headings.length > 0}
    {#each char.headings as heading, i}
      <PlainHeading bind:heading={heading} />
      <!-- <CollapsibleHeading bind:heading={heading} /> -->
      <button on:click={() => console.log(heading)}>Print Heading</button>
    {/each}
  {/if}
  <button on:click={() => console.log(char)}>Print Entity</button>

  <EntityView bind:entity={char} />

  <div class="flex gap-4">
    <div class="flex flex-col gap-1 text-center">
      {#each char.skillProficiencies as skill, i}
        <SkillComponent
          modifierCalculation={char.modifierCalculation}
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

      
      <PlainHeading bind:heading={char.personality} />
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
