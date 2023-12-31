<script lang="ts">
  import BaseContainerRect from "../BaseUI/BaseContainerRect.svelte";
  import { type Personality, personalityTraitKeys } from "../../types/personality";
  import ArrayTextField from "../BaseUI/ArrayTextField.svelte";

  export let personality: Personality;

</script>
<BaseContainerRect class="flex flex-col gap-1 max-w-full">
{#each personalityTraitKeys as key}
  <BaseContainerRect
    class="flex-grow max-w-full py-1"
    title={key}
  >
    <ArrayTextField textArray={personality[key]}/>
  </BaseContainerRect>
{/each}
</BaseContainerRect>
