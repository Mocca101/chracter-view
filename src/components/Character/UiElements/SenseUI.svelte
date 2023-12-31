<script lang="ts">
  import BaseContainerRect from "../../BaseUI/BaseContainerRect.svelte";
  import BaseContainerRound from "../../BaseUI/BaseContainerRound.svelte";

  export let statValue: number = 0;
  export let senseText: string = "Passive Sense";
</script>

<div class="flex gap-0 items-center min-h-8">
  <BaseContainerRound class="w-8 h-8 min-w-fit">
    <span class="text-center">{statValue}</span>
  </BaseContainerRound>
  <BaseContainerRect class="flex-grow max-w-full min-h-8">
    <span class="text-center">{senseText}</span>
  </BaseContainerRect>
</div>
