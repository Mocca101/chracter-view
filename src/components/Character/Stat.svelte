<script lang="ts">
  import TextNumberInput from "../BaseUI/TextNumberInput.svelte";
  import BaseContainerRound from "../BaseUI/BaseContainerRound.svelte";
  import type { Stat } from "../../types/stats";
  import ModifierField from "../BaseUI/ModifierField.svelte";
  import type { ModifierCalc } from "../../types/modifier";

  export let modifier: ModifierCalc;
  export let stat: Stat;
</script>

<BaseContainerRound>
  <span class="sr-only">Stat Container for: {stat.name}</span>
  <TextNumberInput bind:value={stat.value} bind:min={stat.min} />
  <p class="my-0">{stat.name.substring(0, 3)}</p>
  <ModifierField
    class="my-0"
    value={modifier(stat)}
    modifierSource={stat.name}
  />
</BaseContainerRound>
