<script lang="ts">
  import type HitPoints from "../../types/hitPoints";
  import BaseContainerRound from "../BaseUI/BaseContainerRound.svelte";
  import TextNumberInput from "../BaseUI/TextNumberInput.svelte";
  import Tooltip from "../BaseUI/Tooltip.svelte";

  export let hitPoints: HitPoints;
</script>

<BaseContainerRound widthClass="w-32">
  <div class="flex flex-row items-center m-0">
    <TextNumberInput
      bind:value={hitPoints.current}
      bind:max={hitPoints.max}
      width={"4rem"}
    />/
    <TextNumberInput bind:value={hitPoints.max} width={"4rem"} />
  </div>
  <p class="my-0">Hit Points</p>
  <TextNumberInput
    class="text-opacity-50 "
    bind:value={hitPoints.temporary}
    min={0}
    title="Temporary Hit Points"
  />
</BaseContainerRound>
