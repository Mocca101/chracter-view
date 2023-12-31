<script lang="ts">
  import type ObsidianCharacterView from "../../main";
  import mainStore from "../../stores/mainStore";
  import { TFile } from "obsidian";
  import { linkClick, linkHover } from "../../utils/internalLinks";
  import { FuzzyFileModal } from "../BaseUI/Suggests/FuzzyFileModal";
  import { createEventDispatcher, onMount } from "svelte";
  import { FolderOpen, X } from "lucide-svelte";

  let p: ObsidianCharacterView;
  mainStore.plugin.subscribe((plugin) => (p = plugin));
  const charTag = () => p.settings.characterTag.replace("#", "");

  export let activeCharacter: TFile = null;

  const characterSelectModal = new FuzzyFileModal(app);
  characterSelectModal.getItems = () =>
    p.app.vault.getMarkdownFiles().filter((file) => {
      const fileCache = app.metadataCache.getFileCache(file);

      if (
        fileCache.frontmatter?.tags
          ?.map((t) => t.replace("#", ""))
          .includes(charTag())
      )
        return true;

      return fileCache.tags
        ?.map((tagC) => tagC.tag.replace("#", ""))
        .contains(charTag());
    });

  onMount(() => {
    characterSelectModal.onSelection = (file: TFile) => {
      activeCharacter = file;
    };
  });
</script>

{#if activeCharacter}
  Linked to:
  <a
    on:mouseenter={(e) =>
      linkHover(e.target, e.target, activeCharacter.name, activeCharacter)}
    on:click={() => linkClick(activeCharacter.basename, activeCharacter)}
    class="internal-link"
    href={activeCharacter.path}
  >
    {activeCharacter.basename}
  </a>
  <button
    class="inline-block clickable-icon"
    on:click={() => characterSelectModal.open()}
    aria-label="Change Character"
  >
    <FolderOpen size={14} />
  </button>
  <button
    class="inline-block clickable-icon"
    on:click={() => (activeCharacter = null)}
    aria-label="Clear Character"
  >
    <X size={14} />
  </button>
{:else}
  <button on:click={() => characterSelectModal.open()}>Select Character</button>
{/if}
