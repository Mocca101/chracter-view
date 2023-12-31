<script lang="ts">
  import type Character from "../../classes/character";
  import BaseContainerRect from "../BaseUI/BaseContainerRect.svelte";
  import { Skull, Heart } from "lucide-svelte";
  import colors from "tailwindcss/colors";

  export let character: Character;

  const heartFillColor = colors.teal[600];
</script>

<BaseContainerRect
  class="{$$restProps.class} grid grid-cols-3 gap-1 max-w-[10rem]"
>
  {#each character.deathSaveSuccesses as success}
    <button
      role="switch"
      aria-checked={success}
      on:click={() => (success = !success)}
      class="text-[var(--text-normal)] aria-checked:text-teal-600
        clickable-icon"
    >
      <Heart size={16} fill={success ? heartFillColor : "transparent"} />
    </button>
  {/each}
  {#each character.deathSaveFailures as failure, index}
    <button
      role="checkbox"
      aria-checked={failure}
      on:click={() => (failure = !failure)}
      class="text-[var(--text-normal)] aria-checked:text-rose-700
        clickable-icon"
    >
      <Skull size={16} />
    </button>
  {/each}
</BaseContainerRect>
