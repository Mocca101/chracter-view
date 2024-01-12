<script lang="ts">
  import BaseContainerRect from "../BaseUI/BaseContainerRect.svelte";
  import { type Personality } from "../../types/personality";

  export let personality: Personality;


</script>
<BaseContainerRect class="flex flex-col gap-1 max-w-full" title="Personality">
  {#each personality.personalityTraits as trait}
    <BaseContainerRect
    class="flex-grow max-w-full py-2"
    title={trait.name}
    >
    <div class="mt-2 mx-2" contenteditable bind:innerText={trait.text}/>
  </BaseContainerRect>
  {/each}
  <div class="m-1" contenteditable bind:innerText={personality.generalPersonality}/>
</BaseContainerRect>
